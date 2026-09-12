import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { transformSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

// Execute each actual renderer without exporting a test-only symbol from a Next route.
for (const [path, start, end, name] of [
  ['app/work/agent-config/page.tsx', 'function ServerOutput(', 'export default async function', 'ServerOutput'],
  ['components/work/demos/AgentConfigInteractive.tsx', 'function HighlightedOutput(', 'function OutputPanel(', 'HighlightedOutput'],
]) {
  test(`${name} preserves complete schema-valid content with repeated highlights`, () => {
    const source = readFileSync(path, 'utf8');
    const body = source.slice(source.indexOf(start), source.indexOf(end));
    const code = transformSync(`const styles = {}; ${body}; module.exports = ${name};`, { loader: 'tsx', jsx: 'automatic', format: 'cjs' }).code;
    const compiledModule = { exports: undefined as unknown };
    new Function('require', 'module', code)(createRequire(import.meta.url), compiledModule);
    const content = 'Beginning. Repeat this. Middle. Repeat this. Final text.';
    const output = { content, highlight: 'Repeat this.', variant: 'brief', status: 'Current' };
    const html = renderToStaticMarkup(createElement(compiledModule.exports as React.ComponentType<Record<string, unknown>>, { ...output, output, name: 'Codex' }));
    const rendered = html.match(/<code>([\s\S]*?)<\/code>/)![1].replace(/<[^>]*>/g, '');
    expect(rendered).toBe(content);
    expect(html.match(/<mark/g)).toHaveLength(1);
  });
}
