import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const englishLocalePath = path.join(srcDir, 'locales', 'en.json');

const SKIPPED_JSX_ATTRIBUTES = new Set([
  'className',
  'class',
  'style',
  'id',
  'key',
  'role',
  'tabIndex',
  'data-testid',
  'data-test',
  'data-qa',
  'data-cy',
  'to',
  'path',
  'href',
  'src',
  'target',
  'rel',
  'type',
  'name',
  'value',
  'checked',
  'disabled',
  'autoComplete',
  'placeholderKey',
  'aria-hidden',
  'aria-live',
  'aria-atomic',
  'aria-relevant',
  'aria-role',
  'aria-pressed',
  'aria-expanded',
  'aria-controls',
  'aria-describedby',
  'aria-selected',
  'aria-current',
  'aria-checked',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-autocomplete',
  'aria-orientation',
]);

const USER_FACING_PROPERTY_NAMES = new Set([
  'text',
  'label',
  'title',
  'ariaLabel',
  'description',
  'placeholder',
  'buttonLabel',
  'helperText',
]);

interface Finding {
  file: string;
  line: number;
  column: number;
  text: string;
  context: string;
}

interface KeyUsage {
  file: string;
  line: number;
  column: number;
}

const sourceFileCache = new Map<string, ts.SourceFile>();

function getSourceFiles(): string[] {
  const files: string[] = [];
  const stack: string[] = [srcDir];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'locales' || entry.name === 'assets') {
          continue;
        }
        stack.push(fullPath);
      } else if (entry.isFile()) {
        if (fullPath.endsWith('.d.ts')) continue;
        if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    }
  }

  return files;
}

function readSourceFile(filePath: string): ts.SourceFile {
  const cached = sourceFileCache.get(filePath);
  if (cached) return cached;

  const content = fs.readFileSync(filePath, 'utf8');
  const scriptKind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
  sourceFileCache.set(filePath, sourceFile);
  return sourceFile;
}

function recordTextValue(text: string, node: ts.Node, context: string, findings: Finding[], sourceFile: ts.SourceFile, relativePath: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  if (!/[A-Za-z]/.test(trimmed)) return;

  const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  findings.push({
    file: relativePath,
    line: line + 1,
    column: character + 1,
    text: trimmed,
    context,
  });
}

function handleTemplateExpression(template: ts.TemplateExpression, context: string, findings: Finding[], sourceFile: ts.SourceFile, relativePath: string) {
  recordTextValue(template.head.text, template.head, context, findings, sourceFile, relativePath);
  for (const span of template.templateSpans) {
    recordTextValue(span.literal.text, span.literal, context, findings, sourceFile, relativePath);
  }
}

function collectNonI18nFindings(): Finding[] {
  const files = getSourceFiles();
  const findings: Finding[] = [];

  for (const filePath of files) {
    const sourceFile = readSourceFile(filePath);
    const relativePath = path.relative(projectRoot, filePath);

    function visit(node: ts.Node) {
      if (ts.isJsxText(node)) {
        recordTextValue(node.getText(), node, 'JSX text content', findings, sourceFile, relativePath);
      } else if (ts.isJsxAttribute(node)) {
        const attributeName = node.name.getText();
        if (attributeName.startsWith('data-') || SKIPPED_JSX_ATTRIBUTES.has(attributeName)) {
          ts.forEachChild(node, visit);
          return;
        }

        const initializer = node.initializer;
        if (!initializer) {
          ts.forEachChild(node, visit);
          return;
        }

        if (ts.isStringLiteralLike(initializer)) {
          recordTextValue(initializer.text, initializer, `JSX attribute "${attributeName}"`, findings, sourceFile, relativePath);
        } else if (ts.isJsxExpression(initializer)) {
          const expression = initializer.expression;
          if (!expression) {
            ts.forEachChild(node, visit);
            return;
          }

          if (ts.isStringLiteralLike(expression)) {
            recordTextValue(expression.text, expression, `JSX attribute "${attributeName}"`, findings, sourceFile, relativePath);
          } else if (ts.isTemplateExpression(expression)) {
            handleTemplateExpression(expression, `JSX attribute "${attributeName}"`, findings, sourceFile, relativePath);
          }
        }
      } else if (ts.isPropertyAssignment(node)) {
        const nameNode = node.name;
        const propName = ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)
          ? nameNode.text
          : undefined;

        if (propName && USER_FACING_PROPERTY_NAMES.has(propName)) {
          const initializer = node.initializer;
          if (ts.isStringLiteralLike(initializer)) {
            recordTextValue(initializer.text, initializer, `Object property "${propName}"`, findings, sourceFile, relativePath);
          } else if (ts.isTemplateExpression(initializer)) {
            handleTemplateExpression(initializer, `Object property "${propName}"`, findings, sourceFile, relativePath);
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return findings;
}

function collectTranslationKeyUsage(): Map<string, KeyUsage[]> {
  const files = getSourceFiles();
  const usage = new Map<string, KeyUsage[]>();

  for (const filePath of files) {
    const sourceFile = readSourceFile(filePath);
    const relativePath = path.relative(projectRoot, filePath);

    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && isTranslationCall(node.expression)) {
        const firstArg = node.arguments[0];
        if (firstArg && ts.isStringLiteralLike(firstArg)) {
          const key = firstArg.text;
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(firstArg.getStart());
          const locations = usage.get(key) ?? [];
          locations.push({ file: relativePath, line: line + 1, column: character + 1 });
          usage.set(key, locations);
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return usage;
}

function isTranslationCall(expression: ts.Expression): boolean {
  if (ts.isIdentifier(expression)) {
    return expression.text === 't';
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return expression.name.text === 't';
  }

  return false;
}

function hasTranslationKey(translations: unknown, keyPath: string): boolean {
  const segments = keyPath.split('.');
  let current: unknown = translations;

  for (const segment of segments) {
    if (
      typeof current === 'object' &&
      current !== null &&
      Object.prototype.hasOwnProperty.call(current, segment)
    ) {
      // TypeScript doesn't know the type, so we use type assertion
      current = (current as Record<string, unknown>)[segment];
    } else {
      return false;
    }
  }

  return current !== undefined;
}

describe('internationalization coverage', () => {
  it('contains no hard-coded user-facing text', () => {
    const findings = collectNonI18nFindings();
    if (findings.length > 0) {
      const details = findings
        .map(finding => `${finding.file}:${finding.line}:${finding.column} — ${finding.context}: "${finding.text}"`)
        .join('\n');
      throw new Error(`Found non-internationalized text that should use translation keys:\n${details}`);
    }

    expect(findings).toHaveLength(0);
  });

  it('uses only defined English translation keys', () => {
    const keyUsage = collectTranslationKeyUsage();
    const translations = JSON.parse(fs.readFileSync(englishLocalePath, 'utf8'));

    const missing: string[] = [];

    for (const [key, locations] of keyUsage.entries()) {
      if (!hasTranslationKey(translations, key)) {
        for (const location of locations) {
          missing.push(`${location.file}:${location.line}:${location.column} — Missing key "${key}"`);
        }
      }
    }

    if (missing.length > 0) {
      throw new Error(`The following translation keys are missing from English locale:\n${missing.join('\n')}`);
    }

    expect(missing).toHaveLength(0);
  });
});
