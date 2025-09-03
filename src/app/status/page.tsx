'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { CheckCircle, XCircle, AlertCircle, Database, Key, Users } from 'lucide-react';

interface SystemStatus {
  database: 'connected' | 'error' | 'checking';
  auth: 'configured' | 'partial' | 'error';
  adminUser: 'exists' | 'missing' | 'checking';
  playersCount: number | null;
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus>({
    database: 'checking',
    auth: 'checking',
    adminUser: 'checking',
    playersCount: null
  });

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Check database and players
      const playersResponse = await fetch('/api/players?limit=1');
      if (playersResponse.ok) {
        const playersData = await playersResponse.json();
        setStatus(prev => ({
          ...prev,
          database: 'connected',
          playersCount: playersData.pagination?.total || 0
        }));
      } else {
        setStatus(prev => ({ ...prev, database: 'error' }));
      }

      // Check auth configuration
      const authConfigured = !!process.env.NEXT_PUBLIC_NEXTAUTH_URL;
      setStatus(prev => ({
        ...prev,
        auth: authConfigured ? 'configured' : 'partial'
      }));

      // For admin user, we'll check during actual login
      setStatus(prev => ({ ...prev, adminUser: 'missing' }));

    } catch (error) {
      console.error('Status check failed:', error);
      setStatus(prev => ({
        ...prev,
        database: 'error',
        auth: 'error'
      }));
    }
  };

  const StatusIcon = ({ status }: { status: 'connected' | 'configured' | 'exists' | 'error' | 'partial' | 'missing' | 'checking' }) => {
    switch (status) {
      case 'connected':
      case 'configured':
      case 'exists':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
      case 'missing':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'checking':
        return <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
          <p className="text-gray-600">Check your Dream Badminton app setup</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Database Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-600" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusIcon status={status.database} />
                    <span className="font-medium">
                      {status.database === 'connected' ? 'Connected' : 
                       status.database === 'error' ? 'Error' : 'Checking...'}
                    </span>
                  </div>
                  {status.playersCount !== null && (
                    <p className="text-sm text-gray-600">
                      {status.playersCount} players imported
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <Key className="w-5 h-5 text-green-600" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon status={status.auth} />
                <span className="font-medium">
                  {status.auth === 'configured' ? 'Configured' :
                   status.auth === 'partial' ? 'Partial' : 'Error'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                NextAuth.js setup
              </p>
            </CardContent>
          </Card>

          {/* Admin User Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-600" />
                Admin User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon status={status.adminUser} />
                <span className="font-medium">
                  {status.adminUser === 'exists' ? 'Ready' :
                   status.adminUser === 'missing' ? 'Need Setup' : 'Checking...'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Run seed script if missing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Set up your .env file</h3>
                  <p className="text-sm text-blue-700">Create .env with DATABASE_URL, NEXTAUTH_SECRET, and admin credentials</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h3 className="font-medium text-green-900 mb-1">Run database setup</h3>
                  <code className="text-sm bg-white px-2 py-1 rounded border">npm run db:push</code>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h3 className="font-medium text-purple-900 mb-1">Create admin user</h3>
                  <code className="text-sm bg-white px-2 py-1 rounded border">npm run db:seed</code>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <div>
                  <h3 className="font-medium text-orange-900 mb-1">Test login</h3>
                  <p className="text-sm text-orange-700">Use admin@dreambadminton.com / admin123 to sign in</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="text-center space-y-4">
          <button
            onClick={checkSystemStatus}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Status
          </button>
          
          <div className="flex justify-center gap-4">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </a>
            <a
              href="/auth/signin"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Sign In →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}