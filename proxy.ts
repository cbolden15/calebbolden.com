import { NextResponse, type NextRequest } from "next/server";

const BRITTANY_PREVIEW_PATH = "/clients/brittany-lyons";
const BRITTANY_PREVIEW_TOKEN_ENV = "BRITTANY_PREVIEW_TOKEN";
const BRITTANY_PREVIEW_COOKIE = "brittany_preview_access";
const FIELDGOOD_PREVIEW_PATH = "/clients/fieldgoodfoods";
const OJA_INTERNAL_PATH = "/client-previews/oja";
const ROBOTS_HEADER =
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
  response.headers.set("X-Robots-Tag", ROBOTS_HEADER);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

function previewNotFound() {
  return withPreviewHeaders(new NextResponse("Not found", { status: 404 }));
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

  if (isWithinPath(pathname, FIELDGOOD_PREVIEW_PATH)) {
    const response =
      pathname === FIELDGOOD_PREVIEW_PATH
        ? NextResponse.rewrite(
            new URL(`${FIELDGOOD_PREVIEW_PATH}/index.html`, request.url),
          )
        : NextResponse.next();

    return withPreviewHeaders(response);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/clients/:path*", "/client-previews/:path*"],
};
