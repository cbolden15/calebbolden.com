import { NextResponse, type NextRequest } from "next/server";

type PreviewSite = {
  path: string;
  realm: string;
  userEnv: string;
  passwordEnv: string;
};

type PasswordlessPreview = {
  path: string;
  assetPaths: string[];
  tokenEnv: string;
  cookieName: string;
  cookiePath: string;
};

const BRITTANY_PREVIEW_PATH = "/clients/brittany-lyons";
const BRITTANY_PREVIEW_TOKEN_ENV = "BRITTANY_PREVIEW_TOKEN";
const BRITTANY_PREVIEW_COOKIE = "brittany_preview_access";
const OJA_INTERNAL_PATH = "/client-previews/oja";
const ROBOTS_HEADER =
  "noindex, nofollow, noarchive, nosnippet, noimageindex";

const PREVIEW_SITES: PreviewSite[] = [
  {
    path: "/clients/fieldgoodfoods",
    realm: "Field Good Foods preview",
    userEnv: "FIELDGOOD_PREVIEW_USER",
    passwordEnv: "FIELDGOOD_PREVIEW_PASSWORD",
  },
];

const PASSWORDLESS_PREVIEWS: PasswordlessPreview[] = [
  {
    path: "/clients/fieldgoodfoods/soil-to-supper",
    assetPaths: ["/clients/fieldgoodfoods/shared"],
    tokenEnv: "FIELDGOOD_SOIL_TO_SUPPER_TOKEN",
    cookieName: "fieldgood_soil_to_supper_access",
    cookiePath: "/clients/fieldgoodfoods",
  },
];

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
  response.headers.set("X-Robots-Tag", ROBOTS_HEADER);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

function previewNotFound() {
  return withPreviewHeaders(new NextResponse("Not found", { status: 404 }));
}

function unauthorized(realm: string) {
  return withPreviewHeaders(
    new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
      },
    }),
  );
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

function handleBrittanyPreview(request: NextRequest) {
  const expectedToken = process.env[BRITTANY_PREVIEW_TOKEN_ENV];
  const linkToken =
    request.nextUrl.pathname === `${BRITTANY_PREVIEW_PATH}/index.html`
      ? request.nextUrl.searchParams.get("preview")
      : null;
  const cookieToken = request.cookies.get(BRITTANY_PREVIEW_COOKIE)?.value;

  if (!expectedToken) {
    return previewNotFound();
  }

  if (linkToken) {
    if (linkToken !== expectedToken) {
      return previewNotFound();
    }

    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("preview");
    const response = withPreviewHeaders(NextResponse.redirect(cleanUrl));
    response.cookies.set({
      name: BRITTANY_PREVIEW_COOKIE,
      value: expectedToken,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: BRITTANY_PREVIEW_PATH,
      maxAge: 60 * 60 * 24 * 90,
    });
    return response;
  }

  if (cookieToken !== expectedToken) {
    return previewNotFound();
  }

  if (request.nextUrl.pathname === BRITTANY_PREVIEW_PATH) {
    return withPreviewHeaders(
      NextResponse.redirect(
        new URL(`${BRITTANY_PREVIEW_PATH}/index.html`, request.url),
        307,
      ),
    );
  }

  return withPreviewHeaders(NextResponse.next());
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isWithinPath(pathname, OJA_INTERNAL_PATH)) {
    return previewNotFound();
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

  if (isWithinPath(pathname, BRITTANY_PREVIEW_PATH)) {
    return handleBrittanyPreview(request);
  }

  const passwordlessPreview = PASSWORDLESS_PREVIEWS.find(
    (preview) =>
      isWithinPath(pathname, preview.path) ||
      preview.assetPaths.some((path) => isWithinPath(pathname, path)),
  );

  if (passwordlessPreview) {
    const expectedToken = process.env[passwordlessPreview.tokenEnv];
    const isPreviewPage = isWithinPath(pathname, passwordlessPreview.path);
    const linkToken = isPreviewPage
      ? request.nextUrl.searchParams.get("preview")
      : null;
    const cookieToken = request.cookies.get(
      passwordlessPreview.cookieName,
    )?.value;

    if (
      expectedToken &&
      (linkToken === expectedToken || cookieToken === expectedToken)
    ) {
      const response = withPreviewHeaders(NextResponse.next());

      if (linkToken === expectedToken) {
        response.cookies.set({
          name: passwordlessPreview.cookieName,
          value: expectedToken,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: passwordlessPreview.cookiePath,
          maxAge: 60 * 60 * 24 * 90,
        });
      }

      return response;
    }
  }

  const site = PREVIEW_SITES.find((preview) =>
    isWithinPath(pathname, preview.path),
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

  // Next normalizes trailing slashes before this proxy runs. Rewrite the bare
  // Field Good Foods path to the index document, whose base tag owns links.
  const response =
    pathname === site.path
      ? NextResponse.rewrite(new URL(`${site.path}/index.html`, request.url))
      : NextResponse.next();

  return withPreviewHeaders(response);
}

export const config = {
  matcher: ["/clients/:path*", "/client-previews/:path*"],
};
