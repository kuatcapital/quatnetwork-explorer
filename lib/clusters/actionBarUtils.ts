// Modified by Quat Capital, 2026-10-29: runtime cluster-search display text; query/view values unchanged. GPL-3.0.
import type { TFunction } from 'i18next';

export function shouldShowClearButton(searchValue: string): boolean {
  return searchValue.length > 0;
}

export function shouldDisableViewToggle(isLoading: boolean): boolean {
  return isLoading;
}

export function getSearchPlaceholder(t?: TFunction): string {
  return t ? t('coreLabels8.cluster_search') : 'Search clusters by name or EVM address';
}

export function shouldShowActionBar(paginationVisible: boolean, isDesktop: boolean): boolean {
  return isDesktop || paginationVisible;
}
