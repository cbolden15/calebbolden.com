import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "./proxy";

const ROBOTS = "noindex, nofollow, noarchive, nosnippet, noimageindex";

function request(path: string, headers?: HeadersInit) {
  return new NextRequest(`https://calebbolden.com${path}`, { headers });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("unlisted OJÄ preview routing", () => {
  const publicPath = "/clients/oj-preview-0123456789abcdef";

  beforeEach(() => {
    vi.stubEnv("OJA_PREVIEW_PATH", publicPath);
  });

  it("redirects the private root to its index document", () => {
    const response = proxy(request(publicPath));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `https://calebbolden.com${publicPath}/index.html`,
    );
    expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  });

  it("rewrites preview files without exposing the internal asset path", () => {
    const response = proxy(
      request(`${publicPath}/assets/oja-hero-night.webp`),
    );

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://calebbolden.com/client-previews/oja/assets/oja-hero-night.webp",
    );
    expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
  });

  it("blocks direct requests to the internal preview files", () => {
    const response = proxy(request("/client-previews/oja/index.html"));

    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
  });

  it("fails closed when the configured public path is too short", () => {
    vi.stubEnv("OJA_PREVIEW_PATH", "/clients/oja");

    const response = proxy(request("/clients/oja"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });
});

describe("Brittany Lyons private-link preview", () => {
  const sitePath = "/clients/brittany-lyons";
  const cookieName = "brittany_preview_access";
  const token = "test-brittany-preview-token";

  beforeEach(() => {
    vi.stubEnv("BRITTANY_PREVIEW_TOKEN", token);
  });

  it("exchanges the exact private link for a scoped access cookie", () => {
    const response = proxy(
      request(`${sitePath}/index.html?preview=${token}`),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `https://calebbolden.com${sitePath}/index.html`,
    );
    expect(response.headers.get("set-cookie")).toContain(
      `${cookieName}=${token}`,
    );
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Secure");
    expect(response.headers.get("set-cookie")).toContain(`Path=${sitePath}`);
    expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
  });

  it("uses the cookie for the chooser, all mockups, and their assets", () => {
    const headers = { cookie: `${cookieName}=${token}` };
    const paths = [
      `${sitePath}/index.html`,
      `${sitePath}/classic/index.html`,
      `${sitePath}/classic/site.css`,
      `${sitePath}/r2/index.html`,
      `${sitePath}/r2/r2.css`,
      `${sitePath}/r2-gold/index.html`,
      `${sitePath}/r2-gold/r2-gold.css`,
      `${sitePath}/r2-gold-preview.jpeg`,
    ];

    for (const path of paths) {
      const response = proxy(request(path, headers));
      expect(response.status).toBe(200);
      expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
    }
  });

  it("returns a plain 404 without requesting a password", () => {
    const response = proxy(request(`${sitePath}/index.html`));

    expect(response.status).toBe(404);
    expect(response.headers.get("www-authenticate")).toBeNull();
    expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
  });

  it("returns the same 404 for an incorrect or unconfigured token", () => {
    const incorrect = proxy(
      request(`${sitePath}/index.html?preview=incorrect-token`),
    );
    vi.stubEnv("BRITTANY_PREVIEW_TOKEN", "");
    const unconfigured = proxy(
      request(`${sitePath}/index.html?preview=${token}`),
    );

    expect(incorrect.status).toBe(404);
    expect(unconfigured.status).toBe(404);
  });

  it("redirects the bare site path to the chooser for returning reviewers", () => {
    const response = proxy(
      request(sitePath, { cookie: `${cookieName}=${token}` }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `https://calebbolden.com${sitePath}/index.html`,
    );
  });
});

describe("Field Good Foods previews", () => {
  const sitePath = "/clients/fieldgoodfoods/soil-to-supper";
  const cookieName = "fieldgood_soil_to_supper_access";
  const token = "test-fieldgood-preview-token";

  beforeEach(() => {
    vi.stubEnv("FIELDGOOD_PREVIEW_USER", "preview-user");
    vi.stubEnv("FIELDGOOD_PREVIEW_PASSWORD", "preview-password");
    vi.stubEnv("FIELDGOOD_SOIL_TO_SUPPER_TOKEN", token);
  });

  it("grants access from the private link and stores a scoped cookie", () => {
    const response = proxy(
      request(`${sitePath}/index.html?preview=${token}`),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain(
      `${cookieName}=${token}`,
    );
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain(
      "Path=/clients/fieldgoodfoods",
    );
    expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
  });

  it("uses the private-link cookie for pages and shared assets", () => {
    const headers = { cookie: `${cookieName}=${token}` };
    const pageResponse = proxy(
      request(`${sitePath}/shop-beef.html`, headers),
    );
    const assetResponse = proxy(
      request("/clients/fieldgoodfoods/shared/reset.css", headers),
    );

    expect(pageResponse.status).toBe(200);
    expect(assetResponse.status).toBe(200);
    expect(assetResponse.headers.get("x-robots-tag")).toBe(ROBOTS);
  });

  it("keeps the predictable URL password-protected", () => {
    const response = proxy(request(`${sitePath}/index.html`));

    expect(response.status).toBe(401);
    expect(response.headers.get("www-authenticate")).toContain("Basic");
    expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
  });

  it("rejects an incorrect private-link token", () => {
    const response = proxy(
      request(`${sitePath}/index.html?preview=incorrect-token`),
    );

    expect(response.status).toBe(401);
  });

  it("preserves Basic Auth access to the rest of the client preview", () => {
    const authorization = `Basic ${Buffer.from(
      "preview-user:preview-password",
    ).toString("base64")}`;
    const response = proxy(
      request("/clients/fieldgoodfoods/index.html", { authorization }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-robots-tag")).toBe(ROBOTS);
  });
});
