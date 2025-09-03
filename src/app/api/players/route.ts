import { NextRequest, NextResponse } from 'next/server';
import { PlayerCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const category = searchParams.get('category') as PlayerCategory | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'rank'; // rank, price, points
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Build where clause
    const where: any = {
      isActive: true
    };
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Fetch players with their latest ranking
    const players = await prisma.player.findMany({
      where,
      include: {
        rankings: {
          orderBy: { recordedDate: 'desc' },
          take: 1
        },
        stats: true
      },
      skip: offset,
      take: limit
    });
    
    // Transform and sort the data
    const transformedPlayers = players.map(player => {
      const latestRanking = player.rankings[0];
      const stats = player.stats[0];
      
      return {
        id: player.id,
        bwfId: player.bwfId,
        firstName: player.firstName,
        lastName: player.lastName,
        fullName: player.fullName,
        country: player.country,
        countryCode: player.countryCode,
        category: player.category,
        gender: player.gender,
        profileUrl: player.profileUrl,
        imageUrl: player.imageUrl,
        currentRank: latestRanking?.rank || 999,
        previousRank: latestRanking?.previousRank,
        rankChange: latestRanking?.rankChange || 0,
        bwfPoints: latestRanking?.bwfPoints || 0,
        tournamentsPlayed: latestRanking?.tournamentsPlayed || 0,
        fantasyPrice: latestRanking?.fantasyPrice || 5,
        fantasyPoints: stats?.fantasyPoints || 0,
        formRating: stats?.formRating || 5,
        winRate: stats?.winRate || 0,
        matchesPlayed: stats?.matchesPlayed || 0,
        matchesWon: stats?.matchesWon || 0
      };
    });
    
    // Sort based on parameters
    transformedPlayers.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'rank':
          compareValue = a.currentRank - b.currentRank;
          break;
        case 'price':
          compareValue = a.fantasyPrice - b.fantasyPrice;
          break;
        case 'points':
          compareValue = a.fantasyPoints - b.fantasyPoints;
          break;
        default:
          compareValue = a.currentRank - b.currentRank;
      }
      
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });
    
    // Get total count for pagination
    const totalCount = await prisma.player.count({ where });
    
    return NextResponse.json({
      success: true,
      data: transformedPlayers,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
    
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch players',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET single player by ID
export async function GET_PLAYER(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: {
        rankings: {
          orderBy: { recordedDate: 'desc' },
          take: 10 // Get last 10 rankings for trend
        },
        stats: true,
        matchesAsPlayer1: {
          where: { status: 'COMPLETED' },
          orderBy: { scheduledTime: 'desc' },
          take: 5,
          include: {
            player2: true,
            tournament: true
          }
        },
        matchesAsPlayer2: {
          where: { status: 'COMPLETED' },
          orderBy: { scheduledTime: 'desc' },
          take: 5,
          include: {
            player1: true,
            tournament: true
          }
        }
      }
    });
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    // Combine and sort recent matches
    const recentMatches = [
      ...player.matchesAsPlayer1.map(match => ({
        ...match,
        opponent: match.player2,
        playerScore: match.player1Score,
        opponentScore: match.player2Score,
        isWin: match.winnerId === player.id
      })),
      ...player.matchesAsPlayer2.map(match => ({
        ...match,
        opponent: match.player1,
        playerScore: match.player2Score,
        opponentScore: match.player1Score,
        isWin: match.winnerId === player.id
      }))
    ].sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime()).slice(0, 10);
    
    return NextResponse.json({
      success: true,
      data: {
        ...player,
        recentMatches,
        rankingHistory: player.rankings.map(r => ({
          date: r.recordedDate,
          rank: r.rank,
          points: r.bwfPoints,
          price: r.fantasyPrice
        }))
      }
    });
    
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch player',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}