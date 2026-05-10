// 3 more interview-guide posts -- batch 28 (design + productivity)
// Adobe, Figma, Notion.

import type { BlogPost } from './blogPosts';

export const newBlogPosts28: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) ADOBE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'adobe-software-engineer-interview-2026',
    title: 'Adobe software engineer interview: the post-Firefly + GenStudio + Workfront 2026 loop',
    description: 'The Adobe software engineer interview in 2026 -- five stages, the post-Firefly + GenStudio + Workfront + Express context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Adobe', 'Software Engineer Interview', 'Creative Cloud', 'Firefly', 'GenStudio', 'AI', 'Interview Prep'],
    excerpt: 'Adobe pivoted hard into generative AI with Firefly (3 + 4), GenStudio for enterprise + content supply chain, Express + Acrobat AI Assistant, and the post-Figma-merger pivot. The 2026 engineer loop tests for creative/media-systems + AI-integration depth.',
    hook: 'Adobe is the incumbent creative-software giant that bet everything on Firefly + GenStudio after the failed Figma deal. The 2026 interview filters for engineers who can ship media + AI at Creative Cloud scale.',
    sections: [
      { type: 'p', text: 'Adobe (NASDAQ: ADBE) pivoted hard into generative AI with Firefly 3 + 4 (the commercially-safe gen-image / video / vector / sound models trained on Adobe Stock), GenStudio for Performance Marketing + GenStudio for Content Supply Chain (the enterprise gen-AI workflow products), Express + Acrobat AI Assistant (consumer + SMB AI), Workfront (work management, acquired 2020), and the post-Figma-merger pivot (the $20B deal was abandoned December 2023 due to UK CMA + EU regulators). The 2026 engineering team is hiring across Creative Cloud (Photoshop + Illustrator + Premiere + After Effects + the Substance 3D suite), Document Cloud (Acrobat + Sign + Acrobat AI Assistant), Experience Cloud (the Adobe Experience Platform + AEM + Marketo + Workfront), Firefly + GenStudio (the gen-AI + agentic-workflow stack), Adobe Express, the developer platform (Creative SDK, ExtendScript), and the new Adobe AI Studio (custom-model fine-tuning). The 2026 hiring bar is high but specific: media-systems + ML depth, comfort with the Creative-Cloud-monolith register, and a calibrated take on the post-Figma + Firefly-centric thesis.' },

      { type: 'h2', text: 'The Adobe SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Adobe, why this team. They will probe whether you understand the Firefly + GenStudio thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-Figma register.',
        'Technical screen -- 60 minutes. Live coding (C++ for Creative apps; Java + Scala for Experience Cloud; Python + PyTorch for Firefly / ML; TypeScript + React for web).',
        'System design -- 60 minutes. Real Adobe-shaped scenarios. "Design Firefly image-generation inference for the Photoshop integration -- 100M+ requests / month." "Walk me through Photoshop\'s layered-document model serialised to PSD + the new web runtime." "Design GenStudio -- an enterprise gen-AI workflow with brand-safety + asset-rights propagation."',
        'Onsite or final loop -- 4 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Photoshop user runs Generative Fill on a selection. Trace it from the local app through the Firefly inference cluster back to the canvas."',
        '"Design Firefly image-generation inference for the Photoshop integration. 100M+ requests / month, sub-5-second latency, with strict commercial-safety guarantees."',
        '"Walk me through Photoshop\'s layered-document model. How does it serialise to PSD + how does the web (Photoshop on the Web) runtime handle compatibility?"',
        '"Design GenStudio -- an enterprise gen-AI workflow with brand-safety + asset-rights propagation. Multi-tenant. Walk me through the trust + provenance architecture."',
        '"You inherit a Firefly model update that improves output quality by 15% but increases inference cost by 40%. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in a Firefly Custom Models extension or push customers to the AI Studio direction. Argue your side."',
        '"What is your real opinion on the commercially-safe-Firefly thesis (trained only on licensed content)? Where does it win? Where does it lose vs frontier models?"',
        '"Walk me through the most subtle bug you have hit in a creative-software or media-processing system."',
        '"Why Adobe and not [Figma / Canva / Black Forest Labs (Flux) / OpenAI for image / a vertical-creative tool]?"',
        '"How would you reduce Firefly inference latency by 30% without weakening quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Adobe specifically' },
      { type: 'ol', items: [
        'No media-systems reasoning. Adobe is structurally a media + creative-tools company. Stories that miss media formats, codecs, GPU acceleration, raster vs vector concepts miss the company.',
        'Generic AI answers. Adobe has very specific architecture (the Firefly model family + the commercially-safe training set, the Sensei AI platform, the Creative SDK, the GenStudio agent stack). Generic answers miss Adobe-specific context.',
        'No opinion on the Firefly commercial-safety thesis. The "trained only on licensed Adobe Stock + public-domain + permitted-Adobe-Stock content" positioning is central. Coming without an opinion on whether this wins (enterprise sales) vs. loses (quality vs frontier models) signals shallow prep.',
        'Tone-deaf on the post-Figma context. The $20B Figma deal collapsed in December 2023. Stories that ignore the regulatory + strategic-pivot context miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Firefly + Photoshop Generative Fill (free tier exists). Read one Adobe AI page (GenStudio or Firefly).',
        '15-35 min: Stack drill. Photoshop document model + PSD, Creative SDK, Firefly architecture (diffusion + commercial safety), Sensei platform, GenStudio agent + content-supply-chain workflow. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Firefly inference at scale, Photoshop web runtime, GenStudio enterprise workflow. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with media + AI framing. 200 words each.',
        '70-78 min: Read on Adobe vs Figma vs Canva. Articulate where Adobe wins (depth, GenStudio enterprise, commercial-safety Firefly) vs where competitors win.',
        '78-80 min: Close. One opinion on the commercial-safety Firefly thesis, one specific Adobe decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Adobe remote in 2026?' },
      { type: 'p', text: 'Hybrid -- San Jose + Lehi + Seattle + NYC + Bengaluru + Tokyo + Dublin hubs. Some senior+ remote roles. RTO has tightened. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of creative-SaaS band. Strong RSU; total comp matches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including creative + media-tools platforms like Adobe. Free at aimvantage.uk.' },

      { type: 'p', text: 'Adobe hires engineers who can reason about media systems at scale, navigate the Firefly + GenStudio register, and engage with the post-Figma + commercial-safety thesis honestly. Prep the Creative Cloud + Firefly stack, the GenStudio context, and a calibrated take on the AI-in-creative trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) FIGMA SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'figma-software-engineer-interview-2026',
    title: 'Figma software engineer interview: the post-Adobe-deal + AI + Slides + Sites + Make 2026 loop',
    description: 'The Figma software engineer interview in 2026 -- five stages, the post-Adobe-deal + Figma AI + Slides + Sites + Make + Buzz context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Figma', 'Software Engineer Interview', 'Design Tools', 'Multiplayer', 'CRDT', 'AI', 'Interview Prep'],
    excerpt: 'Figma rejected the Adobe acquisition (Dec 2023), shipped Figma AI + Slides + Sites + Buzz + Make, and IPO\'d in 2025. The 2026 engineer loop tests for multiplayer + WebGL + design-tool depth.',
    hook: 'Figma is the multiplayer-first design tool that stayed independent and went public. The 2026 interview filters for engineers who can ship multiplayer + WebGL + AI at canvas-scale.',
    sections: [
      { type: 'p', text: 'Figma rejected the Adobe acquisition (after the regulatory collapse in December 2023, the receipt of the $1B break-up fee, and a return to independent operation), shipped Figma AI (in-canvas gen-AI, including the "make designs", "rewrite", "translate", "rename layers" tools), Figma Slides (the presentation product, GA 2024), Figma Sites (the no-code-site builder, GA 2024), Figma Buzz (the brand-asset surface), Figma Make (the AI-design-from-prompt product), and IPO\'d in 2025. The 2026 engineering team is hiring across the core editor (the multiplayer canvas + the WASM + WebGL stack), Figma AI + Make (the gen-AI + agent layer), Slides + Sites + Buzz + Dev Mode + the FigJam product, the developer platform (Plugin API + REST API + Variables + Code Connect), and the new IPO-scale infrastructure (the new Figma Enterprise tier). The 2026 hiring bar is competitive and specific: multiplayer + CRDT-style depth, WebGL + WASM systems-programming, and a calibrated take on the post-Adobe + AI-in-design thesis.' },

      { type: 'h2', text: 'The Figma SWE process -- 5-6 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Figma, why this team. They will probe whether you understand the post-Adobe + IPO context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the multiplayer-design-tool register.',
        'Technical screen -- 60 minutes. Live coding (C++ for the editor core; TypeScript for editor + frontend; Go + Rust for backend services; Python for ML / AI). Moderate-to-hard problem.',
        'System design -- 60-90 minutes. Real Figma-shaped scenarios. "Design the Figma multiplayer canvas for 100+ simultaneous editors at sub-100ms latency." "Walk me through Figma Make -- an AI agent that generates a design from a text prompt + applies it to canvas." "Design the WASM rendering pipeline + WebGL fallback."',
        'Onsite or final loop -- 4-5 rounds: deeper coding (often C++ / TypeScript), deeper system design, behavioural / values, plus a leadership round + sometimes a take-home or sample design-related exercise.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user drags a frame in a Figma file with 50+ active collaborators. Trace it from the local edit through the CRDT-style sync to other clients."',
        '"Design the Figma multiplayer canvas for 100+ simultaneous editors at sub-100ms latency. The conflict-resolution model + the network architecture."',
        '"Walk me through Figma Make. An AI agent that generates a design from a text prompt + applies it to the canvas. Walk me through the prompt → structured-design → canvas-operations flow."',
        '"Design the WASM rendering pipeline + WebGL fallback. The Figma file format is binary + complex. How do you handle browsers without WebGPU?"',
        '"You inherit an editor optimisation that improves complex-file performance by 25% but adds a 0.1% data-loss rate during reconnect. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate the editor from WebGL to WebGPU now or wait for broader browser support. Argue your side."',
        '"What is your real opinion on the AI-in-design thesis? Where does Figma AI win? Where does it create regression risk in designer workflow?"',
        '"Walk me through the most subtle bug you have hit in a multiplayer or browser-graphics system."',
        '"Why Figma and not [Adobe XD / Sketch / Penpot / Framer / Canva]?"',
        '"How would you reduce time-to-interactive for a 100K-element Figma file by 30%?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Figma specifically' },
      { type: 'ol', items: [
        'No multiplayer reasoning. Figma is structurally a multiplayer-first design tool. Stories that miss CRDT / OT / conflict-resolution concepts miss the company.',
        'Generic browser-app answers. Figma has very specific architecture (the WASM + WebGL + WebGPU editor, the binary Figma file format, the operational-transform-style sync, the Plugin API + Variables + Dev Mode). Generic answers miss Figma-specific context.',
        'No opinion on the AI-in-design direction. Figma AI is central to the post-IPO strategy. Coming without an opinion on whether agent-generated designs work (vs designer-assisted AI) signals shallow prep.',
        'Tone-deaf on the post-Adobe context. The collapsed Adobe deal + the $1B break-up fee + the independent-future + the IPO context shape the register. Stories that ignore this miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Figma + Figma AI in a real file. Note three things about the multiplayer feel, the AI-tool quality, the canvas performance.',
        '15-40 min: Stack drill. CRDT vs OT for multiplayer, WebGL + WebGPU rendering, WASM + the editor binary format, the Plugin API + Variables + Code Connect, Figma AI + Make architecture. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- multiplayer canvas, Figma Make agent, WASM rendering. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with multiplayer + browser-graphics framing. 200 words each.',
        '80-87 min: Read on Figma vs Adobe XD vs Canva. Articulate where Figma wins (multiplayer, plugin ecosystem, AI in the canvas, dev-design integration) vs where competitors win.',
        '87-90 min: Close. One opinion on the AI-in-design direction, one specific Figma decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Figma remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF (HQ) + NYC + London + Singapore hubs. Some senior+ remote roles. RTO tightened post-IPO. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of design-tools band post-IPO. Strong RSU; total comp matches or exceeds FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including multiplayer-design platforms like Figma. Free at aimvantage.uk.' },

      { type: 'p', text: 'Figma hires engineers who can reason about multiplayer canvases + WebGL + WASM, navigate the post-Adobe + post-IPO register, and engage with the AI-in-design thesis honestly. Prep the multiplayer stack, the Figma AI + Make context, and a calibrated take on the agent-generated-design direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) NOTION SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'notion-software-engineer-interview-2026',
    title: 'Notion software engineer interview: the post-Notion AI + Calendar + Mail + Sites 2026 loop',
    description: 'The Notion software engineer interview in 2026 -- five stages, the post-Notion AI + Calendar + Mail + Sites context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Notion', 'Software Engineer Interview', 'Workspace', 'Notion AI', 'Block Model', 'Real-time', 'Interview Prep'],
    excerpt: 'Notion expanded from docs + databases into Notion AI + Calendar (Cron acquisition) + Mail (Skiff team) + Sites + Forms + Charts. The 2026 engineer loop tests for block-model + real-time depth + the workspace thesis.',
    hook: 'Notion is the workspace that ate docs, then calendar, then mail. The 2026 interview filters for engineers who can ship at workspace-scale with the unique block-model architecture.',
    sections: [
      { type: 'p', text: 'Notion (private, ~$10B valuation) expanded from docs + databases into Notion AI (the gen-AI assistant + Q&A across the workspace + autofill in databases), Notion Calendar (the Cron acquisition, December 2023, the calendar product), Notion Mail (the Skiff team + email product, GA 2024-25), Notion Sites (the no-code-site builder), Notion Forms, Notion Charts + Charts AI, and the deeper Enterprise + AI Connectors. The 2026 engineering team is hiring across the core editor (the famous Notion block-model + the real-time sync + the WebSocket stack), Notion AI (the gen-AI + agent + Q&A layer), Calendar + Mail (the productivity-suite surfaces), Sites + Forms + Charts, the developer platform (Notion API + Notion Connectors), and the new Enterprise + Compliance products. The 2026 hiring bar is competitive and specific: block-model depth, real-time + WebSocket reasoning, and a calibrated take on the workspace-everything thesis.' },

      { type: 'h2', text: 'The Notion SWE process -- 5 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Notion, why this team. They will probe whether you understand the workspace-everything thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the block-model register.',
        'Technical screen -- 60 minutes. Live coding (TypeScript primarily; Python for backend / ML; Rust for performance-critical paths). Moderate problem.',
        'System design -- 60 minutes. Real Notion-shaped scenarios. "Design Notion\'s block-model for a 100K-block page with sub-50ms edit-roundtrip." "Walk me through Notion AI Q&A across an entire workspace -- the indexing + retrieval + the permissions boundary." "Design Notion Calendar -- the multi-provider sync with Notion as the meta-layer."',
        'Onsite or final loop -- 4 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user creates a new block in a Notion page with active collaborators. Trace it from the local edit through the sync to other clients."',
        '"Design Notion\'s block-model. Every page is a tree of blocks; blocks can be referenced across pages. How do you store + sync this at workspace scale?"',
        '"Walk me through Notion AI Q&A across an entire workspace. The indexing + retrieval + the permissions boundary (a user can only ask about content they have access to)."',
        '"Design Notion Calendar. Multi-provider sync (Google, Microsoft, iCloud) + Notion as the meta-layer + the Notion-database backed view."',
        '"You inherit an editor optimisation that improves large-page performance by 22% but adds a 5% regression to short-page latency. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a part of the editor from React to a Rust + WASM implementation. Argue your side."',
        '"What is your real opinion on the workspace-everything thesis (docs + databases + AI + calendar + mail)? Where does it win? Where does it create execution risk?"',
        '"Walk me through the most subtle bug you have hit in a real-time-collaborative or block-model system."',
        '"Why Notion and not [Coda / Obsidian / Roam / Confluence / Linear-as-workspace]?"',
        '"How would you reduce Notion AI Q&A latency by 30% without weakening retrieval quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Notion specifically' },
      { type: 'ol', items: [
        'No block-model reasoning. Notion is structurally a block-tree workspace. Stories that miss the block-as-first-class-citizen architecture miss the company.',
        'Generic doc-editor answers. Notion has very specific architecture (the block tree + the page-as-tree-of-blocks, the real-time sync + WebSocket stack, the Notion-database engine, the Notion AI Q&A retrieval pipeline). Generic answers miss Notion-specific context.',
        'No opinion on the workspace-everything direction. The Calendar + Mail + Sites + AI expansion is central. Coming without an opinion on whether the platform-everything strategy works (vs focused docs + DB) signals shallow prep.',
        'Tone-deaf on the brand-vs-utility register. Notion has a strong brand + community culture. Stories framed for the enterprise-RFP register miss the actual register at the engineering org.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Notion + Notion AI + Notion Calendar in a real workspace. Note three friction points + three things you respect.',
        '15-35 min: Stack drill. Block-model + page-as-tree-of-blocks, real-time sync + WebSocket architecture, Notion-database engine, Notion AI Q&A retrieval, Calendar multi-provider sync. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- block-model at scale, Notion AI Q&A across workspace, Calendar sync. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with block-model + real-time framing. 200 words each.',
        '70-78 min: Read on Notion vs Coda vs Obsidian. Articulate where Notion wins (block-model flexibility, AI integration, workspace breadth) vs where competitors win.',
        '78-80 min: Close. One opinion on the workspace-everything direction, one specific Notion decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Notion remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF (HQ) + NYC + Tokyo + Dublin + Seoul hubs. Some senior+ remote roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of late-stage private-tech band. RSU-equivalent tracking tender-offer valuation. Total comp matches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including workspace + block-model platforms like Notion. Free at aimvantage.uk.' },

      { type: 'p', text: 'Notion hires engineers who can reason about block-models + real-time sync at workspace scale, navigate the Notion AI + Calendar + Mail + Sites expansion, and engage with the platform-everything thesis honestly. Prep the block-model + sync stack, the Notion AI context, and a calibrated take on the workspace-everything direction.' },
    ],
  },
];
