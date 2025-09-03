'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Upload, AlertCircle, CheckCircle, Users, Trophy, Eye, Zap } from 'lucide-react';
import { PlayerCategory } from '@prisma/client';

interface DetectionResult {
  format: 'singles' | 'doubles';
  playersFound: number;
  preview: string[];
  data: any[];
}

interface ImportResult {
  success: boolean;
  message: string;
  format: 'singles' | 'doubles';
  processedCount: number;
  errorCount: number;
  players?: any[];
  errors?: Array<{ player: string; error: string }>;
}

export default function AdminImportPage() {
  const [rawData, setRawData] = useState('');
  const [category, setCategory] = useState<PlayerCategory | ''>('');
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleDataAnalysis = async () => {
    if (!rawData.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/players/import-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawData })
      });

      const data = await response.json();
      if (data.success && data.detection) {
        setDetection(data.detection);
        setResult(null); // Clear previous results
        setCategory(''); // Reset category selection
      } else {
        alert('Failed to analyze data: ' + data.error);
      }
    } catch (error) {
      alert('Error analyzing data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!detection || !category) {
      alert('Please select a category first');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/players/import-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, rawData })
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Clear the input after successful import
        setRawData('');
        setDetection(null);
        setCategory('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Import failed',
        format: 'singles',
        processedCount: 0,
        errorCount: 0,
        errors: [{ player: 'System', error: error instanceof Error ? error.message : 'Unknown error' }]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryOptions = () => {
    if (!detection) return [];
    
    if (detection.format === 'singles') {
      return [
        { value: 'MS', label: "Men's Singles" },
        { value: 'WS', label: "Women's Singles" }
      ];
    } else {
      return [
        { value: 'MD', label: "Men's Doubles" },
        { value: 'WD', label: "Women's Doubles" },
        { value: 'XD', label: "Mixed Doubles" }
      ];
    }
  };

  const sampleSinglesData = `1\t-\thttps://bwfbadminton.com/player/57945/shi-yu-qi/\tSHI\tYu Qi\thttps://extranet.bwf.sport/docs/flags-svg/china.svg\t12\t110,397
2\t-\thttps://bwfbadminton.com/player/91554/anders-antonsen/\tANTONSEN\tAnders\thttps://extranet.bwf.sport/docs/flags-svg/denmark.svg\t16\t98,613`;

  const sampleDoublesData = `1\t-\thttps://bwfbadminton.com/player/61444/kim-won-ho/\tKIM\tWon Ho\thttps://bwfbadminton.com/player/66513/seo-seung-jae/\tSEO\tSeung Jae\thttps://extranet.bwf.sport/docs/flags-svg/south-korea.svg\t12\t109,005
2\t-\thttps://bwfbadminton.com/player/56203/aaron-chia/\tCHIA\tAaron\thttps://bwfbadminton.com/player/99389/soh-wooi-yik/\tSOH\tWooi Yik\thttps://extranet.bwf.sport/docs/flags-svg/malaysia.svg\t20\t91,650`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Player Import</h1>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Smart Detection System</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Smart Import with Auto-Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Data Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Step 1: Paste Your BWF Ranking Data
              </label>
              <textarea
                value={rawData}
                onChange={(e) => {
                  setRawData(e.target.value);
                  setDetection(null); // Reset detection when data changes
                  setResult(null); // Reset results
                }}
                placeholder="Paste your scraped data here..."
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Supports both singles and doubles formats
                </p>
                <Button
                  onClick={handleDataAnalysis}
                  disabled={!rawData.trim() || isProcessing}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  Analyze Data
                </Button>
              </div>
            </div>

            {/* Step 2: Detection Results */}
            {detection && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">
                      ✓ Detected: {detection.format === 'singles' ? 'Singles Format' : 'Doubles Format'}
                    </h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Found {detection.playersFound} {detection.format === 'doubles' ? 'players' : 'players'} 
                      {detection.format === 'doubles' && ` (${detection.playersFound / 2} pairs)`}
                    </p>
                    
                    {/* Preview */}
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium text-blue-700">
                        👁 Preview Players
                      </summary>
                      <div className="mt-2 bg-white p-3 rounded border border-blue-200">
                        {detection.preview.map((player, index) => (
                          <div key={index} className="text-sm text-gray-700 py-1">
                            {index + 1}. {player}
                          </div>
                        ))}
                        {detection.preview.length < detection.playersFound && (
                          <div className="text-sm text-gray-500 italic">
                            ... and {detection.format === 'doubles' 
                              ? (detection.playersFound - detection.preview.length * 2) 
                              : (detection.playersFound - detection.preview.length)} more
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Category Selection */}
            {detection && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step 2: Select Category ({detection.format === 'singles' ? 'Choose Gender' : 'Choose Doubles Type'})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {getCategoryOptions().map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCategory(option.value as PlayerCategory)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        category === option.value
                          ? 'border-green-500 bg-green-50 text-green-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {detection.format === 'doubles' ? `${detection.playersFound / 2} pairs` : `${detection.playersFound} players`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Import Button */}
            {detection && category && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-900">Ready to Import</h3>
                    <p className="text-sm text-green-700">
                      {detection.format === 'singles' ? `${detection.playersFound} players` : `${detection.playersFound} players (${detection.playersFound / 2} pairs)`} will be imported as {getCategoryOptions().find(opt => opt.value === category)?.label}
                    </p>
                  </div>
                  <Button
                    onClick={handleImport}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Import {detection.format === 'doubles' ? 'Pairs' : 'Players'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Sample Data */}
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                📋 View Sample Data Formats
              </summary>
              <div className="mt-3 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Singles Format:</h4>
                  <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                    {sampleSinglesData}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Doubles Format:</h4>
                  <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                    {sampleDoublesData}
                  </pre>
                </div>
              </div>
            </details>

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
                        Format: {result.format} | Processed: {result.processedCount} {result.format === 'doubles' ? 'pairs' : 'players'}
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

                    {/* Success Details for Doubles */}
                    {result.success && result.format === 'doubles' && result.players && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-green-700">
                          View Imported {result.format === 'doubles' ? 'Pairs' : 'Players'}
                        </summary>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {result.players.map((item, index) => (
                            <div key={index} className="text-xs bg-white p-3 rounded border border-green-200">
                              {result.format === 'doubles' ? (
                                <>
                                  <div className="font-medium">
                                    {item.player1?.fullName} & {item.player2?.fullName}
                                  </div>
                                  <div className="text-gray-500">
                                    Rank: #{item.currentRank} | ${item.fantasyPrice}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="font-medium">{item.fullName}</div>
                                  <div className="text-gray-500">
                                    Rank: #{item.currentRank} | ${item.fantasyPrice}
                                  </div>
                                </>
                              )}
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
                  <p className="text-sm text-gray-600">Detection Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {detection ? '✓ Ready' : 'Pending'}
                  </p>
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
                  <p className="text-sm text-gray-600">Supported Formats</p>
                  <p className="text-2xl font-bold text-gray-900">Singles + Doubles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Smart Detection</p>
                  <p className="text-2xl font-bold text-gray-900">Auto</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}