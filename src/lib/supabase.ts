import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Plan = 'starter' | 'pro' | 'premium';
export type SubscriptionStatus = 'inactive' | 'active' | 'cancelling' | 'cancelled' | 'past_due';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: Plan;
  token_balance: number;
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
  return Math.max(0, profile.token_balance);
}

export function hasCredits(profile: Profile | null, required: number = 3): boolean {
  if (!profile) return false;
  return profile.token_balance >= required;
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

export function mapAuthError(rawMessage: string): string {
  const m = rawMessage.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Incorrect email or password. Please try again.';
  if (m.includes('email not confirmed')) return 'Please check your email and confirm your account before signing in.';
  if (m.includes('user already registered')) return 'An account with this email already exists. Try signing in instead.';
  if (m.includes('signup is not allowed') || m.includes('signups not allowed')) return 'New registrations are temporarily disabled. Please try again later.';
  if (m.includes('password') && m.includes('too short')) return 'Password must be at least 6 characters.';
  if (m.includes('password') && m.includes('weak')) return 'Password is too weak. Use a mix of letters, numbers, and symbols.';
  if (m.includes('rate limit') || m.includes('too many requests')) return 'Too many attempts. Please wait a moment and try again.';
  if (m.includes('email') && m.includes('invalid')) return 'Please enter a valid email address.';
  if (m.includes('network') || m.includes('fetch')) return 'Connection error. Please check your internet and try again.';
  return 'Something went wrong. Please try again.';
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