# Solution: Port Conflict Issue

## The Problem
The error "Failed to fetch news" happens because there are multiple Next.js servers running on different ports:
- Port 3000: Old server (might be stuck or from another project)
- Port 3001: New server with the working API

## Quick Fix for Your Friend

### Option 1: Kill all Next.js processes and restart (RECOMMENDED)
```bash
# 1. Kill ALL Next.js processes
pkill -f "next-server" || killall node

# 2. Wait a moment
sleep 2

# 3. Start fresh
npm run dev
```

Now open http://localhost:3000 (it should use port 3000 now)

### Option 2: Use port 3001
If port 3000 is still busy, your friend can:
1. Access the app at http://localhost:3001 instead
2. The API will work on port 3001

### Option 3: Find and kill the process on port 3000
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the specific process (replace PID with the actual number)
kill -9 [PID]

# Then restart
npm run dev
```

## Complete Setup Steps for Your Friend

```bash
# 1. Stop everything
pkill -f "next-server" || killall node

# 2. Make sure .env file exists with:
cat .env
# Should show DATABASE_URL and CLERK keys

# 3. Sync database
npx prisma generate
npx prisma db push --accept-data-loss

# 4. Start fresh
npm run dev

# 5. Open browser
# Go to http://localhost:3000/admin/news
```

## Test if it's working
```bash
# Test the API directly
curl http://localhost:3000/api/news

# If port 3000 doesn't work, try:
curl http://localhost:3001/api/news
```

## Why This Happens
- Multiple Next.js servers can run simultaneously on different ports
- The old server on port 3000 might not have the updated API routes
- The new server (with your changes) starts on port 3001 when 3000 is busy

## Prevention
Always kill old servers before starting new ones:
```bash
# Add this to package.json scripts:
"dev:fresh": "pkill -f 'next-server' ; next dev --turbopack"
```

Then use `npm run dev:fresh` to always start clean.