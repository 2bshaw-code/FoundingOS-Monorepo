/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from "next/server";

// Restores the old login-first flow for the unified public-facing FoundingOS
// site: every route redirects to /login until the founder-auth cookie is
// present (set by app/login/page.tsx). Static assets and the login page
// itself are excluded from the check via the matcher below.
export function middleware(req: NextRequest) {
  const session = req.cookies.get("founder-auth")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next|static|favicon.ico).*)"],
};
