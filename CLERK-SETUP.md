# Clerk Authentication Setup Guide

## Why Clerk vs NextAuth?

**Clerk Advantages:**
- 🚀 **Better Admin Management**: Easy user role management in dashboard
- 🔐 **Built-in UI Components**: Professional sign-in/sign-up forms
- 👤 **User Profiles**: Complete user management out of the box
- 📧 **Email Verification**: Automatic email workflows
- 🛡️ **Security**: Enterprise-grade security by default
- 📱 **Social Login**: Easy Google, GitHub, Discord integration

## Setup Steps

### 1. Get Clerk API Keys

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Go to **API Keys** in your Clerk dashboard
4. Copy your keys to `.env`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 2. Update Your App

I've created new Clerk-based files for you:

**New Files:**
- `middleware-clerk.ts` - Clerk route protection
- `src/components/providers-clerk.tsx` - Clerk providers
- `src/components/NavBar-clerk.tsx` - Clerk navigation
- `src/app/dashboard-clerk/page.tsx` - Clerk dashboard
- `src/app/sign-in/[[...sign-in]]/page.tsx` - Clerk sign-in
- `src/app/sign-up/[[...sign-up]]/page.tsx` - Clerk sign-up

**To activate Clerk:**

1. **Replace middleware:**
   ```bash
   mv middleware.ts middleware-nextauth.ts
   mv middleware-clerk.ts middleware.ts
   ```

2. **Replace providers in layout.tsx:**
   ```tsx
   import { ProvidersClerk } from "@/components/providers-clerk";
   // Replace <Providers> with <ProvidersClerk>
   ```

3. **Replace navigation in page.tsx:**
   ```tsx
   import { NavBarClerk } from "@/components/NavBar-clerk";
   // Replace <NavBar /> with <NavBarClerk />
   ```

### 3. Set Admin Role in Clerk

**Option A: Via Clerk Dashboard**
1. Go to your Clerk dashboard
2. Navigate to **Users**
3. Click on your user
4. Go to **Public metadata**
5. Add: `{"role": "admin"}`

**Option B: Via API** (after first sign-up)
```javascript
// You can create an admin setup API endpoint
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: { role: "admin" }
});
```

### 4. Complete Migration

**Remove NextAuth dependencies (optional):**
```bash
npm uninstall next-auth @auth/prisma-adapter
```

**Update Prisma schema (optional):**
- Remove NextAuth models: `Account`, `Session`
- Keep User model but remove NextAuth fields

## Testing the Flow

### 1. Start Development
```bash
npm run dev
```

### 2. Test Authentication
1. Visit `http://localhost:3000`
2. Click "Sign In" - should show Clerk modal
3. Create account or sign in
4. Should redirect to dashboard

### 3. Test Admin Access
1. Set your user role to "admin" in Clerk dashboard
2. Sign in - should see "Admin Panel" button
3. Click it - should access `/admin`

### 4. Test Data Import
1. As admin, go to `/admin/import`
2. Import BWF data as before
3. Check `/admin/players` to see results

## Clerk Dashboard Features

**User Management:**
- View all users
- Block/unblock users
- Edit user metadata
- View user sessions

**Organizations (if needed):**
- Create teams/leagues as organizations
- Role-based permissions within orgs

**Webhooks (for advanced sync):**
- Sync user data to your database
- React to user events

## Migration Benefits

**Before (NextAuth):**
- Manual user database management
- Custom admin role logic
- Email/password only
- Basic security

**After (Clerk):**
- Professional authentication UI
- Built-in admin dashboard
- Social logins ready
- Enterprise security
- Better user experience

## Admin Role Check

In your components, check admin status:

```tsx
import { useUser } from '@clerk/nextjs';

export function MyComponent() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

## Next Steps After Setup

1. **Test complete flow**: Sign up → Set admin role → Import data
2. **Customize Clerk**: Brand colors, logo, etc.
3. **Add social providers**: Google, GitHub in Clerk dashboard
4. **Set up webhooks**: For user sync if needed

The Clerk setup provides a much more professional authentication experience with better admin management!