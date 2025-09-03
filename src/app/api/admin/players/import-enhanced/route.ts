import { NextRequest, NextResponse } from 'next/server';
import { PlayerCategory, Gender } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Enhanced types for the new system
interface ParsedSinglesPlayer {
  rank: number;
  rankingChange: string;
  playerUrl: string;
  firstName: string;
  lastName: string;
  countryFlagUrl: string;
  tournaments: number;
  points: string;
}

interface ParsedDoublesPlayer {
  rank: number;
  rankingChange: string;
  player1Url: string;
  player1FirstName: string;
  player1LastName: string;
  player2Url: string;
  player2FirstName: string;
  player2LastName: string;
  countryFlagUrl: string;
  tournaments: number;
  points: string;
}

interface DetectionResult {
  format: 'singles' | 'doubles';
  playersFound: number;
  preview: string[];
  data: ParsedSinglesPlayer[] | ParsedDoublesPlayer[];
}

interface ImportRequest {
  category: PlayerCategory;
  rawData: string;
}

interface ImportSummary {
  playersProcessed: number;
  playersCreated: number;
  playersUpdated: number;
  playersSkipped: number;
  pairsProcessed?: number;
  pairsCreated?: number;
  pairsUpdated?: number;
  pairsSkipped?: number;
  changes: ChangeDetail[];
  errors: ErrorDetail[];
}

interface ChangeDetail {
  playerName: string;
  action: 'created' | 'updated' | 'skipped';
  changes?: string[];
  reason?: string;
}

interface ErrorDetail {
  player: string;
  error: string;
}

// Format detection function
function detectAndParseData(rawData: string): DetectionResult {
  const lines = rawData.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Invalid data format: Not enough lines');
  }

  // Parse first data line to determine format (check if it starts with a number)
  let firstDataLineIndex = 0;
  
  // Skip header line if the first line doesn't start with a number
  if (lines[0] && !(/^\d+/).test(lines[0].trim())) {
    firstDataLineIndex = 1;
  }
  
  if (firstDataLineIndex >= lines.length) {
    throw new Error('No data lines found');
  }
  
  const firstDataLine = lines[firstDataLineIndex].split('\t').map(col => col.trim());
  
  // Doubles format: rank, change, url1, last1, first1, url2, last2, first2, country, tournaments, points (11+ columns)
  // Singles format: rank, change, url, last, first, country, tournaments, points (8+ columns)
  
  const isDoubles = firstDataLine.length >= 11;
  
  if (isDoubles) {
    // Parse as doubles
    const parsedData: ParsedDoublesPlayer[] = [];
    const preview: string[] = [];
    
    for (let i = firstDataLineIndex; i < lines.length; i++) {
      const columns = lines[i].split('\t').map(col => col.trim());
      if (columns.length < 11) continue;
      
      try {
        const player: ParsedDoublesPlayer = {
          rank: parseInt(columns[0]) || 0,
          rankingChange: columns[1] || '-',
          player1Url: columns[2] || '',
          player1LastName: columns[3] || '',
          player1FirstName: columns[4] || '',
          player2Url: columns[5] || '',
          player2LastName: columns[6] || '',
          player2FirstName: columns[7] || '',
          countryFlagUrl: columns[8] || '',
          tournaments: parseInt(columns[9]) || 0,
          points: columns[10] || '0'
        };
        
        parsedData.push(player);
        preview.push(`${player.player1FirstName} ${player.player1LastName} & ${player.player2FirstName} ${player.player2LastName}`);
      } catch (error) {
        console.warn(`Failed to parse line ${i}: ${lines[i]}`);
      }
    }
    
    return {
      format: 'doubles',
      playersFound: parsedData.length * 2, // Two players per pair
      preview: preview.slice(0, 5), // Show first 5 pairs
      data: parsedData
    };
  } else {
    // Parse as singles
    const parsedData: ParsedSinglesPlayer[] = [];
    const preview: string[] = [];
    
    for (let i = firstDataLineIndex; i < lines.length; i++) {
      const columns = lines[i].split('\t').map(col => col.trim());
      if (columns.length < 8) continue;
      
      try {
        const player: ParsedSinglesPlayer = {
          rank: parseInt(columns[0]) || 0,
          rankingChange: columns[1] || '-',
          playerUrl: columns[2] || '',
          firstName: columns[4] || '',
          lastName: columns[3] || '',
          countryFlagUrl: columns[5] || '',
          tournaments: parseInt(columns[6]) || 0,
          points: columns[7] || '0'
        };
        
        parsedData.push(player);
        preview.push(`${player.firstName} ${player.lastName}`);
      } catch (error) {
        console.warn(`Failed to parse line ${i}: ${lines[i]}`);
      }
    }
    
    return {
      format: 'singles',
      playersFound: parsedData.length,
      preview: preview.slice(0, 10), // Show first 10 players
      data: parsedData
    };
  }
}

// Helper functions (reusing from original)
function extractCountry(flagUrl: string): { country: string; countryCode: string } {
  const match = flagUrl.match(/flags-svg\/(.+)\.svg/);
  if (match) {
    const countrySlug = match[1];
    const country = countrySlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    const countryCodeMap: Record<string, string> = {
      'China': 'CHN', 'Denmark': 'DEN', 'Thailand': 'THA', 'Indonesia': 'INA',
      'Chinese Taipei': 'TPE', 'France': 'FRA', 'Singapore': 'SGP', 'Japan': 'JPN',
      'India': 'IND', 'Malaysia': 'MAS', 'Korea': 'KOR', 'South Korea': 'KOR',
      'England': 'ENG', 'Germany': 'GER', 'Spain': 'ESP', 'Netherlands': 'NED',
      'Canada': 'CAN', 'USA': 'USA', 'Hong Kong': 'HKG'
    };
    
    const countryCode = countryCodeMap[country] || country.substring(0, 3).toUpperCase();
    return { country, countryCode };
  }
  
  return { country: 'Unknown', countryCode: 'UNK' };
}

function getGenderFromCategory(category: PlayerCategory): Gender {
  if (category === 'MS' || category === 'MD') return Gender.MALE;
  if (category === 'WS' || category === 'WD') return Gender.FEMALE;
  return Gender.MALE; // Default for mixed doubles
}

function calculateFantasyPrice(rank: number, category: PlayerCategory): number {
  const basePrice = 20;
  const categoryMultiplier = (category === 'MD' || category === 'WD' || category === 'XD') ? 0.8 : 1;
  
  let price: number;
  if (rank <= 5) price = basePrice;
  else if (rank <= 10) price = basePrice - 2;
  else if (rank <= 20) price = basePrice - 4;
  else if (rank <= 30) price = basePrice - 6;
  else if (rank <= 50) price = basePrice - 8;
  else if (rank <= 75) price = basePrice - 10;
  else if (rank <= 100) price = basePrice - 12;
  else price = 5;
  
  return Math.max(5, price * categoryMultiplier);
}

function parseRankChange(rankingChange: string): number {
  if (!rankingChange || rankingChange === '-' || rankingChange === '') return 0;
  const cleanedChange = rankingChange.replace('▲', '').replace('▼', '-');
  const parsed = parseInt(cleanedChange);
  return isNaN(parsed) ? 0 : parsed;
}

// Enhanced deduplication functions
async function findExistingSinglesPlayer(bwfId: string, fullName: string, category: PlayerCategory) {
  // First try by BWF ID
  let existing = await prisma.player.findUnique({
    where: { bwfId },
    include: {
      rankings: {
        orderBy: { recordedDate: 'desc' },
        take: 1
      }
    }
  });
  
  // If not found by BWF ID, try by name and category
  if (!existing) {
    existing = await prisma.player.findFirst({
      where: {
        fullName: {
          equals: fullName,
          mode: 'insensitive'
        },
        category,
        isActive: true
      },
      include: {
        rankings: {
          orderBy: { recordedDate: 'desc' },
          take: 1
        }
      }
    });
  }
  
  return existing;
}

function detectSinglesPlayerChanges(existing: any, newData: any): string[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  const changes: string[] = [];
  
  if (existing.firstName !== newData.firstName) changes.push(`firstName: "${existing.firstName}" → "${newData.firstName}"`);
  if (existing.lastName !== newData.lastName) changes.push(`lastName: "${existing.lastName}" → "${newData.lastName}"`);
  if (existing.fullName !== newData.fullName) changes.push(`fullName: "${existing.fullName}" → "${newData.fullName}"`);
  if (existing.country !== newData.country) changes.push(`country: "${existing.country}" → "${newData.country}"`);
  if (existing.countryCode !== newData.countryCode) changes.push(`countryCode: "${existing.countryCode}" → "${newData.countryCode}"`);
  if (existing.profileUrl !== newData.profileUrl) changes.push(`profileUrl updated`);
  if (existing.bwfId !== newData.bwfId) changes.push(`bwfId: "${existing.bwfId}" → "${newData.bwfId}"`);
  
  // Check ranking changes
  const existingRanking = existing.rankings?.[0];
  if (existingRanking) {
    if (existingRanking.rank !== newData.rank) changes.push(`rank: ${existingRanking.rank} → ${newData.rank}`);
    if (existingRanking.bwfPoints !== newData.bwfPoints) changes.push(`bwfPoints: ${existingRanking.bwfPoints} → ${newData.bwfPoints}`);
    if (existingRanking.tournamentsPlayed !== newData.tournamentsPlayed) changes.push(`tournaments: ${existingRanking.tournamentsPlayed} → ${newData.tournamentsPlayed}`);
    if (Math.abs(existingRanking.fantasyPrice - newData.fantasyPrice) > 0.1) changes.push(`price: $${existingRanking.fantasyPrice} → $${newData.fantasyPrice}`);
  } else {
    changes.push('New ranking data added');
  }
  
  return changes;
}

async function findExistingDoublesPair(bwfId1: string, bwfId2: string, category: PlayerCategory, player1Name: string, player2Name: string) {
  // First try to find both players by BWF ID
  const player1 = await prisma.player.findUnique({ where: { bwfId: bwfId1 } });
  const player2 = await prisma.player.findUnique({ where: { bwfId: bwfId2 } });
  
  let existingPair = null;
  
  if (player1 && player2) {
    // Try to find existing pair by player IDs
    existingPair = await prisma.doublesPair.findFirst({
      where: {
        OR: [
          { player1Id: player1.id, player2Id: player2.id, category },
          { player1Id: player2.id, player2Id: player1.id, category }
        ],
        isActive: true
      },
      include: {
        player1: true,
        player2: true,
        rankings: {
          orderBy: { recordedDate: 'desc' },
          take: 1
        }
      }
    });
  }
  
  // If not found by player IDs, try by names
  if (!existingPair) {
    existingPair = await prisma.doublesPair.findFirst({
      where: {
        category,
        isActive: true,
        OR: [
          {
            AND: [
              { player1: { fullName: { equals: player1Name, mode: 'insensitive' } } },
              { player2: { fullName: { equals: player2Name, mode: 'insensitive' } } }
            ]
          },
          {
            AND: [
              { player1: { fullName: { equals: player2Name, mode: 'insensitive' } } },
              { player2: { fullName: { equals: player1Name, mode: 'insensitive' } } }
            ]
          }
        ]
      },
      include: {
        player1: true,
        player2: true,
        rankings: {
          orderBy: { recordedDate: 'desc' },
          take: 1
        }
      }
    });
  }
  
  return { existingPair, player1, player2 };
}

function detectDoublesPairChanges(existingPair: any, newData: any): string[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  const changes: string[] = [];
  
  // Check ranking changes
  const existingRanking = existingPair.rankings?.[0];
  if (existingRanking) {
    if (existingRanking.rank !== newData.rank) changes.push(`rank: ${existingRanking.rank} → ${newData.rank}`);
    if (existingRanking.bwfPoints !== newData.bwfPoints) changes.push(`bwfPoints: ${existingRanking.bwfPoints} → ${newData.bwfPoints}`);
    if (existingRanking.tournamentsPlayed !== newData.tournamentsPlayed) changes.push(`tournaments: ${existingRanking.tournamentsPlayed} → ${newData.tournamentsPlayed}`);
    if (Math.abs(existingRanking.fantasyPrice - newData.fantasyPrice) > 0.1) changes.push(`price: $${existingRanking.fantasyPrice} → $${newData.fantasyPrice}`);
  } else {
    changes.push('New ranking data added');
  }
  
  return changes;
}

// Main endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // If this is a detection request (no category provided)
    if (!body.category && body.rawData) {
      try {
        const detection = detectAndParseData(body.rawData);
        return NextResponse.json({
          success: true,
          detection
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to parse data'
        }, { status: 400 });
      }
    }
    
    // If this is an import request (category provided)
    const { category, rawData }: ImportRequest = body;
    
    if (!category || !rawData) {
      return NextResponse.json(
        { error: 'Category and raw data are required for import' },
        { status: 400 }
      );
    }
    
    const detection = detectAndParseData(rawData);
    const summary: ImportSummary = {
      playersProcessed: 0,
      playersCreated: 0,
      playersUpdated: 0,
      playersSkipped: 0,
      changes: [],
      errors: []
    };
    const processedPlayers = [];
    
    if (detection.format === 'singles') {
      // Handle singles import with enhanced deduplication
      const singlesData = detection.data as ParsedSinglesPlayer[];
      summary.playersProcessed = singlesData.length;
      
      for (const playerData of singlesData) {
        try {
          const bwfIdMatch = playerData.playerUrl.match(/\/player\/(\d+)\//);
          if (!bwfIdMatch) {
            summary.errors.push({
              player: `${playerData.firstName} ${playerData.lastName}`,
              error: 'Could not extract BWF ID from URL'
            });
            continue;
          }
          
          const bwfId = bwfIdMatch[1];
          const { country, countryCode } = extractCountry(playerData.countryFlagUrl);
          const bwfPoints = parseInt(playerData.points.replace(/,/g, ''));
          const rankChange = parseRankChange(playerData.rankingChange);
          const previousRank = playerData.rank - rankChange;
          const gender = getGenderFromCategory(category);
          const fantasyPrice = calculateFantasyPrice(playerData.rank, category);
          const fullName = `${playerData.firstName} ${playerData.lastName}`;
          
          // Check for existing player
          const existing = await findExistingSinglesPlayer(bwfId, fullName, category);
          
          const newPlayerData = {
            firstName: playerData.firstName,
            lastName: playerData.lastName,
            fullName,
            country,
            countryCode,
            category,
            gender,
            profileUrl: playerData.playerUrl,
            bwfId,
            rank: playerData.rank,
            bwfPoints,
            tournamentsPlayed: playerData.tournaments,
            fantasyPrice
          };
          
          let player;
          let changeDetail: ChangeDetail;
          
          if (!existing) {
            // Create new player
            player = await prisma.player.create({
              data: {
                bwfId,
                firstName: playerData.firstName,
                lastName: playerData.lastName,
                fullName,
                country,
                countryCode,
                category,
                gender,
                profileUrl: playerData.playerUrl
              }
            });
            
            summary.playersCreated++;
            changeDetail = {
              playerName: fullName,
              action: 'created'
            };
          } else {
            // Check for changes
            const changes = detectSinglesPlayerChanges(existing, newPlayerData);
            
            if (changes.length === 0) {
              // No changes detected, skip update
              summary.playersSkipped++;
              changeDetail = {
                playerName: fullName,
                action: 'skipped',
                reason: 'No changes detected'
              };
              
              // Use existing player data
              player = existing;
              processedPlayers.push({
                ...player,
                currentRank: existing.rankings?.[0]?.rank || playerData.rank,
                rankChange: existing.rankings?.[0]?.rankChange || rankChange,
                bwfPoints: existing.rankings?.[0]?.bwfPoints || bwfPoints,
                fantasyPrice: existing.rankings?.[0]?.fantasyPrice || fantasyPrice
              });
              
              summary.changes.push(changeDetail);
              continue;
            } else {
              // Update with changes
              player = await prisma.player.update({
                where: { id: existing.id },
                data: {
                  firstName: playerData.firstName,
                  lastName: playerData.lastName,
                  fullName,
                  country,
                  countryCode,
                  category,
                  gender,
                  profileUrl: playerData.playerUrl,
                  bwfId, // Update BWF ID if it changed
                  updatedAt: new Date()
                }
              });
              
              summary.playersUpdated++;
              changeDetail = {
                playerName: fullName,
                action: 'updated',
                changes
              };
            }
          }
          
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
              rankChange, bwfPoints,
              tournamentsPlayed: playerData.tournaments,
              fantasyPrice
            },
            create: {
              playerId: player.id,
              rank: playerData.rank,
              previousRank: previousRank > 0 ? previousRank : null,
              rankChange, bwfPoints,
              tournamentsPlayed: playerData.tournaments,
              fantasyPrice,
              recordedDate: today
            }
          });
          
          summary.changes.push(changeDetail);
          
          processedPlayers.push({
            ...player,
            currentRank: playerData.rank,
            rankChange,
            bwfPoints,
            fantasyPrice
          });
          
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
          summary.errors.push({
            player: `${playerData.firstName} ${playerData.lastName}`,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    } else {
      // Handle doubles import with enhanced deduplication
      const doublesData = detection.data as ParsedDoublesPlayer[];
      summary.pairsProcessed = doublesData.length;
      summary.pairsCreated = 0;
      summary.pairsUpdated = 0;
      summary.pairsSkipped = 0;
      
      for (const pairData of doublesData) {
        try {
          // Extract BWF IDs for both players
          const bwfId1Match = pairData.player1Url.match(/\/player\/(\d+)\//);
          const bwfId2Match = pairData.player2Url.match(/\/player\/(\d+)\//);
          
          if (!bwfId1Match || !bwfId2Match) {
            summary.errors.push({
              player: `${pairData.player1FirstName} ${pairData.player1LastName} & ${pairData.player2FirstName} ${pairData.player2LastName}`,
              error: 'Could not extract BWF IDs from URLs'
            });
            continue;
          }
          
          const bwfId1 = bwfId1Match[1];
          const bwfId2 = bwfId2Match[1];
          const { country, countryCode } = extractCountry(pairData.countryFlagUrl);
          const bwfPoints = parseInt(pairData.points.replace(/,/g, ''));
          const rankChange = parseRankChange(pairData.rankingChange);
          const previousRank = pairData.rank - rankChange;
          const fantasyPrice = calculateFantasyPrice(pairData.rank, category);
          
          // Determine gender for each player based on category
          let gender1 = Gender.MALE, gender2 = Gender.MALE;
          if (category === 'WD') {
            gender1 = Gender.FEMALE;
            gender2 = Gender.FEMALE;
          } else if (category === 'XD') {
            // For mixed doubles, assume first player is male, second is female (can be refined later)
            gender1 = Gender.MALE;
            gender2 = Gender.FEMALE;
          }
          
          const player1FullName = `${pairData.player1FirstName} ${pairData.player1LastName}`;
          const player2FullName = `${pairData.player2FirstName} ${pairData.player2LastName}`;
          const pairName = `${player1FullName} & ${player2FullName}`;
          
          // Check for existing pair and players using enhanced logic
          const { existingPair, player1: existingPlayer1, player2: existingPlayer2 } = 
            await findExistingDoublesPair(bwfId1, bwfId2, category, player1FullName, player2FullName);
            
          let player1, player2, pair;
          let changeDetail: ChangeDetail;
          
          if (!existingPair) {
            // Create new pair - first ensure both players exist
            player1 = existingPlayer1 || await prisma.player.create({
              data: {
                bwfId: bwfId1,
                firstName: pairData.player1FirstName,
                lastName: pairData.player1LastName,
                fullName: player1FullName,
                country, countryCode, category, gender: gender1,
                profileUrl: pairData.player1Url
              }
            });
            
            player2 = existingPlayer2 || await prisma.player.create({
              data: {
                bwfId: bwfId2,
                firstName: pairData.player2FirstName,
                lastName: pairData.player2LastName,
                fullName: player2FullName,
                country, countryCode, category, gender: gender2,
                profileUrl: pairData.player2Url
              }
            });
            
            // Create new pair
            pair = await prisma.doublesPair.create({
              data: {
                player1Id: player1.id,
                player2Id: player2.id,
                category,
                isActive: true
              }
            });
            
            summary.pairsCreated++;
            changeDetail = {
              playerName: pairName,
              action: 'created'
            };
          } else {
            // Check for changes in the existing pair
            const existingRanking = existingPair.rankings?.[0];
            const newRankingData = {
              rank: pairData.rank,
              bwfPoints,
              tournamentsPlayed: pairData.tournaments,
              fantasyPrice
            };
            
            const changes = detectDoublesPairChanges(existingPair, newRankingData);
            
            if (changes.length === 0) {
              // No changes detected, skip update
              summary.pairsSkipped++;
              changeDetail = {
                playerName: pairName,
                action: 'skipped',
                reason: 'No changes detected'
              };
              
              // Use existing data
              pair = existingPair;
              player1 = existingPair.player1;
              player2 = existingPair.player2;
              
              processedPlayers.push({
                pair,
                player1,
                player2,
                currentRank: existingRanking?.rank || pairData.rank,
                rankChange: existingRanking?.rankChange || rankChange,
                bwfPoints: existingRanking?.bwfPoints || bwfPoints,
                fantasyPrice: existingRanking?.fantasyPrice || fantasyPrice
              });
              
              summary.changes.push(changeDetail);
              continue;
            } else {
              // Update pair (no actual pair data changes, just ranking)
              pair = existingPair;
              player1 = existingPair.player1;
              player2 = existingPair.player2;
              
              summary.pairsUpdated++;
              changeDetail = {
                playerName: pairName,
                action: 'updated',
                changes
              };
            }
          }
          
          // Handle ranking data (always update/create ranking)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Create/update doubles ranking
          await prisma.doublesRanking.upsert({
            where: {
              pairId_recordedDate: {
                pairId: pair.id,
                recordedDate: today
              }
            },
            update: {
              rank: pairData.rank,
              previousRank: previousRank > 0 ? previousRank : null,
              rankChange, bwfPoints,
              tournamentsPlayed: pairData.tournaments,
              fantasyPrice
            },
            create: {
              pairId: pair.id,
              rank: pairData.rank,
              previousRank: previousRank > 0 ? previousRank : null,
              rankChange, bwfPoints,
              tournamentsPlayed: pairData.tournaments,
              fantasyPrice,
              recordedDate: today
            }
          });
          
          summary.changes.push(changeDetail);
          
          processedPlayers.push({
            pair,
            player1,
            player2,
            currentRank: pairData.rank,
            rankChange,
            bwfPoints,
            fantasyPrice
          });
          
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
          summary.errors.push({
            player: `${pairData.player1FirstName} ${pairData.player1LastName} & ${pairData.player2FirstName} ${pairData.player2LastName}`,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: detection.format === 'doubles' 
        ? `Successfully processed ${summary.pairsProcessed} pairs (${summary.pairsCreated} created, ${summary.pairsUpdated} updated, ${summary.pairsSkipped} skipped)`
        : `Successfully processed ${summary.playersProcessed} players (${summary.playersCreated} created, ${summary.playersUpdated} updated, ${summary.playersSkipped} skipped)`,
      format: detection.format,
      summary,
      players: processedPlayers
    });
    
  } catch (error) {
    console.error('Enhanced import error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process import',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}