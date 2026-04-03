import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ============================================================================
// TYPES
// ============================================================================

export interface CompanySnapshot {
  name?: string;
  industry?: string;
  founded?: string;
  size?: string;
  mission: string;
  cultureSignals: string[];
  recentHighlights: string[];
}

export interface BriefSections {
  companyContext: string;
  roleRequirements: string;
  cvAlignment: string;
  narrativeAngle: string;
}

export interface JobIntelligence {
  companySnapshot?: CompanySnapshot;
  briefSections?: BriefSections;
  keyRequirements?: string[];
  cvMatchPoints?: string[];
  strategicBrief: string;
  coverLetter: string;
  presentation: { title: string; content: string }[];
  cvFitScore?: number;
  cvFitSummary?: string;
}

export interface InterviewQuestion {
  question: string;
  category: 'behavioural' | 'technical' | 'situational' | 'motivational';
  hint: string;
}

export interface InterviewEvaluation {
  overallScore: number;
  grade: 'Excellent' | 'Good' | 'Needs Work' | 'Poor';
  summary: string;
  strengths: string[];
  improvements: string[];
  metrics: {
    clarity: number;
    relevance: number;
    structure: number;
    impact: number;
    confidence: number;
  };
}

// ============================================================================
// MAIN INTELLIGENCE GENERATION
// ============================================================================

export async function generateJobIntelligence(
  cvFile: File,
  jobUrl: string,
  jobDescFile?: File | null,
  includeFitScore = false
): Promise<JobIntelligence> {
  const cvPart = await fileToGeminiPart(cvFile, 'CV / Resume');
  const jdPart = jobDescFile ? await fileToGeminiPart(jobDescFile, 'Job Description') : null;

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

I am providing my CV${jdPart ? ' and the job description document' : ''}.${jobUrl ? ` Target role/company URL: ${jobUrl}` : ''}

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
- companySnapshot.cultureSignals: 3 specific culture traits observable from the company (not generic ones like "teamwork")
- companySnapshot.recentHighlights: 2 recent, specific company news items or strategic initiatives
- briefSections.companyContext: company background, market position, goals, culture
- briefSections.roleRequirements: decode what the role TRULY needs beyond the JD — the real problems they're trying to solve
- briefSections.cvAlignment: cite SPECIFIC achievements from the CV and map them to specific role requirements
- briefSections.narrativeAngle: the compelling story thread that makes this candidate the obvious choice
- keyRequirements: 4 specific skills/experiences the role demands (short phrases, not sentences)
- cvMatchPoints: 4 specific pieces of CV evidence matching each requirement (short phrases)
- strategicBrief: all 4 brief sections combined as 4 paragraphs
- coverLetter: 3 paragraphs, tailored to company brand voice, professional but human, no generic phrases${includeFitScore ? '\n- cvFitScore: integer 0-100\n- cvFitSummary: 2 sentences' : ''}
- presentation: exactly 6 slides`;

  const parts: any[] = [{ text: prompt }, cvPart];
  if (jdPart) parts.push(jdPart);

  const response = await ai.models.generateContent({
    model: 'models/gemini-2.5-flash',
    contents: [{ parts }],
    config: useSearch
      ? { tools: [{ googleSearch: {} }] }
      : { responseMimeType: 'application/json' },
  });

  if (!response.text) throw new Error('No response received from AI. Please try again.');
  const parsed = parseJSON<JobIntelligence>(response.text);
  // Strip Gemini citation artifacts from cover letter text
  if (parsed.coverLetter) parsed.coverLetter = stripCitations(parsed.coverLetter);
  return parsed;
}

// ============================================================================
// COVER LETTER TONE REWRITE
// ============================================================================

export async function rewriteCoverLetterTone(
  letter: string,
  tone: 'Formal' | 'Warm' | 'Direct' | 'Creative'
): Promise<string> {
  const toneGuides: Record<string, string> = {
    Formal: 'highly professional, structured, formal business language, respectful and measured',
    Warm: 'warm, personable, genuine, human connection-focused, enthusiastic yet professional',
    Direct: 'concise, punchy, no filler phrases, confident, action-oriented, every sentence earns its place',
    Creative: 'creative, distinctive, opens with a hook or metaphor, memorable, stands out from the pile',
  };

  const prompt = `Rewrite this cover letter in a "${tone}" tone.
Tone guidance: ${toneGuides[tone]}.

Rules:
- Keep ALL facts: company name, role title, specific achievements, and names exactly the same
- Only change the voice, phrasing, sentence structure, and opening/closing style
- Keep it 3 paragraphs
- Return ONLY the rewritten cover letter text — no introduction, no label, no JSON

Original letter:
${letter}`;

  const response = await ai.models.generateContent({
    model: 'models/gemini-2.5-flash',
    contents: [{ parts: [{ text: prompt }] }],
  });

  if (!response.text) throw new Error('Could not rewrite cover letter.');
  return stripCitations(response.text.trim());
}

// ============================================================================
// INTERVIEW QUESTION GENERATION
// ============================================================================

export async function generateInterviewQuestions(roleContext: string): Promise<InterviewQuestion[]> {
  const prompt = `You are an expert interview coach preparing a candidate for: ${roleContext}

Generate exactly 5 interview questions tailored to this specific role and company.
Mix the categories: behavioural, technical, situational, and motivational.
Make the questions specific to the role — not generic HR questions.

Return ONLY a valid JSON array — no markdown, no explanation:
[{"question":"...","category":"behavioural|technical|situational|motivational","hint":"..."}]`;

  const response = await ai.models.generateContent({
    model: 'models/gemini-2.5-flash',
    contents: [{ parts: [{ text: prompt }] }],
    config: { responseMimeType: 'application/json' },
  });

  if (!response.text) throw new Error('Could not generate questions.');
  const raw = response.text;
  const start = raw.indexOf('['), end = raw.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('Unexpected format from AI.');
  return JSON.parse(raw.slice(start, end + 1));
}

// ============================================================================
// INTERVIEW ANSWER EVALUATION
// ============================================================================

export async function evaluateInterviewAnswer(
  question: string,
  transcript: string,
  roleContext: string
): Promise<InterviewEvaluation> {
  const prompt = `You are a senior hiring manager and interview coach evaluating a candidate's answer.

Role context: ${roleContext}
Interview question: "${question}"
Candidate's answer: "${transcript}"

Evaluate this answer rigorously but fairly. Be specific in your feedback — reference exact phrases from their answer.
Grade: Excellent (85-100), Good (65-84), Needs Work (40-64), Poor (0-39).

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{"overallScore":78,"grade":"Good","summary":"...","strengths":["..."],"improvements":["..."],"metrics":{"clarity":80,"relevance":85,"structure":70,"impact":75,"confidence":72}}`;

  const response = await ai.models.generateContent({
    model: 'models/gemini-2.5-flash',
    contents: [{ parts: [{ text: prompt }] }],
    config: { responseMimeType: 'application/json' },
  });

  if (!response.text) throw new Error('Could not evaluate answer.');
  return parseJSON<InterviewEvaluation>(response.text);
}

// ============================================================================
// HELPERS
// ============================================================================

async function fileToGeminiPart(file: File, label: string): Promise<any> {
  const name = file.name.toLowerCase();

  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    const base64 = await fileToBase64(file);
    return { inlineData: { data: base64.split(',')[1], mimeType: 'application/pdf' } };
  }

  if (
    name.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const mammoth = await import('mammoth');
    const buffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    return { text: `[${label}]\n${value}` };
  }

  const text = await file.text();
  return { text: `[${label}]\n${text}` };
}

/** Strip Gemini search-grounding citation markers like [CV, cite: 6] or [1] from text. */
function stripCitations(text: string): string {
  return text
    .replace(/\s*\[CV(?:,\s*cite:\s*\d+)?\]/gi, '')
    .replace(/\s*\[cite:\s*\d+\]/gi, '')
    .replace(/\s*\[\d+\]/g, '')
    .trim();
}

function parseJSON<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI returned an unexpected format. Please try again.');
  return JSON.parse(raw.slice(start, end + 1));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}
