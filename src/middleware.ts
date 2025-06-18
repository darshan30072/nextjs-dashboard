import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = [
    "/login",
  ];

  const token = request.cookies.get("token")?.value || "";
  
  // Redirect logged-in users trying to access login to dashboard
  if (isPublicPath.includes(path) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // Redirect root path to login if no token
  if (path === "/" && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Protect dashboard or any other private path
  if (!isPublicPath.includes(path) && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard"
  ],
};