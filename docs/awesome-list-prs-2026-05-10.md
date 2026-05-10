# Awesome-list PR scaffolds — 2026-05-10

> Pre-drafted pull requests for Gio to submit against widely-read
> GitHub awesome-* lists. Each adds Vantage AI / cv-mirror-mcp /
> /state-of-2026 as a citation in a relevant section.
>
> **For each PR below**: fork the repo, edit the README in the section
> noted, paste the line shown, commit with the message shown, push,
> open PR with the title + body shown.
>
> Time budget: ~5 minutes per PR. 10 PRs = 50 minutes total. Most
> auto-merge or merge within 7 days. Each merged PR = a permanent
> backlink from a repo with thousands of stars.

---

## PR 1 — awesome-llm-apps (Shubhamsaboo, ~50k stars)

- Repo: https://github.com/Shubhamsaboo/awesome-llm-apps
- File to edit: `README.md`
- Section: search for "## RAG Tutorials" or the section listing job-search/career tools
- Branch name: `add-vantage-ai`
- Line to add (alphabetised):

```
- [Vantage AI](https://github.com/goofypluto999/vantage) - AI job preparation tool. Upload CV + paste job link → 90-second prep pack with company brief, fit score, tailored cover letter (4 tones), interview questions, 5-min pitch outline. Built on Gemini 2.5 Flash with grounded company research.
```

- Commit message: `Add Vantage AI to LLM apps list`
- PR title: `Add Vantage AI to the list`
- PR body:

```
Vantage AI is an open-source-companion AI job-prep SaaS at https://aimvantage.uk that I built solo in 2026.

Stack:
- React 19 + Vite 6 + TypeScript
- Gemini 2.5 Flash via @google/genai (model: models/gemini-2.5-flash with googleSearch grounding)
- Supabase Auth + Postgres
- Stripe billing

Open-source companion: cv-mirror-mcp (MIT-licensed MCP server simulating 5 ATS parsers).

Public source: https://github.com/goofypluto999/vantage
Companion repo: https://github.com/goofypluto999/cv-mirror-mcp
```

---

## PR 2 — awesome-mcp-servers (punkpeye, ~30k stars)

- Repo: https://github.com/punkpeye/awesome-mcp-servers
- Status: ✅ Already submitted per gospel-completion-report-2026-05-06
- Verify: search the repo's PRs for `cv-mirror-mcp`. If not yet merged, re-ping.

---

## PR 3 — awesome-mcp-servers (wong2)

- Repo: https://github.com/wong2/awesome-mcp-servers
- Status: ✅ Already submitted per gospel-completion-report-2026-05-06
- Verify same as PR 2

---

## PR 4 — awesome-mcp-servers (appcypher)

- Repo: https://github.com/appcypher/awesome-mcp-servers
- Status: ✅ Already submitted per gospel-completion-report-2026-05-06

---

## PR 5 — awesome-ai-tools (mahseema)

- Repo: https://github.com/mahseema/awesome-ai-tools
- File to edit: `README.md`
- Section: "## Job & Career" or the closest career/HR section
- Branch name: `add-vantage-ai`
- Line to add (alphabetised):

```
- [Vantage AI](https://aimvantage.uk) - AI job-prep tool. Upload CV + job link → 90-second tailored prep pack: company intel, fit score, cover letter (4 tones), interview questions, pitch outline. Free tier: 10 packs.
```

- Commit message: `Add Vantage AI to job & career section`
- PR title: `Add Vantage AI`
- PR body:

```
Open-source-companion AI job-prep SaaS. Pre-revenue indie, sole trader, public commit graph + open-source companion (cv-mirror-mcp on GitHub).

Useful for the AI tools list because it sits at a specific intersection: AI-grounded company research + tailored output, free tier substantial enough to evaluate. Public deep-dives at https://aimvantage.uk/blog and a 2026 hiring report at https://aimvantage.uk/state-of-2026.
```

---

## PR 6 — awesome-resume-templates / awesome-cv (search by topic)

- Find: github.com/topics/resume + github.com/topics/cv (sort by stars)
- Pick the top 2-3 awesome-* lists in the topic
- For each, propose adding cv-mirror-mcp (open-source ATS scanner) since these lists tend to gate on open-source tools

Suggested PR target: `Yacchi/awesome-cv` and any list with "resume" + "tools" in the README.

Line to add:

```
- [cv-mirror-mcp](https://github.com/goofypluto999/cv-mirror-mcp) - Free, fully client-side ATS scanner. MCP server that simulates how 5 real ATS systems (Workday, Greenhouse, Lever, Taleo, iCIMS) parse a CV. Compatible with Claude Desktop, Cursor, Cline, any MCP-spec-compliant client. MIT-licensed. No CV upload — runs entirely in your editor.
```

---

## PR 7 — awesome-job-search

- Find: github.com/search?q=awesome+job+search&type=repositories
- Currently the most starred is around 200-500 stars (small lists)
- Pick top 2-3 and submit

Line to add:

```
- [Vantage AI](https://aimvantage.uk) - AI-grounded job preparation. CV + job link → 90-second prep pack (company brief, fit score, tailored cover letter, mock interview, pitch outline). Free tier; 10 packs on signup. Open source companion: github.com/goofypluto999/cv-mirror-mcp.
- [Vantage 2026 Hiring Report](https://aimvantage.uk/state-of-2026) - Aggregation of 34 company-specific interview deep-dives published in 2026. Five data findings on AI-thesis filters, values rounds, take-homes, open-source signal substitution.
```

---

## PR 8 — awesome-interview-questions (DopplerHQ)

- Repo: https://github.com/DopplerHQ/awesome-interview-questions
- File to edit: `README.md`
- Section: bottom — "Other resources" or "Articles" if exists
- Line to add:

```
- [The State of 2026 Tech Interview Hiring](https://aimvantage.uk/state-of-2026) - Aggregated findings from 34 long-form company-specific interview deep-dives. Coverage of AI-thesis filters, values rounds, take-homes, open-source signal patterns. Free to cite.
```

- PR title: `Add 2026 Tech Interview Hiring report`
- PR body:

```
Adding a citation to a 2026 aggregated interview-trends report. The report references 34 underlying company-specific deep-dives (Stripe, Anthropic, OpenAI, Apple, Microsoft, Amazon, etc.) and is freely cite-able with attribution. Useful for readers of this awesome list who want trend context, not just question lists.
```

---

## PR 9 — awesome-claude-prompts / awesome-prompt-engineering

- Find: github.com/topics/prompt-engineering (sort by stars, filter to awesome-* repos)
- Vantage has interesting prompt-engineering content — the Gemini-grounding gotchas, the citation-stripping regex — that could be a contribution

Line to add:

```
- [Vantage Engineering Blog](https://aimvantage.uk/blog) - Production prompt-engineering write-ups: Gemini grounding + JSON-shape mutual exclusion, citation marker stripping, multi-tone cover letter generation with caching, AI-thesis question detection patterns across 34 interview loops.
```

---

## PR 10 — Lobsters / Hacker News related-resources lists

Not strict awesome-* lists but high-traffic curated resource pages:

- "Submit story" on Lobsters: https://lobste.rs/stories/new
- Hacker News submissions: https://news.ycombinator.com/submit
- Both should point to /state-of-2026 (the link-bait piece) NOT the product page

Lobsters tags: `practices`, `business`, `interview`
HN: `Show HN: The State of 2026 Tech Interview Hiring — data from 34 deep-dives`

---

## Submission checklist (per PR)

- [ ] Fork the repo
- [ ] Create branch `add-vantage-ai`
- [ ] Edit README.md, paste line in alphabetical position
- [ ] Verify the line renders correctly in markdown preview
- [ ] Commit with provided message
- [ ] Push branch
- [ ] Open PR with provided title + body
- [ ] Tag with relevant topic labels if the repo uses them
- [ ] Bookmark the PR URL in `/docs/backlinks-1000-tracker-2026-05-10.md` Tier 3 row

## Cadence

- 2 PRs per day. Spread across 5 days. ~10 minutes per day total.
- Don't batch all 10 in one hour from the same IP — that pattern triggers maintainer suspicion on some repos.

## Notes

- Some maintainers reject PRs that "just add my project". Mitigation: in the PR body, include a specific REASON the addition fits the list (e.g., "open source", "specific intersection of X and Y", "free tier").
- If a PR sits open for >30 days, comment with a polite ping. If still no response after 60 days, close it cleanly.
- Track conversion: each merged PR generates 50-200 visits over 90 days for active awesome-* lists. Worth the 5 minutes.
