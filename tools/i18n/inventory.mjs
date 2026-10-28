// Modified by Quat Capital on 2026-10-25: T18 candidate string inventory.
// Modified by Quat Capital on 2026-10-29: record generator revision and report generation time. GPL-3.0.
// Licensed under GNU GPL v3.0; see LICENSE.
/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';

import ts from 'typescript';

import { collectSources, nodeLocation, parseSource, PROJECT_ROOT, propertyName, SOURCE_ROOTS } from './sources.mjs';

const USER_FACING_NAMES = new Set([
  'title', 'label', 'description', 'placeholder', 'aria-label', 'aria-description', 'alt',
  'message', 'errorMessage', 'successMessage', 'helperText', 'emptyText', 'loadingText',
  'buttonText', 'tooltip', 'tooltipText', 'text', 'caption', 'heading', 'summary', 'content', 'hint',
]);
const KNOWN_NON_TEXT_NAMES = new Set([
  'id', 'className', 'class', 'href', 'src', 'url', 'path', 'pathname', 'route', 'method',
  'type', 'key', 'value', 'name', 'testId', 'data-testid', 'fontFamily', 'fontSize',
]);
const NON_TEXT_TAGS = new Set([ 'style', 'script', 'code', 'pre', 'kbd' ]);
const CODE_TEMPLATE_TAGS = new Set([ 'css', 'gql', 'graphql', 'sql', 'raw' ]);
const LANGUAGE_CODE_LITERAL = /^(?:https?:|wss?:|ipfs:|data:|mailto:|tel:|\/|\.\.?\/|0x[\da-f]+$)/iu;
const CSS_LITERAL = /\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw)\b|^(?:rgba?|hsla?|calc|var|url|linear-gradient)\(/iu;
const IDENTIFIER_LITERAL = /^(?:[a-z\d]+(?:[_.:/-][a-z\d]+)+|[a-z]+(?:[A-Z][a-z\d]*)+)$/u;
const USER_VARIABLE = /(?:title|label|description|placeholder|message|tooltip|caption|heading|text|error)$/iu;

function isUserFacingName(name) {
  return USER_FACING_NAMES.has(name) || /(?:Title|Label|Description|Placeholder|Message|Text|Tooltip)$/u.test(name);
}

function meaningfulText(value, allowSingleWord) {
  const trimmed = value.trim();
  const withoutEntities = trimmed.replace(/&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]+);/giu, '');

  if (!trimmed || !/\p{L}/u.test(withoutEntities) || LANGUAGE_CODE_LITERAL.test(trimmed) || CSS_LITERAL.test(trimmed)) {
    return false;
  }

  if (/^(?:#[\da-f]{3,8}|[a-z]+\/[a-z.+-]+)$/iu.test(trimmed) || IDENTIFIER_LITERAL.test(trimmed)) {
    return false;
  }

  return allowSingleWord || /\p{L}\s+\p{L}/u.test(trimmed);
}

function isInsideCodeOrType(node) {
  let current = node;

  while (current.parent) {
    const parent = current.parent;

    if (ts.isTypeNode(parent) || ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) || ts.isModuleDeclaration(parent)) {
      return true;
    }

    if (ts.isTaggedTemplateExpression(parent) && CODE_TEMPLATE_TAGS.has(parent.tag.getText().split('.').at(-1))) {
      return true;
    }

    if (ts.isJsxElement(parent) && NON_TEXT_TAGS.has(parent.openingElement.tagName.getText().toLowerCase())) {
      return true;
    }

    if (ts.isCallExpression(parent) && parent.arguments.includes(current)) {
      const name = parent.expression.getText();

      if (name === 'require' || parent.expression.kind === ts.SyntaxKind.ImportKeyword || /(?:^|\.)(?:t|translate)$/u.test(name)) {
        return true;
      }
    }

    if (ts.isStatement(parent) || ts.isSourceFile(parent)) {
      break;
    }

    current = parent;
  }

  return false;
}

function getContext(node, file) {
  let current = node;

  while (current.parent) {
    const parent = current.parent;

    if (ts.isJsxAttribute(parent)) {
      const name = propertyName(parent.name);
      return {
        kind: isUserFacingName(name) ? 'jsx-attribute' : 'non-text-attribute',
        context: name,
        userFacing: isUserFacingName(name),
      };
    }

    if (ts.isPropertyAssignment(parent) && parent.initializer === current) {
      const name = propertyName(parent.name) || parent.name.getText();

      if (isUserFacingName(name)) {
        return { kind: 'object-property', context: name, userFacing: true };
      }

      if (KNOWN_NON_TEXT_NAMES.has(name)) {
        return { kind: 'code-property', context: name, userFacing: false };
      }
    }

    if (ts.isJsxExpression(parent) && (ts.isJsxElement(parent.parent) || ts.isJsxFragment(parent.parent))) {
      return { kind: 'jsx-expression', context: 'children', userFacing: true };
    }

    if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name) && USER_VARIABLE.test(parent.name.text)) {
      return { kind: 'named-text-variable', context: parent.name.text, userFacing: true };
    }

    if (ts.isReturnStatement(parent) && /validators?|validation/iu.test(file)) {
      return { kind: 'validation-message', context: 'return', userFacing: true };
    }

    if (ts.isCallExpression(parent) && /(?:^|\.)(?:Error|warn|error|info|success|toast)$/u.test(parent.expression.getText())) {
      return { kind: 'message-candidate', context: parent.expression.getText(), userFacing: false };
    }

    if (ts.isStatement(parent) || ts.isSourceFile(parent)) {
      break;
    }

    current = parent;
  }

  return { kind: 'text-candidate', context: 'manual-review', userFacing: false };
}

function templateText(node, sourceFile) {
  let source = node.head.text;
  const expressions = [];

  node.templateSpans.forEach((span, index) => {
    source += `{{expression${ index }}}${ span.literal.text }`;
    expressions.push(span.expression.getText(sourceFile));
  });

  return { source, expressions };
}

function inspectSource(sourceFile, file) {
  const candidates = [];

  function visit(node) {
    if (ts.isJsxText(node)) {
      const source = node.text.replace(/\s+/gu, ' ').trim();

      if (meaningfulText(source, true) && !isInsideCodeOrType(node)) {
        candidates.push({
          file, ...nodeLocation(sourceFile, node), source, kind: 'jsx-text', context: 'children', reviewRequired: true,
        });
      }
    } else if (ts.isStringLiteralLike(node) || ts.isTemplateExpression(node)) {
      if (isInsideCodeOrType(node)) {
        return;
      }

      if ((ts.isPropertyAssignment(node.parent) && node.parent.name === node) || ts.isElementAccessExpression(node.parent)) {
        return;
      }

      const context = getContext(node, file);

      if (context.kind === 'non-text-attribute' || context.kind === 'code-property') {
        return;
      }

      const template = ts.isTemplateExpression(node) ? templateText(node, sourceFile) : undefined;
      const source = template?.source ?? node.text;
      const staticTemplateText = ts.isTemplateExpression(node) ?
        `${ node.head.text }${ node.templateSpans.map((span) => span.literal.text).join('') }` : undefined;

      if ((!template || /\p{L}/u.test(staticTemplateText)) && meaningfulText(source, context.userFacing)) {
        const candidate = {
          file, ...nodeLocation(sourceFile, node), source,
          kind: template ? 'template-expression' : context.kind,
          context: context.context,
          reviewRequired: true,
        };

        if (template) {
          candidate.expressions = template.expressions;
          candidate.manualReason = 'Choose semantic interpolation names and review grammar; do not replace automatically.';
        }

        candidates.push(candidate);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return candidates;
}

function argumentsConfig(args) {
  const options = { root: PROJECT_ROOT, output: 'tools/i18n/inventory.json' };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if ((argument === '--root' || argument === '--output') && args[index + 1]) {
      options[argument === '--root' ? 'root' : 'output'] = args[index + 1];
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${ argument }`);
    }
  }

  return options;
}

async function main() {
  const options = argumentsConfig(process.argv.slice(2));
  const root = path.resolve(options.root);
  const { files, skipped } = await collectSources(root);
  const candidates = [];
  const parseErrors = [];
  const filesByRoot = {};
  const filesByExtension = {};

  for (const file of files) {
    const sourceFile = await parseSource(root, file);
    const section = file.split('/')[0];
    const extension = path.extname(file);
    filesByRoot[section] = (filesByRoot[section] || 0) + 1;
    filesByExtension[extension] = (filesByExtension[extension] || 0) + 1;

    for (const diagnostic of sourceFile.parseDiagnostics) {
      parseErrors.push({
        file,
        message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
        ...nodeLocation(sourceFile, { getStart: () => diagnostic.start ?? 0 }),
      });
    }

    candidates.push(...inspectSource(sourceFile, file));
  }

  const candidatesByKind = {};
  const candidatesByRoot = {};

  for (const candidate of candidates) {
    candidatesByKind[candidate.kind] = (candidatesByKind[candidate.kind] || 0) + 1;
    const section = candidate.file.split('/')[0];
    candidatesByRoot[section] = (candidatesByRoot[section] || 0) + 1;
  }

  const report = {
    _meta: {
      modifiedBy: 'Quat Capital', modifiedOn: '2026-10-29', license: 'GPL-3.0',
      generatedAt: new Date().toISOString(),
      purpose: 'T18 AST candidate inventory; manual review is mandatory.',
      sourceRoots: SOURCE_ROOTS, typescriptVersion: ts.version,
    },
    limitations: [
      'Heuristics identify candidates, not verified translations or complete UI coverage.',
      'Dynamic text, imported data, external widgets and runtime configuration require manual review.',
      'Code-like literals, declarations, tests, mocks, fixtures and generated directories are excluded.',
      'Templates need semantic interpolation names and grammar review; source expressions are not translation values.',
      'Existing literal translation calls are excluded; run check-locales.mjs to validate their keys.',
    ],
    stats: {
      filesScanned: files.length, filesByRoot, filesByExtension, skipped,
      candidateCount: candidates.length, candidateFiles: new Set(candidates.map((item) => item.file)).size,
      uniqueCandidateTexts: new Set(candidates.map((item) => item.source)).size,
      candidatesByKind, candidatesByRoot, parseErrors: parseErrors.length,
    },
    parseErrors,
    candidates,
  };

  const output = path.resolve(root, options.output);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${ JSON.stringify(report, null, 2) }\n`, 'utf8');
  console.log(JSON.stringify({ output, ...report.stats }, null, 2));

  if (parseErrors.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
