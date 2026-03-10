import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiLimiter, loginLimiter } from "./lib/rateLimiter";
import { getIdentifier } from "./lib/identifier";
export { default } from "next-auth/middleware";
const authRoutes = ["/sign-in", "/sign-up", "/verify"];
const protectedRoutes = ["/dashboard"];
const loginRoute = ["/api/auth/callback/credentials"];
const suggestionsRoute = ["/api/suggest-messages"];
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const isAuthRoute = authRoutes.some((route) =>
    url.pathname.startsWith(route),
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route),
  );
  const isLoginRoute = loginRoute.some((route) =>
    url.pathname.startsWith(route),
  );
  const isSuggestionsRoute = suggestionsRoute.some((route) =>
    url.pathname.startsWith(route),
  );
  if (token && (isAuthRoute || url.pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  const identifier = await getIdentifier();
  try {
    if (isSuggestionsRoute) {
      const { success, reset } = await apiLimiter.limit(identifier);
      if (!success) {
        return Response.json(
          { success: false, message: "Rate limit exceeded" },
          {
            status: 429,
            headers: {
              "X-RateLimit-Reset": reset.toString(),
            },
          },
        );
      }
    }
  } catch (e) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
    "/",
    "/verify/:path*",
    "/api/:path*",
  ],
};
