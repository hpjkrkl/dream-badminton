import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/teams(.*)', '/profile(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { nextUrl } = req;
  const { userId, sessionClaims } = await auth();
  
  // Check if user is admin (from Clerk's public metadata)
  const isAdmin = sessionClaims?.public_metadata?.role === 'admin';

  // Redirect logged-in users away from auth pages
  if (isAuthRoute(req) && userId) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Protect user routes
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl));
  }

  // Protect admin routes
  if (isAdminRoute(req) && (!userId || !isAdmin)) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};