import { Profile, Analysis } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface AnalyzeRequest {
  cvFile: File;
  jobUrl: string;
  jobDescFile?: File;
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

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
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
  
  const formData = new FormData();
  formData.append('cvFile', request.cvFile);
  formData.append('jobUrl', request.jobUrl);
  if (request.jobDescFile) {
    formData.append('jobDescFile', request.jobDescFile);
  }
  if (request.includeFitScore) {
    formData.append('includeFitScore', 'true');
  }

  onProgress?.('Generating job intelligence...');
  
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      error: error.message || 'Analysis failed',
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
  const response = await fetchWithAuth('/waitlist', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      error: error.message || 'Failed to join waitlist',
    };
  }

  return response.json();
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE}/waitlist/count`);
    if (response.ok) {
      const data = await response.json();
      return data.count;
    }
  } catch {
    // Fallback to default
  }
  return 0;
}

export async function createStripeCheckout(priceId: string): Promise<{ url: string }> {
  const response = await fetchWithAuth('/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ priceId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
}

export async function logout(): Promise<void> {
  await fetchWithAuth('/auth/logout', { method: 'POST' });
}