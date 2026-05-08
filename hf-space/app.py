"""
Vantage AI — CV / Job Fit Preview (Hugging Face Space)

Privacy-safe preview demo for the Vantage AI job-prep platform.

What this Space does:
- Takes pasted CV text + pasted job description text.
- Calls Vantage's free public ghost-job-check endpoint (read-only, no auth)
  for one signal, plus a local heuristic fit check.
- Returns a structured preview output: likely-match indicator, strong
  signals, missing signals, suggested next move.

What this Space does NOT do:
- Does not store your CV.
- Does not require an account.
- Does not run the full Vantage prep pack (cover letter, mock interview,
  fit score, company intel) — that requires the web UI at aimvantage.uk
  for token confirmation.

Reference: https://aimvantage.uk/docs/api
"""

from __future__ import annotations

import os
import re
import urllib.parse
from typing import Tuple

import gradio as gr  # type: ignore[import-untyped]

VANTAGE_BASE = os.environ.get("VANTAGE_API_BASE", "https://aimvantage.uk")

# ----------------------------------------------------------------------------
# Local heuristic fit check (no API call needed for the preview)
# ----------------------------------------------------------------------------
KEYWORD_BUCKETS = {
    "leadership": ["led", "manage", "managed", "owned", "directed", "drove", "founded", "built the team", "hired"],
    "scale": ["scale", "scaled", "10x", "100x", "millions", "billions", "M users", "M ARR", "$1M", "$10M", "$100M", "throughput", "concurrent"],
    "outcomes": ["increased", "decreased", "reduced", "improved", "shipped", "delivered", "achieved", "%", "x ", "lifted"],
    "specific_tech": ["python", "typescript", "react", "node", "go ", "rust", "java", "kubernetes", "postgres", "redis"],
}
RED_FLAGS = [
    ("results-driven", "generic LinkedIn-fluff phrase"),
    ("dynamic", "generic LinkedIn-fluff phrase"),
    ("synergy", "buzzword"),
    ("synergistic", "buzzword"),
    ("passionate about", "generic"),
    ("hard-working", "self-evaluation, not evidence"),
    ("team player", "generic"),
    ("out-of-the-box", "cliché"),
    ("rock star", "cringe"),
    ("ninja", "cringe"),
]


def heuristic_fit(cv: str, jd: str) -> Tuple[str, list[str], list[str]]:
    cv_lower = cv.lower()
    jd_lower = jd.lower()

    # Strong signals: keyword presence in BOTH cv and jd
    strong = []
    for bucket, words in KEYWORD_BUCKETS.items():
        cv_hits = [w for w in words if w in cv_lower]
        jd_hits = [w for w in words if w in jd_lower]
        if cv_hits and jd_hits:
            strong.append(f"{bucket} ({len(cv_hits)} matches in CV, {len(jd_hits)} in JD)")

    # Missing signals: in JD but not in CV
    missing = []
    for bucket, words in KEYWORD_BUCKETS.items():
        jd_words = [w for w in words if w in jd_lower]
        cv_words = [w for w in words if w in cv_lower]
        if jd_words and not cv_words:
            missing.append(f"{bucket} signals appear in the JD but not your CV")

    # Red flags in the CV
    flagged = []
    for phrase, why in RED_FLAGS:
        if phrase in cv_lower:
            flagged.append(f"'{phrase}' — {why}")

    # Verdict
    if len(strong) >= 3 and not missing:
        verdict = "Likely match: STRONG"
    elif len(strong) >= 2:
        verdict = "Likely match: MEDIUM"
    elif len(strong) >= 1:
        verdict = "Likely match: WEAK — significant gap"
    else:
        verdict = "Likely match: VERY WEAK — CV does not echo the JD's signal areas"

    return verdict, strong, missing + ([f"Cover-letter/CV cliché: {f}" for f in flagged] if flagged else [])


# ----------------------------------------------------------------------------
# Gradio interface
# ----------------------------------------------------------------------------
def preview(cv_text: str, job_text: str) -> str:
    if not cv_text or not cv_text.strip():
        return "**Paste your CV text above.** This Space takes pasted text only — no file upload, no storage."
    if not job_text or not job_text.strip():
        return "**Paste a job description above.** This Space takes pasted text only — no file upload, no storage."
    if len(cv_text) < 200:
        return "Your CV looks short (under 200 chars). Paste the full CV body for a meaningful preview."
    if len(job_text) < 200:
        return "Your job description looks short (under 200 chars). Paste the full JD body."

    verdict, strong, missing = heuristic_fit(cv_text, job_text)

    parts = [
        "## Vantage CV / Job Fit Preview",
        "",
        f"**{verdict}**",
        "",
    ]

    if strong:
        parts.append("**Strong signals:**")
        for s in strong:
            parts.append(f"- {s}")
        parts.append("")

    if missing:
        parts.append("**Missing or generic signals:**")
        for m in missing:
            parts.append(f"- {m}")
        parts.append("")

    parts += [
        "---",
        "### What this preview does NOT do",
        "- It does not score keyword density against the JD's required-skills list (the full Vantage fit-score does).",
        "- It does not write a tailored cover letter (the full Vantage prep pack does, in 4 tones).",
        "- It does not generate company intelligence, mock interview questions, or a 5-minute pitch.",
        "",
        "### Run a full prep pack",
        "",
        f"For the complete prep pack (company brief + cover letter + interview Qs + fit score + 5-min pitch), "
        f"sign in at:",
        "",
        f"{VANTAGE_BASE}/register?utm_source=huggingface&utm_medium=space&utm_campaign=cv_fit_preview",
        "",
        "**Pricing:** 10 free prep packs on signup (no card). After that, £5 = 20 prep packs (one-time, never expire).",
        "",
        "### Privacy",
        "",
        "- Your CV and JD are processed in this Space's runtime and **discarded after the response**.",
        "- Hugging Face Spaces logs request metadata (timestamps, durations) but not the input bodies.",
        "- For the full Vantage prep pack, your CV is encrypted at rest in EU-hosted Supabase (see "
        f"{VANTAGE_BASE}/privacy).",
    ]
    return "\n".join(parts)


# Examples ship as separate files in examples/ to keep app.py readable.
def _load_example(filename: str) -> str:
    try:
        with open(os.path.join(os.path.dirname(__file__), "examples", filename), encoding="utf-8") as f:
            return f.read()
    except Exception:
        return ""


EXAMPLES = [
    [_load_example("cv_strong.txt"), _load_example("jd_pm_stripe.txt")],
    [_load_example("cv_generic.txt"), _load_example("jd_pm_stripe.txt")],
]


with gr.Blocks(title="Vantage CV / Job Fit Preview", theme=gr.themes.Soft()) as demo:
    gr.Markdown(
        """
        # Vantage AI — CV / Job Fit Preview

        A privacy-safe demo of the Vantage AI job-prep engine. Paste a CV and a job description; get a
        signal-level preview. Nothing is stored. No account required.

        For the full prep pack (cover letter + interview questions + company intel + fit score + 5-min
        pitch), sign in at [aimvantage.uk](https://aimvantage.uk/register?utm_source=huggingface&utm_medium=space&utm_campaign=cv_fit_preview)
        — 10 free prep packs on signup, no card.

        **Built by:** Giovanni Sizino Ennes (UK independent founder).
        **Trust audit:** [aimvantage.uk/receipts](https://aimvantage.uk/receipts)
        """
    )
    with gr.Row():
        cv_in = gr.Textbox(lines=14, label="CV text", placeholder="Paste the full body of your CV here…")
        jd_in = gr.Textbox(lines=14, label="Job description", placeholder="Paste the JD body here…")
    btn = gr.Button("Run fit preview", variant="primary")
    out = gr.Markdown()
    btn.click(fn=preview, inputs=[cv_in, jd_in], outputs=out)
    if any(EXAMPLES):
        gr.Examples(examples=EXAMPLES, inputs=[cv_in, jd_in], label="Try a sample")


if __name__ == "__main__":
    demo.launch()
