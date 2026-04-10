import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface AnalyzeRequest {
  cvText: string;
  jobUrl: string;
  jobDescText?: string;
  includeFitScore?: boolean;
}

interface AnalyzeResponse {
  success: boolean;
  data?: any;
  creditsRemaining?: number;
  error?: string;
}

interface CreditsResponse {
  success: boolean;
  credits_total: number;
  credits_used: number;
  credits_remaining: number;
}

interface WaitlistResponse {
  success: boolean;
  position?: number;
  error?: string;
}

async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return response;
}

export async function checkCredits(): Promise<CreditsResponse> {
  const response = await fetchWithAuth('/credits');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check credits');
  }
  return response.json();
}

export async function analyzeJob(
  request: AnalyzeRequest,
  onProgress?: (message: string) => void
): Promise<AnalyzeResponse> {
  onProgress?.('Checking credits...');
  onProgress?.('Generating job intelligence...');

  const response = await fetchWithAuth('/analyze', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      error: error.error || error.message || 'Analysis failed',
    };
  }

  const result = await response.json();
  return {
    success: true,
    data: result.data,
    creditsRemaining: result.creditsRemaining,
  };
}

export async function joinWaitlist(email: string, name?: string): Promise<WaitlistResponse> {
  const response = await fetch(`${API_BASE}/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      error: error.error || 'Failed to join waitlist',
    };
  }

  return response.json();
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE}/waitlist`);
    if (response.ok) {
      const data = await response.json();
      return data.count ?? 0;
    }
  } catch {
    // Fallback to default
  }
  return 0;
}

export async function createStripeCheckout(plan: string): Promise<{ url: string }> {
  const response = await fetchWithAuth('/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to create checkout session');
  }

  return response.json();
}

export async function createBillingPortal(): Promise<{ url: string }> {
  const response = await fetchWithAuth('/stripe/portal', {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to create billing portal session');
  }

  return response.json();
}

export async function syncSubscription(): Promise<{ synced: boolean; plan?: string; credits_remaining?: number }> {
  const response = await fetchWithAuth('/stripe/sync', {
    method: 'POST',
  });

  if (!response.ok) {
    return { synced: false };
  }

  return response.json();
}

export async function rewriteTone(
  coverLetter: string,
  tone: string,
  roleContext?: string
): Promise<{ success: boolean; coverLetter?: string; creditsRemaining?: number; error?: string }> {
  const response = await fetchWithAuth('/rewrite-tone', {
    method: 'POST',
    body: JSON.stringify({ coverLetter, tone, roleContext }),
  });
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.error || 'Failed to rewrite cover letter' };
  }
  return response.json();
}

export async function generateInterviewQuestions(
  roleContext: string
): Promise<{ success: boolean; questions?: any[]; creditsRemaining?: number; error?: string }> {
  const response = await fetchWithAuth('/interview/questions', {
    method: 'POST',
    body: JSON.stringify({ roleContext }),
  });
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.error || 'Failed to generate questions' };
  }
  return response.json();
}

export async function evaluateAnswer(
  roleContext: string,
  question: string,
  category: string,
  answer: string
): Promise<{ success: boolean; evaluation?: any; error?: string }> {
  const response = await fetchWithAuth('/interview/evaluate', {
    method: 'POST',
    body: JSON.stringify({ roleContext, question, category, answer }),
  });
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.error || 'Failed to evaluate answer' };
  }
  return response.json();
}

export async function logout(): Promise<void> {
  await fetchWithAuth('/auth/logout', { method: 'POST' });
}