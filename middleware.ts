import { NextResponse } from "next/server";

/**
 * Coming soon é gated em Server Components (Prisma não roda no Edge).
 * Auth.js protege /admin no V3 — o matcher já está reservado.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
