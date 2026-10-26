import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "ar"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (!LOCALES.includes(first)) {
    const accept = request.headers.get("accept-language") || "";
    const locale = accept.toLowerCase().includes("ar") ? "ar" : "en";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const headers = new Headers(request.headers);
  headers.set("x-locale", first);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
