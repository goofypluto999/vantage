// API endpoint for job analysis
// Vercel serverless function - handles Gemini AI calls securely
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface JobIntelligence {
  companySnapshot?: {
    name?: string;
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

async function getUserCredits(userId: string): Promise<{ total: number; used: number }> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=credits_total,credits_used`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  const profiles = await res.json();
  if (!profiles || profiles.length === 0) {
    return { total: 10, used: 0 };
  }
  return { total: profiles[0].credits_total, used: profiles[0].credits_used };
}

async function deductCredits(userId: string, amount: number): Promise<void> {
  const { total, used } = await getUserCredits(userId);
  await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({
      credits_used: used + amount,
    }),
  });
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
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Invalid JSON format');
  return JSON.parse(raw.slice(start, end + 1));
}

function stripCitations(text: string): string {
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
  includeFitScore: boolean
): Promise<JobIntelligence> {
  const useSearch = Boolean(jobUrl);

  const jsonShape = `{
    "companySnapshot": {
      "name": "<company name>",
      "industry": "<industry/sector>",
      "founded": "<founding year if findable, else null>",
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

  const prompt = `You are an expert career coach and corporate strategist.

I am providing my CV and the job description document.${jobUrl ? ` Target role/company URL: ${jobUrl}` : ''}

${useSearch ? 'Use web search to deeply research the company — find their official name, industry, founding year, approximate headcount, mission, recent news, product launches, culture, leadership, and brand voice.' : ''}
Cross-reference my CV with the role requirements${useSearch ? ' and live company context' : ''}.

Return ONLY valid JSON in exactly this shape (no markdown, no explanation):
${jsonShape}

Requirements:
- companySnapshot.name: the official company name (extract from URL or JD)
- companySnapshot.industry: the company's primary industry or sector
- companySnapshot.founded: the year the company was founded (from web search or JD), or null
- companySnapshot.size: approximate headcount band (e.g. "500–2,000 employees") from web search or JD, or null
- companySnapshot.mission: one punchy sentence capturing the company's core purpose
- companySnapshot.cultureSignals: 3 specific culture traits observable from the company
- companySnapshot.recentHighlights: 2 recent, specific company news items or strategic initiatives
- briefSections.companyContext: company background, market position, goals, culture
- briefSections.roleRequirements: decode what the role TRULY needs beyond the JD
- briefSections.cvAlignment: cite SPECIFIC achievements from the CV and map them to specific role requirements
- briefSections.narrativeAngle: the compelling story thread that makes this candidate the obvious choice
- keyRequirements: 4 specific skills/experiences the role demands
- cvMatchPoints: 4 specific pieces of CV evidence matching each requirement
- strategicBrief: all 4 brief sections combined as 4 paragraphs
- coverLetter: 3 paragraphs, tailored to company brand voice${includeFitScore ? '\n- cvFitScore: integer 0-100\n- cvFitSummary: 2 sentences' : ''}
- presentation: exactly 6 slides`;

  const cvPart = { text: `[CV / Resume]\n${cvText}` };
  const parts: any[] = [{ text: prompt }, cvPart];
  if (jobDescText) parts.push({ text: `[Job Description]\n${jobDescText}` });

  const response = await ai.models.generateContent({
    model: 'models/gemini-2.5-flash',
    contents: [{ parts }],
    config: useSearch
      ? { tools: [{ googleSearch: {} }] }
      : { responseMimeType: 'application/json' },
  });

  if (!response.text) throw new Error('No response received from AI');

  const parsed = parseJSON<JobIntelligence>(response.text);
  if (parsed.coverLetter) {
    parsed.coverLetter = stripCitations(parsed.coverLetter);
  }

  return parsed;
}

async function parseCVFile(file: any): Promise<string> {
  if (!file) return '';
  
  const buffer = Buffer.from(file.data, 'base64');
  const text = buffer.toString('utf-8');
  
  if (file.mimetype === 'application/pdf') {
    return text.substring(0, 50000);
  }
  
  return text.substring(0, 50000);
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
    const { total: creditsTotal, used: creditsUsed } = await getUserCredits(user.id);
    const creditsRemaining = creditsTotal - creditsUsed;

    const COST_PER_ANALYSIS = 2;
    if (creditsRemaining < COST_PER_ANALYSIS) {
      return response.status(403).json({
        error: 'Insufficient credits',
        creditsRemaining,
        required: COST_PER_ANALYSIS,
      });
    }

    const formData = request.body;
    const jobUrl = formData.jobUrl || '';
    const includeFitScore = formData.includeFitScore === true || formData.includeFitScore === 'true';
    const cvText = formData.cvText || '';
    const jobDescText = formData.jobDescText || null;

    const results = await generateJobIntelligence(cvText, jobUrl, jobDescText, includeFitScore);

    await deductCredits(user.id, COST_PER_ANALYSIS);
    await saveAnalysis(user.id, jobUrl, results, COST_PER_ANALYSIS);

    const newCredits = creditsRemaining - COST_PER_ANALYSIS;

    return response.status(200).json({
      success: true,
      data: results,
      creditsRemaining: newCredits,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return response.status(500).json({ error: error.message || 'Analysis failed' });
  }
}