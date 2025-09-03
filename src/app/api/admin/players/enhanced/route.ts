import { NextRequest, NextResponse } from 'next/server';
import { PlayerCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface EnhancedPlayerData {
  type: 'singles' | 'doubles';
  id: string;
  category: PlayerCategory;
  rank: number;
  previousRank?: number;
  rankChange: number;
  bwfPoints: number;
  fantasyPrice: number;
  tournamentsPlayed: number;
  country: string;
  countryCode: string;
  
  // Singles specific
  fullName?: string;
  bwfId?: string;
  
  // Doubles specific
  pairName?: string;
  player1?: {
    fullName: string;
    bwfId: string;
  };
  player2?: {
    fullName: string;
    bwfId: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category') as PlayerCategory | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const sortBy = searchParams.get('sortBy') || 'rank';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    const combinedData: EnhancedPlayerData[] = [];
    
    // If no category filter or singles categories, fetch singles players
    if (!category || ['MS', 'WS'].includes(category)) {
      const singlesWhere: any = {
        isActive: true,
        category: category || { in: ['MS', 'WS'] }
      };
      
      if (search) {
        singlesWhere.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { country: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const singlesPlayers = await prisma.player.findMany({
        where: singlesWhere,
        include: {
          rankings: {
            orderBy: { recordedDate: 'desc' },
            take: 1
          },
          stats: true
        },
        take: limit
      });
      
      // Transform singles players
      singlesPlayers.forEach(player => {
        const latestRanking = player.rankings[0];
        const stats = player.stats[0];
        
        if (latestRanking) {
          combinedData.push({
            type: 'singles',
            id: player.id,
            category: player.category,
            rank: latestRanking.rank,
            previousRank: latestRanking.previousRank || undefined,
            rankChange: latestRanking.rankChange,
            bwfPoints: latestRanking.bwfPoints,
            fantasyPrice: latestRanking.fantasyPrice,
            tournamentsPlayed: latestRanking.tournamentsPlayed,
            country: player.country,
            countryCode: player.countryCode,
            fullName: player.fullName,
            bwfId: player.bwfId
          });
        }
      });
    }
    
    // If no category filter or doubles categories, fetch doubles pairs
    if (!category || ['MD', 'WD', 'XD'].includes(category)) {
      const doublesWhere: any = {
        isActive: true,
        category: category || { in: ['MD', 'WD', 'XD'] }
      };
      
      const doublesPairs = await prisma.doublesPair.findMany({
        where: doublesWhere,
        include: {
          player1: true,
          player2: true,
          rankings: {
            orderBy: { recordedDate: 'desc' },
            take: 1
          }
        },
        take: limit
      });
      
      // Transform doubles pairs
      doublesPairs.forEach(pair => {
        const latestRanking = pair.rankings[0];
        
        if (latestRanking) {
          const pairName = `${pair.player1.fullName} & ${pair.player2.fullName}`;
          
          // Apply search filter for doubles
          if (search) {
            const searchLower = search.toLowerCase();
            if (!pairName.toLowerCase().includes(searchLower) && 
                !pair.player1.country.toLowerCase().includes(searchLower) &&
                !pair.player2.country.toLowerCase().includes(searchLower)) {
              return; // Skip this pair if it doesn't match search
            }
          }
          
          combinedData.push({
            type: 'doubles',
            id: pair.id,
            category: pair.category,
            rank: latestRanking.rank,
            previousRank: latestRanking.previousRank || undefined,
            rankChange: latestRanking.rankChange,
            bwfPoints: latestRanking.bwfPoints,
            fantasyPrice: latestRanking.fantasyPrice,
            tournamentsPlayed: latestRanking.tournamentsPlayed,
            country: pair.player1.country, // Use first player's country
            countryCode: pair.player1.countryCode,
            pairName,
            player1: {
              fullName: pair.player1.fullName,
              bwfId: pair.player1.bwfId
            },
            player2: {
              fullName: pair.player2.fullName,
              bwfId: pair.player2.bwfId
            }
          });
        }
      });
    }
    
    // Sort the combined data
    combinedData.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rank':
          aValue = a.rank;
          bValue = b.rank;
          break;
        case 'price':
          aValue = a.fantasyPrice;
          bValue = b.fantasyPrice;
          break;
        case 'points':
          aValue = a.bwfPoints;
          bValue = b.bwfPoints;
          break;
        default:
          aValue = a.rank;
          bValue = b.rank;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    // Get counts by category
    const categoryStats = await Promise.all([
      prisma.player.count({ where: { isActive: true, category: 'MS' } }),
      prisma.player.count({ where: { isActive: true, category: 'WS' } }),
      prisma.doublesPair.count({ where: { isActive: true, category: 'MD' } }),
      prisma.doublesPair.count({ where: { isActive: true, category: 'WD' } }),
      prisma.doublesPair.count({ where: { isActive: true, category: 'XD' } })
    ]);
    
    return NextResponse.json({
      success: true,
      data: combinedData.slice(0, limit),
      stats: {
        MS: categoryStats[0],
        WS: categoryStats[1],
        MD: categoryStats[2],
        WD: categoryStats[3],
        XD: categoryStats[4],
        total: combinedData.length
      }
    });
    
  } catch (error) {
    console.error('Enhanced players API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch players data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}