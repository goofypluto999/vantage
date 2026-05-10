// 3 AI-lab interview-guide posts -- batch 10, drafted 2026-05-10
// Mistral / xAI / Perplexity. Hot 2026 hiring with massive search volume.

import type { BlogPost } from './blogPosts';

export const newBlogPosts10: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) MISTRAL AI ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'mistral-ai-engineer-interview-2026',
    title: 'Mistral AI engineer interview: the European-AI 2026 loop',
    description: 'The Mistral AI engineer interview in 2026 -- five stages, the European-AI strategic context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Mistral', 'AI Engineer Interview', 'Open Weights', 'Paris', 'Interview Prep', 'AI Hiring', 'Tech Hiring'],
    excerpt: 'Mistral AI is the European AI lab pushing both open-weight and frontier closed models. The engineer loop tests for whether you can reason about open vs closed strategy and frontier model training depth.',
    hook: 'Mistral hires engineers who can argue both sides of the open-weights vs closed-weights debate. Pick a side too early and the cultural round ends fast.',
    sections: [
      { type: 'p', text: 'Mistral AI is private, Paris-based, and shipping both open-weight (Mistral Small / Medium / Large open) and frontier closed models (Mistral Large 2026, Codestral). The engineering team is hiring across model training, inference infrastructure, alignment, and platform / API. The bar in 2026 is high but the cultural register is distinct: Mistral pushes a sovereign-European-AI thesis hard, and hires engineers who can engage with it without sounding either reflexively pro-open or reflexively pro-closed.' },

      { type: 'h2', text: 'The Mistral engineer process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Mistral, why this team. They will probe your view on the open-weight vs closed-weight strategic split.',
        'Technical screen -- 60 minutes. Live coding. Often involves reading or extending transformers / vLLM / sglang code; sometimes a Triton kernel slice for the inference team.',
        'System design -- 60 minutes. Real Mistral-shaped scenarios. "Design the inference serving layer for Mistral Large at 100K QPS." "Walk me through how you would distill a 70B model to a 7B for edge deployment." "Design the training pipeline for a multilingual fine-tune across 25 European languages."',
        'Research / depth round -- 60 minutes. Architecture discussion. Mixture-of-experts trade-offs, attention-mechanism variants, RLHF vs DPO trade-offs, evaluation methodology.',
        'Onsite or final loop -- 3 rounds: deeper technical, behavioural / values, plus a leadership round (often Arthur, Guillaume, or Timothée).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through the open-weight vs closed-weight strategic split. Where do you think Mistral is right? Where would you change the line?"',
        '"Design Mistral Large inference serving at 100K QPS, p99 under 100ms with model swap support."',
        '"You disagree with a senior researcher on whether to use DPO or PPO for the next reasoning fine-tune. Argue your side for 5 minutes."',
        '"Walk me through how you would distill a 70B model to a 7B for edge deployment. Numbers and trade-offs."',
        '"Pick a recent open-weights release (DBRX, Llama 4, Qwen, or our own). Tell me what is wrong with the architecture or training recipe."',
        '"What is your real opinion on European AI sovereignty? Is it strategy or marketing?"',
        '"Tell me about the most subtle bug you have hit in transformers, vLLM, or any open-source LLM library in the last 6 months."',
        '"You inherit a training run that is converging slower than expected. First three things you investigate?"',
        '"Why Mistral and not Anthropic, OpenAI, DeepMind, or Hugging Face?"',
        '"What is the smallest training-systems improvement you have shipped that you are most proud of?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Mistral specifically' },
      { type: 'ol', items: [
        'No real engagement with the open vs closed debate. Mistral has shipped both. "Open is the future" or "closed is the future" are both the wrong answer. The right answer reasons about the specific markets, capabilities, and cost trade-offs that justify each. "I would close the next reasoning frontier model but keep the multilingual base open because the European-language fine-tuning market is too distributed to capture with a closed API" is calibrated.',
        'Generic transformer takes. "Attention is all you need" is not enough. "The way Mistral implements grouped-query attention with shared K/V across head groups specifically reduces KV-cache memory by Y at the cost of Z capability degradation" is the register.',
        'Underestimating French-tech-scene context. Mistral is one of the few European tech companies with a real shot at frontier AI. Stories that sound like generic SF startup stories without engagement with the European-AI strategic context get flagged.',
        'Missing the alignment register. Mistral has shipped specific alignment work in 2025-26. If your answers default to "we will figure out alignment later," you signal you are misaligned with the team.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent two posts on mistral.ai/news. Note three opinions you have on the strategic positioning.',
        '15-35 min: Stack drill. Mistral architecture details (grouped-query attention, mixture-of-experts variants), vLLM internals, sglang serving, Codestral / multilingual fine-tunes. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- inference serving with model swap, distillation pipeline, multilingual training pipeline. Write a one-page memo.',
        '55-70 min: Story drill. Three stories tied to ML systems work. 200 words each.',
        '70-78 min: Open vs closed audit. Argue Mistral\'s open-weights side. Argue Anthropic\'s closed-only side. Then commit.',
        '78-80 min: Close. One opinion on European AI, one specific Mistral decision you would change, one question for the founder.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Mistral remote in 2026?' },
      { type: 'p', text: 'Hybrid. Paris HQ, with smaller hubs in London and SF. Some senior+ roles open to remote within EU timezones. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-EU-market for AI. Below US frontier-lab cash. Equity meaningful at the post-2024 valuation.' },
      { type: 'h3', text: 'Do they hire international engineers?' },
      { type: 'p', text: 'Yes for senior+ roles, especially in Paris and London. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including European AI labs like Mistral. Free at aimvantage.uk.' },

      { type: 'p', text: 'Mistral hires engineers who engage with the open vs closed debate, hold a real position on European AI, and can reason about training and inference at frontier scale. Prep the strategic context, the architecture details, and a calibrated take on where the open-weights line should sit.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) xAI ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'xai-engineer-interview-2026',
    title: 'xAI engineer interview: the Grok-era 2026 loop',
    description: 'The xAI engineer interview in 2026 -- four stages, the move-fast operating tempo, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['xAI', 'Grok', 'Engineer Interview', 'AI Hiring', 'Frontier Models', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'xAI ships at a pace that feels reckless from the outside and disciplined from the inside. The engineer loop is short, brutal, and filters hard for whether you can ship at the team\'s actual operating tempo.',
    hook: 'xAI ships frontier models at a tempo most labs would call reckless. The interview is built specifically to filter that signal in or out. Most candidates fail the same trap.',
    sections: [
      { type: 'p', text: 'xAI is private, well-funded, and has shipped Grok 4 and Grok 4 Heavy in 2024-25 alongside Colossus, the supercomputer in Memphis. The engineering team is small relative to the compute budget and ships fast. The bar is high but specific: can you operate at the actual team tempo (which most candidates underestimate by 3-4x), without losing technical rigour? "Fast" at xAI means days from idea to running training job, not weeks.' },

      { type: 'h2', text: 'The xAI engineer process -- 4 stages, ~2-3 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why xAI, why now. They will probe whether you have used Grok seriously and have an opinion on the model.',
        'Technical screen -- 60 minutes. Live coding. Often hard problems with real systems trade-offs -- distributed training primitives, inference serving, custom kernels.',
        'System design -- 60 minutes. Real xAI-shaped scenarios. "Design Grok inference serving at 1M QPS." "Walk me through how Colossus schedules 100K H200s for a multi-week training run." "How would you reduce the inter-node communication overhead for an MoE training run?"',
        'Onsite or final loop -- 3-4 rounds: deeper technical, founder / culture (often Elon or a senior eng), plus a values alignment round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through the most ambitious thing you have shipped solo. From idea to production. With dates."',
        '"Design Grok inference serving at 1M QPS, sub-100ms p99. Walk me through the architecture."',
        '"How would you reduce the inter-node communication overhead for a 70B MoE training run on 16K H200s?"',
        '"You disagree with a senior engineer on whether to ship a Grok feature in the next stable release or hold for the next major version. Argue your side."',
        '"Pick a recent Grok output that you think was wrong or harmful. Walk me through the training-time intervention you would make to prevent it."',
        '"Tell me about a time you shipped something in 2-3 days that a normal team would have shipped in 6 weeks. What did you cut?"',
        '"Walk me through the most subtle bug you have hit in a distributed training framework."',
        '"Why xAI and not Anthropic, OpenAI, DeepMind, or Mistral?"',
        '"What is your real opinion on the alignment direction? Where is xAI right? Where is Anthropic right?"',
        '"What is the smallest infrastructure improvement you have shipped that had outsized impact?"',
      ] },

      { type: 'h2', text: 'What kills candidates at xAI specifically' },
      { type: 'ol', items: [
        'Underestimating the operating tempo. xAI ships training runs in days. Stories about how you owned scope through a 6-week design review do not land. Stories about how you shipped end-to-end in a weekend with one collaborator do.',
        'Generic alignment takes. xAI has a specific alignment posture. "Safety is important" is not an answer. "I would not let Grok refuse to discuss historical atrocities even with strong content warnings because the false-positive cost on educational use is too high" is calibrated.',
        'No distributed training depth. If your background is application-layer engineering with no real distributed training experience, the system design round will go badly fast. xAI hires for systems depth.',
        'Missing the Elon factor. The founders round (especially when Elon is in it) rewards direct disagreement, opinions stated crisply, and willingness to commit to a specific recommendation. Polish reads as evasion.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Grok seriously on a real task. Note three friction points and three things you respect.',
        '15-35 min: Stack drill. Distributed training primitives (FSDP, tensor parallelism, pipeline parallelism, ZeRO), MoE routing, NVLink/NVSwitch topology, KV-cache management, vLLM internals. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- inference serving at scale, MoE training communication overhead, Colossus-scale scheduling. Write a one-page memo.',
        '55-70 min: Story drill. Three stories where you shipped fast without losing rigour. 200 words each.',
        '70-78 min: Alignment audit. Read xAI\'s public alignment material. Read Anthropic\'s. Articulate where each is right.',
        '78-80 min: Close. One opinion on Grok direction, one specific xAI decision you would change, one question for the founder.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is xAI remote in 2026?' },
      { type: 'p', text: 'Mostly in-person. SF Bay Area, Memphis (Colossus), and Austin. Some senior+ remote roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market. Equity meaningful at the post-2024 valuation. Cash competitive with frontier labs.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ engineering roles. Confirm specifics at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including high-tempo frontier labs like xAI. Free at aimvantage.uk.' },

      { type: 'p', text: 'xAI hires engineers who can ship at frontier-lab speed without losing rigour, hold a calibrated alignment opinion, and survive the founders round by being direct. Prep the systems depth, the operating-tempo stories, and the alignment register.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) PERPLEXITY ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'perplexity-engineer-interview-2026',
    title: 'Perplexity engineer interview: the AI-search 2026 loop',
    description: 'The Perplexity engineer interview in 2026 -- five stages, the search-meets-LLM product depth filter, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Perplexity', 'Engineer Interview', 'AI Search', 'RAG', 'Interview Prep', 'AI Hiring', 'Tech Hiring'],
    excerpt: 'Perplexity is the AI-search company that has gone from research to one of the most-used AI products in 2026. The engineer loop tests for one specific signal: can you reason about both retrieval and generation in the same conversation?',
    hook: 'Perplexity engineers have to argue both sides of the retrieval-vs-generation trade-off convincingly. Pick one and the round ends shallow.',
    sections: [
      { type: 'p', text: 'Perplexity is private, well-funded, and has gone from research preview in 2022 to one of the most-used AI products in 2026. The engineering team is small relative to growth and hires constantly across search, models, infrastructure, browser, and product. The single biggest filter: can you reason about retrieval and generation as one coupled system, not two separate concerns? Most candidates default to one or the other. Perplexity engineers default to both, simultaneously.' },

      { type: 'h2', text: 'The Perplexity engineer process -- 5 stages, ~3-4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Perplexity, how you have used the product. They will probe specifically -- which features, which model selections, which threading patterns.',
        'Technical screen -- 60 minutes. Live coding. Often involves retrieval primitives, ranking algorithms, or model-output post-processing.',
        'System design -- 60 minutes. Real Perplexity-shaped scenarios. "Design the search-and-answer pipeline at 1M QPS." "How would you reduce time-to-first-token for the answer stream?" "Walk me through how the threading model handles a 50-message research conversation."',
        'Product / craft round -- 60 minutes. Open Perplexity. Walk through it. Argue what is broken. Defend your priorities.',
        'Onsite or final loop -- 2-3 rounds: deeper technical, behavioural / values, plus a leadership round (often Aravind or a senior eng).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Open Perplexity right now. Run a real search. Tell me three things you would change about the answer flow."',
        '"Design the search-and-answer pipeline at 1M QPS, p99 time-to-first-token under 1 second."',
        '"Walk me through the retrieval-vs-generation trade-off for a query like \'best laptops in 2026 for video editing\'. Where does retrieval win? Where does generation win?"',
        '"You disagree with a senior engineer on whether to ship a UI feature behind a flag or as a default. Argue your side for 5 minutes."',
        '"How would you reduce time-to-first-token for the answer stream by 30% without degrading answer quality?"',
        '"Pick a recent Perplexity answer that you think was wrong or unhelpful. Walk me through the engineering intervention you would make."',
        '"Tell me about the most subtle bug you have hit in a retrieval or RAG system."',
        '"Why Perplexity and not Google, OpenAI ChatGPT, or You.com?"',
        '"What is your real opinion on AI search vs traditional search? Where is Perplexity right?"',
        '"What is the smallest infrastructure improvement you have shipped that had outsized impact?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Perplexity specifically' },
      { type: 'ol', items: [
        'Defaulting to one side of the retrieval-vs-generation split. Most candidates open with "we should have a better retriever" or "we should have a better LLM." Both are wrong as starting points. Perplexity engineers default to the joint optimisation -- retrieval quality, model selection, prompt design, and ranking are one system.',
        'No real product opinion. Perplexity hires people who use the product seriously. If your last serious Perplexity session was 2 months ago, the recruiter screen ends fast.',
        'Generic latency takes. Perplexity is brutal on latency budgets. "I would add caching" is not enough. "I would warm the model server with the top 100 query embeddings every 30s, route to the closest cache node based on user-region, and accept a 4% tail-latency hit on cold queries" is calibrated.',
        'Missing the threading / conversation register. Perplexity\'s threading model is core to the product. If you cannot reason about how a 50-message research conversation should retrieve, summarise, and persist context, the round goes shallow.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Perplexity. Run three real research queries. Use threads. Note three friction points and three things you respect.',
        '15-35 min: Stack drill. Retrieval primitives (BM25, dense embeddings, hybrid), ranking algorithms, RAG patterns, reranker architectures, time-to-first-token optimisation. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- search-and-answer pipeline, threading model, time-to-first-token optimisation. Write a one-page memo.',
        '55-70 min: Story drill. Three engineering stories tied to retrieval / generation systems. 200 words each.',
        '70-78 min: Competitor audit. Run the same query on Perplexity, ChatGPT search, Google AI Overviews. Articulate the joint optimisation each gets right.',
        '78-80 min: Close. One opinion on AI search, one specific Perplexity decision you would change, one question for the founder.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Perplexity remote in 2026?' },
      { type: 'p', text: 'Mostly SF, with some senior+ remote roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for the stage. Equity meaningful at the post-2024 valuation. Cash competitive with senior FAANG.' },
      { type: 'h3', text: 'Do they hire internationally?' },
      { type: 'p', text: 'Selectively for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AI-search companies like Perplexity where the JD undersells how integrated retrieval and generation reasoning needs to be. Free at aimvantage.uk.' },

      { type: 'p', text: 'Perplexity hires engineers who reason about retrieval and generation as one system, hold a real product opinion, and ship under brutal latency budgets. Prep the joint optimisation register, the product depth, and a calibrated take on AI search.' },
    ],
  },
];
