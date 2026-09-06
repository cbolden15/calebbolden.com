import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "./proxy";

const SITE_PATH = "/clients/fieldgoodfoods/soil-to-supper";
const COOKIE_NAME = "fieldgood_soil_to_supper_access";
const TOKEN = "test-preview-token";

function request(path: string, headers?: HeadersInit) {
  return new NextRequest(`https://calebbolden.com${path}`, { headers });
}

describe("Field Good Foods passwordless preview", () => {
  beforeEach(() => {
    vi.stubEnv("FIELDGOOD_PREVIEW_USER", "preview-user");
    vi.stubEnv("FIELDGOOD_PREVIEW_PASSWORD", "preview-password");
    vi.stubEnv("FIELDGOOD_SOIL_TO_SUPPER_TOKEN", TOKEN);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("grants access from the private link and stores a scoped cookie", () => {
    const response = proxy(request(`${SITE_PATH}/index.html?preview=${TOKEN}`));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(response.headers.get("set-cookie")).toContain(
      `${COOKIE_NAME}=${TOKEN}`,
    );
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain(
      "Path=/clients/fieldgoodfoods",
    );
  });

  it("uses the private-link cookie for pages and shared assets", () => {
    const headers = { cookie: `${COOKIE_NAME}=${TOKEN}` };

    const pageResponse = proxy(request(`${SITE_PATH}/shop-beef.html`, headers));
    const assetResponse = proxy(
      request("/clients/fieldgoodfoods/shared/reset.css", headers),
    );

    expect(pageResponse.status).toBe(200);
    expect(assetResponse.status).toBe(200);
    expect(assetResponse.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("keeps the predictable URL password-protected", () => {
    const response = proxy(request(`${SITE_PATH}/index.html`));

    expect(response.status).toBe(401);
    expect(response.headers.get("www-authenticate")).toContain("Basic");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("rejects an incorrect private-link token", () => {
    const response = proxy(
      request(`${SITE_PATH}/index.html?preview=incorrect-token`),
    );

    expect(response.status).toBe(401);
  });

  it("preserves basic-auth access to the rest of the client preview", () => {
    const authorization = `Basic ${Buffer.from(
      "preview-user:preview-password",
    ).toString("base64")}`;
    const response = proxy(
      request("/clients/fieldgoodfoods/index.html", { authorization }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });
});
