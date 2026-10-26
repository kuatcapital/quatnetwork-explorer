// Modified by Quat Capital, 2026-10-26: translated library warnings with tracked decoration ids. GPL-3.0.
import type { TFunction } from 'i18next';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import type { SmartContractExternalLibrary } from 'types/api/contract';

import sortByEndLineNumberAsc from './sortByEndLineNumberAsc';

export default function addExternalLibraryWarningDecoration(
  model: monaco.editor.ITextModel, libraries: Array<SmartContractExternalLibrary>, t: TFunction,
): Array<string> {
  const options: monaco.editor.IModelDecorationOptions = {
    isWholeLine: true,
    hoverMessage: [
      { value: t('editorShared.library_heading'), isTrusted: false, supportHtml: false },
      { value: t('editorShared.library_hint'), isTrusted: false, supportHtml: false },
    ],
  };

  const names = libraries.map(getLibraryName(model)).filter(Boolean).join('|');

  if (!names) {
    return [];
  }

  const [ firstLineMatch ] = model.findMatches(`(^library ${ names })\\s?\\{`, false, true, false, null, true);

  if (!firstLineMatch) {
    return [];
  }

  const firstLineDecoration: monaco.editor.IModelDeltaDecoration = {
    range: {
      startColumn: 1,
      endColumn: 10, // doesn't really matter since isWholeLine is true
      startLineNumber: firstLineMatch.range.startLineNumber,
      endLineNumber: firstLineMatch.range.startLineNumber,
    },
    options: {
      ...options,
      className: '.risk-warning-primary',
      marginClassName: '.risk-warning-primary',
    },
  };

  const lastLineRange: monaco.IRange = {
    startLineNumber: firstLineMatch.range.startLineNumber,
    startColumn: 1,
    endColumn: 10,
    endLineNumber: model.getLineCount(),
  };
  const [ lastLineMatch ] = model
    .findMatches(`^\\}`, lastLineRange, true, false, null, true)
    .sort(sortByEndLineNumberAsc);

  const restDecoration: monaco.editor.IModelDeltaDecoration | undefined = lastLineMatch ? {
    range: {
      startLineNumber: firstLineMatch.range.startLineNumber + 1,
      endLineNumber: lastLineMatch.range.startLineNumber,
      startColumn: 1,
      endColumn: 10, // doesn't really matter since isWholeLine is true
    },
    options: {
      ...options,
      className: '.risk-warning',
      marginClassName: '.risk-warning',
    },
  } : undefined;

  return model.deltaDecorations([], [ firstLineDecoration, restDecoration ].filter(Boolean));
}

const getLibraryName = (model: monaco.editor.ITextModel) => (library: SmartContractExternalLibrary) => {
  const containsFileName = library.name.includes(':');

  if (!containsFileName) {
    return library.name;
  }

  const [ fileName, libraryName ] = library.name.split(':');

  if (model.uri.path !== `/${ fileName }`) {
    return;
  }

  return libraryName;
};
