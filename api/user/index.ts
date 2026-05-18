// Consolidated user-data endpoint.
// Replaces api/credits and api/analyses with one function so we stay
// under the Vercel Hobby plan's 12-function limit.
//
// Routing is driven by vercel.json rewrites:
//   /api/credits        → /api/user?endpoint=credits
//   /api/analyses       → /api/user?endpoint=analyses
//   /api/analyses?id=X  → /api/user?endpoint=analyses&id=X
//   /api/delete-account → /api/user?endpoint=delete-account  (GDPR Gap #1)
//
// Original client paths are preserved so frontend code didn't have to change.

import * as Sentry from '@sentry/node';
import type { ErrorEvent, EventHint } from '@sentry/node';
import { Resend } from 'resend';

// ─── INLINED HELPERS ─────────────────────────────────────────────────────
// Vercel NFT does NOT follow static imports of sibling .ts files across
// /api/ — 5 attempts to share via lib/, api/_lib/, api/shared/, vercel.json
// includeFiles, and underscore renames all produced ERR_MODULE_NOT_FOUND
// at runtime. Inlined per-handler. See api/analyze/index.ts for the full
// postmortem. Originals lived at api/shared/{observability,email,audit}/*.
// ──────────────────────────────────────────────────────────────────────────

// Sentry (init + captureError + per-fingerprint dedupe)
let _sentryInit = false;
const _SENTRY_DSN = (process.env.SENTRY_DSN || '').trim();
const _SENTRY_ENV = (process.env.VERCEL_ENV || process.env.NODE_ENV || 'development').trim();
const _SENTRY_RELEASE = (process.env.VERCEL_GIT_COMMIT_SHA || 'unknown').slice(0, 12);
const _SENTRY_DEDUPE_MS = 60_000;
const _sentrySeen = new Map<string, number>();

function initSentry(): void {
  if (_sentryInit) return;
  if (!_SENTRY_DSN) return;
  Sentry.init({
    dsn: _SENTRY_DSN,
    environment: _SENTRY_ENV,
    release: _SENTRY_RELEASE,
    tracesSampleRate: 0,
    beforeSend(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
      const status = (event.extra as Record<string, unknown> | undefined)?.status as number | undefined;
      if (typeof status === 'number' && status >= 400 && status < 500) return null;
      const msg = String(event.message || event.exception?.values?.[0]?.value || '');
      if (/aborted: timed out/i.test(msg)) return null;
      if (/Invalid token: not in valid range/i.test(msg)) return null;
      return event;
    },
  });
  _sentryInit = true;
}

function _sentryFingerprint(err: unknown, context?: Record<string, unknown>): string {
  const route = (context?.route as string | undefined) || 'unknown';
  const msg = err instanceof Error
    ? err.message
    : typeof err === 'string'
      ? err
      : (() => { try { return JSON.stringify(err); } catch { return String(err); } })();
  return `${route}:${msg.slice(0, 120)}`;
}

function _sentryShouldSend(fp: string): boolean {
  const now = Date.now();
  const last = _sentrySeen.get(fp);
  if (last && now - last < _SENTRY_DEDUPE_MS) return false;
  _sentrySeen.set(fp, now);
  if (_sentrySeen.size > 200) {
    const cutoff = now - _SENTRY_DEDUPE_MS;
    for (const [k, t] of _sentrySeen) if (t < cutoff) _sentrySeen.delete(k);
  }
  return true;
}

function captureError(err: unknown, context?: Record<string, unknown>): void {
  if (!_sentryInit) return;
  if (!_sentryShouldSend(_sentryFingerprint(err, context))) return;
  try {
    Sentry.withScope((scope) => {
      if (context) for (const [k, v] of Object.entries(context)) scope.setExtra(k, v as never);
      Sentry.captureException(err);
    });
  } catch { /* swallow */ }
}

// Resend transactional email
const _RESEND_FROM = 'AimVantage <noreply@aimvantage.uk>';
const _RESEND_REPLY_TO = 'giovanni.sizino.ennes@hotmail.co.uk';
let _resendClient: Resend | null = null;
function _getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (_resendClient) return _resendClient;
  _resendClient = new Resend(key);
  return _resendClient;
}

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tag?: string;
}

async function sendEmail(args: SendEmailArgs): Promise<{ ok: boolean; id?: string; error?: string }> {
  const client = _getResend();
  if (!client) return { ok: false, error: 'resend_not_configured' };
  if (!args.to || !/.+@.+\..+/.test(args.to)) return { ok: false, error: 'invalid_recipient' };
  if (!args.subject || !args.html) return { ok: false, error: 'missing_subject_or_html' };
  const from = (args.from || process.env.RESEND_FROM || _RESEND_FROM).trim();
  const replyTo = (args.replyTo || _RESEND_REPLY_TO).trim();
  try {
    const result = await client.emails.send({
      from, to: args.to, subject: args.subject, html: args.html, text: args.text, replyTo,
      tags: args.tag ? [{ name: 'kind', value: args.tag }] : undefined,
    });
    if (result.error) return { ok: false, error: String(result.error.message || result.error) };
    return { ok: true, id: result.data?.id };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown_send_failure' };
  }
}

function wrapEmailBody(headline: string, innerHtml: string): string {
  const safeHeadline = String(headline).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${safeHeadline}</title></head>
<body style="margin:0;padding:0;background:#0d0b1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#f0eef9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d0b1e;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">AimVantage</div>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:#ffffff;font-weight:700;">${safeHeadline}</h1>
          <div style="font-size:15px;line-height:1.55;color:#d4d0e8;">${innerHtml}</div>
        </td></tr>
        <tr><td style="padding:20px 28px 28px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:#8a85a3;line-height:1.5;">
          AimVantage · AI Job Preparation · <a href="https://aimvantage.uk" style="color:#a78bfa;">aimvantage.uk</a><br>
          Solo-built in the UK. Reply to this email and a human (Gio) reads it.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Audit log writer (fire-and-forget, never throws)
const _AUDIT_SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const _AUDIT_SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

interface AuditEvent {
  event_type: string;
  actor_id?: string | null;
  actor_email?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  resource_type?: string | null;
  resource_id?: string | null;
  detail?: string | null;
  metadata?: Record<string, unknown> | null;
}

async function logAuditEvent(ev: AuditEvent): Promise<void> {
  if (!_AUDIT_SUPABASE_URL || !_AUDIT_SUPABASE_KEY) return;
  if (!ev.event_type || typeof ev.event_type !== 'string') return;
  try {
    const res = await fetch(`${_AUDIT_SUPABASE_URL}/rest/v1/audit_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        apikey: _AUDIT_SUPABASE_KEY,
        Authorization: `Bearer ${_AUDIT_SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        event_type: ev.event_type,
        actor_id: ev.actor_id || null,
        actor_email: ev.actor_email || null,
        ip_address: ev.ip_address || null,
        user_agent: ev.user_agent ? String(ev.user_agent).slice(0, 500) : null,
        resource_type: ev.resource_type || null,
        resource_id: ev.resource_id ? String(ev.resource_id).slice(0, 200) : null,
        detail: ev.detail ? String(ev.detail).slice(0, 500) : null,
        metadata: ev.metadata || null,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn(`audit: write failed (${res.status}) for ${ev.event_type}: ${body.slice(0, 200)}`);
    }
  } catch (err: any) {
    console.warn(`audit: write threw for ${ev.event_type}: ${String(err?.message || err).slice(0, 200)}`);
  }
}
// ─── END INLINED HELPERS ─────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function authenticate(authHeader: string | undefined) {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_SERVICE_KEY,
    },
  });
  if (!userRes.ok) return null;
  return userRes.json();
}

async function handleCredits(_request: any, response: any, userId: string) {
  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=token_balance`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  const profiles = await profileRes.json();
  if (profiles?.length) {
    return response.status(200).json({
      success: true,
      token_balance: profiles[0].token_balance ?? 0,
    });
  }

  // Lazy-create fallback (mirrors the same recovery path in
  // /api/interview/[action].ts:getProfile). Triggered when the
  // on_auth_user_created Supabase trigger didn't fire for this user's
  // signup. profiles.email is NOT NULL (schema.sql:10) so we must
  // resolve a non-null email — walking multiple paths off the admin
  // user object with a synthetic last-resort.
  try {
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
    });
    if (authRes.ok) {
      const authUser = await authRes.json();
      const u = authUser?.user || authUser;
      const identities = Array.isArray(u?.identities) ? u.identities : [];
      const identityEmail = identities.find((i: any) => i?.identity_data?.email)?.identity_data?.email;
      const email = u?.email
        || u?.new_email
        || u?.user_metadata?.email
        || identityEmail
        || `${userId}@vantage-recovered.local`;
      const fullName = u?.user_metadata?.full_name
        || u?.user_metadata?.name
        || identities.find((i: any) => i?.identity_data?.full_name)?.identity_data?.full_name
        || null;
      const avatarUrl = u?.user_metadata?.avatar_url
        || u?.user_metadata?.picture
        || identities.find((i: any) => i?.identity_data?.avatar_url)?.identity_data?.avatar_url
        || null;

      const createRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation,resolution=ignore-duplicates',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({
          id: userId,
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
          token_balance: 10,
          plan: 'starter',
          subscription_status: 'inactive',
        }),
      });
      if (createRes.ok) {
        return response.status(200).json({ success: true, token_balance: 10 });
      }
      const errBody = await createRes.text().catch(() => '');
      console.warn(`handleCredits: lazy-create returned ${createRes.status} for ${userId} — body: ${errBody.slice(0, 300)} — resolved email: ${email}`);
    } else {
      console.warn(`handleCredits: admin user lookup returned ${authRes.status} for ${userId}`);
    }
  } catch (err: any) {
    console.warn(`handleCredits: lazy-create exception for ${userId}: ${err?.message || ''}`);
  }

  return response.status(404).json({ error: 'Profile not found' });
}

async function handleAnalyses(request: any, response: any, userId: string) {
  // Support both ?id=... (single analysis) and no-param (list)
  const url = new URL(request.url, `http://${request.headers.host}`);
  const analysisId = url.searchParams.get('id');

  if (analysisId) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(analysisId)) {
      return response.status(400).json({ error: 'Invalid analysis ID' });
    }

    const detailRes = await fetch(
      `${SUPABASE_URL}/rest/v1/analyses?id=eq.${analysisId}&user_id=eq.${userId}&select=*&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!detailRes.ok) {
      return response.status(500).json({ error: 'Failed to load analysis' });
    }

    const analyses = await detailRes.json();
    if (!analyses.length) {
      return response.status(404).json({ error: 'Analysis not found' });
    }

    return response.status(200).json({ analysis: analyses[0] });
  }

  const analysesRes = await fetch(
    `${SUPABASE_URL}/rest/v1/analyses?user_id=eq.${userId}&select=id,company_name,job_title,job_url,tokens_spent,created_at&order=created_at.desc&limit=50`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!analysesRes.ok) {
    return response.status(500).json({ error: 'Failed to load analyses' });
  }

  const analyses = await analysesRes.json();
  return response.status(200).json({ analyses });
}

/**
 * Save a CV summary directly from a client-extracted CV text upload.
 * No Gemini round-trip, no token spend — the user gets cv_summary
 * populated the moment they drop their CV, before any analysis runs.
 *
 * Resolves the user complaint: 'the user has to run a scan first, on
 * the Run a new analysis section it makes the user run that tool
 * first before the CV gets used in the Jobs search section, which
 * is not good, it forces user to waste a token first before being
 * able to use the tool with the job search function.' (2026-05-12).
 */
async function handleCvUpload(request: any, response: any, userId: string) {
  let body: any = {};
  try {
    body = request.body || {};
  } catch {
    return response.status(400).json({ error: 'Invalid JSON body' });
  }
  const cvText = typeof body?.cvText === 'string' ? body.cvText.trim() : '';
  if (cvText.length < 60) {
    return response.status(400).json({ error: 'CV text too short — at least 60 characters required.' });
  }
  // Sanity ceiling so a malicious upload can't bloat the profile row.
  // 12000 chars ~ a typical 2-page CV.
  const safeText = cvText.slice(0, 12000);

  // Build the same shape /api/analyze uses so AI Job Search treats this
  // identically to a post-analysis summary. No analysis was actually run,
  // so we don't have cvMatchPoints — just the raw CV text labelled as
  // such. The Job Search prompt accepts either format.
  const summary = [
    'CV RAW (uploaded directly, no analysis yet):',
    safeText.slice(0, 1800),
  ].join('\n').slice(0, 2000);

  try {
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ cv_summary: summary }),
    });
    if (!patchRes.ok) {
      const text = await patchRes.text().catch(() => '');
      console.error(`cv-upload PATCH failed ${patchRes.status}: ${text.slice(0, 200)}`);
      return response.status(500).json({ error: 'Could not save CV summary' });
    }
    return response.status(200).json({ success: true, cv_summary_length: summary.length });
  } catch (err: any) {
    console.error('cv-upload exception:', err?.message || 'unknown');
    return response.status(500).json({ error: 'Could not save CV summary' });
  }
}

export default async function handler(request: any, response: any) {
  // POST allowed for cv-upload; everything else stays GET-only.
  if (request.method !== 'GET' && request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  initSentry();

  const user = await authenticate(request.headers.authorization);
  if (!user) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  // Endpoint discrimination: prefer the rewrite-injected query param,
  // fall back to URL path matching for direct hits to /api/user?endpoint=...
  let endpoint = '';
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    endpoint = (url.searchParams.get('endpoint') || '').toLowerCase();
  } catch {
    // ignore — handled below
  }

  try {
    if (endpoint === 'credits') {
      if (request.method !== 'GET') return response.status(405).json({ error: 'GET only' });
      return await handleCredits(request, response, user.id);
    }
    if (endpoint === 'analyses') {
      if (request.method !== 'GET') return response.status(405).json({ error: 'GET only' });
      return await handleAnalyses(request, response, user.id);
    }
    if (endpoint === 'cv-upload') {
      if (request.method !== 'POST') return response.status(405).json({ error: 'POST only' });
      return await handleCvUpload(request, response, user.id);
    }
    if (endpoint === 'delete-account') {
      if (request.method !== 'POST') return response.status(405).json({ error: 'POST only' });
      return await handleDeleteAccount(request, response, user);
    }
    return response.status(400).json({ error: 'Unknown endpoint' });
  } catch (error: any) {
    console.error(`User endpoint (${endpoint}) error:`, error?.message || 'Unknown error');
    captureError(error, { route: `/api/user?endpoint=${endpoint}`, user_id: user?.id ?? null });
    return response.status(500).json({ error: 'Internal server error' });
  }
}

// ─── GDPR Gap #1: self-serve account deletion ────────────────────────────
// Triggered via POST /api/delete-account (or POST /api/user?endpoint=delete-account).
// Requires body { confirmation: 'DELETE' } as a server-side belt to the
// client UI suspenders — defends against XSS triggers without the body.
//
// Order of operations (CRITICAL — audit must fire BEFORE delete):
//   1. Snapshot profile + analyses count for the audit metadata
//   2. Write audit_log row (actor_id FK is ON DELETE SET NULL so the
//      row survives the user delete with email + ip preserved)
//   3. Supabase admin DELETE auth.users → cascades to profiles, analyses,
//      api_usage, seen_job_searches via existing ON DELETE CASCADE chain
//   4. Fire-and-forget confirmation email (webhook-style)
//   5. Return 200 with deleted counts
//
// Stripe customer record is INTENTIONALLY preserved for UK tax/financial
// records retention. Separate erasure available via email request
// (disclosed in the confirmation email body).
async function handleDeleteAccount(request: any, response: any, user: any): Promise<void> {
  const body = request.body || {};
  if (body.confirmation !== 'DELETE') {
    return response.status(400).json({ error: 'Missing or invalid confirmation token' });
  }

  const userId: string = user.id;
  const userEmail: string | null = user.email || null;

  // Snapshot profile + analyses count for the audit. Failure is non-fatal —
  // proceed with delete so the user's right-to-erasure isn't blocked by
  // a transient Supabase REST error.
  let profileSnapshot: { plan: string | null; token_balance: number | null; created_at: string | null } | null = null;
  let analysesCount = 0;
  try {
    const profRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=plan,token_balance,created_at`,
      { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
    );
    if (profRes.ok) {
      const arr = await profRes.json();
      if (arr.length) profileSnapshot = arr[0];
    }
    const countRes = await fetch(
      `${SUPABASE_URL}/rest/v1/analyses?user_id=eq.${userId}&select=id`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: 'count=exact',
        },
      }
    );
    if (countRes.ok) {
      const contentRange = countRes.headers.get('content-range') || '';
      const m = contentRange.match(/\/(\d+)$/);
      if (m) analysesCount = parseInt(m[1], 10);
    }
  } catch (err: any) {
    console.warn('delete-account: profile snapshot failed:', err?.message || '');
  }

  // CRITICAL: audit BEFORE delete. After auth.users delete, the FK
  // audit_log.actor_id → auth.users(id) goes NULL via the existing
  // ON DELETE SET NULL constraint, but actor_email + ip_address are
  // preserved as plain text. This is the dispute-evidence row.
  await logAuditEvent({
    event_type: 'account.deleted',
    actor_id: userId,
    actor_email: userEmail,
    ip_address: (request.headers?.['x-vercel-forwarded-for'] as string)
      || (request.headers?.['x-forwarded-for'] as string)
      || null,
    user_agent: (request.headers?.['user-agent'] as string) || null,
    resource_type: 'user',
    resource_id: userId,
    detail: `Self-serve deletion (${analysesCount} analyses, plan=${profileSnapshot?.plan || '?'})`,
    metadata: {
      plan: profileSnapshot?.plan,
      token_balance_at_delete: profileSnapshot?.token_balance,
      analyses_count: analysesCount,
      account_age_days: profileSnapshot?.created_at
        ? Math.floor((Date.now() - new Date(profileSnapshot.created_at).getTime()) / 86_400_000)
        : null,
    },
  });

  // Delete the Supabase Auth user. Cascades through:
  //   auth.users → profiles ON DELETE CASCADE → analyses + api_usage +
  //   seen_job_searches ON DELETE CASCADE.
  // audit_log.actor_id → ON DELETE SET NULL (audit row survives).
  // Stripe customer NOT touched.
  const deleteRes = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!deleteRes.ok) {
    const errText = await deleteRes.text().catch(() => '');
    captureError(new Error(`Supabase admin delete failed: ${deleteRes.status} ${errText.slice(0, 200)}`), {
      route: '/api/delete-account',
      user_id: userId,
    });
    return response.status(500).json({
      error: 'Account deletion failed on the server. We have logged the failure — please contact support@aimvantage.uk if it persists.',
    });
  }

  // Fire-and-forget confirmation email. User's Supabase session is now
  // revoked server-side so the client signs out on its next refresh anyway.
  if (userEmail) {
    const bodyHtml = `
      <p>Your AimVantage account has been deleted.</p>
      <p>We removed:</p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Your profile (name, email, avatar)</li>
        <li>All ${analysesCount} saved analysis result${analysesCount === 1 ? '' : 's'}</li>
        <li>Your CV profile (the distilled summary used by AI Job Search)</li>
        <li>Your token balance (${profileSnapshot?.token_balance || 0} unused token${profileSnapshot?.token_balance === 1 ? '' : 's'})</li>
        <li>Your AI Job Search history (saved jobs, seen-jobs dedup data)</li>
      </ul>
      <p style="margin-top: 16px;"><strong>Billing records preserved.</strong> Your Stripe customer record (past invoices + transaction history) is kept for UK tax / financial-records retention requirements. To request Stripe-side erasure separately, reply to this email.</p>
      <p style="margin-top: 16px; font-size: 13px; color: #8a85a3;">If you didn't request this deletion, contact <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" style="color: #a78bfa;">giovanni.sizino.ennes@hotmail.co.uk</a> immediately. Note: the deletion cannot be reversed, but we can investigate unauthorised access.</p>
    `;
    void sendEmail({
      to: userEmail,
      subject: 'Your AimVantage account has been deleted',
      html: wrapEmailBody('Account deleted', bodyHtml),
      tag: 'account_deleted',
    }).then((result) => {
      if (!result.ok) console.warn(`account-deleted email failed: ${result.error}`);
    });
  }

  return response.status(200).json({
    success: true,
    deleted: {
      analyses: analysesCount,
      token_balance: profileSnapshot?.token_balance || 0,
    },
  });
}
