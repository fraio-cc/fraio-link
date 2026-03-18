import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { deleteLink } from '@/lib/links';

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { linkId } = await request.json();

    if (!linkId) {
      return NextResponse.json(
        { error: 'Link ID gerekli' },
        { status: 400 }
      );
    }

    await deleteLink(linkId, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Link silme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Link silinemedi' },
      { status: 500 }
    );
  }
}
