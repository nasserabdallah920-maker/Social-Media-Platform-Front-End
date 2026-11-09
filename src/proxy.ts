import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/verifyToken";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Static / Next internal / assets check
  if (
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/sounds") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  const isAuthRoute =
    path === "/login" ||
    path === "/signup" ||
    path.startsWith("/login/") ||
    path.startsWith("/reset-password");

  const token = request.cookies.get("access_token")?.value;
  let isValid = false;

  if (token) {
    const jwtVerify = await verifyToken(token);
    if (jwtVerify.valid) {
      isValid = true;
    }
  }

  // If token is invalid or missing, attempt refresh via backend using request cookies
  let refreshedToken: string | null = null;
  if (!isValid) {
    try {
      const cookieHeader = request.headers.get("cookie") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

      const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (data?.access_token) {
          refreshedToken = data.access_token;
          isValid = true;
        }
      }
    } catch {
      isValid = false;
    }
  }

  // 1. If user is authenticated and visits login/signup, redirect to feed (home)
  if (isValid && isAuthRoute) {
    const redirectUrl = new URL("/feed", request.url);
    const response = NextResponse.redirect(redirectUrl);
    if (refreshedToken) {
      response.cookies.set("access_token", refreshedToken, {
        path: "/",
        sameSite: "lax",
      });
    }
    return response;
  }

  // 2. If user is NOT authenticated and visits protected routes, redirect to login
  if (!isValid && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    return response;
  }

  // 3. Authenticated request continuing through
  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  if (refreshedToken) {
    response.cookies.set("access_token", refreshedToken, {
      path: "/",
      sameSite: "lax",
    });
    response.headers.set("Authorization", `Bearer ${refreshedToken}`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sounds, public static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sounds).*)",
  ],
};
