'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Plus, Trash2, Save, Calendar, User, Trophy, TrendingUp, Image, Upload } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  author: string;
  featured: boolean;
  tags: string[];
  backgroundImage?: string; // Add this for storing image data
}

export default function AnalyticsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: '',
      category: 'Players to Watch',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: 'Admin',
      featured: false,
      tags: [],
    },
  ]);
  const [newTag, setNewTag] = useState('');

  // Load saved news from database on component mount
  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            // Don't load existing news for editing in the create form
            // This page is for creating new news, not editing existing ones
            // Existing news can be edited from the news management page
          }
        }
      } catch (error) {
        console.error('Error loading news:', error);
      }
    };
    
    loadNews();
  }, []);

  const addNewsItem = () => {
    setNewsItems([
      ...newsItems,
      {
        id: Date.now().toString(),
        title: '',
        category: 'Players to Watch',
        content: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Admin',
        featured: false,
        tags: [],
      },
    ]);
  };

  const removeNewsItem = (id: string) => {
    if (newsItems.length > 1) {
      setNewsItems(newsItems.filter(item => item.id !== id));
    }
  };

  const updateNewsItem = (id: string, field: keyof NewsItem, value: string | boolean | string[] | undefined) => {
    setNewsItems(
      newsItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addTag = (id: string) => {
    if (newTag.trim() !== '') {
      const item = newsItems.find(item => item.id === id);
      if (item && !item.tags.includes(newTag.trim())) {
        updateNewsItem(id, 'tags', [...item.tags, newTag.trim()]);
        setNewTag('');
      }
    }
  };

  const removeTag = (id: string, tagToRemove: string) => {
    const item = newsItems.find(item => item.id === id);
    if (item) {
      updateNewsItem(id, 'tags', item.tags.filter(tag => tag !== tagToRemove));
    }
  };

  // Handle image upload
  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateNewsItem(id, 'backgroundImage', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Filter out empty news items
    const validNewsItems = newsItems.filter(item => item.title.trim() !== '' || item.content.trim() !== '');
    
    try {
      // Save each news item to the database
      for (const item of validNewsItems) {
        await fetch('/api/news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });
      }
      
      console.log('Saving news items:', validNewsItems);
      alert('News items saved successfully to database!');
    } catch (error) {
      console.error('Failed to save news:', error);
      alert('Failed to save news items. Please try again.');
    }
  };

  const categories = [
    'Players to Watch',
    'Tournament News',
    'Player Rankings',
    'Injury Updates',
    'Equipment News',
    'Training Tips',
    'Other'
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Badminton News</h1>
            <p className="text-gray-600">Post recent badminton news and updates</p>
          </div>
          <Link href="/admin/news">
            <Button className="bg-gray-600 hover:bg-gray-700 text-white">
              ← Back to Manage News
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>News Posts</CardTitle>
            <Button onClick={addNewsItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add News Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {newsItems.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">News Item {index + 1}</h3>
                    {newsItems.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeNewsItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor={`title-${item.id}`} className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        id={`title-${item.id}`}
                        type="text"
                        value={item.title}
                        onChange={(e) => updateNewsItem(item.id, 'title', e.target.value)}
                        placeholder="Enter news title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor={`category-${item.id}`} className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id={`category-${item.id}`}
                        value={item.category}
                        onChange={(e) => updateNewsItem(item.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor={`date-${item.id}`} className="block text-sm font-medium text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-green-600" />
                        Date
                      </label>
                      <input
                        id={`date-${item.id}`}
                        type="date"
                        value={item.date}
                        onChange={(e) => updateNewsItem(item.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor={`author-${item.id}`} className="block text-sm font-medium text-gray-700 flex items-center">
                        <User className="w-4 h-4 mr-2 text-green-600" />
                        Author
                      </label>
                      <input
                        id={`author-${item.id}`}
                        type="text"
                        value={item.author}
                        onChange={(e) => updateNewsItem(item.id, 'author', e.target.value)}
                        placeholder="Author name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor={`content-${item.id}`} className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id={`content-${item.id}`}
                      value={item.content}
                      onChange={(e) => updateNewsItem(item.id, 'content', e.target.value)}
                      placeholder="Enter news content here..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id={`featured-${item.id}`}
                        type="checkbox"
                        checked={item.featured}
                        onChange={(e) => updateNewsItem(item.id, 'featured', e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`featured-${item.id}`} className="ml-2 block text-sm text-gray-900">
                        Featured News (will appear prominently)
                      </label>
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="border-t border-gray-200 pt-4">
                      <label className="block text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Image className="w-4 h-4 mr-2 text-green-600" />
                        Background Image (Optional)
                      </label>
                      <div className="flex items-start gap-4">
                        {item.backgroundImage ? (
                          <div className="relative">
                            <img 
                              src={item.backgroundImage} 
                              alt="Background preview" 
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => updateNewsItem(item.id, 'backgroundImage', undefined)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(item.id, e)}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-medium
                              file:bg-green-50 file:text-green-700
                              hover:file:bg-green-100"
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Upload a player image to use as background for this news article.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(item.id, tag)}
                              className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none focus:bg-green-500 focus:text-white"
                            >
                              <span className="sr-only">Remove tag</span>
                              <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag(item.id);
                            }
                          }}
                        />
                        <Button 
                          onClick={() => addTag(item.id)}
                          className="rounded-l-none bg-green-600 hover:bg-green-700"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <Save className="w-5 h-5 mr-2" />
            Publish News
          </Button>
        </div>
      </div>
    </div>
  );
}