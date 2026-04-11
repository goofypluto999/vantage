// API endpoint for job analysis
// Vercel serverless function - handles Gemini AI calls securely
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ─── Job URL scraper ─────────────────────────────────────────────────────────
// Fetches the actual job page content so Gemini doesn't have to guess.
// Falls back gracefully if the page blocks us.

function isUrlSafe(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const hostname = parsed.hostname.toLowerCase();
    // Block internal/private networks
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') return false;
    if (hostname.startsWith('10.') || hostname.startsWith('192.168.') || hostname.startsWith('172.')) return false;
    if (hostname.startsWith('169.254.')) return false; // AWS metadata
    if (hostname.endsWith('.internal') || hostname.endsWith('.local')) return false;
    return true;
  } catch {
    return false;
  }
}

async function scrapeJobUrl(url: string): Promise<string | null> {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Referer': 'https://www.google.com/',
  };

  // Layer 1: Direct fetch
  let html = await fetchPage(url, headers);
  if (html) {
    const text = extractTextFromHtml(html);
    if (text && text.length > 200) return text;
  }

  // Layer 2: Jina Reader (renders JavaScript, handles SPAs)
  try {
    const jinaRes = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'text/plain',
        'X-No-Cache': 'true',
        'X-Return-Format': 'text',
      },
      signal: AbortSignal.timeout(20000),
    });
    if (jinaRes.ok) {
      const text = await jinaRes.text();
      if (text.length > 200 && !text.includes('returned error')) return text.slice(0, 12000);
    }
  } catch { /* Jina failed, continue */ }

  // Layer 3: Google webcache
  try {
    const cacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`;
    const cacheHtml = await fetchPage(cacheUrl, headers);
    if (cacheHtml) {
      const text = extractTextFromHtml(cacheHtml);
      if (text && text.length > 200) return text;
    }
  } catch { /* Cache failed, continue */ }

  // Layer 4: Jina Search (searches Google for the URL and extracts the top result)
  try {
    const searchRes = await fetch(`https://s.jina.ai/${encodeURIComponent(url)}`, {
      headers: { 'Accept': 'text/plain' },
      signal: AbortSignal.timeout(15000),
    });
    if (searchRes.ok) {
      const text = await searchRes.text();
      if (text.length > 200) return text.slice(0, 12000);
    }
  } catch { /* Jina search failed, continue */ }

  return null;
}

async function fetchPage(url: string, headers: Record<string, string>): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers,
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html') && !ct.includes('application/xhtml')) return null;
    const html = await res.text();
    // Detect soft 404 / expired job pages
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = (titleMatch?.[1] || '').toLowerCase();
    const soft404 = /(page not found|not found|404|no longer available|expired|job removed|this job has been|unavailable)/i;
    if (soft404.test(title)) {
      console.warn('Detected soft 404 page:', title);
      return null;
    }
    return html;
  } catch {
    return null;
  }
}

function extractTextFromHtml(html: string): string {
  // Extract structured data first (JSON-LD job postings)
  const jsonLd = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLd) {
    for (const block of jsonLd) {
      try {
        const content = block.replace(/<\/?script[^>]*>/gi, '');
        const data = JSON.parse(content);
        if (data['@type'] === 'JobPosting' || data?.mainEntity?.['@type'] === 'JobPosting') {
          const job = data['@type'] === 'JobPosting' ? data : data.mainEntity;
          const parts = [
            job.title && `Job Title: ${job.title}`,
            job.hiringOrganization?.name && `Company: ${job.hiringOrganization.name}`,
            job.jobLocation?.address?.addressLocality && `Location: ${job.jobLocation.address.addressLocality}`,
            job.baseSalary && `Salary: ${JSON.stringify(job.baseSalary)}`,
            job.description && `Description: ${stripHtmlTags(job.description)}`,
          ].filter(Boolean);
          if (parts.length >= 2) return parts.join('\n').slice(0, 8000);
        }
      } catch { /* not valid JSON-LD */ }
    }
  }

  // Extract OG meta tags
  const ogTitle = html.match(/og:title[^>]*content="([^"]*)"/)?.[1] || '';
  const ogDesc = html.match(/og:description[^>]*content="([^"]*)"/)?.[1] || '';

  // Extract page title
  const pageTitle = html.match(/<title[^>]*>(.*?)<\/title>/)?.[1] || '';

  // Strip scripts, styles, nav, headers, footers
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

  text = stripHtmlTags(text);

  // Combine structured meta with body text
  const meta = [pageTitle, ogDesc].filter(Boolean).join('\n');
  const combined = meta ? `${meta}\n\n${text}` : text;

  // If the extracted text is too short or looks like a generic page (no job keywords),
  // return null so Gemini falls back to googleSearch instead of analyzing the job board itself
  if (combined.length < 200) {
    console.warn('Extracted text too short, likely not a valid job page');
    return null;
  }

  return combined.slice(0, 8000);
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|li|h[1-6])[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

interface JobIntelligence {
  companySnapshot?: {
    name?: string;
    nameConfidence?: string;
    industry?: string;
    founded?: string;
    size?: string;
    mission: string;
    cultureSignals: string[];
    recentHighlights: string[];
  };
  briefSections?: {
    companyContext: string;
    roleRequirements: string;
    cvAlignment: string;
    narrativeAngle: string;
  };
  keyRequirements?: string[];
  cvMatchPoints?: string[];
  strategicBrief: string;
  coverLetter: string;
  presentation: { title: string; content: string }[];
  cvFitScore?: number;
  cvFitSummary?: string;
}

async function getTokenBalance(userId: string): Promise<number> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=token_balance`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) return 0;
  const profiles = await res.json();
  if (!profiles || profiles.length === 0) return 0;
  return profiles[0].token_balance ?? 0;
}

async function deductTokens(userId: string, amount: number): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/deduct_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ p_user_id: userId, p_amount: amount }),
  });
  if (!res.ok) {
    const errText = await res.text();
    if (errText.includes('Insufficient')) throw new Error('Insufficient tokens');
    throw new Error('Failed to deduct tokens');
  }
  return res.json();
}

async function saveAnalysis(
  userId: string,
  jobUrl: string,
  results: JobIntelligence,
  creditsSpent: number
): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/analyses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({
      user_id: userId,
      job_url: jobUrl,
      company_name: results.companySnapshot?.name,
      results_json: results,
      credits_spent: creditsSpent,
    }),
  });
}

function parseJSON<T>(text: string): T {
  // Strip markdown fencing if present
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;

  // Find the outermost JSON object by matching braces
  const start = raw.indexOf('{');
  if (start === -1) throw new Error('No JSON object found in response');

  let depth = 0;
  let inString = false;
  let escape = false;
  let end = -1;

  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) { end = i; break; } }
  }

  if (end === -1) throw new Error('Invalid JSON: unmatched braces');
  return JSON.parse(raw.slice(start, end + 1));
}

function stripCitations(text: any): string {
  if (!text || typeof text !== 'string') return text ?? '';
  return text
    .replace(/\s*\[CV(?:,\s*cite:\s*\d+)?\]/gi, '')
    .replace(/\s*\[cite:\s*\d+\]/gi, '')
    .replace(/\s*\[\d+\]/g, '')
    .trim();
}

async function generateJobIntelligence(
  cvText: string,
  jobUrl: string,
  jobDescText: string | null,
  includeFitScore: boolean,
  cvBase64?: string,
  cvMimeType?: string
): Promise<JobIntelligence> {
  // CRITICAL: Scrape the job URL to get actual job description text.
  // Gemini's googleSearch tool does NOT visit URLs — it only searches Google.
  // Without scraping, Gemini will hallucinate the company/role.
  let scrapedJobText: string | null = null;
  if (jobUrl) {
    try {
      console.log(`Scraping job URL: ${jobUrl}`);
      scrapedJobText = await scrapeJobUrl(jobUrl);
      if (scrapedJobText) {
        console.log(`Scraped ${scrapedJobText.length} chars from job URL`);
      } else {
        console.warn('All 4 scraping layers failed — will use Gemini pre-flight to identify job');
      }
    } catch (err: any) {
      console.warn('URL scrape failed:', err.message);
    }
  }

  // If scraping returned content but it looks like a generic job board page
  // (mentions the board name but no specific job title), discard it
  if (scrapedJobText && jobUrl) {
    const urlHost = new URL(jobUrl).hostname.replace('www.', '').split('.')[0];
    const lowerText = scrapedJobText.toLowerCase();
    const hasJobTitle = /job title:|position:|role:/i.test(scrapedJobText);
    const hasCompanyField = /company:|hiring organization:|employer:/i.test(scrapedJobText);
    if (!hasJobTitle && !hasCompanyField && lowerText.split(urlHost).length > 3) {
      console.warn(`Scraped text looks like job board page — discarding`);
      scrapedJobText = null;
    }
  }

  // FALLBACK: When scraping fails, use a dedicated Gemini googleSearch call
  // to identify the ACTUAL job details from the URL BEFORE running the full analysis.
  // This prevents hallucination by verifying facts first.
  let preflightJobInfo: string | null = null;
  if (!scrapedJobText && !jobDescText && jobUrl) {
    console.log('Running pre-flight Gemini call to identify job details from URL...');
    try {
      const preflightPrompt = `I need you to find the EXACT job listing at this URL: ${jobUrl}

Search for this specific job posting. Extract and return ONLY these facts in plain text:
- COMPANY: the exact name of the hiring company (NOT the job board)
- TITLE: the exact job title
- LOCATION: where the job is based
- KEY REQUIREMENTS: the top 5 requirements listed
- DESCRIPTION SUMMARY: a 2-3 sentence summary of the role

Rules:
- If the job board is a platform like Indeed, Reed, SpaceCareers.uk, LinkedIn, etc. — the company is the EMPLOYER, not the platform
- If you cannot find the specific listing, say "LISTING NOT FOUND" and provide whatever partial info you can verify
- Do NOT guess or infer — only report what you actually find`;

      const preflightRes = await ai.models.generateContent({
        model: 'models/gemini-2.5-flash',
        contents: [{ parts: [{ text: preflightPrompt }] }],
        config: { tools: [{ googleSearch: {} }] },
      });

      if (preflightRes.text && preflightRes.text.length > 50) {
        preflightJobInfo = preflightRes.text;
        console.log(`Pre-flight identified job: ${preflightJobInfo.slice(0, 200)}...`);
      }
    } catch (err: any) {
      console.warn('Pre-flight Gemini call failed:', err.message);
    }
  }

  // Merge all available job info: scraped content + user JD + pre-flight results
  const allJobInfo = [scrapedJobText, jobDescText, preflightJobInfo].filter(Boolean);
  const fullJobDesc = allJobInfo.join('\n\n---\n\n');
  const hasJobDesc = fullJobDesc.length > 50;
  const useSearch = Boolean(jobUrl);
  const dataSource = scrapedJobText ? 'scraped' : jobDescText ? 'user-provided' : preflightJobInfo ? 'gemini-preflight' : 'none';

  const jsonShape = `{
    "companySnapshot": {
      "name": "<company name — EXACT name from job description, or 'Unknown' if not found>",
      "nameConfidence": "<high | medium | low — high = found explicitly in JD text, medium = inferred from context, low = guessed>",
      "industry": "<industry/sector>",
      "founded": "<founding year if VERIFIED, else null>",
      "size": "<approximate headcount or band, e.g. '500–2000 employees', else null>",
      "mission": "<one concise sentence capturing company mission>",
      "cultureSignals": ["<culture trait 1>", "<culture trait 2>", "<culture trait 3>"],
      "recentHighlights": ["<recent news/initiative 1>", "<recent news/initiative 2>"]
    },
    "briefSections": {
      "companyContext": "<1-2 paragraphs: company background, goals, market position, recent news>",
      "roleRequirements": "<1-2 paragraphs: decoding what the role truly needs, hidden signals in the JD>",
      "cvAlignment": "<1-2 paragraphs: specific evidence from CV that directly maps to role requirements>",
      "narrativeAngle": "<1 paragraph: the positioning angle and narrative thread to lead with>"
    },
    "keyRequirements": ["<top requirement 1>", "<top requirement 2>", "<top requirement 3>", "<top requirement 4>"],
    "cvMatchPoints": ["<CV evidence that matches req 1>", "<CV evidence that matches req 2>", "<CV evidence that matches req 3>", "<CV evidence that matches req 4>"],
    "strategicBrief": "<single string combining all 4 brief sections as 4 paragraphs>",
    "coverLetter": "<3 paragraphs, tailored to brand voice>"${includeFitScore ? ',\n  "cvFitScore": <integer 0-100>,\n  "cvFitSummary": "<2 sentences>"' : ''},
    "presentation": [{"title":"...","content":"..."}]
  }`;

  const prompt = `You are a brutally honest career analyst. No sugar-coating, no dopamine-pushing, no flattery. Clinical accuracy only.

I am providing my CV${hasJobDesc ? ' and job description data' : ''}.${jobUrl ? ` Target role/company URL: ${jobUrl}` : ''}

DATA SOURCE: ${dataSource === 'scraped' ? 'Job description was scraped directly from the listing URL — treat this as reliable primary data.' : dataSource === 'user-provided' ? 'Job description was provided by the user — treat as reliable.' : dataSource === 'gemini-preflight' ? 'WARNING: Direct scraping of the job URL FAILED (JS-rendered or blocked site). The job info below was obtained via a separate Google Search verification step. Cross-check carefully — do NOT add details not present in the pre-flight data.' : 'WARNING: No job description data could be obtained. You MUST use web search to find this specific job listing. If you cannot find it, set company name to "Unknown — listing not accessible" and be explicit about what you could not verify.'}

COMPANY NAME RULES (CRITICAL — ZERO TOLERANCE FOR ERRORS):
- Extract the EXACT hiring company name from the job description data provided below
- The job may be posted on a job board (e.g. Indeed, Reed, SpaceCareers.uk, LinkedIn) — the job board is NOT the employer
- Look for "Company:", "Employer:", "About [Company]", "Who we are", or the company name in the job title
- If the JD mentions a recruiter posting for a client, identify the ACTUAL end employer
- If you genuinely cannot determine the company name, set name to "Unknown — not found in listing"
- NEVER guess or hallucinate a company name. Getting the company wrong is the worst possible error.
${useSearch ? '\nUse web search to research the company ONLY AFTER you have identified it from the job data. Search for: founding year, headcount, mission, recent news. If you could not identify the company, search using the job URL and any partial info you have.' : ''}

FOUNDED DATE RULES:
- Only include a founding year if you found it from a reliable source (company website, Wikipedia, the JD itself)
- If uncertain, set founded to null — do NOT guess

Cross-reference my CV with the role requirements${useSearch ? ' and live company context' : ''}.

Return ONLY valid JSON in exactly this shape (no markdown, no explanation):
${jsonShape}

Requirements:
- companySnapshot.name: the EXACT employer name from the job description (NOT the job board name, NOT guessed)
- companySnapshot.industry: the company's primary industry or sector
- companySnapshot.founded: verified founding year ONLY — null if uncertain
- companySnapshot.size: approximate headcount from reliable sources — null if unknown
- companySnapshot.mission: one sentence capturing the company's core purpose
- companySnapshot.cultureSignals: 3 specific culture traits (not generic like "teamwork" — cite evidence)
- companySnapshot.recentHighlights: 2 recent, specific, VERIFIED company news items (not fabricated)
- briefSections.companyContext: company background, market position, goals, culture
- briefSections.roleRequirements: decode what the role TRULY needs beyond the JD — be specific about technical skills, clearances, or qualifications that are non-negotiable
- briefSections.cvAlignment: cite SPECIFIC achievements from the CV that map to requirements. Be honest — if the CV lacks direct experience in a required area, say so explicitly
- briefSections.narrativeAngle: the positioning angle. If the candidate is a weak fit, acknowledge this and suggest the strongest possible angle despite the gaps
- keyRequirements: 4 specific skills/experiences the role demands (include hard requirements like certifications, clearances, years of experience)
- cvMatchPoints: 4 CV evidence points. If the CV doesn't match a requirement, write "NO DIRECT MATCH — [closest transferable skill]" instead of fabricating a match
- strategicBrief: all 4 brief sections combined as 4 paragraphs
- coverLetter: 3 paragraphs, tailored to company brand voice. Even if fit is low, write the best possible letter${includeFitScore ? `
- cvFitScore: integer 0-100 using this STRICT calibration:
  90-100 = Perfect match (meets ALL requirements, direct industry experience, exact skills)
  75-89 = Strong match (meets most requirements, relevant industry, minor gaps)
  60-74 = Moderate match (meets some requirements, transferable skills, notable gaps)
  40-59 = Weak match (few direct matches, mostly transferable skills, major gaps)
  20-39 = Poor match (different industry/skillset, significant retraining needed)
  0-19 = No match (completely unrelated background)
  Be HARSH. A marketing professional applying to a defence engineering role is NOT an 88. Score what the CV ACTUALLY demonstrates vs what the role ACTUALLY requires. Do not inflate scores to be encouraging.
- cvFitSummary: 2 sentences. First sentence: what matches. Second sentence: what's missing or weak. Be direct.` : ''}
- presentation: exactly 6 slides`;

  // PDF: send as inline data (Gemini parses PDFs natively — better than text extraction)
  // Text/DOCX: already extracted to clean text by the client
  const cvPart = cvBase64 && cvMimeType
    ? { inlineData: { data: cvBase64, mimeType: cvMimeType } }
    : { text: `[CV / Resume]\n${cvText}` };
  const parts: any[] = [{ text: prompt }, cvPart];
  if (hasJobDesc) {
    const sourceLabel = dataSource === 'scraped' ? 'scraped from listing'
      : dataSource === 'user-provided' ? 'provided by user'
      : 'obtained via Google Search verification';
    parts.push({ text: `[Job Description — ${sourceLabel}]\n${fullJobDesc}` });
  }

  // When we have job content (from any source), use JSON mode for reliable structured output.
  // Only use googleSearch when ALL data sources failed and we need Gemini to find the listing itself.
  const useGoogleSearch = useSearch && !hasJobDesc;

  const callGemini = async () => {
    const res = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ parts }],
      config: useGoogleSearch
        ? { tools: [{ googleSearch: {} }] }
        : { responseMimeType: 'application/json' },
    });
    return res;
  };

  console.log(`Calling Gemini: useGoogleSearch=${useGoogleSearch}, hasJobDesc=${hasJobDesc}, parts=${parts.length}`);
  let response = await callGemini();

  // Retry once if empty response (Gemini can intermittently return nothing)
  if (!response.text) {
    console.warn('Gemini returned empty response, retrying...');
    response = await callGemini();
  }

  if (!response.text) {
    const candidates = (response as any).candidates;
    const reason = candidates?.[0]?.finishReason || 'unknown';
    console.error('Gemini empty response. finishReason:', reason, 'candidates:', JSON.stringify(candidates || []));
    throw new Error(`AI returned no content (reason: ${reason}). Please try again.`);
  }

  const parsed = parseJSON<JobIntelligence>(response.text);

  // Strip Gemini grounding citations from all text fields
  if (parsed.coverLetter) parsed.coverLetter = stripCitations(parsed.coverLetter);
  if (parsed.strategicBrief) parsed.strategicBrief = stripCitations(parsed.strategicBrief);
  if (parsed.cvFitSummary) parsed.cvFitSummary = stripCitations(parsed.cvFitSummary);
  if (parsed.companySnapshot) {
    if (parsed.companySnapshot.mission) parsed.companySnapshot.mission = stripCitations(parsed.companySnapshot.mission);
    parsed.companySnapshot.cultureSignals = parsed.companySnapshot.cultureSignals?.map(stripCitations) || [];
    parsed.companySnapshot.recentHighlights = parsed.companySnapshot.recentHighlights?.map(stripCitations) || [];
  }
  if (parsed.briefSections) {
    for (const key of Object.keys(parsed.briefSections) as Array<keyof typeof parsed.briefSections>) {
      if (parsed.briefSections[key]) parsed.briefSections[key] = stripCitations(parsed.briefSections[key]);
    }
  }
  parsed.keyRequirements = parsed.keyRequirements?.map(stripCitations) || [];
  parsed.cvMatchPoints = parsed.cvMatchPoints?.map(stripCitations) || [];
  if (parsed.presentation) {
    parsed.presentation = parsed.presentation.map(s => ({
      title: stripCitations(s.title),
      content: stripCitations(s.content),
    }));
  }

  // POST-GENERATION VALIDATION: catch common hallucination patterns
  if (parsed.companySnapshot?.name) {
    const name = parsed.companySnapshot.name.toLowerCase();
    // Check if Gemini returned a job board name instead of the actual employer
    const jobBoards = ['indeed', 'reed', 'linkedin', 'glassdoor', 'spacecareers', 'totaljobs', 'cwjobs', 'monster', 'adzuna', 'jobsite'];
    const isJobBoard = jobBoards.some(board => name.includes(board));
    if (isJobBoard && jobUrl) {
      console.warn(`POST-VALIDATION: Company name "${parsed.companySnapshot.name}" looks like a job board — flagging`);
      parsed.companySnapshot.name = `${parsed.companySnapshot.name} (may be incorrect — this is the job board, not the employer)`;
      (parsed.companySnapshot as any).nameConfidence = 'low';
    }
    // Check if name is very generic or suspiciously short
    if (name.length < 3 || name === 'company' || name === 'employer') {
      parsed.companySnapshot.name = 'Unknown — could not identify employer';
      (parsed.companySnapshot as any).nameConfidence = 'low';
    }
  }

  // Add data source metadata to response
  (parsed as any)._dataSource = dataSource;

  return parsed;
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
    });

    if (!userRes.ok) {
      return response.status(401).json({ error: 'Invalid token' });
    }

    const user = await userRes.json();
    const tokenBalance = await getTokenBalance(user.id);

    const COST_PER_ANALYSIS = 3;
    if (tokenBalance < COST_PER_ANALYSIS) {
      return response.status(403).json({
        error: 'Insufficient tokens',
        token_balance: tokenBalance,
        required: COST_PER_ANALYSIS,
      });
    }

    const formData = request.body;
    const jobUrl = formData.jobUrl || '';
    const includeFitScore = formData.includeFitScore === true || formData.includeFitScore === 'true';
    const cvText = formData.cvText || '';
    const cvBase64 = formData.cvBase64 || '';
    const cvMimeType = formData.cvMimeType || '';
    const jobDescText = formData.jobDescText || null;

    if (!cvText && !cvBase64) {
      return response.status(400).json({ error: 'CV content is required' });
    }
    if (jobUrl && !isUrlSafe(jobUrl)) {
      return response.status(400).json({ error: 'Invalid job URL' });
    }
    if (cvText && cvText.length > 200000) {
      return response.status(400).json({ error: 'CV text is too long' });
    }
    if (cvBase64 && cvBase64.length > 10000000) {
      return response.status(400).json({ error: 'CV file is too large (max ~7MB)' });
    }
    if (jobDescText && jobDescText.length > 200000) {
      return response.status(400).json({ error: 'Job description is too long' });
    }

    const results = await generateJobIntelligence(cvText, jobUrl, jobDescText, includeFitScore, cvBase64, cvMimeType);

    const newBalance = await deductTokens(user.id, COST_PER_ANALYSIS);
    await saveAnalysis(user.id, jobUrl, results, COST_PER_ANALYSIS);

    return response.status(200).json({
      success: true,
      data: results,
      token_balance: newBalance,
    });
  } catch (error: any) {
    console.error('Analysis error:', error?.message || 'Unknown error');
    const msg = error.message?.includes('Insufficient') ? error.message : 'Analysis failed';
    return response.status(500).json({ error: msg });
  }
}