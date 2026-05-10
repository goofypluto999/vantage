// 3 more interview-guide posts -- batch 38 (gaming + streaming)
// Epic Games, Unity Technologies, Roku.

import type { BlogPost } from './blogPosts';

export const newBlogPosts38: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) EPIC GAMES SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'epic-games-software-engineer-interview-2026',
    title: 'Epic Games software engineer interview: the post-UEFN + Verse + Fortnite + Store 2026 loop',
    description: 'The Epic Games software engineer interview in 2026 -- five stages, the post-Fortnite chapter 6 + UEFN + Verse + Epic Games Store + Unreal Engine 5.5 context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Epic Games', 'Software Engineer Interview', 'Unreal Engine', 'Fortnite', 'UEFN', 'Verse', 'Interview Prep'],
    excerpt: 'Epic Games ships Fortnite + Unreal Engine 5.5 + UEFN (the user-creator-studio) + Verse (the new programming language) + the Epic Games Store. The 2026 engineer loop tests for game-engine + C++ + multiplayer-systems depth.',
    hook: 'Epic Games is the giant behind Fortnite + Unreal Engine + the post-Apple antitrust win. The 2026 interview filters for engineers who can ship at game-engine + multiplayer scale.',
    sections: [
      { type: 'p', text: 'Epic Games (private, owned by Tim Sweeney + Tencent) ships Fortnite (Chapter 6, ~280M+ MAU, the persistent metaverse with Battle Royale + Zero Build + LEGO + Racing + Festival + Reload), Unreal Engine 5.5 (the in-house engine licensed widely across games + film + automotive + architecture), UEFN (Unreal Editor for Fortnite, the user-creator studio that lets players build islands using a Verse-scripted, Unreal-powered editor), Verse (the new programming language built for the metaverse, used in UEFN + future Unreal scripts), the Epic Games Store (the PC store competing with Steam, post-Apple-and-Google-antitrust-win for the mobile version), and Rocket League + Fall Guys (Mediatonic-acquired). The 2026 engineering team is hiring across the Fortnite client + servers + LiveOps (the C++ heavy game-code + the back-end), Unreal Engine core (C++, the renderer + animation + physics + audio + Nanite + Lumen), UEFN + Verse (the editor + language + runtime), the online services (Epic Online Services, the cross-platform middleware), Epic Games Store, the new mobile distribution (post-DMA + Court-of-Appeals wins, the mobile Epic Games Store + the third-party-app-store push), and the developer-platform products. The 2026 hiring bar is high and specific: game-engine + C++ depth, comfort with the multiplayer + LiveOps + creator-economy register, and a calibrated take on the metaverse + UEFN thesis.' },

      { type: 'h2', text: 'The Epic Games SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Epic, why this team. They will probe whether you understand the metaverse + creator-economy thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the game-engine register.',
        'Technical screen -- 60-90 minutes. Live coding (C++ heavily for engine + Fortnite; Python for tools; Verse for UEFN; TypeScript for Epic Games Store). Often a non-trivial systems problem.',
        'System design -- 60 minutes. Real Epic-shaped scenarios. "Design Fortnite\'s replication system at 100-player Battle Royale scale." "Walk me through Nanite + Lumen runtime in Unreal Engine 5.5." "Design UEFN\'s Verse runtime + sandboxing for user-creator code."',
        'Onsite or final loop -- 2-3 rounds: deeper coding (often C++), deeper system design, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when 100 players spawn into a Fortnite Battle Royale match. Trace from matchmaking to gameplay-replication."',
        '"Design Fortnite\'s replication system. 100-player BR at 60Hz, prediction + interpolation, bandwidth + cheat-resistance."',
        '"Walk me through Nanite + Lumen runtime in Unreal Engine 5.5. The geometry + global-illumination architecture."',
        '"Design UEFN\'s Verse runtime + sandboxing. User-creator code must not crash the game or exfiltrate data. Walk me through the security boundary."',
        '"You inherit a Lumen optimisation that improves frame-time by 12% but adds a 0.5% chance of visual artefacts on one specific GPU class. First three actions?"',
        '"You disagree with a senior engineer on whether to write a feature in Verse or in native C++ for performance. Argue your side."',
        '"What is your real opinion on the metaverse + UEFN creator-economy thesis? Where does it win? Where is it overstated?"',
        '"Walk me through the most subtle bug you have hit in a game-engine, multiplayer, or real-time-rendering system."',
        '"Why Epic and not [Unity / Roblox / Microsoft (Xbox) / EA / a smaller indie engine]?"',
        '"How would you reduce Fortnite cold-load time by 30% on mid-range PCs?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Epic specifically' },
      { type: 'ol', items: [
        'No game-engine reasoning. Epic is structurally a C++ game-engine + multiplayer-services company. Stories that miss frame-budget / replication / rendering / animation concepts miss the company.',
        'Generic backend answers. Epic has very specific architecture (Unreal Engine\'s rendering + physics + animation pipeline, Fortnite\'s replication + LiveOps, UEFN + Verse, Epic Online Services). Generic answers miss Epic-specific context.',
        'No opinion on the metaverse + UEFN thesis. The creator-economy + metaverse bet is central. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the Tim-Sweeney-led culture. Epic is famously direct + opinion-led + opinion-driven by Tim. Stories framed for committee-driven enterprise miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Play Fortnite (Zero Build or LEGO) for 15 minutes. Browse the UEFN editor + a Verse example.',
        '15-35 min: Stack drill. Game-engine architecture (rendering, animation, physics), Unreal Engine 5 Nanite + Lumen, multiplayer replication + prediction, Verse + UEFN runtime. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Fortnite replication, Nanite + Lumen, Verse sandbox. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with game-engine + real-time framing. 200 words each.',
        '70-78 min: Read on Epic vs Unity vs Roblox. Articulate where Epic wins (Unreal Engine + Fortnite + UEFN + AAA quality) vs where competitors win.',
        '78-80 min: Close. One opinion on the metaverse direction, one specific Epic decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Epic remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Cary NC (HQ) + Seattle + Salt Lake City + Helsinki + London + Tokyo hubs. Many roles remote within country. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of gaming / engine band. Cash + bonus + equity-equivalent. Total comp competitive with FAANG mid-band at senior+ for game-engine roles.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including game-engine + multiplayer companies like Epic Games. Free at aimvantage.uk.' },

      { type: 'p', text: 'Epic Games hires engineers who can reason about game-engines + multiplayer + real-time rendering at AAA scale, navigate the Tim-Sweeney-led register, and engage with the UEFN + Verse + metaverse thesis honestly. Prep the Unreal Engine + Fortnite + Verse stack, the EOS context, and a calibrated take on the creator-economy direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) UNITY SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'unity-software-engineer-interview-2026',
    title: 'Unity software engineer interview: the post-pricing-reversal + Unity 6 + AI + Industry 2026 loop',
    description: 'The Unity software engineer interview in 2026 -- five stages, the post-Runtime Fee reversal + Unity 6 + Unity Muse + Unity AI + Industry context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Unity', 'Software Engineer Interview', 'Game Engine', 'C++', 'Unity Muse', 'Industry', 'Interview Prep'],
    excerpt: 'Unity reversed the controversial 2023 Runtime Fee, shipped Unity 6 + Unity Muse (AI), pushed Unity Industry (the non-gaming verticals), and worked to rebuild developer trust. The 2026 engineer loop tests for engine + 3D systems depth + a calibrated take on the post-pricing pivot.',
    hook: 'Unity is the engine company that survived a near-death pricing crisis in 2023, rebuilt under new leadership, and is now betting on Unity 6 + Muse + Industry. The 2026 interview filters for engineers who can ship engine code while the company rebuilds trust.',
    sections: [
      { type: 'p', text: 'Unity Technologies (NYSE: U) reversed the controversial Runtime Fee (announced Sept 2023, walked back in 2024 after community revolt), shipped Unity 6 (the unified GA release of the renderer + DOTS + new Input System + better mobile support, late 2024), pushed Unity Muse (the suite of AI tools for animation, texture, behavior generation), launched Unity Industry (the non-gaming verticals: auto, AEC, manufacturing — the digital-twin + immersive enterprise products), continued Unity Sentis (the on-device ML runtime), and worked under new CEO Matthew Bromberg (since May 2024) to rebuild developer trust. The 2026 engineering team is hiring across Unity Engine core (C++, the renderer + physics + animation + scripting), Unity 6 features (DOTS / ECS, URP / HDRP, the new Web platform), Unity Muse + AI Tools, Unity Industry (the digital-twin + AEC integrations), Unity Ads + GrowFlow (the post-IronSource monetisation stack), Cloud Build + Gaming Services, the developer platform (Plugin + Asset Store + Verified Solutions), and the runtime + multi-platform (iOS + Android + Console + WebGPU) teams. The 2026 hiring bar is competitive and specific: engine + 3D systems depth, comfort with the post-pricing-crisis register, and a calibrated take on the Unity-Muse + Industry-expansion thesis.' },

      { type: 'h2', text: 'The Unity SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Unity, why this team. They will probe whether you understand the post-pricing-crisis trust rebuild.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the engine-engineering register.',
        'Technical screen -- 60 minutes. Live coding (C++ for engine; C# for editor + DOTS; Python for tools).',
        'System design -- 60 minutes. Real Unity-shaped scenarios. "Design DOTS / ECS scheduling for 100K-entity simulation at 60 FPS." "Walk me through the URP scriptable-render-pipeline + how a custom render-feature integrates." "Design Unity Muse\'s on-device texture-generation pipeline."',
        'Onsite or final loop -- 2-3 rounds: deeper coding, deeper system design, behavioural / values + post-pricing-crisis culture round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Unity user hits Play in the editor. Trace from C# scripting compilation to first-frame rendered."',
        '"Design DOTS / ECS scheduling for a 100K-entity simulation at 60 FPS. The job-system, the data-oriented memory layout, the Burst compilation."',
        '"Walk me through Unity URP\'s scriptable-render-pipeline. How does a custom render-feature integrate + extend?"',
        '"Design Unity Muse\'s on-device texture-generation. The Sentis ML runtime + the editor integration + the local inference budget."',
        '"You inherit a renderer change that improves performance by 8% but introduces a visual regression on 0.5% of devices using a specific GPU class. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in DOTS / ECS adoption or improve the traditional GameObject path. Argue your side."',
        '"What is your real opinion on the post-Runtime-Fee trust rebuild? Where is the company actually different now? Where is it the same?"',
        '"Walk me through the most subtle bug you have hit in a game-engine, renderer, or compiler system."',
        '"Why Unity and not [Unreal Engine / Godot / a custom in-house engine / Roblox-as-engine]?"',
        '"How would you reduce Unity-built mobile-game cold-start time by 30% without weakening graphical quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Unity specifically' },
      { type: 'ol', items: [
        'No engine / 3D-systems reasoning. Unity is structurally a C++ game-engine company. Stories that miss rendering / scripting-runtime / multi-platform / Burst-compilation concepts miss the company.',
        'Generic engine answers. Unity has very specific architecture (the C++ engine + C# scripting + Mono / IL2CPP, DOTS / ECS + Burst, URP / HDRP / built-in render pipeline coexistence, Sentis ML runtime). Generic answers miss Unity-specific context.',
        'No engagement with the Runtime Fee context. The 2023 Runtime Fee controversy + the reversal shaped the post-2024 register. Coming without a calibrated take signals shallow prep.',
        'Tone-deaf on the developer-trust register. Unity is in the trust-rebuilding phase. Stories that miss the candidate-engagement-with-community dimension miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Build a Unity 6 hello-world project. Try Unity Muse if licensed. Read the Runtime Fee reversal context.',
        '15-35 min: Stack drill. C++ engine + C# scripting + Mono / IL2CPP, DOTS / ECS + Burst, URP scriptable render pipeline, Unity Muse + Sentis ML. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- DOTS scheduling, URP custom render-feature, Muse texture-gen. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with engine-engineering + trust-rebuild framing. 200 words each.',
        '70-78 min: Read on Unity vs Unreal vs Godot. Articulate where Unity wins (cross-platform, asset store, DOTS, AR/VR + mobile) vs where competitors win.',
        '78-80 min: Close. One opinion on Runtime Fee reversal + trust rebuild, one specific Unity decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Unity remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF + Bellevue + Austin + Copenhagen + Montreal + Singapore + Tokyo hubs. Some senior+ remote roles. RTO has tightened post-leadership-change. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-band gaming / engine SaaS post-2024 stock recovery. RSU is rebuilding from a low. Total comp competitive at senior+ but below FAANG mid-band at equivalent levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including game-engine companies like Unity. Free at aimvantage.uk.' },

      { type: 'p', text: 'Unity hires engineers who can reason about engine + 3D systems at multi-platform scale, navigate the post-pricing-crisis trust rebuild, and engage with the Unity 6 + Muse + Industry thesis honestly. Prep the C++ engine + DOTS + URP stack, the Sentis context, and a calibrated take on the trust-rebuild direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) ROKU SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'roku-software-engineer-interview-2026',
    title: 'Roku software engineer interview: the post-Roku-OS-13 + Channel + Ads + Smart-Home 2026 loop',
    description: 'The Roku software engineer interview in 2026 -- five stages, the post-Roku OS 13 + The Roku Channel + Roku Ads + Roku Smart Home context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Roku', 'Software Engineer Interview', 'Streaming TV', 'CTV Ads', 'BrightScript', 'OS', 'Interview Prep'],
    excerpt: 'Roku ships Roku OS (the most-used TV OS in the US) + The Roku Channel (free ad-supported streaming, top-5 by viewing share) + Roku Ads + Roku Smart Home. The 2026 engineer loop tests for CTV + ads + embedded-TV-OS depth.',
    hook: 'Roku is the company quietly running the most-used TV OS in the US with The Roku Channel + Roku Ads as the monetisation engine. The 2026 interview filters for engineers who can ship CTV-OS at planetary scale.',
    sections: [
      { type: 'p', text: 'Roku (NASDAQ: ROKU) ships Roku OS 13 (the latest TV OS, on 85M+ active accounts + the most-used smart-TV OS in US by viewing share), The Roku Channel (the in-house free-ad-supported streaming + 500+ live channels + the originals + the Walmart Original Content), Roku Ads (the Roku Advertising Watermark + the OneView platform + the Roku-Walmart-data partnership for retail-media), Roku Smart Home (the Doorbell + Security Cameras + Smart Plugs + Lighting product line, acquired from Wyze partnership), Roku TVs (the Roku-branded TV line with Walmart + Best Buy), and the deeper Roku Pay + Voice products. The 2026 engineering team is hiring across Roku OS (the C / C++ TV OS + BrightScript for apps), The Roku Channel (the streaming + live + recommendation + monetisation stack), Roku Ads (the OneView ad platform + the Watermark for content ID + the data-clean-room for advertisers), Roku Smart Home (the hardware-software integration + cloud services), Roku TVs + reference designs, and the platform + developer products. The 2026 hiring bar is competitive and specific: CTV-OS + embedded depth, comfort with the BrightScript + low-resource TV-software register, and a calibrated take on the ad-supported + smart-home thesis.' },

      { type: 'h2', text: 'The Roku SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Roku, why this team. They will probe whether you understand the CTV-ad-supported thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the embedded-TV-OS register.',
        'Technical screen -- 60 minutes. Live coding (C / C++ for Roku OS + low-level; BrightScript for legacy app; SceneGraph / TS / React for newer apps; Go + Python for cloud services).',
        'System design -- 60 minutes. Real Roku-shaped scenarios. "Design Roku OS\'s memory + power-management for a 1GB-RAM TV running 4K video playback + an ad-tile + voice command." "Walk me through The Roku Channel\'s ad-insertion + retargeting pipeline." "Design the Roku Smart Home cloud-to-device sync."',
        'Onsite or final loop -- 3 rounds: deeper coding, deeper system design, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Roku user opens The Roku Channel and starts watching a movie with embedded ads. Trace from app launch to ad-pod-played."',
        '"Design Roku OS for a 1GB-RAM TV running 4K video + an ad-tile + voice command. Memory + power-management + latency constraints."',
        '"Walk me through The Roku Channel\'s ad-insertion + retargeting pipeline. Server-side ad-stitching + the OneView retargeting + the Walmart-data integration."',
        '"Design the Roku Smart Home cloud-to-device sync. Camera + Doorbell + Plug + Light state must sync reliably + securely."',
        '"You inherit a Roku OS optimisation that reduces memory by 12% but introduces a 0.05% chance of a UI hiccup on one specific TV model. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a legacy BrightScript app to SceneGraph / TypeScript. Argue your side."',
        '"What is your real opinion on the ad-supported + retail-media strategy (the Walmart-data partnership)? Where does it win? Where does it create privacy / regulatory friction?"',
        '"Walk me through the most subtle bug you have hit in an embedded-OS or low-resource system."',
        '"Why Roku and not [Amazon Fire TV / Google TV / Apple TV / a smart-TV-OS-only competitor]?"',
        '"How would you reduce app cold-start time on Roku by 30% without weakening startup memory budget?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Roku specifically' },
      { type: 'ol', items: [
        'No embedded-OS reasoning. Roku is structurally an embedded TV-OS + CTV-ad-platform company. Stories that miss low-resource / power / memory / TV-UX concepts miss the company.',
        'Generic streaming answers. Roku has very specific architecture (Roku OS + BrightScript + SceneGraph, OneView ad platform + the Watermark, The Roku Channel + the live + the originals stack, Roku Smart Home cloud-to-device). Generic answers miss Roku-specific context.',
        'No opinion on the ad-supported + retail-media direction. The Walmart-data partnership + the OneView platform is central. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the TV-as-living-room register. Roku\'s users are families on couches, not pro consumers. Stories framed for power-users-only miss the actual customer reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use a Roku device + browse The Roku Channel for 15 minutes. Note three friction points + three things you respect.',
        '15-35 min: Stack drill. Embedded TV-OS patterns, BrightScript + SceneGraph basics, server-side ad-insertion, OneView retargeting + Watermark, Smart Home cloud-to-device sync. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Roku OS resource management, Ad pipeline, Smart Home sync. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with embedded + CTV-ad framing. 200 words each.',
        '70-78 min: Read on Roku vs Amazon Fire TV vs Google TV. Articulate where Roku wins (focused TV-OS, scale, OneView ads) vs where competitors win.',
        '78-80 min: Close. One opinion on retail-media + Walmart partnership, one specific Roku decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Roku remote in 2026?' },
      { type: 'p', text: 'Hybrid -- San Jose (HQ) + Austin + Cambridge MA + London + Dublin hubs. Many engineering roles remote within US. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-band CTV + streaming SaaS. RSU is post-2022 corrected. Total comp competitive at senior+ but below FAANG mid-band in many bands.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including CTV-OS + ad-supported streaming platforms like Roku. Free at aimvantage.uk.' },

      { type: 'p', text: 'Roku hires engineers who can reason about embedded TV-OS + CTV at planetary scale, navigate the BrightScript + low-resource register, and engage with the ad-supported + retail-media thesis honestly. Prep the Roku OS + Channel + OneView stack, the Smart Home context, and a calibrated take on the Walmart-data + ad-monetisation direction.' },
    ],
  },
];
