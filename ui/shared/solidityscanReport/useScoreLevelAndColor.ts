// Modified by Quat Capital, 2026-10-26: translated shared interface labels. GPL-3.0.
import { useTranslation } from 'react-i18next';
export default function useScoreLevelAndColor(score: number) {
  const { t } = useTranslation();
  const greatScoreColor = { _light: 'green.600', _dark: 'green.400' };
  const averageScoreColor = { _light: 'purple.600', _dark: 'purple.400' };
  const lowScoreColor = { _light: 'red.600', _dark: 'red.400' };

  let scoreColor;
  let scoreLevel;
  if (score >= 80) {
    scoreColor = greatScoreColor;
    scoreLevel = t('editorShared.great');
  } else if (score >= 30) {
    scoreColor = averageScoreColor;
    scoreLevel = t('editorShared.average');
  } else {
    scoreColor = lowScoreColor;
    scoreLevel = t('editorShared.low');
  }
  return { scoreColor, scoreLevel };
}
