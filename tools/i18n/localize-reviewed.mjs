// Modified by Quat Capital on 2026-10-25: T18 opt-in reviewed-literal codemod.
// Licensed under GNU GPL v3.0; see LICENSE.
/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

import { literalText, nodeLocation, portablePath, PROJECT_ROOT, propertyName } from './sources.mjs';

const NOTICE = '// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.';
const ATTRIBUTE_NAMES = new Set([ 'title', 'label', 'placeholder', 'aria-label', 'alt', 'tooltip', 'description', 'emptyText' ]);
const SKIP_VALUES = new Set([ 'Value', 'From', 'To' ]);
const BLOCKED_TAGS = new Set([ 'trans', 'code', 'pre', 'script', 'style' ]);
const OWNER_NAME = /^(?:[A-Z]|use[A-Z])/u;
const PROTECTED_FILES =
  /^(?:ui\/home\/|ui\/snippets\/header\/|lib\/(?:i18n|date|format)\/|ui\/shared\/(?:[Tt]ime|NumberEntity)|nextjs\/|pages\/_|lib\/setLocale\.ts$)/u;

function quoted(value) {
  return `'${ value.replace(/\\/gu, '\\\\').replace(/'/gu, '\\\'').replace(/\r/gu, '\\r').replace(/\n/gu, '\\n') }'`;
}

function dictionaryValues(dictionary, prefix = '', result = new Map()) {
  for (const [ name, value ] of Object.entries(dictionary)) {
    if (name === '_meta') {
      continue;
    }

    const key = prefix ? `${ prefix }.${ name }` : name;

    if (typeof value === 'string' && value.trim() && !/\{\{|<\/?\w/u.test(value)) {
      const keys = result.get(value) || [];
      keys.push(key);
      result.set(value, keys);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      dictionaryValues(value, key, result);
    }
  }

  return result;
}

function visibleJsxText(text) {
  const lines = text.split(/\r\n|\n|\r/u);
  let lastNonEmpty = -1;

  for (let index = 0; index < lines.length; index += 1) {
    if (/[^ \t]/u.test(lines[index])) {
      lastNonEmpty = index;
    }
  }

  let result = '';

  for (let index = 0; index < lines.length; index += 1) {
    let line = lines[index].replace(/\t/gu, ' ');

    if (index !== 0) {
      line = line.replace(/^ +/u, '');
    }

    if (index !== lines.length - 1) {
      line = line.replace(/ +$/u, '');
    }

    if (line) {
      result += line;

      if (index !== lastNonEmpty) {
        result += ' ';
      }
    }
  }

  return result;
}

function functionName(node) {
  if (ts.isFunctionDeclaration(node)) {
    return node.name?.text;
  }

  if (!ts.isArrowFunction(node) && !ts.isFunctionExpression(node)) {
    return undefined;
  }

  let current = node;

  while (current.parent) {
    const parent = current.parent;

    if (ts.isVariableDeclaration(parent) && parent.initializer === current && ts.isIdentifier(parent.name)) {
      return parent.name.text;
    }

    if (ts.isCallExpression(parent) && /(?:^|\.)(?:memo|forwardRef)$/u.test(parent.expression.getText()) && parent.arguments.includes(current)) {
      current = parent;
    } else if (ts.isParenthesizedExpression(parent) || ts.isAsExpression(parent) || ts.isSatisfiesExpression(parent)) {
      current = parent;
    } else {
      break;
    }
  }

  return undefined;
}

function componentOwner(node) {
  let owner;
  let current = node.parent;

  while (current) {
    if (ts.isClassDeclaration(current) || ts.isClassExpression(current)) {
      return undefined;
    }

    const name = functionName(current);

    if (name && OWNER_NAME.test(name) && current.body && ts.isBlock(current.body) && !current.asteriskToken &&
      !current.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword)) {
      owner = current;
    }

    current = current.parent;
  }

  return owner;
}

function blockedContext(node, transNames) {
  let current = node.parent;

  while (current) {
    let tag;

    if (ts.isJsxElement(current)) {
      tag = current.openingElement.tagName.getText();
    } else if (ts.isJsxOpeningElement(current) || ts.isJsxSelfClosingElement(current)) {
      tag = current.tagName.getText();
    }

    if (tag && (transNames.has(tag) || BLOCKED_TAGS.has(tag.split('.').at(-1).toLowerCase()))) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

function importInformation(sourceFile) {
  const imports = sourceFile.statements.filter(ts.isImportDeclaration);
  const transNames = new Set([ 'Trans' ]);
  let hookName;
  let extendableImport;
  let namespaceImport = false;
  const memoNames = new Set([ 'useMemo', 'useCallback' ]);
  const unsupportedHookCallbacks = new Set([ 'useEffect', 'useLayoutEffect', 'useInsertionEffect', 'useState' ]);

  for (const declaration of imports) {
    if (literalText(declaration.moduleSpecifier) === 'react' && declaration.importClause?.namedBindings &&
      ts.isNamedImports(declaration.importClause.namedBindings)) {
      for (const element of declaration.importClause.namedBindings.elements) {
        const imported = element.propertyName?.text ?? element.name.text;

        if (memoNames.has(imported)) {
          memoNames.add(element.name.text);
        } else if (unsupportedHookCallbacks.has(imported)) {
          unsupportedHookCallbacks.add(element.name.text);
        }
      }
    }

    if (literalText(declaration.moduleSpecifier) !== 'react-i18next') {
      continue;
    }

    const bindings = declaration.importClause?.namedBindings;

    if (bindings && ts.isNamedImports(bindings)) {
      if (!declaration.importClause.isTypeOnly) {
        extendableImport ??= bindings;
      }

      for (const element of bindings.elements) {
        const imported = element.propertyName?.text ?? element.name.text;

        if (imported === 'Trans') {
          transNames.add(element.name.text);
        }

        if (imported === 'useTranslation' && !declaration.importClause.isTypeOnly && !element.isTypeOnly) {
          hookName = element.name.text;
        }
      }
    } else if (bindings && ts.isNamespaceImport(bindings)) {
      namespaceImport = true;
    }
  }

  return { imports, transNames, hookName, extendableImport, namespaceImport, memoNames, unsupportedHookCallbacks };
}

function ownerHookStatus(owner, hookName) {
  let existing = false;
  let aliasIdentifiers = 0;
  let existingAliasIdentifiers = 0;
  let hookNameShadowed = false;

  function visit(node) {
    if (ts.isIdentifier(node) && node.text === 'tQuat') {
      aliasIdentifiers += 1;
    }

    if ((ts.isBindingElement(node) || ts.isParameter(node) || ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) &&
      node.name && ts.isIdentifier(node.name) && node.name.text === hookName) {
      hookNameShadowed = true;
    }

    ts.forEachChild(node, visit);
  }

  visit(owner);

  if (hookNameShadowed) {
    return { existing: false, safe: false };
  }

  for (const statement of owner.body.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isObjectBindingPattern(declaration.name) || !declaration.initializer || !ts.isCallExpression(declaration.initializer) ||
        declaration.initializer.expression.getText() !== hookName) {
        continue;
      }

      const binding = declaration.name.elements.find((element) => propertyName(element.propertyName || element.name) === 't' &&
        ts.isIdentifier(element.name) && element.name.text === 'tQuat');

      if (binding) {
        existing = true;
        existingAliasIdentifiers += 1;
      }
    }
  }

  if (existing) {
    let declarations = 0;

    function countBindings(node) {
      if ((ts.isBindingElement(node) || ts.isParameter(node) || ts.isVariableDeclaration(node)) &&
        ts.isIdentifier(node.name) && node.name.text === 'tQuat') {
        declarations += 1;
      }

      ts.forEachChild(node, countBindings);
    }

    countBindings(owner);
    return { existing: true, safe: existingAliasIdentifiers === 1 && declarations === 1 };
  }

  return { existing: false, safe: aliasIdentifiers === 0 };
}

function memoDependencies(node, owner, imports) {
  const arrays = [];
  let current = node;

  while (current && current !== owner) {
    const parent = current.parent;

    if (parent && ts.isCallExpression(parent) && parent.arguments[0] === current) {
      const name = parent.expression.getText().split('.').at(-1);

      if (imports.unsupportedHookCallbacks.has(name)) {
        return { safe: false, arrays: [] };
      }

      if (imports.memoNames.has(name)) {
        const dependencies = parent.arguments[1];

        if (!dependencies || !ts.isArrayLiteralExpression(dependencies)) {
          return { safe: false, arrays: [] };
        }

        arrays.push(dependencies);
      }
    }

    current = parent;
  }

  return { safe: true, arrays };
}

function insertionAfterElement(array, value) {
  const last = array.elements.at(-1);
  return last ? { start: last.end, end: last.end, replacement: `, ${ value }` } :
    { start: array.getStart() + 1, end: array.getStart() + 1, replacement: ` ${ value } ` };
}

function hookInsertion(owner, sourceFile, hookName) {
  let position = owner.body.getStart(sourceFile) + 1;

  for (const statement of owner.body.statements) {
    if (ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression)) {
      position = statement.end;
    } else {
      break;
    }
  }

  const firstStatement = owner.body.statements[0];
  const text = sourceFile.text;
  const statementStart = firstStatement?.getStart(sourceFile) ?? owner.getStart(sourceFile);
  const lineStart = text.lastIndexOf('\n', statementStart - 1) + 1;
  const existingIndent = text.slice(lineStart, statementStart);
  const indent = /^\s*$/u.test(existingIndent) ? existingIndent : '  ';

  return { start: position, end: position, replacement: `\n${ indent }const { t: tQuat } = ${ hookName }();\n`, kind: 'hook' };
}

function applyEdits(text, edits) {
  const sorted = [ ...edits ].sort((left, right) => right.start - left.start ||
    Number(left.kind === 'notice') - Number(right.kind === 'notice'));
  let nextStart = text.length + 1;

  for (const edit of sorted) {
    if (edit.end > nextStart) {
      throw new Error('Refusing overlapping AST edits');
    }

    text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end);
    nextStart = edit.start;
  }

  return text;
}

export function planReviewedLocalization(text, file, dictionary) {
  const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const skip = [];
  const changes = [];
  const edits = [];
  const byOwner = new Map();
  const dependencyArrays = new Set();
  const values = dictionaryValues(dictionary);
  const imports = importInformation(sourceFile);
  const hookName = imports.hookName || 'useTranslation';

  if (sourceFile.parseDiagnostics.length) {
    return { file, changed: false, skip: [ { reason: 'source-parse-error' } ], changes, text };
  }

  if (!imports.hookName) {
    let collision = imports.namespaceImport;

    function checkIdentifier(node) {
      if (ts.isIdentifier(node) && node.text === 'useTranslation') {
        collision = true;
      }

      ts.forEachChild(node, checkIdentifier);
    }

    checkIdentifier(sourceFile);

    if (collision) {
      return { file, changed: false, skip: [ { reason: 'hook-import-name-or-namespace-conflict' } ], changes, text };
    }
  }

  function visit(node) {
    let source;
    let start;
    let end;
    let visible;
    let kind;

    if (ts.isJsxText(node)) {
      visible = visibleJsxText(node.text);
      source = visible.replace(/\s+/gu, ' ').trim();
      start = node.pos;
      end = node.end;
      kind = 'jsx-text';
    } else if (ts.isJsxAttribute(node) && ATTRIBUTE_NAMES.has(propertyName(node.name)) && node.initializer) {
      const initializer = node.initializer;
      const expression = ts.isJsxExpression(initializer) ? initializer.expression : initializer;
      source = expression ? literalText(expression) : undefined;
      start = initializer.getStart(sourceFile);
      end = initializer.end;
      kind = 'jsx-attribute';
    }

    if (source && values.has(source)) {
      const location = { ...nodeLocation(sourceFile, node), source, kind };
      const keys = values.get(source);
      const owner = componentOwner(node);
      let reason;

      if (SKIP_VALUES.has(source)) {
        reason = 'context-sensitive-English-value';
      } else if (keys.length !== 1) {
        reason = 'ambiguous-dictionary-value';
      } else if (blockedContext(node, imports.transNames)) {
        reason = 'Trans-or-code-context';
      } else if (!owner) {
        reason = 'no-block-body-component-or-hook';
      } else if (!ownerHookStatus(owner, hookName).safe) {
        reason = 'tQuat-scope-conflict';
      }

      const memo = owner ? memoDependencies(node, owner, imports) : { safe: false, arrays: [] };

      if (!reason && !memo.safe) {
        reason = 'memo-without-literal-dependency-array';
      }

      if (reason) {
        skip.push({ ...location, keys, reason });
      } else {
        const key = keys[0];
        const call = `{ tQuat(${ quoted(key) }) }`;
        const leading = kind === 'jsx-text' ? visible.match(/^\s*/u)[0] : '';
        const trailing = kind === 'jsx-text' ? visible.match(/\s*$/u)[0] : '';
        const replacement = `${ leading ? `{ ${ quoted(leading) } }` : '' }${ call }${ trailing ? `{ ${ quoted(trailing) } }` : '' }`;
        edits.push({ start, end, replacement, kind: 'translation' });
        changes.push({ ...location, key, owner: functionName(owner), replacement });
        byOwner.set(owner, ownerHookStatus(owner, hookName));
        memo.arrays.forEach((array) => dependencyArrays.add(array));
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!changes.length) {
    return { file, changed: false, changes, skip, text };
  }

  for (const [ owner, hookStatus ] of byOwner) {
    if (!hookStatus.existing) {
      edits.push(hookInsertion(owner, sourceFile, hookName));
    }
  }

  for (const array of dependencyArrays) {
    if (!array.elements.some((item) => ts.isIdentifier(item) && item.text === 'tQuat')) {
      edits.push({ ...insertionAfterElement(array, 'tQuat'), kind: 'memo-dependency' });
    }
  }

  if (!imports.hookName) {
    if (imports.extendableImport) {
      edits.push({ ...insertionAfterElement(imports.extendableImport, 'useTranslation'), kind: 'import' });
    } else {
      const position = imports.imports.at(-1)?.end ?? 0;
      edits.push({ start: position, end: position, replacement: '\nimport { useTranslation } from \'react-i18next\';\n', kind: 'import' });
    }
  }

  if (!text.includes(NOTICE)) {
    edits.push({ start: 0, end: 0, replacement: `${ NOTICE }\n`, kind: 'notice' });
  }

  const changedText = applyEdits(text, edits);
  const checked = ts.createSourceFile(file, changedText, ts.ScriptTarget.Latest, true);

  if (checked.parseDiagnostics.length) {
    return { file, changed: false, changes: [], skip: [ ...skip, { reason: 'transformed-source-parse-error' } ], text };
  }

  return { file, changed: true, changes, skip, text: changedText,
    addedHooks: [ ...byOwner.values() ].filter((status) => !status.existing).length,
    memoDependencyArrays: dependencyArrays.size };
}

function argumentsFromCli(args) {
  const options = { root: PROJECT_ROOT, dictionary: 'locales/en.json', write: false, files: [] };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if ((argument === '--root' || argument === '--dictionary') && args[index + 1]) {
      options[argument === '--root' ? 'root' : 'dictionary'] = args[index + 1];
      index += 1;
    } else if (argument === '--write') {
      options.write = true;
    } else if (argument.startsWith('--')) {
      throw new Error(`Unknown or incomplete argument: ${ argument }`);
    } else {
      options.files.push(argument);
    }
  }

  if (!options.files.length) {
    throw new Error('Provide an explicit list of .tsx files. Directories and globs are not accepted. Default mode is dry-run.');
  }

  return options;
}

async function main() {
  const options = argumentsFromCli(process.argv.slice(2));
  const root = await fs.realpath(path.resolve(options.root));
  const dictionary = JSON.parse(await fs.readFile(path.resolve(root, options.dictionary), 'utf8'));
  const results = [];

  for (const input of [ ...new Set(options.files) ]) {
    const absolute = await fs.realpath(path.resolve(root, input));
    const relative = portablePath(path.relative(root, absolute));

    if (relative.startsWith('../') || path.isAbsolute(relative) || !/^(?:ui|lib|toolkit|pages)\/.+\.tsx$/u.test(relative) ||
      /\.(?:test|spec|pw)\.tsx$|\/(?:mocks|__mocks__|__tests__|generated)\//u.test(relative) || PROTECTED_FILES.test(relative)) {
      throw new Error(`Refusing excluded, protected or external file: ${ input }`);
    }

    const original = await fs.readFile(absolute, 'utf8');
    const result = planReviewedLocalization(original, relative, dictionary);

    if (options.write && result.changed) {
      if (await fs.readFile(absolute, 'utf8') !== original) {
        throw new Error(`Source changed during planning; refusing write: ${ relative }`);
      }

      await fs.writeFile(absolute, result.text, 'utf8');
    }

    const { text: _text, ...report } = result;
    results.push(report);
  }

  console.log(JSON.stringify({
    _meta: { modifiedBy: 'Quat Capital', modifiedOn: '2026-10-25', license: 'GPL-3.0' },
    mode: options.write ? 'write' : 'dry-run',
    files: results.length,
    changedFiles: results.filter((result) => result.changed).length,
    replacements: results.reduce((sum, result) => sum + result.changes.length, 0),
    note: 'Only exact, unambiguous existing EN values; review report before --write. No dictionary values are changed.',
    results,
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
