// Modified by Quat Capital, 2026-10-25: CSS width must stay valid when the selected locale uses a comma. GPL-3.0.
import { describe, expect, it } from 'vitest';

import { formatUtilization } from './formatUtilization';

describe('utilization percentage display', () => {
  it('keeps a fractional ASCII CSS width in Russian and Kazakh', () => {
    for (const locale of [ 'ru', 'kk' ] as const) {
      expect(formatUtilization(0.125, locale)).toEqual({ width: '12.5%', label: '12,5%' });
    }
    expect(formatUtilization(0.125, 'en')).toEqual({ width: '12.5%', label: '12.5%' });
  });

  it('clamps invalid or out-of-range values before producing a CSS width', () => {
    expect(formatUtilization(-1, 'ru')).toEqual({ width: '0%', label: '0%' });
    expect(formatUtilization(2, 'ru')).toEqual({ width: '100%', label: '100%' });
    expect(formatUtilization(NaN, 'ru')).toEqual({ width: '0%', label: '0%' });
  });
});
