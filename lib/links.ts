import { supabaseAdmin } from './supabase';
import { nanoid } from 'nanoid';

export interface Link {
  id: string;
  short_code: string;
  original_url: string;
  user_id: string | null;
  clicks: number;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export async function createLink(originalUrl: string, userId?: string, customCode?: string) {
  const shortCode = customCode || nanoid(7);

  if (customCode) {
    const { data: existing } = await supabaseAdmin
      .from('links')
      .select('id')
      .eq('short_code', customCode)
      .single();

    if (existing) {
      throw new Error('This short code is already taken');
    }
  }

  const { data, error } = await supabaseAdmin
    .from('links')
    .insert({
      short_code: shortCode,
      original_url: originalUrl,
      user_id: userId || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Link;
}

export async function getLinkByCode(shortCode: string) {
  const { data, error } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('short_code', shortCode)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data as Link;
}

export async function incrementClicks(linkId: string) {
  const { data: link } = await supabaseAdmin
    .from('links')
    .select('clicks')
    .eq('id', linkId)
    .single();

  if (!link) return;

  const { error } = await supabaseAdmin
    .from('links')
    .update({ 
      clicks: (link.clicks || 0) + 1,
      updated_at: new Date().toISOString() 
    })
    .eq('id', linkId);

  if (error) {
    console.error('Failed to increment clicks:', error);
  }
}

export async function trackClick(
  linkId: string,
  ipAddress?: string,
  userAgent?: string,
  referrer?: string | null,
  country?: string | null
) {
  const { error } = await supabaseAdmin
    .from('link_clicks')
    .insert({
      link_id: linkId,
      ip_address: ipAddress,
      user_agent: userAgent,
      referrer: referrer,
      country: country,
    });

  if (error) {
    console.error('Failed to track click:', error);
  }
}

export async function getUserLinks(userId: string, limit = 50) {
  const { data, error } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data as Link[];
}

export async function deleteLink(linkId: string, userId: string) {
  const { error } = await supabaseAdmin
    .from('links')
    .delete()
    .eq('id', linkId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateLink(linkId: string, userId: string, originalUrl: string) {
  const { data, error } = await supabaseAdmin
    .from('links')
    .update({
      original_url: originalUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', linkId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Link;
}
