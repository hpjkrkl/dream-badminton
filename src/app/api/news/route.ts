import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all news
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// POST new news item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const news = await prisma.news.create({
      data: {
        title: body.title,
        category: body.category,
        content: body.content,
        author: body.author,
        featured: body.featured || false,
        tags: body.tags || [],
        imageUrl: body.imageUrl || null,
        date: body.date ? new Date(body.date) : new Date()
      }
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to create news:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}

// DELETE all news
export async function DELETE() {
  try {
    await prisma.news.deleteMany();
    return NextResponse.json({ message: 'All news deleted successfully' });
  } catch (error) {
    console.error('Failed to delete news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}