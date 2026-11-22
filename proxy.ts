import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. Các trang bắt buộc phải đăng nhập (protected)
  const isProtectedRoute =
    pathname.startsWith("/cart") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/shipping") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff");

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Nếu ĐÃ đăng nhập rồi mà vào lại trang /login hoặc /register thì chuyển về trang chủ
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
