import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals, static files, API routes, and the home page
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/textures") ||
    pathname.startsWith("/models") ||
    pathname.startsWith("/sounds") ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|webp|mp3|wav|gltf|glb|bin|woff|woff2|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Redirect any unknown route to home
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
