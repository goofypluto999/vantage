/**
 * Server-only audit log writer.
 *
 * Lives OUTSIDE /api/ so Vercel doesn't deploy it as a function. Imports
 * cleanly from any api/* handler.
 *
 * Fire-and-forget. Never throws. An audit-write outage MUST NOT fail the
 * caller — a payment that completes but doesn't log is still a successful
 * payment; an audit-fail-loud would make payments dependent on the audit
 * table being healthy, which inverts the priority.
 *
 * Failures are logged at WARN level (Vercel's console.warn → function logs)
 * so they're visible in ops without crashing the request.
 *
 * Schema lives in `database/schema.sql::audit_log`. Event taxonomy uses
 * dotted namespaces:
 *   auth.*       — sign_up, sign_in, password_changed, password_reset_*
 *   purchase.*   — completed, refunded
 *   token.*      — deducted, added, refunded
 *   admin.*      — action (with `detail` describing what)
 *
 * Add new categories as they emerge; the table doesn't constrain the type
 * column, so this is a soft convention.
 */

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

export interface AuditEvent {
  /** Dotted-namespace event name, e.g. `purchase.completed`. Required. */
  event_type: string;
  /** Supabase user UUID of the actor (the user this is about). Optional for system events. */
  actor_id?: string | null;
  /** Email of the actor at time of event. Optional. */
  actor_email?: string | null;
  /** Client IP if available. We DON'T hash here — operator audit trail is allowed to see raw IP for fraud investigation. */
  ip_address?: string | null;
  /** Request UA. Optional. */
  user_agent?: string | null;
  /** Type of resource the event acted on, e.g. `stripe_charge`, `subscription`. */
  resource_type?: string | null;
  /** Resource id (Stripe charge ID, subscription ID, etc). */
  resource_id?: string | null;
  /** One-line human-readable summary safe for an admin dashboard. */
  detail?: string | null;
  /**
   * Structured fields. Keep small (<2KB). No PII beyond what's already on actor_*.
   *
   * ⚠️ NEVER pass a whole Stripe `session`, `charge`, `invoice`, or `subscription`
   * object here. They contain customer email, billing_details, payment_method
   * fingerprint, card last4, etc — all of which would land in the audit table.
   * Hand-pick scalar fields only (stripe_event_id, amount_total, currency, plan).
   */
  metadata?: Record<string, unknown> | null;
}

export async function logAuditEvent(ev: AuditEvent): Promise<void> {
  // Fail-soft if not configured. Local dev without service-role key shouldn't
  // crash; just no audit row.
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;
  if (!ev.event_type || typeof ev.event_type !== 'string') return;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/audit_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
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
