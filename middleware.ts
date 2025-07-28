import { NextRequest, NextResponse } from "next/server";
import path from "path";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get("user")?.value;
  let user = null;
  try {
    user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  } catch {}

  // Protect /profile
  if (pathname.startsWith("/profile")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role === "user") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  // Protect /login
  if (pathname.startsWith("/login")) {
    if (user && user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (user && user.role === "user") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  // Protect /signup
  if (pathname.startsWith("/signup")) {
    if (user && user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (user && user.role === "user") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  // Protect API routes: only admin except for published/active and specific public POST routes
  if (pathname.startsWith("/api/")) {
    // Determine if the current API route is for contact or subscribers
    const isContactOrSubscribers =
      pathname.includes("/contact") || pathname.includes("/subscribers");

    // Allow specific public API routes (existing ones)
    const isBlogsSlug = pathname.startsWith("/api/routes/blogs/slug/");
    const isCourseIdGet =
      pathname.startsWith("/api/routes/course/") &&
      !pathname.includes("/active") &&
      !pathname.includes("/published") &&
      request.method === "GET";

    // Allow POST and OPTION PREFLIGHT to /api/routes/test as public, all other methods are admin
    const isTestRoute = pathname.startsWith("/api/routes/test");
    const isTestPost = isTestRoute && request.method === "POST" || request.method === "OPTIONS";
    // Allow GET/PUT/DELETE for /api/routes/test as admin
    const isTestOtherMethod =
      isTestRoute && (request.method === "GET" || request.method === "PUT" || request.method === "DELETE");

    if (
      pathname.includes("/published") ||
      pathname.includes("/active") ||
      pathname.includes("/login") ||
      pathname.includes("/signup") ||
      pathname.includes("/logout") ||
      pathname.includes("/public") ||
      pathname.includes("/auth") ||
      isBlogsSlug ||
      isCourseIdGet ||
      isTestPost
    ) {
      // Public, do nothing
    } else if (isContactOrSubscribers && request.method === "POST") {
      // Allow POST requests for /api/contact and /api/subscribers
      // This is for public submission (e.g., contact form, newsletter signup)
    } else if (isTestOtherMethod) {
      // GET/PUT/DELETE for /api/routes/test require admin
      if (!user || user.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else {
      // All other API routes (including GET/PUT/DELETE for contact/subscribers) require admin
      if (!user || user.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/login/:path*",
    "/signup/:path*",
    "/api/:path*",
  ],
};