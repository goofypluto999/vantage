// 3 more interview-guide posts -- batch 35 (semiconductor + adjacent)
// ASML (lithography), TSMC (manufacturing), Qualcomm (chip design + 5G).

import type { BlogPost } from './blogPosts';

export const newBlogPosts35: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) ASML SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'asml-software-engineer-interview-2026',
    title: 'ASML software engineer interview: the post-High-NA EUV + AI 2026 loop',
    description: 'The ASML software engineer interview in 2026 -- five stages, the post-High-NA EUV (EXE) shipping + applications software + China-export-restriction context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['ASML', 'Software Engineer Interview', 'Semiconductor', 'EUV Lithography', 'High-NA', 'Veldhoven', 'Interview Prep'],
    excerpt: 'ASML ships High-NA EUV (EXE) machines, supplies every leading-edge fab, and operates from Veldhoven + global service hubs. The 2026 engineer loop tests for embedded-systems + control-systems + multi-discipline depth.',
    hook: 'ASML is the Dutch monopoly without which no leading-edge chip exists. The 2026 interview filters for engineers who can ship at the intersection of mechanical, optical, and software at the most-complex-machine-in-the-world scale.',
    sections: [
      { type: 'p', text: 'ASML (AMS / NASDAQ: ASML) ships High-NA EUV (the EXE platform: EXE:5000 + EXE:5200B, the next-gen lithography for sub-2nm nodes), supplies every leading-edge fab (TSMC, Samsung, Intel, SK hynix), operates DUV systems (NXT immersion + i-line + KrF + ArF) for mature + older nodes, and runs a global service + applications business. The 2026 engineering team is hiring across the platform software (the machine control + scheduling + supervisory software running on each EUV / DUV / metrology system), applications + computational lithography (the Tachyon + the inverse-lithography + the OPC + the source-mask-optimisation software), the customer service + applications engineering (deployed at customer fabs worldwide), Brion (the computational lithography subsidiary, Santa Clara), HMI (the e-beam metrology subsidiary, Taiwan), and the new AI-for-lithography efforts. The 2026 hiring bar is high and specific: embedded + control systems + multi-discipline (mechanical + optical + electrical + software) depth, comfort with the regulated export-controlled register (the China export-restriction context shapes everything), and a calibrated take on the High-NA + applications-software thesis.' },

      { type: 'h2', text: 'The ASML SWE process -- 4-5 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why ASML, why this team. They will probe whether you understand the export-controlled environment.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the embedded-systems register.',
        'Technical screen -- 60 minutes. Live coding (C++ for control / embedded; Python for applications + scripting; some C# / .NET for legacy systems). Often a control-systems-flavoured problem.',
        'System design + deep-dive -- 60 minutes. Real ASML-shaped scenarios. "Design the supervisory control software for an EUV scanner running 200 wafers per hour with 0.1nm accuracy." "Walk me through Tachyon\'s inverse-lithography compute pipeline." "Design the metrology-data-fusion + corrective-feedback loop with the scanner control."',
        'Onsite or final loop -- 3-4 rounds: deeper coding (often C++), deeper system design, behavioural / values, plus a multi-discipline / domain round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a wafer enters an EUV scanner. Trace it from load-port through exposure to off-load."',
        '"Design the supervisory control software for an EUV scanner. 200 wafers per hour, 0.1nm overlay accuracy, the multi-stage + sensor + actuator coordination."',
        '"Walk me through Tachyon\'s inverse-lithography compute pipeline. The Source-Mask Optimisation that runs on customer fabs."',
        '"Design the metrology-data-fusion + corrective-feedback loop. The HMI e-beam metrology measures pattern fidelity post-exposure, feeds back to the scanner."',
        '"You inherit a control-software change that improves throughput by 8% but adds a 0.05% chance of wafer-scrap on one specific recipe. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a part of the system from legacy C# to modern C++. Argue your side."',
        '"What is your real opinion on the China-export-restriction context? Where does it create execution challenge for ASML? Where is the constraint actually beneficial?"',
        '"Walk me through the most subtle bug you have hit in a control-systems or embedded-real-time product."',
        '"Why ASML and not [Applied Materials / KLA / Lam Research / Tokyo Electron]?"',
        '"How would you reduce time-from-wafer-load to first-exposure by 15% without weakening overlay accuracy?"',
      ] },

      { type: 'h2', text: 'What kills candidates at ASML specifically' },
      { type: 'ol', items: [
        'No control-systems / embedded reasoning. ASML is structurally a multi-discipline control-systems company. Stories that miss real-time / hard-deadline / sensor-fusion / closed-loop concepts miss the company.',
        'Generic software answers. ASML has very specific architecture (the supervisory + control software stack across the scanner platform, the Brion Tachyon applications software, the HMI e-beam metrology, the multi-discipline integration). Generic answers miss ASML-specific context.',
        'No engagement with the export-controlled context. The China export restrictions, the dual-use technology, the Wassenaar Arrangement context shape the operating reality. Stories that ignore this miss the actual register.',
        'Tone-deaf on the Dutch-led culture. ASML is famously Dutch-direct + engineering-led + long-cycle. Stories framed for SF-flavoured tech-cycles miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about ASML\'s EUV + High-NA + DUV product lines + the recent earnings call summary.',
        '15-35 min: Stack drill. EUV physics basics (13.5nm light, mirror optics, stage motion), inverse lithography + OPC, metrology + overlay, supervisory + real-time control patterns. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- scanner supervisory control, Tachyon ILT, metrology-feedback loop. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with embedded + multi-discipline framing. 200 words each.',
        '70-78 min: Read on ASML vs Applied Materials vs KLA vs Lam. Articulate where ASML wins (EUV monopoly, applications software, scanner expertise) vs where competitors win.',
        '78-80 min: Close. One opinion on High-NA + applications software, one specific ASML decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is ASML remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Veldhoven (HQ) + Wilton (US) + Santa Clara (Brion) + Linkou (HMI Taiwan) + customer-fab sites worldwide. Most engineering roles require physical access to scanners + labs. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of EU semiconductor-equipment band. Strong cash + RSU + bonus; the Netherlands 30%-ruling applies to many qualifying hires. Total comp matches FAANG-EU senior at equivalent levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles, especially in Veldhoven (30%-ruling). Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including semiconductor-equipment companies like ASML. Free at aimvantage.uk.' },

      { type: 'p', text: 'ASML hires engineers who can reason about multi-discipline control-systems at the most-complex-machine-in-the-world scale, navigate the export-controlled register, and engage with the High-NA + applications-software thesis honestly. Prep the supervisory control + Tachyon stack, the multi-discipline integration, and a calibrated take on the post-China-restriction direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) TSMC SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'tsmc-software-engineer-interview-2026',
    title: 'TSMC software engineer interview: the post-2nm + Arizona + JASM 2026 loop',
    description: 'The TSMC software engineer interview in 2026 -- five stages, the post-N2 (2nm) ramp + Arizona Fab 21 + JASM Japan + Dresden Europe context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['TSMC', 'Software Engineer Interview', 'Semiconductor', '2nm', 'CIM', 'Arizona', 'Interview Prep'],
    excerpt: 'TSMC ramps N2 (2nm), opened Arizona Fab 21, the JASM Japan fab, and the European Dresden fab. The 2026 engineer loop tests for CIM + manufacturing software + multi-fab depth.',
    hook: 'TSMC is the manufacturer behind every leading-edge chip and is now multi-region (Taiwan + Arizona + Japan + Europe). The 2026 interview filters for engineers who can ship CIM + manufacturing software at fab scale.',
    sections: [
      { type: 'p', text: 'TSMC (TPE: 2330, NYSE: TSM) ramps N2 (2nm, the first nanosheet GAA node, HVM 2025), continues N3 (3nm) at-scale production, opened Arizona Fab 21 (with Apple as anchor customer for N4P + N3 + N2 in expansion phases), the JASM (Japan Advanced Semiconductor Manufacturing) Kumamoto fab in Japan, and the Dresden (European Semiconductor Manufacturing Company) fab in Germany. The 2026 engineering team is hiring across the Computer-Integrated Manufacturing (CIM, the manufacturing execution + fab scheduling + tool control software running every fab), Process + Yield engineering software (the famous defect-detection + process-control + variance-reduction stack), Manufacturing AI (Precision-Wafer-to-Wafer matching, Computational Lithography + Tachyon-equivalent in-house, RPC), the Design Enablement Platform (the PDK + reference flows + foundry-partner software), and the new multi-region IT / OT integration (Arizona + JASM + Dresden coordination). The 2026 hiring bar is high and specific: manufacturing software + CIM depth, comfort with the multi-fab + multi-region register, and a calibrated take on the N2 + manufacturing-AI thesis.' },

      { type: 'h2', text: 'The TSMC SWE process -- 5 stages, ~6-8 weeks (TSMC interviews are slower + more thorough)' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why TSMC, why this team. They will probe whether you understand the manufacturing-software register.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the fab-manufacturing register.',
        'Technical screen -- 60 minutes. Live coding (C++ for control / embedded; Python for ML + applications; Java for some platform software; SQL for data pipelines).',
        'System design -- 60 minutes. Real TSMC-shaped scenarios. "Design the CIM scheduler for a 50K-wafer-per-month fab with 1000+ tools." "Walk me through the defect-detection ML pipeline at petabyte-per-month inspection-image scale." "Design the multi-fab + multi-region IT / OT coordination for N2 ramp across Hsinchu + Arizona."',
        'Onsite or final loop -- 3-4 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a wafer-lot enters a fab. Trace it from incoming-wafer-bank through the 1000+ process steps to outgoing-shipping."',
        '"Design the CIM scheduler. 50K-wafer-per-month fab, 1000+ tools, multi-product mix, dynamic recipe changes."',
        '"Walk me through the defect-detection ML pipeline. Petabyte-per-month inspection-image scale, multiple inspection-tool types, real-time vs offline."',
        '"Design the multi-fab + multi-region IT / OT coordination. N2 ramp simultaneously across Hsinchu + Arizona. Data sovereignty + IP protection."',
        '"You inherit a yield-improvement ML change that improves yield by 0.5% on average but causes a 5% yield drop on one specific product. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in deeper CIM modernisation or new applications-ML capabilities. Argue your side."',
        '"What is your real opinion on the multi-region expansion strategy (Arizona + Japan + Europe)? Where does it win? Where does it create execution risk?"',
        '"Walk me through the most subtle bug you have hit in a high-volume manufacturing or control-systems product."',
        '"Why TSMC and not [Samsung Foundry / Intel Foundry / GlobalFoundries / SMIC]?"',
        '"How would you reduce cycle-time (wafer-in to wafer-out) by 15% without weakening yield?"',
      ] },

      { type: 'h2', text: 'What kills candidates at TSMC specifically' },
      { type: 'ol', items: [
        'No manufacturing-software reasoning. TSMC is structurally a manufacturing-software + CIM company. Stories that miss MES / scheduling / process-control / yield concepts miss the company.',
        'Generic data-platform answers. TSMC has very specific architecture (the CIM stack, the Manufacturing AI suite, the multi-fab + multi-region coordination, the defect-detection + yield-management pipeline). Generic answers miss TSMC-specific context.',
        'No opinion on the multi-region expansion. The Arizona + JASM + Dresden expansion is the central strategic story. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the Taiwan-led culture. TSMC is famously Taiwanese-direct + hierarchical + extremely-disciplined. Stories framed for SF-flat-org culture miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about TSMC\'s N2 + N3 + N4 process technologies + the Arizona + JASM + Dresden context.',
        '15-35 min: Stack drill. MES + CIM fundamentals, scheduling algorithms in fabs, statistical process control (SPC), defect-detection ML, multi-fab data-sovereignty + IP-protection patterns. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- CIM scheduler, defect-detection ML, multi-fab coordination. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with manufacturing-software + high-discipline framing. 200 words each.',
        '70-78 min: Read on TSMC vs Samsung Foundry vs Intel Foundry. Articulate where TSMC wins (manufacturing excellence, applications-software, customer-relationships) vs where competitors win.',
        '78-80 min: Close. One opinion on multi-region expansion, one specific TSMC decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is TSMC remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Hsinchu (HQ) + Arizona + Kumamoto + Dresden + customer-engineering hubs. Most engineering roles require physical access to fabs or design-enablement labs. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of Taiwan semiconductor band; Arizona band aligned with US semiconductor mid-tier. Total comp at senior+ matches or exceeds equivalent Intel + Samsung levels but below US-FAANG software.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles, especially Arizona + Kumamoto + Dresden. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including semiconductor-manufacturing companies like TSMC. Free at aimvantage.uk.' },

      { type: 'p', text: 'TSMC hires engineers who can reason about manufacturing software + CIM at fab scale, navigate the multi-region register, and engage with the N2 + manufacturing-AI thesis honestly. Prep the CIM + defect-detection stack, the multi-fab context, and a calibrated take on the Taiwan-Arizona-Japan-Europe coordination direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) QUALCOMM SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'qualcomm-software-engineer-interview-2026',
    title: 'Qualcomm software engineer interview: the post-Snapdragon X + Automotive + IoT 2026 loop',
    description: 'The Qualcomm software engineer interview in 2026 -- five stages, the post-Snapdragon X Elite (PC) + Automotive + IoT + 5G/6G modem context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Qualcomm', 'Software Engineer Interview', 'Snapdragon', 'Mobile', 'Automotive', '5G Modem', 'Interview Prep'],
    excerpt: 'Qualcomm expanded from mobile chip leadership into PC (Snapdragon X), Automotive (Snapdragon Digital Chassis), Industrial IoT, 5G/6G modems, and the AI-on-device push. The 2026 engineer loop tests for chip-software + modem + multi-product depth.',
    hook: 'Qualcomm is the mobile chip giant betting on PC + Automotive + AI-on-device after Apple\'s in-house move. The 2026 interview filters for engineers who can ship chip-software across mobile + PC + automotive + IoT.',
    sections: [
      { type: 'p', text: 'Qualcomm (NASDAQ: QCOM) expanded from mobile chip leadership (Snapdragon 8 Gen 3 + 4 series for Android flagships) into PC (Snapdragon X Elite + X Plus, the Windows-on-ARM bet against Apple Silicon + Intel + AMD), Automotive (Snapdragon Digital Chassis: Cockpit, Connectivity, Ride, Auto Cloud Services -- with 30+ OEMs), Industrial IoT (the Aware + Intelligent Edge products), 5G and 6G modems (the X75 + X80 modem-RF), Wearables + Audio (Snapdragon Sound + Wear), the AI Hub (the developer + model-deployment platform for on-device AI), and the deeper Vision-AI + XR Snapdragon products. The 2026 engineering team is hiring across the SoC + IP design (CPU + GPU + NPU + ISP + modem cores), system software + drivers (Linux + Android + Windows + custom-RTOS for automotive), the modem stack (5G + 6G), automotive Cockpit + ADAS software, the AI Hub + on-device AI runtime, and the developer platform. The 2026 hiring bar is competitive and specific: chip-software + modem + multi-product depth, comfort with the on-device-AI + post-Apple-mobile competitive register, and a calibrated take on the PC + automotive expansion thesis.' },

      { type: 'h2', text: 'The Qualcomm SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Qualcomm, why this team. They will probe whether you understand the multi-product strategy.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the chip-software register.',
        'Technical screen -- 60 minutes. Live coding (C primarily for kernel + drivers; C++ for system software; Python for ML + tools; Verilog for HW-adjacent roles).',
        'System design -- 60 minutes. Real Qualcomm-shaped scenarios. "Design the Snapdragon X Elite Windows-on-ARM power-management subsystem." "Walk me through the 5G modem RRC + RLC + PDCP stack with sub-1ms latency requirements." "Design the Snapdragon Digital Chassis Cockpit safety partition (the QNX-based one)."',
        'Onsite or final loop -- 3-4 rounds: deeper coding (often C / C++), deeper system design, hardware-adjacent depth, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Snapdragon X Elite Windows laptop wakes from sleep. Trace it from button-press to ready-for-input."',
        '"Design the Snapdragon X Elite Windows-on-ARM power-management subsystem. The race-to-idle + heterogeneous cores + GPU + NPU coordination."',
        '"Walk me through the 5G modem RRC + RLC + PDCP stack. Sub-1ms latency, the carrier-aggregation + handover edge cases."',
        '"Design the Snapdragon Digital Chassis Cockpit. QNX-based safety partition for cluster + infotainment + ADAS sharing the same SoC. Walk me through the isolation + functional-safety boundary."',
        '"You inherit a kernel-driver change that reduces battery drain by 5% but adds a 0.01% chance of system hang on one specific peripheral. First three actions?"',
        '"You disagree with a senior engineer on whether to maintain a workaround for an Android-vendor quirk or push them to fix it. Argue your side."',
        '"What is your real opinion on the PC + Automotive expansion strategy? Where does Qualcomm win vs Apple Silicon + AMD + Intel? Where does the in-house-by-OEM threat hurt?"',
        '"Walk me through the most subtle bug you have hit in a kernel + driver or modem-stack system."',
        '"Why Qualcomm and not [Apple Silicon / MediaTek / NVIDIA mobile / AMD Ryzen AI]?"',
        '"How would you reduce on-device LLM-inference latency by 30% on a Snapdragon NPU?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Qualcomm specifically' },
      { type: 'ol', items: [
        'No chip-software / kernel reasoning. Qualcomm is structurally a chip-software + driver + modem-stack company. Stories that miss kernel / driver / power / scheduling concepts miss the company.',
        'Generic mobile answers. Qualcomm has very specific architecture (Snapdragon SoC architecture, the Hexagon NPU + Adreno GPU, the modem stack, the automotive QNX-based partition, the Snapdragon Sound + Wear + XR products). Generic answers miss Qualcomm-specific context.',
        'No opinion on PC + Automotive expansion. The post-Apple-mobile diversification is central to the post-2022 strategy. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the OEM-driven business model. Qualcomm sells to OEMs (Samsung, Xiaomi, BMW, Volkswagen). Stories framed for direct-to-consumer SaaS miss the actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about Snapdragon X Elite + Snapdragon Digital Chassis + Snapdragon 8 Elite product pages.',
        '15-35 min: Stack drill. SoC architecture, kernel + driver patterns, power-management + DVFS, modem RRC + RLC + PDCP stack, QNX safety + ASIL automotive context. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- X Elite power-management, 5G modem stack, Digital Chassis Cockpit. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with chip-software + multi-product framing. 200 words each.',
        '70-78 min: Read on Qualcomm vs Apple Silicon + AMD + Intel + MediaTek. Articulate where Qualcomm wins (PC bet, automotive penetration, modem leadership) vs where competitors win.',
        '78-80 min: Close. One opinion on the PC + Automotive direction, one specific Qualcomm decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Qualcomm remote in 2026?' },
      { type: 'p', text: 'Hybrid -- San Diego (HQ) + Boulder + Austin + Bengaluru + Cork + Tokyo hubs. Some senior+ remote roles. Many engineering roles require lab access. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of US semiconductor band. Strong RSU; total comp matches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including chip-software companies like Qualcomm. Free at aimvantage.uk.' },

      { type: 'p', text: 'Qualcomm hires engineers who can reason about chip-software + modems + multi-product, navigate the post-Apple-mobile diversification register, and engage with the PC + Automotive + on-device-AI thesis honestly. Prep the SoC + modem + Digital Chassis stack, the on-device AI context, and a calibrated take on the OEM-customer direction.' },
    ],
  },
];
