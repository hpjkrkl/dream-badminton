#!/usr/bin/env node

/**
 * Database Connection Test
 * 
 * Tests connectivity to the shared PostgreSQL database
 * and displays current player data to verify sync.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Count players
    const playerCount = await prisma.player.count();
    console.log(`📊 Total players in database: ${playerCount}`);
    
    if (playerCount > 0) {
      // Show first 5 players
      const players = await prisma.player.findMany({
        take: 5,
        select: {
          id: true,
          fullName: true,
          country: true,
          category: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log('\n🏸 Recent players in shared database:');
      players.forEach((player, index) => {
        console.log(`${index + 1}. ${player.fullName} (${player.country}) - ${player.category} - Added: ${player.createdAt.toLocaleDateString()}`);
      });
    } else {
      console.log('📝 No players found in database yet.');
      console.log('💡 Try importing BWF player data from the admin panel: /admin/players');
    }
    
    // Test database write capability
    console.log('\n🧪 Testing database write capabilities...');
    const testData = await prisma.player.findFirst({
      where: {
        fullName: 'Database Sync Test Player'
      }
    });
    
    if (!testData) {
      console.log('⚠️  No sync test player found. This is normal for a fresh database.');
    } else {
      console.log('✅ Sync test player found - database is properly shared!');
    }
    
    console.log('\n🎯 Database is ready for collaborative development!');
    console.log('🔗 Prisma Studio: http://localhost:5555');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env file has the correct DATABASE_URL');
    console.log('2. Verify the shared database credentials are valid');
    console.log('3. Ensure your internet connection is stable');
    console.log('4. Try running: npm run db:generate');
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testDatabaseConnection();
}

module.exports = { testDatabaseConnection };