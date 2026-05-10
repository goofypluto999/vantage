// 3 more interview-guide posts -- batch 31 (cybersecurity)
// CrowdStrike, Wiz, Palo Alto Networks.

import type { BlogPost } from './blogPosts';

export const newBlogPosts31: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) CROWDSTRIKE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'crowdstrike-software-engineer-interview-2026',
    title: 'CrowdStrike software engineer interview: the post-Falcon-Flex + Charlotte AI + 2024-outage 2026 loop',
    description: 'The CrowdStrike software engineer interview in 2026 -- five stages, the post-Falcon Flex + Charlotte AI + Falcon Next-Gen SIEM + the 2024 outage context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['CrowdStrike', 'Software Engineer Interview', 'Cybersecurity', 'EDR', 'Falcon Platform', 'Charlotte AI', 'Interview Prep'],
    excerpt: 'CrowdStrike survived + iterated through the July 2024 outage, shipped Charlotte AI agents, Falcon Next-Gen SIEM, and Falcon Flex licensing. The 2026 engineer loop tests for endpoint-security depth + the post-incident-rigor register.',
    hook: 'CrowdStrike is the EDR-leader that survived the largest IT outage in history and came out stronger. The 2026 interview filters for engineers who can ship at endpoint-security scale with extreme operational rigor.',
    sections: [
      { type: 'p', text: 'CrowdStrike (NASDAQ: CRWD) survived the July 2024 outage (the channel-file 291 configuration update that caused 8.5M Windows devices to blue-screen, costing customers $5B+ in damages, triggering Delta vs CrowdStrike litigation), iterated through the post-incident rigor (the Rapid Response Content + sensor self-protection + the deployment-ring infrastructure overhaul), shipped Charlotte AI (the agentic security analyst across the Falcon platform, GA 2024-25), Falcon Next-Gen SIEM (the unified data + workflow + log-management product replacing legacy Splunk-equivalent SIEMs), and Falcon Flex (the licensing model that lets customers move budget across modules). The 2026 engineering team is hiring across the Falcon sensor (the Windows / macOS / Linux / mobile kernel + user-mode agents), Falcon Cloud Security (CNAPP), Falcon Next-Gen SIEM (the SaaS-scale log ingestion + correlation + workflow stack), Falcon Identity Threat Protection, Charlotte AI (the gen-AI + agentic-analyst layer), Falcon Insight (EDR), the Threat Hunting + intel teams, and the new Falcon Data Protection + Exposure Management products. The 2026 hiring bar is high and specific: endpoint-security depth, comfort with the post-July-2024 rigor register, and a calibrated take on the Charlotte-AI + Next-Gen SIEM thesis.' },

      { type: 'h2', text: 'The CrowdStrike SWE process -- 5-6 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why CrowdStrike, why this team. They will probe whether you understand the post-July-2024 operating reality.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the endpoint-security register.',
        'Technical screen -- 60-90 minutes. Live coding (C / C++ for sensor; Go + Python for cloud platform; Rust for performance-critical paths). Often security-flavoured problem.',
        'System design -- 60 minutes. Real CrowdStrike-shaped scenarios. "Design the Falcon sensor update pipeline to never repeat July 2024." "Walk me through Falcon Next-Gen SIEM ingestion at petabyte-per-day with sub-30-second time-to-detection." "Design Charlotte AI as a security-analyst agent with action-confirmation + audit-log."',
        'Onsite or final loop -- 4-5 rounds: deeper coding (often C / C++), deeper system design, behavioural / values + post-incident-mindset, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Falcon sensor detects a malicious process on a customer endpoint. Trace it from detection to cloud-reported event to analyst alert."',
        '"Design the Falcon sensor update pipeline that never repeats July 2024. Walk me through canary + deployment rings + the validation gates + the rollback architecture."',
        '"Walk me through Falcon Next-Gen SIEM. Petabyte-per-day log ingestion, sub-30-second time-to-detection, multi-tenant correlation. How does the data + query + alerting stack work?"',
        '"Design Charlotte AI as a security-analyst agent. It investigates an alert, queries Falcon data, and proposes containment actions. Walk me through the action-confirmation + audit boundary."',
        '"You inherit a sensor optimisation that reduces CPU by 15% but adds a 0.01% chance of missed detection on one specific behaviour family. First three actions?"',
        '"You disagree with a senior engineer on whether to ship a new sensor feature as Rapid Response Content (faster) or as a sensor build (slower, more tested). Argue your side."',
        '"What is your real opinion on the platformisation / Falcon Flex licensing strategy? Where does it win? Where does it create execution risk?"',
        '"Walk me through the most subtle bug you have hit in a kernel / driver / security-product system."',
        '"Why CrowdStrike and not [SentinelOne / Microsoft Defender / Palo Alto Cortex XDR / Wiz]?"',
        '"How would you reduce mean-time-to-detection by 30% without weakening false-positive control?"',
      ] },

      { type: 'h2', text: 'What kills candidates at CrowdStrike specifically' },
      { type: 'ol', items: [
        'No endpoint-security reasoning. CrowdStrike is structurally a sensor + cloud-security-platform company. Stories that miss kernel-level / driver / process-injection / ETW concepts miss the company.',
        'Generic security answers. CrowdStrike has very specific architecture (the Falcon sensor with kernel-mode + user-mode components, the Cloud Threat Graph, the Falcon platform multi-module shared-data layer, the EDR detection model). Generic answers miss CrowdStrike-specific context.',
        'No engagement with the July 2024 outage. The Channel File 291 incident shaped the post-2024 operating reality. Coming without a calibrated take on what happened + what the right post-mortem actions are signals shallow prep.',
        'Tone-deaf on the post-incident-rigor register. CrowdStrike now runs deployment-ring canaries + extreme validation gates. Stories that miss the "move fast" vs "do not break the world" tension miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read CrowdStrike\'s public post-incident report on the July 2024 outage + a recent product blog (Charlotte AI or Next-Gen SIEM).',
        '15-40 min: Stack drill. Kernel + user-mode sensor architecture, EDR detection model, Cloud Threat Graph, deployment-ring canary architecture, Charlotte AI + Falcon Next-Gen SIEM. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- sensor update pipeline, Next-Gen SIEM ingestion, Charlotte AI analyst agent. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with endpoint-security + post-incident-mindset framing. 200 words each.',
        '80-87 min: Read on CrowdStrike vs SentinelOne vs Microsoft Defender. Articulate where CrowdStrike wins (single-sensor platform, threat graph, Falcon Flex) vs where competitors win.',
        '87-90 min: Close. One opinion on the platformisation strategy, one specific CrowdStrike decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is CrowdStrike remote in 2026?' },
      { type: 'p', text: 'Mostly remote in US + select EU + India. Austin (HQ-ish) + Sunnyvale + Dublin + Bengaluru hubs. Some senior+ roles have geographic preferences. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of cybersecurity SaaS band post-2024 stock recovery. Strong RSU; total comp matches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including endpoint-security companies like CrowdStrike. Free at aimvantage.uk.' },

      { type: 'p', text: 'CrowdStrike hires engineers who can reason about endpoint-security at planetary scale, navigate the post-July-2024 rigor register, and engage with the Charlotte AI + Next-Gen SIEM thesis honestly. Prep the Falcon sensor + cloud platform stack, the deployment-ring architecture, and a calibrated take on the platformisation direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) WIZ SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'wiz-software-engineer-interview-2026',
    title: 'Wiz software engineer interview: the post-Google-acquisition-pending + Code-to-Cloud 2026 loop',
    description: 'The Wiz software engineer interview in 2026 -- five stages, the post-Google-acquisition-pending ($32B announced Mar 2025) + Code-to-Cloud + WAF context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Wiz', 'Software Engineer Interview', 'Cybersecurity', 'CNAPP', 'Cloud Security', 'Google Acquisition', 'Interview Prep'],
    excerpt: 'Wiz announced the Google acquisition ($32B, March 2025, pending close) and continued shipping CNAPP + Code-to-Cloud + Defend. The 2026 engineer loop tests for cloud-security depth + the pre-Google-integration register.',
    hook: 'Wiz is the cloud-security unicorn going from $0 to $1B ARR fastest in tech history, now being acquired by Google for $32B. The 2026 interview filters for engineers who can ship cloud-security at hyperscaler scale.',
    sections: [
      { type: 'p', text: 'Wiz announced the $32B Google acquisition (March 2025, pending regulatory close, after rejecting Google\'s $23B offer in July 2024), continued shipping the CNAPP platform (Cloud Native Application Protection Platform: CSPM + CWPP + CIEM + DSPM unified), Code-to-Cloud (the SDLC-spanning posture management from IaC to runtime), Wiz Defend (the runtime-threat-detection product), and the new Wiz Code (the developer-IDE security integration). The 2026 engineering team is hiring across the core Cloud Security Graph (the famous read-only deep-scan that builds the customer\'s cloud-resource graph in minutes), the agentless scanning + runtime sensor (Wiz Defend), the Code-to-Cloud + IaC posture surfaces, Wiz Code (IDE + PR integration), the multi-tenant SaaS platform, and the new Google-integration efforts (Mandiant + GCP Security Command Center + Vertex AI). The 2026 hiring bar is competitive and specific: cloud-security depth, comfort with the agentless-graph-scan register, and a calibrated take on the Google-acquisition + Code-to-Cloud thesis.' },

      { type: 'h2', text: 'The Wiz SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Wiz, why this team. They will probe whether you understand the agentless-graph-scan thesis + the Google-acquisition context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the cloud-security register.',
        'Technical screen -- 60 minutes. Live coding (Go primarily; Python for ML / data; TypeScript + React for frontend).',
        'System design -- 60 minutes. Real Wiz-shaped scenarios. "Design the agentless cloud-resource graph-scan for a Fortune-500 multi-cloud customer." "Walk me through Wiz Defend\'s runtime-detection architecture without a kernel-level agent." "Design the Code-to-Cloud lineage that ties an IaC change to a production-runtime alert."',
        'Onsite or final loop -- 3-4 rounds: deeper coding (often Go), deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a customer onboards an AWS account to Wiz. Trace from credentials to a populated Cloud Security Graph."',
        '"Design the agentless cloud-resource graph-scan. The customer has 100K+ resources across AWS + GCP + Azure. Wiz must build the graph in minutes."',
        '"Walk me through Wiz Defend\'s runtime-detection architecture. Wiz prides itself on being agentless -- how does runtime detection work without a kernel agent?"',
        '"Design the Code-to-Cloud lineage. An IaC change in a developer PR ties to a production-runtime alert. Walk me through the trace + the trust boundary."',
        '"You inherit a graph-scan optimisation that improves scan time by 25% but adds a 0.5% false-negative rate on one resource type. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in a deeper runtime agent or stay agentless. Argue your side."',
        '"What is your real opinion on the Google-acquisition thesis? Where does it create defensible value? Where does it create execution / cultural risk?"',
        '"Walk me through the most subtle bug you have hit in a multi-cloud or graph-based system."',
        '"Why Wiz and not [Palo Alto Prisma Cloud / CrowdStrike Cloud Security / Lacework / Orca Security]?"',
        '"How would you reduce graph-scan time by 30% on a large enterprise customer without weakening coverage?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Wiz specifically' },
      { type: 'ol', items: [
        'No cloud-security reasoning. Wiz is structurally a cloud-resource-graph + cloud-security-platform company. Stories that miss IAM / network / data-flow / Kubernetes-RBAC / multi-cloud concepts miss the company.',
        'Generic security answers. Wiz has very specific architecture (the Cloud Security Graph + the agentless deep-scan, the Wiz Defend runtime tap, the Code-to-Cloud lineage). Generic answers miss Wiz-specific context.',
        'No opinion on the agentless approach. Wiz\'s positioning is "agentless by default". Coming without an opinion on the trade-offs vs agent-based competitors (CrowdStrike, SentinelOne) signals shallow prep.',
        'Tone-deaf on the Google-acquisition register. The $32B Google deal is pending. Stories that ignore the acquisition timing + the cultural / strategic integration question miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about Wiz\'s Cloud Security Graph + the Code-to-Cloud product page.',
        '15-35 min: Stack drill. Cloud-security fundamentals (IAM, network, data, Kubernetes), multi-cloud resource models, agentless scanning patterns, eBPF-based runtime detection, Code-to-Cloud lineage. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- agentless graph-scan, Wiz Defend runtime, Code-to-Cloud lineage. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with cloud-security + multi-cloud framing. 200 words each.',
        '70-78 min: Read on Wiz vs Palo Alto Prisma vs Orca vs CrowdStrike. Articulate where Wiz wins (agentless DX, Cloud Security Graph, Code-to-Cloud) vs where competitors win.',
        '78-80 min: Close. One opinion on the Google acquisition, one specific Wiz decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Wiz remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Tel Aviv + NYC + Dallas hubs. Many fully remote roles within Israel + US. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Late-stage private + Google acquisition pending. Cash + RSU-equivalent tracking the $32B Google-deal valuation. Total comp matches or exceeds Google senior at equivalent levels. Confirm at offer stage.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including cloud-security companies like Wiz. Free at aimvantage.uk.' },

      { type: 'p', text: 'Wiz hires engineers who can reason about cloud-security at hyperscaler scale, navigate the agentless + graph-based register, and engage with the pre-Google-integration thesis honestly. Prep the Cloud Security Graph + Code-to-Cloud stack, the Wiz Defend context, and a calibrated take on the post-acquisition direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) PALO ALTO NETWORKS SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'palo-alto-networks-software-engineer-interview-2026',
    title: 'Palo Alto Networks software engineer interview: the post-Platformisation + Cortex XSIAM 2026 loop',
    description: 'The Palo Alto Networks software engineer interview in 2026 -- five stages, the post-Platformisation + Cortex XSIAM + Prisma + Strata context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Palo Alto Networks', 'Software Engineer Interview', 'Cybersecurity', 'Cortex', 'Prisma', 'Strata', 'SASE', 'Interview Prep'],
    excerpt: 'Palo Alto Networks pushed the Platformisation strategy: consolidate to Cortex XSIAM + Prisma + Strata + the new AI-native Precision AI. The 2026 engineer loop tests for security-platform breadth + distributed-systems depth.',
    hook: 'Palo Alto Networks is the security giant betting on Platformisation — replace 30 point-tools with 3 platforms. The 2026 interview filters for engineers who can ship across a broad security platform at enterprise scale.',
    sections: [
      { type: 'p', text: 'Palo Alto Networks (NASDAQ: PANW) pushed the Platformisation strategy (encourage customers to replace 20-30 point-tools with the three Palo Alto platforms: Cortex, Prisma, Strata), shipped Cortex XSIAM (the Next-Gen SIEM + Autonomous SOC, replacing legacy SIEMs), expanded Prisma SASE + Prisma Cloud (CNAPP), pushed Strata Network Security with PAN-OS + Strata Cloud Manager, and introduced Precision AI (the AI-native security stack across all three platforms). The 2026 engineering team is hiring across Cortex XSIAM + XDR + XSOAR (the post-SIEM platform), Prisma SASE + Cloud (the CASB + ZTNA + CNAPP + DSPM products), Strata + PAN-OS + Strata Cloud Manager (the next-gen firewall + network security), Precision AI + the GenAI-Security products (AI Access Security, AI Runtime Security), the Unit 42 threat-intel team, and the developer / Cortex Marketplace platforms. The 2026 hiring bar is high but specific: security-platform breadth, distributed-systems + Go + Python depth, and a calibrated take on the Platformisation + Precision-AI thesis.' },

      { type: 'h2', text: 'The Palo Alto Networks SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Palo Alto Networks, why this team. They will probe whether you understand the Platformisation thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the security-platform register.',
        'Technical screen -- 60 minutes. Live coding (Go for Cortex / Prisma backend; Python for ML / Precision AI; C / C++ for PAN-OS; TypeScript + React for management UIs).',
        'System design -- 60 minutes. Real PANW-shaped scenarios. "Design Cortex XSIAM ingestion at petabyte-per-day with sub-30-second time-to-detection." "Walk me through Prisma SASE\'s global edge architecture with PoP-affinity routing." "Design Precision AI -- an AI-security feature that crosses Cortex + Prisma + Strata."',
        'Onsite or final loop -- 4 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Cortex XDR agent on an endpoint detects suspicious behaviour. Trace from detection to Cortex XSIAM correlation to SOC analyst alert."',
        '"Design Cortex XSIAM ingestion at petabyte-per-day with sub-30-second time-to-detection across multi-tenant customers."',
        '"Walk me through Prisma SASE\'s global edge. PoP-affinity routing, ZTNA, secure web gateway, the cloud-delivered architecture."',
        '"Design Precision AI -- an AI-security feature that crosses Cortex + Prisma + Strata (e.g. detect AI-generated phishing across email + web + endpoint). Walk me through the cross-platform data + model integration."',
        '"You inherit a Cortex XSIAM correlation rule that improves detection on 85% of customer workflows but regresses 5% for one specific industry vertical. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in a deeper Cortex feature or in cross-platform Precision AI capabilities. Argue your side."',
        '"What is your real opinion on the Platformisation strategy? Where does it win? Where does it create lock-in vs. value-debate with customers?"',
        '"Walk me through the most subtle bug you have hit in a high-throughput security or networking product."',
        '"Why Palo Alto Networks and not [CrowdStrike / Wiz / Fortinet / Cisco-Splunk]?"',
        '"How would you reduce Cortex XSIAM alert-fatigue by 30% without weakening signal?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Palo Alto Networks specifically' },
      { type: 'ol', items: [
        'No security-platform reasoning. PANW is structurally a multi-product security platform. Stories that miss SIEM / SOAR / SASE / CNAPP / NGFW concepts miss the company.',
        'Generic security answers. PANW has very specific architecture (Cortex XSIAM\'s data lake + correlation, Prisma SASE\'s global PoP fabric, Strata\'s PAN-OS + ML-Powered NGFW, Precision AI\'s cross-platform stack). Generic answers miss PANW-specific context.',
        'No opinion on Platformisation. The "consolidate to 3 platforms" strategy is the central 2024+ growth story. Coming without an opinion on the platform-vs-best-of-breed register signals shallow prep.',
        'Tone-deaf on the legacy + cloud register. PANW grew up in network-security + on-prem firewalls. Stories that miss the migration to cloud-delivered + Cortex-XSIAM-as-the-future register miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about Cortex XSIAM + Prisma SASE + Strata Cloud Manager + Precision AI.',
        '15-35 min: Stack drill. SIEM + SOAR + XDR fundamentals, SASE + ZTNA architecture, CNAPP + DSPM, NGFW + PAN-OS, Precision AI cross-platform integration. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Cortex XSIAM ingestion, Prisma SASE PoP fabric, Precision AI cross-platform. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with security-platform + cross-product framing. 200 words each.',
        '70-78 min: Read on PANW vs CrowdStrike vs Wiz. Articulate where PANW wins (breadth, Platformisation, Precision AI, network-security depth) vs where competitors win.',
        '78-80 min: Close. One opinion on Platformisation, one specific PANW decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Palo Alto Networks remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Santa Clara + Tel Aviv + Bengaluru + Dublin hubs. Some senior+ remote roles in US + EU + Israel. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of cybersecurity-platform band post-2024 stock recovery. Strong RSU; total comp matches or exceeds FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including cybersecurity-platform companies like Palo Alto Networks. Free at aimvantage.uk.' },

      { type: 'p', text: 'Palo Alto Networks hires engineers who can reason about security-platform breadth, navigate the Cortex + Prisma + Strata register, and engage with the Platformisation + Precision-AI thesis honestly. Prep the multi-product stack, the Cortex XSIAM context, and a calibrated take on the platform-vs-best-of-breed direction.' },
    ],
  },
];
