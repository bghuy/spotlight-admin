import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Comment out authentication checks to allow access without login
  /*
  // Get the access token from cookies
  const token = request.cookies.get("access_token")?.value

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/auth/callback', '/']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Check if the user is trying to access a protected route
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // If no token exists, redirect to the login page
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  */

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/auth/callback"],
}
