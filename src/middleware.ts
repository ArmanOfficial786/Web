import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: any) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/";

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "office-next-auth.session-token",
  });

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

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
