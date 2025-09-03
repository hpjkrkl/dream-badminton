/**
 * Clerk Authentication Configuration
 * 
 * These keys are embedded for shared development environment.
 * All developers will use the same Clerk application instance.
 */

export const CLERK_CONFIG = {
  // Shared development keys - safe to commit as they're for development only
  publishableKey: 'pk_test_Y3V0ZS1yYXR0bGVyLTMuY2xlcmsuYWNjb3VudHMuZGV2JA',
  secretKey: 'sk_test_ms1zTOwN6lTiOuzqdpqM0nRYVlJ6CJ0sKCdngsrZDk',
  
  // Application info for reference
  appName: 'Dream Badminton',
  environment: 'development',
  dashboardUrl: 'https://dashboard.clerk.com',
  
  // Development settings
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/dashboard', 
  afterSignOutUrl: '/',
} as const;

// Environment validation
if (typeof window !== 'undefined') {
  // Client-side validation
  console.log('🔐 Clerk Config Loaded:', {
    app: CLERK_CONFIG.appName,
    env: CLERK_CONFIG.environment,
    hasKeys: !!CLERK_CONFIG.publishableKey
  });
}

export default CLERK_CONFIG;