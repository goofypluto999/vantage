// 3 more interview-guide posts -- batch 26 (semiconductor + networking)
// AMD, Intel, Cisco.

import type { BlogPost } from './blogPosts';

export const newBlogPosts26: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) AMD SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'amd-software-engineer-interview-2026',
    title: 'AMD software engineer interview: the post-MI300X + ROCm + Pensando 2026 loop',
    description: 'The AMD software engineer interview in 2026 -- five stages, the post-MI300X + ROCm 7 + Pensando + Xilinx context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['AMD', 'Software Engineer Interview', 'GPU', 'ROCm', 'AI Accelerators', 'Pensando', 'Interview Prep'],
    excerpt: 'AMD pushed hard into AI accelerators with MI300X / MI325X / MI350 series, opened ROCm to be the CUDA alternative, integrated Pensando (DPUs) and Xilinx (FPGAs). The 2026 engineer loop tests for systems + compiler + AI-accelerator depth.',
    hook: 'AMD is the company trying to be the credible alternative to Nvidia for AI. The 2026 interview filters for engineers who can ship GPU + compiler + ROCm stack at scale.',
    sections: [
      { type: 'p', text: 'AMD (NASDAQ: AMD) pushed hard into AI with the MI300X / MI325X / MI350 Instinct accelerators (the Nvidia H100 / H200 / B100 competitors), ROCm 7 (the open-source CUDA alternative), the Pensando (acquired 2022, DPUs) + Xilinx (acquired 2022, FPGAs + adaptive computing) integrations, the deepening hyperscaler relationships (Microsoft, Meta, Oracle, IBM), and the EPYC server CPU + Ryzen consumer / Threadripper / Ryzen AI laptop lineup. The 2026 engineering team is hiring across GPU architecture + ROCm (the kernel + compiler + runtime + libraries stack -- HIP, MIGraphX, TheRock), Instinct + Radeon driver / firmware, CPU architecture (EPYC + Ryzen), Pensando (DPU + Smart Switch), Xilinx Versal + Alveo, and the Vitis AI + AI software stack. The 2026 hiring bar is high but specific: systems + compiler + AI-accelerator depth, comfort with the open-source vs proprietary register (ROCm vs CUDA), and a calibrated take on the Nvidia-competitive thesis.' },

      { type: 'h2', text: 'The AMD SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why AMD, why this team. They will probe whether you understand the AI + open-source thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the systems / compiler register.',
        'Technical screen -- 60 minutes. Live coding (C++ for kernel / driver / compiler; Python for AI / ROCm tools; sometimes Verilog / SystemVerilog for hardware-adjacent roles).',
        'System design -- 60 minutes. Real AMD-shaped scenarios. "Design ROCm runtime for an MI300X 8-GPU node serving Llama-3-70B." "Walk me through the HIP kernel + LLVM compiler pipeline." "Design Pensando DPU offload for an NVMe-over-fabric workload."',
        'Onsite or final loop -- 4-5 rounds: deeper coding (often C++ / systems), deeper system design, hardware-adjacent depth (depending on team), behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a PyTorch model is compiled to run on an MI300X. Trace it from torch.compile through HIP to GPU execution."',
        '"Design ROCm runtime for an MI300X 8-GPU node serving Llama-3-70B. Multi-GPU sharding + KV-cache across the node."',
        '"Walk me through the HIP kernel + LLVM compiler pipeline. How does the IR transform from device code to ISA?"',
        '"Design Pensando DPU offload for an NVMe-over-fabric workload. The DPU handles all storage I/O without involving the host CPU. Walk me through the architecture."',
        '"You inherit a ROCm kernel optimisation that improves Llama-3 inference throughput by 18% but adds a 5% accuracy regression in a specific quantisation path. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in ROCm-CUDA-compatibility (HIPify) or invest in a ROCm-native developer experience. Argue your side."',
        '"What is your real opinion on the ROCm-vs-CUDA strategy? Where does it win? Where does the moat advantage favour Nvidia?"',
        '"Walk me through a subtle bug you have hit in a kernel / driver / compiler. The kind that takes weeks to track."',
        '"Why AMD and not [Nvidia / Intel / Arm-on-server (AWS Graviton, Ampere) / a startup]?"',
        '"How would you reduce MI300X inference latency for a 70B-parameter model by 30% without weakening accuracy?"',
      ] },

      { type: 'h2', text: 'What kills candidates at AMD specifically' },
      { type: 'ol', items: [
        'No systems / compiler reasoning. AMD is structurally a systems + hardware-software-codesign company. Stories that miss the compiler + runtime + driver stack miss the company.',
        'Generic GPU answers. AMD has specific architecture (the CDNA + RDNA architectures, the Infinity Fabric, the HBM3 memory hierarchy, the chiplet design). Generic CUDA-flavoured answers miss AMD-specific context.',
        'No opinion on the ROCm-vs-CUDA strategy. ROCm is central to AMD\'s AI thesis. Coming without an opinion on the path-to-parity + the developer-ecosystem trade-offs signals shallow prep.',
        'Tone-deaf on the Nvidia-competitive register. Nvidia has a moat. Stories that ignore this miss the actual operating reality. Calibrated take expected.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read one AMD GPU architecture page (CDNA 3 / RDNA 4 / MI300X). Read one ROCm release post.',
        '15-35 min: Stack drill. GPU architecture (SIMT, warps, memory hierarchy, HBM), HIP + ROCm runtime, LLVM compiler basics, Pensando DPU architecture, Xilinx Versal architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- ROCm node serving Llama-3, HIP kernel compilation, Pensando DPU offload. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with systems + compiler framing. 200 words each.',
        '70-78 min: Read on AMD vs Nvidia. Articulate where AMD wins (open-source, cost / perf, chiplet design, x86 server CPU) vs where Nvidia wins (CUDA + libraries + ecosystem).',
        '78-80 min: Close. One opinion on the ROCm strategy, one specific AMD decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is AMD remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Santa Clara + Austin + Markham + Bengaluru + Munich hubs. Some senior+ remote roles. RTO has tightened. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of semiconductor band post-2024 stock recovery. Strong RSU; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including semiconductor + AI accelerator companies like AMD. Free at aimvantage.uk.' },

      { type: 'p', text: 'AMD hires engineers who can reason about systems + compilers + AI accelerators, navigate the ROCm-vs-CUDA register, and engage with the Nvidia-competitive thesis honestly. Prep the GPU + ROCm stack, the Pensando + Xilinx context, and a calibrated take on the open-source-AI direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) INTEL SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'intel-software-engineer-interview-2026',
    title: 'Intel software engineer interview: the post-Gaudi + IDM 2.0 + Foundry 2026 loop',
    description: 'The Intel software engineer interview in 2026 -- five stages, the post-Gaudi 3 + Lunar Lake + IDM 2.0 + Foundry context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Intel', 'Software Engineer Interview', 'CPU', 'Gaudi', 'oneAPI', 'IDM 2.0', 'Foundry', 'Interview Prep'],
    excerpt: 'Intel pushed through the IDM 2.0 restructure, shipped Gaudi 3 (AI accelerator), Lunar Lake + Arrow Lake + Panther Lake (client + server CPUs), and stood up Intel Foundry. The 2026 engineer loop tests for systems + compiler depth + the IDM-2.0 register.',
    hook: 'Intel is the company trying to claw back from x86 commoditisation + the Nvidia AI lead simultaneously. The 2026 interview filters for engineers who can hold both threads.',
    sections: [
      { type: 'p', text: 'Intel (NASDAQ: INTC) executed the IDM 2.0 restructure under (then) Pat Gelsinger and the subsequent leadership, shipped Gaudi 3 (the H100 / MI300X competitor), the Lunar Lake + Arrow Lake + Panther Lake CPU family (with NPU for on-device AI), the Battlemage discrete GPU (Arc), opened Intel Foundry Services (third-party chip manufacturing -- 18A / 14A nodes), and continued the oneAPI cross-architecture programming model push. The 2026 engineering team is hiring across CPU architecture (Core + Xeon + Atom), GPU architecture (Xe + Battlemage), Gaudi + AI accelerators (Habana Labs team), oneAPI + compilers + SYCL, Intel Foundry software (process design kits, EDA integration), networking + IPU (Mount Evans, Granite Rapids-D), the developer tools (VTune, Advisor, oneDNN), and the new AI software stack (OpenVINO, NPU runtime). The 2026 hiring bar is high but specific: systems + compiler + chip-software-codesign depth, comfort with the IDM 2.0 + Foundry register, and a calibrated take on the post-Gelsinger trajectory.' },

      { type: 'h2', text: 'The Intel SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Intel, why this team. They will probe whether you understand the IDM 2.0 + Foundry context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the systems / chip-software-codesign register.',
        'Technical screen -- 60 minutes. Live coding (C / C++ for kernel + driver + compiler; Python for ML / oneAPI tools; sometimes SystemVerilog or VHDL for hardware-adjacent roles).',
        'System design -- 60 minutes. Real Intel-shaped scenarios. "Design Gaudi 3 cluster training a 70B-parameter model with the Gaudi-HCCL interconnect." "Walk me through the oneAPI + SYCL kernel compilation across CPU + GPU + Gaudi." "Design the Lunar Lake NPU integration with Windows ML."',
        'Onsite or final loop -- 4-5 rounds: deeper coding (often C / C++), deeper system design, hardware-adjacent depth, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a PyTorch model runs on Lunar Lake with the NPU. Trace it from PyTorch through OpenVINO to NPU execution."',
        '"Design Gaudi 3 cluster training a 70B-parameter model with Habana Collective Communications Library (HCCL). How does the scaling efficiency compare to NVLink?"',
        '"Walk me through the oneAPI + SYCL kernel compilation. How does the IR target CPU + GPU + Gaudi from a single source?"',
        '"Design the Lunar Lake NPU integration with Windows ML. The NPU runs concurrent with CPU + GPU. Walk me through the scheduler + power-budgeting."',
        '"You inherit a Gaudi 3 kernel optimisation that improves Llama-3 throughput by 18% but breaks the FP8 stability for one specific layer. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in Gaudi-CUDA-compatibility (a HIPify-equivalent) or invest in a Gaudi-native developer experience. Argue your side."',
        '"What is your real opinion on the IDM 2.0 + Foundry strategy? Where does it create defensible value? Where does it leave Intel exposed?"',
        '"Walk me through a subtle bug you have hit in a kernel / driver / compiler at the chip-software-codesign boundary."',
        '"Why Intel and not [AMD / Nvidia / Arm-on-server / a Foundry-only play like TSMC]?"',
        '"How would you reduce Gaudi 3 inference latency for a 70B-parameter model by 30%?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Intel specifically' },
      { type: 'ol', items: [
        'No systems / compiler reasoning. Intel is structurally a chip-software-codesign company. Stories that miss the compiler + runtime + driver + microarchitecture stack miss the company.',
        'Generic x86 answers. Intel has very specific architecture (the P-core + E-core hybrid, the AMX / AVX-512 / VNNI ISA extensions, the Xe + Gaudi accelerators, the IPU networking). Generic answers miss Intel-specific context.',
        'No opinion on the IDM 2.0 / Foundry strategy. The Foundry pivot is central to the recovery thesis. Coming without an opinion on whether the foundry-customer strategy works (vs the Nvidia / AMD playbook of fabless + design focus) signals shallow prep.',
        'Tone-deaf on the post-Gelsinger context. Intel restructured aggressively in 2024-25. Stories that ignore the cost-cut + the strategic-priorities register miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read one Intel architecture page (Lunar Lake / Gaudi 3 / 18A). Read the most recent earnings call summary.',
        '15-35 min: Stack drill. x86 microarchitecture (P-core + E-core, AMX, AVX-512), Gaudi 3 architecture (Tensor Processor Cores, HCCL), oneAPI + SYCL, OpenVINO + NPU runtime, Intel Foundry node basics (18A / 14A). Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Gaudi 3 cluster, oneAPI multi-arch, Lunar Lake NPU. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with chip-software-codesign + IDM 2.0 framing. 200 words each.',
        '70-78 min: Read on Intel vs Nvidia vs AMD. Articulate where Intel wins (x86 server install base, on-device NPU, Foundry diversification) vs where competitors win.',
        '78-80 min: Close. One opinion on the IDM 2.0 strategy, one specific Intel decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Intel remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Santa Clara + Hillsboro + Folsom + Ohio + Israel + Bengaluru + Penang + Kiryat Gat hubs. Many roles require in-person due to lab-adjacent work. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-band semiconductor post-2024 restructure. RSU has been pressured. Total comp competitive at senior+ but below AMD / Nvidia at equivalent levels in many bands.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including semiconductor + chip-software companies like Intel. Free at aimvantage.uk.' },

      { type: 'p', text: 'Intel hires engineers who can reason about systems + compilers + chip-software-codesign, navigate the IDM 2.0 + Foundry register, and engage with the post-restructure trajectory honestly. Prep the x86 + Gaudi stack, the oneAPI context, and a calibrated take on the recovery thesis.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) CISCO SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'cisco-software-engineer-interview-2026',
    title: 'Cisco software engineer interview: the post-Splunk + AI Networking 2026 loop',
    description: 'The Cisco software engineer interview in 2026 -- five stages, the post-Splunk integration + AI Networking + Hypershield context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Cisco', 'Software Engineer Interview', 'Networking', 'Splunk', 'AI Networking', 'Security', 'Interview Prep'],
    excerpt: 'Cisco completed the Splunk acquisition ($28B, 2024), shipped Hypershield (AI security), and pushed AI Networking (Silicon One + the Nexus / Catalyst lines). The 2026 engineer loop tests for networking + distributed-systems depth + the Splunk-integration register.',
    hook: 'Cisco is the networking giant that bought Splunk and is repositioning as an AI + networking + security platform. The 2026 interview filters for engineers who can bridge the legacy networking stack and the modern observability + AI layer.',
    sections: [
      { type: 'p', text: 'Cisco (NASDAQ: CSCO) completed the Splunk acquisition (~$28B, closed March 2024) -- the largest acquisition in Cisco history, integrated Splunk\'s observability + SIEM into the Cisco security + networking portfolio, shipped Hypershield (the AI-driven security mesh, announced 2024), pushed AI Networking with the Silicon One ASIC family + Nexus + Catalyst switching, expanded the Webex + Collaboration suite, and continued the routing + Meraki cloud-managed + DNA Center / Catalyst Center products. The 2026 engineering team is hiring across networking software (Nexus + Catalyst + IOS XR + Meraki), Silicon One ASIC + chip software, Splunk Cloud + Enterprise + Observability + SOAR, Hypershield + security (Talos, Duo, ThousandEyes), Webex + Collaboration, and the developer + APIs / IBN (Intent-Based Networking) products. The 2026 hiring bar is competitive and specific: networking + distributed-systems depth, comfort with the legacy + cloud register, and a calibrated take on the Splunk-integration thesis.' },

      { type: 'h2', text: 'The Cisco SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Cisco, why this team. They will probe whether you understand the Splunk-integration thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the networking + observability register.',
        'Technical screen -- 60 minutes. Live coding (C / C++ for IOS / NX-OS internals; Python for automation / tools; Go for cloud services; Java for Splunk).',
        'System design -- 60 minutes. Real Cisco-shaped scenarios. "Design a Nexus switch control plane handling 100K+ MAC entries + 1M+ ARP entries at line rate." "Walk me through Hypershield -- AI-driven micro-segmentation across cloud + on-prem." "Design the Splunk Cloud ingest pipeline at petabyte-per-day."',
        'Onsite or final loop -- 3-4 rounds: deeper coding, deeper system design, networking or security or observability depending on team, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a packet arrives at a Nexus 9000 switch interface and is forwarded based on the MAC + VLAN. Trace from ingress to egress."',
        '"Design a Nexus switch control plane handling 100K+ MAC entries + 1M+ ARP entries at line rate. The data plane is the Silicon One ASIC."',
        '"Walk me through Hypershield. AI-driven micro-segmentation across cloud + on-prem. How does the policy + telemetry + enforcement-point split work?"',
        '"Design the Splunk Cloud ingest pipeline at petabyte-per-day. The customer expects sub-30-second time-to-query."',
        '"You inherit a forwarding-plane optimisation that improves throughput by 15% but adds a 5% regression to one specific feature path. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in IOS XR feature parity with NX-OS or push customers to the Catalyst Center / DNA Center cloud-managed model. Argue your side."',
        '"What is your real opinion on the Splunk-integration strategy? Where does it create defensible value? Where does it create execution risk?"',
        '"Walk me through the most subtle bug you have hit in a high-throughput networking or distributed-systems product."',
        '"Why Cisco and not [Arista / Juniper / a hyperscaler-native networking stack / Palo Alto for security]?"',
        '"How would you reduce ingest-to-query latency in Splunk Cloud by 30% without weakening the index guarantees?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Cisco specifically' },
      { type: 'ol', items: [
        'No networking-fundamentals reasoning. Cisco is structurally a networking company. Stories that miss L2 / L3 / OSPF / BGP / EVPN basics or the data-plane + control-plane split miss the company.',
        'Generic SaaS answers. Cisco has very specific architecture (Silicon One ASICs, IOS / NX-OS internals, the Cisco Validated Design ecosystem, Meraki cloud-managed, the Splunk index + SmartStore). Generic answers miss Cisco-specific context.',
        'No opinion on Splunk integration. Splunk is the largest bet in Cisco\'s history. Coming without an opinion on whether the integration thesis works (vs alternatives like keep-them-separate) signals shallow prep.',
        'Tone-deaf on the enterprise-customer register. Cisco sells to the most regulated Fortune-500 enterprises + governments. Stories that ignore the install-base + the lifecycle support context miss the actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read one Cisco engineering page (Silicon One / Hypershield / Splunk Observability). Read one recent earnings call summary.',
        '15-35 min: Stack drill. Networking fundamentals (L2 / L3 / EVPN / VXLAN / BGP), Silicon One ASIC basics, IOS / NX-OS internals, Splunk index + SmartStore, Hypershield enforcement model. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Nexus control plane, Hypershield, Splunk ingest. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with networking + enterprise-customer framing. 200 words each.',
        '70-78 min: Read on Cisco vs Arista vs Juniper. Articulate where Cisco wins (install base, Splunk integration, full-stack networking + security + collaboration) vs where competitors win.',
        '78-80 min: Close. One opinion on Splunk integration, one specific Cisco decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Cisco remote in 2026?' },
      { type: 'p', text: 'Hybrid -- San Jose + RTP + Bengaluru + Krakow hubs. Some senior+ remote roles. RTO has tightened. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-band enterprise tech comp. RSU stable but stock has been range-bound. Total comp competitive at senior+ but below FAANG mid-band at equivalent levels in many bands.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including networking + observability + security companies like Cisco. Free at aimvantage.uk.' },

      { type: 'p', text: 'Cisco hires engineers who can reason about networking fundamentals at line rate, navigate the Splunk-integration register, and engage with the AI Networking + security-mesh thesis honestly. Prep the IOS / NX-OS stack, the Silicon One context, the Splunk + Hypershield architecture, and a calibrated take on the legacy + modern bridge.' },
    ],
  },
];
