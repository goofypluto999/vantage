import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface AnalyzeRequest {
  cvText?: string;
  cvBase64?: string;
  cvMimeType?: string;
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
  token_balance: number;
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

async function safeJson(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch {
    return { error: 'Unexpected server response' };
  }
}

export async function checkCredits(): Promise<CreditsResponse> {
  const response = await fetchWithAuth('/credits');
  if (!response.ok) {
    const error = await safeJson(response);
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
    const error = await safeJson(response);
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

export interface PublicStats {
  signups: number;
  analyses: number;
  waitlist: number;
}

/**
 * Public transparency stats for the homepage. We show real numbers,
 * including 0, because honesty at launch builds more trust than fake
 * social proof. Cached at the edge for 10 minutes.
 */
export async function getPublicStats(): Promise<PublicStats> {
  try {
    const response = await fetch(`${API_BASE}/waitlist?type=stats`);
    if (response.ok) {
      const data = await response.json();
      return {
        signups: data.signups ?? 0,
        analyses: data.analyses ?? 0,
        waitlist: data.waitlist ?? 0,
      };
    }
  } catch {
    // Fallback to zeros — better than fake numbers
  }
  return { signups: 0, analyses: 0, waitlist: 0 };
}

function validateStripeUrl(url: string): string {
  const TRUSTED_PREFIXES = [
    'https://checkout.stripe.com/',
    'https://billing.stripe.com/',
    'https://invoice.stripe.com/',
  ];
  if (!TRUSTED_PREFIXES.some(prefix => url.startsWith(prefix))) {
    throw new Error('Invalid redirect URL');
  }
  return url;
}

export async function createStripeCheckout(plan: string, currency: string = 'gbp'): Promise<{ url: string }> {
  const response = await fetchWithAuth('/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan, currency }),
  });

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error.error || error.message || 'Failed to create checkout session');
  }

  const result = await response.json();
  return { url: validateStripeUrl(result.url) };
}

export async function createBillingPortal(): Promise<{ url: string }> {
  const response = await fetchWithAuth('/stripe/portal', {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error.error || error.message || 'Failed to create billing portal session');
  }

  const result = await response.json();
  return { url: validateStripeUrl(result.url) };
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
    const error = await safeJson(response);
    return { success: false, error: error.error || 'Failed to rewrite cover letter' };
  }
  return response.json();
}

export async function generateInterviewQuestions(
  roleContext: string
): Promise<{ success: boolean; questions?: any[]; token_balance?: number; error?: string }> {
  const response = await fetchWithAuth('/interview/questions', {
    method: 'POST',
    body: JSON.stringify({ roleContext }),
  });
  if (!response.ok) {
    const error = await safeJson(response);
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
    const error = await safeJson(response);
    return { success: false, error: error.error || 'Failed to evaluate answer' };
  }
  return response.json();
}

export async function fetchAdminDashboard(): Promise<any> {
  const response = await fetchWithAuth('/admin/dashboard');
  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error.error || 'Admin access denied');
  }
  return response.json();
}

export async function fetchAnalysisHistory(): Promise<any[]> {
  const response = await fetchWithAuth('/analyses');
  if (!response.ok) return [];
  const result = await response.json();
  return result.analyses || [];
}