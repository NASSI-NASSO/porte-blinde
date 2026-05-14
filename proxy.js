import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

const protectedApiRoutes = ["/api/cart", "/api/orders"];
const adminApiRoutes = ["/api/products", "/api/admin"];
const adminPageRoutes = ["/admin", "/fr/admin", "/ar/admin"];
const locales = ["fr", "ar"];
const defaultLocale = "fr";

function getLocale(request) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;
  if (acceptLanguage.includes("ar")) return "ar";
  return "fr";
}

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  // --- 1. AUTHENTICATION LOGIC ---
  const isProtectedApi = protectedApiRoutes.some((route) => path.startsWith(route));
  const isAdminApi = adminApiRoutes.some(
    (route) => path.startsWith(route) && (route === "/api/admin" || request.method !== "GET")
  );
  const isAdminPage = adminPageRoutes.some((route) => path.startsWith(route));

  if (isProtectedApi || isAdminApi || isAdminPage) {
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      if (isAdminPage) return NextResponse.redirect(new URL("/login", request.url));
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      if (isAdminPage) return NextResponse.redirect(new URL("/login", request.url));
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if ((isAdminApi || isAdminPage) && payload.role !== "admin") {
      if (isAdminPage) return NextResponse.redirect(new URL("/", request.url));
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    // Pass user data to headers
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.userId);
    response.headers.set("x-user-role", payload.role);
    return response; // NOTE: for APIs we return here.
  }

  // --- 2. LOCALIZATION LOGIC ---
  // Skip API routes for i18n
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if pathname has a locale
  const pathnameHasLocale = locales.some(
    (locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to localized path
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${path}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Match all paths except internal _next, static files, images, etc.
  matcher: ["/((?!_next|.*\\.).*)"],
};
