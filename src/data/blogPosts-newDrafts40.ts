// 3 more interview-guide posts -- batch 40 (EV trio)
// Rivian (US, truck + VW JV), Lucid (luxury EV, Saudi-backed), BYD (China giant).

import type { BlogPost } from './blogPosts';

export const newBlogPosts40: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) RIVIAN SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'rivian-software-engineer-interview-2026',
    title: 'Rivian software engineer interview: the post-R2 + Volkswagen JV + R1 refresh 2026 loop',
    description: 'The Rivian software engineer interview in 2026 -- five stages, the post-R2 + Volkswagen JV ($5.8B) + R1 refresh + EDV context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Rivian', 'Software Engineer Interview', 'EV', 'R2', 'Volkswagen JV', 'Zonal Architecture', 'Interview Prep'],
    excerpt: 'Rivian shipped the R1 refresh + zonal architecture, locked in the Volkswagen JV ($5.8B), and is ramping R2 toward 2026 launch. The 2026 engineer loop tests for EV software + vehicle architecture + the post-VW-JV register.',
    hook: 'Rivian is the EV truck maker that survived 2023-24 cash-crunch + sold a JV stake to Volkswagen + is now ramping the cheaper R2. The 2026 interview filters for engineers who can ship vehicle software at startup velocity with automotive rigor.',
    sections: [
      { type: 'p', text: 'Rivian (NASDAQ: RIVN) finalised the Volkswagen JV ($5.8B over staged payments, Rivian Volkswagen Group Technology LLC — a Carlsbad-based JV focused on next-gen software-defined-vehicle architecture for both companies\' future EVs), shipped the R1 second-generation (2024+, with zonal electrical architecture, Tri-Motor, +1000hp Quad-Motor option, and the new R1T+R1S Standard + Performance trims), continued the EDV (Electric Delivery Van) deliveries to Amazon + other fleet customers, and is ramping R2 toward 2026 launch (the lower-priced ~$45K mid-size SUV on a smaller platform, manufactured at Normal IL — the financial-make-or-break product). The 2026 engineering team is hiring across the vehicle software platform (the Rivian-OS + the new zonal-architecture-friendly software stack), the autonomy / driver-assist stack (the Rivian Autonomy Platform on the second-generation hardware), the connected services (the in-vehicle infotainment, the OTA + cloud + mobile-app stack), the manufacturing software (the production-ramp engineering at Normal IL), the energy products + Charging Network, the EDV product, and the Volkswagen-JV engineering (the Carlsbad team building the next-gen platform for VW scout + Audi + others). The 2026 hiring bar is competitive and specific: vehicle software + zonal-architecture depth, comfort with the cash-conscious post-2023 register, and a calibrated take on the VW-JV + R2-ramp + Tesla-competitive thesis.' },

      { type: 'h2', text: 'The Rivian SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Rivian, why this team. They will probe whether you understand the post-VW-JV trajectory.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the vehicle-software register.',
        'Technical screen -- 60 minutes. Live coding (C++ for vehicle / embedded / safety-critical; Python for tools + ML; Rust for newer code; Swift / Kotlin for the Rivian app).',
        'System design -- 60 minutes. Real Rivian-shaped scenarios. "Design Rivian\'s zonal electrical architecture software (replacing the legacy domain-controller approach)." "Walk me through the OTA + recovery strategy for a vehicle that bricks mid-update at peak charging hour." "Design the Rivian Autonomy stack for highway-only + parking-lot-only assist with explicit driver supervision."',
        'Onsite or final loop -- 3 rounds: deeper coding (often C++), deeper system design, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Rivian R1 driver unlocks the vehicle + drives off. Trace from key-fob/app authentication through wake-up + first-mile."',
        '"Design Rivian\'s zonal electrical architecture software. 4 zonal controllers replace the legacy domain-controllers. Walk me through the software architecture + the migration strategy from the legacy."',
        '"Walk me through the OTA + recovery strategy. A vehicle bricks mid-update at peak. How does the rollback + recovery + customer-experience flow work?"',
        '"Design Rivian Autonomy for highway-only + parking-lot-only. Explicit driver supervision boundary, no end-to-end FSD-style claims."',
        '"You inherit an OTA change that improves battery-management by 4% but introduces a 0.1% chance of a battery alert in cold weather. First three actions?"',
        '"You disagree with a senior engineer on whether to consolidate two zonal-controllers or keep them split. Argue your side."',
        '"What is your real opinion on the Volkswagen JV? Where does it win? Where does it create execution drag (two-master problem)?"',
        '"Walk me through the most subtle bug you have hit in an automotive or embedded-safety-critical system."',
        '"Why Rivian and not [Tesla / Lucid / Ford F-150 Lightning / a startup like Slate Auto]?"',
        '"How would you reduce vehicle cold-start time by 30% without weakening the safety-init sequence?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Rivian specifically' },
      { type: 'ol', items: [
        'No automotive-software reasoning. Rivian is structurally a vehicle-software + manufacturing company. Stories that miss CAN / Ethernet / AUTOSAR / safety-critical / ASIL concepts miss the company.',
        'Generic startup answers. Rivian has very specific architecture (the second-generation zonal architecture, the Rivian-OS + autonomy + connected stack, the manufacturing-software at Normal). Generic answers miss Rivian-specific context.',
        'No opinion on the VW JV + R2 thesis. The VW JV + R2 ramp are central to the survival + scaling story. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the cash-conscious post-2023 register. Rivian went through cash-crunch in 2023-24. Stories that miss the cost-discipline reality miss the operating environment.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about Rivian R1 + R2 + the VW JV announcement + the zonal-architecture context.',
        '15-35 min: Stack drill. Automotive software fundamentals (CAN, Ethernet, AUTOSAR), zonal vs domain-controller architecture, OTA + safe-recovery patterns, autonomy stack (perception, planning, control). Two minutes per concept.',
        '35-55 min: System design. Pick one of -- zonal architecture, OTA recovery, autonomy stack. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with vehicle-software + cash-conscious framing. 200 words each.',
        '70-78 min: Read on Rivian vs Tesla vs Ford Lightning. Articulate where Rivian wins (truck-focus, brand, JV access to VW) vs where competitors win.',
        '78-80 min: Close. One opinion on the VW JV + R2 trajectory, one specific Rivian decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Rivian remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Irvine (HQ, software-heavy) + Plymouth MI + Normal IL (manufacturing) + Palo Alto + Carlsbad (VW JV). Many roles require physical access to vehicles + manufacturing lines. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-band EV post-2024 stock recovery. RSU is post-correction but VW JV cash improved runway. Total comp competitive at senior+ but below FAANG mid-band in many bands.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including EV companies like Rivian. Free at aimvantage.uk.' },

      { type: 'p', text: 'Rivian hires engineers who can reason about vehicle software + zonal architecture, navigate the post-VW-JV reality, and engage with the R2 + cash-discipline thesis honestly. Prep the Rivian-OS + autonomy + manufacturing stack, the VW JV context, and a calibrated take on the Tesla-competitive direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) LUCID SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'lucid-software-engineer-interview-2026',
    title: 'Lucid software engineer interview: the post-Gravity + Earnings-pressure 2026 loop',
    description: 'The Lucid software engineer interview in 2026 -- five stages, the post-Gravity SUV launch + PIF $1B+ investment + Air refresh + earnings-pressure context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Lucid Motors', 'Software Engineer Interview', 'EV', 'Gravity SUV', 'Air Sapphire', 'Luxury EV', 'Interview Prep'],
    excerpt: 'Lucid launched Gravity (their luxury 7-seat SUV), shipped the Air refresh, and continues the PIF-backed scale ramp. The 2026 engineer loop tests for luxury-EV software depth + the cash-and-PIF register.',
    hook: 'Lucid is the Saudi-PIF-backed luxury EV maker producing the most efficient EVs in the US + ramping Gravity. The 2026 interview filters for engineers who can ship at luxury-precision + cash-disciplined velocity.',
    sections: [
      { type: 'p', text: 'Lucid Motors (NASDAQ: LCID) launched Gravity (the luxury 7-seat SUV, deliveries from late 2024, with a 450+ mile range on the Grand Touring trim), shipped the Air refresh (2024-25, with the new Atlas powertrain efficiency gains + Lucid DreamDrive Pro updates), received additional PIF investment ($1B+ over 2024-25 to fund Gravity ramp + Midsize platform development), continued the EFFI manufacturing initiative at Casa Grande Arizona + AMP-2 in Saudi Arabia, and pushed toward the Midsize platform (the ~$48K target for 2026-27 launch). The 2026 engineering team is hiring across the vehicle software platform (the Lucid-UX + the OTA stack, the in-vehicle infotainment), DreamDrive (the ADAS / driver-assist suite, with the path toward Level 3 hands-free), the powertrain software (the famous Lucid Atlas + Sapphire architecture), the connected services + mobile app, the battery + thermal-management software, the manufacturing software (the Casa Grande + AMP-2 ramp), and the Saudi-Arabia ops + government-projects engineering. The 2026 hiring bar is competitive and specific: luxury-EV software + ADAS + battery-management depth, comfort with the cash-disciplined post-2023 register, and a calibrated take on the PIF-backed long-game + the Tesla / Mercedes EQ / Genesis competitive thesis.' },

      { type: 'h2', text: 'The Lucid SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Lucid, why this team. They will probe whether you understand the luxury-EV register + PIF context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the vehicle-software register.',
        'Technical screen -- 60 minutes. Live coding (C++ for vehicle + embedded; Python for tools + ML; Swift / Kotlin for the Lucid app).',
        'System design -- 60 minutes. Real Lucid-shaped scenarios. "Design the Gravity 7-seat SUV\'s OTA strategy for a vehicle with 50K+ lines of customer-visible UI software." "Walk me through DreamDrive Pro\'s hands-off highway autonomy + the driver-monitoring boundary." "Design the Lucid Atlas powertrain software for sub-5% efficiency loss across a 500+ mile range."',
        'Onsite or final loop -- 2-3 rounds: deeper coding (often C++), deeper system design, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Gravity owner starts a road trip with DreamDrive Pro engaged on the highway. Trace from engage to disengage."',
        '"Design the Gravity OTA strategy. 50K+ lines of customer-visible UI software, must update without breaking + roll back on failure."',
        '"Walk me through DreamDrive Pro\'s hands-off highway autonomy. The driver-monitoring + take-over-request boundary."',
        '"Design the Lucid Atlas powertrain software. Sub-5% efficiency loss across a 500+ mile range, the inverter + battery-management coordination."',
        '"You inherit a battery-management change that improves range by 3% but adds a 0.05% chance of a thermal alert in extreme heat. First three actions?"',
        '"You disagree with a senior engineer on whether to ship a Gravity firmware update with a known infotainment bug (cosmetic, not safety). Argue your side."',
        '"What is your real opinion on Lucid\'s position vs Tesla + Mercedes EQ + Genesis? Where does Lucid win? Where is it disadvantaged?"',
        '"Walk me through the most subtle bug you have hit in an automotive battery / thermal / powertrain system."',
        '"Why Lucid and not [Tesla / Rivian / Mercedes EQ / Porsche / a Chinese EV in the US]?"',
        '"How would you reduce Air infotainment cold-boot time by 30% on the second-generation hardware?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Lucid specifically' },
      { type: 'ol', items: [
        'No automotive + luxury reasoning. Lucid is structurally a luxury vehicle company. Stories that miss luxury UX + reliability + the Mercedes / Porsche benchmarks miss the company.',
        'Generic startup answers. Lucid has very specific architecture (the Lucid Atlas powertrain + Sapphire, the DreamDrive Pro stack, the Lucid-UX, the AMP-2 Saudi + Casa Grande manufacturing). Generic answers miss Lucid-specific context.',
        'No opinion on the PIF-backed long-game. Saudi PIF\'s ~60%+ stake is central. Coming without an opinion on the long-runway + the regulator / governance trade-off signals shallow prep.',
        'Tone-deaf on the post-2023 cash-discipline register. Lucid has burned a lot of cash + the PIF investments are conditional + watched. Stories that miss the cost-discipline reality miss the operating environment.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about Lucid Air + Gravity + the PIF investment + the Casa Grande / AMP-2 manufacturing context.',
        '15-35 min: Stack drill. Luxury-EV UX patterns, ADAS Level 3 + driver-monitoring, battery + thermal management, OTA + safe-recovery, multi-region manufacturing software. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Gravity OTA, DreamDrive Pro highway, Lucid Atlas powertrain. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with luxury-precision + cash-disciplined framing. 200 words each.',
        '70-78 min: Read on Lucid vs Tesla vs Mercedes EQ. Articulate where Lucid wins (efficiency + luxury + range) vs where competitors win.',
        '78-80 min: Close. One opinion on the PIF-backed long-game, one specific Lucid decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Lucid remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Newark CA (HQ) + Casa Grande AZ + AMP-2 Saudi Arabia + Detroit + Israel. Most engineering roles require physical access to vehicles or manufacturing. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-band EV. RSU is post-2022 corrected. Total comp competitive at senior+ but below FAANG mid-band in many bands. PIF-backed runway is the offset.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including luxury EV companies like Lucid. Free at aimvantage.uk.' },

      { type: 'p', text: 'Lucid hires engineers who can reason about luxury-EV software + ADAS + battery-thermal, navigate the PIF-backed long-game register, and engage with the Gravity + Midsize ramp thesis honestly. Prep the Lucid Atlas + DreamDrive + UX stack, the AMP-2 Saudi context, and a calibrated take on the Tesla-competitive direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) BYD SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'byd-software-engineer-interview-2026',
    title: 'BYD software engineer interview: the post-EU-tariffs + Yangwang + Blade-Battery 2026 loop',
    description: 'The BYD software engineer interview in 2026 -- five stages, the post-EU-tariffs + Yangwang luxury + Blade Battery + smart-vehicle DiPilot context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['BYD', 'Software Engineer Interview', 'Chinese EV', 'Blade Battery', 'Yangwang', 'DiPilot', 'Interview Prep'],
    excerpt: 'BYD overtook Tesla as the world\'s largest EV maker, launched Yangwang luxury sub-brand, the Blade Battery + Megawatt Flash Charging, DiPilot 100/300 ADAS, and is navigating EU + US tariffs. The 2026 engineer loop tests for vertical-integration + smart-vehicle software depth.',
    hook: 'BYD is the Chinese EV giant that overtook Tesla on volume + ships everything from battery cells to luxury Yangwang SUVs in-house. The 2026 interview filters for engineers who can ship at vertical-integration + China-velocity scale.',
    sections: [
      { type: 'p', text: 'BYD (SHE: 002594, HKEX: 1211) overtook Tesla as the world\'s largest EV (BEV + PHEV) maker in late 2023 + held the lead through 2024-25, launched Yangwang (the luxury sub-brand: U8 SUV, U9 supercar, U7 sedan), shipped the second-generation Blade Battery + Megawatt Flash Charging (the famous 1MW charging product, 10C rate, ~5-minute charge for 400km range), pushed DiPilot 100 + DiPilot 300 (the ADAS / smart-driving stack across all BYD brands), navigated the EU tariffs (the additional ~17-21% on top of standard import duty announced 2024) + US tariffs (the 100% on Chinese EVs under the Biden / Trump admin), opened the Hungarian + Thai + Brazilian factories for non-China production, and operates 800K+ employees across the BYD + FinDreams group. The 2026 engineering team is hiring across the vehicle software platform (the DiLink in-vehicle OS), DiPilot (the ADAS / smart-driving stack with the new neural-network architecture), the powertrain software (DM-i + DM-p hybrid, the all-electric e-Platform 3.0 EVO), Blade Battery + Megawatt Flash Charging software, the manufacturing software (the FinDreams Battery + the Hungarian + Thai + Brazilian factory expansion), and the international markets product (BYD-International, with separate software variants for EU + Brazil + Southeast Asia). The 2026 hiring bar is competitive and specific: smart-vehicle software + ADAS + vertical-integration depth, comfort with the China-velocity + non-China-expansion register, and a calibrated take on the BYD-vs-Tesla + EU-tariff context.' },

      { type: 'h2', text: 'The BYD SWE process -- 4-5 stages, ~3-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why BYD, why this team. They will probe whether you understand the China-velocity + international-expansion context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the smart-vehicle software register.',
        'Technical screen -- 60 minutes. Live coding (C++ for vehicle + embedded; Python for ML / DiPilot tools; Java / Kotlin for app).',
        'System design -- 60 minutes. Real BYD-shaped scenarios. "Design DiPilot 300\'s neural-network-based ADAS for Chinese-urban + highway driving." "Walk me through the Blade Battery + Megawatt Flash Charging software for 1MW charging without thermal runaway." "Design the BYD-International software variant strategy for EU + Brazil + Southeast Asia."',
        'Onsite or final loop -- 2-3 rounds: deeper coding, deeper system design, behavioural / culture-fit.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a BYD Han EV charges at a Megawatt Flash Charging station. Trace from plug-in to full charge."',
        '"Design the Blade Battery + Megawatt Flash Charging software for 1MW charging without thermal runaway. The thermal + power-electronics + battery-balance coordination."',
        '"Walk me through DiPilot 300\'s neural-network-based ADAS. China-urban driving has unique challenges (e-bikes, jaywalkers, ride-shares, varying lane discipline)."',
        '"Design the BYD-International software variant strategy. EU + Brazil + Southeast Asia, each with different regulations + customer expectations + language + charging infrastructure."',
        '"You inherit a DiPilot change that improves take-over-rate by 14% but adds a 0.01% chance of an unexpected lane-departure event. First three actions?"',
        '"You disagree with a senior engineer on whether to localise DiPilot specifically for European driving or adapt the China-trained model. Argue your side."',
        '"What is your real opinion on the EU + US tariffs on Chinese EVs? Where do they hurt BYD? Where does the response succeed?"',
        '"Walk me through the most subtle bug you have hit in a vehicle-software or battery-management system."',
        '"Why BYD and not [Tesla / Geely / Nio / Xpeng / a non-Chinese EV maker]?"',
        '"How would you reduce DiPilot inference latency by 30% on the SoC budget BYD uses?"',
      ] },

      { type: 'h2', text: 'What kills candidates at BYD specifically' },
      { type: 'ol', items: [
        'No vehicle + battery reasoning. BYD is structurally a vertically-integrated EV + battery company. Stories that miss battery-management / cell-chemistry / vehicle-software / SoC concepts miss the company.',
        'Generic ADAS answers. BYD has very specific architecture (DiPilot 100/300 with the recent neural-network architecture, the e-Platform 3.0 EVO, Blade Battery + Megawatt Flash Charging, the SkyShield door / Yi Si Fang four-motor torque-vectoring). Generic answers miss BYD-specific context.',
        'No opinion on the EU + US tariff register. The tariff context is central to BYD\'s international strategy. Coming without a calibrated take signals shallow prep.',
        'Tone-deaf on the China-velocity + international-expansion tension. BYD ships at China velocity. International markets require slower regulator engagement + local adaptation. Stories that miss this tension miss the actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about BYD models (Han, Tang, Seal, Atto, Yangwang U8 / U9 / U7) + the Blade Battery + Megawatt Flash Charging.',
        '15-35 min: Stack drill. Battery-management fundamentals (BMS, cell-balancing, thermal), ADAS neural-network architectures, e-Platform 3.0 EVO 800V architecture, China-urban driving edge cases, international software variants. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Megawatt Flash Charging, DiPilot 300, BYD-International variants. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with vehicle-software + China-velocity framing. 200 words each.',
        '70-78 min: Read on BYD vs Tesla vs Geely. Articulate where BYD wins (vertical integration, battery cost, range of products from $20K to $200K) vs where competitors win.',
        '78-80 min: Close. One opinion on the EU + US tariff register, one specific BYD decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is BYD remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Shenzhen (HQ) + Xi\'an + multiple manufacturing locations across China + Hungary + Thailand + Brazil + new R&D in Europe + US. Most roles require physical access. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of Chinese EV band. Cash + bonus + RSU-equivalent. Comp varies by location; competitive for senior engineers in China + bumped band for non-China hires.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in non-China locations. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including vertically-integrated EV companies like BYD. Free at aimvantage.uk.' },

      { type: 'p', text: 'BYD hires engineers who can reason about smart-vehicle software + battery + ADAS at vertical-integration scale, navigate the China-velocity + international-expansion register, and engage with the Tesla-competitive + EU + US tariff context honestly. Prep the DiPilot + Blade Battery + DiLink stack, the international-variant context, and a calibrated take on the global-EV-leader trajectory.' },
    ],
  },
];
