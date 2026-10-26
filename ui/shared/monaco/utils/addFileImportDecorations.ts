// Modified by Quat Capital, 2026-10-26: translated import hints with tracked decoration ids. GPL-3.0.
import type { TFunction } from 'i18next';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default function addFileImportDecorations(model: monaco.editor.ITextModel, t: TFunction): Array<string> {
  const options: monaco.editor.IModelDecorationOptions = {
    inlineClassName: 'import-link',
    hoverMessage: {
      value: t('editorShared.import_hover'), isTrusted: false, supportHtml: false,
    },
  };

  const regularImportMatches = model.findMatches('^import (\'|")(.+)(\'|")', false, true, false, null, true);
  const regularImportDecorations: Array<monaco.editor.IModelDeltaDecoration> = regularImportMatches.map(({ range }) => ({
    range: {
      ...range,
      startColumn: range.startColumn + 8,
      endColumn: range.endColumn - 1,
    },
    options,
  }));

  const namedImportMatches = model.findMatches('(^import \\{.+\\} from )(\'|")(.+)(\'|")', false, true, false, null, true);
  const namedImportDecorations: Array<monaco.editor.IModelDeltaDecoration> = namedImportMatches.map(({ range, matches }) => ({
    range: {
      ...range,
      startColumn: range.startColumn + (Array.isArray(matches) ? matches?.[1]?.length + 1 : 0),
      endColumn: range.endColumn - 1,
    },
    options,
  }));

  // TODO: add support for "import * as" - https://docs.soliditylang.org/en/latest/grammar.html#a4.SolidityParser.importDirective
  // but we need a live example first to test it

  return model.deltaDecorations([], regularImportDecorations.concat(namedImportDecorations));
}
