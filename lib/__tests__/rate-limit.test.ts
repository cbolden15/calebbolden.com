import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, __resetRateLimit } from '../rate-limit';

beforeEach(() => __resetRateLimit());

describe('rateLimit', () => {
  it('allows up to the limit within a window', () => {
    expect(rateLimit('k', 3, 1000, 0).allowed).toBe(true);
    expect(rateLimit('k', 3, 1000, 100).allowed).toBe(true);
    expect(rateLimit('k', 3, 1000, 200).allowed).toBe(true);
  });

  it('blocks past the limit within a window', () => {
    rateLimit('k', 2, 1000, 0);
    rateLimit('k', 2, 1000, 10);
    expect(rateLimit('k', 2, 1000, 20)).toEqual({ allowed: false, remaining: 0 });
  });

  it('resets after the window elapses', () => {
    rateLimit('k', 1, 1000, 0);
    expect(rateLimit('k', 1, 1000, 500).allowed).toBe(false);
    expect(rateLimit('k', 1, 1000, 1000).allowed).toBe(true);
  });

  it('tracks keys independently', () => {
    rateLimit('a', 1, 1000, 0);
    expect(rateLimit('b', 1, 1000, 0).allowed).toBe(true);
  });
});
