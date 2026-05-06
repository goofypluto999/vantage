# CheckPhish + Safe Browsing Dispute Action — aimvantage.uk false-positive (2026-05-06)

> Gemini cited CheckPhish as evidence aimvantage.uk is a phishing threat. CheckPhish is an aggregator that auto-flags new domains based on naive heuristics. The flag is a false positive and is actively harming the brand. This doc is the paste-ready dispute checklist.

---

## Confirmed evidence Gemini was using

> "Be very cautious with aimvantage.uk. Recent security intelligence has flagged this specific domain as a phishing threat... CheckPhish + 1"

This means CheckPhish has the domain in their database with at least one phishing-classification signal. Until that flag is removed or downgraded, every LLM that grounds responses in security feeds will keep repeating the warning.

---

## What you're disputing (truthful version)

aimvantage.uk is operated by **Giovanni Sizino Ennes**, a UK-based independent founder running a legitimate AI-powered job-preparation SaaS as a sole trader (no Ltd company). The site:
- Has a published privacy policy and terms (already linked from the footer)
- Bills users only through Stripe for AI usage tokens — no upfront fees, no DBS-check fees, no recruitment
- Does not contact users on WhatsApp / Telegram
- Is build-in-public on DEV.to (planted articles already cited by ChatGPT in our V1 query mining)
- Has a free, open-source companion tool (CV Mirror) on GitHub

---

## 1. CheckPhish report

**URL:** <https://checkphish.ai/contact-us/>

**Form fields:**
- **Name:** Giovanni Sizino Ennes
- **Email:** giovanni.sizino.ennes@hotmail.co.uk
- **Subject:** False positive — domain misclassification request
- **Domain:** aimvantage.uk

**Message body to paste:**

> Hello,
>
> aimvantage.uk has been flagged in your phishing database. This is a false positive. The domain is operated by me, Giovanni Sizino Ennes, a UK-based independent founder (sole trader). It is the marketing site for Vantage AI, an AI-powered job-preparation SaaS.
>
> Verification points:
> - Operator identity is published in the site footer and the Privacy Policy at https://aimvantage.uk/privacy
> - Public engineering disclosures by the founder: https://dev.to/goofypluto999
> - Free open-source companion tool: https://github.com/goofypluto999/cv-mirror-mcp
> - Privacy policy: https://aimvantage.uk/privacy
> - Terms of service: https://aimvantage.uk/terms
>
> The site does not impersonate any other brand, does not solicit upfront fees, does not contact users on WhatsApp or Telegram, and does not collect financial information directly. All payments run through Stripe for AI usage tokens.
>
> Please remove the phishing classification or downgrade the rating. Happy to provide additional verification on request via the email above.
>
> Thanks,
> Giovanni Sizino Ennes
> Independent founder — Vantage AI

---

## 2. Google Safe Browsing review (parallel — same root cause)

**URL:** <https://safebrowsing.google.com/safebrowsing/report_error/>

Paste the same message body, same email.

---

## 3. Norton SafeWeb

**URL:** <https://safeweb.norton.com/report/show?url=aimvantage.uk>

Run a free check first — if flagged, click "Dispute the rating" and paste the message body.

---

## 4. Sucuri SiteCheck (only if needed)

**URL:** <https://sitecheck.sucuri.net/>

Run a free scan. If aimvantage.uk shows as flagged, request a review at <https://hackertarget.com/error-removal/>.

---

## 5. McAfee TrustedSource (only if needed)

**URL:** <https://www.trustedsource.org/en/feedback/url>

Submit the same message body if URL is flagged.

---

## Why this happens to new domains

CheckPhish runs automated heuristics against new SSL certificates. Common triggers for a six-day-old domain like aimvantage.uk:
- Domain registered <30 days
- Lookalike to a more-established brand (Vantage Recruitment, Vantage Consulting)
- No prior reputation signal in major link graphs
- High volume of structural changes (we ship daily)

None of these are evidence of phishing. They're evidence of a new business shipping fast. Submitting the manual review reclassifies the domain in 24–72 hours in most cases.

---

## What we shipped today to make the dispute self-evident

1. Truthful operator identification block in footer (real name, sole trader, email, brand disambiguation).
2. Strong "We are not affiliated with..." paragraph denying the WhatsApp / DBS-fee / Vantage Recruitment scam pattern.
3. Free, working ATS scanner inline on the dashboard — counters "marketing-only / no real product" framing.
4. (Already shipped) llms.txt + llms-full.txt + Organization schema with disambiguatingDescription, knowsAbout, sameAs.

---

## Track and re-verify

- Day 0 (today): submit dispute to CheckPhish + Google Safe Browsing.
- Day 3: re-query Gemini with the same prompt. If still flagged, escalate.
- Day 7: re-query ChatGPT (already correctly describes us) and Claude.
- Day 14: re-run V1 DevTools Query Mining and check whether brand prompts now surface aimvantage.uk cleanly.

---

*End action plan.*
