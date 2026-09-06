import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

const publicPath = '/clients/oj-preview-0123456789abcdef';

function request(pathname: string) {
  return new NextRequest(`https://calebbolden.com${pathname}`);
}

beforeEach(() => {
  vi.stubEnv('OJA_PREVIEW_PATH', publicPath);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('unlisted OJÄ preview routing', () => {
  it('redirects the private root to its index document', () => {
    const response = proxy(request(publicPath));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      `https://calebbolden.com${publicPath}/index.html`,
    );
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
  });

  it('rewrites preview files without exposing the internal asset path', () => {
    const response = proxy(request(`${publicPath}/assets/oja-hero-night.webp`));

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://calebbolden.com/client-previews/oja/assets/oja-hero-night.webp',
    );
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
  });

  it('blocks direct requests to the internal preview files', () => {
    const response = proxy(request('/client-previews/oja/index.html'));

    expect(response.status).toBe(404);
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
  });

  it('fails closed when the configured public path is too short', () => {
    vi.stubEnv('OJA_PREVIEW_PATH', '/clients/oja');

    const response = proxy(request('/clients/oja'));

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });
});
