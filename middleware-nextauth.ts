import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Protected routes
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') ||
                          nextUrl.pathname.startsWith('/teams') ||
                          nextUrl.pathname.startsWith('/profile')
  
  // Admin routes
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isAdmin = req.auth?.user?.isAdmin

  // Auth routes
  const isAuthRoute = nextUrl.pathname.startsWith('/auth/')

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Redirect non-logged-in users to sign in
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl))
  }

  // Redirect non-admin users away from admin pages
  if (isAdminRoute && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}