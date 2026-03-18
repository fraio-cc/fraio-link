import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { statsRateLimit } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitResult = statsRateLimit(ipAddress);
    
    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        { 
          error: 'Çok fazla istek',
          message: 'Saatte en fazla 30 istek yapabilirsiniz',
          resetAt: resetDate.toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetDate.toISOString(),
          }
        }
      );
    }

    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('short_code', code)
      .single();

    if (linkError || !link) {
      return NextResponse.json(
        { error: 'Link bulunamadı' },
        { status: 404 }
      );
    }

    const { data: clicks, error: clicksError } = await supabase
      .from('link_clicks')
      .select('*')
      .eq('link_id', link.id)
      .order('clicked_at', { ascending: false });

    if (clicksError) {
      return NextResponse.json(
        { error: 'İstatistikler alınamadı' },
        { status: 500 }
      );
    }

    const totalClicks = clicks?.length || 0;
    
    const clicksByDate: Record<string, number> = {};
    clicks?.forEach(click => {
      const date = new Date(click.clicked_at).toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    const clicksByCountry: Record<string, number> = {};
    clicks?.forEach(click => {
      if (click.country) {
        clicksByCountry[click.country] = (clicksByCountry[click.country] || 0) + 1;
      }
    });

    const clicksByReferrer: Record<string, number> = {};
    clicks?.forEach(click => {
      const referrer = click.referrer || 'Direkt';
      clicksByReferrer[referrer] = (clicksByReferrer[referrer] || 0) + 1;
    });

    return NextResponse.json({
      link: {
        short_code: link.short_code,
        original_url: link.original_url,
        created_at: link.created_at,
        is_active: link.is_active,
      },
      stats: {
        total_clicks: totalClicks,
        clicks_by_date: clicksByDate,
        clicks_by_country: clicksByCountry,
        clicks_by_referrer: clicksByReferrer,
      },
      recent_clicks: clicks?.slice(0, 10).map(click => ({
        clicked_at: click.clicked_at,
        country: click.country,
        referrer: click.referrer,
      })),
    }, {
      headers: {
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
      }
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
