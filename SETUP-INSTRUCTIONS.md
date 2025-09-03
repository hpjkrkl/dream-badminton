# 🏸 Dream Badminton - Local Development Setup

## 🚀 **Quick Start Guide**

Follow these steps to run the Dream Badminton fantasy app locally on your machine.

### **Prerequisites**

Make sure you have these installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/hpjkrkl/dream-badminton.git
cd dream-badminton
```

### **Step 2: Install Dependencies**

```bash
npm install
```

This will install all required packages including:
- Next.js 15 with React 19
- Tailwind CSS
- Clerk Authentication
- Prisma ORM
- And more...

### **Step 3: Environment Setup**

The app needs environment variables to work properly. Create a `.env` file:

```bash
cp .env.example .env
```

**The `.env` file should contain:**
```env
# Database (Already configured - uses shared development database)
DATABASE_URL="postgres://9607f0c924b30f70cae243484f1c4e8013edee12dd36cdb836e4a54de80701bf:sk_LwltxLG8B3rjz1yPyJlMX@db.prisma.io:5432/postgres?sslmode=require"

# Clerk Authentication (Already configured - uses shared development keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y3V0ZS1yYXR0bGVyLTMuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_ms1zTOwN6lTiOuzqdpqM0nRYVlJ6CJ0sKCdngsrZDk
```

> **Note**: These are development credentials shared for testing. They're safe to use locally.

### **Step 4: Database Setup**

Generate the Prisma client:

```bash
npm run db:generate
```

### **Step 5: Start Development Server**

```bash
npm run dev
```

The app will start on **http://localhost:3000** (or another port if 3000 is busy).

You should see:
```
✓ Ready in 2-3s
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

### **Step 6: Open in Browser**

Navigate to **http://localhost:3000** and you should see the Dream Badminton landing page! 🎉

## 🧪 **Testing the App**

### **Authentication Flow**
1. Click "Sign In" on the landing page
2. Create a new account with Clerk
3. You'll be redirected to the dashboard

### **Admin Access (Optional)**
To test admin features:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign in with Google (use the development credentials)
3. Navigate to **Users** → Find your account
4. Add to **Public metadata**: `{"role": "admin"}`
5. Refresh the app - you should see "Admin Panel" button

### **Dark/Light Mode**
- Look for the sun/moon toggle in the navigation
- Click to switch between themes
- Enjoy smooth transitions! 🌙☀️

## 🎯 **What You Can Test**

✅ **Landing Page**: Beautiful gradient with glass morphism effects  
✅ **Authentication**: Sign up/in with Clerk  
✅ **Dashboard**: User dashboard with stats cards  
✅ **Admin Panel**: Import BWF player data (admin only)  
✅ **Dark/Light Mode**: Toggle themes with smooth animations  
✅ **Responsive Design**: Works on desktop and mobile  

## 🛠️ **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🎪 **Key Features to Explore**

### **🌟 Landing Page**
- Animated background elements
- Glass morphism design
- Responsive mobile mockups
- Call-to-action buttons

### **🏠 Dashboard** 
- Fantasy team stats
- Quick action cards
- Admin import system
- BWF player data management

### **🌙 Theme System**
- System preference detection
- Manual theme toggle
- Smooth CSS transitions
- Professional dark/light modes

### **🔐 Authentication**
- Clerk integration
- Social login support
- Role-based access control
- Professional UI components

## 🐛 **Troubleshooting**

### **Port Already in Use**
If port 3000 is busy, the app will automatically use 3001, 3002, etc.

### **Environment Variables Missing**
Make sure your `.env` file exists and has the correct values from Step 3.

### **Database Connection Issues**
The database URL should work out of the box. If issues persist, try:
```bash
npm run db:generate
```

### **Module Not Found Errors**
Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📱 **Mobile Testing**

The app is fully responsive! Test on:
- Desktop browsers
- Mobile devices
- Tablet sizes
- Different screen orientations

## 🚀 **Tech Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Glass morphism effects
- **Authentication**: Clerk
- **Database**: PostgreSQL + Prisma ORM
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion + CSS transitions

## 💡 **Tips for Development**

1. **Hot Reload**: Changes auto-refresh in development
2. **TypeScript**: Full type safety throughout
3. **Dark Mode**: Test both themes during development
4. **Mobile First**: Responsive design built-in
5. **Performance**: Optimized with Next.js 15 features

## 🤝 **Contributing**

If you want to contribute or suggest improvements:
1. Create a branch: `git checkout -b feature/your-idea`
2. Make changes and test thoroughly
3. Commit with clear messages
4. Push and create a pull request

---

**🎉 Enjoy exploring the Dream Badminton fantasy app!**

If you run into any issues, check the troubleshooting section or reach out for help.