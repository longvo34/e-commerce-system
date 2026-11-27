import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

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

  // Phân quyền bảo vệ các trang quản trị / nhân viên
  if (token && role) {
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (
      pathname.startsWith("/staff/product") &&
      role !== "PRODUCT_STAFF" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (
      pathname.startsWith("/staff/inventory") &&
      role !== "INVENTORY_STAFF" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if (isAuthRoute && token) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "PRODUCT_STAFF") {
      return NextResponse.redirect(new URL("/staff/product", request.url));
    }
    if (role === "INVENTORY_STAFF") {
      return NextResponse.redirect(new URL("/staff/inventory", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
