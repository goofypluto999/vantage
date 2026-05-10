// 3 AI-dev-tools interview-guide posts -- batch 9, drafted 2026-05-10
// Cursor, Replit, Modal. Hot 2026 hiring verticals. Low SEO competition,
// strong overlap with the laid-off-FAANG-engineer + indie-hacker ICP.

import type { BlogPost } from './blogPosts';

export const newBlogPosts9: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) CURSOR (ANYSPHERE) ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'cursor-engineer-interview-2026',
    title: 'Cursor (Anysphere) engineer interview: the AI-IDE 2026 loop',
    description: 'The Cursor / Anysphere engineer interview in 2026 -- four stages, the build-with-the-tool culture, real questions, four traps, and a 75-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Cursor', 'Anysphere', 'Engineer Interview', 'AI Dev Tools', 'Interview Prep', 'Editor', 'Tech Hiring'],
    excerpt: 'Cursor (built by Anysphere) is one of the fastest-growing AI dev tools in 2026. The engineer loop is short and brutal -- they hire people who already use the product seriously and ship to it.',
    hook: 'Cursor hires engineers who use Cursor seriously every day. The recruiter screen filters out 70% of candidates in the first 5 minutes for a single specific reason.',
    sections: [
      { type: 'p', text: 'Cursor (built by Anysphere) is the AI-first code editor that has gone from research preview in 2023 to one of the most-used dev tools in 2026. The engineering team is small but hires constantly -- editor team, ML team, infrastructure, agent platform. The bar is high but the loop is short. The single biggest filter: have you used Cursor seriously for at least a month, with a real opinion on what is broken? "I tried it once" is the end of the recruiter screen.' },

      { type: 'h2', text: 'The Cursor engineer process -- 4 stages, ~3 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Cursor, how you have used the product. They will probe specifically -- which features have you found bugs in, which models do you switch between, which compose-flow has bitten you.',
        'Technical screen -- 60 minutes. Live coding inside Cursor (yes, the actual interview happens in the product). Often involves extending the editor itself, building an agent, or debugging Cursor-shaped problems.',
        'System design + product round -- 90 minutes combined. Real Cursor-shaped scenarios. "Design the streaming completions infrastructure for 100K concurrent users." "How would you reduce the latency budget for inline tab-complete by 30%?" "What is wrong with our agent flow right now?"',
        'Founders / culture -- 45 minutes. Often Aman, Sualeh, or a senior engineer. Strategy questions, opinions, calibrated debate. Very small-team energy.',
      ] },
      { type: 'p', text: 'Total wall-clock time is ~3 weeks. They move fast when they like a candidate -- offers in 2-3 weeks. They move very fast at the no -- silence by day 3 of the recruiter screen is the signal.' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Open Cursor right now. Walk me through the workflow you use most. Tell me three things you would change."',
        '"What is the most subtle bug you have hit in Cursor in the last month? How did you work around it?"',
        '"Design the streaming completions infrastructure at 100K concurrent users, p99 under 200ms for inline completions."',
        '"You disagree with a senior engineer on whether to ship a Cursor feature behind a flag or as a default in the next stable release. Argue your side for 5 minutes."',
        '"Walk me through how you would build a Cursor agent that refactors a 50-file TypeScript codebase to use a new library. Where do you draw the human-in-the-loop line?"',
        '"You inherit a feature where 5% of completions hang for 30+ seconds. First three things you investigate?"',
        '"What is your real opinion on the Claude vs GPT-5 model selection within Cursor? Where would you change the default?"',
        '"Tell me about an open-source contribution you have made. Why that one?"',
        '"Pick a competitor (Continue, Cline, Aider, Zed AI). Tell me what they get right that we do not."',
        '"What is the smallest feature you have shipped that you are most proud of?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Cursor specifically' },
      { type: 'ol', items: [
        'Not using the product seriously. The number one filter. If your last serious Cursor session was 3 months ago, the recruiter screen is over fast. Use it daily for at least 30 days before applying. Have specific bug reports, feature requests, and workflow opinions.',
        'Generic AI takes. "AI is going to change everything" is not an answer at Cursor. They want depth -- "the way Cursor handles symbol context for cross-file refactors is X% slower than ideal because Y" is the register.',
        'Underestimating editor internals. You will not be quizzed on VS Code source code, but you should be able to reason about LSP, file watching, indexing strategies, and tree-sitter at whiteboard depth. Know the basics.',
        'Missing the small-team register. Cursor is small relative to its valuation. Stories about how you ran 12-person committees do not land. Stories about how you shipped end-to-end as the only owner do.',
      ] },

      { type: 'h2', text: 'The 75-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Open Cursor. Use it on a real project. Toggle compose, agent, tab-complete, model selection. Note three friction points and three things you respect.',
        '20-35 min: Stack drill. LSP basics, tree-sitter parsing, completion streaming, embedding-based codebase indexing, vLLM or similar serving infrastructure. Two minutes per concept.',
        '35-50 min: System design. Pick one of -- streaming completions at scale, agent multi-step refactor, codebase indexing pipeline. Write a one-page memo.',
        '50-65 min: Story drill. Three engineering stories with concrete metrics + real failures. 200 words each.',
        '65-72 min: Competitor + ecosystem audit. Continue, Cline, Aider, Zed AI, Windsurf. One sentence on what each gets right.',
        '72-75 min: Close. One opinion on the Claude vs GPT-5 default, one specific Cursor decision you would change, one question for the founder that proves you have used it seriously.',
      ] },

      { type: 'h2', text: 'On the technical screen inside Cursor' },
      { type: 'p', text: 'The interview happens IN Cursor. This is not metaphorical. They will share a workspace and ask you to extend the editor, build an agent, or debug a real Cursor-shaped problem. If you have not used compose, agent mode, or the YOLO compose flow, you will be lost in 5 minutes. Spend the week before drilling these specifically.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Cursor remote in 2026?' },
      { type: 'p', text: 'Mostly SF + NYC. Some senior+ roles open to fully remote. Confirm at the recruiter screen. Most of the team is in person.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market. Equity meaningful at the post-2024 valuation. Below FAANG on cash but well above for total-comp at senior+ levels.' },
      { type: 'h3', text: 'Do they hire from non-traditional backgrounds?' },
      { type: 'p', text: 'Yes — public open-source signal substitutes for credentials. Self-taught engineers with strong commit graphs and a serious Cursor usage story get loops faster than PhDs with no public artefacts.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including small-team AI shops like Cursor where the JD undersells how seriously they filter on product usage. Free at aimvantage.uk.' },

      { type: 'p', text: 'Cursor hires engineers who use Cursor. Spend the month before the loop using it daily on a real project, with specific bug reports and workflow opinions. It is the single biggest filter and almost no other AI shop weighs it as heavily.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) REPLIT ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'replit-engineer-interview-2026',
    title: 'Replit engineer interview: the agent-first 2026 loop',
    description: 'The Replit engineer interview in 2026 -- five stages, the post-Agent pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Replit', 'Engineer Interview', 'AI Dev Tools', 'Replit Agent', 'Interview Prep', 'Cloud IDE', 'Tech Hiring'],
    excerpt: 'Replit pivoted hard around Replit Agent in 2024-25 and is now one of the fastest-growing AI dev platforms. The engineer loop tests for whether you can reason about agent-first workflows and multi-tenant cloud IDE architecture.',
    hook: 'Replit\'s pivot from cloud IDE to agent-first platform reshaped the engineering interview. Most candidates still prep for the 2023 cloud-IDE-shaped loop and lose accordingly.',
    sections: [
      { type: 'p', text: 'Replit went all-in on Replit Agent in 2024-25 -- the AI agent that builds and ships full applications from a prompt. It worked. Revenue grew 5x in 12 months and the engineering team has been hiring constantly. The bar in 2026 reflects the pivot: where 2023 Replit interviews leaned heavily on cloud IDE / containerisation reasoning, 2026 interviews now blend that with agent reasoning -- multi-step task orchestration, error recovery, agent-to-agent workflows.' },

      { type: 'h2', text: 'The Replit engineer process -- 5 stages, ~3-4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Replit, why this team. They probe whether you have built something with Replit Agent recently.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the agent-first register.',
        'Coding -- 60 minutes. Live or take-home. Often involves building or extending a Replit-shaped feature -- a multi-step agent, a sandbox runtime feature, a deploy-flow improvement.',
        'System design -- 60 minutes. Real Replit-shaped scenarios. "Design Replit Agent\'s task scheduler at 100K concurrent agent runs." "Walk me through how the sandbox runtime isolates 1M user containers." "How do you handle a half-completed agent run when the user closes the browser?"',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round (often Amjad or a senior eng).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Open Replit right now. Build me a small thing with Replit Agent. Talk me through what you change in the prompt and why."',
        '"Design Replit Agent\'s task scheduler at 100K concurrent agent runs. Walk me through the architecture."',
        '"How does the Replit sandbox runtime isolate 1M concurrent user containers? Where is the contention?"',
        '"You disagree with a senior engineer on whether to gate a destructive Replit Agent action behind explicit user confirmation or a confidence threshold. Argue your side for 5 minutes."',
        '"Walk me through how you would handle a half-completed Replit Agent run when the user closes the browser."',
        '"Pick a Replit product surface. Tell me three things you would change. Defend each."',
        '"You inherit a sandbox runtime that leaks memory at 0.5MB per session. First three things you investigate?"',
        '"What is your real opinion on the future of cloud IDEs? Where is Replit right and where is GitHub Codespaces right?"',
        '"Tell me about a production incident in a multi-tenant system you owned. What did the postmortem look like?"',
        '"Why Replit and not Vercel, GitHub Codespaces, StackBlitz, or Cursor?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Replit specifically' },
      { type: 'ol', items: [
        'Not using Replit Agent recently. Same filter as Cursor. Build something with Agent the week before applying. Have specific friction points + workflow opinions.',
        'Generic agent takes. Replit has shipped a real agent that ships full applications. "AI agents are interesting" is not an answer. "I would not let Replit Agent push to a connected GitHub repo without a diff-preview confirmation step because the rollback cost on a multi-file refactor is too high" is calibrated.',
        'Missing the multi-tenant container reasoning. Replit runs millions of user containers. If you cannot reason about isolation, cold-start latency, snapshot/restore patterns, and noisy-neighbour mitigation, the system design round goes shallow.',
        'Underestimating the small-team velocity register. Stories about how you owned scope through 12-person sign-off do not land. Stories about how you shipped end-to-end with one designer in 2 weeks do.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Open Replit. Build something with Replit Agent. Note three friction points and three things you respect.',
        '20-40 min: Stack drill. Sandbox runtime (Nix-based), agent task orchestration, multi-tenant containerisation, deploy flow, the AI-Hosting layer. Two minutes per concept.',
        '40-55 min: System design. Pick one of -- agent task scheduler, multi-tenant sandbox, agent-run state machine. Write a one-page memo.',
        '55-70 min: Story drill. Three engineering stories. 200 words each.',
        '70-78 min: Competitor + ecosystem audit. GitHub Codespaces, StackBlitz, Cursor, Vercel v0. One sentence on each.',
        '78-80 min: Close. One opinion on the cloud-IDE future, one specific Replit decision you would change, one question for the hiring manager that proves you have built with Agent.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Replit remote in 2026?' },
      { type: 'p', text: 'Mostly SF. Some senior+ roles open to fully remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for the stage. Equity meaningful at the post-2024 valuation.' },
      { type: 'h3', text: 'Do they hire international remote?' },
      { type: 'p', text: 'Selectively, role-dependent. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including post-pivot AI dev tool companies like Replit. Free at aimvantage.uk.' },

      { type: 'p', text: 'Replit hires engineers who use Replit Agent, reason about multi-tenant cloud-IDE architecture, and operate at small-team velocity. Prep the agent stack, the sandbox isolation context, and a real take on the cloud-IDE future.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) MODAL ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'modal-engineer-interview-2026',
    title: 'Modal engineer interview: the serverless GPU 2026 loop',
    description: 'The Modal Labs engineer interview in 2026 -- four stages, the GPU infrastructure depth filter, real questions, four traps, and a 75-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Modal', 'Modal Labs', 'Engineer Interview', 'Serverless GPU', 'Infrastructure', 'Interview Prep', 'AI Hiring', 'Tech Hiring'],
    excerpt: 'Modal Labs runs serverless GPU compute at scale and is the hot infrastructure shop hiring AI-platform engineers in 2026. The loop tests for one specific signal: have you actually shipped GPU infrastructure, or just used it?',
    hook: 'Modal hires people who have built GPU infrastructure, not just used it. The recruiter screen separates the two within 5 minutes.',
    sections: [
      { type: 'p', text: 'Modal Labs is private, has been growing aggressively since 2023, and ships serverless GPU compute that is used by hundreds of AI startups including some of the most prominent ones. The engineering team is small but hires constantly across runtime, scheduler, networking, billing, and developer experience. The bar is high but specific: have you built the kind of infrastructure Modal sells, or have you only used it? "I have used Modal" is the recruiter screen. "I have built a custom container scheduler with bin-packing for GPU workloads at $previous_employer" is the next round.' },

      { type: 'h2', text: 'The Modal engineer process -- 4 stages, ~3 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Modal, why this team. They probe whether you have built infrastructure adjacent to what Modal does -- containerisation, scheduling, networking, billing, GPU drivers.',
        'Technical screen -- 60 minutes. Live coding or take-home. Often involves containerisation primitives, scheduling logic, or low-level systems trade-offs.',
        'System design -- 60 minutes. Real Modal-shaped scenarios. "Design GPU bin-packing for 100K concurrent function invocations across heterogeneous hardware." "Walk me through cold-start optimisation for GPU containers." "How does Modal handle billing accuracy when a function invocation crosses a billing-period boundary?"',
        'Onsite or final loop -- 3 rounds: deeper system design or coding, behavioural / values, plus a leadership round (often a co-founder).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when you call modal.Function.run() from your laptop. Trace it end-to-end."',
        '"Design GPU bin-packing for 100K concurrent function invocations across heterogeneous hardware. Walk me through the architecture."',
        '"You have a customer whose GPU cold-start latency went from 12s to 45s overnight. First three things you investigate?"',
        '"Walk me through how Modal handles a function invocation that runs for 6 hours but the customer\'s billing period ends mid-execution."',
        '"You disagree with a senior engineer on whether to share GPU memory between two functions on the same host. Argue your side for 5 minutes."',
        '"Pick a Modal product surface. Tell me three things you would change. Defend each."',
        '"What is your real opinion on Modal vs RunPod vs Replicate vs Banana? Where do you agree with each, and where do you disagree?"',
        '"You inherit a containerisation layer with 95th-percentile cold-start at 8 seconds. Six month plan to get it under 2."',
        '"Tell me about a production incident in low-level systems you owned. What did the postmortem look like?"',
        '"What is the smallest infrastructure feature you have shipped that you are most proud of?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Modal specifically' },
      { type: 'ol', items: [
        'No real infrastructure depth. Modal is a hardcore systems shop. If your background is application-layer engineering with no real containerisation, scheduling, or low-level systems experience, the technical screen will go shallow fast. Be honest with yourself about whether Modal is the right fit.',
        'Generic GPU takes. "GPUs are bottlenecked" is not an answer. "The H100 SXM bandwidth ceiling for inference at batch size 1 is X TB/s and most production workloads run at Y% of that" is calibrated.',
        'Missing the billing-accuracy register. Modal\'s product is, fundamentally, accurate billing for compute. If you cannot reason about billing primitives, fractional-second precision, and edge cases like out-of-memory mid-execution, you are missing what makes the company actually work.',
        'Underestimating Python developer experience. Modal\'s magic is wrapping deep systems work behind Python idioms. If you cannot reason about both the systems and the DX layers, the round goes shallow on whichever one you neglected.',
      ] },

      { type: 'h2', text: 'The 75-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Modal. Run a real function. Note three friction points and three things you respect.',
        '15-30 min: Stack drill. Container runtime (gVisor / Firecracker / custom), GPU scheduling, bin-packing, cold-start optimisation, billing primitives, Python SDK design patterns. Two minutes per concept.',
        '30-50 min: System design. Pick one of -- bin-packing scheduler, billing accuracy under interruption, cold-start optimisation. Write a one-page memo.',
        '50-65 min: Story drill. Three infrastructure stories with concrete metrics + real failures. 200 words each.',
        '65-72 min: Competitor + ecosystem audit. RunPod, Replicate, Banana, Beam, Lambda Labs. One sentence on each.',
        '72-75 min: Close. One opinion on serverless GPU vs reserved instances, one specific Modal decision you would change, one question for the founder that proves you have used the product seriously.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Modal remote in 2026?' },
      { type: 'p', text: 'Hybrid. NYC and SF hubs. Some senior+ roles open to fully remote in NA timezones. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for systems infrastructure roles. Equity meaningful at late-private valuation.' },
      { type: 'h3', text: 'Do they hire non-systems backgrounds?' },
      { type: 'p', text: 'Selectively for DX, billing, and front-end roles. The infrastructure team is hardcore systems-only.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including hardcore infrastructure shops like Modal. Free at aimvantage.uk.' },

      { type: 'p', text: 'Modal hires engineers who have built infrastructure, not just used it. Prep the systems depth, the billing-accuracy register, and a real opinion on the serverless-GPU vs reserved-instance trade-off.' },
    ],
  },
];
