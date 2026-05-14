# Supabase Auth Email Templates — AimVantage

5 HTML email templates aligned to the AimVantage brand. Drop each into Supabase Dashboard → **Authentication → Emails** → click each template → paste into the **HTML body** field. Don't forget to also update the **Subject** line.

## Where to paste

Supabase Dashboard URL: `https://supabase.com/dashboard/project/<your-project-ref>/auth/templates`

Each template has 4 settings:
1. **Subject line** — set per the table below
2. **HTML body** — paste the full HTML from the matching `.html` file in this folder
3. **Sender name** — set to `AimVantage` (Project Settings → Authentication → SMTP Settings if using custom SMTP, else top of the Email Templates page)
4. **From address** — leave Supabase default for now (`noreply@mail.app.supabase.io`) until you set up custom SMTP

## Templates

| Supabase template | Subject line | HTML file |
|---|---|---|
| Confirm signup | `Confirm your AimVantage account` | `01-confirm-signup.html` |
| Invite user | `You've been invited to AimVantage` | `02-invite.html` |
| Magic Link | `Your AimVantage sign-in link` | `03-magic-link.html` |
| Change Email Address | `Confirm your new AimVantage email` | `04-email-change.html` |
| Reset Password | `Reset your AimVantage password` | `05-reset-password.html` |

## Brand variables used (Supabase template syntax)

- `{{ .SiteURL }}` — your site URL (set in Project Settings → API)
- `{{ .ConfirmationURL }}` — the magic action link Supabase generates
- `{{ .Email }}` — the recipient email
- `{{ .Token }}` — 6-digit OTP code (optional, only shown in templates that include it)
- `{{ .TokenHash }}` — hashed token (advanced use; not used here)

## Verify after paste

1. Save each template
2. Test by triggering each flow:
   - Sign up with a throwaway address → confirm signup email
   - Click "Forgot password" → reset email
   - Click "Sign in with magic link" (if enabled) → magic link email
3. Confirm the inbox displays "AimVantage" in the sender name + subject line

## If something breaks

The legacy form `{{ .ConfirmationURL }}` is the modern Supabase variable. If your project is on an older Supabase version using `{{ConfirmationURL}}` (no dot, no spaces), swap accordingly. Most projects post-2023 use the modern form.
