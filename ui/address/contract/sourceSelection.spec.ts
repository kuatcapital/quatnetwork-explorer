// Modified by Quat Capital, 2026-10-25: contract-selection regression tests for language/route changes. GPL-3.0.
import { describe, expect, it } from 'vitest';

import type { SourceSelection } from './sourceSelection';
import { resolveSourceSelection } from './sourceSelection';

const ADDRESS = '0x1111111111111111111111111111111111111111';
const IMPLEMENTATION = '0x2222222222222222222222222222222222222222';
const OTHER_ADDRESS = '0x3333333333333333333333333333333333333333';

describe('contract source selection', () => {
  it('uses a valid implementation requested by the route on the first render', () => {
    expect(resolveSourceSelection(undefined, {
      availableHashes: [ ADDRESS, IMPLEMENTATION ], addressHash: ADDRESS, requestedHash: IMPLEMENTATION,
    }).selectedHash).toBe(IMPLEMENTATION);
  });

  it('keeps the selected hash and state identity when only localized names change', () => {
    const previous: SourceSelection = { selectedHash: IMPLEMENTATION, addressHash: ADDRESS, requestedHash: undefined };
    const russianItems = [ { hash: ADDRESS, name: 'Текущий контракт' }, { hash: IMPLEMENTATION, name: 'Implementation' } ];
    const kazakhItems = [ { hash: ADDRESS, name: 'Ағымдағы келісімшарт' }, { hash: IMPLEMENTATION, name: 'Implementation' } ];
    const fromRussian = resolveSourceSelection(previous, {
      availableHashes: russianItems.map(item => item.hash), addressHash: ADDRESS, requestedHash: undefined,
    });
    const fromKazakh = resolveSourceSelection(fromRussian, {
      availableHashes: kazakhItems.map(item => item.hash), addressHash: ADDRESS, requestedHash: undefined,
    });
    expect(fromKazakh).toBe(previous);
    expect(fromKazakh.selectedHash).toBe(IMPLEMENTATION);
  });

  it('falls back when the selected implementation disappears', () => {
    const previous: SourceSelection = { selectedHash: IMPLEMENTATION, addressHash: ADDRESS, requestedHash: undefined };
    expect(resolveSourceSelection(previous, {
      availableHashes: [ ADDRESS ], addressHash: ADDRESS, requestedHash: undefined,
    }).selectedHash).toBe(ADDRESS);
  });

  it('resets the choice when navigating to another address even if the old implementation is still available', () => {
    const previous: SourceSelection = { selectedHash: IMPLEMENTATION, addressHash: ADDRESS, requestedHash: undefined };
    expect(resolveSourceSelection(previous, {
      availableHashes: [ OTHER_ADDRESS, IMPLEMENTATION ], addressHash: OTHER_ADDRESS, requestedHash: undefined,
    }).selectedHash).toBe(OTHER_ADDRESS);
  });

  it('follows an explicit source-address query change and safely rejects unavailable hashes', () => {
    const previous: SourceSelection = { selectedHash: IMPLEMENTATION, addressHash: ADDRESS, requestedHash: undefined };
    expect(resolveSourceSelection(previous, {
      availableHashes: [ ADDRESS, IMPLEMENTATION ], addressHash: ADDRESS, requestedHash: ADDRESS,
    }).selectedHash).toBe(ADDRESS);
    expect(resolveSourceSelection(previous, {
      availableHashes: [ ADDRESS, IMPLEMENTATION ], addressHash: ADDRESS, requestedHash: OTHER_ADDRESS,
    }).selectedHash).toBe(ADDRESS);
  });
});
