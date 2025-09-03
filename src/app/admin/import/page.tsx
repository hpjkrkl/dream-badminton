'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Upload, AlertCircle, CheckCircle, Users, Trophy } from 'lucide-react';
import { PlayerCategory } from '@prisma/client';

interface ImportResult {
  success: boolean;
  message: string;
  processedCount: number;
  errorCount: number;
  players?: any[];
  errors?: Array<{ player: string; error: string }>;
}

export default function AdminImportPage() {
  const [rawData, setRawData] = useState('');
  const [category, setCategory] = useState<PlayerCategory>('MS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const parseRawData = (data: string) => {
    const lines = data.trim().split('\n');
    const players = [];

    for (const line of lines) {
      const parts = line.split('\t').map(p => p.trim());
      
      if (parts.length >= 8) {
        const rank = parseInt(parts[0]);
        if (!isNaN(rank)) {
          players.push({
            rank,
            rankingChange: parts[1],
            playerUrl: parts[2],
            lastName: parts[3],
            firstName: parts[4],
            countryFlagUrl: parts[5],
            tournaments: parseInt(parts[6]) || 0,
            points: parts[7]
          });
        }
      }
    }

    return players;
  };

  const handleImport = async () => {
    if (!rawData.trim()) {
      alert('Please paste the scraped data first');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const players = parseRawData(rawData);
      
      if (players.length === 0) {
        alert('No valid player data found. Please check the format.');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('/api/admin/players/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, players })
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Clear the input after successful import
        setRawData('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Import failed',
        processedCount: 0,
        errorCount: 0,
        errors: [{ player: 'System', error: error instanceof Error ? error.message : 'Unknown error' }]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleData = `1\t-\thttps://bwfbadminton.com/player/57945/shi-yu-qi/\tSHI\tYu Qi\thttps://extranet.bwf.sport/docs/flags-svg/china.svg\t12\t110,397
2\t-\thttps://bwfbadminton.com/player/91554/anders-antonsen/\tANTONSEN\tAnders\thttps://extranet.bwf.sport/docs/flags-svg/denmark.svg\t16\t98,613`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Import Player Data</h1>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Admin Panel</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import BWF Ranking Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlayerCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MS">Men's Singles</option>
                <option value="WS">Women's Singles</option>
                <option value="MD">Men's Doubles</option>
                <option value="WD">Women's Doubles</option>
                <option value="XD">Mixed Doubles</option>
              </select>
            </div>

            {/* Data Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scraped Data (Tab-separated)
              </label>
              <textarea
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                placeholder="Paste your scraped data here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Format: rank → ranking-change → player-url → last-name → first-name → country-flag-url → tournaments → points
              </p>
            </div>

            {/* Sample Data */}
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                View Sample Format
              </summary>
              <pre className="mt-3 text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                {sampleData}
              </pre>
            </details>

            {/* Import Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleImport}
                disabled={isProcessing || !rawData.trim()}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import Players
                  </>
                )}
              </Button>
              
              {rawData && (
                <span className="text-sm text-gray-500">
                  {parseRawData(rawData).length} players detected
                </span>
              )}
            </div>

            {/* Results */}
            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                      {result.message}
                    </h3>
                    
                    <div className="mt-2 space-y-1 text-sm">
                      <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                        Processed: {result.processedCount} players
                      </p>
                      {result.errorCount > 0 && (
                        <p className="text-red-700">
                          Errors: {result.errorCount}
                        </p>
                      )}
                    </div>

                    {/* Error Details */}
                    {result.errors && result.errors.length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-red-700">
                          View Error Details
                        </summary>
                        <div className="mt-2 space-y-1">
                          {result.errors.map((error, index) => (
                            <div key={index} className="text-xs text-red-600">
                              {error.player}: {error.error}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    {/* Imported Players */}
                    {result.players && result.players.length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-green-700">
                          View Imported Players
                        </summary>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {result.players.map((player, index) => (
                            <div key={index} className="text-xs bg-white p-2 rounded border border-green-200">
                              <div className="font-medium">{player.fullName}</div>
                              <div className="text-gray-500">
                                Rank: #{player.currentRank} | ${player.fantasyPrice}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Players</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Import</p>
                  <p className="text-2xl font-bold text-gray-900">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}