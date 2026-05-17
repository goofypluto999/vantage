/**
 * Server-only Resend transactional email helper.
 *
 * Lives OUTSIDE /api/ so Vercel doesn't try to deploy it as a function
 * (would burn one of our 12 Hobby-plan slots). Imports cleanly from any
 * api/* handler.
 *
 * Why a wrapper:
 *  - Centralises the From-address + reply-to so we don't have to retype
 *    the operator email everywhere.
 *  - Forces a fail-soft envelope: a Stripe webhook handler MUST NEVER
 *    crash because Resend had a 500. The wrapper logs but never throws.
 *  - Single place to add per-environment routing (e.g. staging emails
 *    go to operator only) if we ever need it.
 *
 * Env:
 *  - RESEND_API_KEY  (required; set in Vercel)
 *  - RESEND_FROM     (optional; defaults to noreply@aimvantage.uk)
 *
 * Resend's free plan: 100 emails/day, 3000/month, 1 verified domain.
 * The aimvantage.uk domain is verified (DKIM + SPF + DMARC + MX) per
 * the 2026-05-14 setup. See SESSION-2026-05-15-COMPLETE.md for the
 * full domain-verification ledger.
 */

import { Resend } from 'resend';

export interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  // Optional plain-text fallback. Most modern clients prefer HTML, but
  // some corporate Outlook installs and screen readers still benefit
  // from a real text/plain part.
  text?: string;
  // Override the From: address. Defaults to RESEND_FROM env or
  // noreply@aimvantage.uk. Use a more human address (hello@…) for
  // anything where the user might reply.
  from?: string;
  // Override the Reply-To header. Defaults to the operator inbox so
  // bounces / replies route somewhere a human reads.
  replyTo?: string;
  // Optional tagging for Resend analytics. Recommended values:
  // 'purchase_confirm', 'low_balance', 'welcome', 'password_reset_manual'.
  tag?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

const DEFAULT_FROM = 'AimVantage <noreply@aimvantage.uk>';
const DEFAULT_REPLY_TO = 'giovanni.sizino.ennes@hotmail.co.uk';

let cached: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (cached) return cached;
  cached = new Resend(key);
  return cached;
}

/**
 * Send a single transactional email. Returns { ok: false } on any failure
 * — does NOT throw. Callers in webhook hot paths can fire-and-forget.
 *
 * If RESEND_API_KEY is unset (local dev without the secret, or accidental
 * env-var removal in Vercel), the call no-ops and returns { ok: false,
 * error: 'resend_not_configured' }. This is deliberate so a missing key
 * never silently produces a 500 in production webhooks.
 */
export async function sendEmail(args: SendEmailArgs): Promise<SendEmailResult> {
  const client = getClient();
  if (!client) {
    return { ok: false, error: 'resend_not_configured' };
  }
  // Basic guards. Resend will reject these too, but failing fast is nicer
  // than burning a network round-trip.
  if (!args.to || !/.+@.+\..+/.test(args.to)) {
    return { ok: false, error: 'invalid_recipient' };
  }
  if (!args.subject || !args.html) {
    return { ok: false, error: 'missing_subject_or_html' };
  }

  const from = (args.from || process.env.RESEND_FROM || DEFAULT_FROM).trim();
  const replyTo = (args.replyTo || DEFAULT_REPLY_TO).trim();

  try {
    const result = await client.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo,
      tags: args.tag ? [{ name: 'kind', value: args.tag }] : undefined,
    });
    if (result.error) {
      return { ok: false, error: String(result.error.message || result.error) };
    }
    return { ok: true, id: result.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown_send_failure';
    return { ok: false, error: message };
  }
}

/**
 * Shared HTML wrapper for branded emails. Pure function — produces a
 * minimal, inbox-safe HTML doc with a soft AimVantage header. Keep it
 * inline-styled because Gmail strips <style> blocks aggressively.
 *
 * SECURITY: `innerHtml` is injected RAW. Callers MUST escape any
 * user-controlled values (email, name, plan label, etc.) before
 * concatenating them in. `headline` IS escaped here for convenience,
 * but the body is not. This is intentional — most callers pass curated
 * marketing markup; the few that interpolate user data are responsible
 * for their own escaping. A simple helper:
 *   const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
 *
 * Usage:
 *   sendEmail({
 *     to, subject,
 *     html: wrapEmailBody('Order confirmed', `<p>Thanks ${esc(name)}…</p>`),
 *     tag: 'purchase_confirm',
 *   })
 */
export function wrapEmailBody(headline: string, innerHtml: string): string {
  const safeHeadline = String(headline)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${safeHeadline}</title></head>
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
</body>
</html>`;
}
