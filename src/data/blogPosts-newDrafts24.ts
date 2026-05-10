// 3 more interview-guide posts -- batch 24 (AI labs + data infra)
// OpenAI, Anthropic, Databricks.

import type { BlogPost } from './blogPosts';

export const newBlogPosts24: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) OPENAI SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'openai-software-engineer-interview-2026',
    title: 'OpenAI software engineer interview: the post-GPT-5 + Agents 2026 loop',
    description: 'The OpenAI software engineer interview in 2026 -- five stages, the post-GPT-5 + Agents SDK + reasoning-model + Sora-2 context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['OpenAI', 'Software Engineer Interview', 'AI', 'LLM', 'Agents', 'Inference', 'Interview Prep'],
    excerpt: 'OpenAI shipped GPT-5, the Agents SDK, the reasoning-model (o-series) frontier, and Sora-2. The 2026 engineer loop is high-bar and filters for ML-systems + inference-economics + the safety register.',
    hook: 'OpenAI is the most-asked-about company in tech in 2026. The interview filters for engineers who can ship inference at planetary scale + reason about model + safety trade-offs simultaneously.',
    sections: [
      { type: 'p', text: 'OpenAI shipped GPT-5 (the unified model family, late 2024 / 2025), the Agents SDK (the open-source successor to Assistants API), the reasoning model (o-series) frontier, Sora-2 (next-gen video), Operator (the consumer agent), and the deepening ChatGPT / API / Enterprise / Government surfaces. The 2026 engineering team is hiring across the ChatGPT product (the consumer surface + memory + canvas), the API + Agents platform, inference infrastructure (Stargate buildout + the model-serving + KV-cache + speculative-decoding stack), training infrastructure (the post-training + RLHF + safety stack), research (model + tools + safety teams), and the new product surfaces (Operator, Sora, voice). The 2026 hiring bar is exceptional and specific: ML-systems depth, comfort with inference-economics, a real take on the safety / commercial-product tension.' },

      { type: 'h2', text: 'The OpenAI SWE process -- 5-6 stages, ~6-8 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why OpenAI, why this team. They will probe whether you have a real take on the safety / commercial trajectory.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-GPT-5 register. Expect deep technical follow-ups.',
        'Technical screen -- 60 minutes. Live coding (Python primarily). Moderate-to-hard problem, often with an ML-systems angle.',
        'System design -- 60-90 minutes. Real OpenAI-shaped scenarios. "Design GPT-5 inference for 1B daily API calls with p99 under 5s." "Walk me through KV-cache management for a long-context (1M+ token) request." "Design the Agents SDK runtime where tool-calls have unbounded latency."',
        'Onsite or final loop -- 4-5 rounds: deeper coding, deeper system design, ML-systems specific (training infra or inference depending on team), behavioural + safety register, plus a leadership / vision round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a ChatGPT user submits a query that requires the model to think for 30 seconds + call a tool. Trace it from API entry to streamed response."',
        '"Design GPT-5 inference for 1B daily API calls. p99 under 5s. Cost predictability matters."',
        '"How does KV-cache management work for a 1M-token context window? Walk me through eviction + sharing across requests."',
        '"Design the Agents SDK runtime. Tools have unbounded latency. The user wants streamed reasoning + tool-call traces. What is the architecture?"',
        '"You inherit an inference optimisation that reduces cost by 30% but introduces a 2% regression in response quality on the eval. First three actions?"',
        '"You disagree with a senior researcher on whether to ship a new reasoning model before a specific safety-eval threshold is met. Argue your side."',
        '"What is your real opinion on the open-weight vs closed-weight strategy? Where is OpenAI right? Where does it leave value on the table?"',
        '"Walk me through the most subtle bug you have hit in distributed-training or inference-serving systems."',
        '"Why OpenAI and not [Anthropic / Google / Meta / Mistral / xAI]?"',
        '"How would you reduce inference latency for the o-series reasoning model by 30% without degrading reasoning quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at OpenAI specifically' },
      { type: 'ol', items: [
        'No ML-systems reasoning. OpenAI is structurally an ML-systems + research company. Stories that miss the inference / training stack miss the role. Knowing roughly how transformers serve, KV-cache works, speculative decoding works, MoE routing works matters.',
        'Generic LLM-app answers. "I would use the OpenAI API" is the wrong register at OpenAI. Stories should be at the layer-below -- how to make inference cheaper, faster, or higher-quality at the systems level.',
        'No opinion on the safety / commercial tension. OpenAI ships frontier models with a stated safety mission + a fast commercial product. Stories that ignore this miss the actual operating reality. Calibrated take expected.',
        'Tone-deaf on the 2023-25 governance + non-profit + for-profit context. The "board crisis", the Anthropic split, the Sutskever / SSI departure, and the for-profit pivot shape the register. Stories that ignore this signal you have not done the homework.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use ChatGPT-5 + the API + the Agents SDK briefly. Note three things about latency, cost, the reasoning UX.',
        '15-40 min: Stack drill. Transformer inference, KV-cache architecture, speculative decoding, MoE routing, training stack (RLHF + DPO + RLAIF), safety eval architecture. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- GPT-5 inference at 1B daily, KV-cache for 1M context, Agents SDK runtime. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with ML-systems + safety framing. 200 words each.',
        '80-87 min: Read on OpenAI vs Anthropic vs Google. Articulate where OpenAI wins (frontier scale, ChatGPT distribution, agentic stack) vs where competitors win.',
        '87-90 min: Close. One opinion on open-weight strategy, one specific OpenAI decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is OpenAI remote in 2026?' },
      { type: 'p', text: 'Mostly in-office (SF + NYC + Seattle + London + Dublin + Tokyo). Some senior+ remote exceptions. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of frontier-AI-lab band. Cash + PPU (Profit Participation Units, the OpenAI equity-equivalent) tracking the latest tender-offer valuation. Total comp matches or exceeds FAANG SWE comp at senior+ levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including frontier-AI labs like OpenAI. Free at aimvantage.uk.' },

      { type: 'p', text: 'OpenAI hires engineers who can reason about ML systems at frontier scale, navigate the safety + commercial-product register, and engage with the open-weight vs closed-weight strategy honestly. Prep the inference stack, the Agents SDK, and a calibrated take on the governance trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) ANTHROPIC SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'anthropic-software-engineer-interview-2026',
    title: 'Anthropic software engineer interview: the post-Claude-4 + Computer-Use 2026 loop',
    description: 'The Anthropic software engineer interview in 2026 -- five stages, the post-Claude-4 + Computer Use + MCP + Constitutional AI context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Anthropic', 'Software Engineer Interview', 'AI Safety', 'Claude', 'MCP', 'Computer Use', 'Interview Prep'],
    excerpt: 'Anthropic shipped Claude 4 (Opus + Sonnet + Haiku), Computer Use, the Model Context Protocol (MCP), and Claude Code. The 2026 engineer loop tests for safety-aware ML-systems depth + the responsible-scaling-policy register.',
    hook: 'Anthropic is the AI lab that put "safety" in the company mission and is shipping frontier models anyway. The 2026 interview filters for engineers who can hold the tension.',
    sections: [
      { type: 'p', text: 'Anthropic (private, ~$60B+ valuation) shipped Claude 4 (the Opus + Sonnet + Haiku family), Computer Use (the API-level + Claude-controls-the-screen capability), the Model Context Protocol (MCP -- the open-source connector standard), Claude Code (the CLI + IDE-integrated coding agent), and the deepening Bedrock + Vertex + first-party API surface. The 2026 engineering team is hiring across the Claude product (the consumer + API + Claude.ai surfaces), inference infrastructure (the model-serving + KV-cache + multi-region stack on AWS Trainium / Inferentia + GCP TPU), training infrastructure (the post-training + Constitutional AI + RLAIF stack), research (alignment + interpretability + scaling), Claude Code (the CLI + agentic coding surface), and the MCP ecosystem. The 2026 hiring bar is exceptional and specific: safety-aware ML-systems depth, comfort with the Responsible Scaling Policy register, a real take on the Constitutional AI approach.' },

      { type: 'h2', text: 'The Anthropic SWE process -- 5-6 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Anthropic specifically (the safety mission matters here), why this team.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-Claude-4 register. Expect deep technical follow-ups.',
        'Technical screen -- 60 minutes. Live coding (Python primarily; Rust / Go on some teams). Moderate-to-hard problem.',
        'System design -- 60-90 minutes. Real Anthropic-shaped scenarios. "Design Claude inference for the multi-region Bedrock / Vertex / first-party-API split." "Walk me through MCP architecture + the security model for arbitrary connectors." "Design Computer Use safely -- Claude is taking actions on the user\'s machine. Walk me through the trust boundary."',
        'Onsite or final loop -- 4-5 rounds: deeper coding, deeper system design, ML-systems or interpretability or alignment depending on team, behavioural / safety, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Claude.ai user submits a long-context (200K-token) request. Trace it from prompt entry to streamed response."',
        '"Design Claude inference for the multi-region Bedrock + Vertex + first-party-API split. How do you handle model-version-skew + routing + cost?"',
        '"Walk me through MCP architecture. Walk me through the security model for arbitrary connectors that can take actions in user systems."',
        '"Design Computer Use safely. Claude is taking actions on the user\'s machine. Walk me through the trust boundary + the human-in-the-loop architecture."',
        '"You inherit a training run that improves capabilities by 8% on the public eval but trips a Responsible Scaling Policy threshold. First three actions?"',
        '"You disagree with a senior researcher on whether to ship a new computer-use capability before a specific alignment-eval threshold is met. Argue your side."',
        '"What is your real opinion on Constitutional AI? Where does it work better than RLHF? Where does it have weaknesses?"',
        '"Walk me through the most subtle bug you have hit in distributed-training or inference systems."',
        '"Why Anthropic specifically and not [OpenAI / Google / Meta / Mistral]?"',
        '"How would you reduce Claude Opus inference latency by 30% without degrading reasoning quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Anthropic specifically' },
      { type: 'ol', items: [
        'No real safety register. Anthropic is mission-led on AI safety. Stories that treat safety as a checkbox or compliance-overhead miss the company. The interview probes whether you actually take safety seriously.',
        'Generic LLM answers. "I would use the Claude API" is the wrong register at Anthropic. Stories should be at the layer-below -- the model-serving stack, the RLAIF training stack, the interpretability tools.',
        'No opinion on Constitutional AI. CAI is central to Anthropic\'s identity. Coming without an opinion on where it works vs where RLHF + RLAIF win signals shallow prep.',
        'Tone-deaf on the RSP + the "race to the top" register. Anthropic has explicit Responsible Scaling Policy thresholds. Stories that ignore the deployment-trigger framework miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Claude Opus + Claude Code briefly. Note three things about reasoning quality, tool-use, the safety register.',
        '15-40 min: Stack drill. Transformer inference, KV-cache, MCP architecture, Computer Use trust model, Constitutional AI + RLAIF training loop. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- multi-region inference, MCP security, Computer Use trust boundary. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with safety + ML-systems framing. 200 words each. At least one story should demonstrate calibrated handling of ambiguous safety calls.',
        '80-87 min: Read the Responsible Scaling Policy (RSP) doc. Identify the AI Safety Levels (ASL) + the deployment-trigger thresholds.',
        '87-90 min: Close. One opinion on Constitutional AI, one specific Anthropic decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Anthropic remote in 2026?' },
      { type: 'p', text: 'Mostly in-office (SF + NYC + Dublin + Zurich + London + Seattle). Some senior+ remote exceptions. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of frontier-AI-lab band. Cash + RSU-equivalent tracking the latest tender-offer valuation. Total comp matches or exceeds FAANG SWE comp at senior+ levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including frontier-AI labs like Anthropic. Free at aimvantage.uk.' },

      { type: 'p', text: 'Anthropic hires engineers who can reason about ML systems at frontier scale, navigate the Responsible Scaling Policy register, and engage with the Constitutional AI approach honestly. Prep the inference + MCP + Computer Use stack, and bring a real take on the safety / capability tension.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) DATABRICKS SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'databricks-software-engineer-interview-2026',
    title: 'Databricks software engineer interview: the post-MosaicML + Unity Catalog + Genie 2026 loop',
    description: 'The Databricks software engineer interview in 2026 -- five stages, the post-MosaicML + Unity Catalog + Genie + Lakehouse-AI context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Databricks', 'Software Engineer Interview', 'Lakehouse', 'MosaicML', 'Unity Catalog', 'Spark', 'Interview Prep'],
    excerpt: 'Databricks repositioned as the Data + AI company with MosaicML (foundation-model training), Unity Catalog (open governance), Genie (NL-to-SQL), and DBRX / Mosaic AI. The 2026 engineer loop tests for distributed-systems depth + the lakehouse-AI thesis.',
    hook: 'Databricks went from Spark steward to the Data + AI category. The 2026 interview filters for engineers who can ship distributed-systems at petabyte scale AND reason about the AI layer.',
    sections: [
      { type: 'p', text: 'Databricks (private, ~$60B+ valuation post-2024 round) repositioned from Spark steward into the Data + AI category with MosaicML (acquired 2023 for $1.3B, foundation-model training stack), Unity Catalog (open governance + sharing layer, open-sourced 2024), Genie (NL-to-SQL with semantic layer), DBRX (open-source 132B MoE model), Mosaic AI agent + RAG products, and the new Tabular acquisition (Iceberg metadata, 2024). The 2026 engineering team is hiring across the core query engine (Photon + Spark), the Lakehouse storage layer (Delta + Iceberg interop), MosaicML / Mosaic AI (training + serving + RAG + agent framework), Unity Catalog, Genie + AI/BI, and the developer + ML platform. The 2026 hiring bar is high and specific: distributed-systems + query-engine depth, comfort with the lakehouse-AI thesis, and a calibrated take on the Iceberg-integration register.' },

      { type: 'h2', text: 'The Databricks SWE process -- 5-6 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Databricks, why this team. They will probe whether you understand the Data + AI category framing.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-MosaicML register.',
        'Technical screen -- 60 minutes. Live coding (Scala for core Spark; Python for ML / Mosaic; Rust / C++ for Photon). Moderate-to-hard problem.',
        'System design -- 60 minutes. Real Databricks-shaped scenarios. "Design Photon query execution at 10K concurrent queries per workspace." "Walk me through Mosaic AI -- a RAG-with-agent stack that integrates with Unity Catalog + Lakehouse data." "Design the Delta + Iceberg interop layer + the metadata-sync trade-offs."',
        'Onsite or final loop -- 4-5 rounds: deeper coding, deeper system design, distributed-systems specific, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user runs a 10TB Spark query against a Delta table on Databricks. Trace from notebook to result."',
        '"Design Photon query execution at 10K concurrent queries per workspace. The cost predictability matters."',
        '"Walk me through Mosaic AI -- a RAG-with-agent stack that integrates with Unity Catalog + Lakehouse data. How does permission-propagation work?"',
        '"Design the Delta + Iceberg interop. Walk me through metadata-sync, schema-evolution, and time-travel semantics across both formats."',
        '"You inherit a Photon optimisation that improves 90% of queries by 18% but adds 5% regression to one specific customer workload. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in Delta proprietary format or push Iceberg-native. Argue your side."',
        '"What is your real opinion on the Snowflake-vs-Databricks register? Where does Databricks win? Where does Snowflake win?"',
        '"Walk me through the most subtle bug you have hit in distributed query execution."',
        '"Why Databricks and not [Snowflake / BigQuery / Microsoft Fabric / Cloudera]?"',
        '"How would you reduce DBRX inference latency by 30% on a Databricks Model Serving endpoint?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Databricks specifically' },
      { type: 'ol', items: [
        'No distributed-systems reasoning. Databricks is structurally a distributed query engine + ML platform. Stories that miss this miss the company.',
        'Generic data-platform answers. Databricks has specific architecture (the Photon native engine, Delta + Liquid Clustering, Unity Catalog governance, the Mosaic AI gateway). Generic answers miss Databricks-specific context.',
        'No opinion on the Snowflake competitive register. Snowflake-vs-Databricks is the central category competition. Coming without an opinion on the lakehouse-vs-warehouse trajectory signals shallow prep.',
        'Tone-deaf on the open-source register. Databricks open-sourced Delta + Unity Catalog + DBRX as strategic plays. Stories that ignore the open-vs-proprietary tension miss the actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read one Databricks engineering blog post (databricks.com/blog for Photon or Mosaic AI deep-dive).',
        '15-35 min: Stack drill. Photon architecture, Delta Lake (the transaction log + Liquid Clustering), Unity Catalog architecture, Mosaic AI gateway + serving, Iceberg interop. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Photon at scale, Mosaic AI with Unity Catalog, Delta + Iceberg interop. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with distributed-systems + open-source framing. 200 words each.',
        '70-78 min: Read on Databricks vs Snowflake. Articulate where Databricks wins (notebooks, ML, Spark / Delta heritage, Mosaic AI) vs where Snowflake wins (SQL-first governance, Cortex integration).',
        '78-80 min: Close. One opinion on Iceberg integration, one specific Databricks decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Databricks remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF + Mountain View + Seattle + NYC + Bengaluru + Amsterdam + London hubs. Many fully remote roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of late-stage private-tech band. Strong RSU tracking tender-offer valuations. Total comp matches or exceeds FAANG mid-band at senior+ levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including data + AI platforms like Databricks. Free at aimvantage.uk.' },

      { type: 'p', text: 'Databricks hires engineers who can reason about distributed query engines, navigate the lakehouse-AI thesis, and engage with the Snowflake competitive register honestly. Prep the Photon + Delta + Unity Catalog stack, the Mosaic AI context, and a calibrated take on the Iceberg trajectory.' },
    ],
  },
];
