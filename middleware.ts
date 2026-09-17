import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Закрываем всю админку и её API. Открыты только страница логина и роуты
// входа/выхода.
const PUBLIC_PATHS = ["/admin/login", "/api/admin/login", "/api/admin/logout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const isAuthorized = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (isAuthorized) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);

  // После входа и так попадаем на дашборд — для него параметр лишний,
  // ссылка на админку остаётся чистой.
  if (pathname !== "/admin" && pathname !== "/admin/") {
    loginUrl.searchParams.set("next", pathname);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
