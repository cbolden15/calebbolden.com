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

function unauthorized(realm: string) {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
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
  const site = PREVIEW_SITES.find((s) =>
    request.nextUrl.pathname.startsWith(s.path),
  );

  if (!site) {
    return NextResponse.next();
  }

  const expectedUsername = process.env[site.userEnv];
  const expectedPassword = process.env[site.passwordEnv];

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
    return unauthorized(site.realm);
  }

  const response =
    request.nextUrl.pathname === site.path
      ? NextResponse.rewrite(new URL(`${site.path}/index.html`, request.url))
      : NextResponse.next();

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/clients/brittany-lyons/:path*", "/clients/fieldgoodfoods/:path*"],
};
