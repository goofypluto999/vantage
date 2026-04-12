// Admin dashboard API — returns business metrics, users, subscriptions, usage
// Protected by ADMIN_EMAILS env var (comma-separated list of admin email addresses)
// Vercel serverless function

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || '';
  return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
}

async function verifyAdmin(token: string): Promise<{ isAdmin: boolean; userId?: string; email?: string }> {
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_SERVICE_KEY,
    },
  });

  if (!userRes.ok) return { isAdmin: false };

  const user = await userRes.json();
  const adminEmails = getAdminEmails();

  if (adminEmails.length === 0) {
    return { isAdmin: false };
  }

  return {
    isAdmin: adminEmails.includes(user.email?.toLowerCase()),
    userId: user.id,
    email: user.email,
  };
}

async function supabaseQuery(endpoint: string, params: string = ''): Promise<any> {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}${params ? '?' + params : ''}`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'count=exact',
    },
  });
  const contentRange = res.headers.get('content-range');
  const totalCount = contentRange ? parseInt(contentRange.split('/')[1]) || 0 : 0;
  const data = await res.json();
  return { data, totalCount };
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { isAdmin } = await verifyAdmin(token);

  if (!isAdmin) {
    return response.status(403).json({ error: 'Admin access required' });
  }

  try {
    // Fetch all data in parallel
    const [
      usersResult,
      activeSubsResult,
      cancellingSubsResult,
      cancelledSubsResult,
      recentAnalysesResult,
      waitlistResult,
      recentUsageResult,
    ] = await Promise.all([
      // All users with plan info, ordered by most recent
      supabaseQuery('profiles', 'select=id,email,full_name,plan,token_balance,subscription_status,stripe_customer_id,created_at,updated_at&order=created_at.desc&limit=100'),
      // Active subscriptions count
      supabaseQuery('profiles', 'select=count&subscription_status=eq.active'),
      // Cancelling subscriptions count
      supabaseQuery('profiles', 'select=count&subscription_status=eq.cancelling'),
      // Cancelled subscriptions count
      supabaseQuery('profiles', 'select=count&subscription_status=eq.cancelled'),
      // Recent analyses (last 50)
      supabaseQuery('analyses', 'select=id,user_id,company_name,job_title,job_url,tokens_spent,created_at&order=created_at.desc&limit=50'),
      // Waitlist
      supabaseQuery('waitlist', 'select=id,email,name,source,created_at&order=created_at.desc&limit=100'),
      // Recent API usage (last 7 days worth)
      supabaseQuery('api_usage', 'select=id,user_id,endpoint,tokens_consumed,created_at&order=created_at.desc&limit=200'),
    ]);

    // Compute metrics
    const users = usersResult.data || [];
    const totalUsers = usersResult.totalCount;
    const activeSubscriptions = activeSubsResult.totalCount;
    const cancellingSubscriptions = cancellingSubsResult.totalCount;
    const cancelledSubscriptions = cancelledSubsResult.totalCount;
    const totalWaitlist = waitlistResult.totalCount;

    // Plan distribution
    const planDistribution: Record<string, number> = { starter: 0, pro: 0, premium: 0 };
    for (const u of users) {
      if (planDistribution[u.plan] !== undefined) planDistribution[u.plan]++;
    }

    // Token metrics
    const totalTokensInCirculation = users.reduce((sum: number, u: any) => sum + (u.token_balance || 0), 0);

    // Recent signups (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentSignups = users.filter((u: any) => u.created_at >= sevenDaysAgo).length;

    // Monthly recurring revenue estimate (based on active plan distribution)
    const PLAN_PRICES: Record<string, number> = { starter: 5, pro: 12, premium: 20 };
    let estimatedMRR = 0;
    for (const u of users) {
      if (u.subscription_status === 'active' || u.subscription_status === 'cancelling') {
        estimatedMRR += PLAN_PRICES[u.plan] || 0;
      }
    }

    return response.status(200).json({
      metrics: {
        totalUsers,
        activeSubscriptions,
        cancellingSubscriptions,
        cancelledSubscriptions,
        totalWaitlist,
        recentSignups,
        estimatedMRR,
        totalTokensInCirculation,
        planDistribution,
      },
      users: users.map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        plan: u.plan,
        token_balance: u.token_balance,
        subscription_status: u.subscription_status,
        has_stripe: !!u.stripe_customer_id,
        created_at: u.created_at,
        updated_at: u.updated_at,
      })),
      recentAnalyses: recentAnalysesResult.data || [],
      waitlist: (waitlistResult.data || []).map((w: any) => ({
        id: w.id,
        email: w.email,
        name: w.name,
        source: w.source,
        created_at: w.created_at,
      })),
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to load admin data' });
  }
}
