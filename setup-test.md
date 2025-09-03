# Dream Badminton Setup Guide

## Current Setup Status

✅ **Database Schema**: Complete Prisma schema with all models  
✅ **Authentication**: NextAuth.js v5 with credentials provider  
✅ **Admin Interface**: Full admin panel for data import  
✅ **API Endpoints**: Player import and management APIs  
✅ **UI Components**: Landing page with auth integration  

## Quick Setup Steps

### 1. Environment Variables
Create `.env` file in project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dream_badminton"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-long-random-secret-key-here"

# Admin credentials
ADMIN_EMAIL="admin@dreambadminton.com"
ADMIN_PASSWORD="admin123"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema (creates tables)
npm run db:push

# Create admin user
npm run db:seed
```

### 3. Start Development
```bash
npm run dev
```

## Testing the Flow

### 1. Check Status Page
Visit: `http://localhost:3000/status`
- Verify database connection
- Check authentication setup
- Confirm admin user creation

### 2. Test Authentication
Visit: `http://localhost:3000`
- Click "Sign In" in navigation
- Use credentials: `admin@dreambadminton.com` / `admin123`
- Should redirect to dashboard

### 3. Test Admin Access
After signing in as admin:
- Click "Admin Panel" button in navigation
- Should access admin dashboard at `/admin`

### 4. Test Data Import
In admin panel:
1. Go to "Import Data" 
2. Select category (e.g., "Men's Singles")
3. Paste sample BWF data:
   ```
   1	-	https://bwfbadminton.com/player/57945/shi-yu-qi/	SHI	Yu Qi	https://extranet.bwf.sport/docs/flags-svg/china.svg	12	110,397
   2	-	https://bwfbadminton.com/player/91554/anders-antonsen/	ANTONSEN	Anders	https://extranet.bwf.sport/docs/flags-svg/denmark.svg	16	98,613
   ```
4. Click "Import Players"
5. Should see success message with parsed data

### 5. View Imported Data
- Go to "Manage Players" in admin panel
- Should see imported players with ranking, pricing, etc.

## Available Routes

### Public Routes
- `/` - Landing page (marketing)
- `/status` - System status check
- `/auth/signin` - Sign in page

### Protected Routes (Requires Login)
- `/dashboard` - User dashboard

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- `/admin/import` - Data import page
- `/admin/players` - Player management

### API Endpoints
- `POST /api/admin/players/import` - Import scraped BWF data
- `GET /api/players` - Fetch players with search/filter
- `GET /api/auth/[...nextauth]` - NextAuth endpoints

## Sample BWF Data Format

The system expects tab-separated data in this format:
```
rank	ranking-change	player-url	last-name	first-name	country-flag-url	tournaments	points
```

Example:
```
1	-	https://bwfbadminton.com/player/57945/shi-yu-qi/	SHI	Yu Qi	https://extranet.bwf.sport/docs/flags-svg/china.svg	12	110,397
2	1	https://bwfbadminton.com/player/91554/anders-antonsen/	ANTONSEN	Anders	https://extranet.bwf.sport/docs/flags-svg/denmark.svg	16	98,613
```

## Next Steps After Setup

1. **Test the complete flow**: Sign in → Admin → Import data → View players
2. **Import real BWF data**: Scrape actual rankings and import
3. **Start building**: Team creation, leagues, tournaments

## Troubleshooting

**Database Connection Issues:**
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Try `npm run db:push` again

**Authentication Issues:**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your development URL
- Clear browser cookies and try again

**Admin Access Issues:**
- Ensure you ran `npm run db:seed`
- Check if admin user was created in database
- Verify isAdmin field is true

**Import Issues:**
- Check data format (tab-separated)
- Ensure BWF URLs are valid
- Check browser console for errors

## Database Commands

```bash
# View database in browser
npm run db:studio

# Reset database (careful!)
npx prisma db push --force-reset

# Create migration
npm run db:migrate

# View logs
npm run dev
```

The system is now ready for admin login and BWF data import!