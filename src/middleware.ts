import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: any) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication (login page is at root "/")
  const isPublicPath = path === "/";

  // Get the authentication token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "office-next-auth.session-token",
  });

  // If user is authenticated and trying to access root (login page), redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // If user is not authenticated and trying to access any protected page, redirect to root (login)
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/about",
    "/home",
    "/contact",
    "/reports/:path*",
    "/master",
  ],
};
