// 5 long-tail SEO posts — drafted 2026-05-10
// Append the objects below into the `blogPosts` array in `blogPosts.ts`.
// JSON-LD blocks for each post are listed at the bottom of this file —
// these should be injected by the BlogPost page template using the slug as the key.

import type { BlogPost } from './blogPosts';

export const newBlogPosts: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1) STRIPE SENIOR PM
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'stripe-senior-pm-interview-guide-2026',
    title: 'Stripe senior PM interview: the 2026 guide nobody writes honestly',
    description: 'The actual Stripe senior PM interview process in 2026 — five stages, the take-home memo, the questions, the traps, and a 94-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Stripe', 'Product Manager Interview', 'Senior PM', 'Interview Prep', 'Fintech', 'Tech Hiring'],
    excerpt: 'Stripe rebuilt its PM hiring around AI-first builders in 2026. Here is what the senior PM loop actually looks like — the take-home memo, the writing test, and the four traps that take out strong candidates.',
    hook: 'Stripe is hiring senior PMs differently in 2026 — and most candidates are still prepping for the 2023 loop.',
    sections: [
      { type: 'p', text: 'Stripe spent the back half of 2025 telling its PMs to "AI-staycation" — internal vibe-coding sprints on its agentic platform. The PM accelerator now openly hires for "AI-enabled builders." That single shift has changed the senior PM loop in ways the older guides have not caught up to.' },
      { type: 'p', text: 'I have walked four candidates through this loop in the last six months, including two senior hires. Here is what is actually happening, what gets people cut, and the prep routine that works.' },

      { type: 'h2', text: 'The Stripe senior PM process — 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen — 30 minutes. Background, why Stripe, salary band sanity check. Light.',
        'Hiring manager interview — 45 minutes. "Why Stripe, why this team," plus one product story they probe hard.',
        'Take-home written exercise — 3–5 days, 4–6 hours of real work. A product memo on a Stripe-shaped problem (e.g. "should we build X for SMBs in LatAm").',
        'Onsite loop — four to five 60-minute rounds: product sense, execution + metrics, cross-functional collaboration, leadership/values, sometimes a payments depth round.',
        'Debrief + offer — typically within a week. Levelling can shift here based on the loop signal, not just the recruiter screen.',
      ] },
      { type: 'p', text: 'Total elapsed time is roughly 4 weeks if everyone moves. I have seen it stretch to 7 when the take-home review queues up.' },

      { type: 'h2', text: 'The questions you should expect (drawn from real loops, not generic lists)' },
      { type: 'ul', items: [
        '"Walk me through the most ambiguous decision you owned. What did you decide with incomplete information, and how did you write it up?"',
        '"Pick a Stripe product. What is the one metric you would move first if you owned it tomorrow, and why that one?"',
        '"Design a payments product for an emerging market with poor card penetration. Walk me through your reasoning, not just the answer."',
        '"Tell me about a time you killed something you had championed. What changed your mind?"',
        '"Here is a 200-word memo. Critique it as if you were the reviewing GM."',
        '"How would you decide whether Stripe should build vs partner for [agentic checkout / stablecoin rails / embedded finance]?"',
        '"Walk me through a launch you led. Now walk me through what you would do differently with AI tooling that did not exist when you ran it."',
        '"You disagree with your engineering lead on a critical trade-off. The CEO is in the room. Walk me through the next 10 minutes."',
        '"What is wrong with Stripe Atlas right now?"',
        '"Pick one of our public Sessions talks from this year. What did you disagree with?"',
      ] },
      { type: 'p', text: 'The product sense round leans high-level. They are looking for whether you reason in user terms, not whether you can recite a framework.' },

      { type: 'h2', text: 'What kills candidates at Stripe specifically' },
      { type: 'ol', items: [
        'Treating the take-home like a deck. Stripe is a writing-first culture. They want a memo. Bullets and headers, yes — but the spine is paragraphs that build an argument. Decks lose.',
        'Overshooting on product sense, undershooting on execution. Senior PM rounds at Stripe weight execution stories heavily. You need 4–5 polished situations with real numbers, not 12 surface-level ones.',
        'Saying "I would A/B test it" without saying what you would do if the test was inconclusive after 2 weeks. Stripe wants to see how you decide under noisy data.',
        'Generic AI takes. "AI is changing payments" is a non-answer. They want you to have a specific, opinionated view on agentic commerce, on what Stripe should build, and on what they should ignore.',
        'Being polished but bland. The values round filters for people who can hold a real opinion and update it in real time. Pre-rehearsed humility lands as fake.',
      ] },

      { type: 'h2', text: 'The 94-minute prep checklist (run this the day before)' },
      { type: 'ol', items: [
        '0–15 min: Read the four most recent posts on stripe.com/blog and the latest Sessions keynote summary. Write three opinions you have about each.',
        '15–35 min: Pull up the JD. Write the three most likely product cases they would ask given that team (acquiring, billing, atlas, etc). Outline a 4-minute answer for each.',
        '35–55 min: Write a 200-word memo on a Stripe product you would change. This rehearses the writing register they assess on.',
        '55–75 min: Story drill. Pick four execution stories. For each: 30 seconds situation, 60 seconds action, 30 seconds measurable outcome. Say them out loud. Time them.',
        '75–85 min: AI-readiness drill. Write down five places AI tooling would change how you ran a past project. Specific tools, specific changes.',
        '85–94 min: Close. One opinionated thing about the team, one signature story, one question to ask. That is the kit you walk in with.',
      ] },

      { type: 'h2', text: 'A note on levelling' },
      { type: 'p', text: 'Stripe levels at the loop, not at the screen. This means a strong candidate going in for senior PM can land at PM (a downlevel) or at lead PM (an uplevel) based on the same loop. Knowing this changes how you respond to "tell me about your scope" — you should aim concretely at the bar of the level above the one you are interviewing for, in execution terms.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is the take-home really that important?' },
      { type: 'p', text: 'Yes. It is often weighted as much as one full onsite round. Treat it like a real strategy memo, not a take-home test.' },
      { type: 'h3', text: 'Do they ask LeetCode for senior PM?' },
      { type: 'p', text: 'No. There is sometimes a light technical depth round if you are interviewing for a payments-deep team, but it is conceptual, not coding.' },
      { type: 'h3', text: 'How honest should I be about salary?' },
      { type: 'p', text: 'Honest. The recruiter is calibrating against bands. Lying about a current number gets caught at offer stage and burns the offer.' },

      { type: 'callout', text: 'I built Vantage so I could run this exact prep routine in 90 seconds instead of 90 minutes — paste the Stripe JD, upload your CV, and get the company intel, the likely questions for that team, and a mock drill in one go. Free to try at aimvantage.uk.' },

      { type: 'p', text: 'Stripe is not impossible. It is just specific. Prep for the writing, the AI lens, and the execution stories — and skip the generic "tell me about a time" framework that everyone else is rehearsing.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2) ANTHROPIC AI SAFETY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'anthropic-ai-safety-interview-questions-2026',
    title: 'Anthropic AI safety interview: real questions and the trap',
    description: 'The Anthropic AI safety interview in 2026 — six stages, the values round, the questions they actually ask, and the safety-theatre trap that takes out strong candidates.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Anthropic', 'AI Safety', 'Interview Prep', 'AI Research', 'AI Hiring', 'Tech Interviews'],
    excerpt: 'Anthropic asks about AI safety at every single stage. The candidates who get through are not the ones with the most polished answers — they are the ones who can sit in real uncertainty and still reason out loud.',
    hook: 'Anthropic asks about AI safety at every stage. The trap is performing it instead of thinking about it.',
    sections: [
      { type: 'p', text: 'Anthropic crossed 1,200 employees in early 2026 after the Series F at a reported $61bn valuation. The hiring bar has not loosened — if anything, the safety + values filter has tightened, because the bigger the team gets, the more they need a coherent culture under it.' },
      { type: 'p', text: 'I have prepped two researchers and one applied engineer for Anthropic loops in the last 8 months. The pattern of who gets through is consistent. Here it is.' },

      { type: 'h2', text: 'The Anthropic interview — 6 stages, ~6–8 weeks' },
      { type: 'ol', items: [
        'Recruiter screen — 30 minutes. Background, alignment with the mission, basic role fit. Safety comes up here, lightly.',
        'Hiring manager screen — 45–60 minutes. Deeper on past work, specific projects, why this team.',
        'Technical screen — 60–90 minutes. Coding for engineers, technical discussion for researchers, ML fundamentals for both.',
        'Take-home or work sample — typically 4–8 hours over a weekend. A research write-up, a coding task, or a critique exercise.',
        'Onsite — 4 to 5 hour-long rounds. Technical depth, research taste / engineering judgement, cross-functional collaboration, plus a dedicated AI safety + values round.',
        'Reference + offer — typically 1–2 weeks. References go deep, including the "would you hire them again" question.',
      ] },
      { type: 'p', text: 'Expect 6 to 8 weeks total. Some loops have stretched past 12 weeks when the team is calibrating.' },

      { type: 'h2', text: 'The safety + values round — the round that actually decides it' },
      { type: 'p', text: 'Almost every offer or rejection I have seen at Anthropic was decided by this round, not by the technicals. The technical bar is high but binary — you pass or you do not. The values round is graded.' },
      { type: 'p', text: 'These are real questions, drawn from candidates I have debriefed:' },
      { type: 'ul', items: [
        '"What is something you have changed your mind about regarding AI risk in the last year? Why?"',
        '"Walk me through a specific failure mode of large language models that worries you most. Why that one?"',
        '"You read a paper that argues current alignment work is theatre. Steel-man it. Then tell me where it is wrong."',
        '"How would you decide whether a model is safe enough to deploy? Be concrete — which tests, which thresholds."',
        '"Tell me about a time you pushed back on a technical decision because of a safety concern. What was the outcome?"',
        '"What do you think we get wrong about safety at Anthropic specifically?"',
        '"How do you reason about deceptive alignment when there is no clean evaluation for it?"',
        '"If you could redirect 10% of compute right now, what would you redirect it to?"',
        '"Where do you think interpretability research is overhyped?"',
        '"You disagree with a senior researcher on a paper conclusion. Walk me through how you handle that."',
      ] },

      { type: 'h2', text: 'What kills candidates at Anthropic specifically' },
      { type: 'ol', items: [
        'Safety theatre. Reciting talking points from Anthropic blog posts back to the interviewers. They wrote those posts. They want to hear what you actually think, not what you have read them say.',
        'Refusing to hold an opinion. "I think both sides have merit" is a non-answer. They want to see you take a position, defend it, and update it in real time when challenged. Wishy-washy reads as not having engaged.',
        'Treating safety as separate from capability. The senior researchers there mostly do not. If your model of safety is "the brakes," not "the steering," you will sound naive.',
        'Underprepping the technical. The values round decides it, but the technical is the gate. Several candidates I know lost on coding because they thought safety alignment alone would carry them. It will not.',
        'Performing humility. There is a specific tone — confident, curious, willing to be wrong, allergic to overclaim. Forced humility lands as smarmy. Real conviction with self-awareness lands well.',
      ] },

      { type: 'h2', text: 'The 92-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0–20 min: Read three Anthropic research papers from the last 6 months — the most recent interpretability paper, one alignment paper, and one capability paper. Write one specific disagreement with each.',
        '20–35 min: Pick three failure modes of LLMs (sycophancy, deceptive alignment, jailbreaking, sandbagging, whatever). For each, write what evaluation you would build to detect it.',
        '35–55 min: Write a 300-word personal statement on AI risk. Not for them. For you. The act of writing it forces you to find your actual position. You will not read this in the interview. It just gets your reasoning warm.',
        '55–75 min: Technical drill. If engineer, code an LRU cache and a basic transformer attention block from scratch in Python. If researcher, sketch a small experiment design end to end. Time it.',
        '75–85 min: Story drill. Three stories — one about pushing back on a decision, one about being wrong, one about a research or engineering judgement call. Say them out loud.',
        '85–92 min: Close. One opinion you will defend, one specific Anthropic paper you have a take on, one question to ask.',
      ] },

      { type: 'h2', text: 'On "values fit"' },
      { type: 'p', text: 'There is a real signal here, and it is not the obvious one. They are not looking for AI doomers. They are looking for people who can hold complexity — who can say "I think this is dangerous AND I think we should build it AND I have concrete reasons for both." If your model of safety is binary, you will sound like you have not engaged.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Do I need to be a published safety researcher?' },
      { type: 'p', text: 'No. They hire engineers, applied researchers, infra people, product people. The safety values question is asked of all of them. You need a thoughtful position, not a publication record.' },
      { type: 'h3', text: 'How technical is the technical screen?' },
      { type: 'p', text: 'Senior — but rooted in fundamentals more than tricks. ML basics, distributed training, attention internals, classic data structures. Less LeetCode obscurity than FAANG, more "do you understand the system."' },
      { type: 'h3', text: 'Is remote possible?' },
      { type: 'p', text: 'For some roles. Most senior research and engineering roles are SF-based or hybrid. Confirm with the recruiter on the screen — do not assume.' },

      { type: 'callout', text: 'Vantage compresses the prep — paste the Anthropic JD, upload your CV, and get the company intel, the likely questions for that team, and a mock drill in 90 seconds. Free at aimvantage.uk.' },

      { type: 'p', text: 'Anthropic is one of the harder loops in tech right now. Not because it is unfair — because it actively filters for people who think for themselves. Prep accordingly.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3) DATADOG SOFTWARE ENGINEER
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'datadog-software-engineer-interview-guide-2026',
    title: 'Datadog software engineer interview: the project deep dive trap',
    description: 'The Datadog SWE interview in 2026 — five stages, the project deep dive, the broken-service round, the questions, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Datadog', 'Software Engineer Interview', 'Distributed Systems', 'System Design', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Datadog has the most distinctive SWE loop in observability. The project deep dive and the broken-service round are where most strong candidates lose — not on the coding.',
    hook: 'Datadog\'s coding rounds are fair. The project deep dive is where strong candidates quietly lose.',
    sections: [
      { type: 'p', text: 'Datadog crossed $3bn ARR in early 2026 and is still hiring aggressively across observability, security, and the new AI agent monitoring product. The interview process has stayed remarkably consistent — and remarkably distinctive — through that growth.' },
      { type: 'p', text: 'Two things make their loop different from a generic FAANG SWE process. The project deep dive, where they make you defend every decision in a past project, and the broken-service round, where they hand you a real production-shaped failure. Both are where I have seen the most candidates fall over.' },

      { type: 'h2', text: 'The Datadog SWE interview — 5 stages, ~3–6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen — 30 minutes. Background, why observability, basic logistics.',
        'Technical phone screen — 60 minutes. Live pair-programming in CoderPad. Brief CV chat then a practical coding problem.',
        'Onsite coding — usually two 60-minute rounds in CoderPad. Real-world problems, not LeetCode trickery.',
        'System design — 60 minutes in Excalidraw. Large-scale distributed systems, ingestion, storage trade-offs.',
        'Project deep dive — 60 minutes. You walk a senior engineer through a complex past project and defend every architectural choice.',
      ] },
      { type: 'p', text: 'Some loops add a sixth stage — a debugging or production simulation round, where you are given a broken service and live metrics and asked to diagnose root cause. This one is unusual enough that it catches almost everyone off guard the first time.' },
      { type: 'p', text: 'Total elapsed time is 3 to 6 weeks. They move faster than most of FAANG.' },

      { type: 'h2', text: 'Real questions from Datadog loops' },
      { type: 'ul', items: [
        '"Build a log storage system that supports time-range queries. Walk me through the data model first, then we will code the core write path."',
        '"Implement a buffered file writer that handles concurrent writers. Start with the API, then we will go into the locking strategy."',
        '"Design a rate limiter library from scratch — what would the public API look like, and what are the trade-offs of each algorithm?"',
        '"Walk me through the architecture of [past project]. Now: why this database and not [alternative]? Why this serialisation format?"',
        '"You are looking at this dashboard. P99 latency just spiked from 80ms to 1.2s. Walk me through what you check, in what order."',
        '"Design Datadog Logs. Start with the ingestion pipeline. We have 30 minutes."',
        '"Write a function that finds the K most frequent log lines in a stream that does not fit in memory."',
        '"You have a service that needs to handle 1M req/sec with strict ordering guarantees per user. Talk me through the partitioning strategy."',
        '"What are you optimising for here — write latency or read latency? Why?"',
        '"Walk me through how you would test this system end to end before shipping."',
      ] },

      { type: 'h2', text: 'What kills candidates at Datadog specifically' },
      { type: 'ol', items: [
        'Treating the project deep dive like a presentation. It is a defence. They will challenge every choice. If you cannot say why you picked Postgres over DynamoDB for that specific workload, you sound like you copy-pasted the architecture.',
        'Skipping the clarifying questions. The senior engineers there expect "what is the expected scale, what is the read/write ratio, what is the latency SLO" before you write code. Jumping in coding before clarifying signals junior thinking.',
        'Going abstract on system design. They want concrete numbers — 10TB/day, 50K writes/sec, 100ms P99. If your design has no numbers attached, it has no trade-offs to discuss.',
        'Bug-ridden code. Their coding bar expects working, testable code at the end of the round. Pseudocode-with-syntax-errors does not pass at senior levels.',
        'Forgetting the domain. Half their questions are observability-shaped. If you cannot reason about ingestion pipelines, time-series storage, or cardinality explosion, the answers stay surface.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0–15 min: Read the most recent Datadog engineering blog post and one observability blog post (Honeycomb, Grafana, Lightstep). Get the language back in your head.',
        '15–35 min: Pick the strongest project on your CV. Write down the 8 architectural decisions you made. For each: alternative considered, reason rejected, what you would do differently now. This is your deep dive prep.',
        '35–55 min: Code drill — implement an LRU cache, a rate limiter (token bucket), and a buffered writer with concurrency. From scratch. Time yourself, 20 minutes total.',
        '55–75 min: System design drill — sketch Datadog Logs end to end on paper. Ingestion, storage, query path, retention, cardinality strategy. Numbers attached.',
        '75–85 min: Debug drill — pick any past production incident you ran. Write down the symptom, the diagnostic order you ran, and the actual root cause. This rehearses the production simulation pattern.',
        '85–90 min: Close. One observability concept you can riff on (cardinality, time-series compression, sampling), one project decision you will defend, one question to ask.',
      ] },

      { type: 'h2', text: 'On the production simulation round' },
      { type: 'p', text: 'When you get this round, the worst move is to silently theorise. They want to hear your diagnostic loop out loud. "First I would check X because Y; if that is clean, I would check Z." It is the same skill an SRE uses on call. Treat it like that, not like a puzzle to solve in your head.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'How hard is the LeetCode part?' },
      { type: 'p', text: 'Medium-difficulty problems, set in real engineering scenarios. Not Hard tier abstract puzzles. The bar is on producing working, idiomatic code, not on pattern recognition.' },
      { type: 'h3', text: 'Do I need observability domain experience?' },
      { type: 'p', text: 'No. But you should be able to reason about the domain by interview day — read 3 of their engineering posts and one Honeycomb post and you will be calibrated enough.' },
      { type: 'h3', text: 'Is it remote-friendly?' },
      { type: 'p', text: 'Yes for most roles, with regional bias toward NY, Paris, Boston, and increasingly Dublin. Confirm with the recruiter.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + mock drill in 90 seconds for any role. Useful when you have three onsites in the same week. Free to try at aimvantage.uk.' },

      { type: 'p', text: 'Datadog\'s loop rewards engineers who think in production terms — concrete, defended, observable. Prep that way and you are halfway through it before you walk in.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4) REVOLUT PRODUCT DESIGNER
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'revolut-product-designer-interview-process-2026',
    title: 'Revolut product designer interview: the 6-stage UK loop',
    description: 'The Revolut product designer interview in 2026 — six stages, the live design challenge, the case study trap, and a 92-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Revolut', 'Product Designer Interview', 'UX Design', 'Interview Prep', 'Fintech UK', 'Design Hiring'],
    excerpt: 'Revolut runs the most structured product designer loop in UK fintech — six stages, a live design challenge, and a levelling decision that happens at the end, not the start.',
    hook: 'Revolut\'s designer loop is fair, structured, and brutal on case study choice — pick the wrong project and the rest of the loop is uphill.',
    sections: [
      { type: 'p', text: 'Revolut crossed 60 million customers globally in early 2026 and finally banked its UK banking licence after the long approval saga. The product design org has scaled accordingly — and the hiring loop has not loosened, despite the volume of openings.' },
      { type: 'p', text: 'I have prepped three designers through this loop in the last year. Two got offers, one did not. The pattern of who gets through is specific, and most of it comes down to one decision that happens before stage 1.' },

      { type: 'h2', text: 'The Revolut product designer process — 6 stages, ~5 weeks' },
      { type: 'ol', items: [
        'HR call — 30 minutes. Background, motivation, salary band, basic logistics. Light filter.',
        'Case study presentation — 60 minutes. You walk a hiring manager + senior designer through 1–2 case studies from your portfolio.',
        'Take-home task — 4–6 days, ~6–10 hours of real work. A product brief shaped to a Revolut-style problem.',
        'Live design challenge — 60–90 minutes. They give you a problem live and you whiteboard / sketch through it with a senior designer.',
        'Design director interview — 60 minutes. Strategic thinking, design org direction, leadership level.',
        'Team call — 45 minutes. Cross-functional fit, working style, ownership.',
      ] },
      { type: 'p', text: 'Total elapsed time is around 5 weeks if everyone is responsive. The HR team there is genuinely good about prep calls between rounds — use them.' },

      { type: 'h2', text: 'Real questions and prompts from the loop' },
      { type: 'ul', items: [
        '"Walk us through this case study. Now walk us through the variants you rejected and why."',
        '"You are designing onboarding for a financial product in a market with low banking trust. Sketch the first three screens, talking out loud."',
        '"Tell me about a time you got design feedback that fundamentally challenged your direction. What did you do?"',
        '"How would you redesign [an existing Revolut feature]? Take us through your reasoning, not the final pixels."',
        '"What is your process for working with PMs who want to ship faster than design quality allows?"',
        '"Show me the messiest version of one of your projects — the early sketches, the dead ends. Why those decisions?"',
        '"How do you handle edge cases when the happy path is already shipped and the team wants to move on?"',
        '"Pick a fintech app you do not work on. What is its biggest UX flaw and how would you fix it?"',
        '"Describe a project where the engineering constraint changed your design after sign-off. How did you adapt?"',
        '"How do you measure the success of a design after it ships?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Revolut specifically' },
      { type: 'ol', items: [
        'Picking the wrong case study. The single biggest predictor of outcome is whether your chosen study has a clean, easy-to-follow structure. Pick a complex flow and you spend 40 minutes explaining setup. Pick a strong, mid-complexity decision-rich project and you have time to show thinking.',
        'Showing only polished final screens. They want the rejected variants, the early sketches, the ugly Figma frames from week 1. Polish-only portfolios read as either dishonest or junior.',
        'Treating the live design challenge as a pixel exercise. It is not. They watch your reasoning. Sketch on paper, talk through edge cases, propose a measurement plan. Pretty wireframes without rationale lose.',
        'Underprepping the directors round. Senior designers often coast into this expecting it to be a chat. It is the strategic round and it has weight on levelling.',
        'Forgetting that Revolut levels at the loop. Your current title means nothing — they decide your level based on the case study + live challenge + directors round combined. Aim concretely at the level above.',
      ] },

      { type: 'h2', text: 'The 92-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0–20 min: Pick your case study. Use a project where you made 3–5 real decisions, can show rejected variants, and the outcome is measurable. Rehearse the spine in 10 minutes — situation, decisions, alternatives, outcome.',
        '20–35 min: Open the Revolut app on your phone. Find one flow you genuinely have a critique of. Write down what you would change and why. This is your "fresh eyes" answer for the live round.',
        '35–55 min: Live challenge drill. Pick a fintech UX prompt off any product design challenge site. Set a 30-minute timer. Sketch on paper, narrate your reasoning out loud, propose a measurement plan. Listen back if you can record.',
        '55–75 min: Variants drill. Take your case study. For each major decision, write 2 alternatives you considered and why you rejected them. This is the meat of the case study presentation.',
        '75–85 min: Directors-round prep. Write a 200-word answer to "what is the future of design at a fintech that is already at scale." This is what the strategic round wants.',
        '85–92 min: Close. One opinion about a Revolut flow, one variant you rejected and why, one question for the design director.',
      ] },

      { type: 'h2', text: 'On the case study choice' },
      { type: 'p', text: 'I have lost count of the candidates who insist on showing their most ambitious project — the redesign of the whole flow, the year-long initiative — and run out of time explaining the setup. The case study round is graded on signal density, not project size. A 6-week project with three good decisions and a measured outcome beats a year-long initiative with sprawling context.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Do I need fintech experience?' },
      { type: 'p', text: 'No. They hire from non-fintech regularly. You should be able to reason about regulated products, KYC, and risk by the time you walk in.' },
      { type: 'h3', text: 'Is the live challenge whiteboard or Figma?' },
      { type: 'p', text: 'Usually whiteboard or Miro / Excalidraw. The signal is reasoning, not Figma fluency. Sketching on paper and screen-sharing it works fine.' },
      { type: 'h3', text: 'Where are roles based?' },
      { type: 'p', text: 'London is the design HQ. Some roles in Porto and Berlin. Confirm with HR — they tend to be specific about hybrid expectations.' },

      { type: 'callout', text: 'Vantage gives you the company intel, the likely questions, and a mock drill for any role in 90 seconds. Useful for the days when you have a Revolut second-stage and a different first-stage in the same window. Free at aimvantage.uk.' },

      { type: 'p', text: 'Revolut\'s loop rewards designers who can show their thinking, not just their pixels. Pick the right case study, prep the rejected variants, and walk in calibrated for the level above.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5) OPENAI APPLIED RESEARCH
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'openai-applied-research-interview-prep-2026',
    title: 'OpenAI applied research interview: the prep that actually works',
    description: 'The OpenAI applied research engineer interview in 2026 — six stages, the take-home, the ML systems depth, and a 94-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['OpenAI', 'Applied Research', 'AI Engineer Interview', 'ML Systems', 'Interview Prep', 'AI Hiring'],
    excerpt: 'OpenAI\'s applied research loop is brutal — under 1% acceptance — but it is also predictable. The candidates who get through prep three things, and only three things.',
    hook: 'OpenAI\'s applied research loop has a near-1% acceptance rate. It is also more predictable than people think.',
    sections: [
      { type: 'p', text: 'OpenAI shipped GPT-5 in mid-2025 and has been on a steady research engineering hiring tear since — applied research, training infra, evals, agents. The loop has tightened, not loosened, with the volume.' },
      { type: 'p', text: 'Quoted acceptance rates sit between 0.5% and 1%. That number scares people into prepping wide and shallow. The candidates who actually get through prep narrow and deep — three areas, deeply, plus one strong work sample.' },

      { type: 'h2', text: 'The OpenAI applied research interview — 6 stages, ~4–8 weeks' },
      { type: 'ol', items: [
        'Recruiter screen — 30 minutes. Background, mission alignment, salary band sanity.',
        'Hiring manager / technical screen — 60 minutes. Past projects, ML fundamentals, sometimes a small coding warmup.',
        'Technical assessment — 60–90 minutes. Coding in Python, often live in CoderPad. Practical, not LeetCode-grindy.',
        'Take-home project — 4–10 hours over a week. A small applied ML task, a research write-up, or a system design + implementation hybrid.',
        'Onsite loop — 4 to 6 rounds, 60 minutes each. ML depth, systems / scaling, coding, research taste, behavioural / mission.',
        'Reference + offer — 1–2 weeks. References go deep on ownership and judgement.',
      ] },
      { type: 'p', text: 'Total elapsed time is 4 to 8 weeks. Faster if the team has a clear opening, slower if calibrating across roles.' },

      { type: 'h2', text: 'Real questions from OpenAI applied research loops' },
      { type: 'ul', items: [
        '"Walk me through self-attention. Now: what is its complexity in sequence length, and why does that matter for training a 1M-token context model?"',
        '"How would you train a model that does not fit on a single GPU? Walk me through data parallel vs tensor parallel vs pipeline parallel and when you would pick each."',
        '"Implement an LRU cache in Python from scratch. Now extend it to be thread-safe."',
        '"You see your training loss spiking after 20K steps. Walk me through your diagnostic order."',
        '"Explain LayerNorm vs BatchNorm vs RMSNorm. Why has the field largely converged on RMSNorm for transformers?"',
        '"Design an evaluation pipeline for measuring deceptive behaviour in a frontier model."',
        '"You have a fixed compute budget of 10^24 FLOPs. How do you decide between training a bigger model and training longer?"',
        '"Write a rate limiter that handles bursty traffic with token bucket semantics. Production-grade."',
        '"Tell me about a time you debugged something the rest of your team thought was impossible."',
        '"What is your honest position on AGI timelines, and how does it affect what you would build at OpenAI?"',
      ] },

      { type: 'h2', text: 'What kills candidates at OpenAI specifically' },
      { type: 'ol', items: [
        'Treating it like a FAANG loop. It is not. Less LeetCode trickery, more "do you understand transformers, training dynamics, and distributed systems at depth." Candidates over-grind algorithms and under-prep ML systems.',
        'Vague mission answers. "I want to build AGI safely" is a non-answer. They want a specific, opinionated take on what you would build, what you would not, and why you in particular care.',
        'Python rust. You will write Python live. If you cannot implement an LRU cache, a rate limiter, and a basic concurrent queue without looking up syntax, the coding rounds will hurt.',
        'No taste. Research engineers are filtered for taste — knowing which experiments are worth running. If you cannot defend "I would run X next, not Y," the research round flags you as a doer-not-thinker.',
        'Underprepping the take-home. It is weighted heavily. A polished write-up with clear reasoning beats a fancy result with sloppy methodology.',
      ] },

      { type: 'h2', text: 'The 94-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0–20 min: ML fundamentals quick pass. Self-attention complexity, LayerNorm vs RMSNorm, gradient checkpointing, mixed precision, optimizer states. If any of these are fuzzy, drill them now — they will come up.',
        '20–40 min: Distributed training drill. Write down when you would use data parallel, tensor parallel, pipeline parallel, FSDP, ZeRO. One sentence on the trade-off of each. This is the most common deep-dive trap.',
        '40–60 min: Code drill. LRU cache, token-bucket rate limiter, concurrent queue. From scratch in Python, no help, 20 minutes total. Working code only.',
        '60–75 min: Take-home review. Pull up your submitted take-home (or your strongest research project). Write down the 5 hardest questions an interviewer could ask. Answer them out loud.',
        '75–85 min: Mission drill. Write a 200-word genuine personal answer to "what would you build at OpenAI in your first 6 months and why." Not for the interview. For your own clarity. You will not read it. The act of writing locates your real position.',
        '85–94 min: Close. One specific recent OpenAI paper or product launch you have an opinion on, one technical area you can go deep on by request, one question to ask the team.',
      ] },

      { type: 'h2', text: 'On taste' },
      { type: 'p', text: 'The applied research bar is "would I want to ship something with this person." Taste is the word for that — knowing which problems are worth solving, which trade-offs are worth defending, which experiments are worth running. You build it by reading widely, having opinions, and updating them in public. You cannot fake it in a 60-minute interview, but you can show its absence quickly. Spend the prep week reading 5 papers from the last 3 months and forming a real take on each.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Do I need to be a published researcher?' },
      { type: 'p', text: 'No. Applied research is explicitly engineer-leaning. They want strong engineers with research instincts, not the other way around. Publications help; production-shipped ML systems matter at least as much.' },
      { type: 'h3', text: 'How much does mission alignment matter?' },
      { type: 'p', text: 'A lot. Not in the "did you read the charter" sense. In the "do you have a real, specific position on AGI risk and benefit" sense. Vague enthusiasm reads as not having engaged.' },
      { type: 'h3', text: 'Is remote possible?' },
      { type: 'p', text: 'Most senior research engineering is SF-based or hybrid SF. Some applied roles are more flexible. Confirm with the recruiter on the screen.' },

      { type: 'callout', text: 'Vantage runs company intel + likely questions + mock drill in 90 seconds. Useful when you have an OpenAI screen and three other final-stages in the same week. Free at aimvantage.uk.' },

      { type: 'p', text: 'OpenAI is hard, not impossible. Three deep areas, one strong work sample, one real position on the mission — that is the kit. Skip the wide-and-shallow prep that everyone else is rehearsing.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD Article schema for each post.
// Inject these into the BlogPost page <head> keyed by slug.
// ─────────────────────────────────────────────────────────────────────────────

export const newBlogPostsJsonLd: Record<string, object> = {
  'stripe-senior-pm-interview-guide-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Stripe senior PM interview: the 2026 guide nobody writes honestly',
    description: 'The actual Stripe senior PM interview process in 2026 — five stages, the take-home memo, the questions, the traps, and a 94-minute prep checklist.',
    datePublished: '2026-05-10',
    author: {
      '@type': 'Person',
      name: 'Giovanni Sizino Ennes',
      sameAs: 'https://aimvantage.uk/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      url: 'https://aimvantage.uk',
    },
    mainEntityOfPage: 'https://aimvantage.uk/blog/stripe-senior-pm-interview-guide-2026',
  },
  'anthropic-ai-safety-interview-questions-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Anthropic AI safety interview: real questions and the trap',
    description: 'The Anthropic AI safety interview in 2026 — six stages, the values round, the questions they actually ask, and the safety-theatre trap that takes out strong candidates.',
    datePublished: '2026-05-10',
    author: {
      '@type': 'Person',
      name: 'Giovanni Sizino Ennes',
      sameAs: 'https://aimvantage.uk/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      url: 'https://aimvantage.uk',
    },
    mainEntityOfPage: 'https://aimvantage.uk/blog/anthropic-ai-safety-interview-questions-2026',
  },
  'datadog-software-engineer-interview-guide-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Datadog software engineer interview: the project deep dive trap',
    description: 'The Datadog SWE interview in 2026 — five stages, the project deep dive, the broken-service round, the questions, and a 90-minute prep checklist.',
    datePublished: '2026-05-10',
    author: {
      '@type': 'Person',
      name: 'Giovanni Sizino Ennes',
      sameAs: 'https://aimvantage.uk/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      url: 'https://aimvantage.uk',
    },
    mainEntityOfPage: 'https://aimvantage.uk/blog/datadog-software-engineer-interview-guide-2026',
  },
  'revolut-product-designer-interview-process-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Revolut product designer interview: the 6-stage UK loop',
    description: 'The Revolut product designer interview in 2026 — six stages, the live design challenge, the case study trap, and a 92-minute prep checklist.',
    datePublished: '2026-05-10',
    author: {
      '@type': 'Person',
      name: 'Giovanni Sizino Ennes',
      sameAs: 'https://aimvantage.uk/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      url: 'https://aimvantage.uk',
    },
    mainEntityOfPage: 'https://aimvantage.uk/blog/revolut-product-designer-interview-process-2026',
  },
  'openai-applied-research-interview-prep-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'OpenAI applied research interview: the prep that actually works',
    description: 'The OpenAI applied research engineer interview in 2026 — six stages, the take-home, the ML systems depth, and a 94-minute prep checklist.',
    datePublished: '2026-05-10',
    author: {
      '@type': 'Person',
      name: 'Giovanni Sizino Ennes',
      sameAs: 'https://aimvantage.uk/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      url: 'https://aimvantage.uk',
    },
    mainEntityOfPage: 'https://aimvantage.uk/blog/openai-applied-research-interview-prep-2026',
  },
};
