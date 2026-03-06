import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";
const authRoutes = ["/sign-in", "/sign-up", "/verify"];
const protectedRoutes = ["/dashboard"];
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const isAuthRoute = authRoutes.some((route) =>
    url.pathname.startsWith(route),
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route),
  );
  if (token && (isAuthRoute || url.pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/", "/verify/:path*"],
};
