// Modified by Quat Capital on 2026-10-25: T18 dictionary and literal key validation.
// Licensed under GNU GPL v3.0; see LICENSE.
/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';

import ts from 'typescript';

import { collectSources, literalText, nodeLocation, parseSource, PROJECT_ROOT, propertyName } from './sources.mjs';

const LOCALES = [ 'en', 'ru', 'kk' ];
const PLURAL_SUFFIX = /_(?:(ordinal)_)?(zero|one|two|few|many|other)$/u;
const INTERPOLATION = /\{\{([^{}]*)\}\}/gu;

function optionsFromArguments(args) {
  const options = { root: PROJECT_ROOT, localesDirectory: 'locales', skipSource: false, json: false };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if ((argument === '--root' || argument === '--locales-dir') && args[index + 1]) {
      options[argument === '--root' ? 'root' : 'localesDirectory'] = args[index + 1];
      index += 1;
    } else if (argument === '--skip-source') {
      options.skipSource = true;
    } else if (argument === '--json') {
      options.json = true;
    } else {
      throw new Error(`Unknown or incomplete argument: ${ argument }`);
    }
  }

  return options;
}

function sortedSignature(values) {
  return [ ...new Set(values) ].sort().join('|');
}

function interpolationSignature(value, location, errors) {
  const names = [];
  const remaining = value.replace(INTERPOLATION, (_match, expression) => {
    const body = expression.trim();
    const unescaped = body.startsWith('-');
    const name = (unescaped ? body.slice(1) : body).split(',')[0].trim();

    if (!name) {
      errors.push(`${ location }: empty interpolation variable`);
    } else {
      names.push(`${ unescaped ? '-' : '' }${ name }`);
    }

    return '';
  });

  if (remaining.includes('{{') || remaining.includes('}}')) {
    errors.push(`${ location }: malformed interpolation braces`);
  }

  return sortedSignature(names);
}

function collectDuplicateKeys(source, file, errors) {
  const sourceFile = ts.parseJsonText(file, source);

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const seen = new Set();

      for (const property of node.properties) {
        if (ts.isPropertyAssignment(property)) {
          const name = propertyName(property.name);

          if (seen.has(name)) {
            errors.push(`${ file }:${ nodeLocation(sourceFile, property).line }: duplicate JSON property "${ name }"`);
          }

          seen.add(name);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function flattenDictionary(value, file, errors, prefix = '', leaves = new Map()) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${ file }:${ prefix || '<root>' }: expected an object`);
    return leaves;
  }

  for (const [ name, child ] of Object.entries(value)) {
    if (name === '_meta') {
      continue;
    }

    const key = prefix ? `${ prefix }.${ name }` : name;

    if (!name.trim() || name.includes(':')) {
      errors.push(`${ file }:${ key }: key must be non-empty and cannot contain namespace separators`);
    }

    if (typeof child === 'string') {
      if (!child.trim()) {
        errors.push(`${ file }:${ key }: empty translation`);
      }

      if (leaves.has(key)) {
        errors.push(`${ file }:${ key }: nested/dotted key collision`);
      }

      leaves.set(key, child);
    } else if (child && typeof child === 'object' && !Array.isArray(child)) {
      const before = leaves.size;
      flattenDictionary(child, file, errors, key, leaves);

      if (leaves.size === before) {
        errors.push(`${ file }:${ key }: empty translation group`);
      }
    } else {
      errors.push(`${ file }:${ key }: expected a string or nested object`);
    }
  }

  return leaves;
}

function normalizedDictionary(leaves, locale, errors, warnings) {
  const entries = new Map();
  const pluralGroups = new Map();

  for (const [ key, value ] of leaves) {
    const suffix = PLURAL_SUFFIX.exec(key);
    const signature = interpolationSignature(value, `${ locale }.json:${ key }`, errors);

    if (!suffix) {
      entries.set(key, { kind: 'text', signature });
      continue;
    }

    const base = key.slice(0, -suffix[0].length);
    const pluralType = suffix[1] ? 'ordinal' : 'cardinal';
    const groupKey = `${ base }${ pluralType === 'ordinal' ? '_ordinal' : '' }`;
    const category = suffix[2];
    const group = pluralGroups.get(groupKey) || { base, pluralType, forms: new Map() };
    group.forms.set(category, signature);
    pluralGroups.set(groupKey, group);
  }

  for (const [ key, group ] of pluralGroups) {
    const required = new Intl.PluralRules(locale, { type: group.pluralType }).resolvedOptions().pluralCategories;

    for (const category of required) {
      if (!group.forms.has(category)) {
        errors.push(`${ locale }.json:${ key }: missing ${ group.pluralType } plural form "${ category }"`);
      }
    }

    for (const category of group.forms.keys()) {
      if (category !== 'zero' && !required.includes(category)) {
        warnings.push(`${ locale }.json:${ key }: extra plural form "${ category }" is unused by this locale`);
      }
    }

    const signatures = new Set([ ...group.forms ].filter(([ category ]) => category !== 'zero').map(([ , value ]) => value));

    if (signatures.size > 1) {
      errors.push(`${ locale }.json:${ key }: interpolation variables differ between plural forms`);
    }

    if (entries.has(key)) {
      errors.push(`${ locale }.json:${ key }: plain key conflicts with a plural group`);
    }

    entries.set(key, { kind: group.pluralType, signature: [ ...signatures ][0] ?? '', forms: group.forms });
  }

  return entries;
}

function compareDictionaries(dictionaries, errors) {
  const reference = dictionaries.get('en');

  if (!reference) {
    return;
  }

  for (const locale of LOCALES.filter((value) => value !== 'en')) {
    const dictionary = dictionaries.get(locale);

    if (!dictionary) {
      continue;
    }

    for (const [ key, expected ] of reference) {
      const actual = dictionary.get(key);

      if (!actual) {
        errors.push(`${ locale }.json:${ key }: missing key`);
      } else if (actual.kind !== expected.kind) {
        errors.push(`${ locale }.json:${ key }: text/plural type differs from en.json`);
      } else if (actual.signature !== expected.signature) {
        errors.push(`${ locale }.json:${ key }: interpolation variables differ from en.json`);
      }
    }

    for (const key of dictionary.keys()) {
      if (!reference.has(key)) {
        errors.push(`${ locale }.json:${ key }: key is absent from en.json`);
      }
    }
  }
}

function collectTranslationReferences(sourceFile, file) {
  const references = [];
  const dynamic = [];
  const translationNames = new Set([ 't', 'translate' ]);
  const transNames = new Set([ 'Trans' ]);
  const hookNames = new Set([ 'useTranslation' ]);

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || literalText(statement.moduleSpecifier) !== 'react-i18next') {
      continue;
    }

    const bindings = statement.importClause?.namedBindings;

    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) {
        if ((element.propertyName?.text ?? element.name.text) === 'useTranslation') {
          hookNames.add(element.name.text);
        }
      }
    }
  }

  function discoverAliases(node) {
    if (ts.isImportDeclaration(node) && literalText(node.moduleSpecifier) === 'react-i18next') {
      const bindings = node.importClause?.namedBindings;

      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) {
          if ((element.propertyName?.text ?? element.name.text) === 'Trans') {
            transNames.add(element.name.text);
          }
        }
      }
    }

    if (ts.isVariableDeclaration(node) && ts.isObjectBindingPattern(node.name) && node.initializer &&
      ts.isCallExpression(node.initializer) && hookNames.has(node.initializer.expression.getText().split('.').at(-1))) {
      for (const element of node.name.elements) {
        if ((element.propertyName?.getText() ?? element.name.getText()) === 't' && ts.isIdentifier(element.name)) {
          translationNames.add(element.name.text);
        }
      }
    }

    ts.forEachChild(node, discoverAliases);
  }

  function addReference(node, key, kind, ordinal = false) {
    const location = { file, ...nodeLocation(sourceFile, node), kind, ordinal };

    if (typeof key === 'string') {
      references.push({ ...location, key: key.replace(/^translation:/u, '') });
    } else {
      dynamic.push(location);
    }
  }

  function visit(node) {
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      let name;

      if (ts.isIdentifier(callee)) {
        name = callee.text;
      } else if (ts.isPropertyAccessExpression(callee)) {
        name = callee.name.text;
      }

      if (translationNames.has(name)) {
        const argument = node.arguments[0];
        const translationOptions = node.arguments[1];
        const ordinal = Boolean(translationOptions && ts.isObjectLiteralExpression(translationOptions) &&
          translationOptions.properties.some((item) => ts.isPropertyAssignment(item) &&
            propertyName(item.name) === 'ordinal' && item.initializer.kind === ts.SyntaxKind.TrueKeyword));

        if (argument && ts.isArrayLiteralExpression(argument)) {
          for (const item of argument.elements) {
            addReference(item, literalText(item), 'translation-call', ordinal);
          }
        } else {
          addReference(node, argument ? literalText(argument) : undefined, 'translation-call', ordinal);
        }
      }
    } else if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && transNames.has(node.tagName.getText())) {
      const attribute = node.attributes.properties.find((item) => ts.isJsxAttribute(item) && propertyName(item.name) === 'i18nKey');

      if (attribute?.initializer) {
        const initializer = attribute.initializer;
        const expression = ts.isJsxExpression(initializer) ? initializer.expression : initializer;
        addReference(attribute, expression ? literalText(expression) : undefined, 'Trans');
      } else {
        dynamic.push({ file, ...nodeLocation(sourceFile, node), kind: 'Trans without a literal i18nKey' });
      }
    }

    ts.forEachChild(node, visit);
  }

  discoverAliases(sourceFile);
  visit(sourceFile);
  return { references, dynamic };
}

async function main() {
  const options = optionsFromArguments(process.argv.slice(2));
  const root = path.resolve(options.root);
  const errors = [];
  const warnings = [];
  const dictionaries = new Map();
  const leafKeys = new Map();
  const leafCounts = {};

  for (const locale of LOCALES) {
    const file = path.resolve(root, options.localesDirectory, `${ locale }.json`);

    try {
      const source = await fs.readFile(file, 'utf8');
      const parsed = JSON.parse(source);
      collectDuplicateKeys(source, `${ locale }.json`, errors);
      const leaves = flattenDictionary(parsed, `${ locale }.json`, errors);

      if (!leaves.size) {
        errors.push(`${ locale }.json: dictionary contains no translation strings`);
      }

      leafCounts[locale] = leaves.size;
      leafKeys.set(locale, new Set(leaves.keys()));
      dictionaries.set(locale, normalizedDictionary(leaves, locale, errors, warnings));
    } catch (error) {
      errors.push(`${ locale }.json: ${ error.message }`);
    }
  }

  compareDictionaries(dictionaries, errors);
  let filesScanned = 0;
  const references = [];
  const dynamicReferences = [];

  if (!options.skipSource) {
    const { files } = await collectSources(root);
    filesScanned = files.length;

    for (const file of files) {
      const sourceFile = await parseSource(root, file);

      for (const diagnostic of sourceFile.parseDiagnostics) {
        errors.push(`${ file }: ${ ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n') }`);
      }

      const result = collectTranslationReferences(sourceFile, file);
      references.push(...result.references);
      dynamicReferences.push(...result.dynamic);
    }

    for (const reference of references) {
      for (const locale of LOCALES) {
        const lookupKey = `${ reference.key }${ reference.ordinal ? '_ordinal' : '' }`;

        if (dictionaries.has(locale) && !dictionaries.get(locale).has(lookupKey) && !leafKeys.get(locale)?.has(reference.key)) {
          errors.push(`${ reference.file }:${ reference.line }: ${ locale }.json misses literal key "${ reference.key }"`);
        }
      }
    }
  }

  const result = {
    ok: errors.length === 0,
    leafCounts,
    normalizedKeyCounts: Object.fromEntries([ ...dictionaries ].map(([ locale, entries ]) => [ locale, entries.size ])),
    filesScanned, literalReferences: references.length,
    dynamicReferences,
    errors,
    warnings,
    limitations: [
      'Dynamic translation keys and wrappers other than t/translate/Trans require manual review.',
      'A successful check proves dictionary consistency, not full UI coverage or translation quality.',
      'Plural families compare by base key; required categories follow Intl.PluralRules for each locale.',
    ],
  };

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`i18n: ${ result.ok ? 'PASS' : 'FAIL' }; dictionaries ${ JSON.stringify(leafCounts) }; ` +
      `${ references.length } literal references in ${ filesScanned } source files`);

    for (const error of errors) {
      console.error(`ERROR ${ error }`);
    }

    for (const warning of warnings) {
      console.warn(`WARN ${ warning }`);
    }

    if (dynamicReferences.length) {
      console.warn(`REVIEW ${ dynamicReferences.length } dynamic references; use --json for file/line details`);
    }
  }

  process.exitCode = result.ok ? 0 : 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
