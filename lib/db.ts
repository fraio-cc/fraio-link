import { supabaseAdmin } from './supabase';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  provider: 'credentials' | 'google' | 'discord';
  provider_id: string | null;
  discord_id: string | null;
  discord_username: string | null;
  created_at: string;
  updated_at: string;
}

export async function createUser(email: string, password: string, name: string) {
  const passwordHash = await bcrypt.hash(password, 12);

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      email,
      name,
      password_hash: passwordHash,
      provider: 'credentials',
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as User;
}

export async function createOrUpdateOAuthUser(
  email: string,
  name: string,
  provider: 'google' | 'discord',
  providerId: string
) {
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as User;
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      email,
      name,
      provider,
      provider_id: providerId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as User;
}

export async function findUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data as User;
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function findUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as User;
}

export async function updateUserPassword(email: string, passwordHash: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .eq('email', email)
    .select()
    .single();

  if (error) {
    throw new Error('Password update failed');
  }

  return data as User;
}

export async function linkDiscordToUser(userId: string, discordId: string, discordUsername: string) {
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id, email')
    .eq('discord_id', discordId)
    .neq('id', userId)
    .single();

  if (existingUser) {
    throw new Error('This Discord account is already linked to another user');
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({
      discord_id: discordId,
      discord_username: discordUsername,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error('Discord link failed');
  }

  return data as User;
}
