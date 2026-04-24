import type { ReactNode } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;       // ISO date
  updatedAt?: string;
  author: string;
  readingTime: string;
  tags: string[];
  /** Short excerpt shown on the blog index. ~40-60 words. */
  excerpt: string;
  /** Heading used inline on the article page. */
  hook: string;
  /**
   * Body sections. Each section is either a heading or a paragraph.
   * Kept data-only so a .md twin can be generated from the same source.
   */
  sections: BlogSection[];
}

export type BlogSection =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; text: string };

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-prep-for-any-interview-in-20-minutes',
    title: 'How to prep for any job interview in 20 minutes',
    description: 'A concrete 20-minute interview prep routine used by people applying to 50+ jobs a week. Company research, fit check, likely questions, and a mock drill — no BS, no fluff.',
    publishedAt: '2026-04-24',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Interview Prep', 'Job Search', 'AI Tools', 'Career'],
    excerpt: 'If you have 20 minutes and an interview tomorrow, you do not need a prep course. You need a routine that hits company intel, CV-to-role fit, likely questions, and one mock drill. Here is exactly what to do.',
    hook: 'If you have 20 minutes and an interview tomorrow, you do not need a prep course. You need a routine.',
    sections: [
      { type: 'p', text: 'Most interview prep guides assume you have three evenings. You do not. You have 20 minutes between the moment you remember you have an interview and the moment the recruiter gets on the call.' },
      { type: 'p', text: 'This is the routine I built for myself when I was applying to 50 jobs a week. I now run it through Vantage in about 90 seconds, but here is the manual version so you understand what actually matters.' },

      { type: 'h2', text: 'The 20-minute interview prep routine' },
      { type: 'ol', items: [
        'Minutes 0–4: Company intel. What do they do? Who pays them? What is the recent news?',
        'Minutes 4–8: CV-to-role fit. What do they want, what do you have, where are the gaps?',
        'Minutes 8–14: Likely questions. Generate 6–10 questions the interviewer is probably going to ask.',
        'Minutes 14–18: One mock drill. Say three answers out loud. Awkwardly. At your screen.',
        'Minutes 18–20: Close. Pick one story to tell, one gap to acknowledge, one question to ask.',
      ] },

      { type: 'h2', text: 'Step 1 — Company intel (4 minutes)' },
      { type: 'p', text: 'Open the company website. Read the homepage, the about page, and the most recent blog post or press release. Your goal is three facts you can reference in the interview without sounding rehearsed.' },
      { type: 'p', text: 'Then open their LinkedIn page. Scroll the last 10 posts. Look for what the leadership is publicly excited about — that is the pattern language the whole company uses in meetings.' },
      { type: 'callout', text: 'Shortcut: Vantage scrapes the homepage, their recent news, their stack, and their culture signals in about 20 seconds. Paste a job URL and you have this for free.' },

      { type: 'h2', text: 'Step 2 — CV-to-role fit (4 minutes)' },
      { type: 'p', text: 'Put your CV and the job description side by side. Highlight three matches and three gaps. The matches are your talking points. The gaps are what the interviewer is going to probe.' },
      { type: 'p', text: 'For every gap, write one sentence that turns it into a transferable skill or a recent learning moment. This is not spin — it is preparation. If you walk in without a story for your gaps, the silence will do the work for them.' },

      { type: 'h2', text: 'Step 3 — Likely interview questions (6 minutes)' },
      { type: 'p', text: 'There are three categories, and a decent interview will hit all three.' },
      { type: 'h3', text: 'Behavioural' },
      { type: 'ul', items: [
        'Tell me about a time you disagreed with a manager.',
        'Walk me through a project you are proud of.',
        'Describe a failure and what you learned.',
      ] },
      { type: 'h3', text: 'Role-specific' },
      { type: 'ul', items: [
        'How would you approach [the first 90 days in this role]?',
        'What is your process for [the core task of the job]?',
        'Describe a time you did exactly this kind of work before.',
      ] },
      { type: 'h3', text: 'Company-specific' },
      { type: 'ul', items: [
        'Why us?',
        'What do you think is hard about our industry right now?',
        'How would you improve [our product or service]?',
      ] },
      { type: 'p', text: 'Write one bullet-point answer for each. Not a script. A bullet.' },

      { type: 'h2', text: 'Step 4 — Mock drill (4 minutes)' },
      { type: 'p', text: 'Pick three of your bullets. Say them out loud. Full sentences. Awkwardly. At your screen. This is the single highest-leverage thing you can do in 20 minutes.' },
      { type: 'p', text: 'You will hear every um, every long pause, every sentence that trails off into nothing. Fix those three things and you have already outprepared most candidates.' },
      { type: 'callout', text: 'Vantage now runs AI-graded mock interviews. Our upcoming voice synthesis mock interview adds a spoken AI interviewer, so you can rehearse out loud without a human counterpart. This is in development and ships next.' },

      { type: 'h2', text: 'Step 5 — Close the routine (2 minutes)' },
      { type: 'p', text: 'Pick one of each:' },
      { type: 'ol', items: [
        'One signature story — a 90-second example that demonstrates the job-critical skill. Rehearse it one more time.',
        'One gap you will acknowledge — a single sentence that shows self-awareness without apologising.',
        'One question to ask — something specific enough that no candidate ahead of you will have asked it.',
      ] },

      { type: 'h2', text: 'The version that takes 90 seconds instead of 20 minutes' },
      { type: 'p', text: 'The reason I built Vantage is that doing this routine manually, 50 times a week, breaks you. The tool compresses all five steps into one upload: you paste a job link, upload your CV, and about 90 seconds later you have company intel, a CV fit score, likely interview questions, a mock drill, and a 5-minute interview pitch outline.' },
      { type: 'p', text: 'The 20-minute manual routine still works. But if you are applying to more than three jobs a week, the manual version is the reason you are burning out.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'How accurate is AI-generated interview prep?' },
      { type: 'p', text: 'Useful for the first draft. Always verify the company intel against the live site. Always adjust the likely questions for your specific industry. The AI is a force multiplier, not a replacement for judgement.' },
      { type: 'h3', text: 'Does this work for technical interviews?' },
      { type: 'p', text: 'Yes for behavioural, yes for role-specific, yes for company-specific. No for the actual technical problem-solving part — that you still drill on LeetCode or Exercism. This routine gets you ready for the non-technical 60% of a technical interview.' },
      { type: 'h3', text: 'Should I memorise my answers?' },
      { type: 'p', text: 'No. Memorise the structure. Improvise the words. Memorised answers sound memorised, and interviewers are trained to spot them.' },

      { type: 'p', text: 'Ship it. Walk in prepared. Good luck.' },
    ],
  },

  {
    slug: 'what-ats-actually-checks-in-2026',
    title: 'What ATS screening software actually checks in 2026',
    description: 'A plain-English breakdown of how modern applicant tracking systems parse CVs in 2026. What gets flagged, what gets filtered, and what to fix before you hit submit.',
    publishedAt: '2026-04-24',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['ATS', 'CV', 'Resume', 'Job Search'],
    excerpt: 'Most "ATS-friendly CV" advice on the internet is from 2017. The software has moved on. Here is what modern applicant tracking systems actually check — and what to do about it before you hit submit.',
    hook: 'Most "ATS-friendly CV" advice on the internet is from 2017. The software has moved on.',
    sections: [
      { type: 'p', text: 'If you have been told to "just use bullet points" or "avoid tables" and that is the whole strategy, you are operating on a ten-year-old playbook. The applicant tracking systems shipping in 2026 do a lot more than keyword matching.' },
      { type: 'p', text: 'Here is what they actually check, based on the documentation of the top five ATS platforms currently on the market.' },

      { type: 'h2', text: 'What ATS software checks in 2026' },
      { type: 'ol', items: [
        'Parse success — can it extract your name, email, employers, and dates cleanly?',
        'Keyword match — do you reference the skills and tools in the job description?',
        'Experience calculation — how many years of each skill can it infer from your CV?',
        'Location and work authorisation — does your stated location match the role, do you have the right to work?',
        'Duplicate detection — have you applied before, using a different email?',
        'Semantic ranking (new) — does an embedding of your CV match an embedding of the job description?',
      ] },

      { type: 'h2', text: '1. Parse success' },
      { type: 'p', text: 'The ATS has to convert your PDF or DOCX into structured text. If the parse fails, you do not get rejected — you get ignored. Your CV just fails to populate the fields.' },
      { type: 'p', text: 'What breaks parsing:' },
      { type: 'ul', items: [
        'Text inside image-based PDFs. If your CV was exported as an image, the parser sees nothing.',
        'Multi-column layouts. Some parsers still read left-to-right, so a two-column CV reads like a paragraph-jumbled mess.',
        'Headers and footers. Recent versions handle them, but older ones still lose the content.',
        'Fancy fonts that embed as glyphs. Stick to standard fonts — Inter, Helvetica, Arial, Calibri, Georgia.',
        'Tables used for layout. Use tables only for actual tabular data.',
      ] },
      { type: 'callout', text: 'The single best parse-compatibility test is to open your CV in Google Docs, upload the PDF, and read the raw text. If it reads coherently, any modern ATS will parse it.' },

      { type: 'h2', text: '2. Keyword match' },
      { type: 'p', text: 'Still a thing, but more nuanced than 2017. Modern ATSes look for exact matches, stemmed matches ("manage" vs "managed" vs "management"), and synonym matches ("client" = "customer"). They also count frequency — mentioning a skill once vs three times vs ten times signals different confidence.' },
      { type: 'p', text: 'Practical rule: for every must-have skill in the job description, reference it at least twice in your CV, ideally in two different contexts (a past role and a skills section).' },

      { type: 'h2', text: '3. Experience calculation' },
      { type: 'p', text: 'The ATS looks at each skill you mention, then scans the date ranges of the jobs where you mention it, and calculates years of experience. This is how job postings requiring "5 years of Python" are enforced at scale.' },
      { type: 'p', text: 'If you used Python at job A (2020–2022) and job B (2023–2025), the ATS can see you have 4 years. If you just list "Python" in a skills section with no roles attached, you have 0 years by its count.' },
      { type: 'p', text: 'Fix: do not isolate skills. Attach each must-have skill to a specific role with dates.' },

      { type: 'h2', text: '4. Location and work authorisation' },
      { type: 'p', text: 'This is a hard filter. If the role is US-only and your CV lists a London address, some ATSes auto-reject before a human ever sees it. Not cruel, just scale — a single opening gets 800 applications and the filter is how hiring teams cope.' },
      { type: 'p', text: 'If you are open to relocation, say so on your CV in one line near the top.' },

      { type: 'h2', text: '5. Duplicate detection' },
      { type: 'p', text: 'If you applied for the same role with a slightly different CV two weeks ago, the ATS may flag it. Do not game this — recruiters see the flag, and it looks bad. Apply once with your best CV.' },

      { type: 'h2', text: '6. Semantic ranking — the new one' },
      { type: 'p', text: 'Several ATSes in 2026 run both the job description and every CV through an embedding model. They then sort candidates by cosine similarity. This is why you can miss keywords and still rank highly — if your CV semantically describes the same kind of work, the model sees it.' },
      { type: 'p', text: 'This is also why keyword stuffing is less useful than it used to be. The model sees through it.' },
      { type: 'p', text: 'What works instead: describe your past work in the same language style the job description uses. Long technical phrases, not short keyword lists.' },

      { type: 'h2', text: 'The quickest CV fix that actually moves the needle' },
      { type: 'p', text: 'Run this checklist in order. Each step takes 2–3 minutes.' },
      { type: 'ol', items: [
        'Parse check: upload your PDF to Google Docs, confirm the text is clean.',
        'Keyword check: list every must-have skill in the job description. Make sure each appears at least twice in your CV, in role-context.',
        'Date check: every skill in your skills section should tie to a role with dates. Move orphaned skills into the role bullets.',
        'Location check: make your city / country / work authorisation unambiguous in the top section.',
        'Semantic check: read the job description and your CV back-to-back. Do they sound like they describe adjacent work? If not, rewrite two role bullets in the same register.',
      ] },

      { type: 'h2', text: 'Where this is going' },
      { type: 'p', text: 'ATS software is getting better at the semantic step every quarter. Over the next year, keyword-stuffed CVs will rank lower, not higher, as the models get more accurate at detecting manipulation. The winning move now is the same as the winning move always has been: be honest, be specific, be readable.' },
      { type: 'callout', text: 'We are building an ATS Scanner inside Vantage that shows you exactly how the parsing, keyword, and semantic steps read your CV — and what to change before you hit submit. It is in development and ships next.' },

      { type: 'p', text: 'Ship your application. But ship a version that survives the parse.' },
    ],
  },

  {
    slug: 'the-4-cover-letter-tones-and-when-to-use-each',
    title: 'The 4 cover letter tones, and when each one wins',
    description: 'Not every role wants the same cover letter. The right tone depends on the company culture. Here are the four tones that cover most cases, with examples and a rule for when each one wins.',
    publishedAt: '2026-04-24',
    author: 'Gio',
    readingTime: '6 min read',
    tags: ['Cover Letter', 'Writing', 'Job Search'],
    excerpt: 'Not every role wants the same cover letter. The right tone depends on the company. Here are the four tones that cover most cases, with examples and a rule for when each one wins.',
    hook: 'One cover letter template does not work. Neither does four.',
    sections: [
      { type: 'p', text: 'The instinct is to have one good cover letter template and just swap out the company name. This works until you apply to a big-four consultancy and an early-stage climate-tech startup in the same week and send them the same letter.' },
      { type: 'p', text: 'The fix is not writing four templates. The fix is learning which of four tones a given role wants, then writing one letter in that tone.' },

      { type: 'h2', text: 'The four tones' },
      { type: 'ul', items: [
        'Professional — formal, structured, safe.',
        'Warm — human, friendly, personable.',
        'Direct — short, punchy, confident.',
        'Creative — story-driven, memorable, risky.',
      ] },
      { type: 'p', text: 'Vantage lets you generate a cover letter once, then swap between all four tones with one click. The rest of this post is the rule for which one to ship.' },

      { type: 'h2', text: 'Tone 1 — Professional' },
      { type: 'p', text: 'Formal opening, structured middle, respectful close. Minimal personality. This is the safest tone and the most boring one.' },
      { type: 'h3', text: 'Use it when' },
      { type: 'ul', items: [
        'The company is a law firm, consultancy, investment bank, or enterprise corporate.',
        'The role title contains the word "Senior," "Principal," or "Partner."',
        'The company website uses words like "rigorous," "trusted," "established."',
        'You are applying to the public sector or a government body.',
      ] },
      { type: 'h3', text: 'Skip it when' },
      { type: 'p', text: 'The company has a "team" page with first names only and photos of dogs. Professional tone at a startup reads like you did not do your research.' },

      { type: 'h2', text: 'Tone 2 — Warm' },
      { type: 'p', text: 'Human opening, conversational middle, friendly close. Still structured but with personality showing through.' },
      { type: 'h3', text: 'Use it when' },
      { type: 'ul', items: [
        'The company is mid-size (50–500 people) and has a distinct brand voice.',
        'The role is client-facing or people-facing — sales, customer success, HR, partnerships.',
        'The job description is written in the second person ("you will...") rather than the third.',
        'The company blog has first-person posts from the founders.',
      ] },
      { type: 'h3', text: 'Skip it when' },
      { type: 'p', text: 'You are applying to a role that requires rigorous formality — a law firm partner role, a regulated healthcare senior role, a C-suite position at a public company. The warm tone reads as unserious in those contexts.' },

      { type: 'h2', text: 'Tone 3 — Direct' },
      { type: 'p', text: 'Three-sentence paragraphs. No pleasantries. Confidence without arrogance. Often the shortest of the four tones.' },
      { type: 'h3', text: 'Use it when' },
      { type: 'ul', items: [
        'The company is an early-stage startup (under 50 people).',
        'The founders publicly say they hate long cover letters (YC founders, specifically, often do).',
        'The role is technical and the hiring bar is exceptional — they do not have time for three paragraphs of setup.',
        'You have a very strong fit and can lead with evidence, not framing.',
      ] },
      { type: 'h3', text: 'Skip it when' },
      { type: 'p', text: 'Your fit is not immediately obvious. A direct tone without strong fit reads as dismissive. If you need two paragraphs to explain why you are a match, use warm instead.' },

      { type: 'h2', text: 'Tone 4 — Creative' },
      { type: 'p', text: 'Opens with a story, a hook, or a question. Structured around a narrative rather than a CV summary. The riskiest tone and the most memorable.' },
      { type: 'h3', text: 'Use it when' },
      { type: 'ul', items: [
        'The role is in marketing, brand, content, or creative direction.',
        'The company explicitly asks for a non-standard application ("tell us something weird about you").',
        'You have an actual story that ties to the role in a non-obvious way.',
        'You are under 3 years into your career and leading with evidence would come up short.',
      ] },
      { type: 'h3', text: 'Skip it when' },
      { type: 'p', text: 'Every other context. A creative cover letter sent to a law firm will not be read. A creative cover letter sent to a startup that did not ask for one will make the founder wince. High ceiling, low floor.' },

      { type: 'h2', text: 'The rule for picking' },
      { type: 'p', text: 'Read the company homepage. Read the job description. Read two employee LinkedIn posts. Then pick the tone that matches the average register of those three sources. If you cannot decide, default to warm — it is the widest-use tone that still has personality.' },

      { type: 'h2', text: 'What Vantage does' },
      { type: 'p', text: 'Vantage generates a cover letter once, then lets you flip between Professional / Warm / Direct / Creative with one click. We cache the alternatives so switching is instant after the first rewrite. This is deliberately one-click so you can read all four and pick the one that sounds like you.' },
      { type: 'p', text: 'One upload, one job link, four tones, about 90 seconds. That is the point of the tool.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Do cover letters even matter in 2026?' },
      { type: 'p', text: 'For senior roles, specialised roles, and small companies: yes, a lot. For entry-level at megacorps where an ATS screens 800 CVs first: less. Always write one if the application form has a field for it. Always make it specific to the role.' },
      { type: 'h3', text: 'How long should a cover letter be?' },
      { type: 'p', text: '250–400 words. Shorter if the tone is Direct, longer if the tone is Creative. Never over 500.' },
      { type: 'h3', text: 'Is it OK to use AI to write it?' },
      { type: 'p', text: 'Yes, as long as you edit it. AI-written cover letters that have not been edited sound generic. The fastest process is: generate with AI, swap two sentences for something specific only you could write, ship it.' },

      { type: 'p', text: 'Pick a tone. Write the letter. Ship it.' },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

// Re-export ReactNode only so callers can import types cleanly.
export type { ReactNode };
