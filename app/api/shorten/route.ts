import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createLink } from '@/lib/links';

export async function POST(request: Request) {
  try {
    const { url, customCode } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;

    const link = await createLink(url, userId, customCode);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${link.short_code}`;

    return NextResponse.json({ 
      shortUrl,
      shortCode: link.short_code,
      originalUrl: link.original_url,
      clicks: link.clicks,
      createdAt: link.created_at
    });
  } catch (error: any) {
    console.error('Shorten error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
