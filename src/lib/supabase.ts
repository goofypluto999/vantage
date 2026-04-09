import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Plan = 'starter' | 'pro' | 'premium';
export type SubscriptionStatus = 'inactive' | 'active' | 'cancelled' | 'past_due';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: Plan;
  credits_total: number;
  credits_used: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  source: string;
  converted_to_user: boolean;
  created_at: string;
}

export function getCreditsRemaining(profile: Profile | null): number {
  if (!profile) return 0;
  return Math.max(0, profile.credits_total - profile.credits_used);
}

export function hasCredits(profile: Profile | null, required: number = 2): boolean {
  if (!profile) return false;
  return getCreditsRemaining(profile) >= required;
}

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      }
    }
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    }
  });
  if (error) throw error;
  return data;
}

export function subscribeToAuthChanges(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}