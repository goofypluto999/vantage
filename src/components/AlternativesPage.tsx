import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, Check, X, Star, ExternalLink, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /alternatives and /alternatives/:competitor — programmatic SEO pages.
 *
 * Each page targets the exact query "[competitor] alternative" or
 * "alternative to [competitor]" — the searcher has already decided the
 * incumbent isn't right for them and is shopping comparable tools. This
 * is the highest-intent moment in the funnel.
 *
 * Pages are intentionally honest: we acknowledge what the competitor
 * does well, then make the specific case where Vantage is a better
 * choice. Honesty earns trust at a comparison page; pretending the
 * incumbent is bad insults the reader's intelligence.
 *
 * Each page ships breadcrumb + FAQPage schema for AI citation.
 */

type CompetitorSlug =
  | 'jobscan'
  | 'teal'
  | 'final-round-ai'
  | 'resume-worded'
  | 'kickresume'
  | 'enhancv'
  | 'yoodli'
  | 'huntr'
  | 'big-interview';

interface CompetitorProfile {
  slug: CompetitorSlug;
  name: string;
  oneLiner: string;
  founded?: string;
  pricing: string;
  whatItDoes: string;
  whereItShines: string;
  whereItFalls: string;
  vantageEdge: string[];
  whyChoose: string;
  faq: { q: string; a: string }[];
}

const PROFILES: Record<CompetitorSlug, CompetitorProfile> = {
  jobscan: {
    slug: 'jobscan',
    name: 'Jobscan',
    oneLiner: 'CV-vs-job-description keyword matcher with an ATS-readiness score.',
    founded: '2013',
    pricing: '$49.95/month after a limited free tier (5 scans then paywalled).',
    whatItDoes:
      'You paste your CV and a job description. Jobscan calculates a percentage match based on keyword overlap, missing skills, and CV format. The output is essentially a keyword diff with recommendations.',
    whereItShines:
      'Jobscan was the first to popularise the ATS keyword-match score and it remains the most recognisable name in that category. Recruiters know what a Jobscan score is, which makes the language easy to share.',
    whereItFalls:
      'The score is invented — there is no industry-standard ATS percentage. The $49.95/month price for what is structurally a keyword diff feels steep, especially when you only need it during an active job hunt.',
    vantageEdge: [
      'Vantage gives you the same CV-vs-role fit score plus a tailored cover letter, mock interview questions, company intel, and a 5-minute pitch outline — one flow, ~90 seconds.',
      'Pay £5 once for 20 tokens that never expire instead of $49.95/month. Stop paying when you stop hunting.',
      'CV Mirror (our free companion tool) gives you a multi-vendor ATS parse view that no Jobscan tier offers — see exactly how Workday, Greenhouse, Lever, Taleo, and iCIMS each render your CV.',
      'No CV upload required for the ATS scan — CV Mirror runs entirely client-side.',
    ],
    whyChoose:
      'If you only need a keyword score, Jobscan is fine but expensive. If you want the full prep pack — fit score plus cover letter plus interview prep plus company intel — for one quarter the price, switch to Vantage.',
    faq: [
      {
        q: 'Is Vantage a free Jobscan alternative?',
        a: 'Vantage has a free trial (3 analyses, no card required) and a £5 one-time pack of 20 tokens. That is a free starting point and a much cheaper paid tier than Jobscan\'s $49.95/month, but Vantage is not free forever — running an analysis costs tokens because we pay Gemini compute fees per run.',
      },
      {
        q: 'Does Vantage check ATS compatibility like Jobscan?',
        a: 'Yes — through our free companion tool CV Mirror at cv-mirror-web.vercel.app. CV Mirror simulates how 5 real ATS systems parse your CV (Workday, Greenhouse, Lever, Taleo, iCIMS) and shows them side by side. No score is invented; you see the actual parsed text.',
      },
      {
        q: 'Why would I pay for Vantage if Jobscan is the more established tool?',
        a: 'Established does not mean best fit for your situation. Jobscan optimises for one number (the keyword match). Vantage optimises for the whole application — what to write, what to say, what they care about. Different problem, different tool.',
      },
    ],
  },
  teal: {
    slug: 'teal',
    name: 'Teal',
    oneLiner: 'Job tracker, CV builder, and Chrome extension for organising an active search.',
    founded: '2018',
    pricing: 'Free tier with caps. Teal+ is $9 weekly or $29 monthly.',
    whatItDoes:
      'Teal is primarily a workflow tool. You save jobs from a Chrome extension, organise them in a Kanban-style tracker, build CV variants for each, and run AI matches between your CV and each saved JD.',
    whereItShines:
      'For a long-running search, Teal is the best tool here for organisation. The application tracker, CV variants, and saved-job extension are real productivity wins if you live in the search for months.',
    whereItFalls:
      'Teal does not generate a tailored cover letter beyond a basic AI draft, does not run mock interviews, and does not produce a pitch outline. The tracker overhead is wasted on someone who already has a job and applies to one specific role they care about.',
    vantageEdge: [
      'Vantage is built for the moment-of-application — paste a job link, get the full prep pack (cover letter, mock interview, fit score, pitch). No Kanban setup needed.',
      'Cover letter has a 4-tone switcher (Direct, Formal, Warm, Creative) — each rewrite preserves the same evidence but matches the company\'s voice.',
      'Mock interview questions are generated from the actual job, then graded live with feedback. Teal does not have an interview module.',
      'Pay-per-use £5 starter never expires, so you can use Vantage on one important application without committing to a subscription.',
    ],
    whyChoose:
      'Use Teal if you have 50 saved jobs and need somewhere to track them. Use Vantage if you have one specific role you really want and need to nail the application end-to-end. The two tools work well together — Teal for organisation, Vantage for execution.',
    faq: [
      {
        q: 'Should I use Teal or Vantage?',
        a: 'They solve different problems. Teal is a job tracker — best when you are actively applying to dozens of roles and need to organise the search. Vantage is an application prep tool — best when you have a specific role and need a tailored cover letter, mock interview, and fit analysis in one go. Many users keep Teal for tracking and use Vantage when they actually apply.',
      },
      {
        q: 'Is Vantage cheaper than Teal+?',
        a: 'Teal+ is $29/month or $9/week. Vantage is £5 one-time for 20 tokens (~6 full analyses) that never expire, or £12/month for Pro. Cheaper start, no commitment. Heavy applicants on a Pro subscription land roughly even.',
      },
      {
        q: 'Does Vantage have a Chrome extension like Teal?',
        a: 'Not yet — we ship a bookmarklet you can drag to your bookmark bar instead. Click it on any job page to send the URL to Vantage and start a prep pack instantly. No install required.',
      },
    ],
  },
  'final-round-ai': {
    slug: 'final-round-ai',
    name: 'Final Round AI',
    oneLiner: 'Real-time interview copilot that listens to live calls and feeds you AI-generated answer suggestions.',
    founded: '2023',
    pricing: '$148/month (Pay) or $58/month (Pro), with a free tier limited to 6 minutes of live coaching.',
    whatItDoes:
      'Final Round AI runs in your browser during a live interview. It transcribes the interviewer in real time and surfaces suggested answers as overlays. The pitch is "interview copilot" — get help while the interview is happening.',
    whereItShines:
      'For technical interviews where the question is well-defined and you blank, the live transcript is genuinely useful. The browser-overlay UX is impressive engineering.',
    whereItFalls:
      'Live AI coaching during an interview is ethically grey. Many companies prohibit it explicitly. The price is steep ($148/month at the top tier) for what is fundamentally a high-risk during-the-call tool. It does nothing for the 95% of work that happens before the interview — the application, the cover letter, the role-fit analysis, the prep questions.',
    vantageEdge: [
      'Vantage prepares you to walk in confident, instead of cheating with a transcript window during the call. Mock interview questions generated from the actual JD, with live AI grading.',
      'Full prep pack (CV fit, cover letter, company intel, pitch outline) covers everything before the interview, not the interview itself.',
      'Lowest barrier to entry £5 vs Final Round\'s $58/month minimum.',
      'Ethical: nothing about Vantage is hidden from the interviewer. You arrive prepared the legitimate way.',
    ],
    whyChoose:
      'If you need to game a single live interview, Final Round AI is the tool — but be aware many companies treat it as cheating and may rescind offers. If you want to actually be the right candidate for the role and walk in genuinely prepared, use Vantage.',
    faq: [
      {
        q: 'Is using Final Round AI considered cheating?',
        a: 'Most companies treat undisclosed AI assistance during interviews as a serious ethical violation, comparable to taking exam answers from a hidden helper. Several major employers have rescinded offers when they detected it. We do not recommend it. Vantage focuses on preparation before the call, which is uncontroversial.',
      },
      {
        q: 'Does Vantage work during live interviews like Final Round AI?',
        a: 'No, and that is intentional. We run AI-graded mock interviews so you walk in prepared, not so you cheat in real time. That is the difference between training and doping.',
      },
      {
        q: 'What is the Vantage AI mock interview like?',
        a: 'Generated from the real job description: 8-12 likely questions across behavioural, technical, and role-specific. You answer either by typing or by speaking (browser speech-to-text). Each answer gets graded with feedback on structure, evidence, and gaps. Free during your trial; included in Pro and Premium.',
      },
    ],
  },
  'resume-worded': {
    slug: 'resume-worded',
    name: 'Resume Worded',
    oneLiner: 'CV scoring tool with paid feedback on how to improve specific sections.',
    founded: '2018',
    pricing: 'Free CV score; Premium $49/month or $228/year for unlimited scans and feedback.',
    whatItDoes:
      'You upload your CV, get an overall score (out of 100), and Resume Worded points out missing keywords, weak bullets, and structural issues. The premium tier unlocks unlimited rescans and LinkedIn profile review.',
    whereItShines:
      'The CV scoring rubric is well-designed and the bullet-by-bullet feedback is usually actionable. For someone who wants their CV objectively critiqued, Resume Worded is solid.',
    whereItFalls:
      'It only addresses the CV. There is no cover letter generation, no mock interview, no role-fit analysis against a specific job, no company intelligence. You finish a Resume Worded session with a better CV but no closer to having applied to a role.',
    vantageEdge: [
      'Vantage runs a CV-vs-role fit score (not a generic CV score) — the comparison is against the specific job you want, not against an average benchmark.',
      'Tailored cover letter generated for the role, with 4 tone variants. Resume Worded does not write cover letters.',
      'Mock interview questions and live AI-graded practice. Resume Worded does not cover interviews.',
      '£5 starter pack vs $49/month subscription. Use Vantage for one job, stop paying.',
    ],
    whyChoose:
      'Use Resume Worded if you want to overhaul your CV in isolation. Use Vantage when you have a specific job in mind and need every part of the application prepared — including the CV-fit pass — in one flow.',
    faq: [
      {
        q: 'Does Vantage replace Resume Worded?',
        a: 'For most users yes. Resume Worded scores your CV in isolation; Vantage scores it against the specific role you are applying to, which is a more useful number when you are about to hit Apply. If you also want general CV polish before any specific application, Resume Worded\'s rubric is good — but it is solving a different problem.',
      },
      {
        q: 'How does Vantage\'s fit score differ from Resume Worded\'s CV score?',
        a: 'Resume Worded: "your CV is a 78/100 against an industry benchmark." Vantage: "your CV is a 78/100 fit for this Stripe Staff PM role at Stripe — here are your 6 match points and 4 closing moves." We tie the score to a specific JD, so the actions are concrete.',
      },
      {
        q: 'Is Vantage better than Resume Worded for cover letters?',
        a: 'Vantage writes the cover letter; Resume Worded does not have a cover letter generator at all. So yes — different category of tool.',
      },
    ],
  },
  kickresume: {
    slug: 'kickresume',
    name: 'Kickresume',
    oneLiner: 'Resume + cover letter builder with templates and an AI writer that works from job title and company name.',
    founded: '2014',
    pricing: 'Free tier with watermarked exports. Premium starts at $8/month annual or $19/month rolling.',
    whatItDoes:
      'You pick a CV or cover letter template, fill in your details, and the AI writer produces tailored copy from a job title, company name, and short description. Output is polished and visually consistent across resume + cover letter + portfolio.',
    whereItShines:
      'Visual polish. The templates are genuinely well-designed — Kickresume is one of the few resume builders where the export does not look like a Word doc from 2009. Useful when you need a presentable CV in 20 minutes from nothing.',
    whereItFalls:
      'The AI cover letter is template-shaped. It reads like a generated cover letter — not because the model is weak, but because Kickresume optimises for "fits the template", not "sounds like the candidate". You will spend 10 minutes editing the voice afterwards. No mock interview, no fit score, no company intel.',
    vantageEdge: [
      'Vantage cover letter has 4 tone variants (Direct, Formal, Warm, Creative) — pick the one that matches the company\'s voice instead of editing template-shaped output.',
      'Output is grounded in the actual job description and your CV evidence, not just a job title and company name. Less generic, less to rewrite.',
      'Includes mock interview, fit score, company intel, and pitch outline — Kickresume only writes documents.',
      '£5 one-time pack vs $8–19/month subscription. Stop paying when you stop applying.',
    ],
    whyChoose:
      'If you need a visually polished CV + cover letter pair from scratch and you have time to edit the voice, Kickresume is solid. If you already have a CV and want a tailored, role-specific application package — cover letter, mock interview, fit analysis — in one go, use Vantage.',
    faq: [
      {
        q: 'Is Vantage cheaper than Kickresume?',
        a: 'On a per-application basis, yes. Vantage is £5 for 20 full prep packs (CV fit + cover letter + mock interview + pitch). Kickresume is $8/month minimum on the annual plan, $19/month rolling. If you apply to a few roles per quarter, Vantage is significantly cheaper. Heavy users on Pro ($12/month for 60 prep packs/month) land far ahead.',
      },
      {
        q: 'Does Vantage produce designed CV templates like Kickresume?',
        a: 'No — Vantage is not a CV builder. We assume you already have a CV in DOCX or PDF and we work with the content, not the layout. If you need a designed CV from scratch, Kickresume or Canva are the right tools. After that, bring the CV to Vantage for the role-specific tailoring.',
      },
      {
        q: 'Can I use Kickresume and Vantage together?',
        a: 'Yes — the workflow we recommend: build the CV in Kickresume, run the parsed PDF through CV Mirror to confirm the ATS reads it cleanly, then upload to Vantage to generate the cover letter, fit score, and interview pack for each specific role.',
      },
    ],
  },
  enhancv: {
    slug: 'enhancv',
    name: 'Enhancv',
    oneLiner: 'CV builder + AI cover letter generator that produces a tailored first draft from a JD paste.',
    founded: '2014',
    pricing: 'Free tier with limited features. Pro is $24.99/month or $9.99/month annual.',
    whatItDoes:
      'You upload a CV, paste a job ad, and Enhancv produces a tailored cover letter draft in seconds. The CV builder side has templates and a content checker that flags weak bullets.',
    whereItShines:
      'Genuinely fast first drafts. If you need a starting point at 11pm before a morning deadline, Enhancv gets you to a usable draft quickly. The content checker is useful for spotting passive language and missing metrics.',
    whereItFalls:
      'The first draft reads like a first draft — Enhancv\'s cover letters tend toward the same enthusiastic-applicant register regardless of role or industry. You will rewrite the opening and one or two proof points. No interview prep, no fit score, no company intel.',
    vantageEdge: [
      '4-tone switcher means you can flip between Formal, Warm, Direct, and Creative without re-running the analysis. Same evidence, different register — closer to how a senior writer actually edits.',
      'Cover letter is grounded in retrieved company intel (mission, recent moves, culture signals) — not just the JD text.',
      'You also get fit score, mock interview questions, and a 5-minute pitch outline in the same flow. Enhancv only writes documents.',
      'Pay-per-use £5 starter never expires. Enhancv\'s monthly subscription burns whether you applied or not.',
    ],
    whyChoose:
      'Use Enhancv if you need a polished CV builder and an emergency cover letter draft. Use Vantage when you have a specific role and want a full prep package with multiple voice options, plus the interview practice that Enhancv does not cover.',
    faq: [
      {
        q: 'How is Vantage\'s cover letter different from Enhancv\'s?',
        a: 'Enhancv generates one draft and you edit it. Vantage generates the same evidence in 4 tones (Formal, Warm, Direct, Creative) so you pick the register that matches the company instead of rewriting voice from scratch. Both pull from your CV; Vantage also pulls from retrieved company intel.',
      },
      {
        q: 'Is Vantage a CV builder like Enhancv?',
        a: 'No. Vantage works on a CV you already have. If you need to build a CV from scratch, Enhancv or Kickresume are good. Once your CV is built, bring it to Vantage for role-specific tailoring.',
      },
      {
        q: 'Can I cancel Enhancv and still get cover letters from Vantage?',
        a: 'Yes — the £5 Vantage starter pack gives you 20 full prep packs that never expire, no subscription. If your hunt is intermittent, this is a meaningfully cheaper way to get cover letters than $9.99–24.99/month.',
      },
    ],
  },
  yoodli: {
    slug: 'yoodli',
    name: 'Yoodli',
    oneLiner: 'AI speech coach that records you answering interview questions and grades pace, filler words, and clarity.',
    founded: '2020',
    pricing: 'Free tier with limited sessions. Pro is $20/month, Premium $40/month.',
    whatItDoes:
      'You speak into your laptop mic, Yoodli transcribes, and the AI scores delivery — pace, filler words ("um", "like"), pauses, repetitiveness, and a "concise" rating. Useful for noticing speech habits you cannot hear yourself.',
    whereItShines:
      'Delivery feedback. If your problem is "I say um every other sentence" or "I trail off at the end of answers", Yoodli will surface it. The repetitiveness flag in particular is genuinely hard to spot without a transcript.',
    whereItFalls:
      'Yoodli grades how you say things, not whether your answer was right. It will rate a confidently-delivered wrong answer above a hesitant correct one. No CV-fit context, no role-specific question generation grounded in a real JD, no scoring of answer structure or evidence quality.',
    vantageEdge: [
      'Mock interview questions are generated from the actual job description — not generic behavioural prompts. Each question is likely to come up in your real interview.',
      'Answers are graded on substance — structure (STAR / SCQA), evidence quality, gaps, and role-fit — not just delivery. You learn whether your answer was actually good, not just smoothly delivered.',
      'Live AI feedback after every question, with concrete next-step suggestions ("add a metric here", "name the stakeholders").',
      '£5 one-time vs Yoodli\'s $20–40/month. Affordable to use on a single interview.',
    ],
    whyChoose:
      'Use Yoodli when you know your delivery is the problem — pace, fillers, confidence — and you want a speech coach. Use Vantage when you want to be sure your answer is right for this specific role, with structure and evidence grading. Many users do both: Yoodli for delivery, Vantage for content.',
    faq: [
      {
        q: 'Does Vantage give speech feedback like Yoodli?',
        a: 'No, Vantage does not grade delivery (pace, filler words). It grades the substance of the answer — structure, evidence, gaps, role-fit. If delivery is your weakness, Yoodli is the better tool. If you want to know whether your answer is the right answer, use Vantage.',
      },
      {
        q: 'Is Vantage\'s mock interview live like Yoodli\'s?',
        a: 'Yes — questions are presented one at a time, you answer either by typing or by speaking (Web Speech API), and grading happens immediately. The difference is the question source: Vantage generates questions from the actual JD; Yoodli uses a generic question library.',
      },
      {
        q: 'Can I use both Yoodli and Vantage?',
        a: 'Yes, and many users do. Run Vantage first to learn the right answers for the role, then run those same answers through Yoodli to fix delivery. Belt-and-braces approach for a high-stakes interview.',
      },
    ],
  },
  huntr: {
    slug: 'huntr',
    name: 'Huntr',
    oneLiner: 'Job tracker with a Chrome extension, Kanban board, and AI tools for resume tailoring.',
    founded: '2017',
    pricing: 'Free tier with caps. Pro is $20/month or $48/quarter, Teams from $30/seat/month.',
    whatItDoes:
      'You save jobs from a Chrome extension, organise them on a Kanban (Wishlist → Applied → Interview → Offer), tailor your CV per-role with the AI tools, and track follow-up dates. Built for someone running an active multi-role search.',
    whereItShines:
      'Job tracking and pipeline visibility. If you are actively applying to 30+ roles and need to see at a glance who you spoke with last week and what your follow-up cadence looks like, Huntr is the strongest tool in the category alongside Teal.',
    whereItFalls:
      'Huntr is a tracker first, application-prep tool second. The CV-tailoring AI is solid but transactional — there is no mock interview, no full company intel pull, no pitch outline, no tone-switched cover letter. The tracker overhead is wasted on someone applying to one specific role.',
    vantageEdge: [
      'Vantage is built for the moment-of-application — paste one job link, get the full prep pack in ~90 seconds. No Kanban setup, no extension install, no per-role CV variant management.',
      '4-tone cover letter switcher. Mock interview generated from the actual JD, graded live. 5-minute pitch outline. Huntr does not cover any of these.',
      'CV Mirror (free, no signup) shows multi-vendor ATS parse for the CV before you tailor it — nothing in Huntr is equivalent.',
      '£5 one-time starter never expires. Huntr Pro is $20/month, billed monthly.',
    ],
    whyChoose:
      'Use Huntr if your bottleneck is organising the search — many open applications, follow-ups slipping, no clear pipeline. Use Vantage when your bottleneck is the application itself — making each one count. The tools are complementary: Huntr for tracking, Vantage for execution.',
    faq: [
      {
        q: 'Should I use Huntr or Vantage?',
        a: 'They are not direct substitutes. Huntr is a tracker — best for high-volume searches. Vantage is an application prep tool — best when you have one specific role to nail. Many users keep Huntr open for tracking and switch to Vantage when they actually sit down to write the application.',
      },
      {
        q: 'Does Vantage tailor my CV like Huntr?',
        a: 'Vantage does not modify your CV file. It generates a fit score (CV vs role), highlights match points and gaps, and uses your CV evidence to write the cover letter. If you want a per-role CV file variant saved alongside the application, Huntr or Teal is the better tool. If you want a fast role-specific score and tailored cover letter, Vantage.',
      },
      {
        q: 'Is Vantage cheaper than Huntr Pro?',
        a: 'Substantially. Huntr Pro is $20/month rolling. Vantage is £5 one-time for 20 prep packs that never expire, or £12/month for Vantage Pro (60 prep packs/month). If you apply heavily, Pro is dramatically cheaper; if you apply intermittently, the £5 pack is unbeatable.',
      },
    ],
  },
  'big-interview': {
    slug: 'big-interview',
    name: 'Big Interview',
    oneLiner: 'Long-running interview training platform with curriculum, recorded mocks, and answer-builder frameworks.',
    founded: '2010',
    pricing: '$39/month, $99/quarter, or $299/year. Single-purchase $79 lifetime tier available.',
    whatItDoes:
      'Big Interview offers a structured curriculum — modules on behavioural questions, STAR storytelling, salary negotiation — alongside a video answer recorder. You answer prompts on camera, watch yourself back, and use a built-in framework to refine answer structure.',
    whereItShines:
      'Curriculum depth. If you are new to interviewing or coming back after years out, Big Interview is the most comprehensive training platform in the category. The frameworks (especially STAR and the "answer builder") are solid pedagogy.',
    whereItFalls:
      'It is a training platform, not an application tool. Big Interview teaches you to interview in general. It does not generate questions from a specific job description, does not write your cover letter, does not analyse your CV against a role. Useful for pre-search prep, less useful when you actually have a Tuesday interview.',
    vantageEdge: [
      'Mock questions generated from the actual JD — not generic behavioural prompts. The questions you practise are the questions likely to come up.',
      'Live AI grading on substance (structure, evidence, gaps, role-fit), not just self-review.',
      'Full prep pack covers the application before the interview — cover letter, fit score, company intel, pitch — Big Interview only covers the interview itself.',
      '£5 starter pack vs $39/month minimum. Affordable to use on one specific interview rather than committing to a curriculum.',
    ],
    whyChoose:
      'Use Big Interview if you want a structured curriculum to lift your overall interviewing baseline over a few weeks. Use Vantage when you have a specific role next Tuesday and need targeted prep — questions from this JD, graded answers, plus everything else on the application side.',
    faq: [
      {
        q: 'Is Vantage a substitute for Big Interview\'s curriculum?',
        a: 'Not really — they solve different problems. Big Interview is a learning platform; Vantage is an application tool. If your goal is "become a better interviewer over 6 weeks", Big Interview\'s curriculum is the right shape. If your goal is "ace the interview I have next Tuesday", Vantage is more useful.',
      },
      {
        q: 'Does Vantage have video / recorded answers like Big Interview?',
        a: 'No, Vantage does not record video. Mock interviews are typed or spoken (browser speech-to-text) with live AI grading on the answer text. If you need to see yourself on camera, Big Interview or Yoodli is the better tool.',
      },
      {
        q: 'Can I use Big Interview and Vantage together?',
        a: 'Yes — Big Interview to build the underlying interviewing skill set, Vantage to apply those skills to specific roles. Many users do exactly this: curriculum once, then targeted prep per interview.',
      },
    ],
  },
};

const SLUG_LIST: CompetitorSlug[] = [
  'jobscan',
  'teal',
  'final-round-ai',
  'resume-worded',
  'kickresume',
  'enhancv',
  'yoodli',
  'huntr',
  'big-interview',
];

// ----- Hub page -----
export function AlternativesHub() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Alternatives', item: `${SITE_URL}/alternatives` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Job application AI tool alternatives',
    itemListElement: SLUG_LIST.map((slug, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/alternatives/${slug}`,
      name: `${PROFILES[slug].name} alternative — Vantage`,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Alternatives to Jobscan, Teal, Kickresume, Enhancv, Yoodli & more"
        description="Honest, side-by-side comparisons of Vantage with the most-searched job application AI tools — Jobscan, Teal, Kickresume, Enhancv, Yoodli, Huntr, Big Interview, Final Round AI, Resume Worded. Pick the right tool for your stage of the hunt."
        path="/alternatives"
        jsonLd={[breadcrumbSchema, itemListSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            Try Vantage free
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-12">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            Honest comparisons
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            Looking for an alternative?
          </h1>
          <p className={`mt-5 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            We make Vantage. We're not pretending the alternatives are bad —
            they all do something useful. Pick the one that fits your stage.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {SLUG_LIST.map((slug) => {
            const p = PROFILES[slug];
            return (
              <Link
                key={slug}
                to={`/alternatives/${slug}`}
                className={`${t.glass} rounded-2xl p-6 hover:border-violet-400/40 transition group block`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`text-xs uppercase tracking-widest ${t.textMuted} mb-1`}>
                      Alternative to
                    </div>
                    <h3 className={`text-xl font-bold ${t.text} group-hover:text-violet-500 transition`}>
                      {p.name}
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition" />
                </div>
                <p className={`mt-3 text-sm ${t.textSub} leading-relaxed`}>
                  {p.oneLiner}
                </p>
                <div className={`mt-4 flex items-center gap-3 text-xs ${t.textMuted}`}>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-semibold">
                    {p.pricing.split(/[.\s]/)[0]}
                  </span>
                  {p.founded && <span>Founded {p.founded}</span>}
                </div>
              </Link>
            );
          })}
        </div>

        <section className="mt-16">
          <h2 className={`text-2xl font-bold ${t.text} mb-4`}>How to pick</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <article className={`${t.cardInner} rounded-xl p-5`}>
              <h3 className={`text-base font-bold ${t.text}`}>If you want CV scoring</h3>
              <p className={`mt-2 text-sm ${t.textSub}`}>
                Resume Worded for general CV polish; Jobscan for keyword match
                against a specific JD. Vantage covers both as part of its fit
                score, plus cover letter and interview prep in the same flow.
              </p>
            </article>
            <article className={`${t.cardInner} rounded-xl p-5`}>
              <h3 className={`text-base font-bold ${t.text}`}>If you want job tracking</h3>
              <p className={`mt-2 text-sm ${t.textSub}`}>
                Teal is purpose-built for that. Use it alongside Vantage —
                Teal organises the search, Vantage prepares each application.
              </p>
            </article>
            <article className={`${t.cardInner} rounded-xl p-5`}>
              <h3 className={`text-base font-bold ${t.text}`}>If you want interview help</h3>
              <p className={`mt-2 text-sm ${t.textSub}`}>
                Vantage runs AI-graded mocks before the call. Final Round AI
                offers live in-call coaching — but be aware many employers
                consider it cheating.
              </p>
            </article>
          </div>
        </section>

        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Try the full prep pack</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            One upload. One paste. Cover letter, fit score, mock interview, pitch outline — 90 seconds. £5 starter, no subscription.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try Vantage free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

// ----- Per-competitor detail page -----
export default function AlternativesPage() {
  const { t } = useTheme();
  const { competitor } = useParams<{ competitor: string }>();

  if (!competitor || !(competitor in PROFILES)) {
    return <Navigate to="/alternatives" replace />;
  }

  const p = PROFILES[competitor as CompetitorSlug];
  const path = `/alternatives/${p.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Alternatives', item: `${SITE_URL}/alternatives` },
      { '@type': 'ListItem', position: 3, name: `${p.name} alternative`, item: `${SITE_URL}${path}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={`${p.name} alternative — Vantage`}
        description={`Honest comparison of Vantage and ${p.name}. ${p.oneLiner} See where each tool wins and which is the better fit for your job hunt.`}
        path={path}
        jsonLd={[breadcrumbSchema, faqSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            Try Vantage free
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <Link
          to="/alternatives"
          className={`inline-flex items-center gap-2 text-sm ${t.textMuted} hover:${t.text} mb-6`}
        >
          <ArrowLeft className="w-4 h-4" /> All alternatives
        </Link>

        <header className="mb-10">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            Vantage as an alternative to
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            {p.name} alternative
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>{p.oneLiner}</p>
          <div className={`mt-4 flex flex-wrap items-center gap-3 text-sm ${t.textMuted}`}>
            {p.founded && (
              <span className={`px-3 py-1 rounded-full ${t.cardInner}`}>Founded {p.founded}</span>
            )}
            <span className={`px-3 py-1 rounded-full ${t.cardInner}`}>{p.pricing}</span>
          </div>
        </header>

        <section className="mb-10 grid md:grid-cols-2 gap-6">
          <article className={`${t.glass} rounded-2xl p-6`}>
            <h2 className={`text-lg font-bold ${t.text} mb-2`}>What {p.name} does</h2>
            <p className={`text-sm ${t.textSub} leading-relaxed`}>{p.whatItDoes}</p>
          </article>
          <article className={`${t.glass} rounded-2xl p-6`}>
            <h2 className={`text-lg font-bold ${t.text} mb-2`}>Where {p.name} shines</h2>
            <p className={`text-sm ${t.textSub} leading-relaxed`}>{p.whereItShines}</p>
          </article>
          <article className={`${t.glass} rounded-2xl p-6 md:col-span-2 border-l-4 border-amber-400/60`}>
            <h2 className={`text-lg font-bold ${t.text} mb-2`}>Where {p.name} falls short</h2>
            <p className={`text-sm ${t.textSub} leading-relaxed`}>{p.whereItFalls}</p>
          </article>
        </section>

        <section className={`mb-10 ${t.glass} rounded-2xl p-6 sm:p-8 border-2 border-violet-500/30`}>
          <h2 className={`text-2xl font-bold ${t.text} mb-4`}>Why pick Vantage instead</h2>
          <ul className="space-y-3">
            {p.vantageEdge.map((edge, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className={`text-sm ${t.textSub} leading-relaxed`}>{edge}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`mb-10 ${t.cardInner} rounded-2xl p-6 sm:p-8`}>
          <h2 className={`text-lg font-bold ${t.text} mb-2`}>The honest take</h2>
          <p className={`text-sm ${t.textSub} leading-relaxed`}>{p.whyChoose}</p>
        </section>

        <section className="mb-10">
          <h2 className={`text-2xl font-bold ${t.text} mb-4`}>Common questions</h2>
          <div className="space-y-3">
            {p.faq.map((f, i) => (
              <details key={i} className={`${t.cardInner} rounded-xl p-5 group`}>
                <summary className={`flex items-center justify-between cursor-pointer font-semibold ${t.text}`}>
                  <span>{f.q}</span>
                  <span className="text-violet-400 group-open:rotate-45 transition">+</span>
                </summary>
                <p className={`mt-3 text-sm ${t.textSub} leading-relaxed`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className={`${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Run a real prep pack on a real job</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            Three free analyses on signup. No card. £5 one-time pack if you want more — never expires.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try Vantage free <ArrowRight className="w-4 h-4" />
          </Link>
          <p className={`mt-3 text-xs ${t.textMuted}`}>
            <Link to="/compare" className="underline hover:text-violet-400">
              Side-by-side comparison
            </Link>
            {' · '}
            <a
              href="https://cv-mirror-web.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-violet-400 inline-flex items-center gap-1"
            >
              Free ATS scanner <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
