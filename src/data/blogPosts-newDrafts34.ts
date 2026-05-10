// 3 more interview-guide posts -- batch 34 (autonomous + defense + robotics)
// Waymo, Anduril, Figure AI.

import type { BlogPost } from './blogPosts';

export const newBlogPosts34: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) WAYMO SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'waymo-software-engineer-interview-2026',
    title: 'Waymo software engineer interview: the post-Waymo One scale + Uber partnership 2026 loop',
    description: 'The Waymo software engineer interview in 2026 -- five stages, the post-Waymo One commercial-scale + Uber partnership + the Phoenix / SF / LA / Austin / Miami expansion context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Waymo', 'Software Engineer Interview', 'Autonomous Vehicles', 'AV', 'Robotics', 'ML', 'Interview Prep'],
    excerpt: 'Waymo One scaled to 200K+ paid rides per week, partnered with Uber + Hyundai, and expanded to Phoenix + SF + LA + Austin + Miami. The 2026 engineer loop tests for robotics + ML + safety-critical systems depth.',
    hook: 'Waymo is the AV that survived the Cruise collapse and is now operating commercial rides at city scale. The 2026 interview filters for engineers who can ship robotics + ML at safety-critical scale.',
    sections: [
      { type: 'p', text: 'Waymo (Alphabet subsidiary) scaled Waymo One to 200K+ paid rides per week (mid-2025), confirmed expansion to LA + Austin (with Uber partnership for routing + payments in Austin + Atlanta) + Miami + Washington DC, partnered with Hyundai (next-gen platform on the IONIQ 5), continued the freight + trucking pilots, and crossed 30M+ autonomous miles + 100K+ commercial rides per week sustained. The 2026 engineering team is hiring across the AV stack (perception, prediction, planning, control), the ML platform (data pipelines, training, simulation), the on-vehicle compute + sensor team (the famous custom-built Waymo Driver hardware), safety + redundancy systems, the rider experience product (Waymo One app, customer support, edge cases), the fleet operations + remote-assistance team, and the partnership integrations (Uber + Hyundai + third-party fleet operators). The 2026 hiring bar is high and specific: robotics + ML at safety-critical depth, comfort with the regulated + media-scrutinised register, and a calibrated take on the AV-trajectory + Cruise-collapse + Tesla-FSD competitive thesis.' },

      { type: 'h2', text: 'The Waymo SWE process -- 5-6 stages, ~6-8 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Waymo, why this team. They will probe whether you understand the safety + regulated register.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the AV-engineering register.',
        'Technical screen -- 60 minutes. Live coding (C++ for on-vehicle + safety-critical paths; Python for ML; Go for cloud platform). Moderate-to-hard problem.',
        'System design -- 60-90 minutes. Real Waymo-shaped scenarios. "Design Waymo One\'s rider-dispatch + matching across a city with 1000+ Waymo Drivers operating simultaneously." "Walk me through the simulator that replays + perturbs real-world events for safety eval." "Design the on-vehicle perception fusion combining lidar + camera + radar + audio."',
        'Onsite or final loop -- 4-5 rounds: deeper coding (often C++), deeper system design, robotics or ML depending on team, safety-engineering specific, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Waymo Driver approaches a construction zone with a hand-signaling worker. Trace it from sensor input to vehicle behaviour to safe pass-through."',
        '"Design Waymo One\'s rider-dispatch + matching across an LA-sized city with 1000+ Drivers."',
        '"Walk me through the Waymo simulator. Replays real-world events + perturbs them for safety eval. How does the perturbation + the metric stack work?"',
        '"Design the on-vehicle perception fusion. Lidar + cameras + radar + audio + map priors. How do you combine + handle disagreement between sensors?"',
        '"You inherit a planner change that improves smoothness by 12% but introduces a 0.001% edge case where the vehicle hesitates inappropriately at an unprotected left. First three actions?"',
        '"You disagree with a senior engineer on whether to ship a feature on the next vehicle build vs. an OTA update. Argue your side."',
        '"What is your real opinion on the Tesla-FSD competitive register? Where does Waymo win? Where does the Tesla approach win?"',
        '"Walk me through the most subtle bug you have hit in a safety-critical or robotics system."',
        '"Why Waymo and not [Cruise (defunct) / Zoox / Aurora / Tesla / Wayve]?"',
        '"How would you reduce remote-assistance touch rate by 30% without weakening safety?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Waymo specifically' },
      { type: 'ol', items: [
        'No robotics + safety reasoning. Waymo is structurally a safety-critical robotics company. Stories that miss perception / prediction / planning / safety-case / failure-mode concepts miss the company.',
        'Generic ML answers. Waymo has very specific architecture (the custom Waymo Driver compute, the multi-sensor fusion stack, the simulation + safety-case framework, the remote-assistance loop). Generic answers miss Waymo-specific context.',
        'No opinion on Tesla-FSD. The Tesla-FSD-vs-Waymo register is the central public-discourse debate. Coming without a calibrated take signals shallow prep.',
        'Tone-deaf on the Cruise-collapse context. Cruise\'s 2023 collapse shaped the post-2024 AV regulator + public-trust register. Stories that ignore this miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Watch Waymo public videos + read the latest Waymo blog post. Try the Waymo One app in a supported city if possible.',
        '15-40 min: Stack drill. Perception (lidar + camera + radar fusion), prediction, planning + trajectory optimisation, on-vehicle compute, the simulation + safety-case framework. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- rider-dispatch, simulator + safety eval, perception fusion. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with safety-critical + ML framing. 200 words each.',
        '80-87 min: Read on Waymo vs Tesla FSD vs Aurora vs Wayve. Articulate where Waymo wins (sensor fusion, sim, urban scale) vs where competitors win.',
        '87-90 min: Close. One opinion on the Tesla-FSD register, one specific Waymo decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Waymo remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Mountain View + Phoenix + SF + Detroit + Pittsburgh + Seattle hubs. Many roles require physical access to vehicles + labs. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of Alphabet band for AV engineers. Strong RSU (in GOOGL); total comp matches or exceeds FAANG senior at equivalent levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AV + robotics companies like Waymo. Free at aimvantage.uk.' },

      { type: 'p', text: 'Waymo hires engineers who can reason about safety-critical robotics + ML at city scale, navigate the post-Cruise-collapse regulated register, and engage with the Tesla-FSD competitive thesis honestly. Prep the AV stack, the Waymo Driver hardware, the simulator + safety-case framework, and a calibrated take on the AV-trajectory direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) ANDURIL SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'anduril-software-engineer-interview-2026',
    title: 'Anduril software engineer interview: the post-Lattice + Roadrunner + Bolt 2026 loop',
    description: 'The Anduril software engineer interview in 2026 -- five stages, the post-Lattice + Roadrunner + Bolt + Fury + CCA context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Anduril', 'Software Engineer Interview', 'Defense Tech', 'Lattice', 'CCA', 'Robotics', 'Interview Prep'],
    excerpt: 'Anduril shipped Lattice OS for command + control, Roadrunner intercept, Bolt-M munition, Fury collaborative combat aircraft, and won the CCA Increment 1 program. The 2026 engineer loop tests for defense-software + robotics + the mission-led register.',
    hook: 'Anduril is the defense-tech giant building autonomous weapons + the Lattice OS for the US + allied military. The 2026 interview filters for engineers willing to work on defense and ship at the pace + rigor the mission demands.',
    sections: [
      { type: 'p', text: 'Anduril (private, ~$30B+ valuation after the 2024-25 rounds) shipped Lattice (the AI-driven command + control + sensor-fusion OS for the US + allied military), Roadrunner-M (the interceptor against air threats), Bolt + Bolt-M (the human-portable lethal munition), Fury (the autonomous fighter / CCA platform), Dive-LD (underwater autonomy), Ghost (small-UAS), and won major program awards including CCA Increment 1 (Collaborative Combat Aircraft, with General Atomics), the Replicator program participation, and the Roadrunner deployments. The 2026 engineering team is hiring across the Lattice platform (the sensor-fusion + targeting + command-and-control software), the autonomous-systems software (perception, planning, control for the various platforms), the Roadrunner + Bolt + Fury vehicle software (embedded + safety-critical), the manufacturing + production software (the famous Anduril vertical-integration + production-engineering stack), the cyber + EW + comms products, and the developer + integrator platform (third-party integrations into Lattice). The 2026 hiring bar is exceptional and specific: defense-software depth, comfort with the mission + the controversial public-discourse register, and a calibrated take on the defense-tech-as-startup trajectory.' },

      { type: 'h2', text: 'The Anduril SWE process -- 4-5 stages, ~3-5 weeks (famously fast for a defense company)' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Anduril, why this team. They will probe whether you have a real take on defense + the mission.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the defense-software register.',
        'Technical screen -- 60-90 minutes. Live coding (C++ for embedded + safety-critical; Rust for newer systems; Python for ML; TypeScript for command UIs). Often a non-trivial systems-design problem embedded.',
        'System design + mission round -- 60-90 minutes. Real Anduril-shaped scenarios. "Design Lattice fusion of 1000+ sensor-feeds across multiple platforms with sub-second target updates." "Walk me through Roadrunner intercept guidance + the launch-to-intercept latency budget." "Design Fury\'s autonomous tactical decision-making with human-on-the-loop oversight."',
        'Onsite or final loop -- 3 rounds: deeper coding (often C++ / Rust), deeper system design, behavioural / mission round (Palmer Luckey himself frequently joins for senior+).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Lattice operator selects a target. Trace it from sensor-feed fusion to operator UI to engagement decision."',
        '"Design Lattice fusion of 1000+ sensor-feeds (radar + EO/IR + RF + cued from off-board sensors) with sub-second target updates."',
        '"Walk me through Roadrunner intercept. Launch-to-intercept latency budget, guidance + control, terminal homing."',
        '"Design Fury\'s autonomous tactical decision-making. The pilot in another aircraft has supervisory control + can revoke autonomy. Walk me through the decision + override architecture."',
        '"You inherit a Lattice fusion change that improves track quality by 15% but introduces 0.1% false-track rate on one specific sensor class. First three actions?"',
        '"You disagree with a senior engineer on whether to push autonomy further or keep more human-in-the-loop oversight. Argue your side."',
        '"What is your real opinion on the autonomous-weapons + defense-tech debate? Where does Anduril\'s approach sit on the controversy spectrum?"',
        '"Walk me through the most subtle bug you have hit in a safety-critical or embedded-systems product."',
        '"Why Anduril and not [Lockheed Martin / Northrop Grumman / Shield AI / SpaceX defense / a smaller defense-tech startup]?"',
        '"How would you reduce Lattice target-track latency by 30% without weakening quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Anduril specifically' },
      { type: 'ol', items: [
        'No real take on the mission. Anduril hires for mission-alignment. Stories that treat the defense-tech work as an abstract engineering problem miss the company. A real, considered take on whether you want to work on autonomous weapons is required.',
        'Generic robotics answers. Anduril has very specific architecture (Lattice as the OS + sensor-fusion + C2 layer, the various Roadrunner + Bolt + Fury vehicle stacks, the production-engineering stack). Generic answers miss Anduril-specific context.',
        'No opinion on the human-in-the-loop vs autonomy register. The autonomy + supervisory-control trade-off is central. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the Palmer-Luckey-led culture. Anduril is unusually direct + opinion-led + speed-led for a defense company. Stories framed for legacy-defense-contractor culture miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about Anduril\'s products (Lattice + Roadrunner + Bolt + Fury). Watch a public Anduril demo video. Read a recent Palmer Luckey or Brian Schimpf piece.',
        '15-40 min: Stack drill. Sensor-fusion fundamentals (Kalman + JPDA + multi-hypothesis tracking), embedded + safety-critical C++ patterns, guidance + control basics, multi-platform autonomy + human-on-the-loop. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- Lattice fusion, Roadrunner intercept, Fury autonomy. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with safety-critical + mission-led framing. 200 words each. At least one should address the defense-tech ethical question directly.',
        '80-87 min: Develop a calibrated answer to "why work on this": something specific + considered, not slogan-y.',
        '87-90 min: Close. One opinion on autonomy-vs-human-in-the-loop, one specific Anduril decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Anduril remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Costa Mesa (HQ) + Mississippi + Pittsburgh + Atlanta + DC + Australia hubs. US citizenship + clearance-eligibility required for most roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of late-stage private band. Cash + RSU-equivalent tracking the $30B+ valuation. Total comp matches or exceeds FAANG senior + comes with defense-mission-aligned satisfaction or with the discomfort of building weapons -- candidates must hold both honestly.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Very limited due to clearance requirements. Most US engineering roles require US person status. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including defense + autonomous-systems companies like Anduril. Free at aimvantage.uk.' },

      { type: 'p', text: 'Anduril hires engineers who can reason about defense-software + autonomy + safety-critical systems, navigate the controversial mission honestly, and engage with the Palmer-Luckey-speed culture. Prep the Lattice + vehicle-software stack, the human-on-the-loop register, and a real take on whether you want to do this work.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) FIGURE AI SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'figure-ai-software-engineer-interview-2026',
    title: 'Figure AI software engineer interview: the post-Figure 02 + Helix + BMW 2026 loop',
    description: 'The Figure AI software engineer interview in 2026 -- five stages, the post-Figure 02 + Helix VLA model + BMW deployment + commercial-ramp context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Figure AI', 'Software Engineer Interview', 'Humanoid Robotics', 'Helix VLA', 'Embodied AI', 'BMW Deployment', 'Interview Prep'],
    excerpt: 'Figure AI shipped Figure 02, the Helix VLA model + the BMW Spartanburg deployment, raised at ~$40B valuation, and pushed the humanoid-as-general-purpose-robot thesis. The 2026 engineer loop tests for embodied AI + robotics + the high-velocity register.',
    hook: 'Figure AI is the post-Brett-Adcock-Open-AI-divorce humanoid-robotics company shipping Helix VLA + the BMW deployment. The 2026 interview filters for engineers who can ship embodied-AI at the pace + cost the mission requires.',
    sections: [
      { type: 'p', text: 'Figure AI (private, ~$40B valuation after the 2025 round) shipped Figure 02 (the next-gen humanoid hardware, with onboard speech + improved manipulation + battery + safety), Helix VLA (the in-house vision-language-action foundation model that replaced the OpenAI partnership after the 2025 divorce), the BMW Spartanburg deployment (Figure 02 robots working on the production line, the first commercial humanoid deployment at scale), Brett-AI (the consumer-facing AI personality / brand). The 2026 engineering team is hiring across the embodied-AI / Helix VLA stack (the foundation model + the manipulation policy + the multi-modal training + the data engine), the robotics + mechanical software (the locomotion + balance + arm + hand control), the on-robot compute + sensor team (the custom hardware), the deployment + ops products (factory-deployment, fleet management, remote monitoring), and the manufacturing + supply-chain engineering. The 2026 hiring bar is exceptional and specific: embodied-AI + robotics depth, comfort with the high-velocity ship-fast register, and a calibrated take on the humanoid-as-general-purpose thesis.' },

      { type: 'h2', text: 'The Figure AI SWE process -- 4-5 stages, ~3-5 weeks (fast-by-design)' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Figure, why this team. They will probe whether you understand the humanoid-as-GP thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the embodied-AI register.',
        'Technical screen -- 60 minutes. Live coding (C++ for on-robot + control; Python + PyTorch for ML / Helix; Go for cloud platform). Robotics-flavoured systems problem embedded.',
        'System design + deep-dive -- 60-90 minutes. Real Figure-shaped scenarios. "Design the Helix VLA training pipeline at the scale needed for a humanoid foundation model." "Walk me through the BMW Spartanburg deployment + the safe-handoff with human workers." "Design the on-robot perception + planning + control loop at sub-100ms."',
        'Onsite or final loop -- 3-4 rounds: deeper coding (often C++ / Python), deeper system design, robotics-specific, behavioural / values + a customer / mission round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Figure 02 robot performs a part-pick on the BMW line. Trace it from camera input through Helix VLA to actuator command."',
        '"Design the Helix VLA training pipeline. Scale of data needed, the multi-modal (vision + language + action) training, the policy + the world-model components."',
        '"Walk me through the BMW Spartanburg deployment. Robots working alongside human workers. Safe-handoff, no-go zones, anomaly handling, remote ops."',
        '"Design the on-robot perception + planning + control loop at sub-100ms. The compute budget on the robot, the sensor stack, the control hierarchy."',
        '"You inherit a Helix VLA change that improves manipulation success by 18% but introduces a 0.5% regression on a specific task class (e.g. grasp from cluttered bin). First three actions?"',
        '"You disagree with a senior engineer on whether to ship a Helix VLA capability with imperfect generalisation or wait for more training data. Argue your side."',
        '"What is your real opinion on the humanoid-as-general-purpose thesis? Where does it win vs. task-specific robots? Where does the form-factor tax hurt?"',
        '"Walk me through the most subtle bug you have hit in a robotics or embodied-AI system."',
        '"Why Figure and not [Boston Dynamics / Agility (Digit) / Apptronik / 1X / Tesla Optimus]?"',
        '"How would you reduce on-robot inference latency by 30% without weakening manipulation quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Figure specifically' },
      { type: 'ol', items: [
        'No embodied-AI reasoning. Figure is structurally a humanoid-robotics + embodied-AI company. Stories that miss VLA / world-model / manipulation / locomotion concepts miss the company.',
        'Generic LLM answers. Figure has very specific architecture (Helix VLA the in-house VLA, the on-robot compute, the BMW deployment ops stack, the data-engine that captures + curates from the fleet). Generic answers miss Figure-specific context.',
        'No opinion on the OpenAI-divorce thesis. The 2025 OpenAI partnership end + the Helix-VLA-in-house decision is central. Coming without an opinion on the in-house vs partnership trade-off signals shallow prep.',
        'Tone-deaf on the Brett-Adcock culture. Figure ships fast + opinion-led. Stories framed for slower-cadence cultures miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Watch Figure public demo videos + read the Helix VLA technical blog post + look at the BMW deployment context.',
        '15-40 min: Stack drill. VLA fundamentals (vision-language-action multi-modal model), manipulation + grasping basics, locomotion + balance control, on-robot compute architecture, embodied data engine. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- Helix VLA training, BMW deployment ops, on-robot loop. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with robotics + ship-fast framing. 200 words each.',
        '80-87 min: Read on Figure vs Tesla Optimus vs 1X vs Apptronik. Articulate where Figure wins (Helix in-house, BMW deployment, velocity) vs where competitors win.',
        '87-90 min: Close. One opinion on the in-house vs partnership thesis, one specific Figure decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Figure AI remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Sunnyvale (HQ) + Charlotte (manufacturing). Most engineering roles require physical access to robots + labs. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Late-stage private + $40B valuation. Strong cash + RSU-equivalent. Total comp matches or exceeds FAANG senior + comes with frontier-robotics mission. Confirm at offer stage.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including humanoid-robotics + embodied-AI companies like Figure. Free at aimvantage.uk.' },

      { type: 'p', text: 'Figure hires engineers who can reason about embodied-AI + humanoid robotics + on-robot ML, navigate the post-OpenAI-divorce Helix in-house register, and engage with the humanoid-as-general-purpose thesis honestly. Prep the Helix VLA stack, the BMW deployment context, the on-robot loop, and a calibrated take on the humanoid trajectory.' },
    ],
  },
];
