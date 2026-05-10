// 5 long-tail SEO posts -- batch 2, drafted 2026-05-10
// Companion to blogPosts-newDrafts.ts.
// Append the objects below into the `blogPosts` array in `blogPosts.ts`.
// JSON-LD blocks for each post are listed at the bottom of this file.

import type { BlogPost } from './blogPosts';

export const newBlogPosts2: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1) CLOUDFLARE PRODUCT MANAGER
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'cloudflare-product-manager-interview-2026',
    title: 'Cloudflare PM interview: the post-layoff 2026 loop',
    description: 'The Cloudflare product manager interview process in 2026 -- five stages, the agent-era pivot, real questions, four traps, and a 92-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Cloudflare', 'Product Manager Interview', 'AI Agents', 'Interview Prep', 'Infrastructure', 'Tech Hiring'],
    excerpt: 'Cloudflare cut 1,100 jobs in May 2026 while reporting record revenue. The PM bar has moved -- they are hiring people who can ship in an agent-first world. Here is the loop and what they actually filter for now.',
    hook: 'Cloudflare just cut 20% of its workforce while posting its best quarter ever. The PM interview has changed underneath that announcement, and most candidates have not noticed.',
    sections: [
      { type: 'p', text: 'On 8 May 2026, Cloudflare announced it was cutting 1,100 roles -- about 20% of headcount -- while reporting Q1 revenue of $639.8M, up 34% year on year. Matthew Prince framed it bluntly: by 2027, AI agents will hit Cloudflare\'s network more than humans will, and the company is restructuring around that assumption. Internal AI tool usage was up 600% in three months.' },
      { type: 'p', text: 'I have walked two PMs through Cloudflare loops since the announcement. The bar has not loosened -- it has shifted. They want PMs who can reason about agent traffic, x402 payments, Workers AI, and what to ship for a network where humans are the minority case. Generic SaaS PM prep no longer touches sides.' },

      { type: 'h2', text: 'The Cloudflare PM process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why infrastructure, why now. They are explicit about the agent-era pivot, so expect them to test whether you have done your reading.',
        'Hiring manager interview -- 60 minutes. Past work, product judgement, why this team. Usually a small product case folded into the conversation.',
        'Technical / case round -- 60 minutes. Design or critique a product on the Cloudflare stack. Workers, Vectorize, AI Gateway, R2, Durable Objects -- you should know the rough shape of each.',
        'Onsite loop -- four 60-minute rounds: product sense, execution and metrics, cross-functional collaboration, plus a values / culture round. Sometimes a fifth depth round on networking, security, or AI.',
        'Debrief and offer -- typically a week. Average reported time-to-hire is around 27 days when nobody stalls.',
      ] },
      { type: 'p', text: 'The whole loop runs roughly 4 weeks if everyone moves. Some teams have stretched to 8-9 rounds with a take-home -- mostly the AI infrastructure orgs.' },

      { type: 'h2', text: 'The questions that actually come up (drawn from real loops)' },
      { type: 'ul', items: [
        '"By 2027 most of our network traffic will be AI agents, not browsers. Pick one Cloudflare product and tell me what changes in the roadmap."',
        '"Walk me through how x402 payments would work for an autonomous agent buying compute. Where are the edges?"',
        '"You own Workers AI. Inference costs are dropping 50% a year. What does pricing look like in 18 months?"',
        '"PMs at Cloudflare are not required to code, but you should be able to explain DNS, the TLS handshake, and edge vs origin trade-offs at whiteboard depth. Pick one and explain it."',
        '"Tell me about the most ambiguous decision you have owned. What did you decide with incomplete data and how did you write it up?"',
        '"Critique the AI Gateway product. What is missing? What would you kill?"',
        '"You disagree with your engineering lead on a security trade-off. How do you handle the next 10 minutes?"',
        '"Describe a launch you ran. Now describe what you would do differently with agentic tooling that did not exist when you ran it."',
        '"Pick an AWS product Cloudflare does not compete with yet. Should we? Argue both sides."',
        '"What is wrong with our pricing page right now? Show me on your phone."',
      ] },
      { type: 'p', text: 'The case rounds lean concrete. They want numbers, trade-offs, and the willingness to commit to a recommendation -- not framework recital.' },

      { type: 'h2', text: 'What kills candidates at Cloudflare specifically' },
      { type: 'ol', items: [
        'No technical depth. PMs do not code, but they do reason about networking, caching, security, and inference at a level most generalist PMs cannot fake. Get the basics of HTTPS, DNS, edge networks, and inference latency in your head before walking in.',
        'Generic agent takes. "AI is going to change everything" is a non-answer. Cloudflare wrote that thesis. They want a specific, opinionated view on what agents need from infrastructure that current vendors do not provide -- payments, identity, sandboxing, observability, all of the above?',
        'Missing the post-layoff context. The PMs who got through this month framed their answers around "what do we do with fewer, more leveraged builders" rather than "what new headcount would I hire." Read the room.',
        'Underpreparing the take-home or case. Cloudflare cases tend to be wide -- "design a product on Workers AI" -- and reward concrete trade-offs over comprehensive frameworks. Bring numbers. Say what you would not build.',
      ] },

      { type: 'h2', text: 'The 92-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Q1 2026 earnings call summary plus the most recent two posts on blog.cloudflare.com. Write down three things you have a real opinion on.',
        '15-35 min: Stack drill. For each of -- Workers, Workers AI, Vectorize, AI Gateway, R2, Durable Objects, Hyperdrive -- write one sentence on what it does and one sentence on its weakness. Two minutes each.',
        '35-55 min: Agent-era case prep. Pick a Cloudflare product. Write a one-page memo on how its roadmap changes when 60% of traffic is agents instead of browsers. Use real percentages and rough costs.',
        '55-75 min: Story drill. Four execution stories with concrete metrics. 30s situation, 60s action, 30s outcome. Time them out loud.',
        '75-85 min: Networking fundamentals refresher. DNS resolution path, TLS handshake, CDN cache hierarchy, BGP at high level. You will not be quizzed on these -- but the round is harder if you cannot lean on them.',
        '85-92 min: Close. One opinion you will defend, one specific Cloudflare decision you would change, one question for the hiring manager that proves you read the earnings call.',
      ] },

      { type: 'h2', text: 'On framing the layoff' },
      { type: 'p', text: 'You will probably want to ask about it. Do. But ask it like an adult: "What does the team look like in 6 months?" lands fine. "Was this just cost cutting?" sounds defensive. They are open about the pivot -- the right register is curious and direct, not nervous.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Do PMs need to code at Cloudflare?' },
      { type: 'p', text: 'Not formally. But you will be working with engineers who can ship a Workers project in an afternoon, and a PM who cannot read a JavaScript snippet or reason about latency budgets falls behind fast. Spin up a free Workers project before the loop -- two hours -- and you will sound calibrated.' },
      { type: 'h3', text: 'Is the bar lower for non-technical product areas like billing or support?' },
      { type: 'p', text: 'Lower on the stack depth, not lower on the rigour. The case rounds still expect numbers and trade-offs. Pricing PMs get hit with "model the unit economics on this" the same way infrastructure PMs get hit with "design the cache layer."' },
      { type: 'h3', text: 'Is remote possible?' },
      { type: 'p', text: 'Some roles. Most senior PM roles are San Francisco, Austin, London, or Lisbon. Confirm with the recruiter.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role. Useful when the JD just dropped, the loop starts in a week, and the company is mid-pivot. Free at aimvantage.uk.' },

      { type: 'p', text: 'Cloudflare\'s PM bar has not gotten easier. The company has just gotten more specific about what it wants. Prep the agent thesis, the stack, and the post-layoff register -- and skip the 2023 PM playbook everyone else is rehearsing.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2) FIGMA PRODUCT DESIGNER
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'figma-product-designer-interview-2026',
    title: 'Figma product designer interview: the post-IPO 2026 guide',
    description: 'The Figma product designer interview in 2026 -- five stages, the AI product portfolio shift, the multiplayer test, real questions, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Figma', 'Product Designer Interview', 'UX Design', 'Interview Prep', 'AI Tools', 'Design Hiring'],
    excerpt: 'Figma went public in July 2025 and shipped Make, Weave and Buzz on top of the core editor. The designer loop has shifted accordingly -- portfolios that ignore AI tooling now read as out of date.',
    hook: 'Figma is a public company shipping an AI product line under a stock that is down 48% YTD. The designer loop now filters for one thing most candidates have not prepped for.',
    sections: [
      { type: 'p', text: 'Figma priced its IPO at $33 in July 2025, tripled on day one, and has spent the last ten months under public-market pressure. The stock is down 48% YTD heading into the 14 May 2026 earnings call. Internally, the design org is still hiring, but the bar has tightened around one specific thing: how you reason about AI in a product that just shipped Make, Weave, Buzz, Sites, and Draw on top of the core editor.' },
      { type: 'p', text: 'I prepped a senior designer through this loop in March. The pattern is clear -- portfolios that ignore AI tooling, or treat it as a separate "AI side project," now read as out of date. Here is what is actually happening.' },

      { type: 'h2', text: 'The Figma product designer process -- 5 stages, ~3-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, motivation, comp expectations, hybrid preference. Light filter, fast turnaround.',
        'Portfolio review -- 60 minutes. You walk a hiring manager and a senior designer through 1-2 case studies. Variants, dead ends, and outcomes matter as much as final screens.',
        'Take-home or design exercise -- 4-7 days, ~6-10 hours of real work. A Figma-shaped brief, often touching one of Make / Sites / Buzz / Weave.',
        'Live design challenge -- 60-90 minutes. They give you a problem and you whiteboard it with two designers, talking out loud.',
        'Multiplayer / collaboration round + leadership chat -- 60-90 minutes combined. Cross-functional fit, working style, and a strategic chat with a design director or staff designer.',
      ] },
      { type: 'p', text: 'Total elapsed time is 3-5 weeks if everyone is responsive. They often run the take-home and live challenge in the same week, which is brutal -- block your calendar in advance.' },

      { type: 'h2', text: 'Real questions and prompts from the loop' },
      { type: 'ul', items: [
        '"Walk us through this case study. Now: what is one decision you made that you would reverse today, and why?"',
        '"You are designing a feature in Figma Make. The user prompts the AI but the result is wrong 30% of the time. Sketch the recovery flow."',
        '"How do you decide when AI assistance helps the designer and when it gets in the way? Give me a specific example from your work."',
        '"Show me the messiest version of one of your projects. Early sketches. Rejected variants. Why those decisions?"',
        '"Pick a flow inside Figma that frustrates you. Critique it on screen-share, then sketch the fix."',
        '"You are working with a PM who wants to ship before the design system is ready. Walk me through the next conversation."',
        '"How do you measure design success after launch? Be specific about the metrics, not just the framework."',
        '"Describe a project where engineering constraints forced a redesign post-handoff. What did you compromise and what did you fight for?"',
        '"Tell me about feedback that fundamentally changed your direction. What did you do?"',
        '"How would you redesign one of our newer products -- Buzz, Make, Sites? Take us through the reasoning, not the pixels."',
      ] },

      { type: 'h2', text: 'What kills candidates at Figma specifically' },
      { type: 'ol', items: [
        'Polish-only portfolios. Figma has been hiring for "designers who design in public" for years. They want the rejected variants, the early sketches, the screenshots from week 1. Polish-only reads as either dishonest or junior, every time.',
        'Treating AI tooling as a separate project. The new product line is the company strategy. If your case studies do not show how you reason about AI assistance -- when to use it, when to suppress it, how to design recovery from it -- the round flags you as not having engaged with where the org is going.',
        'Whiteboard pixel chasing. The live challenge is a reasoning round. Sketch on paper or Excalidraw, narrate edge cases, propose a measurement plan. Pretty wireframes without rationale lose to ugly sketches with a clear argument.',
        'Failing the multiplayer test. There are documented patterns of strong solo designers losing the collaboration round because they stay quiet, do not ask the PM-shaped questions, and treat the designers in the room as competition rather than collaborators. Talk through trade-offs out loud.',
        'Underprepping the leadership chat. Senior candidates often coast into this expecting a friendly chat. It carries weight on levelling. They want a real position on where design at a public AI-tooling company is going.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Use the new products. Open Figma Make, ship one tiny prototype. Open Buzz, generate one social asset. Open Sites, publish a draft page. You need 30 minutes of real handling time before you can talk about them with any credibility.',
        '20-40 min: Pick your case study. One project, 3-5 real decisions, rejected variants, measurable outcome. Rehearse the spine in 10 minutes. Twice.',
        '40-60 min: Live challenge drill. Pick a fintech / productivity / collaboration UX prompt. 30 minute timer. Sketch on paper or Excalidraw, narrate out loud. Record it if you can.',
        '60-75 min: AI reasoning drill. Write down 3 places in your past work where AI tooling would have changed the design. Specific tools, specific changes, specific user impact.',
        '75-85 min: Variants prep. For each major decision in your case study, write 2 alternatives you considered and why you rejected them. This is the meat of the portfolio review.',
        '85-90 min: Close. One critique of a Figma product, one variant you rejected, one question for the design director that proves you read the recent earnings call.',
      ] },

      { type: 'h2', text: 'On the AI portfolio shift' },
      { type: 'p', text: 'I keep seeing senior designers prep this loop the way they would have prepped it in 2023 -- pristine case studies, clean Figma frames, no mention of AI. The hiring bar has moved past that. You do not need an AI-specific case study, but you do need to be able to talk fluently about how AI assistance changes your craft. The designers getting offers right now are the ones who can say "here is where I would let the AI do it, here is where I would suppress it, here is why" -- with examples.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Do I need design-tools expertise to interview at Figma?' },
      { type: 'p', text: 'Surprisingly, less than people assume. They hire from product design at any kind of consumer or B2B SaaS. But you should be able to articulate trade-offs in tool design -- power vs simplicity, opinionated vs flexible -- by the time you walk in.' },
      { type: 'h3', text: 'Whiteboard or Figma for the live challenge?' },
      { type: 'p', text: 'Either. Many candidates default to FigJam or Figma. Paper or Excalidraw works equally well. The signal is reasoning, not Figma fluency.' },
      { type: 'h3', text: 'Is remote possible?' },
      { type: 'p', text: 'Hybrid in San Francisco, New York, and London for most senior design roles. Confirm with the recruiter -- they have been firmer on hybrid expectations post-IPO.' },

      { type: 'callout', text: 'Vantage gives you company intel, likely questions, and a mock drill for any role in 90 seconds. Useful when you have a Figma final-round and a different first-stage in the same week. Free at aimvantage.uk.' },

      { type: 'p', text: 'Figma\'s loop rewards designers who show their reasoning and have engaged with where the company is shipping. Use the new products before the interview, prep the rejected variants, and walk in calibrated for a public-market design org -- not the 2023 one.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3) DEEPMIND RESEARCH SCIENTIST
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'deepmind-research-scientist-interview-2026',
    title: 'DeepMind research scientist interview: the London 2026 loop',
    description: 'The DeepMind research scientist interview in 2026 -- six stages, the paper deep dive, ML coding without AI tools, real questions, and a 94-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '9 min read',
    tags: ['DeepMind', 'Research Scientist', 'AI Research', 'Interview Prep', 'Gemini', 'London'],
    excerpt: 'DeepMind\'s London loop runs 6-10 weeks and bans AI tools in technical rounds. The research scientist bar has tightened in 2026 -- not loosened -- as the org navigates the union vote and the Pentagon backlash.',
    hook: 'DeepMind\'s London loop is one of the slowest, hardest, most opinion-tested research interviews in the industry. AI tools are banned in the technical rounds -- and that is the easy part.',
    sections: [
      { type: 'p', text: 'On 5 May 2026, around 1,000 DeepMind staff in London signed a letter requesting union recognition -- the first frontier-AI-lab unionisation push, sparked by the Google-Pentagon contract backlash. 98% of CWU members backed it. The union story has not slowed hiring -- if anything, the safety and Gemini teams are still posting roles weekly -- but the values + mission filter has tightened. The loop now reads candidates harder on what they would refuse to work on, not just what they would build.' },
      { type: 'p', text: 'I prepped one researcher through a London Gemini Safety loop in early 2026. Here is what is actually happening.' },

      { type: 'h2', text: 'The DeepMind research scientist process -- 6 stages, ~6-10 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, area of research, mission fit. Light, but they take notes that follow you through the loop.',
        'Hiring manager / research lead -- 60 minutes. Past work, specific projects, why this team. They will probe one paper or project in depth.',
        'Technical / ML coding screen -- 90 minutes. Implement pieces of an ML pipeline by hand -- custom loss, attention, sampling, a small training loop. AI tools are not allowed.',
        'Paper deep dive -- 60-90 minutes. You pick a recent paper of yours (or one you know cold) and a senior scientist probes methodology, weaknesses, and how you would extend it.',
        'Onsite loop -- 4 to 5 hour-long rounds: research problem framing, ML math fundamentals, research taste, plus a values / mission round. Sometimes a fifth coding round.',
        'Hiring committee + offer -- 1-3 weeks. The committee is slow. References go deep on judgement, taste, and "would you hire them again."',
      ] },
      { type: 'p', text: 'Total elapsed time is 6-10 weeks. Some loops have stretched past 12 when the committee calibrates across multiple candidates. Plan around it.' },

      { type: 'h2', text: 'Real questions from DeepMind London loops' },
      { type: 'ul', items: [
        '"Walk me through the methodology of [your paper]. Now -- what is the strongest critique a reviewer could make? What did you not address?"',
        '"You have a fixed compute budget of 10^24 FLOPs. How do you split it between scaling the model and scaling the data? Defend your split."',
        '"Implement multi-head self-attention from scratch in NumPy. No PyTorch, no AI assistance. You have 30 minutes."',
        '"Derive the gradient of softmax cross-entropy on the whiteboard."',
        '"Sketch an experiment to detect whether a frontier model is sandbagging on a specific evaluation. What would falsify your design?"',
        '"How would you investigate whether a capability that emerges at 100B parameters is genuinely new or just scale-up of an existing skill?"',
        '"Pick a recent DeepMind paper you disagree with. What is wrong with it?"',
        '"You disagree with a senior researcher on an experimental conclusion. Walk me through the next 15 minutes."',
        '"What is something you have changed your mind about regarding AI capability or safety in the last year? Why?"',
        '"There are projects you would refuse to work on. Tell me about one and why."',
      ] },

      { type: 'h2', text: 'What kills candidates at DeepMind specifically' },
      { type: 'ol', items: [
        'Relying on AI tools. The technical rounds explicitly prohibit Copilot, Cursor, GPT-5, the lot. They are filtering for unaided foundational reasoning. Candidates who have not implemented attention by hand in the last 6 months struggle visibly. Drill it the week before.',
        'Surface-level paper deep dive. They will go deeper than you expect. If you pick a paper, you should know every figure, every ablation, every piece of feedback the reviewers gave, and every follow-up paper that has cited it. Pick one you can defend at PhD-defence level.',
        'Refusing to hold an opinion. "I think both views have merit" is the fastest way out of a research taste round. They want a position, defended specifically, updated in real time when challenged. Wishy-washy reads as not having engaged.',
        'Vague mission answers. After the union vote and the Pentagon contract backlash, the values round has weight it did not have a year ago. They want a specific, opinionated take on what you would build, what you would not, and why. Generic enthusiasm now flags as naive.',
        'Underestimating the ML math bar. The fundamentals round is concrete -- derive things on the whiteboard, prove a small theorem, debug a loss function. If you are out of practice on the math, the rest of the loop is uphill.',
      ] },

      { type: 'h2', text: 'The 94-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: ML math drill. Derive softmax cross-entropy gradient, layer norm, a single attention head, KL divergence. By hand, on paper. Time it.',
        '20-40 min: Paper drill. Read your chosen paper end to end. Write down the 5 hardest critiques a reviewer could make. Answer each out loud.',
        '40-60 min: ML coding drill. Implement multi-head attention in NumPy. From scratch. No autocompletion. 30 minutes max.',
        '60-75 min: Recent reading. Pick three DeepMind papers from the last 6 months -- one Gemini, one safety, one applied. Write one specific disagreement with each.',
        '75-85 min: Mission drill. Write a 300-word personal answer to "what would you build at DeepMind in your first year, what would you refuse to build, and why." Not for the interview. For your own clarity.',
        '85-94 min: Close. One paper you can go deep on, one experimental design you can defend, one question for the research lead that proves you have read the team\'s recent work.',
      ] },

      { type: 'h2', text: 'On the values round in 2026' },
      { type: 'p', text: 'The Pentagon contract and the union push have shifted what this round filters for. They are not looking for AI doomers, and they are not looking for cheerleaders. They are looking for researchers who can hold complexity -- "I think this is risky AND I think we should build it AND here are concrete reasons for both" -- and who have a clear, specific answer when asked what they would refuse. If your model of safety or military application is binary, you will sound like you have not engaged.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Do I need a PhD?' },
      { type: 'p', text: 'For research scientist roles, almost always yes. For research engineer or applied science roles, no -- strong production ML systems experience plus published work substitutes. Confirm with the recruiter.' },
      { type: 'h3', text: 'Is London compensation competitive with the US labs?' },
      { type: 'p', text: 'Net of UK tax structure, roughly comparable for senior+ roles -- gross is lower, but the Alphabet RSU grant and the tax difference compress the gap. Junior comp is more clearly behind US comp.' },
      { type: 'h3', text: 'Is remote possible?' },
      { type: 'p', text: 'Mostly no. London research roles are hybrid in the King\'s Cross office. Some applied roles are more flexible. Confirm with the recruiter on the screen.' },

      { type: 'callout', text: 'Vantage compresses the prep -- paste the DeepMind JD, upload your CV, and get the company intel, the likely questions for that team, and a mock drill in 90 seconds. Free at aimvantage.uk.' },

      { type: 'p', text: 'DeepMind\'s London loop is fair, slow, and unforgiving. Drill the math, drill the paper, hold a real opinion on the mission, and accept the 8-week timeline before you start. The candidates who get through prep narrow and deep -- not wide and shallow.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4) NOTION ENGINEERING
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'notion-software-engineer-interview-2026',
    title: 'Notion software engineer interview: the agent-era 2026 loop',
    description: 'The Notion software engineer interview in 2026 -- five stages, the system design real-world bias, the agent product shift, real questions, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Notion', 'Software Engineer Interview', 'System Design', 'AI Agents', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Notion shipped 3.0 with autonomous agents in late 2025 and crossed 5,700 employees by March 2026. The SWE loop is short and predictable -- but the system design round has shifted underneath the AI agent product, and most prep guides have not caught up.',
    hook: 'Notion\'s SWE interview is short, predictable, and well-documented. The new trap is the system design round -- which now wants real reasoning about agent infrastructure, not textbook architectures.',
    sections: [
      { type: 'p', text: 'Notion shipped 3.0 in September 2025 -- autonomous AI Agents that can run for up to 20 minutes, span hundreds of pages, draft reports, and update databases at scale. By March 2026 the company crossed 5,698 employees at an $11B valuation, with active hiring across AI, security, and enterprise solutions.' },
      { type: 'p', text: 'The SWE loop has stayed short -- average time to hire is around 28 days. But the system design round has shifted underneath the agent product, and the prep guides written before 3.0 are starting to look stale. Here is what is happening now.' },

      { type: 'h2', text: 'The Notion software engineer process -- 5 stages, ~3-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Notion, basic logistics. Light filter.',
        'Technical phone screen -- 60-75 minutes. Live coding, usually a practical problem in CoderPad. Not LeetCode trickery.',
        'Onsite loop -- 4 hour-long rounds in a single block. Two coding, one system design, one behavioural / values. Some teams add a fifth.',
        'Leadership / values chat -- 30-45 minutes. Alignment with company direction, often with a member of the leadership team.',
        'Reference + offer -- 1 week. Time-to-offer averages 28 days when nobody stalls.',
      ] },
      { type: 'p', text: 'Total elapsed time is 3-5 weeks if everyone moves. Glassdoor users rate the difficulty 2.97 / 5 -- below FAANG, but the bar on the system design and values rounds has crept up.' },

      { type: 'h2', text: 'Real questions from Notion loops' },
      { type: 'ul', items: [
        '"Implement a basic block-based document editor data model. Now: how does it support real-time collaboration?"',
        '"Walk me through how you would design an autonomous agent that can edit a Notion page over 20 minutes without conflicting with a human user editing the same page."',
        '"Design a search system for a 100M-document workspace where most queries are scoped to the user\'s 1-10K accessible pages."',
        '"Implement a function that flattens an arbitrarily nested block tree. Now make it lazy."',
        '"How would you store and query the access-control list for a workspace where any block can have its own permissions?"',
        '"Design rate limiting for an AI agent feature where agents are allowed to call our internal APIs at 100x the rate of human users."',
        '"Walk me through a project where you owned an end-to-end system. Why those choices? What broke in production?"',
        '"You join a team that has shipped a feature you would have designed differently. Walk me through the next month."',
        '"Code a publish/subscribe system for sending notifications when a block is updated. Production-grade."',
        '"How do you decide between consistency and availability when designing a feature like document sharing?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Notion specifically' },
      { type: 'ol', items: [
        'Textbook system design. The system design round at Notion is biased toward real product problems -- block editing, real-time collab, agent traffic, permission systems. If your answer is "I would put a Kafka queue in front of a CDN with a Postgres backend" without anchoring it in the actual product, the round flags as generic.',
        'Underprepping the agent angle. After 3.0, system design rounds frequently include agent traffic as a first-class constraint. If you cannot reason about how an autonomous agent that runs for 20 minutes interacts with a CRDT-based document, the AI-team rounds will hurt.',
        'Shaky values round. Notion values round is not a chat -- it carries weight on levelling. Generic "I love Notion" answers do not land. They want a specific position on what they should build and what they should not.',
        'Speed without correctness in coding. The coding bar is fair, but they want working, idiomatic code at the end of the round. Pseudocode-with-syntax-errors does not pass at senior levels.',
        'Forgetting the product. Half the questions are Notion-shaped. Use the product seriously for a week before the loop -- including AI Agents, Meeting Notes, Enterprise Search -- or your answers will stay surface.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use the product. Open Notion. Ship a small workspace, run an AI Agent on a multi-step task, look at the actual UX. You need 30+ minutes of real handling time before the system design round will be coherent.',
        '15-35 min: System design drill. Pick "design Notion AI Agents at the API layer." 20 minute timer. Write down: traffic shape, data model, consistency model, rate limiting, observability, failure modes. Numbers attached.',
        '35-55 min: Code drill. Implement an LRU cache, a debounced function with cancellation, and a tree flattener. From scratch in your strongest language. 20 minutes total.',
        '55-75 min: Real-time collaboration prep. Read one CRDT explainer or one OT explainer. Write one paragraph on how you would use it for the block editor, including failure modes.',
        '75-85 min: Story drill. Three execution stories with concrete numbers. 30s situation, 60s action, 30s outcome. Time them out loud.',
        '85-90 min: Close. One opinion on a Notion product decision, one project decision you will defend, one question for the team that proves you have used 3.0.',
      ] },

      { type: 'h2', text: 'On the agent-era system design' },
      { type: 'p', text: 'The system design questions at Notion in 2026 are quietly different from 2024. Then, you might have been asked to design a search system or a notification queue. Now you are increasingly asked to layer agent traffic on top -- where the same backend has to handle a human typing one character per second AND an autonomous agent fan-out reading 500 pages and writing 50 of them in parallel. The candidates who get through can reason about that fan-out, the rate limits, and the consistency model. The candidates who freeze are the ones who never thought about agents as a first-class user.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'How LeetCode-heavy is the coding?' },
      { type: 'p', text: 'Medium-difficulty problems framed in real engineering scenarios. Less Hard-tier abstract puzzles than FAANG. The bar is on producing working, idiomatic code, not pattern recognition.' },
      { type: 'h3', text: 'Do I need to be a power user of Notion?' },
      { type: 'p', text: 'Yes, by interview day. A week of serious daily use is enough. Engineers who have never seriously used the product struggle on the system design and the values rounds.' },
      { type: 'h3', text: 'Is remote possible?' },
      { type: 'p', text: 'Most senior engineering roles are hybrid in San Francisco or New York, with a smaller London office. AI and infrastructure roles trend toward SF. Confirm with the recruiter.' },

      { type: 'callout', text: 'Vantage runs company intel + likely questions + a mock drill in 90 seconds for any role. Useful when you have a Notion final-round and a different first-stage in the same week. Free at aimvantage.uk.' },

      { type: 'p', text: 'Notion\'s loop is one of the more humane senior engineering interviews in the industry -- short, fair, and predictable. Use the product, prep the agent angle on the system design, and walk in with a real opinion on what they should build. That is the kit.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5) SPOTIFY DATA SCIENTIST UK
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'spotify-data-scientist-interview-uk-2026',
    title: 'Spotify data scientist interview UK: the 2026 London loop',
    description: 'The Spotify data scientist interview in the UK in 2026 -- five stages, the SQL + Python depth, the product case trap, real questions, and a 92-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Spotify', 'Data Scientist Interview', 'SQL', 'Python', 'Interview Prep', 'UK Tech Hiring'],
    excerpt: 'Spotify\'s London data science loop is structured, fair, and quietly tough on the product case round. The candidates who get through prep three things -- and underpreparing the case is what kills the strong ones.',
    hook: 'Spotify\'s London data science loop has the most underestimated round in UK tech -- the product case, where strong analytical candidates quietly lose.',
    sections: [
      { type: 'p', text: 'Spotify\'s London office is actively hiring data scientists in 2026, with the 2026 summer internship cohort already through its February applications cycle. Senior and IC data scientist openings rotate through the Embedded, Premium, Marketplace, and Personalisation orgs.' },
      { type: 'p', text: 'I prepped two data scientists through the London loop in the last six months -- one offer, one rejection. The pattern of who gets through is consistent. Three rounds matter, and one of them is the round most candidates underprepare.' },

      { type: 'h2', text: 'The Spotify data scientist process -- 5 stages, ~3-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, motivation, comp expectations, hybrid preference. Light filter.',
        'Technical screen -- 60 minutes. SQL and Python live in CoderPad. Data manipulation, basic statistics, occasionally a small A/B test design question.',
        'Take-home or analysis exercise -- 4-6 hours over 4-7 days. Realistic Spotify-shaped data, ~2 questions, write-up + code submission.',
        'Onsite loop -- 4 to 5 hour-long rounds: deeper SQL, statistics + A/B testing, product / business case, ML modelling (sometimes), behavioural.',
        'Hiring committee + offer -- 1 week. References go deep on stakeholder management and judgement.',
      ] },
      { type: 'p', text: 'Total elapsed time is 3-5 weeks. Some loops have stretched to 7 when the take-home review queues up. London turnaround is generally faster than the New York loop.' },

      { type: 'h2', text: 'Real questions from Spotify London loops' },
      { type: 'ul', items: [
        '"Write SQL to find the top 10 artists by listener growth in the last 30 days, scoped to UK users on Premium." (live, 15 minutes)',
        '"You have an A/B test on a new home feed layout. After 2 weeks, treatment shows +2% in stream count, p = 0.08. What do you do?"',
        '"How would you measure the success of Spotify\'s podcast recommendations?"',
        '"Design an A/B test to evaluate a new shuffle algorithm. Be specific about metrics, randomisation unit, and how long you would run it."',
        '"You are presenting a -3% revenue result from your last experiment to a senior PM who championed the feature. Walk me through the next 10 minutes."',
        '"In Python, simulate flipping a biased coin until you see 5 heads in a row. What is the expected number of flips?"',
        '"How do you decide whether a new feature is hurting long-term retention vs short-term engagement?"',
        '"A senior analyst on your team is using a metric you think is misleading the org. How do you handle it?"',
        '"Tell me about a time your analysis changed a product decision. What was the analysis, what was the decision, what was the outcome?"',
        '"Why Spotify, why London, why this team?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Spotify specifically' },
      { type: 'ol', items: [
        'Underprepping the product case. The product case round is where most strong technical candidates lose. They smash the SQL and the stats, then freeze when asked "how would you measure podcast recommendations" because they have not built up an opinionated model of how Spotify works as a product. Use the app for a week, look at the metrics they report publicly, form a position.',
        'Surface-level A/B testing. "I would run a t-test for two weeks" is a non-answer at senior levels. They want to hear about randomisation unit, sample size, MDE, novelty effects, network effects, sequential testing decisions. Drill these the week before.',
        'Shaky live SQL. Live coding is in CoderPad and they expect window functions, CTEs, and clean joins under time pressure. If you have not written window-function SQL in the last month, drill it -- this is the round that surprises people.',
        'Vague impact stories. Spotify weights "what was the measurable outcome" heavily on behavioural rounds. Stories without numbers read as junior. Have 4-5 stories with concrete deltas ready.',
        'Forgetting the user. The data scientists who get through can talk about Spotify users -- listening behaviour, churn signals, podcast vs music differences, regional patterns -- with real specificity. The ones who do not lose the product round.',
      ] },

      { type: 'h2', text: 'The 92-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: SQL drill. Write 3 window-function queries, 1 self-join, 1 CTE-heavy aggregation. From scratch. 15 minutes max. If you stall, you need another hour of SQL practice tonight.',
        '15-30 min: A/B testing drill. On paper, write down the full template -- hypothesis, randomisation unit, primary + guardrail metrics, MDE, sample size logic, decision rule including underpowered case. Five minutes per stage.',
        '30-50 min: Product case prep. Pick one Spotify product area (podcasts, marketplace, personalised home, listening parties). Write a 1-page memo on how you would measure its success. Top-line metric, secondary metrics, leading indicators, lagging indicators, common Goodhart traps.',
        '50-70 min: Take-home review. Pull up your submitted take-home if you have one. Write down the 5 hardest follow-up questions an interviewer could ask. Answer them out loud.',
        '70-85 min: Story drill. Four impact stories with concrete numbers. 30s situation, 60s action, 30s measurable outcome. Time them.',
        '85-92 min: Close. One opinion on a Spotify product decision, one signature analysis story, one question for the hiring manager that proves you have used the product.',
      ] },

      { type: 'h2', text: 'On the product case round' },
      { type: 'p', text: 'I keep watching strong analytical candidates underprepare this round on the assumption that "Spotify is a music app, I have used it for years, I will be fine." It does not work. The signal they want is opinionated product thinking under specific constraints -- "to measure podcast recommendations I would track completion rate, but I would weight by show length and segment by new-vs-returning listener" -- not a recital of what metrics exist. The week-before product memo drill is the highest-leverage prep step for the whole loop.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Do I need ML modelling experience?' },
      { type: 'p', text: 'Depends on team. The Personalisation and ML Platform teams expect production ML systems experience -- recommendation models, embeddings, evaluation frameworks. The Marketplace and Embedded teams weight more heavily on causal inference, A/B testing, and product analytics. Confirm with the recruiter.' },
      { type: 'h3', text: 'How does London comp compare to the New York loop?' },
      { type: 'p', text: 'Lower in absolute terms, but UK tax structure and the lower cost of living narrow the net gap. London RSU grants and signing bonuses have crept up since 2024, especially for senior+ levels.' },
      { type: 'h3', text: 'Is remote possible?' },
      { type: 'p', text: 'Hybrid in the London office (typically 3 days a week). Some applied roles are more flexible. Confirm with the recruiter on the screen -- they have been firmer on hybrid since 2025.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role. Useful when you have a Spotify final-round and a different first-stage in the same week. Free at aimvantage.uk.' },

      { type: 'p', text: 'Spotify\'s London loop is fair, structured, and rewarded by specific prep. Drill the SQL, drill the A/B testing template, write a product memo on the team\'s area before the loop -- and skip the generic data science prep that everyone else is rehearsing.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD Article schema for each post.
// Inject these into the BlogPost page <head> keyed by slug.
// ─────────────────────────────────────────────────────────────────────────────

export const newBlogPostsJsonLd2: Record<string, object> = {
  'cloudflare-product-manager-interview-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cloudflare PM interview: the post-layoff 2026 loop',
    description: 'The Cloudflare product manager interview process in 2026 -- five stages, the agent-era pivot, real questions, four traps, and a 92-minute prep checklist.',
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
    mainEntityOfPage: 'https://aimvantage.uk/blog/cloudflare-product-manager-interview-2026',
  },
  'figma-product-designer-interview-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Figma product designer interview: the post-IPO 2026 guide',
    description: 'The Figma product designer interview in 2026 -- five stages, the AI product portfolio shift, the multiplayer test, real questions, and a 90-minute prep checklist.',
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
    mainEntityOfPage: 'https://aimvantage.uk/blog/figma-product-designer-interview-2026',
  },
  'deepmind-research-scientist-interview-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'DeepMind research scientist interview: the London 2026 loop',
    description: 'The DeepMind research scientist interview in 2026 -- six stages, the paper deep dive, ML coding without AI tools, real questions, and a 94-minute prep checklist.',
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
    mainEntityOfPage: 'https://aimvantage.uk/blog/deepmind-research-scientist-interview-2026',
  },
  'notion-software-engineer-interview-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Notion software engineer interview: the agent-era 2026 loop',
    description: 'The Notion software engineer interview in 2026 -- five stages, the system design real-world bias, the agent product shift, real questions, and a 90-minute prep checklist.',
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
    mainEntityOfPage: 'https://aimvantage.uk/blog/notion-software-engineer-interview-2026',
  },
  'spotify-data-scientist-interview-uk-2026': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Spotify data scientist interview UK: the 2026 London loop',
    description: 'The Spotify data scientist interview in the UK in 2026 -- five stages, the SQL + Python depth, the product case trap, real questions, and a 92-minute prep checklist.',
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
    mainEntityOfPage: 'https://aimvantage.uk/blog/spotify-data-scientist-interview-uk-2026',
  },
};
