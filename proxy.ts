import { NextResponse, type NextRequest } from "next/server";

type PreviewSite = {
  path: string;
  realm: string;
  userEnv: string;
  passwordEnv: string;
};

const PREVIEW_SITES: PreviewSite[] = [
  {
    path: "/clients/brittany-lyons",
    realm: "Brittany Lyons preview",
    userEnv: "BRITTANY_PREVIEW_USER",
    passwordEnv: "BRITTANY_PREVIEW_PASSWORD",
  },
  {
    path: "/clients/fieldgoodfoods",
    realm: "Field Good Foods preview",
    userEnv: "FIELDGOOD_PREVIEW_USER",
    passwordEnv: "FIELDGOOD_PREVIEW_PASSWORD",
  },
];

const OJA_INTERNAL_PATH = "/client-previews/oja";
const PREVIEW_ROBOTS_POLICY =
  "noindex, nofollow, noarchive, nosnippet, noimageindex";

function isWithinPath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function normalizePublicPreviewPath(value: string | undefined) {
  if (!value) return null;

  const path = value.replace(/\/+$/, "");
  if (!/^\/clients\/[a-z0-9-]{24,}$/i.test(path)) return null;

  return path;
}

function withPreviewHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", PREVIEW_ROBOTS_POLICY);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

function unauthorized(realm: string) {
  return withPreviewHeaders(new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
    },
  }));
}

function parseBasicAuth(header: string | null) {
  if (!header) return null;

  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return null;

  try {
    const decoded = atob(encoded);
    const separator = decoded.indexOf(":");
    if (separator === -1) return null;

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isWithinPath(pathname, OJA_INTERNAL_PATH)) {
    return withPreviewHeaders(new NextResponse("Not found", { status: 404 }));
  }

  const ojaPublicPath = normalizePublicPreviewPath(
    process.env.OJA_PREVIEW_PATH,
  );

  if (ojaPublicPath && isWithinPath(pathname, ojaPublicPath)) {
    if (pathname === ojaPublicPath) {
      return withPreviewHeaders(
        NextResponse.redirect(
          new URL(`${ojaPublicPath}/index.html`, request.url),
          307,
        ),
      );
    }

    const internalPath = `${OJA_INTERNAL_PATH}${pathname.slice(ojaPublicPath.length)}`;
    return withPreviewHeaders(
      NextResponse.rewrite(new URL(internalPath, request.url)),
    );
  }

  const site = PREVIEW_SITES.find((s) =>
    isWithinPath(pathname, s.path),
  );

  if (!site) {
    return NextResponse.next();
  }

  const expectedUsername = process.env[site.userEnv];
  const expectedPassword = process.env[site.passwordEnv];

  if (!expectedUsername || !expectedPassword) {
    return withPreviewHeaders(
      new NextResponse("Preview password not configured", { status: 503 }),
    );
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));

  if (
    !credentials ||
    credentials.username !== expectedUsername ||
    credentials.password !== expectedPassword
  ) {
    return unauthorized(site.realm);
  }

  // Next normalizes trailing slashes BEFORE this proxy runs, so directory-style
  // URLs can't be served here. The bare path rewrites to index.html; that page
  // carries a <base href> so its relative links resolve correctly.
  const response =
    pathname === site.path
      ? NextResponse.rewrite(new URL(`${site.path}/index.html`, request.url))
      : NextResponse.next();

  return withPreviewHeaders(response);
}

export const config = {
  matcher: ["/clients/:path*", "/client-previews/:path*"],
};
