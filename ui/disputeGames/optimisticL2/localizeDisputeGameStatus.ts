// Modified by Quat Capital, 2026-10-27: translate known display statuses while preserving unknown API values. GPL-3.0.
import type { TFunction } from 'i18next';

export function localizeDisputeGameStatus(status: string, t: TFunction): string {
  switch (status) {
    case 'In progress': return t('l2Ui.game_in_progress');
    case 'Defender wins': return t('l2Ui.game_defender_wins');
    default: return status;
  }
}
