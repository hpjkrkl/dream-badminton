'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui';
import { Menu, LogIn, LogOut, User, Shield } from 'lucide-react';
import Link from 'next/link';

export function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="relative z-50 container mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
            <span className="text-white text-xl font-bold">🏸</span>
          </div>
          <div className="text-white font-bold text-2xl tracking-tight">Dream Badminton</div>
        </Link>
        
        <div className="hidden lg:flex items-center space-x-8 text-white/90">
          <a href="#" className="hover:text-white transition-all duration-300 font-medium hover:scale-105">Home</a>
          <a href="#features" className="hover:text-white transition-all duration-300 font-medium hover:scale-105">Features</a>
          <a href="#screenshots" className="hover:text-white transition-all duration-300 font-medium hover:scale-105">Screenshots</a>
          <a href="#community" className="hover:text-white transition-all duration-300 font-medium hover:scale-105">Community</a>
        </div>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              
              {/* Admin Panel Link */}
              {session.user?.isAdmin && (
                <Link
                  href="/admin"
                  className="bg-purple-500/20 backdrop-blur-md border border-purple-300/30 text-white px-3 py-2 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              )}

              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className="bg-green-500/20 backdrop-blur-md border border-green-300/30 text-white px-3 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>

              {/* Sign Out Button */}
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="glass-primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => signIn()}
                variant="glass-primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="glass-primary" size="sm" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}