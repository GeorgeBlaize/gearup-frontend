import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ROLE_SEGMENT: Record<string, "CUSTOMER" | "PROVIDER" | "ADMIN"> = {
  customer: "CUSTOMER",
  provider: "PROVIDER",
  admin: "ADMIN",
}

const ROLE_HOME: Record<string, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
}

// Route-guards the dashboard tree. Real authorization is still enforced by
// gearup-backend on every request (authMiddleware/roleMiddleware); this only
// gates client-side navigation so users aren't dropped on an empty/403 page.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get("gearup_token")?.value
  const role = request.cookies.get("gearup_role")?.value

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const segment = pathname.split("/")[2]
  const requiredRole = ROLE_SEGMENT[segment]

  if (requiredRole && role !== requiredRole) {
    const home = ROLE_HOME[role ?? ""] ?? "/auth/login"
    return NextResponse.redirect(new URL(home, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
