// Modified by Quat Capital, 2026-11-02: local RU/KK browser acceptance with deterministic API fixtures.
// Modified by Quat Capital, 2026-11-11: preserve each run and compare locale formatting inside the browser. GPL-3.0.
// Licensed under GNU GPL v3.0; see LICENSE.
/* eslint-disable no-console */
import { expect } from '@playwright/test';
import { build } from 'esbuild';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const runId = new Date().toISOString().replaceAll(':', '-');
const artifacts = path.join(root, 'tools/i18n/basic-flow.tmp.artifacts', runId);
const appPort = 3218;
const apiPort = 3219;
const origin = `http://127.0.0.1:${ appPort }`;
const runtimeOnly = process.argv.includes('--runtime-only');
await fs.mkdir(artifacts, { recursive: true });
// Never let Next load an operator's environment file during this isolated test.
for (const name of [ '.env', '.env.local', '.env.development', '.env.development.local' ]) {
  const exists = await fs.stat(path.join(root, name)).then(() => true, () => false);
  assert.equal(exists, false, `Use a clean checkout: ${ name } exists`);
}
const bundle = await build({
  absWorkingDir: root,
  stdin: { contents: `
    export * as tx from './mocks/txs/tx';
    export * as address from './mocks/address/address';
    export * as token from './mocks/tokens/tokenInfo';
    export * as transfer from './mocks/tokens/tokenTransfer';
    export * as block from './mocks/blocks/block';
    export * as stats from './mocks/stats';
    export * as search from './mocks/search';
  `, resolveDir: root, loader: 'ts' },
  bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent',
});
const mocks = await import(`data:text/javascript;base64,${ Buffer.from(bundle.outputFiles[0].text).toString('base64') }`);
const cleanAddress = (hash) => ({ ...mocks.address.withoutName, hash });
const token = { ...mocks.token.tokenInfo, name: 'Quat Test Tenge', symbol: 'KZTT', icon_url: null, exchange_rate: null };
const from = cleanAddress(mocks.tx.base.from.hash);
const to = cleanAddress(mocks.address.hash);
const tx = { ...mocks.tx.base, from, to, decoded_input: null, raw_input: '0x', method: null,
  transaction_types: [ 'coin_transfer' ], value: '12500000000000000000', token_transfers: [],
  token_transfers_overflow: false, actions: [], has_error_in_internal_transactions: false };
const pending = { ...tx, ...mocks.tx.pending, from, to, hash: `0x${ '2'.repeat(64) }`, value: tx.value };
const failed = { ...tx, hash: `0x${ '3'.repeat(64) }`, status: 'error', result: 'out of gas' };
const transfer = { ...mocks.transfer.erc20, from, to, token, transaction_hash: `0x${ '4'.repeat(64) }`,
  total: { decimals: '18', value: '42500000000000000000000' } };
const tokenTx = { ...tx, hash: transfer.transaction_hash, value: '0', method: 'transfer',
  transaction_types: [ 'token_transfer' ], token_transfers: [ transfer ] };
const txs = [ tx, tokenTx, failed ];
const block = { ...mocks.block.base, height: tx.block_number, transactions_count: 3 };
const pageOf = (items, next = null) => ({ items, next_page_params: next });
const dictionaries = Object.fromEntries(await Promise.all([ 'ru', 'kk', 'en' ].map(async(locale) =>
  [ locale, JSON.parse(await fs.readFile(path.join(root, `locales/${ locale }.json`), 'utf8')) ])));
const controls = { list: 'normal', dictionary: 'normal' };
const requests = [];
function fixture(url) {
  const pathname = url.pathname;
  const parts = pathname.split('/').filter(Boolean);
  const section = parts[2];
  const id = parts[3];
  const child = parts[4];
  const paginated = url.searchParams.has('block_number');
  if (pathname === '/api/v2/stats') return mocks.stats.base;
  if (pathname.includes('/charts/')) return { chart_data: [] };
  if (pathname.endsWith('/indexing-status')) return {
    finished_indexing: true, finished_indexing_blocks: true, indexed_blocks_ratio: '1', indexed_internal_transactions_ratio: '1',
  };
  if (pathname === '/api/v2/main-page/transactions') return txs;
  if (pathname === '/api/v2/main-page/blocks') return [ block ];
  if (section === 'search') {
    const query = url.searchParams.get('q')?.toLowerCase();
    let found = null;
    if (query === tx.hash.toLowerCase()) found = { ...mocks.search.tx1, tx_hash: tx.hash, url: `/tx/${ tx.hash }` };
    if (query === to.hash.toLowerCase()) found = { ...mocks.search.address1, address_hash: to.hash, url: `/address/${ to.hash }` };
    if (id === 'check-redirect') return found ? { redirect: true, type: found.type, parameter: found.tx_hash || found.address_hash } : { redirect: false };
    const items = found ? [ found ] : [];
    return id === 'quick' ? items : pageOf(items);
  }
  if (section === 'transactions') {
    if (!id) {
      let items = paginated ? [ tokenTx ] : txs;
      if (url.searchParams.get('filter') === 'pending') items = [ pending ];
      if (controls.list === 'empty') items = [];
      return pageOf(items, !paginated && controls.list === 'normal' ? { block_number: block.height, index: 1, items_count: 3 } : null);
    }
    if (id === 'stats') return { transactions_count_24h: '3', pending_transactions_count: '1', transaction_fees_sum_24h: '0', transaction_fees_avg_24h: '0' };
    if (child === 'token-transfers') return pageOf(id === tokenTx.hash ? [ transfer ] : []);
    if (child) return pageOf([]);
    return [ ...txs, pending ].find(item => item.hash === id) || null;
  }
  if (section === 'addresses') {
    if (child === 'transactions') return pageOf(txs);
    if (child === 'token-transfers') return pageOf([ transfer ]);
    if (child === 'tokens') return pageOf([ { token, value: '42500000000000000000000', token_id: null, token_instance: null } ]);
    if (child === 'token-balances') return [ { token, value: '42500000000000000000000' } ];
    if (child === 'counters') return { transactions_count: '3', token_transfers_count: '1', gas_usage_count: '21000', validations_count: '0' };
    if (child === 'tabs-counters') return {
      transactions_count: 3, token_transfers_count: 1, tokens_count: 1, internal_transactions_count: 0, logs_count: 0, validations_count: 0,
    };
    if (child) return pageOf([]);
    return { ...mocks.address.eoa, ...cleanAddress(id), coin_balance: '12500000000000000000', exchange_rate: null,
      has_tokens: true, has_token_transfers: true, has_validated_blocks: false, has_logs: false, has_beacon_chain_withdrawals: false };
  }
  if (section === 'tokens') {
    if (!id) return pageOf([ token ]);
    if (child === 'counters') return { token_holders_count: '2', transfers_count: '1' };
    if (child === 'transfers') return pageOf([ transfer ]);
    if (child) return pageOf([]);
    return token;
  }
  if (section === 'blocks') {
    if (!id) return pageOf([ block ]);
    return child ? pageOf(txs) : block;
  }
  if (pathname.includes('/config')) return {};
  return pageOf([]);
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${ apiPort }`);
  requests.push(url.pathname + url.search);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') {
    res.end(); return;
  }
  const locale = /^\/i18n\/(ru|kk|en)\.json$/.exec(url.pathname)?.[1];
  if (locale) {
    if (controls.dictionary === 'unavailable' && locale === 'kk') {
      res.statusCode = 503; res.end('{}'); return;
    }
    if (controls.dictionary === 'malformed' && locale === 'kk') {
      res.end('{broken'); return;
    }
    res.end(JSON.stringify(dictionaries[locale])); return;
  }
  if (controls.list === 'error' && url.pathname === '/api/v2/transactions') {
    res.statusCode = 503; res.end(JSON.stringify({ message: 'fixture failure' })); return;
  }
  const body = fixture(url);
  if (body === null) res.statusCode = 404;
  res.end(JSON.stringify(body ?? { message: 'Not found' }));
});
await new Promise((resolve, reject) => {
  server.once('error', reject); server.listen(apiPort, '127.0.0.1', resolve);
});
const publicEnv = {
  NEXT_PUBLIC_APP_HOST: '127.0.0.1', NEXT_PUBLIC_APP_PORT: String(appPort), NEXT_PUBLIC_APP_PROTOCOL: 'http',
  NEXT_PUBLIC_APP_ENV: 'development', NEXT_PUBLIC_API_HOST: '127.0.0.1', NEXT_PUBLIC_API_PORT: String(apiPort),
  NEXT_PUBLIC_API_PROTOCOL: 'http', NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: 'ws', NEXT_PUBLIC_API_BASE_PATH: '/',
  NEXT_PUBLIC_NETWORK_ID: '77477', NEXT_PUBLIC_NETWORK_NAME: 'Quat Network Testnet', NEXT_PUBLIC_NETWORK_SHORT_NAME: 'Quat',
  NEXT_PUBLIC_NETWORK_CURRENCY_NAME: 'eAltyn', NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL: 'eAltyn', NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS: '18',
  NEXT_PUBLIC_NETWORK_RPC_URL: `http://127.0.0.1:${ apiPort }/rpc`, NEXT_PUBLIC_IS_TESTNET: 'true',
  NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'false', NEXT_PUBLIC_MARKETPLACE_ENABLED: 'false',
  NEXT_PUBLIC_AD_BANNER_PROVIDER: 'none', NEXT_PUBLIC_AD_TEXT_PROVIDER: 'none', NEXT_PUBLIC_DEFAULT_LOCALE: 'ru',
};
// Inherit only OS essentials, never an operator's runtime variables or secrets.
// eslint-disable-next-line no-restricted-properties
const env = Object.fromEntries(Object.entries(process.env).filter(([ name ]) =>
  /^(?:PATH|SystemRoot|WINDIR|COMSPEC|TEMP|TMP|LOCALAPPDATA|APPDATA|USERPROFILE|ProgramFiles|ProgramFiles\(x86\)|PATHEXT)$/i.test(name)));
Object.assign(env, publicEnv, { NEXT_TELEMETRY_DISABLED: '1', DISABLE_TRACKING: 'true', NODE_OPTIONS: '--max-old-space-size=8192',
  QUAT_I18N_SERVER_BASE_URL: `http://127.0.0.1:${ apiPort }/i18n` });
const child = spawn(process.execPath, [ path.join(root, 'node_modules/next/dist/bin/next'), 'dev', '--hostname', '127.0.0.1', '--port', String(appPort) ],
  { cwd: root, env, windowsHide: true, stdio: [ 'ignore', 'pipe', 'pipe' ] });
let output = '';
for (const stream of [ child.stdout, child.stderr ]) stream.on('data', chunk => {
  output += chunk.toString();
  if (/Ready in|Compiled|Error:|error |Failed to compile/.test(chunk.toString())) console.log(chunk.toString().trim());
});
let browser;
let page;
const results = [];
let completed = false;
try {
  for (let attempt = 0; attempt < 180 && !output.includes('Ready in'); attempt++) {
    assert.equal(child.exitCode, null, output.slice(-4000));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(output.includes('Ready in'), 'Next dev did not start');
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: [ 'clipboard-read', 'clipboard-write' ] });
  await context.route('**/*', async(route) => {
    const url = new URL(route.request().url());
    if (url.pathname === '/assets/envs.js') return route.fulfill({
      contentType: 'application/javascript', body: `window.__envs=${ JSON.stringify(publicEnv) };`,
    });
    const locale = /\/(?:assets\/i18n\/(ru|kk|en)\.json|api\/i18n\/(ru|kk|en))$/.exec(url.pathname);
    if (locale) {
      const response = await fetch(`http://127.0.0.1:${ apiPort }/i18n/${ locale[1] || locale[2] }.json`);
      return route.fulfill({ status: response.status, contentType: 'application/json', body: await response.text() });
    }
    if (![ '127.0.0.1', 'localhost' ].includes(url.hostname)) return route.abort();
    return route.continue();
  });
  page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message); console.log('BROWSER ERROR:', error.message);
  });
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(240000);
  const visible = async(text) => expect(page.getByText(text, { exact: true }).first()).toBeVisible({ timeout: 60000 });
  const chooseLanguage = async(locale) => {
    const current = await page.locator('html').getAttribute('lang');
    await page.getByRole('button', { name: dictionaries[current].common.language, exact: true }).click();
    await page.getByRole('menuitemradio', { name: locale === 'kk' ? 'KZ' : 'RU', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale, { timeout: 20000 });
  };
  const screenshot = async(name) => {
    await page.screenshot({ path: path.join(artifacts, `${ name }.png`), fullPage: true });
    await fs.writeFile(path.join(artifacts, `${ name }.txt`), await page.locator('body').innerText());
    results.push({ scenario: name, passed: true });
    console.log('PASS', name);
  };
  console.log('Opening actual Next application with loopback fixtures');
  for (const device of runtimeOnly ? [] : [ 'desktop', 'mobile' ]) {
    await page.setViewportSize(device === 'desktop' ? { width: 1280, height: 900 } : { width: 390, height: 844 });
    for (const locale of [ 'ru', 'kk' ]) {
      const d = dictionaries[locale];
      const label = `${ locale }-${ device }`;
      await page.goto(origin, { waitUntil: 'domcontentloaded' });
      await chooseLanguage(locale);
      await page.getByRole('heading', { level: 1 }).waitFor();
      await screenshot(`home-${ label }`);
      // The home mobile search uses a labelled overlay over the read-only hero input.
      if (device === 'mobile') await page.locator(`div[aria-label="${ d.common.search }"]`).click();
      const input = (device === 'mobile' ? page.getByRole('dialog') : page).getByRole('textbox', { name: d.common.search, exact: true });
      await input.fill(tx.hash);
      await input.press('Enter');
      await expect(page).toHaveURL(`${ origin }/tx/${ tx.hash }`, { timeout: 180000 });
      await visible(d.common.success);
      for (const key of [ 'from', 'to', 'transaction_hash' ]) await visible(d.common[key]);
      assert.match(await page.locator('body').innerText(), /12[.,]5/u);
      let copiedHash = false;
      for (const button of await page.getByRole('button', { name: d.common.copy, exact: true }).all()) {
        if (!await button.isVisible()) continue;
        await button.click();
        if (await page.evaluate(() => navigator.clipboard.readText()) === tx.hash) {
          copiedHash = true; break;
        }
      }
      assert.ok(copiedHash, 'Transaction hash must copy without truncation or localization');
      await screenshot(`transaction-${ label }`);
      await page.getByRole('link').filter({ hasText: to.hash.slice(0, 4) }).first().click();
      await expect(page).toHaveURL(new RegExp(`/address/${ to.hash }`, 'i'), { timeout: 180000 });
      await visible(d.common.balance);
      await screenshot(`address-${ label }`);
      await page.goto(`${ origin }/token/${ token.address_hash }`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('Quat Test Tenge', { exact: false }).first()).toBeVisible({ timeout: 60000 });
      await screenshot(`token-${ label }`);
      await page.goto(`${ origin }/block/${ block.height }`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { level: 1 }).waitFor();
      // Chrome and Node can ship different CLDR data; use the rendering browser's Intl.
      const formattedHeight = await page.evaluate(({ height, locale }) =>
        new Intl.NumberFormat(locale === 'kk' ? 'kk-KZ' : 'ru-RU').format(height), { height: block.height, locale });
      await visible(formattedHeight);
      await screenshot(`block-${ label }`);
      await page.goto(`${ origin }/txs`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: d.search.next_page, exact: true }).first().click();
      await expect(page).toHaveURL(/page=2/, { timeout: 30000 });
      await expect(page.getByRole('button', { name: d.search.next_page, exact: true }).first()).toBeDisabled({ timeout: 30000 });
      await screenshot(`pagination-${ label }`);
      for (const item of [ { data: pending, text: d.common.pending }, { data: failed, text: d.common.failed } ]) {
        await page.goto(`${ origin }/tx/${ item.data.hash }`, { waitUntil: 'domcontentloaded' });
        await visible(item.text);
      }
      await screenshot(`statuses-${ label }`);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      assert.equal(await page.evaluate(() => localStorage.getItem('quat_locale')), locale);
      await page.goto(`${ origin }/search-results?q=quat-no-such-transaction`, { waitUntil: 'domcontentloaded' });
      await visible('quat-no-such-transaction');
      await screenshot(`empty-search-${ label }`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${ origin }/address/${ to.hash }`, { waitUntil: 'domcontentloaded' });
  await chooseLanguage('kk');
  const originalBalance = dictionaries.kk.common.balance;
  dictionaries.kk.common.balance = `${ originalBalance } (тексеру)`;
  await page.reload({ waitUntil: 'domcontentloaded' });
  await visible(dictionaries.kk.common.balance);
  await screenshot('runtime-json-update-without-rebuild');
  dictionaries.kk.common.balance = originalBalance;
  await page.reload({ waitUntil: 'domcontentloaded' });
  await visible(originalBalance);
  for (const failure of [ 'unavailable', 'malformed' ]) {
    controls.dictionary = failure;
    await chooseLanguage('ru');
    await chooseLanguage('kk');
    await visible(originalBalance);
    await expect(page.getByRole('button', { name: dictionaries.kk.common.language, exact: true }))
      .toHaveAttribute('title', dictionaries.kk.common.language_error);
    await screenshot(`runtime-json-${ failure }-retains-cached-kk`);
    controls.dictionary = 'normal';
    await chooseLanguage('ru');
    await chooseLanguage('kk');
  }
  for (const locale of [ 'ru', 'kk' ]) {
    await chooseLanguage(locale);
    controls.list = 'empty';
    await page.goto(`${ origin }/txs`, { waitUntil: 'domcontentloaded' });
    await visible(dictionaries[locale].transactions.no_transactions);
    await screenshot(`empty-transactions-${ locale }`);
    controls.list = 'error';
    await page.reload({ waitUntil: 'domcontentloaded' });
    await visible(dictionaries[locale].sharedUi.fetch_error);
    await screenshot(`api-error-${ locale }`);
    controls.list = 'normal';
  }
  assert.deepEqual(errors, [], 'Browser must not report uncaught errors');
  completed = true;
  console.log(JSON.stringify({ results, errors, requests: [ ...new Set(requests) ] }));
} catch (error) {
  if (page && !page.isClosed()) {
    await fs.writeFile(path.join(artifacts, 'failure.txt'), await page.locator('body').innerText().catch(() => 'Page unavailable'));
    await page.screenshot({ path: path.join(artifacts, 'failure.png'), fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  await browser?.close();
  child.kill();
  server.closeAllConnections();
  server.close();
  await fs.writeFile(path.join(artifacts, 'next.log'), output);
  await fs.writeFile(path.join(artifacts, runtimeOnly ? 'runtime-results.json' : 'results.json'), JSON.stringify(results, null, 2));
  await fs.writeFile(path.join(artifacts, 'summary.json'), JSON.stringify({ runId, completed, runtimeOnly, passedScenarios: results.length }, null, 2));
  console.log('Artifacts:', artifacts);
}
