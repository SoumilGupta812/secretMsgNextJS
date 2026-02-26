import { NextRequest, NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  return NextResponse.redirect(new URL("/", url));
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/", "verify/:path*"],
};
