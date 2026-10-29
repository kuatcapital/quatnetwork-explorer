// @vitest-environment jsdom
// Modified by Quat Capital, 2026-10-29: real Ark/Chakra SSR accessibility and caller-override regressions. GPL-3.0.
import type * as ChakraReact from '@chakra-ui/react';
import { ChakraProvider, defaultSystem, createListCollection } from '@chakra-ui/react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';

import type { Locale } from 'configs/app/i18n';
import type { Dictionary } from 'lib/i18n/config';
import { createI18n, parseDictionary } from 'lib/i18n/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getProgressTranslations } from './accessibilityTranslations';
import { PinInput } from './pin-input';
import { PopoverCloseTrigger, PopoverCloseTriggerWrapper, PopoverRoot } from './popover';
import { Progress } from './progress';
import { ProgressCircleRoot, ProgressCircleRing } from './progress-circle';
import { Rating } from './rating';
import { SelectClearTrigger, SelectControl, SelectRoot, SelectValueText } from './select';
import { Toaster, toaster } from './toaster';

const state = vi.hoisted(() => ({ locale: 'ru' as Locale }));
vi.mock('lib/i18n/provider', () => ({ useLocale: () => ({ locale: state.locale }) }));
// Only portals and SVG assets are adapted for server rendering; component machines and props are real.
vi.mock('@chakra-ui/react', async(importOriginal) => {
  const chakra = await importOriginal<typeof ChakraReact>();
  const passthroughPortal = ({ children }: { children: React.ReactNode }) => children;
  return { ...chakra, Portal: passthroughPortal };
});
vi.mock('icons/close.svg', () => ({ 'default': () => <svg/> }));
vi.mock('icons/check.svg', () => ({ 'default': () => <svg/> }));
vi.mock('icons/arrows/east-mini.svg', () => ({ 'default': () => <svg/> }));
vi.mock('icons/star_filled.svg', () => ({ 'default': () => <svg/> }));
vi.mock('icons/star_outline.svg', () => ({ 'default': () => <svg/> }));

const resources = Object.fromEntries([ 'en', 'ru', 'kk' ].map(locale => [ locale,
  parseDictionary(readFileSync(path.join(process.cwd(), `locales/${ locale }.json`), 'utf8')),
])) as Record<Locale, Dictionary>;

function render(content: React.ReactNode, locale: Locale) {
  state.locale = locale;
  const instance = createI18n({ locale, resources, error: false });
  return renderToStaticMarkup(
    <ChakraProvider value={ defaultSystem }><I18nextProvider i18n={ instance }>{ content }</I18nextProvider></ChakraProvider>,
  );
}

function elements(markup: string, tag: string, scope: string, part: string) {
  return Array.from(markup.matchAll(new RegExp(`<${ tag }\\b[^>]*>`, 'g')), match => match[0])
    .filter(element => element.includes(`data-scope="${ scope }"`) && element.includes(`data-part="${ part }"`));
}

function aria(element: string) {
  return /aria-label="([^"]*)"/.exec(element)?.[1];
}

afterEach(() => toaster.remove());

describe('installed Ark accessibility integration', () => {
  it('localizes PIN input positions and keeps controlled digits in both interface locales', () => {
    for (const locale of [ 'ru', 'kk' ] as const) {
      const markup = render(<PinInput count={ 3 } value={ [ '1', '2', '3' ] }/>, locale);
      const inputs = elements(markup, 'input', 'pin-input', 'input');
      expect(inputs).toHaveLength(3);
      expect(inputs.map(aria)).toEqual(locale === 'ru' ? [
        'Символ PIN-кода 1 из 3', 'Символ PIN-кода 2 из 3', 'Символ PIN-кода 3 из 3',
      ] : [ 'PIN-код таңбасы 1, барлығы 3', 'PIN-код таңбасы 2, барлығы 3', 'PIN-код таңбасы 3, барлығы 3' ]);
      inputs.forEach((input, index) => expect(input).toContain(`value="${ index + 1 }"`));
    }
  });

  it('keeps a caller PIN-label override after the surrounding language changes', () => {
    const translations = { inputLabel: (index: number) => `Custom ${ index + 1 }` };
    for (const locale of [ 'ru', 'kk' ] as const) {
      const inputs = elements(render(<PinInput count={ 2 } translations={ translations }/>, locale), 'input', 'pin-input', 'input');
      expect(inputs.map(aria)).toEqual([ 'Custom 1', 'Custom 2' ]);
    }
  });

  it('uses Russian rating plurals and Kazakh labels without replacing the selected value', () => {
    for (const locale of [ 'ru', 'kk' ] as const) {
      const markup = render(<Rating count={ 5 } defaultValue={ 2 }/>, locale);
      const items = elements(markup, 'span', 'rating-group', 'item');
      expect(items.map(aria)).toEqual(locale === 'ru' ? [
        '1 звезда', '2 звезды', '3 звезды', '4 звезды', '5 звёзд',
      ] : [ '1 жұлдыз', '2 жұлдыз', '3 жұлдыз', '4 жұлдыз', '5 жұлдыз' ]);
      expect(markup).toContain('name="rating"');
      expect(markup).toContain('value="2"');
      const overridden = render(<Rating count={ 2 } translations={{ ratingValueText: value => `Score ${ value }` }}/>, locale);
      expect(elements(overridden, 'span', 'rating-group', 'item').map(aria)).toEqual([ 'Score 1', 'Score 2' ]);
    }
  });

  it('localizes loading progress and keeps custom formatters, translations and locale overrides', () => {
    for (const locale of [ 'ru', 'kk' ] as const) {
      const loading = render(<><Progress value={ null }/><ProgressCircleRoot value={ null }><ProgressCircleRing/></ProgressCircleRoot></>, locale);
      expect(elements(loading, 'div', 'progress', 'track').map(aria)).toEqual([ locale === 'ru' ? 'загрузка...' : 'жүктелуде...' ]);
      expect(elements(loading, 'svg', 'progress', 'circle').map(aria)).toEqual([ locale === 'ru' ? 'загрузка...' : 'жүктелуде...' ]);
      const custom = render(
        <Progress value={ 12.5 } locale="en-US" formatOptions={{ maximumFractionDigits: 1 }}
          translations={{ value: ({ formatter, percent }) => formatter.format(percent / 100) }}/>, locale,
      );
      expect(elements(custom, 'div', 'progress', 'track').map(aria)).toEqual([ '12.5%' ]);
      const own = render(<Progress value={ 12.5 }/>, locale);
      expect(elements(own, 'div', 'progress', 'track').map(aria)).toEqual([
        new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'kk-KZ', { style: 'percent' }).format(0.125),
      ]);
    }
  });

  it('localizes Select summaries and clear aria without changing selected machine values', () => {
    const collection = createListCollection({ items: [ { label: 'React', value: 'react' }, { label: 'Vue', value: 'vue' } ] });
    for (const locale of [ 'ru', 'kk' ] as const) {
      const markup = render(
        <SelectRoot collection={ collection } multiple value={ [ 'react', 'vue' ] }>
          <SelectControl><SelectValueText placeholder="Choose"/></SelectControl><SelectClearTrigger/>
        </SelectRoot>, locale,
      );
      expect(markup).toContain(locale === 'ru' ? 'Выбрано: 2' : 'Таңдалды: 2');
      expect(markup).toContain('value="react" selected=""');
      expect(markup).toContain('value="vue" selected=""');
      expect(elements(markup, 'button', 'select', 'clear-trigger').map(aria)).toEqual([ locale === 'ru' ? 'Очистить значение' : 'Мәнді тазарту' ]);
      const overridden = render(
        <SelectRoot collection={ collection } value={ [ 'react' ] }><SelectClearTrigger aria-label="Custom clear"/></SelectRoot>, locale,
      );
      expect(elements(overridden, 'button', 'select', 'clear-trigger').map(aria)).toEqual([ 'Custom clear' ]);
    }
  });

  it('replaces the injected Popover close label and preserves caller aria labels', () => {
    for (const locale of [ 'ru', 'kk' ] as const) {
      const markup = render(
        <PopoverRoot open><PopoverCloseTrigger/><PopoverCloseTriggerWrapper><button>Action</button></PopoverCloseTriggerWrapper></PopoverRoot>, locale,
      );
      const label = locale === 'ru' ? 'Закрыть' : 'Жабу';
      expect(elements(markup, 'button', 'popover', 'close-trigger').map(aria)).toEqual([ label, label ]);
      const custom = render(<PopoverRoot open><PopoverCloseTrigger aria-label="Custom close"/></PopoverRoot>, locale);
      expect(elements(custom, 'button', 'popover', 'close-trigger').map(aria)).toEqual([ 'Custom close' ]);
    }
  });

  it('updates mounted RU/KK labels without resetting edited input, rating, selection or focus', async() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    // jsdom lacks CSS.escape; the fixed test IDs only need punctuation escaping here.
    vi.stubGlobal('CSS', { escape: (value: string) => value.replace(/[^\w\u0080-\uFFFF-]/g, character => `\\${ character }`) });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const collection = createListCollection({ items: [ { label: 'React', value: 'react' }, { label: 'Vue', value: 'vue' } ] });
    try {
      state.locale = 'ru';
      await act(async() => {
        root.render(
          <ChakraProvider value={ defaultSystem }>
            <I18nextProvider i18n={ instance }>
              <PinInput count={ 3 } defaultValue={ [ '1', '2', '3' ] } ids={{ root: 'runtime-pin' }}/>
              <Rating count={ 5 } defaultValue={ 2 }/>
              <SelectRoot collection={ collection } multiple defaultValue={ [ 'react', 'vue' ] }>
                <SelectControl><SelectValueText placeholder="Choose"/></SelectControl><SelectClearTrigger/>
              </SelectRoot>
              <Progress value={ null }/>
            </I18nextProvider>
          </ChakraProvider>,
        );
      });
      const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('[data-scope="pin-input"][data-part="input"]'));
      const pinValue = container.querySelector<HTMLInputElement>('input[aria-hidden="true"]');
      const ratingItems = container.querySelectorAll<HTMLElement>('[data-scope="rating-group"][data-part="item"]');
      const ratingInput = container.querySelector<HTMLInputElement>('input[name="rating"]');
      const clear = container.querySelector<HTMLButtonElement>('[data-scope="select"][data-part="clear-trigger"]');
      const select = container.querySelector<HTMLSelectElement>('select');
      await act(async() => inputs[0].focus());
      await act(async() => {
        // Bypass React's value tracker, as a real user input event does.
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(inputs[0], '9');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      });
      await act(async() => ratingItems[3].click());
      await act(async() => clear?.click());
      // Select returns focus to its trigger on animation frames after clearing.
      await act(async() => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      });
      await act(async() => inputs[1].focus());
      expect(document.activeElement).toBe(inputs[1]);
      expect(inputs.map(input => input.value)).toEqual([ '9', '2', '3' ]);
      expect(pinValue?.value).toBe('923');
      expect(ratingInput?.value).toBe('4');
      expect(Array.from(select?.selectedOptions ?? [])).toHaveLength(0);

      for (const locale of [ 'kk', 'ru' ] as const) {
        state.locale = locale;
        await act(async() => {
          await instance.changeLanguage(locale);
        });
        expect(container.querySelector('[data-scope="pin-input"][data-part="input"]')).toBe(inputs[0]);
        expect(inputs.map(input => input.value)).toEqual([ '9', '2', '3' ]);
        expect(pinValue?.value).toBe('923');
        expect(document.activeElement).toBe(inputs[1]);
        expect(inputs[0].getAttribute('aria-label')).toBe(locale === 'ru' ? 'Символ PIN-кода 1 из 3' : 'PIN-код таңбасы 1, барлығы 3');
        expect(ratingInput?.value).toBe('4');
        expect(ratingItems[3].getAttribute('aria-label')).toBe(locale === 'ru' ? '4 звезды' : '4 жұлдыз');
        expect(Array.from(select?.selectedOptions ?? [])).toHaveLength(0);
        expect(clear?.getAttribute('aria-label')).toBe(locale === 'ru' ? 'Очистить значение' : 'Мәнді тазарту');
        expect(container.querySelector('[data-scope="progress"][data-part="track"]')?.getAttribute('aria-label'))
          .toBe(locale === 'ru' ? 'загрузка...' : 'жүктелуде...');
      }
    } finally {
      await act(async() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      });
      await act(async() => root.unmount());
      container.remove();
      vi.unstubAllGlobals();
    }
  });

  it('localizes the real toast region and dismissal control while keeping the shortcut and position', async() => {
    // Ark subscribes to the toast store in an effect: the region supports SSR, while visible toasts need a mounted client.
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    const hotkey = [ ...toaster.attrs.hotkey ];
    const placement = toaster.attrs.placement;
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const instance = createI18n({ locale: 'ru', resources, error: false });
    try {
      state.locale = 'ru';
      await act(async() => {
        root.render(<ChakraProvider value={ defaultSystem }><I18nextProvider i18n={ instance }><Toaster/></I18nextProvider></ChakraProvider>);
      });
      await act(async() => {
        toaster.create({ id: 'aria-test-toast', title: 'Caller title', duration: Infinity });
      });
      for (const locale of [ 'ru', 'kk' ] as const) {
        state.locale = locale;
        await act(async() => {
          await instance.changeLanguage(locale);
        });
        const group = container.querySelector('[data-scope="toast"][data-part="group"]');
        expect(group?.getAttribute('aria-label')).toBe(
          locale === 'ru' ? 'Уведомления сверху справа. alt+T' : 'Хабарландырулар жоғарғы оң жақта. alt+T',
        );
        const close = container.querySelector('[data-scope="toast"][data-part="close-trigger"]');
        expect(close?.getAttribute('aria-label')).toBe(locale === 'ru' ? 'Закрыть уведомление' : 'Хабарландыруды жабу');
        expect(container.textContent).toContain('Caller title');
        expect(group?.getAttribute('data-placement')).toBe('top-end');
      }
    } finally {
      await act(async() => root.unmount());
      container.remove();
      vi.unstubAllGlobals();
    }
    expect(toaster.attrs.hotkey).toEqual(hotkey);
    expect(toaster.attrs.placement).toBe(placement);
  });

  it('preserves raw values for decimal formatting and ratios for percent formatting', () => {
    const instance = createI18n({ locale: 'ru', resources, error: false });
    const format = getProgressTranslations(instance.t).value;
    expect(format({ value: 125, percent: 25, formatter: new Intl.NumberFormat('ru-RU', { style: 'decimal' }) })).toBe('125');
    expect(format({ value: 125, percent: 25, formatter: new Intl.NumberFormat('ru-RU', { style: 'percent' }) })).toBe('25\u00a0%');
  });
});
