import { NextRequest, NextResponse } from 'next/server';
import { PlayerCategory, Gender } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Type definitions for scraped data
interface ScrapedPlayerData {
  rank: number;
  rankingChange: string;
  playerUrl: string;
  firstName: string;
  lastName: string;
  countryFlagUrl: string;
  tournaments: number;
  points: string;
}

interface ImportRequest {
  category: PlayerCategory;
  players: ScrapedPlayerData[];
}

// Helper function to extract country from flag URL
function extractCountry(flagUrl: string): { country: string; countryCode: string } {
  const match = flagUrl.match(/flags-svg\/(.+)\.svg/);
  if (match) {
    const countrySlug = match[1];
    const country = countrySlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    // Map common countries to codes
    const countryCodeMap: Record<string, string> = {
      'China': 'CHN',
      'Denmark': 'DEN',
      'Thailand': 'THA',
      'Indonesia': 'INA',
      'Chinese Taipei': 'TPE',
      'France': 'FRA',
      'Singapore': 'SGP',
      'Japan': 'JPN',
      'India': 'IND',
      'Malaysia': 'MAS',
      'Korea': 'KOR',
      'England': 'ENG',
      'Germany': 'GER',
      'Spain': 'ESP',
      'Netherlands': 'NED',
      'Canada': 'CAN',
      'USA': 'USA',
      'Hong Kong': 'HKG'
    };
    
    const countryCode = countryCodeMap[country] || country.substring(0, 3).toUpperCase();
    
    return { country, countryCode };
  }
  
  return { country: 'Unknown', countryCode: 'UNK' };
}

// Helper function to determine gender based on category
function getGenderFromCategory(category: PlayerCategory): Gender {
  if (category === 'MS' || category === 'MD') {
    return Gender.MALE;
  } else if (category === 'WS' || category === 'WD') {
    return Gender.FEMALE;
  }
  // For mixed doubles, we'll need additional logic
  return Gender.MALE; // Default for now
}

// Pricing algorithm based on ranking
function calculateFantasyPrice(rank: number, category: PlayerCategory): number {
  const basePrice = 20; // Maximum price
  
  // Adjust base price for doubles (typically lower)
  const categoryMultiplier = (category === 'MD' || category === 'WD' || category === 'XD') ? 0.8 : 1;
  
  let price: number;
  
  if (rank <= 5) {
    price = basePrice;
  } else if (rank <= 10) {
    price = basePrice - 2;
  } else if (rank <= 20) {
    price = basePrice - 4;
  } else if (rank <= 30) {
    price = basePrice - 6;
  } else if (rank <= 50) {
    price = basePrice - 8;
  } else if (rank <= 75) {
    price = basePrice - 10;
  } else if (rank <= 100) {
    price = basePrice - 12;
  } else {
    price = 5; // Minimum price
  }
  
  return Math.max(5, price * categoryMultiplier); // Ensure minimum price of 5
}

// Parse rank change from string
function parseRankChange(rankingChange: string): number {
  if (!rankingChange || rankingChange === '-' || rankingChange === '') {
    return 0;
  }
  
  // Handle arrow symbols if present
  const cleanedChange = rankingChange.replace('▲', '').replace('▼', '-');
  const parsed = parseInt(cleanedChange);
  
  return isNaN(parsed) ? 0 : parsed;
}

export async function POST(request: NextRequest) {
  try {
    // In production, check for admin authentication here
    // For now, we'll proceed without auth check
    
    const body: ImportRequest = await request.json();
    const { category, players } = body;
    
    if (!category || !players || !Array.isArray(players)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const processedPlayers = [];
    const errors = [];
    
    for (const playerData of players) {
      try {
        // Extract BWF ID from URL
        const bwfIdMatch = playerData.playerUrl.match(/\/player\/(\d+)\//);
        if (!bwfIdMatch) {
          errors.push({
            player: `${playerData.firstName} ${playerData.lastName}`,
            error: 'Could not extract BWF ID from URL'
          });
          continue;
        }
        
        const bwfId = bwfIdMatch[1];
        
        // Extract country information
        const { country, countryCode } = extractCountry(playerData.countryFlagUrl);
        
        // Parse points (remove commas)
        const bwfPoints = parseInt(playerData.points.replace(/,/g, ''));
        
        // Calculate rank change
        const rankChange = parseRankChange(playerData.rankingChange);
        const previousRank = playerData.rank - rankChange;
        
        // Determine gender based on category
        const gender = getGenderFromCategory(category);
        
        // Calculate fantasy price
        const fantasyPrice = calculateFantasyPrice(playerData.rank, category);
        
        // Create or update player
        const player = await prisma.player.upsert({
          where: { bwfId },
          update: {
            firstName: playerData.firstName,
            lastName: playerData.lastName,
            fullName: `${playerData.firstName} ${playerData.lastName}`,
            country,
            countryCode,
            category,
            gender,
            profileUrl: playerData.playerUrl,
            updatedAt: new Date()
          },
          create: {
            bwfId,
            firstName: playerData.firstName,
            lastName: playerData.lastName,
            fullName: `${playerData.firstName} ${playerData.lastName}`,
            country,
            countryCode,
            category,
            gender,
            profileUrl: playerData.playerUrl
          }
        });
        
        // Create ranking record
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        await prisma.ranking.upsert({
          where: {
            playerId_recordedDate: {
              playerId: player.id,
              recordedDate: today
            }
          },
          update: {
            rank: playerData.rank,
            previousRank: previousRank > 0 ? previousRank : null,
            rankChange,
            bwfPoints,
            tournamentsPlayed: playerData.tournaments,
            fantasyPrice
          },
          create: {
            playerId: player.id,
            rank: playerData.rank,
            previousRank: previousRank > 0 ? previousRank : null,
            rankChange,
            bwfPoints,
            tournamentsPlayed: playerData.tournaments,
            fantasyPrice,
            recordedDate: today
          }
        });
        
        // Create or update player stats
        await prisma.playerStats.upsert({
          where: { playerId: player.id },
          update: {
            fantasyPoints: bwfPoints, // Initial fantasy points based on BWF points
            lastUpdated: new Date()
          },
          create: {
            playerId: player.id,
            fantasyPoints: bwfPoints
          }
        });
        
        processedPlayers.push({
          ...player,
          currentRank: playerData.rank,
          rankChange,
          bwfPoints,
          fantasyPrice
        });
        
      } catch (error) {
        errors.push({
          player: `${playerData.firstName} ${playerData.lastName}`,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${processedPlayers.length} players`,
      processedCount: processedPlayers.length,
      errorCount: errors.length,
      players: processedPlayers,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to import players',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}