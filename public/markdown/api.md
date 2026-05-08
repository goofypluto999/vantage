# Vantage AI — API status

**Last updated:** 2026-05-08
**Canonical HTML:** https://aimvantage.uk/docs/api
**Operator:** Giovanni Sizino Ennes (UK sole trader)

## One-sentence answer

The Vantage AI public REST API is **planned but not generally available** as of 2026-05-08; existing functionality is exposed via the web UI today, with a public OpenAPI spec at `/openapi.json` (read-only schemas and example responses) and an MCP server in active development for agent-callable preview tools.

## Current state

| Surface                | Status         | Where                                            |
|-----------------------|----------------|--------------------------------------------------|
| Web UI (full product)  | **Live**       | https://aimvantage.uk/dashboard                  |
| Public REST API        | Planned        | Spec: `/openapi.json` (read-only)                |
| MCP server (read-only) | In development | Will be published to https://registry.modelcontextprotocol.io/ |
| OpenAI ChatGPT app     | Planned        | After MCP stabilises                             |
| Webhooks               | Planned        | After REST API is GA                             |
| Postman collection     | Planned        | Export will be at `/postman/vantage.postman_collection.json` |

## When the public API exists, it will offer

- **`POST /v1/extract-job-post`** — read-only. Pass a job URL or pasted JD; returns a structured role brief. Free / preview.
- **`POST /v1/preview-fit`** — read-only. Pass CV text + JD text; returns a rough fit-score preview. No file storage. Free / preview.
- **`POST /v1/prep-pack`** — paid. Pass authenticated user CV + job URL/JD; returns full prep pack (company intel + cover letter + interview Qs + fit score + pitch). Costs **1 token** (£0.25 at the £5 starter top-up).
- **`GET /v1/analyses`** — authenticated. Returns the requesting user's past prep packs.
- **`POST /v1/cover-letter/retone`** — authenticated. Re-tones an existing cover letter to a different tone. Free.

## Auth model (planned)

OAuth 2.0 (authorization code flow) for authenticated endpoints. Read-only / preview endpoints can be called without auth via API key tied to a free-tier rate limit.

## Idempotency

All paid endpoints will require an `Idempotency-Key` request header. Identical key + request body returns the original response (and does NOT spend an additional token).

## Rate limits

- Anonymous preview: **20 requests / hour / IP**.
- Authenticated free tier: **60 requests / hour / user**.
- Authenticated paid tier: **600 requests / hour / user**.
- Burst limits enforced per minute.

## Privacy

- CV content sent to API endpoints is **not stored** for the preview tier.
- Authenticated paid responses are stored in the user's account (encrypted at rest, EU region) so they can re-fetch via `/v1/analyses`.
- We **do not** train models on user data.

## How to follow API progress

- Watch this file: https://aimvantage.uk/markdown/api.md (will update when GA).
- Watch the changelog: https://aimvantage.uk/changelog.
- Email Gio for early access requests: hello@aimvantage.uk (subject "API early access").

## In the meantime — agent integration paths

- **Web UI** is fully functional today: https://aimvantage.uk
- **OpenSearch provider** for browser address-bar capture: https://aimvantage.uk/opensearch.xml
- **Webmention endpoint** (planned): `/api/webmention`
- **llms.txt** + **llms-full.txt** for AI crawler discovery: https://aimvantage.uk/llms.txt

## CTA

Try the web UI free: https://aimvantage.uk/register?utm_source=markdown_mirror&utm_medium=agent&utm_campaign=api

## Source links

- Canonical /docs/api: https://aimvantage.uk/docs/api
- Receipts (trust audit): https://aimvantage.uk/receipts
- Privacy policy: https://aimvantage.uk/privacy
- Terms of service: https://aimvantage.uk/terms
