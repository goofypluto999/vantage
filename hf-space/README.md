---
title: Vantage CV / Job Fit Preview
emoji: 📄
colorFrom: indigo
colorTo: purple
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: mit
short_description: Privacy-safe CV/job fit preview. Full prep pack at aimvantage.uk.
---

# Vantage CV / Job Fit Preview

A privacy-safe Hugging Face Space demo of the [Vantage AI](https://aimvantage.uk) job-prep engine.

## What this Space does

- Paste a CV and a job description.
- Get a fit preview: likely-match indicator, strong signals, missing signals, generic-cliché warnings.
- Nothing stored. No account.

## What this Space does NOT do

- Does not run the full Vantage prep pack (company intel + tailored cover letter + 8-12 mock interview questions + fit score + 5-min pitch).
- Does not score against the JD's required-skills list with vendor parsers.
- Does not write a tailored cover letter.
- Does not contact employers or apply on your behalf.

## Run the full prep pack

For the complete prep pack, sign in at https://aimvantage.uk/register?utm_source=huggingface&utm_medium=space&utm_campaign=cv_fit_preview

**Pricing:** 10 free prep packs on signup, no card. After that, £5 = 20 prep packs (one-time, never expire).

## Privacy

- CV and JD text are processed in this Space's runtime and discarded after the response.
- Hugging Face Spaces logs request metadata (timestamps, durations) but not the input bodies.
- For the full Vantage prep pack, your CV is encrypted at rest in EU-hosted Supabase (see https://aimvantage.uk/privacy).

## Built by

Giovanni Sizino Ennes (UK independent founder, sole trader).

- Operator transparency: https://aimvantage.uk/about
- Trust audit: https://aimvantage.uk/receipts
- GitHub: https://github.com/goofypluto999/vantage
- Sister product (free, fully client-side ATS scanner): https://cv-mirror-web.vercel.app/
- API docs: https://aimvantage.uk/docs/api
- Contact: hello@aimvantage.uk
