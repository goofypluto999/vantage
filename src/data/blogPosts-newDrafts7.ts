// 3 long-tail interview-guide posts -- batch 7, drafted 2026-05-10
// Data infra + open-source ML. Hot 2026 hiring verticals aligned with the
// laid-off FAANG engineer ICP (former data + ML platform engineers pivoting).

import type { BlogPost } from './blogPosts';

export const newBlogPosts7: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) SNOWFLAKE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'snowflake-software-engineer-interview-2026',
    title: 'Snowflake software engineer interview: the AI-data-cloud 2026 loop',
    description: 'The Snowflake software engineer interview in 2026 -- five stages, the post-Cortex AI pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Snowflake', 'Software Engineer Interview', 'Data Infrastructure', 'AI Hiring', 'Interview Prep', 'Distributed Systems', 'Tech Hiring'],
    excerpt: 'Snowflake has reorganised hiring around the Cortex AI thesis. The engineering loop now filters for whether you can reason about query optimisation AND AI-on-warehouse trade-offs in the same conversation.',
    hook: 'Snowflake is hiring engineers who can reason about query optimisation AND model inference latency in the same breath. The two-track filter has caught most candidates off-guard.',
    sections: [
      { type: 'p', text: 'Snowflake (NYSE: SNOW) is public, profitable on adjusted free cash flow, and has reorganised significantly around the Cortex AI Suite since 2024. The engineering team is hiring across data platform, Cortex, and Streamlit. The bar has shifted: where 2023 Snowflake interviews were almost entirely query-optimisation and distributed systems, 2026 interviews now blend that with AI infrastructure reasoning -- inference latency budgets, model selection, vector search trade-offs.' },

      { type: 'h2', text: 'The Snowflake engineering process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Snowflake, why this team. They probe whether you have a real opinion on the Cortex pivot.',
        'Hiring manager interview -- 60 minutes. Past work, scope, technical fluency, the AI-data-cloud register.',
        'Coding -- 60 minutes. Live or take-home. Backend / data engineering roles get a moderate problem with real performance trade-offs. ML platform roles get a model-serving or vector-search slice.',
        'System design -- 60 minutes. Real Snowflake-shaped scenarios. "Design Cortex Search to handle 10M queries/day with sub-200ms p99." "Walk me through how you would optimise a 10TB join across two warehouses." "How does Iceberg support change Snowflake\'s storage architecture?"',
        'Onsite or final loop -- 3-4 rounds: deeper coding or design, behavioural / values, cross-functional, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a 10TB join is submitted to Snowflake. Where is the contention?"',
        '"Design Cortex Search at 10M queries/day, p99 under 200ms. Walk me through the architecture."',
        '"How does Iceberg support change Snowflake\'s storage abstraction? What did you give up to get it?"',
        '"You disagree with a senior engineer on whether to ship a Cortex feature behind a flag or as a general availability default. Argue your side for 5 minutes."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is your real opinion on AI in the data warehouse? Where is Snowflake right and where is Databricks right?"',
        '"Tell me about a production incident in a distributed system you owned. What did the postmortem look like?"',
        '"Why Snowflake and not Databricks, BigQuery, or Redshift?"',
        '"You inherit a Snowflake-side data pipeline that is slow. First three things you investigate?"',
        '"What is the one thing wrong with our Cortex pricing model? Be specific."',
      ] },

      { type: 'h2', text: 'What kills candidates at Snowflake specifically' },
      { type: 'ol', items: [
        'No reasoning on AI-on-warehouse trade-offs. The Cortex thesis is structural at Snowflake. "AI is going to change everything" is not an answer. "I would not run real-time inference on a virtual warehouse because the cold-start cost exceeds the latency budget for online queries" is calibrated.',
        'Generic distributed systems answers. Snowflake interviewers expect production-traffic numbers. "I would shard it" is not enough. "I would partition by tenant_id with 64 hash buckets because the workload is read-heavy at 100:1 and the cross-tenant query rate is below 5%" is.',
        'Underestimating the Iceberg context. Snowflake\'s open-table-format support has reshaped the storage architecture. If you cannot reason about Iceberg vs Snowflake-native trade-offs, the system design round will go badly.',
        'Missing the values round. Snowflake runs a strong values round (one team, integrity, customer success). They are not slogans. Interviewers compare notes on values.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent Q4 earnings call summary plus the latest Cortex blog post. Write down three opinions.',
        '15-35 min: Stack drill. Snowflake architecture (services, compute, storage), virtual warehouses, Iceberg vs native tables, Cortex Search, Snowpark. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Cortex Search at scale, large join optimisation, vector index integration. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-70 min: Story drill. Three engineering stories -- ambiguous decision, distributed systems incident, technical disagreement resolved. 200 words each.',
        '70-80 min: Close. One opinion on AI-in-the-warehouse, one specific Snowflake decision you would change, one question for the hiring manager that proves you read the latest investor update.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Snowflake remote in 2026?' },
      { type: 'p', text: 'Hybrid. Bozeman MT, Bay Area, Bellevue WA, Dublin, London for most engineering roles. Some staff+ roles open to fully remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of public-data-infra market. London base salaries lag Bay Area by ~25-30%. Equity meaningful at the post-2024 stock trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in most markets. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AI-data-cloud companies like Snowflake. Free at aimvantage.uk.' },

      { type: 'p', text: 'Snowflake hires engineers who can reason about query optimisation AND AI-on-warehouse trade-offs in the same conversation. Prep the Cortex stack, the Iceberg context, and a calibrated take on where Snowflake is right and where it is not.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) DATABRICKS SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'databricks-software-engineer-interview-2026',
    title: 'Databricks software engineer interview: the lakehouse + Mosaic 2026 loop',
    description: 'The Databricks software engineer interview in 2026 -- five stages, the post-Mosaic AI infrastructure context, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Databricks', 'Software Engineer Interview', 'Lakehouse', 'AI Infrastructure', 'Interview Prep', 'Spark', 'Tech Hiring'],
    excerpt: 'Databricks is private, post-Mosaic, and racing toward a 2026 IPO. The engineering loop tests for lakehouse depth, AI infrastructure reasoning, and a real opinion on the Mosaic-era pivot.',
    hook: 'Databricks engineers now have to argue both sides of the lakehouse-vs-warehouse debate convincingly. Pick a side and the interview ends fast.',
    sections: [
      { type: 'p', text: 'Databricks is private, valued at $62B+ in late-2025 secondary, and on an IPO-track timeline. The Mosaic AI acquisition reshaped the engineering org -- the AI infrastructure team is hiring aggressively, and the bar for both lakehouse depth and ML systems reasoning has tightened. The single biggest filter: candidates who pick a side too early in the lakehouse-vs-warehouse debate. Databricks engineers are expected to argue both sides convincingly.' },

      { type: 'h2', text: 'The Databricks engineering process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Databricks, why this team. They explicitly funnel into platform, Mosaic AI, or apps.',
        'Hiring manager interview -- 60 minutes. Past work, scope, technical fluency, the post-Mosaic register.',
        'Coding -- 60 minutes. Live or async. Backend roles get Spark-shaped problems. ML platform roles get inference-pipeline trade-offs.',
        'System design -- 60 minutes. Real Databricks-shaped scenarios. "Design the Unity Catalog metadata service for 10K customers." "Walk me through Mosaic\'s training-to-inference pipeline at scale." "How does Delta Lake handle concurrent writes from a streaming and batch workload?"',
        'Onsite or final loop -- 3-4 rounds: deeper system design, behavioural / values, cross-functional, plus a leadership round (sometimes a VP from a related team).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how Delta Lake resolves a write conflict between a streaming job and a batch update on the same table."',
        '"Design the inference serving layer for Mosaic at 100K QPS, p99 under 100ms."',
        '"You disagree with a senior engineer on whether to use Photon or vanilla Spark for a customer with a 70/30 read/write workload. Argue your side."',
        '"Walk me through how Unity Catalog enforces row-level security across federated queries."',
        '"Pick one Databricks product surface. Tell me three things you would change. Defend each."',
        '"What is your real opinion on the lakehouse-vs-warehouse debate? Argue Snowflake\'s side first."',
        '"Tell me about a production incident in a distributed system you owned. What did the postmortem look like?"',
        '"Why Databricks and not Snowflake, BigQuery, or Confluent?"',
        '"You inherit a Spark job that is slow. First three things you investigate?"',
        '"What is wrong with our Mosaic AI pricing model? Be specific."',
      ] },

      { type: 'h2', text: 'What kills candidates at Databricks specifically' },
      { type: 'ol', items: [
        'Picking a side in the lakehouse debate. Most candidates open with "lakehouse is the future." That is not an answer at Databricks. The interviewer wants to hear you argue both sides convincingly, then commit -- with the reasoning being where the signal is. "Lakehouse wins for X workload because Y; warehouse wins for Z workload because W" is the register.',
        'No Spark internals depth. You do not need to recite Catalyst optimiser passes. You do need to reason about partition pruning, broadcast vs shuffle joins, skew, and adaptive query execution. Get the basics in your head.',
        'Generic ML systems takes. Mosaic acquisition reshaped the AI bar. "I would use a serving framework" is not enough. "I would use vLLM with continuous batching because the workload is high-QPS chat with long context, and the alternative TGI has 30% lower throughput at this batch size" is.',
        'Underestimating Unity Catalog. The federated catalog is a structural pillar of Databricks\' enterprise pitch. If you cannot reason about it during the system design round, the round goes badly.',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent Mosaic AI blog post plus the most recent Databricks engineering blog. Write down three opinions.',
        '15-35 min: Stack drill. Spark internals (Catalyst, Photon, AQE), Delta Lake (transaction log, OPTIMIZE, Z-ordering), Unity Catalog, Mosaic training pipeline (Composer, MosaicML platform), MLflow. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Unity Catalog at scale, Mosaic inference serving, Delta Lake concurrent writes. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-70 min: Story drill. Three engineering stories. 200 words each.',
        '70-80 min: Lakehouse vs warehouse drill. Write 200 words on Snowflake\'s argument. Write 200 words on Databricks\'. Then commit and explain why.',
        '80-85 min: Close. One opinion on the lakehouse debate, one specific Databricks decision you would change, one question for the hiring manager that proves you read the latest Mosaic post.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Databricks remote in 2026?' },
      { type: 'p', text: 'Hybrid. SF, Mountain View, Seattle, Amsterdam, London for most engineering roles. Some staff+ roles open to fully remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for late-private valuation. Equity meaningful given IPO-track timing. London base lags SF by ~25-30%.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds. Useful for AI-infra companies like Databricks where the JD does not tell you which side of the lakehouse debate to default to. Free at aimvantage.uk.' },

      { type: 'p', text: 'Databricks hires engineers who can argue both sides of the lakehouse debate, reason about Spark and Mosaic at production traffic, and operate with IPO-track rigour. Prep the stack and the contrarian register -- it is the single biggest filter most candidates miss.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) HUGGING FACE ML ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'hugging-face-ml-engineer-interview-2026',
    title: 'Hugging Face ML engineer interview: the open-source AI 2026 loop',
    description: 'The Hugging Face machine learning engineer interview in 2026 -- four stages, the open-source-first culture, real questions, four traps, and a 75-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Hugging Face', 'ML Engineer Interview', 'Open Source', 'AI Hiring', 'Interview Prep', 'Transformers', 'Tech Hiring'],
    excerpt: 'Hugging Face is the open-source AI gravity well. The ML engineer loop filters for one specific signal more aggressively than any other AI shop: do you ship to the libraries you use?',
    hook: 'Hugging Face hires people who already contribute to transformers, datasets, or accelerate. The recruiter screen filters out 70% of candidates in the first 5 minutes for one specific reason.',
    sections: [
      { type: 'p', text: 'Hugging Face is private, profitable, and the gravity well of the open-source AI ecosystem. The transformers, datasets, accelerate, and diffusers libraries are downloaded billions of times per month. The ML engineer loop is short -- 4 stages -- but brutal on one filter: have you contributed to the libraries you would be working on, or at minimum, are you a serious user with public artefacts to show for it? "I have read the docs" is the end of the recruiter screen.' },

      { type: 'h2', text: 'The Hugging Face ML engineer process -- 4 stages, ~3 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Hugging Face, why this team. They will look at your GitHub, your Hub profile, and the contributions you have made before the call.',
        'Technical screen -- 60 minutes. Live coding or take-home. Often involves extending or debugging code from one of the open-source libraries. Sometimes a Triton or CUDA kernel slice for the AI infrastructure team.',
        'Onsite or remote loop -- 3 rounds: deeper technical, system design (often inference-serving or training-pipeline shaped), and a values / culture round.',
        'Founders or executive interview -- 45 minutes for senior roles. Clement, Julien, or a co-founder. Strategy, opinions, calibrated debate.',
      ] },
      { type: 'p', text: 'The whole loop runs ~3 weeks when everyone moves. They are explicit about wanting people who already contribute to the ecosystem -- the cycle is fast for those who do.' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through your last meaningful PR to transformers, datasets, or accelerate. If you have not opened one, walk me through your most-used model on the Hub."',
        '"Design the inference serving layer for transformers at 100K QPS, p99 under 50ms, with model swapping."',
        '"You inherit a 1B-parameter fine-tune that overfits in 4 epochs. First three things you investigate?"',
        '"Walk me through how the transformers library handles attention masking for left-padding vs right-padding inputs."',
        '"Pick a model architecture from the last 12 months. Tell me what is wrong with how it is implemented in transformers."',
        '"You disagree with a maintainer on whether to merge a PR that adds a 3% improvement on one benchmark and a 0.5% regression on another. Argue your side."',
        '"Tell me about an open-source PR that did not get merged. What did you learn?"',
        '"Why Hugging Face and not Anthropic, OpenAI, or Mistral?"',
        '"What is wrong with our docs? Be specific. We can pull them up."',
        '"Pick a feature on the Hub you would build next. Why?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Hugging Face specifically' },
      { type: 'ol', items: [
        'No public open-source signal. The number one filter. If your GitHub has 4 forked repos with no commits and your Hub profile is empty, the recruiter screen is over in 5 minutes. Contribute one real PR to a library you would use. Push one fine-tune to the Hub. Write a Space. Anything verifiable.',
        'Generic transformer takes. "Attention is all you need" is not an answer at Hugging Face. They want depth -- "the way the transformers library implements rotary embeddings has a subtle off-by-one in the freq calculation that bites you with extreme context lengths" is the register.',
        'Underestimating CUDA / Triton fluency for AI infra roles. If you are interviewing for the AI infrastructure team and cannot read a Triton kernel, the round goes badly.',
        'Missing the open-source register. Hugging Face hires people who default to "merge it upstream," not "build it internally." If your stories sound like you would prefer closed-source, the cultural round will flag you.',
      ] },

      { type: 'h2', text: 'The 75-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open your Hugging Face profile and your GitHub. If either is empty, fix it now -- push a Space, fork a model, or open one well-formed issue on a Hugging Face library.',
        '15-30 min: Library drill. Pick the 2 libraries closest to your role -- transformers, datasets, accelerate, diffusers, evaluate, peft, trl. Read the most recent CHANGELOG. Note three things you have an opinion on.',
        '30-45 min: System design. Pick one of -- inference serving with model swap, distributed fine-tuning at 1B params, dataset streaming pipeline. Write a one-page memo.',
        '45-60 min: Story drill. Three stories tied to open-source -- a PR, a maintainer disagreement, a debug deep-dive. 200 words each.',
        '60-70 min: Architecture refresher. Most recent open-source model architecture. Read the paper or the implementation. Have one critical opinion.',
        '70-75 min: Close. One opinion on the Hugging Face vs Anthropic/OpenAI strategic positioning, one specific Hub or library decision you would change, one question for the founder that proves you have actually used the libraries.',
      ] },

      { type: 'h2', text: 'On the contribution filter' },
      { type: 'p', text: 'You do not need to be a top-100 contributor. You need ONE meaningful artefact that proves you can ship in their ecosystem -- a merged PR, a fine-tune used by other people, a Space that solves a real problem, or a well-engineered issue that maintainers thanked you for. This is non-negotiable. Spend 4 hours the week before the loop if you have nothing.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Hugging Face remote in 2026?' },
      { type: 'p', text: 'Mostly yes. Paris, NYC, and SF hubs but most engineering roles are remote-friendly across NA + EU. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for the stage. Equity meaningful at late-private valuation. Lower base than US-FAANG but with strong upside.' },
      { type: 'h3', text: 'Do they hire from non-traditional backgrounds?' },
      { type: 'p', text: 'Yes -- the open-source signal substitutes for credentials more aggressively here than at almost any AI shop. Self-taught engineers with a strong Hub presence and library contributions get loops faster than PhDs with no public artefacts.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role. Useful for open-source-first companies like Hugging Face where the JD undersells how aggressively they filter on contribution signal. Free at aimvantage.uk.' },

      { type: 'p', text: 'Hugging Face hires people who ship to the libraries they use. Spend the week before the loop pushing one real artefact to the ecosystem -- it is the single biggest filter and almost no other AI shop weighs it as heavily.' },
    ],
  },
];
