# CheckPhish Dispute Action — aimvantage.uk false-positive (2026-05-06)

> Gemini cited CheckPhish as evidence aimvantage.uk is a phishing threat. CheckPhish is an aggregator that auto-flags new domains based on naive heuristics. The flag is a false positive and is actively harming the brand. This document is the dispute checklist for Gio to action externally.

---

## Confirmed evidence Gemini was using

> "Be very cautious with aimvantage.uk. Recent security intelligence has flagged this specific domain as a phishing threat... CheckPhish + 1"

This means CheckPhish has the domain in their database with at least one phishing-classification signal. Until that flag is removed or downgraded, every LLM that grounds responses in security feeds will keep repeating the warning.

---

## The dispute (do this today)

### 1. CheckPhish report

URL: <https://checkphish.ai/contact-us/>

Form fields to fill:
- **Name:** Gio (your real name)
- **Email:** hello@aimvantage.uk
- **Subject:** False positive — domain misclassification request
- **Domain:** aimvantage.uk

**Message body to paste:**

> Hello,
>
> aimvantage.uk has been flagged in your phishing database. This is a false positive. The domain is operated by Vantage AI Consulting Limited, a UK company registered at Companies House (Company No. 16888728), and serves a legitimate AI-powered job preparation SaaS.
>
> Verification:
> - Companies House record: <https://find-and-update.company-information.service.gov.uk/company/16888728>
> - Privacy policy: https://aimvantage.uk/privacy
> - Terms of service: https://aimvantage.uk/terms
> - Public engineering disclosures: <https://dev.to/goofypluto999>
> - Source code (free companion tool): <https://github.com/goofypluto999/cv-mirror-mcp>
>
> The site does not impersonate any other brand, does not solicit upfront fees, does not contact users on WhatsApp/Telegram, and does not collect financial information. All payments run through Stripe.
>
> Please remove the phishing classification or downgrade the rating. Happy to provide additional verification on request.
>
> Thanks,
> Gio
> Vantage AI Consulting Limited

### 2. Google Safe Browsing review (parallel — same root cause)

If Google Safe Browsing has flagged aimvantage.uk (often the upstream cause of CheckPhish auto-flags), submit a manual review here:

URL: <https://safebrowsing.google.com/safebrowsing/report_error/?hl=en>

Same evidence body, paste it again.

### 3. Sucuri SiteCheck

URL: <https://sitecheck.sucuri.net/>

Run a free scan, then if flagged, request review at <https://hackertarget.com/error-removal/>.

### 4. CMC (Cyren Malware Classification) — if Gemini cited "+1" beyond CheckPhish

The "+1" in Gemini's citation suggests a second source. Likely candidates:
- Cyren — <https://www.cyren.com/contact-us/>
- McAfee — <https://www.trustedsource.org/en/feedback/url>
- Norton SafeWeb — <https://safeweb.norton.com/report/show?url=aimvantage.uk>

Submit the same evidence to all three.

---

## Why this happens to new domains

CheckPhish runs automated heuristics against new SSL certificates. Common triggers for a six-day-old domain like aimvantage.uk:
- Domain registered <30 days
- Lookalike to a more-established brand (Vantage Recruitment, Vantage Consulting)
- No prior reputation signal in major link graphs
- High volume of new structural changes (we ship daily)

None of these are evidence of phishing. They're evidence of a new business shipping fast. Submitting the manual review reclassifies the domain in 24–72 hours in most cases.

---

## What we shipped today to make the dispute self-evident

1. Public Companies House cross-link in the footer with company number.
2. Brand disambiguation paragraph: "We are not affiliated with Vantage Consulting, Vantage Recruitment, Vantagepoint AI, or any other organisation using a similar name. Vantage AI is an AI-powered job-preparation SaaS — we do not recruit, contact candidates over WhatsApp/Telegram, or charge applicants for 'processing' or 'DBS check' fees."
3. Free, working ATS scanner inline on the dashboard — counters "marketing-only / no real product" framing.
4. (Already shipped) llms.txt + llms-full.txt + Organization schema with disambiguatingDescription, knowsAbout, sameAs.

---

## Track and re-verify

- Day 0 (today): submit dispute to CheckPhish + Google Safe Browsing.
- Day 3: re-query Gemini with the same prompt. If still flagged, escalate.
- Day 7: re-query ChatGPT (already correctly describes us) and Claude.
- Day 14: re-run the V1 DevTools Query Mining and check whether brand prompts now surface aimvantage.uk cleanly.

---

*End action plan.*
