---
title: "What ATS screening software actually checks in 2026"
description: "A plain-English breakdown of how modern applicant tracking systems parse CVs in 2026. What gets flagged, what gets filtered, and what to fix before you hit submit."
author: "Gio"
published: 2026-04-24
reading_time: "7 min"
tags: ["ATS", "CV", "Resume", "Job Search"]
canonical: https://vantage-livid.vercel.app/blog/what-ats-actually-checks-in-2026
---

# What ATS screening software actually checks in 2026

> Most "ATS-friendly CV" advice on the internet is from 2017. The software has moved on.

If you have been told to "just use bullet points" or "avoid tables" and that is the whole strategy, you are operating on a ten-year-old playbook. The applicant tracking systems shipping in 2026 do a lot more than keyword matching.

Here is what they actually check, based on the documentation of the top five ATS platforms currently on the market.

## What ATS software checks in 2026

1. **Parse success** — can it extract your name, email, employers, and dates cleanly?
2. **Keyword match** — do you reference the skills and tools in the job description?
3. **Experience calculation** — how many years of each skill can it infer from your CV?
4. **Location and work authorisation** — does your stated location match the role, do you have the right to work?
5. **Duplicate detection** — have you applied before, using a different email?
6. **Semantic ranking (new)** — does an embedding of your CV match an embedding of the job description?

## 1. Parse success

The ATS has to convert your PDF or DOCX into structured text. If the parse fails, you do not get rejected — you get ignored. Your CV just fails to populate the fields.

What breaks parsing:

- Text inside image-based PDFs. If your CV was exported as an image, the parser sees nothing.
- Multi-column layouts. Some parsers still read left-to-right, so a two-column CV reads like a paragraph-jumbled mess.
- Headers and footers. Recent versions handle them, but older ones still lose the content.
- Fancy fonts that embed as glyphs. Stick to standard fonts — Inter, Helvetica, Arial, Calibri, Georgia.
- Tables used for layout. Use tables only for actual tabular data.

> The single best parse-compatibility test is to open your CV in Google Docs, upload the PDF, and read the raw text. If it reads coherently, any modern ATS will parse it.

## 2. Keyword match

Still a thing, but more nuanced than 2017. Modern ATSes look for exact matches, stemmed matches ("manage" vs "managed" vs "management"), and synonym matches ("client" = "customer"). They also count frequency — mentioning a skill once vs three times vs ten times signals different confidence.

Practical rule: for every must-have skill in the job description, reference it at least twice in your CV, ideally in two different contexts (a past role and a skills section).

## 3. Experience calculation

The ATS looks at each skill you mention, then scans the date ranges of the jobs where you mention it, and calculates years of experience. This is how job postings requiring "5 years of Python" are enforced at scale.

If you used Python at job A (2020–2022) and job B (2023–2025), the ATS can see you have 4 years. If you just list "Python" in a skills section with no roles attached, you have 0 years by its count.

**Fix:** do not isolate skills. Attach each must-have skill to a specific role with dates.

## 4. Location and work authorisation

This is a hard filter. If the role is US-only and your CV lists a London address, some ATSes auto-reject before a human ever sees it. Not cruel, just scale — a single opening gets 800 applications and the filter is how hiring teams cope.

If you are open to relocation, say so on your CV in one line near the top.

## 5. Duplicate detection

If you applied for the same role with a slightly different CV two weeks ago, the ATS may flag it. Do not game this — recruiters see the flag, and it looks bad. Apply once with your best CV.

## 6. Semantic ranking — the new one

Several ATSes in 2026 run both the job description and every CV through an embedding model. They then sort candidates by cosine similarity. This is why you can miss keywords and still rank highly — if your CV semantically describes the same kind of work, the model sees it.

This is also why keyword stuffing is less useful than it used to be. The model sees through it.

What works instead: describe your past work in the same language style the job description uses. Long technical phrases, not short keyword lists.

## The quickest CV fix that actually moves the needle

Run this checklist in order. Each step takes 2–3 minutes.

1. **Parse check:** upload your PDF to Google Docs, confirm the text is clean.
2. **Keyword check:** list every must-have skill in the job description. Make sure each appears at least twice in your CV, in role-context.
3. **Date check:** every skill in your skills section should tie to a role with dates. Move orphaned skills into the role bullets.
4. **Location check:** make your city / country / work authorisation unambiguous in the top section.
5. **Semantic check:** read the job description and your CV back-to-back. Do they sound like they describe adjacent work? If not, rewrite two role bullets in the same register.

## Where this is going

ATS software is getting better at the semantic step every quarter. Over the next year, keyword-stuffed CVs will rank lower, not higher, as the models get more accurate at detecting manipulation. The winning move now is the same as the winning move always has been: be honest, be specific, be readable.

> **Vantage update:** We are building an ATS Scanner inside Vantage that shows you exactly how the parsing, keyword, and semantic steps read your CV — and what to change before you hit submit. It is in development and ships next.

Ship your application. But ship a version that survives the parse.

---

**Try Vantage:** https://vantage-livid.vercel.app
**Pricing:** https://vantage-livid.vercel.app/pricing
