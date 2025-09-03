import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test basic database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Check if News model exists
    let newsCount = 0;
    let newsError = null;
    
    try {
      newsCount = await prisma.news.count();
    } catch (e: any) {
      newsError = e.message;
    }
    
    // Get all table names from database
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    ` as any[];
    
    return NextResponse.json({
      success: true,
      database: 'Connected',
      newsModel: newsError ? `Error: ${newsError}` : `Working (${newsCount} items)`,
      tables: tables.map((t: any) => t.tablename),
      prismaClient: 'Generated',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}