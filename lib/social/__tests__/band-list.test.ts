import { describe, it, expect } from 'vitest';
import { bandToList } from '../band-list';

describe('bandToList', () => {
  it('routes foundations to owners', () => {
    expect(bandToList('foundations')).toBe('owners');
  });

  it('routes pilot to owners', () => {
    expect(bandToList('pilot')).toBe('owners');
  });

  it('routes sequence to operators', () => {
    expect(bandToList('sequence')).toBe('operators');
  });
});
