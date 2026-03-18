import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateLink } from '@/lib/links';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { linkId, originalUrl } = await request.json();

    if (!linkId || !originalUrl) {
      return NextResponse.json(
        { error: 'Link ID ve URL gerekli' },
        { status: 400 }
      );
    }

    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(originalUrl)) {
      return NextResponse.json(
        { error: 'Geçerli bir URL girin (http:// veya https:// ile başlamalı)' },
        { status: 400 }
      );
    }

    const updatedLink = await updateLink(linkId, session.user.id, originalUrl);

    return NextResponse.json({ link: updatedLink });
  } catch (error: any) {
    console.error('Link güncelleme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Link güncellenemedi' },
      { status: 500 }
    );
  }
}
