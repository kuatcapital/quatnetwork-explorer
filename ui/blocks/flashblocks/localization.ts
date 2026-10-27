// Modified by Quat Capital, 2026-10-27: localize flashblock names without changing route/socket ids. GPL-3.0.
import type { TFunction } from 'i18next';

type FlashblockType = 'optimism' | 'megaEth';

const KEYS = {
  optimism: {
    name: 'flashblockUi.flash_name', title: 'flashblockUi.flash_title', hint: 'flashblockUi.flash_hint',
    rate: 'flashblockUi.flash_rate', time: 'flashblockUi.flash_time',
  },
  megaEth: {
    name: 'flashblockUi.mini_name', title: 'flashblockUi.mini_title', hint: 'flashblockUi.mini_hint',
    rate: 'flashblockUi.mini_rate', time: 'flashblockUi.mini_time',
  },
} as const;

export function getFlashblockText(type: FlashblockType | undefined, t: TFunction) {
  const keys = KEYS[type ?? 'optimism'];
  return { name: t(keys.name), title: t(keys.title), hint: t(keys.hint), rate: t(keys.rate), time: t(keys.time) };
}
