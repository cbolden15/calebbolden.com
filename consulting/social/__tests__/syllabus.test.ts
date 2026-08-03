import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const syllabus = readFileSync(join(process.cwd(), 'consulting/social/syllabus.md'), 'utf8');

describe('syllabus', () => {
  it('has exactly 18 weekly units', () => {
    const weeks = syllabus.match(/^### Week \d+:/gm) ?? [];
    expect(weeks).toHaveLength(18);
  });

  it('numbers the weeks 1 through 18 in order', () => {
    const numbers = [...syllabus.matchAll(/^### Week (\d+):/gm)].map((m) => Number(m[1]));
    expect(numbers).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
  });

  it('gives every week both a clip angle and an essay angle', () => {
    const clips = syllabus.match(/^\*\*Clip:\*\*/gm) ?? [];
    const essays = syllabus.match(/^\*\*Essay:\*\*/gm) ?? [];
    expect(clips).toHaveLength(18);
    expect(essays).toHaveLength(18);
  });

  it('never names the LLC in feed-facing copy', () => {
    expect(syllabus).not.toMatch(/Vora Technologies/i);
  });
});
