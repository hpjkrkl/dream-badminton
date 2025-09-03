'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Users, Shield, Mail, Calendar, RefreshCw, ExternalLink } from 'lucide-react';

interface UserInfo {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  isAdmin: boolean;
  lastSignIn: string | null;
}

export default function AdminUsersPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (user) {
      // Extract user information from current Clerk session
      const userInfo: UserInfo = {
        id: user.id,
        name: user.firstName || user.fullName,
        email: user.primaryEmailAddress?.emailAddress || 'No email',
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        isAdmin: (user.publicMetadata as { role?: string })?.role === 'admin',
        lastSignIn: user.lastSignInAt?.toISOString() || null
      };
      
      setCurrentUserInfo(userInfo);
    }
  }, [user]);

  const refreshUserData = () => {
    setLoading(true);
    // Force re-fetch user data
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">User Management</h1>
            <p className="text-gray-600 dark:text-muted-foreground">Debug user authentication and access</p>
          </div>
          
          <button
            onClick={refreshUserData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Quick Links */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Clerk Dashboard Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-blue-800 dark:text-blue-300">
                To see all users or manage permissions:
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://dashboard.clerk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Clerk Dashboard
                </a>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Look for: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">pk_test_Y3V0ZS1yYXR0bGVyLTM...</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Current User Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentUserInfo ? (
              <div className="space-y-6">
                {/* User Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-muted-foreground">User ID</label>
                      <p className="font-mono text-sm bg-gray-100 dark:bg-muted p-2 rounded">
                        {currentUserInfo.id}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Name</label>
                      <p className="text-lg font-semibold">
                        {currentUserInfo.name || 'No name set'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <p className="text-lg">
                        {currentUserInfo.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-muted-foreground flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Admin Status
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          currentUserInfo.isAdmin 
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                        }`}>
                          {currentUserInfo.isAdmin ? 'Admin User' : 'Regular User'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Account Created
                      </label>
                      <p className="text-sm">
                        {formatDate(currentUserInfo.createdAt)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Last Sign In</label>
                      <p className="text-sm">
                        {currentUserInfo.lastSignIn 
                          ? formatDate(currentUserInfo.lastSignIn)
                          : 'Current session'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Instructions */}
                {!currentUserInfo.isAdmin && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
                      Grant Admin Access
                    </h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                      To make this user an admin, add the following to their public metadata in Clerk Dashboard:
                    </p>
                    <code className="bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-3 py-1 rounded text-sm">
                      {`{"role": "admin"}`}
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
                <p className="text-gray-500 dark:text-muted-foreground">Loading user information...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle>User Not Visible in Clerk Dashboard?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-foreground">Common Solutions:</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">1.</span>
                      <span>Refresh the Clerk Dashboard page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">2.</span>
                      <span>Check you're in the right application</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">3.</span>
                      <span>Verify Development mode (not Production)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">4.</span>
                      <span>Search by email address</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-foreground">Debug Info:</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>App Name:</strong> Dream Badminton</p>
                    <p><strong>Environment:</strong> Development</p>
                    <p><strong>Publishable Key:</strong> pk_test_Y3V0ZS1yYXR0bGVy...</p>
                    <p><strong>Current User:</strong> {currentUserInfo?.email || 'Loading...'}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-border">
                <p className="text-sm text-gray-600 dark:text-muted-foreground mb-3">
                  <strong>Still having issues?</strong> See the detailed troubleshooting guide:
                </p>
                <a
                  href="https://github.com/hpjkrkl/dream-badminton/blob/main/CLERK-TROUBLESHOOTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  View CLERK-TROUBLESHOOTING.md
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}