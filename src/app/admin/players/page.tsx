'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Search, Filter, Edit, Trash2, Eye, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PlayerCategory } from '@prisma/client';

interface Player {
  id: string;
  bwfId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  country: string;
  countryCode: string;
  category: PlayerCategory;
  currentRank: number;
  previousRank?: number;
  rankChange: number;
  bwfPoints: number;
  fantasyPrice: number;
  fantasyPoints: number;
  tournamentsPlayed: number;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchPlayers();
  }, [selectedCategory, sortBy, sortOrder]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        sortBy,
        sortOrder,
        limit: '100'
      });

      const response = await fetch(`/api/players?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPlayers(data.data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlayers();
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getCategoryBadgeColor = (category: PlayerCategory) => {
    const colors: Record<PlayerCategory, string> = {
      MS: 'bg-blue-100 text-blue-700',
      WS: 'bg-pink-100 text-pink-700',
      MD: 'bg-green-100 text-green-700',
      WD: 'bg-purple-100 text-purple-700',
      XD: 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryLabel = (category: PlayerCategory) => {
    const labels: Record<PlayerCategory, string> = {
      MS: "Men's Singles",
      WS: "Women's Singles",
      MD: "Men's Doubles",
      WD: "Women's Doubles",
      XD: "Mixed Doubles"
    };
    return labels[category] || category;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Players</h1>
          <div className="text-sm text-gray-600">
            Total: {players.length} players
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="MS">Men's Singles</option>
                <option value="WS">Women's Singles</option>
                <option value="MD">Men's Doubles</option>
                <option value="WD">Women's Doubles</option>
                <option value="XD">Mixed Doubles</option>
              </select>

              {/* Sort Options */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split('-');
                  setSortBy(by);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="rank-asc">Rank (Low to High)</option>
                <option value="rank-desc">Rank (High to Low)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="points-desc">Points (High to Low)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Players Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading players...</p>
              </div>
            ) : players.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No players found. Import some data first.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        BWF Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tournaments
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              #{player.currentRank}
                            </span>
                            {getRankChangeIcon(player.rankChange)}
                            {player.rankChange !== 0 && (
                              <span className={`text-xs ${player.rankChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(player.rankChange)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {player.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {player.bwfId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{player.country}</span>
                            <span className="text-xs text-gray-500">({player.countryCode})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(player.category)}`}>
                            {player.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.bwfPoints.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-green-600">
                            ${player.fantasyPrice.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.tournamentsPlayed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-yellow-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}