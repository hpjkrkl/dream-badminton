'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  author: string;
  featured: boolean;
  tags: string[];
  backgroundImage?: string;
}

export default function NewsViewPage({ params }: { params: { id: string } }) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewsItem = async () => {
      try {
        const response = await fetch(`/api/news/${params.id}`);
        if (response.ok) {
          const item = await response.json();
          setNewsItem(item);
        } else if (response.status === 404) {
          setError('News item not found');
        } else {
          setError('Failed to load news item');
        }
      } catch (e) {
        console.error('Failed to load news', e);
        setError('Failed to load news item');
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure params are available
    const timer = setTimeout(() => {
      loadNewsItem();
    }, 10);

    return () => clearTimeout(timer);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">News Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The requested news article could not be found.'}</p>
            <Link href="/admin/news">
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News Management
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/news">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Manage News
            </Button>
          </Link>
        </div>

        {/* News Article */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with Background Image */}
          {newsItem.backgroundImage ? (
            <div className="relative h-64">
              <img 
                src={newsItem.backgroundImage} 
                alt="News background" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative z-10 bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{newsItem.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(newsItem.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>By {newsItem.author}</span>
                  </div>
                  <span className="bg-green-600 bg-opacity-80 px-2 py-1 rounded">
                    {newsItem.category}
                  </span>
                  {newsItem.featured && (
                    <span className="bg-yellow-500 bg-opacity-80 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{newsItem.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(newsItem.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>By {newsItem.author}</span>
                </div>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                  {newsItem.category}
                </span>
                {newsItem.featured && (
                  <span className="bg-yellow-500 bg-opacity-80 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="p-6">
            <div className="prose max-w-none mb-6">
              {newsItem.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {newsItem.tags.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}