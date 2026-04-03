import { createClient } from '@supabase/supabase-js';

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

export interface Analysis {
  id: string;
  user_id: string;
  company_name?: string;
  job_title?: string;
  job_url?: string;
  results_json: any;
  credits_spent: number;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  source: string;
  converted_to_user: boolean;
  created_at: string;
}

export function getCreditsRemaining(profile: Profile): number {
  return Math.max(0, profile.credits_total - profile.credits_used);
}

export function hasCredits(profile: Profile, required: number = 2): boolean {
  return getCreditsRemaining(profile) >= required;
}