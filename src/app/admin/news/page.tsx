'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit, Eye, Calendar, User, TrendingUp, Plus, Newspaper } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  author: string;
  featured: boolean;
  tags: string[];
  imageUrl?: string | null;
}

export default function NewsManagementPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load news from database
  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNewsItems(data);
        } else {
          console.error('Failed to fetch news');
        }
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
    
    // Poll for updates every 5 seconds to sync between machines
    const interval = setInterval(loadNews, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setNewsItems(prev => prev.filter(item => item.id !== id));
        } else {
          console.error('Failed to delete news item');
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete all news items? This cannot be undone.')) {
      try {
        const response = await fetch('/api/news', {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setNewsItems([]);
        } else {
          console.error('Failed to delete all news');
        }
      } catch (error) {
        console.error('Error deleting all news:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage News</h1>
            <p className="text-gray-600">View and manage published badminton news</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/analytics">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add News
              </Button>
            </Link>
            {newsItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleDeleteAll}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </Button>
            )}
          </div>
        </div>

        {newsItems.length === 0 ? (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-12 text-center">
              <Newspaper className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No news published yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first badminton news article.</p>
              <Link href="/admin/analytics">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add News
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      {item.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <User className="w-4 h-4 mr-1" />
                      <span>By {item.author}</span>
                      <span className="mx-2">•</span>
                      <span>{item.category}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {item.content}
                    </p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardContent className="pt-0">
                    <div className="flex justify-between">
                      <Link href={`/news/${item.id}`} className="text-sm text-green-600 hover:text-green-800 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                      <div className="flex gap-2">
                        <Link href={`/admin/analytics?id=${item.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {newsItems.length} news item{newsItems.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-2">
                <Link href="/admin/analytics">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add News
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}