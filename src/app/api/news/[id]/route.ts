import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single news item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id }
    });
    
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// UPDATE news item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const news = await prisma.news.update({
      where: { id: params.id },
      data: {
        title: body.title,
        category: body.category,
        content: body.content,
        author: body.author,
        featured: body.featured,
        tags: body.tags,
        imageUrl: body.imageUrl,
        date: body.date ? new Date(body.date) : undefined
      }
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to update news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

// DELETE single news item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.news.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Failed to delete news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}