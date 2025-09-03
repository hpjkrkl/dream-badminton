'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Users, Trophy, Activity, DollarSign, Upload, Eye, TrendingUp, Newspaper } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalPlayers: number;
  totalCategories: number;
  lastImportDate: string | null;
  averagePrice: number;
  categoryBreakdown: Record<string, number>;
}

interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  author: string;
  featured: boolean;
  tags: string[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    // For now, we'll simulate some data
    setTimeout(() => {
      setStats({
        totalPlayers: 0,
        totalCategories: 5,
        lastImportDate: null,
        averagePrice: 12.5,
        categoryBreakdown: {
          'MS': 0,
          'WS': 0,
          'MD': 0,
          'WD': 0,
          'XD': 0
        }
      });
      setLoading(false);
    }, 1000);
    
    // Load saved news from localStorage
    const savedNews = localStorage.getItem('badmintonNews');
    if (savedNews) {
      try {
        const parsedNews = JSON.parse(savedNews);
        setNewsItems(parsedNews);
      } catch (e) {
        console.error('Failed to parse saved news', e);
      }
    }
  }, []);

  // Also listen for changes to news items
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'badmintonNews') {
        try {
          const parsedNews = JSON.parse(e.newValue || '[]');
          setNewsItems(parsedNews);
        } catch (e) {
          console.error('Failed to parse saved news', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const quickActions = [
    {
      title: 'Import New Data',
      description: 'Import player rankings from BWF',
      href: '/admin/import',
      icon: Upload,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Manage Players',
      description: 'View and edit player information',
      href: '/admin/players',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Manage News',
      description: 'View and manage published news',
      href: '/admin/news',
      icon: Newspaper,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'User Management',
      description: 'Debug users and authentication',
      href: '/admin/users',
      icon: Eye,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Dream Badminton fantasy app</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Players</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalPlayers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalCategories || 5}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                MS, WS, MD, WD, XD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats?.averagePrice || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Fantasy player price
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Import</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.lastImportDate ? 'Today' : 'None'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Data freshness
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`${action.color} text-white p-6 rounded-lg transition-colors group`}
                >
                  <div className="flex items-center gap-4">
                    <action.icon className="w-8 h-8" />
                    <div>
                      <h3 className="font-semibold text-lg">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent News */}
        {newsItems.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Recent News
              </CardTitle>
              <Link 
                href="/admin/analytics" 
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                View All →
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span>{item.category}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>By {item.author}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {item.content}
                    </p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats?.categoryBreakdown || {}).map(([category, count]) => {
                  const labels: Record<string, string> = {
                    'MS': "Men's Singles",
                    'WS': "Women's Singles", 
                    'MD': "Men's Doubles",
                    'WD': "Women's Doubles",
                    'XD': "Mixed Doubles"
                  };
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {labels[category] || category}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${count > 0 ? Math.max(10, (count / 100) * 100) : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {Object.values(stats?.categoryBreakdown || {}).every(count => count === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No players imported yet</p>
                  <Link href="/admin/import" className="text-blue-600 hover:text-blue-800 font-medium">
                    Import data to get started →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Import some data to see activity here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        {stats?.totalPlayers === 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-blue-800">
                  Welcome to the Dream Badminton admin panel! To get started:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-blue-700">
                  <li>Scrape player data from BWF rankings</li>
                  <li>Use the Import Data page to process your scraped data</li>
                  <li>Manage players and adjust prices as needed</li>
                  <li>Your fantasy app will be ready for users!</li>
                </ol>
                <div className="pt-2">
                  <Link
                    href="/admin/import"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Start Importing Data
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}