'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { Users, Trophy, Activity, Settings, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardClerkPage() {
  const { isLoaded, user } = useUser();
  
  // Check if user is admin
  const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-card shadow-sm border-b dark:border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-lg">🏸</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-foreground">Dream Badminton</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-muted-foreground">
                Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </div>
              
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Dashboard</h2>
            <p className="text-gray-600 dark:text-muted-foreground">Manage your fantasy teams and compete with friends</p>
          </div>

          {/* Admin Notice */}
          {isAdmin && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Admin Access</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                You have admin privileges. You can import player data and manage the system.
              </p>
              <Link
                href="/admin/import"
                className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                Import BWF Data
              </Link>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">My Teams</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-foreground">0</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2">Create your first team</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Leagues</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-foreground">0</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2">Join competitions</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Total Points</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-foreground">0</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2">Start playing</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Credits</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-foreground">100</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2">Build your team</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Create Your First Team</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Build your ultimate badminton squad by selecting players from different categories.
                  </p>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Team
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Join a League</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Compete with friends or join public leagues to test your skills.
                  </p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Browse Leagues
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Create a team to get started</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Features */}
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Player Database</h3>
                  <p className="text-sm text-blue-700">
                    Browse and select from thousands of professional badminton players
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center mb-3">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Live Matches</h3>
                  <p className="text-sm text-green-700">
                    Real-time match updates and fantasy points tracking
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Tournaments</h3>
                  <p className="text-sm text-purple-700">
                    Participate in major tournaments and win prizes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}