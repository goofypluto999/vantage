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

  {
    slug: 'how-to-use-chatgpt-to-prep-for-an-interview',
    title: 'How to use ChatGPT to prep for an interview (without sounding like a bot)',
    description: 'A working ChatGPT interview prep workflow used by real candidates in 2026. Specific prompts, the exact order to run them, and how to keep your answers sounding human.',
    publishedAt: '2026-04-25',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['ChatGPT', 'AI', 'Interview Prep', 'Job Search'],
    excerpt: 'ChatGPT can prep an interview faster than any human coach — if you run the right prompts in the right order. Most people use it wrong and end up with answers that sound like a press release. Here is the workflow that does not.',
    hook: 'Most people use ChatGPT for interview prep wrong, then sound like a press release in the room.',
    sections: [
      { type: 'p', text: 'There are two ways to use ChatGPT for interview prep. The first is to dump a job description in and ask "what questions will they ask me." The output sounds plausible. You memorise it. You walk into the interview, and the interviewer hits you with one curveball, and the entire scaffolding collapses.' },
      { type: 'p', text: 'The second way is the workflow below. It takes 25 minutes, hits five distinct angles, and leaves you with an interview prep doc that holds together when the interviewer goes off-script.' },

      { type: 'callout', text: 'Quick answer: paste the job description, then run six prompts in this order — company brief, CV-fit gaps, likely questions, story bank, mock-drill rebuttals, opener and closer. Do not ask for a "complete prep guide" in one prompt. The combined answer always sounds generic.' },

      { type: 'h2', text: 'The 6-prompt ChatGPT interview prep workflow' },
      { type: 'ol', items: [
        'Prompt 1 — Company brief from the job link.',
        'Prompt 2 — CV-to-role fit, with gaps named.',
        'Prompt 3 — 10 likely questions, ranked by probability.',
        'Prompt 4 — STAR story bank from your CV.',
        'Prompt 5 — Mock-drill rebuttals to your weakest answer.',
        'Prompt 6 — Opener and closer for the call itself.',
      ] },

      { type: 'h2', text: 'Prompt 1 — Company brief' },
      { type: 'p', text: 'Paste the company URL or job description. Ask:' },
      { type: 'callout', text: 'In 200 words, what does this company do, who are their customers, what have they shipped or announced this quarter, and what is the one thing about their culture they keep emphasising publicly?' },
      { type: 'p', text: 'You want named facts. If the answer is generic ("they are a leading provider of solutions"), reject it and ask "name three specific products or initiatives." This is your "I read about you" reference for the interview.' },

      { type: 'h2', text: 'Prompt 2 — CV-to-role fit' },
      { type: 'p', text: 'Paste your CV and the job description. Ask:' },
      { type: 'callout', text: 'List the three strongest matches between this CV and this role, with one specific line from each. Then list the three biggest gaps the interviewer will likely probe.' },
      { type: 'p', text: 'The matches are your talking points. The gaps are what the interviewer is going to ask about. Both are useful. People skip the gaps because they feel uncomfortable. Senior candidates lean into them.' },

      { type: 'h2', text: 'Prompt 3 — Likely questions' },
      { type: 'callout', text: 'Based on this job description and CV, give me 10 questions the interviewer is likely to ask. Rank them by probability. For each, add one sentence on what they are actually testing.' },
      { type: 'p', text: 'The "what they are testing" is the trick. Most candidates answer the surface question. Senior candidates answer the underlying competency. "Tell me about a time you failed" is testing self-awareness, not failure. Knowing the test changes your answer.' },

      { type: 'h2', text: 'Prompt 4 — STAR story bank' },
      { type: 'callout', text: 'From this CV, suggest five STAR stories I can adapt to most behavioural questions. For each, give me Situation/Task/Action/Result in one short paragraph each.' },
      { type: 'p', text: 'Five stories cover most behavioural questions. Practising five short stories is a hundred times more useful than memorising twenty long ones. Cover: a leadership moment, a failure, a stretch project, a conflict, and a piece of feedback you took.' },

      { type: 'h2', text: 'Prompt 5 — Mock-drill rebuttals' },
      { type: 'callout', text: 'Here is my draft answer to question 3 [paste your answer]. Now play a tough interviewer and write three follow-up questions or pushbacks. Then write a 60-second rebuttal for each.' },
      { type: 'p', text: 'This is the prompt 90% of people skip. It is also the one that closes the gap between "I have an answer" and "I can hold the answer under pressure." Run it for your two weakest answers, not your strongest.' },

      { type: 'h2', text: 'Prompt 6 — Opener and closer' },
      { type: 'callout', text: 'Write me a 30-second opener for when the interviewer says "tell me about yourself" and a 60-second closer for when they ask "do you have any questions for me." Use the company brief and CV from earlier in the conversation. Make it sound like me, not a corporate template.' },
      { type: 'p', text: 'These are the two moments interviewers remember. Most candidates have a generic version. A specific opener that ties to the company\'s actual roadmap stands out, every time.' },

      { type: 'h2', text: 'How to keep it sounding like you' },
      { type: 'p', text: 'Three rules:' },
      { type: 'ol', items: [
        'Read every output out loud. If a sentence feels stiff, rewrite it in your own voice. The fastest tell of AI-written prep is the rhythm.',
        'Insert one specific number or detail per answer. Generic outputs do not have numbers.',
        'Remove every "leverage", "synergy", "passionate about". You probably do not say those words in real life.',
      ] },

      { type: 'h2', text: 'When the manual workflow breaks down' },
      { type: 'p', text: 'This 6-prompt sequence works. It also takes 25 minutes per role. If you are applying to 30 roles a week, that is a part-time job by itself. The reason Vantage exists is that it runs all six prompts in parallel against your CV and the live job link, and gives you back the prep doc in about 90 seconds, with the company brief grounded against the actual website rather than a generic web search.' },
      { type: 'callout', text: 'Vantage runs the same six steps automatically. One upload, one paste, one prep pack. We also cache the AI-graded mock interview so you can rehearse the question they are most likely to ask.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Should I use ChatGPT, Claude, or Gemini?' },
      { type: 'p', text: 'Any of them. The workflow matters more than the model. Claude tends to write more nuanced behavioural answers. ChatGPT is fastest. Gemini is best when you want it to fetch and cite live web pages. Pick whichever you already pay for.' },
      { type: 'h3', text: 'Will the interviewer notice I used AI?' },
      { type: 'p', text: 'Only if you read the answers verbatim. Use the AI to draft, then rewrite in your voice. The interviewer will not notice you used AI any more than they would notice you used a notepad.' },
      { type: 'h3', text: 'How do I avoid hallucinated company facts?' },
      { type: 'p', text: 'Always ground the company brief against the live website. Either paste the URL into a model with web access (ChatGPT, Gemini, Claude with browsing), or do this step manually. Never trust a model\'s memory for company-specific details.' },

      { type: 'p', text: 'Six prompts. Twenty-five minutes. Or ninety seconds with Vantage. Either way, prep beats no prep, every time.' },
    ],
  },

  {
    slug: 'the-30-second-cv-review-recruiters-actually-run',
    title: 'The 30-second CV review test recruiters actually run',
    description: 'Recruiters spend less than a minute on your CV before deciding. Here is the exact 30-second scan they run, what they look for, and how to write a CV that wins it.',
    publishedAt: '2026-04-25',
    author: 'Gio',
    readingTime: '5 min read',
    tags: ['CV', 'Resume', 'Recruiting', 'Job Search'],
    excerpt: 'Recruiters spend 30 seconds on your CV before deciding whether to read it properly. Here is the exact scan they run — and how to write a CV that survives it.',
    hook: 'Your CV gets 30 seconds of attention. Maybe.',
    sections: [
      { type: 'p', text: 'A senior recruiter at a UK-based tech company once let me sit behind her while she went through 80 applications for a single role. She averaged 28 seconds per CV. She rejected 71 of them in that time. The 9 that survived got a second pass that took about 90 seconds each.' },
      { type: 'p', text: 'This is what happens to your CV in those 30 seconds — and what to fix.' },

      { type: 'callout', text: 'Quick answer: recruiters check four things in 30 seconds — the top third of page one, the most recent role title, the company names you have worked at, and one signal of seniority. Win those four, and you survive the scan. Lose any one, and the next click is reject.' },

      { type: 'h2', text: 'The 30-second recruiter scan' },
      { type: 'ol', items: [
        '5 seconds — top third of page one. Name, title, summary line.',
        '8 seconds — most recent job. Title, company, dates, top bullet.',
        '7 seconds — companies you have worked at. Names recognisable? Brand-equity stack visible?',
        '5 seconds — seniority signal. Years of experience, scope, scale, leadership.',
        '5 seconds — second-page-only check. Are there impressive projects, awards, or scope they would have missed?',
      ] },

      { type: 'h2', text: 'What they actually look for in each second' },

      { type: 'h3', text: 'Top third of page one' },
      { type: 'p', text: 'Your name, your current or most recent title, and a one-line summary. This is where most CVs fail — they bury the relevant title in the middle of the page or never state it at all. Make the title match the role you are applying for as closely as honesty allows. "Senior Software Engineer" beats "Tech Lead" if the role title is "Senior Software Engineer."' },

      { type: 'h3', text: 'Most recent job' },
      { type: 'p', text: 'They are looking for: relevant title, recognisable company, current or recent dates, and one bullet that signals what you actually did. The bullet matters. "Led a team of five" is better than "Software engineer responsibilities included writing code."' },

      { type: 'h3', text: 'Companies stack' },
      { type: 'p', text: 'Recruiters scan the right column for company names. If you have worked at known companies, even briefly, those names buy you another 30 seconds of attention. If your companies are unknown, lean on scale ("£12M ARR SaaS, Series A") or named clients ("led the Stripe integration") to substitute.' },

      { type: 'h3', text: 'Seniority signal' },
      { type: 'p', text: 'Years of experience, team size led, budget owned, revenue impact. One of these has to be visible in the first third of page one. "8 years of experience" is the lowest-effort signal; "led a team of 12" is the highest-quality.' },

      { type: 'h2', text: 'What kills you in 30 seconds' },
      { type: 'ul', items: [
        'A summary that says "passionate," "results-driven," or "team player." All three appear in 80% of rejected CVs.',
        'Most recent role buried below older, more impressive ones. Reverse chronological is non-negotiable.',
        'A list of skills with no roles attached. Looks padded. Reads junior.',
        'A two-column CV where the recruiter has to scan in two directions.',
        'A photo. Outside specific roles and specific countries (Germany, France for some industries), it costs you on UK and US applications.',
        'No dates on roles. Reads as hiding something.',
        'A cover-letter-shaped paragraph at the top of the CV. Cover letter goes in the cover letter field.',
      ] },

      { type: 'h2', text: 'The 5-minute fix' },
      { type: 'ol', items: [
        'Rewrite your top-of-CV summary as one sentence: [Years] of experience as [closest title to the role you want], with [strongest single proof point].',
        'Make sure your most recent role lists a specific scope or scale in the first bullet.',
        'Compress everything older than 8 years into a "Previous experience" line.',
        'Delete every adjective. Keep nouns and verbs.',
        'Run the CV through a spelling check, then read it out loud once.',
      ] },

      { type: 'h2', text: 'Why "tailored CVs" is a real thing' },
      { type: 'p', text: 'A CV tailored to the specific role wins the 30-second scan. A generic CV does not. The recruiter is doing pattern-matching against the JD they were briefed on this morning. The closer your title, your top bullet, and your seniority signal match the JD, the more likely you survive the scan.' },
      { type: 'callout', text: 'Vantage scores your CV-to-role fit and shows you exactly which gaps will fail the 30-second scan. Upload your CV, paste the JD, and the fit score plus the rewritten bullets come back in about 90 seconds. The premium plan also includes the 5-minute interview pitch deck and AI-graded mock interview.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'How long should my CV be?' },
      { type: 'p', text: 'One page for under 10 years experience. Two pages maximum past that. Senior roles can stretch to two; junior roles cannot. Three pages always reads as "could not edit."' },
      { type: 'h3', text: 'Should I list every skill?' },
      { type: 'p', text: 'No. List the skills the JD asks for, plus three you genuinely lead with. Padded skill lists hurt more than they help — recruiters read them as inability to prioritise.' },
      { type: 'h3', text: 'Does design matter?' },
      { type: 'p', text: 'Less than you think. A clean, single-column black-text CV in a standard font wins more often than a designed one — except for design, marketing, and creative roles, where a tasteful piece of layout helps.' },

      { type: 'p', text: 'Win the 30 seconds. The next 90 seconds become available automatically.' },
    ],
  },

  {
    slug: 'the-5-minute-interview-pitch-that-gets-you-remembered',
    title: 'The 5-minute interview pitch that gets you remembered',
    description: 'Most candidates wing the "tell us about yourself" question. The strongest candidates have a 5-minute pitch they can compress to 90 seconds. Here is exactly how to build it.',
    publishedAt: '2026-04-25',
    author: 'Gio',
    readingTime: '6 min read',
    tags: ['Interview Prep', 'Pitch', 'Job Search', 'Career'],
    excerpt: 'The strongest candidates walk into a final-round interview with a structured 5-minute pitch they can compress to 90 seconds on demand. Here is the exact structure I use, the trick to making it land, and the version Vantage generates for you.',
    hook: 'The strongest candidates walk into the room with a 5-minute pitch already loaded.',
    sections: [
      { type: 'p', text: 'Most candidates answer "tell us about yourself" with a chronological CV recap. It takes three minutes, the interviewer\'s eyes glaze over by minute two, and they remember nothing. The opener is the most important moment of the interview, and most people waste it.' },
      { type: 'p', text: 'A 5-minute interview pitch fixes this. Even when you only deliver a 90-second version, having the 5-minute structure underneath is what makes the 90 seconds memorable.' },

      { type: 'callout', text: 'Quick answer: a 5-minute interview pitch has five 60-second blocks — origin, expertise, why-now, why-them, and one big ask. The trick is to deliver the 90-second version by default and have the longer version ready when the interviewer asks "tell me more about that one." Without the longer version underneath, the 90-second version sounds rehearsed.' },

      { type: 'h2', text: 'The 5-minute structure' },
      { type: 'ol', items: [
        'Block 1 — Origin (60 seconds): one specific moment in your career that explains why you do what you do.',
        'Block 2 — Expertise (60 seconds): the one thing you are unusually good at, with a proof point.',
        'Block 3 — Why now (60 seconds): why this particular role, this particular moment.',
        'Block 4 — Why them (60 seconds): why this specific company, with a reference to something they shipped or announced.',
        'Block 5 — The ask (60 seconds): what you would want to do in the first 90 days, framed as a question.',
      ] },

      { type: 'h2', text: 'Block 1 — Origin' },
      { type: 'p', text: 'Pick one specific moment, not a CV recap. "I started writing software when I broke my dad\'s computer at 11" beats "I have always been passionate about technology." The first sentence is concrete, has a date, and tells me something I cannot find on LinkedIn.' },
      { type: 'p', text: 'Constraint: this block must contain at least one piece of information that does not appear on your CV. If everything you say is already on the page in front of them, you are wasting the slot.' },

      { type: 'h2', text: 'Block 2 — Expertise' },
      { type: 'p', text: 'Name the one thing you are unusually good at. Then prove it with a 30-second story. "I am unusually good at debugging complex production incidents" is the headline. "Last year I traced a billing bug that had been mis-billing customers for six months across three replicas" is the proof.' },
      { type: 'p', text: 'Pick the expertise that is most relevant to the role. If the role is in customer success, your expertise should not be in algorithm design.' },

      { type: 'h2', text: 'Block 3 — Why now' },
      { type: 'p', text: 'Why this kind of role, this kind of company, at this stage of your career. The honest version is best: "I have done two startups end to end and want to put what I learned into a Series B that has product-market fit but needs a step change in how they ship." Beats "I am looking for the next opportunity."' },

      { type: 'h2', text: 'Block 4 — Why them' },
      { type: 'p', text: 'Reference one thing the company has shipped, said, or announced in the last 6 months. Specific. Not "I love your culture" — that is meaningless filler. "I read your engineering blog post about how you re-architected the rate limiter — that kind of mid-stage refactoring is exactly what I want to be doing." That works.' },
      { type: 'p', text: 'If you cannot name something specific, you have not done enough company research, and the rest of the pitch will not save you.' },

      { type: 'h2', text: 'Block 5 — The ask' },
      { type: 'p', text: 'Frame your first 90 days as a question, not a statement. "If I joined, I would want to spend the first 30 days shadowing the senior engineers and understanding the on-call rotation — does that match what you would expect?" This invites the interviewer to correct or affirm your understanding, which gives you their actual mental model of the role.' },
      { type: 'p', text: 'It also signals senior thinking. Junior candidates state what they will do. Senior candidates ask whether their plan matches reality.' },

      { type: 'h2', text: 'How to compress 5 minutes into 90 seconds' },
      { type: 'p', text: 'Most interviews do not have time for the full 5-minute version. Build the long version first, then strip it down:' },
      { type: 'ul', items: [
        'Block 1: one sentence on origin.',
        'Block 2: one sentence on expertise + one proof point.',
        'Block 3: one sentence on why now.',
        'Block 4: one sentence on why them with a specific reference.',
        'Block 5: one sentence ask.',
      ] },
      { type: 'p', text: 'The 90-second version contains the same five beats. Practising the 5-minute version is what makes the 90-second version sound natural rather than rushed.' },

      { type: 'h2', text: 'How to actually rehearse it' },
      { type: 'ol', items: [
        'Write the long version out, full sentences. About 600 words.',
        'Read it out loud, time yourself. Adjust until it lands at 4:45-5:15.',
        'Compress to bullets only. Five bullets, one per block.',
        'Deliver from bullets, three times in a row, recording yourself.',
        'Watch it back. Cut filler words. Re-record once.',
      ] },
      { type: 'p', text: 'You will be surprised how much faster it gets after the second recording. Most candidates skip rehearsal because it feels self-indulgent. The candidates who get offers do not skip it.' },

      { type: 'callout', text: 'Vantage generates a 5-minute presentation outline as part of every analysis on the Premium plan. Origin, expertise, why-now, why-them, and the ask — all five blocks, structured around your CV and the specific role. Edit, rehearse, walk in confident.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'What if the interview is only 30 minutes?' },
      { type: 'p', text: 'Default to the 90-second version. If the interviewer interrupts and asks "tell me more about that," you have the longer version loaded and can expand any block on demand. That is the magic of building the long version first.' },
      { type: 'h3', text: 'Should I send the pitch in advance?' },
      { type: 'p', text: 'No, unless they specifically asked. Surprise structure beats announced structure. You also do not want them to be re-reading it back to you.' },
      { type: 'h3', text: 'What if my CV is unimpressive?' },
      { type: 'p', text: 'The pitch is a leveller. Specific stories beat generic credentials. A candidate from a no-name company with one sharp 60-second proof point beats a Stanford grad who cannot pick a single moment to talk about.' },

      { type: 'p', text: 'Build the long version. Deliver the short version. Walk in remembered.' },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

// Re-export ReactNode only so callers can import types cleanly.
export type { ReactNode };
