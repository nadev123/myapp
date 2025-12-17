import { NextRequest, NextResponse } from "next/server";

// Map subdomains and custom domains to their allowed route
const ROUTE_MAP: Record<string, string> = {
  // Subdomains
  admin: "/admin",
  analytics: "/analytics",
  sales: "/sales",
  support: "/support",

  // Custom domains
  "admincustomdomain.com": "/admin",
  "analyticscustomdomain.com": "/analytics",
  "salescustomdomain.com": "/sales",
  "supportcustomdomain.com": "/support",
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  let subdomain = "";
  let allowedRoute: string | undefined;

  // Handle localhost development (allow fake subdomains like admin.localhost:3000)
  if (host.includes("localhost")) {
    const hostParts = host.split(".");
    subdomain = hostParts.length > 1 ? hostParts[0] : "";
    allowedRoute = ROUTE_MAP[subdomain];
  } else {
    const hostParts = host.split(".");
    subdomain = hostParts.length > 2 ? hostParts[0] : "";
    allowedRoute = ROUTE_MAP[subdomain] || ROUTE_MAP[host];
  }

  // Rewrite to the allowed route if exists
  if (allowedRoute) {
    const url = req.nextUrl.clone();
    url.pathname = allowedRoute;
    return NextResponse.rewrite(url);
  }

  // If no allowed route, return 404
  return new NextResponse("Not Found", { status: 404 });
}

export const config = {
  matcher: ["/:path*"],
};
