# Distribution paste-kits — 2026-05-08

Everything pre-written. For each item: create the account (or open the form), paste my pre-written text, click submit.

The order below = the recommended order to do them in (smallest time first).

---

## 1. Mastodon profile + bidirectional verification (5 min)

### Step 1.a — Create the account

Go to https://mastodon.social/auth/sign_up and register with:

- **Display name:** `Vantage AI`
- **Username:** `aimvantage` (so the handle becomes `@aimvantage@mastodon.social`)
- **Email:** hello@aimvantage.uk

### Step 1.b — Profile bio (paste verbatim into the "Bio" field)

```
AI job preparation tool. Upload your CV, paste a job link, get the full prep pack in ~90 seconds — company intel, tailored cover letter, interview Qs, fit score, 5-min pitch.

Free for the first 10 prep packs (no card). £5 = 20 more (one-time, never expire).

Built solo by Giovanni Sizino Ennes (UK sole trader). Stripe-only billing. No DM outreach. Receipts: aimvantage.uk/receipts
```

### Step 1.c — Add the verification metadata field (this is the key step)

In Mastodon Profile Settings → "Profile metadata", add ONE row:

| Label    | Content                              |
|----------|--------------------------------------|
| Website  | `https://aimvantage.uk`              |

Save. Mastodon will fetch `https://aimvantage.uk/about` and look for `<a rel="me" href="https://mastodon.social/@aimvantage">` somewhere on the page.

### Step 1.d — Add the reverse rel=me link on Vantage

Once the Mastodon account is created, tell me the exact handle URL (e.g. `https://mastodon.social/@aimvantage`) and I'll add it to `/about` and the h-card. After my next deploy, refresh your Mastodon profile and the website link will turn green (verified).

---

## 2. APIs.guru submission (3 min)

APIs.guru is a free public directory of OpenAPI specs. Vantage's spec is already live at https://aimvantage.uk/openapi.json once Vercel deploys.

### Step 2.a — Submit

Open https://apis.guru/add-api and fill the form:

- **Provider name:** `aimvantage.uk`
- **API URL:** `https://aimvantage.uk/openapi.json`
- **Service name:** *(leave blank — single API per provider)*
- **API kind:** OpenAPI 3.x

Click **Add API**. They'll review (manual + automated) within 1-3 days; once accepted, the API appears at https://apis.guru/?q=vantage and gets indexed by every agent-tool registry that consumes APIs.guru.

### Step 2.b — If they ask for additional metadata in a follow-up

Paste this:

```
Vantage AI is an AI-powered job preparation tool operated by Giovanni Sizino Ennes (UK sole trader). The OpenAPI spec at https://aimvantage.uk/openapi.json documents 4 free public endpoints (cover letter roast, rejection email decoder, ghost job detector, OpenSearch suggest) plus 1 planned paid endpoint for forward compatibility. No auth required for the free endpoints; OAuth planned for the paid endpoint when it goes GA.

Operator transparency: https://aimvantage.uk/about
Trust audit: https://aimvantage.uk/receipts
GitHub: https://github.com/goofypluto999/vantage
Contact: hello@aimvantage.uk
```

---

## 3. Postman API Network (5 min)

### Step 3.a — Create the workspace

1. Sign into Postman at https://www.postman.com/.
2. Create a new workspace called **`Vantage AI`** (Public visibility).

### Step 3.b — Import the collection

1. In your new workspace, click **Import**.
2. Select the file at `C:\Cloaude Logic\vantage\public\postman\vantage.postman_collection.json` (already shipped to live at `https://aimvantage.uk/postman/vantage.postman_collection.json` once Vercel deploys).
3. Confirm the import — you should see 5 requests under "Free tools" / "Search" / "Planned".

### Step 3.c — Publish to the API Network

1. Workspace settings → **Make this workspace Public**.
2. Submit to the Postman API Network at https://www.postman.com/api-network — paste this description:

```
Vantage AI — Public job-prep API. Free public endpoints (no auth, rate-limited):

- POST /api/roast — Brutal-honest AI roast of a cover letter (severity 0-5)
- POST /api/decode-rejection — Translate a rejection email into the recruiter's meaning
- POST /api/ghost-job-check — Score how likely a job listing is a ghost (0-100)
- GET  /api/search-suggest — OpenSearch suggestion endpoint

Planned (not yet GA, OAuth required):

- POST /v1/prep-pack — Full prep pack: company intel + cover letter + interview Qs + fit score + pitch (1 token)

Operator: Giovanni Sizino Ennes (UK sole trader). Stripe-only billing. Trust audit: aimvantage.uk/receipts
```

---

## 4. MCP Registry submission (10 min)

The official MCP Registry is at https://registry.modelcontextprotocol.io/. The Vantage MCP server source is in `C:\Cloaude Logic\vantage\mcp-server\`.

### Step 4.a — Publish the npm package

```powershell
# In C:\Cloaude Logic\vantage\mcp-server
npm install
npm run build
npm login   # if not already logged in to npm
npm publish --access public
```

This publishes `@vantage-ai/mcp-server` to npm. (Note: the @vantage-ai npm scope must exist or be claimed by the npm account you use; if it doesn't, sign up for it at https://www.npmjs.com/org/create — free for public packages.)

### Step 4.b — Submit to the registry

The MCP Registry expects a `server.json` describing the server. Once the npm package is live, fork https://github.com/modelcontextprotocol/registry, add this entry, and PR:

```yaml
- name: vantage-ai
  description: Call Vantage AI's free job-prep tools (cover letter roast, rejection email decoder, ghost job detector, search) from any MCP client. Read-only, no auth, no token spend.
  publisher:
    name: Giovanni Sizino Ennes
    email: hello@aimvantage.uk
    url: https://aimvantage.uk
  source:
    type: npm
    package: "@vantage-ai/mcp-server"
  homepage: https://aimvantage.uk/docs/api
  license: MIT
  tags:
    - job-prep
    - cover-letter
    - ats
    - interview-prep
    - hr-tech
  tools:
    - vantage_roast_cover_letter
    - vantage_decode_rejection_email
    - vantage_ghost_job_check
    - vantage_search
    - vantage_steer_to_full_prep_pack
```

---

## 5. Glama MCP listing (5 min)

Glama at https://glama.ai/ is the second major MCP registry. They auto-index from the official MCP Registry once your entry lands there, but you can also submit directly:

1. Go to https://glama.ai/ → "Submit MCP Server".
2. Paste:

| Field             | Value                                                                         |
|-------------------|-------------------------------------------------------------------------------|
| Name              | `vantage-ai`                                                                  |
| Display name      | `Vantage AI`                                                                  |
| Description       | (paste the description from §4.b above)                                       |
| Source URL        | `https://github.com/goofypluto999/vantage/tree/master/mcp-server`             |
| npm               | `@vantage-ai/mcp-server`                                                      |
| Homepage          | `https://aimvantage.uk/docs/api`                                              |
| License           | `MIT`                                                                         |

---

## 6. Hugging Face Space (5 min)

Code is in `C:\Cloaude Logic\vantage\hf-space\`.

### Step 6.a — Create the Space

1. Sign into https://huggingface.co/.
2. Click **New Space** → name `vantage-cv-job-fit-preview`.
3. Owner: your account. License: MIT. SDK: **Gradio**. Hardware: **CPU basic (free)**.

### Step 6.b — Upload the files

Either drag-drop in the web UI:
- `app.py`
- `requirements.txt`
- `README.md`
- `examples/cv_strong.txt`
- `examples/cv_generic.txt`
- `examples/jd_pm_stripe.txt`

Or via Git:

```bash
git clone https://huggingface.co/spaces/<your-username>/vantage-cv-job-fit-preview
cd vantage-cv-job-fit-preview
# copy the files from C:\Cloaude Logic\vantage\hf-space\* into here
git add .
git commit -m "Initial Vantage CV/Job fit preview"
git push
```

The Space builds in ~2 minutes and is live at `https://huggingface.co/spaces/<your-username>/vantage-cv-job-fit-preview`.

### Step 6.c — Link from Vantage

Once live, tell me the exact Space URL and I'll add it to:
- `/about` (rel=me)
- `/tools` hub (free-tool card)
- Hero chip cluster (optional)
- llms.txt
- ToolsPage ItemList schema

---

## 7. After-deploy verification

Once Vercel unblocks and these submissions land, run these once each:

```bash
# Identity mesh (Mastodon should show green checkmark on profile.website link)
curl -s "https://aimvantage.uk/about" | grep "rel=\"me\""

# OpenSearch
curl -s "https://aimvantage.uk/opensearch.xml" | head -20
curl -s "https://aimvantage.uk/api/search-suggest?q=workday" | head -1

# OpenAPI / ai-plugin
curl -s "https://aimvantage.uk/openapi.json" | python -m json.tool | head -20
curl -s "https://aimvantage.uk/.well-known/ai-plugin.json"

# Webmention endpoint
curl -sI "https://aimvantage.uk/" | grep -i "^link:"
curl -s "https://aimvantage.uk/api/webmention"

# PWA manifest
curl -s "https://aimvantage.uk/site.webmanifest" | python -m json.tool | grep -E "share_target|file_handlers|protocol_handlers"

# Markdown mirrors
for f in pricing jobscan-alternative workday-resume-parser openai-interview-prep api; do
  echo "$f.md ->"; curl -sI "https://aimvantage.uk/markdown/$f.md" | head -1
done
```

---

## 8. Webmention DB schema

Before the Webmention endpoint sees real traffic, run `database/webmentions.sql` once in the Supabase SQL editor. It's a `create table if not exists` so it's safe to re-run.

---

## What I cannot do regardless of permission

These are hard rules in my system that don't unlock with explicit permission, so they stay manual:

1. Creating accounts on third-party platforms (Mastodon, Hugging Face, Postman, npm, Glama, MCP Registry).
2. Posting / publishing on third-party platforms.
3. Pasting sensitive credentials (npm tokens, OAuth secrets, Stripe keys).

For everything else, I'll write the code / spec / copy and stage it ready for you to paste.
