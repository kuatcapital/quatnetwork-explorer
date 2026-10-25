// Modified by Quat Capital, 2026-10-25: preserve contract selection across label/locale updates. GPL-3.0.
export interface SourceSelection {
  readonly selectedHash: string | undefined;
  readonly addressHash: string;
  readonly requestedHash: string | undefined;
}

interface SourceSelectionOptions {
  readonly availableHashes: ReadonlyArray<string>;
  readonly addressHash: string;
  readonly requestedHash: string | undefined;
}

export function resolveSourceSelection(previous: SourceSelection | undefined, options: SourceSelectionOptions): SourceSelection {
  const { availableHashes, addressHash, requestedHash } = options;
  const routeChanged = !previous || previous.addressHash !== addressHash || previous.requestedHash !== requestedHash;
  const preferredHash = routeChanged ? requestedHash : previous.selectedHash;
  const selectedHash = preferredHash && availableHashes.includes(preferredHash) ? preferredHash : availableHashes[0];

  if (previous && !routeChanged && previous.selectedHash === selectedHash) {
    return previous;
  }

  return { selectedHash, addressHash, requestedHash };
}
