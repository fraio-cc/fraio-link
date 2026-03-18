import { NextRequest, NextResponse } from 'next/server';
import { incrementClicks, trackClick } from '@/lib/links';

export async function POST(request: NextRequest) {
  try {
    const { linkId } = await request.json();

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID gerekli' }, { status: 400 });
    }

    const forwarded = request.headers.get('x-forwarded-for');
    let ipAddress = forwarded ? forwarded.split(',')[0].trim() : 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || null;

    let country = null;
    
    if (ipAddress !== 'unknown' && 
        ipAddress !== '::1' && 
        ipAddress !== '127.0.0.1' && 
        !ipAddress.startsWith('192.168.') && 
        !ipAddress.startsWith('10.')) {
      try {
        const geoResponse = await fetch(
          `http://ip-api.com/json/${ipAddress}?fields=status,countryCode`
        );
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.status === 'success') {
            country = geoData.countryCode;
          }
        }
      } catch (error) {
        console.error('Geolocation error:', error);
      }
    }

    await Promise.all([
      incrementClicks(linkId),
      trackClick(linkId, ipAddress, userAgent, referrer, country)
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track click error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
