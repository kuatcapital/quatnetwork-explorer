// Modified by Quat Capital, 2026-10-27: optional localized TAC labels with stable protocol values. GPL-3.0.
import type { TFunction } from 'i18next';
import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { rightLineArrow } from 'toolkit/utils/htmlEntities';

export function getTacOperationStatus(type: tac.OperationType, t?: TFunction) {
  switch (type) {
    case tac.OperationType.TON_TAC_TON:
      return `TON ${ rightLineArrow } TAC ${ rightLineArrow } TON`;
    case tac.OperationType.TAC_TON:
      return `TAC ${ rightLineArrow } TON`;
    case tac.OperationType.TON_TAC:
      return `TON ${ rightLineArrow } TAC`;
    case tac.OperationType.ERROR:
      return t ? t('l2Ui.error') : 'Error';
    case tac.OperationType.ROLLBACK:
      return t ? t('l2Ui.rollback') : 'Rollback';
    case tac.OperationType.INSUFFICIENT_FEE:
      return t ? t('l2Ui.insufficient_fee') : 'Insufficient fee';
    case tac.OperationType.PENDING:
      return t ? t('l2Ui.pending') : 'Pending';
    default:
      return null;
  }
}

export function getTacOperationStage(data: tac.OperationDetails, txHash: string, t?: TFunction) {
  const currentStep = data.status_history.filter((step) => step.transactions.some((tx) => tx.hash.toLowerCase() === txHash.toLowerCase()));
  if (currentStep.length === 0) {
    return;
  }
  return currentStep.map((step) => getTacOperationStageLabel(step.type, t));
}

export function getTacOperationStageLabel(type: tac.OperationStage_StageType, t?: TFunction): string {
  if (!t) return STATUS_LABELS[type] ?? type;
  switch (type) {
    case tac.OperationStage_StageType.COLLECTED_IN_TAC: return t('l2Ui.stage_collected_tac');
    case tac.OperationStage_StageType.INCLUDED_IN_TAC_CONSENSUS: return t('l2Ui.stage_consensus_tac');
    case tac.OperationStage_StageType.EXECUTED_IN_TAC: return t('l2Ui.stage_executed_tac');
    case tac.OperationStage_StageType.COLLECTED_IN_TON: return t('l2Ui.stage_collected_ton');
    case tac.OperationStage_StageType.INCLUDED_IN_TON_CONSENSUS: return t('l2Ui.stage_consensus_ton');
    case tac.OperationStage_StageType.EXECUTED_IN_TON: return t('l2Ui.stage_executed_ton');
    case tac.OperationStage_StageType.UNRECOGNIZED: return t('l2Ui.stage_unknown');
    default: return type;
  }
}

export const STATUS_SEQUENCE: Array<tac.OperationStage_StageType> = [
  tac.OperationStage_StageType.COLLECTED_IN_TAC,
  tac.OperationStage_StageType.INCLUDED_IN_TAC_CONSENSUS,
  tac.OperationStage_StageType.EXECUTED_IN_TAC,
  tac.OperationStage_StageType.COLLECTED_IN_TON,
  tac.OperationStage_StageType.INCLUDED_IN_TON_CONSENSUS,
  tac.OperationStage_StageType.EXECUTED_IN_TON,
];

export const STATUS_LABELS: Record<tac.OperationStage_StageType, string> = {
  [tac.OperationStage_StageType.COLLECTED_IN_TAC]: 'Collected in TAC',
  [tac.OperationStage_StageType.INCLUDED_IN_TAC_CONSENSUS]: 'Included in TAC consensus',
  [tac.OperationStage_StageType.EXECUTED_IN_TAC]: 'Executed in TAC',
  [tac.OperationStage_StageType.COLLECTED_IN_TON]: 'Collected in TON',
  [tac.OperationStage_StageType.INCLUDED_IN_TON_CONSENSUS]: 'Included in TON consensus',
  [tac.OperationStage_StageType.EXECUTED_IN_TON]: 'Executed in TON',
  [tac.OperationStage_StageType.UNRECOGNIZED]: 'Unknown',
};

export const sortStatusHistory = (a: tac.OperationStage, b: tac.OperationStage) => {
  const aIndex = STATUS_SEQUENCE.indexOf(a.type);
  const bIndex = STATUS_SEQUENCE.indexOf(b.type);
  return aIndex - bIndex;
};
