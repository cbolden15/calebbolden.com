import { NextResponse, type NextRequest } from "next/server";

const PREVIEW_PATH = "/clients/brittany-lyons";
const REALM = "Brittany Lyons preview";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
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
  if (!request.nextUrl.pathname.startsWith(PREVIEW_PATH)) {
    return NextResponse.next();
  }

  const expectedUsername = process.env.BRITTANY_PREVIEW_USER;
  const expectedPassword = process.env.BRITTANY_PREVIEW_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new NextResponse("Preview password not configured", {
      status: 503,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));

  if (
    !credentials ||
    credentials.username !== expectedUsername ||
    credentials.password !== expectedPassword
  ) {
    return unauthorized();
  }

  const response =
    request.nextUrl.pathname === PREVIEW_PATH
      ? NextResponse.rewrite(new URL(`${PREVIEW_PATH}/index.html`, request.url))
      : NextResponse.next();

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/clients/brittany-lyons/:path*"],
};
