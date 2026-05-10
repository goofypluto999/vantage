// 3 more interview-guide posts -- batch 16
// Nvidia (AI chips), ARM (UK ICP fit), TikTok (social, high volume).

import type { BlogPost } from './blogPosts';

export const newBlogPosts16: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) NVIDIA SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'nvidia-software-engineer-interview-2026',
    title: 'Nvidia software engineer interview: the AI-infrastructure 2026 loop',
    description: 'The Nvidia software engineer interview in 2026 -- five stages, the CUDA + post-Blackwell context, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Nvidia', 'Software Engineer Interview', 'CUDA', 'AI Infrastructure', 'Blackwell', 'GPU', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Nvidia is the most-valued tech company in the world and hires across CUDA, AI infrastructure, automotive, robotics. The 2026 loop tests for GPU-systems depth most candidates underestimate.',
    hook: 'Nvidia\'s engineering bar in 2026 is high but specific: real CUDA / GPU-systems depth, not just "I have used PyTorch". The interview filters that signal in or out fast.',
    sections: [
      { type: 'p', text: 'Nvidia (NASDAQ: NVDA) became the most-valued tech company in the world on the back of CUDA + Blackwell + the AI infrastructure boom. The engineering team is hiring across CUDA libraries (cuDNN, cuBLAS, NCCL), DGX / SuperPOD systems software, the AI Enterprise platform (NIM, NeMo), automotive (DRIVE), robotics (Isaac), and the post-Blackwell hardware-software co-design org. The 2026 hiring bar is high but specific: real GPU-systems depth (CUDA at the kernel level, memory hierarchy reasoning, distributed training primitives), not just "I have used PyTorch".' },

      { type: 'h2', text: 'The Nvidia SWE process -- 5 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why Nvidia, why this team. They will probe whether you have written real CUDA or only used high-level frameworks.',
        'HireVue / online coding -- 90 minutes async. Two coding problems, often C++ flavoured. Edge cases + complexity analysis required.',
        'Phone screen -- 60 minutes. Live coding (C++ for systems / kernels; Python for ML platform; Go / Rust for newer services). Hard problem with explicit performance trade-offs.',
        'Onsite -- 4-5 rounds, 60 minutes each: 1-2x coding (often CUDA-flavoured for AI infra), 1x system design (always GPU + distributed-systems shaped), 1x architecture deep-dive (GPU memory hierarchy / CUDA streams), 1x behavioural.',
        'Hiring manager + skip-level. Nvidia has more formal hiring committee than most tech, less than Goldman Sachs.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Code: implement matrix multiplication in CUDA. Now optimise for shared memory + tile size. What is the theoretical occupancy on H100?"',
        '"Walk me through the GPU memory hierarchy on Blackwell. Where do you place your tensors for a transformer training job?"',
        '"Design the inference serving layer for Llama-3 70B on a DGX H200 cluster, with FP8 quantisation. p99 under 100ms. Walk me through the architecture."',
        '"You are measuring 60% kernel utilisation on a CUDA workload. First three things you investigate?"',
        '"Walk me through how NCCL implements all-reduce across a 16-GPU node with NVLink. Where is the bottleneck on Blackwell?"',
        '"You disagree with a senior engineer on whether to optimise for PyTorch eager mode or torch.compile. Argue your side."',
        '"What is your real opinion on the Blackwell vs MI300X / TPU v5e competitive landscape? Where is Nvidia\'s moat actually durable? Where is it not?"',
        '"Tell me about a time you optimised a low-level systems performance bottleneck. What did the postmortem look like?"',
        '"Why Nvidia and not [AMD / Cerebras / Groq / OpenAI infra team]?"',
        '"Pick one Nvidia software product. Tell me three things you would change. Defend each."',
      ] },

      { type: 'h2', text: 'What kills candidates at Nvidia specifically' },
      { type: 'ol', items: [
        'No real CUDA depth. "I have used PyTorch" is not enough. Nvidia hires engineers who can read and write CUDA at the kernel level. If your background is application-layer ML, the AI infrastructure team is not a fit; consider AI Enterprise / NeMo platform instead.',
        'Generic ML systems takes. "I would use PyTorch DDP" is not enough. Nvidia expects you to reason about NCCL communication patterns, NVLink bandwidth utilisation, and tensor parallelism across the GPU memory hierarchy.',
        'Underestimating hardware-software co-design. Nvidia\'s moat is the tight CUDA + hardware integration. Stories that frame "we just used the framework" miss the company\'s thesis. Calibrated stories surface where you optimised across the abstraction boundary.',
        'No competitive landscape opinion. Nvidia has real competition in 2026 (AMD MI300X, Google TPU v5e, Cerebras WSE-3, Groq LPU). Coming in without an opinion on where each is right and where Nvidia\'s moat is durable signals you have not done the homework.',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Nvidia developer blog (developer.nvidia.com/blog). Pick three opinions on Blackwell / NIM / NeMo direction.',
        '15-35 min: CUDA refresher. Implement a simple reduce kernel from scratch. Implement matrix multiplication with shared memory tiling. If you cannot do these in 20 minutes, the gap is too wide for tomorrow\'s loop.',
        '35-55 min: System design. Pick one of -- Llama-3 70B inference serving on DGX, all-reduce optimisation across NVLink, multi-tenant DGX cluster scheduling. Write a one-page memo with explicit memory-hierarchy reasoning.',
        '55-70 min: Stack drill. CUDA streams + events, NCCL primitives, Triton (the Nvidia compiler / IR), TensorRT, NIM (Nvidia Inference Microservices), NeMo training framework. Two minutes per concept.',
        '70-78 min: Competitive landscape audit. Read the most recent Nvidia earnings call summary. Read the most recent AMD MI300X or Google TPU v5e announcement. Articulate where each is right and where each fails.',
        '78-83 min: Story drill. Three stories tied to systems-performance optimisation. 200 words each.',
        '83-85 min: Close. One opinion on Blackwell + the competitive landscape, one specific Nvidia decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Nvidia remote in 2026?' },
      { type: 'p', text: 'Hybrid for engineering. Santa Clara CA, Tel Aviv, Cambridge UK, Helsinki, Bangalore major hubs. 3 days a week in office for most engineering since 2024 RTO. Some staff+ remote, but rare.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of FAANG by total comp post-2024 stock appreciation. Cash competitive with FAANG mid-tier. RSU is the multiplier — engineers who joined pre-2023 are sitting on substantial gains. Newer joiners get smaller initial RSU at higher strike but with more upside if NVDA continues to grow.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in major hubs. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including hardware-software co-design shops like Nvidia. Free at aimvantage.uk.' },

      { type: 'p', text: 'Nvidia hires engineers with real CUDA / GPU-systems depth, comfort with hardware-software co-design, and calibrated takes on the competitive landscape. Prep the kernel-level CUDA, the memory hierarchy, and the AMD / TPU competitive context.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) ARM SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'arm-software-engineer-interview-2026',
    title: 'Arm software engineer interview: the post-IPO 2026 loop',
    description: 'The Arm software engineer interview in 2026 -- five stages, the post-IPO + AI-pivot context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Arm', 'ARM Holdings', 'Software Engineer Interview', 'Chip Design', 'CPU Architecture', 'Cambridge UK', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Arm IPO\'d in 2023 and pivoted hard into AI / data-centre. The 2026 software engineer loop tests for embedded / systems / compiler depth + comfort with the SoftBank-majority shareholder context.',
    hook: 'Arm is the UK\'s biggest tech engineering employer most people forget. Cambridge HQ, post-IPO momentum, AI-pivot + Cortex-X CPU architecture loop most candidates underestimate.',
    sections: [
      { type: 'p', text: 'Arm Holdings (NASDAQ: ARM) IPO\'d in September 2023 and has pivoted hard into AI and data-centre licensing. Cambridge UK is the engineering HQ; Austin, San Jose, Bangalore are major satellites. The team is 6,000+ engineers across CPU architecture (Cortex-X, Cortex-A, Cortex-M), Neoverse data-centre cores, AI accelerators (Ethos NPU), system IP (NIC-450 / NoC-450), software (Compute Library, Mali GPU drivers), and the new AI ecosystem org. The 2026 hiring bar is high but specific: comfort with embedded / systems / compiler depth, comfort with the licensing-business model, and a calibrated take on the AI-pivot + Apple silicon impact.' },

      { type: 'h2', text: 'The Arm SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why Arm, why this team (CPU architecture vs software vs AI accelerator). They will probe Cambridge / Austin relocation willingness if applicable.',
        'Online assessment -- 90 minutes. Two coding problems (C / C++ for hardware-adjacent teams; Python / Java for software / tools).',
        'Phone screen -- 60 minutes. Live coding + architecture questions. For CPU architecture team: pipeline / cache / branch-predictor reasoning. For software team: compiler / driver / library questions.',
        'Onsite -- 4 rounds, 60 minutes each: 2x technical depth (specific to team), 1x system design, 1x behavioural.',
        'Hiring manager + skip-level. Arm has more formal hiring ceremony than most tech, less than Goldman Sachs.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through Cortex-X4\'s out-of-order execution pipeline. Where would you optimise for AI inference workloads?"',
        '"Code: implement an LRU cache in C. Now extend it for a 2-way set-associative L1 simulator."',
        '"Walk me through how the Compute Library accelerates a transformer inference on a Cortex-X CPU. Where does it fall short vs a dedicated NPU?"',
        '"Design the data-centre Neoverse V3 inference serving for a 70B-parameter LLM. Where does Arm win vs x86? Where does it lose?"',
        '"You disagree with a senior engineer on whether to optimise the Mali GPU driver for raw FPS or for power efficiency on a smartphone benchmark. Argue your side."',
        '"What is your real opinion on Apple silicon\'s impact on Arm\'s licensing business?"',
        '"Walk me through the most subtle bug you have hit in low-level systems."',
        '"Tell me about a time you owned a performance optimisation across a hardware-software boundary."',
        '"Why Arm and not [Intel / AMD / Nvidia / RISC-V vendor]?"',
        '"How does Arm\'s licensing model affect engineering trade-offs that would be different at a vertically-integrated chipmaker?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Arm specifically' },
      { type: 'ol', items: [
        'No CPU architecture / embedded depth. Arm hires engineers who can reason about pipelines, caches, branch predictors, memory ordering (TSO / weak), or compiler optimisations. Application-layer-only backgrounds are filtered for the architecture / systems IP teams.',
        'Underestimating the licensing-business context. Arm doesn\'t make chips; they license IP. This shapes every engineering trade-off (we optimise for the partner\'s use case, not for our own product). Stories that miss this miss the company.',
        'No opinion on Apple silicon. Apple\'s in-house Arm-based silicon was the single biggest competitive threat to Arm\'s licensing business in the last 5 years. Coming without an opinion = you have not done the homework.',
        'Generic FAANG-style stories. Arm is closer to Nvidia / Intel in operating tempo than to Google / Meta. Stories framed around "we shipped fast at a startup" land badly. Frame for hardware-software co-design with multi-year design cycles.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Arm developer hub (developer.arm.com) + the most recent Cortex-X / Neoverse announcement. Pick three opinions on the AI / data-centre pivot.',
        '15-35 min: Stack drill specific to your target team. CPU architecture: pipeline + cache + branch-predictor concepts. Compiler / Compute Library: SIMD intrinsics + LLVM passes. AI accelerator: NPU programming + dataflow architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Neoverse V3 data-centre inference serving, Cortex-X power vs performance trade-off, Mali GPU driver optimisation. Write a one-page memo with explicit hardware-software co-design reasoning.',
        '55-70 min: Story drill. Three stories with hardware-software boundary framing. 200 words each.',
        '70-78 min: Competitive landscape audit. Read on Apple silicon impact, RISC-V momentum, x86 vs Arm in data-centre. Articulate where Arm is durable and where exposed.',
        '78-80 min: Close. One opinion on Apple silicon, one specific Arm engineering decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Arm remote in 2026?' },
      { type: 'p', text: 'Hybrid. Cambridge UK is the engineering HQ; Austin TX, San Jose CA, Bangalore India major satellites. 3 days a week in office for most engineering since 2024 RTO. Some staff+ remote within Europe.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of UK tech market. Cambridge base salaries below SF FAANG (~30-40% gap) but cost of living also lower. RSU meaningful at the post-IPO trajectory.' },
      { type: 'h3', text: 'Will they sponsor a UK visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Cambridge is one of the easier UK hubs to relocate to (smaller city, established expat community).' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including UK chip design like Arm. Free at aimvantage.uk.' },

      { type: 'p', text: 'Arm hires engineers with real systems / embedded / compiler depth, comfort with the licensing-business model, and calibrated takes on Apple silicon + RISC-V. Prep the architecture stack, the licensing context, and a real opinion on the post-IPO trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) TIKTOK / BYTEDANCE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'tiktok-bytedance-software-engineer-interview-2026',
    title: 'TikTok / ByteDance software engineer interview: the post-divestiture 2026 loop',
    description: 'The TikTok / ByteDance software engineer interview in 2026 -- five stages, the post-divestiture context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['TikTok', 'ByteDance', 'Software Engineer Interview', 'Recommendation Systems', 'Social', 'ML Platform', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'TikTok / ByteDance hire aggressively despite the regulatory chaos. The 2026 loop tests for recommendation-systems depth + comfort with the post-divestiture US context + extreme ship velocity.',
    hook: 'TikTok\'s recommendation engine is one of the most studied algorithms in technology. The interview tests for whether you can reason about it AND ship under the unique post-divestiture US regulatory pressure.',
    sections: [
      { type: 'p', text: 'ByteDance is private and operates TikTok, Douyin, CapCut, Lemon8, Lark, and a global engineering organisation of 50,000+ across Beijing, Shanghai, Singapore, London, Dublin, San Jose, and Seattle. The 2026 hiring climate is unique: aggressive hiring globally despite the US regulatory pressure (the Sword of Damocles around forced divestiture). The bar is high but specific: recommendation-systems depth, comfort with extreme ship velocity (ByteDance famously ships AB-tested features within hours, not weeks), and a calibrated take on the regulatory context.' },

      { type: 'h2', text: 'The TikTok / ByteDance SWE process -- 5 stages, ~3-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why ByteDance, why this team. They will probe whether you have used TikTok seriously and have an opinion on the recommendation algorithm.',
        'HireVue / online assessment -- 60 minutes async. Two coding problems (Java / Python / Go flavoured).',
        'Phone screen -- 60-90 minutes. Live coding + system design. ByteDance interviewers are direct, fast, and ask follow-ups aggressively. Hesitation gets penalised.',
        'Onsite -- 4-5 rounds: 2x coding, 1-2x system design, 1x behavioural / cross-functional.',
        'System design always recommendation-shaped -- "design the For You feed for 1B daily users with sub-50ms p99". Real-time + ML + scale.',
      ] },
      { type: 'p', text: 'ByteDance moves fast on offers (3-5 weeks total) when they like a candidate; very fast on rejections (2-3 days of silence after onsite means no).' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how TikTok\'s For You feed ranks 100M+ creators against a single user\'s implicit signals."',
        '"Design the For You feed at 1B daily users, p99 under 50ms for the first batch of recommendations after app open."',
        '"Code: implement a sliding-window top-k counter for trending hashtag detection on a stream of 10M events/sec."',
        '"You inherit a recommendation model that has 0.1% lift from baseline in offline metrics but -0.3% in online A/B test. First three things you investigate?"',
        '"Walk me through the cold-start problem for a brand-new user with no implicit signals. What is the first 10 videos they should see?"',
        '"You disagree with a senior engineer on whether to ship a recommendation feature behind a feature flag or as a 1% rollout. Argue your side for 5 minutes."',
        '"What is your real opinion on the post-divestiture US regulatory landscape? Where is ByteDance preparing well? Where is it under-preparing?"',
        '"Tell me about a time you shipped something fast that broke something else. What did the postmortem look like?"',
        '"Why TikTok and not [Instagram Reels / YouTube Shorts / Snapchat Spotlight]?"',
        '"How would you reduce the latency of the For You feed by 30% without degrading recommendation quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at TikTok / ByteDance specifically' },
      { type: 'ol', items: [
        'No recommendation-systems depth. ByteDance is a recommendation company first, content company second. If your stories don\'t demonstrate two-tower retrieval, ranking, exploration / exploitation, or implicit-feedback model reasoning, the system design round goes shallow.',
        'Slow ship-tempo stories. ByteDance ships A/B tests within hours. Stories framed for "we shipped over 6 months across 12 teams" land badly. Frame stories around extreme velocity.',
        'Ducking the regulatory question. The post-divestiture US context is real. Coming in pretending it doesn\'t exist signals naivety. Calibrated take: "The regulatory pressure shapes which engineering bets ByteDance can make in US infrastructure; I would not place big bets on US-based data primitives until clarity emerges."',
        'Not using TikTok seriously. ByteDance hires engineers who use the product. If you cannot articulate three things you would change about the For You feed, the recruiter screen ends fast.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use TikTok for 15 minutes. Note three friction points + three things you respect about the recommendation flow.',
        '15-35 min: Stack drill. Two-tower retrieval architecture, multi-stage ranking pipelines, exploration-vs-exploitation trade-offs, real-time feature stores, online learning vs batch retraining. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- For You feed at 1B users, sliding-window trending hashtag detection, cold-start for new users. Write a one-page memo with extreme-velocity + scale reasoning.',
        '55-70 min: Story drill. Three stories with extreme-ship-tempo framing. 200 words each.',
        '70-78 min: Regulatory + competitive audit. Read on the post-divestiture US framework. Read on Instagram Reels + YouTube Shorts competitive position. Articulate where each is right.',
        '78-80 min: Close. One opinion on the regulatory landscape, one specific TikTok decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is TikTok remote in 2026?' },
      { type: 'p', text: 'Hybrid. Singapore, London, Dublin, San Jose, Seattle for global teams; Beijing + Shanghai for China-side engineering. 3-5 days a week in office depending on team. Some staff+ remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of FAANG-equivalent for senior+ engineers. Cash + cash-bonus heavy structure (less RSU than FAANG since ByteDance is private). London base lags San Jose by ~25%.' },
      { type: 'h3', text: 'What about the divestiture risk?' },
      { type: 'p', text: 'For US-based hiring this is a real consideration. ByteDance has so far hired through the regulatory uncertainty; for senior+ candidates considering an offer, the right framing is "what happens to my role if a forced-divestiture deal closes?". Recruiters will be direct if you ask.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including extreme-velocity shops like ByteDance. Free at aimvantage.uk.' },

      { type: 'p', text: 'TikTok / ByteDance hires engineers who can reason about recommendation systems at extreme scale, ship at 3x normal velocity, and engage honestly with the regulatory context. Prep the recommendation stack, the velocity register, and a calibrated take on the post-divestiture landscape.' },
    ],
  },
];
