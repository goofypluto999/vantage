// 3 more interview-guide posts -- batch 29 (DevOps + dev platforms)
// GitLab, Vercel, HashiCorp.

import type { BlogPost } from './blogPosts';

export const newBlogPosts29: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) GITLAB SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'gitlab-software-engineer-interview-2026',
    title: 'GitLab software engineer interview: the post-Duo + Dedicated + AI 2026 loop',
    description: 'The GitLab software engineer interview in 2026 -- five stages, the post-GitLab Duo + Dedicated + AI Native context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['GitLab', 'Software Engineer Interview', 'DevSecOps', 'GitLab Duo', 'Dedicated', 'All-Remote', 'Interview Prep'],
    excerpt: 'GitLab shipped GitLab Duo (AI across the DevSecOps platform), Dedicated (single-tenant SaaS), Cells (the multi-tenant scale-out architecture), and the deeper Premium + Ultimate tiers. The 2026 engineer loop tests for Rails monolith + distributed-systems depth.',
    hook: 'GitLab is the all-remote, single-app DevSecOps platform that bet on Duo AI. The 2026 interview filters for engineers who can ship at GitLab-monolith scale across the full SDLC.',
    sections: [
      { type: 'p', text: 'GitLab (NASDAQ: GTLB) shipped GitLab Duo (the AI-native DevSecOps assistant: Code Suggestions, Chat, Vulnerability Resolution, Test Generation, Root Cause Analysis), Dedicated (the single-tenant SaaS for high-compliance customers, alternative to GitLab Self-Managed), Cells (the multi-tenant scale-out architecture for GitLab.com, breaking up the historical single-database constraint), Duo Workflow (the agentic-DevSecOps layer, GA 2025), and the deeper Premium + Ultimate tier monetisation. The 2026 engineering team is hiring across the core Rails monolith + sidekiq workers + the new Cells architecture, GitLab Duo + Duo Workflow (the AI + agentic stack), Dedicated + GitLab Self-Managed, the CI / CD + Runner + Pipeline team, the Security + Compliance products (SAST, DAST, SCA, container scanning, secrets scanning, license scanning), and the developer + Marketplace platforms. The 2026 hiring bar is competitive and specific: Rails-monolith + Sidekiq depth, comfort with the all-remote distributed register, and a calibrated take on the AI-native DevSecOps thesis.' },

      { type: 'h2', text: 'The GitLab SWE process -- 4-5 stages, ~4-5 weeks (famously transparent + documented in their handbook)' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why GitLab, why all-remote works for you. They will probe whether you understand the GitLab Values + the AI-native + Duo thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the all-remote async register.',
        'Technical screen -- 60 minutes. Live coding (Ruby for the monolith; Go for sidecar services; Vue for frontend; Python for ML / Duo).',
        'Technical deep-dive / system design -- 60 minutes. Real GitLab-shaped scenarios. "Design Cells -- the multi-tenant scale-out where each Cell is a self-contained GitLab instance." "Walk me through GitLab Duo Code Suggestions architecture across self-managed + SaaS + Dedicated." "Design the Pipeline runner orchestration for 10K+ concurrent jobs."',
        'Final round + behavioural -- 1-2 rounds: peer interviews + leadership / values. GitLab is famously transparent about the process in their public handbook.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a developer pushes a commit that triggers a CI pipeline on GitLab.com. Trace from push through runners to merge."',
        '"Design Cells -- the multi-tenant scale-out where each Cell is a self-contained GitLab instance with its own database. How does cross-cell user identity + group membership work?"',
        '"Walk me through GitLab Duo Code Suggestions architecture. Same product across self-managed + SaaS + Dedicated. Customer code never leaves their boundary. Walk me through the model serving + privacy boundary."',
        '"Design the Pipeline runner orchestration for 10K+ concurrent jobs. The runner-token + job-allocation + retry semantics."',
        '"You inherit a Duo Code Suggestions feature that improves acceptance rate by 18% but adds a 3% latency regression on slower self-managed instances. First three actions?"',
        '"You disagree with a senior engineer on whether to consolidate a Sidekiq queue or split it. Argue your side."',
        '"What is your real opinion on the AI-native DevSecOps positioning? Where does GitLab Duo win? Where does GitHub Copilot win?"',
        '"Walk me through the most subtle bug you have hit in a Rails monolith or Sidekiq-based system."',
        '"Why GitLab and not [GitHub / Bitbucket / Atlassian / a self-hosted alternative like Gitea]?"',
        '"How would you reduce p99 latency on a complex Merge Request page by 30%?"',
      ] },

      { type: 'h2', text: 'What kills candidates at GitLab specifically' },
      { type: 'ol', items: [
        'No Rails-monolith reasoning. GitLab is structurally a Rails monolith with Sidekiq workers. Stories that miss this miss the company. Knowing roughly how Rails + Postgres + Sidekiq + Redis fit together matters.',
        'Generic DevOps answers. GitLab has very specific architecture (the GitLab Rails app + Sidekiq + Gitaly + Praefect + Workhorse + Pages + Registry + KAS + Runner). Generic answers miss GitLab-specific context.',
        'No opinion on Duo + GitHub-Copilot competitive register. The DevSecOps AI race is the central 2025+ strategic question. Coming without a calibrated take signals shallow prep.',
        'Missing the all-remote async register. GitLab is the most-documented all-remote company in tech. Stories that miss the async + handbook-first + written-over-meetings register miss the company\'s actual operating culture.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Browse the GitLab Handbook (the famous public-everything handbook). Pick three specific values you actually align with.',
        '15-35 min: Stack drill. Rails monolith + Postgres + Sidekiq + Redis, Gitaly + Praefect, Cells architecture, Duo Code Suggestions + Chat architecture, Pipeline runner. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Cells multi-tenant, Duo Code Suggestions privacy boundary, Pipeline runner orchestration. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with all-remote + async + monolith framing. 200 words each.',
        '70-78 min: Read on GitLab vs GitHub. Articulate where GitLab wins (single-app DevSecOps, all-remote DNA, transparent handbook, compliance via Dedicated) vs where GitHub wins.',
        '78-80 min: Close. One opinion on Duo direction, one specific GitLab decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is GitLab remote in 2026?' },
      { type: 'p', text: 'All-remote since founding (one of the few companies that are truly fully-remote at scale). 2,000+ team members across 60+ countries. Confirm location-eligibility at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'GitLab uses a transparent location-factored compensation calculator (public on the handbook). Strong cash + RSU. Total comp varies by location but approaches FAANG mid-band at senior+ in high-cost regions.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Usually they hire where you are -- they have hiring entities in 60+ countries. Visa sponsorship is rare but possible at senior+ for specific cases. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including all-remote DevSecOps companies like GitLab. Free at aimvantage.uk.' },

      { type: 'p', text: 'GitLab hires engineers who can reason about the Rails monolith + Sidekiq + Cells architecture, navigate the all-remote async register, and engage with the AI-native DevSecOps thesis honestly. Prep the handbook, the Cells + Duo stack, and a calibrated take on the GitHub competitive register.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) VERCEL SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'vercel-software-engineer-interview-2026',
    title: 'Vercel software engineer interview: the post-v0 + AI SDK + Fluid Compute 2026 loop',
    description: 'The Vercel software engineer interview in 2026 -- five stages, the post-v0 + AI SDK + Fluid Compute + Next.js 15 context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Vercel', 'Software Engineer Interview', 'Next.js', 'v0', 'AI SDK', 'Fluid Compute', 'Frontend Cloud', 'Interview Prep'],
    excerpt: 'Vercel pushed into AI with v0 (the gen-AI app builder), AI SDK (the open-source TypeScript SDK), Fluid Compute (the post-serverless runtime), and Next.js 15+. The 2026 engineer loop tests for edge + frontend-cloud + AI-tooling depth.',
    hook: 'Vercel is the Next.js company that became the AI-app-builder company with v0. The 2026 interview filters for engineers who can ship at frontend-cloud scale with deep edge + AI understanding.',
    sections: [
      { type: 'p', text: 'Vercel (private, ~$3-5B+ valuation) pushed into AI with v0 (the gen-AI app builder, the "describe your app, get a deployable React app" surface), AI SDK (the open-source TypeScript SDK for building AI agents + applications, used by OpenAI, Anthropic, xAI, etc.), Fluid Compute (the post-serverless runtime with active-CPU pricing + idle waste reduction), Next.js 15+ (with Turbopack stable, the cache directive, the new partial prerendering), the deeper Enterprise + AI Cloud + Marketplace surfaces. The 2026 engineering team is hiring across the core platform (edge + serverless + Fluid Compute runtime), Next.js + Turbopack (the framework + Rust-based bundler), v0 (the AI agentic builder), AI SDK + AI Cloud, the developer platform (Marketplace + Storage + Integrations), and the new Enterprise + Observability + Speed Insights surfaces. The 2026 hiring bar is competitive and specific: edge / serverless / frontend-cloud depth, comfort with the framework + framework-runtime register (Next.js is a top-3 framework), and a calibrated take on the AI-coding-tools + v0 thesis.' },

      { type: 'h2', text: 'The Vercel SWE process -- 4-5 stages, ~3-4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Vercel, why this team. They will probe whether you understand the frontend-cloud + AI Cloud thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the frontend-cloud register.',
        'Technical screen -- 60 minutes. Live coding (TypeScript primarily; Rust for Turbopack + low-level; Go for backend; Python for AI Cloud).',
        'System design -- 60 minutes. Real Vercel-shaped scenarios. "Design Fluid Compute -- a serverless runtime that handles bursty + long-running + idle traffic without the cold-start penalty." "Walk me through v0 architecture -- a multi-step gen-AI workflow that ships deployable code." "Design Next.js Image Optimization at edge scale."',
        'Onsite or final loop -- 2-3 rounds: deeper coding (often TypeScript / Rust), deeper system design, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user deploys a Next.js app to Vercel. Trace from `vercel deploy` to live URL serving traffic from the edge."',
        '"Design Fluid Compute. A serverless runtime that handles bursty + long-running + idle traffic without the cold-start penalty. How does the active-CPU pricing + instance reuse work?"',
        '"Walk me through v0 architecture. Multi-step gen-AI workflow: prompt → React + Tailwind → editor → deployable preview. Walk me through the steps + the model integration."',
        '"Design Next.js Image Optimization at edge scale. Resize / format / quality on demand. How do you handle a 100K-image site with a CDN cache?"',
        '"You inherit a Fluid Compute optimisation that reduces cost for 90% of customers by 20% but adds 5% latency regression for one specific use case. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in a new Next.js feature or improve Turbopack production stability. Argue your side."',
        '"What is your real opinion on the AI-coding-tools competitive register? Where does v0 win? Where does Cursor / Lovable / Bolt win?"',
        '"Walk me through the most subtle bug you have hit in a serverless or edge runtime."',
        '"Why Vercel and not [Cloudflare / Netlify / Render / AWS Amplify]?"',
        '"How would you reduce Next.js cold-start latency by 30% on Fluid Compute?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Vercel specifically' },
      { type: 'ol', items: [
        'No edge / serverless reasoning. Vercel is structurally a frontend-cloud + edge-runtime company. Stories that miss edge / serverless / cold-start / partial-prerendering concepts miss the company.',
        'Generic frontend answers. Vercel has very specific architecture (Next.js framework + Turbopack + Fluid Compute + Edge Functions + Image Optimization + ISR + the v0 + AI SDK runtime). Generic answers miss Vercel-specific context.',
        'No opinion on AI-coding-tools register. v0 vs Cursor vs Lovable vs Bolt is the central 2025+ strategic question. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the Next.js ecosystem reality. Next.js is Vercel\'s primary distribution surface. Stories that treat it as a side-project miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use v0 + AI SDK briefly. Deploy a Next.js project to Vercel. Note three friction points + three things you respect.',
        '15-35 min: Stack drill. Next.js architecture (app router, partial prerendering, Server Components), Turbopack, Fluid Compute + Edge Functions, Image Optimization + ISR, v0 + AI SDK architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Fluid Compute runtime, v0 multi-step agent, Next.js Image Optimization. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with edge + frontend-cloud framing. 200 words each.',
        '70-78 min: Read on Vercel vs Cloudflare vs Netlify. Articulate where Vercel wins (Next.js depth, v0, AI SDK, DX) vs where Cloudflare wins (edge network, R2, Workers AI).',
        '78-80 min: Close. One opinion on the v0 direction, one specific Vercel decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Vercel remote in 2026?' },
      { type: 'p', text: 'Mostly remote globally with hubs in SF + NYC + Amsterdam + Tokyo. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of late-stage private dev-tools band. Strong cash + RSU-equivalent tracking tender-offer valuation. Total comp matches FAANG mid-band at senior+ depending on valuation trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including frontend-cloud + dev-tool companies like Vercel. Free at aimvantage.uk.' },

      { type: 'p', text: 'Vercel hires engineers who can reason about edge + serverless + frontend-cloud, navigate the v0 + AI SDK register, and engage with the Next.js ecosystem reality honestly. Prep the Fluid Compute + Turbopack + v0 stack, the AI SDK context, and a calibrated take on the AI-coding-tools competitive direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) HASHICORP SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'hashicorp-software-engineer-interview-2026',
    title: 'HashiCorp software engineer interview: the post-IBM-acquisition + Terraform 2026 loop',
    description: 'The HashiCorp software engineer interview in 2026 -- five stages, the post-IBM acquisition (closed Feb 2025) + Terraform + Vault + Boundary + Waypoint context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['HashiCorp', 'Software Engineer Interview', 'Terraform', 'Vault', 'IBM Acquisition', 'Infrastructure as Code', 'Interview Prep'],
    excerpt: 'HashiCorp closed the IBM acquisition (Feb 2025, ~$6.4B) and operates as an IBM subsidiary while keeping product-line autonomy. The 2026 engineer loop tests for infrastructure-as-code + distributed-systems depth.',
    hook: 'HashiCorp is the IaC + secrets + service-mesh standard that just became an IBM subsidiary. The 2026 interview filters for engineers who can ship distributed-infrastructure software at production scale.',
    sections: [
      { type: 'p', text: 'HashiCorp closed the IBM acquisition (announced April 2024, closed February 2025, ~$6.4B) and operates as an IBM subsidiary while keeping product-line autonomy. The 2026 engineering team is hiring across Terraform (the IaC standard + the new Terraform Stacks + Terraform CDK), Vault (the secrets-management standard), Consul (service-mesh + service-discovery), Nomad (orchestrator), Boundary (zero-trust remote access), Waypoint (developer experience), Packer (image building), the HashiCorp Cloud Platform (HCP, the managed-multi-product SaaS), and the new IBM-integration efforts (Red Hat OpenShift + IBM Cloud + watsonx). The 2026 hiring bar is competitive and specific: distributed-systems + Go + infrastructure-software depth, comfort with the post-IBM register (autonomy + integration tension), and a calibrated take on the OSS-licensing trajectory (the BUSL switch in 2023 + the OpenTofu / OpenBao forks).' },

      { type: 'h2', text: 'The HashiCorp SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why HashiCorp, why this team. They will probe whether you understand the post-IBM register.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the infrastructure-software register.',
        'Technical screen -- 60 minutes. Live coding (Go primarily; some Python + TypeScript).',
        'System design -- 60 minutes. Real HashiCorp-shaped scenarios. "Design Terraform Stacks -- the new construct for managing related infra units." "Walk me through Vault\'s seal / unseal flow + the HSM integration." "Design Consul service-mesh sidecar proxy management at 10K+ services."',
        'Final round + behavioural -- 1-2 rounds: peer interviews + leadership / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user runs `terraform apply` against a multi-resource configuration. Trace from CLI to state file to provider calls."',
        '"Design Terraform Stacks. A new construct for managing related infrastructure units across environments. Walk me through the architecture + the upgrade-from-current-Terraform path."',
        '"Walk me through Vault\'s seal / unseal flow + the HSM integration. How does the master-key + the unseal-key shares + the recovery-key work?"',
        '"Design Consul service-mesh sidecar proxy management at 10K+ services. Cert rotation, mTLS, the service-discovery + health-check pipeline."',
        '"You inherit a Terraform performance improvement that reduces plan time by 25% but adds a 0.1% regression in plan accuracy on one specific provider. First three actions?"',
        '"You disagree with a senior engineer on whether to bring a community-contributed Terraform feature into the core or keep it in a separate provider. Argue your side."',
        '"What is your real opinion on the BUSL switch + the OpenTofu / OpenBao fork? Where was HashiCorp right? Where did it lose community trust?"',
        '"Walk me through the most subtle bug you have hit in distributed-systems or infrastructure software."',
        '"Why HashiCorp and not [Pulumi / OpenTofu / Crossplane / a hyperscaler-native IaC]?"',
        '"How would you reduce Terraform plan latency by 30% for a multi-thousand-resource state?"',
      ] },

      { type: 'h2', text: 'What kills candidates at HashiCorp specifically' },
      { type: 'ol', items: [
        'No distributed-systems reasoning. HashiCorp is structurally a distributed-infrastructure-software company. Stories that miss consensus / Raft / leader-election / consistency concepts miss the company.',
        'Generic IaC answers. HashiCorp has very specific architecture (Terraform state + lock + provider model, Vault\'s storage backends + auth methods, Consul\'s gossip + Raft, Nomad\'s scheduler). Generic answers miss HashiCorp-specific context.',
        'No opinion on the BUSL / OpenTofu split. The 2023 license change to BUSL + the OpenTofu / OpenBao forks shaped the post-2023 community register. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the post-IBM context. The IBM acquisition closed February 2025. Stories that ignore the autonomy-vs-integration register miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Terraform + Vault in a real config. Read the HashiCorp Tao + the recent product announcements.',
        '15-35 min: Stack drill. Terraform state + provider model, Vault seal / unseal + auth methods, Consul gossip + Raft + service-mesh, Nomad scheduler. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Terraform Stacks, Vault HSM integration, Consul service-mesh at scale. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with distributed-systems + infrastructure framing. 200 words each.',
        '70-78 min: Read on HashiCorp vs Pulumi vs OpenTofu. Articulate where HashiCorp wins (standard, ecosystem, HCP, IBM integration) vs where competitors win.',
        '78-80 min: Close. One opinion on the BUSL switch, one specific HashiCorp decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is HashiCorp remote in 2026?' },
      { type: 'p', text: 'Distributed-first since founding. Hubs in SF + NYC + Austin + London + Toronto. Many fully remote roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Post-acquisition comp moved to IBM\'s structure (cash + IBM RSU). Total comp competitive at senior+ depending on level. Confirm at the offer stage.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including infrastructure-software companies like HashiCorp. Free at aimvantage.uk.' },

      { type: 'p', text: 'HashiCorp hires engineers who can reason about distributed-systems + IaC at production scale, navigate the post-IBM register, and engage with the BUSL / OpenTofu community context honestly. Prep the Terraform + Vault + Consul stack, the Stacks + HSM context, and a calibrated take on the post-acquisition direction.' },
    ],
  },
];
