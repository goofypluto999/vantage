// 3 more interview-guide posts -- batch 36 (high-velocity engineering)
// Tesla (EVs + Optimus + FSD), SpaceX (Starship + Starlink), Uber (mobility + delivery).

import type { BlogPost } from './blogPosts';

export const newBlogPosts36: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) TESLA SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'tesla-software-engineer-interview-2026',
    title: 'Tesla software engineer interview: the post-FSD v13 + Optimus + Robotaxi 2026 loop',
    description: 'The Tesla software engineer interview in 2026 -- five stages, the post-FSD v13 unsupervised + Optimus humanoid + Robotaxi context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Tesla', 'Software Engineer Interview', 'FSD', 'Optimus', 'Autopilot', 'Robotaxi', 'Interview Prep'],
    excerpt: 'Tesla pushed FSD v13 unsupervised + Robotaxi rollout + Optimus production ramp + the Cybertruck / Model 3 / Model Y / Semi product line. The 2026 engineer loop tests for high-velocity + first-principles register.',
    hook: 'Tesla is the EV + AI giant where Autopilot, Optimus, and the factory software all converge on one neural-net stack. The 2026 interview filters for engineers who can ship in the most-intense culture in tech.',
    sections: [
      { type: 'p', text: 'Tesla (NASDAQ: TSLA) pushed FSD v13 (the unsupervised version with vehicle-as-Robotaxi capability beginning in Austin + Bay Area), Cybercab + Robotaxi (the dedicated AV product), Optimus Gen 2 (the humanoid in early production + pilot deployments inside Tesla factories), the Cybertruck + Model 3 + Model Y + Model S/X + Semi product line, the Megapack + Powerwall energy products, and continued the vertically-integrated chip + Dojo + neural net training stack. The 2026 engineering team is hiring across the FSD + Autopilot stack (vision + perception + planning + control — vision-only no LiDAR), Optimus (the humanoid software stack), the Dojo + neural net training infrastructure, Tesla\'s in-house chip (FSD HW4/5 + Dojo D1/D2), the Robotaxi service + Cybercab vehicle stack, the vehicle software (firmware, OTA, infotainment, sentry mode), the factory software (manufacturing execution + Optimus-in-factory ops), and the energy products. The 2026 hiring bar is high and specific: high-velocity + first-principles depth, comfort with the Tesla-culture register (long hours, direct feedback, ship-fast), and a calibrated take on the vision-only-FSD vs Waymo-LiDAR thesis.' },

      { type: 'h2', text: 'The Tesla SWE process -- 4-5 stages, ~3-5 weeks (famously fast)' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Tesla, why this team. They will probe whether you can hack the Tesla intensity register.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the first-principles register.',
        'Technical screen -- 60-90 minutes. Live coding (C++ for FSD + Optimus + firmware; Python + PyTorch for ML; Go / TypeScript for fleet + cloud services). Often non-trivial robotics-flavoured problem embedded.',
        'System design + interrogation -- 60-90 minutes. Real Tesla-shaped scenarios. "Design the FSD vision pipeline for end-to-end neural net learning from 1M+ vehicle-fleet hours per day." "Walk me through Optimus\'s on-robot inference loop sharing the same FSD-derived neural net stack." "Design Cybercab\'s ride-dispatch + fleet management at 10K-cab scale."',
        'Onsite or final loop -- 3 rounds: deeper coding (often C++ / Python), deeper system design, sometimes a meeting with Elon or a VP for senior+ roles.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when an FSD v13-equipped vehicle approaches an unprotected left turn at peak rush hour. Trace it from camera input to wheel + throttle output."',
        '"Design the FSD end-to-end neural net training pipeline. Petabyte-per-day fleet data, multi-stage training, simulation, evaluation."',
        '"Walk me through Optimus\'s on-robot inference loop. Same neural-net DNA as FSD, applied to a humanoid body. How does the shared infrastructure work?"',
        '"Design Cybercab\'s ride-dispatch + fleet management. 10K dedicated AVs serving an urban area, with charging logistics + remote ops + safety override."',
        '"You inherit an FSD model change that improves comfort score by 12% but adds a 0.005% rate of harder-than-needed braking in one weather condition. First three actions?"',
        '"You disagree with a senior engineer on whether to bake a behavior into the end-to-end neural net or keep it as an explicit rule. Argue your side."',
        '"What is your real opinion on the vision-only-FSD vs Waymo-LiDAR thesis? Where does Tesla win? Where is Waymo right?"',
        '"Walk me through the most subtle bug you have hit in a safety-critical or end-to-end ML system."',
        '"Why Tesla and not [Waymo / Cruise (defunct) / a non-AV electric vehicle company / Anduril]?"',
        '"How would you reduce FSD interventions per 1000 miles by 30% in the next quarter?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Tesla specifically' },
      { type: 'ol', items: [
        'No first-principles reasoning. Tesla is structurally a first-principles + vertically-integrated company. Stories that defer to "industry standard" miss the company. Tesla rebuilds from physics, not from precedent.',
        'Generic ML answers. Tesla has very specific architecture (the end-to-end-neural-net FSD, the Dojo + D1/D2 training chips, the Optimus-shared stack, the vision-only sensor philosophy). Generic answers miss Tesla-specific context.',
        'No opinion on vision-only-FSD. The Tesla-vs-Waymo debate is the central public discourse. Coming without a calibrated take signals shallow prep.',
        'Tone-deaf on the culture register. Tesla is famously high-intensity. Stories framed for the "work-life-balance" register miss the culture. (Conversely: glorifying burnout also misses — Tesla wants velocity + good judgment, not just hours.)',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Watch a recent Tesla AI Day / FSD recap or read a recent Tesla AI tweet thread. Note three things about the current FSD trajectory.',
        '15-40 min: Stack drill. End-to-end neural net architecture, FSD vision-only sensor philosophy, Dojo training architecture, Optimus + FSD shared infra, factory software / Optimus-in-factory. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- FSD training pipeline, Optimus inference loop, Cybercab dispatch. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with first-principles + ship-fast framing. 200 words each.',
        '80-87 min: Develop a calibrated take on Tesla-vs-Waymo. Specific + considered, not slogan-y.',
        '87-90 min: Close. One opinion on vision-only-FSD, one specific Tesla decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Tesla remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- Palo Alto / Fremont / Austin / Reno / Berlin / Shanghai hubs. Tesla famously requires office presence. Some senior+ remote exceptions but rare. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of US tech band when TSLA is up. RSU heavy + cash. Total comp matches or exceeds FAANG senior at strong-stock-price moments; below at weaker moments.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AV + first-principles companies like Tesla. Free at aimvantage.uk.' },

      { type: 'p', text: 'Tesla hires engineers who can reason from first principles at the intersection of EV + AV + AI + robotics + factory, navigate the high-velocity culture, and engage with the vision-only-FSD vs Waymo-LiDAR thesis honestly. Prep the FSD + Optimus + Dojo stack, the Cybercab context, and a calibrated take on the vertical-integration direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) SPACEX SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'spacex-software-engineer-interview-2026',
    title: 'SpaceX software engineer interview: the post-Starship + Starlink + Cape-Canaveral-velocity 2026 loop',
    description: 'The SpaceX software engineer interview in 2026 -- five stages, the post-Starship + Starlink + Falcon 9 cadence + Polaris context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['SpaceX', 'Software Engineer Interview', 'Starship', 'Starlink', 'Falcon 9', 'Aerospace Software', 'Interview Prep'],
    excerpt: 'SpaceX ramped Starship (with Super Heavy + Starship V2 + Block 3 in flight), pushed Starlink to 8M+ subscribers + the direct-to-cell deployment, and continued the Falcon 9 weekly-launch cadence. The 2026 engineer loop tests for safety-critical + high-velocity register.',
    hook: 'SpaceX is the high-cadence rocketry + global broadband giant where Starship, Starlink, and Falcon all converge. The 2026 interview filters for engineers who can ship at the launch + safety pace SpaceX demands.',
    sections: [
      { type: 'p', text: 'SpaceX (private, ~$350B+ valuation) ramped Starship (with Super Heavy + Starship V2 + Block 3 in flight, the Mars + lunar architecture), pushed Starlink to 8M+ subscribers + the direct-to-cell deployment via T-Mobile + Optus + KDDI + others, continued Falcon 9 + Falcon Heavy weekly-launch cadence (~140+ launches in 2024-25 combined), shipped Dragon crew + cargo to ISS regularly, started the Polaris program flights (private crewed), and continued the Starshield national-security product line. The 2026 engineering team is hiring across Avionics (the flight-computer + safety-critical-software stack on every vehicle), Guidance, Navigation, Control (GNC), Starlink (the LEO constellation software: satellites + ground + user-terminal + gateway), Engine Software (Raptor + Merlin control), Launch Operations + Pad Software, Manufacturing + Production Software (the famous in-house MES + traceability), and Starshield + government products. The 2026 hiring bar is exceptional and specific: safety-critical + embedded depth, comfort with the launch-cadence register, and a calibrated take on the Starship + Starlink + national-security trajectory.' },

      { type: 'h2', text: 'The SpaceX SWE process -- 4-5 stages, ~3-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why SpaceX, why this team. They will probe whether you understand the launch-cadence + safety register. US citizenship required for most roles (ITAR).',
        'Hiring manager interview -- 60 minutes. Past work, scope, the aerospace-software register.',
        'Technical screen -- 60-90 minutes. Live coding (C++ heavily for flight + avionics + GNC; Python for tools + ML; Rust for some newer code). Often non-trivial real-time + safety-critical problem.',
        'System design + take-home -- 60-90 minutes. Real SpaceX-shaped scenarios. "Design the Starship flight-computer software for a 30-minute orbital insertion + 15-engine throttle authority + abort handling." "Walk me through Starlink\'s satellite-to-satellite laser-link routing across a 7K-satellite constellation." "Design the Falcon 9 first-stage return-to-launch-site control loop."',
        'Onsite or final loop -- 2-3 rounds: deeper coding (often C++ + real-time), deeper system design, behavioural + mission-led round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when Falcon 9 lifts off and the first-stage flips for return-to-launch-site. Trace through GNC + control authority + reentry."',
        '"Design the Starship flight-computer software. 30-minute orbital insertion, 15-engine throttle authority, abort logic, redundancy."',
        '"Walk me through Starlink\'s satellite-to-satellite laser-link routing across 7K satellites. The routing protocol + the failover + the latency goals."',
        '"Design the Falcon 9 first-stage return-to-launch-site control loop. The terminal-guidance + landing-burn architecture."',
        '"You inherit a GNC change that improves landing-accuracy by 12% but adds a 0.05% chance of misfiring one engine on terminal descent. First three actions?"',
        '"You disagree with a senior engineer on whether to add a new failsafe mode to the Starship flight software or rely on the existing pattern. Argue your side."',
        '"What is your real opinion on the Starship + Mars timeline? Realistic vs aspirational, and how does this affect what you build today?"',
        '"Walk me through the most subtle bug you have hit in a safety-critical or real-time embedded system."',
        '"Why SpaceX and not [Blue Origin / Rocket Lab / Anduril / Stoke Space / a small launch startup]?"',
        '"How would you reduce a Starlink user-terminal\'s initial-connect time by 30%?"',
      ] },

      { type: 'h2', text: 'What kills candidates at SpaceX specifically' },
      { type: 'ol', items: [
        'No safety-critical reasoning. SpaceX is structurally a safety-critical aerospace company. Stories that miss real-time / hard-deadline / redundancy / fault-tolerance / mission-assurance concepts miss the company.',
        'Generic embedded answers. SpaceX has very specific architecture (the in-house flight computers, the Linux-based + custom RTOS mix, the Starlink LEO + lasers + ground architecture, the Engine Software for Raptor/Merlin). Generic answers miss SpaceX-specific context.',
        'No real opinion on Mars + launch-cadence + national-security trajectory. SpaceX hires for mission-alignment. Coming without a real take signals shallow prep.',
        'Tone-deaf on the work-pace register. SpaceX is famously high-intensity. Stories framed for the "work-life-balance" register miss the operating reality. (Conversely: SpaceX wants velocity + good judgment, not just hours.)',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Watch a recent SpaceX launch + read the latest Starship recap. Note three things about the current cadence.',
        '15-40 min: Stack drill. Flight-computer + avionics architecture, GNC fundamentals, real-time + RTOS patterns, Starlink LEO + laser-link routing, Engine Software basics. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- Starship flight computer, Starlink routing, Falcon 9 RTLS. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with safety-critical + ship-fast framing. 200 words each.',
        '80-87 min: Develop a calibrated take on the Mars timeline + national-security direction. Specific + considered, not slogan-y.',
        '87-90 min: Close. One opinion on the launch-cadence + Starship trajectory, one specific SpaceX decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is SpaceX remote in 2026?' },
      { type: 'p', text: 'Almost entirely in-office -- Hawthorne (CA, HQ) + Starbase (Boca Chica, TX) + Bastrop + Vandenberg + Cape Canaveral + Redmond (WA, Starlink) hubs. Most engineering roles require physical access to hardware / labs / pads. Some software-only roles allow limited remote within US. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Strong cash + RSU-equivalent tracking the latest tender-offer valuation (~$350B+). Total comp matches FAANG mid-band at senior+ + comes with mission satisfaction. Confirm at offer stage.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Most US engineering roles require US person status due to ITAR + EAR. Visa sponsorship is rare. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including aerospace + safety-critical companies like SpaceX. Free at aimvantage.uk.' },

      { type: 'p', text: 'SpaceX hires engineers who can reason about safety-critical aerospace software, navigate the high-cadence launch register, and engage with the Starship + Starlink mission honestly. Prep the avionics + GNC + LEO + Engine Software stack, the Starship + Falcon context, and a calibrated take on the Mars-and-national-security direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) UBER SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'uber-software-engineer-interview-2026',
    title: 'Uber software engineer interview: the post-AV partnerships + Uber One + Freight 2026 loop',
    description: 'The Uber software engineer interview in 2026 -- five stages, the post-AV partnerships (Waymo + WeRide + Wayve + Hyundai) + Uber One + Freight context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Uber', 'Software Engineer Interview', 'Mobility', 'Marketplace', 'AV Partnerships', 'Uber One', 'Interview Prep'],
    excerpt: 'Uber pivoted from "Uber owns the AV stack" to "Uber is the AV marketplace for partners" (Waymo + WeRide + Wayve + Hyundai), expanded Uber One subscription, pushed Freight + Reserve + Teen. The 2026 engineer loop tests for marketplace + matching depth.',
    hook: 'Uber is the multi-market mobility + delivery + freight giant betting on being the AV marketplace, not the AV builder. The 2026 interview filters for engineers who can ship at marketplace + matching scale.',
    sections: [
      { type: 'p', text: 'Uber (NYSE: UBER) pivoted from the in-house AV play (which it sold to Aurora in 2020) to the AV-marketplace strategy with Waymo (Austin + Atlanta), WeRide (Abu Dhabi), Wayve (UK pilots), Hyundai partnership for AV, the deeper Uber One subscription (~30M+ members, the loyalty + bundling + discount product across Rides + Eats + Reserve), Uber Reserve (the scheduled-rides product), Teen accounts, the Uber Freight business (the brokerage + shipper-portal + carrier-app), Uber Eats expansion (grocery + retail partnerships, the new Costco + Walmart deals), and the Uber for Business + Uber Health verticals. The 2026 engineering team is hiring across the core Rides + Eats marketplace (the matching + dispatch + pricing + ETA + the Michelangelo ML platform), Uber One (the subscription + loyalty + cross-product economics), AV partnerships (the marketplace integration, the fleet + dispatch + pricing of partner AVs), Uber Freight (the shipper + carrier + brokerage software), the Maps + Mapping product, the rider + driver app teams, and the platform + infra teams (the famous Uber-engineering DOMA architecture + the move from monolith to services).' },

      { type: 'h2', text: 'The Uber SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Uber, why this team. They will probe whether you understand the marketplace-pivot to AV-marketplace.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the marketplace register.',
        'Technical screen -- 60 minutes. Live coding (Go + Java for backend; Python for ML / Michelangelo; Swift + Kotlin for mobile; TypeScript + React for web).',
        'System design -- 60 minutes. Real Uber-shaped scenarios. "Design rider-driver matching at peak (Friday night surge)." "Walk me through how Uber One affects pricing + ETA + service-tier across Rides + Eats." "Design the Uber-Waymo AV marketplace integration with safe-handoff + pricing transparency."',
        'Onsite or final loop -- 3 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round at senior+.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a rider requests a ride at peak hour. Trace it from app open to driver-acceptance to vehicle dispatch."',
        '"Design rider-driver matching at Friday-night peak. The surge logic, the fairness across drivers, the rider-experience trade-offs."',
        '"Walk me through how Uber One affects pricing + ETA + service-tier across Rides + Eats. Cross-product economics."',
        '"Design the Uber-Waymo AV marketplace integration. Waymo Drivers in the same rider-app as human drivers. The dispatch + safe-handoff + pricing + customer-support boundary."',
        '"You inherit a matching change that reduces wait-times by 8% but increases driver-cancel rate by 4%. First three actions?"',
        '"You disagree with a senior engineer on whether to consolidate two microservices that have grown to overlap. Argue your side."',
        '"What is your real opinion on the AV-marketplace strategy? Where does Uber win as the orchestrator? Where does it lose vs Waymo doing it themselves?"',
        '"Walk me through the most subtle bug you have hit in a real-time marketplace or dispatch system."',
        '"Why Uber and not [Lyft / DoorDash / Bolt / Grab / a vertical-mobility competitor]?"',
        '"How would you reduce rider-ETA accuracy error by 30% on average?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Uber specifically' },
      { type: 'ol', items: [
        'No marketplace reasoning. Uber is structurally a multi-sided marketplace. Stories that miss matching / dispatch / surge / fairness / two-sided-equilibrium concepts miss the company.',
        'Generic backend answers. Uber has very specific architecture (the matching engine, Michelangelo ML platform, the Uber One cross-product economics, the DOMA / services architecture, the H3 spatial indexing). Generic answers miss Uber-specific context.',
        'No opinion on the AV-marketplace strategy. The pivot from in-house AV to AV-orchestrator is central. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the driver-classification + regulatory register. Uber operates in the most regulated mobility environment. Stories that ignore the gig-worker context miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Uber + Uber Eats. Note three friction points + three things you respect. Read one Uber Engineering blog post.',
        '15-35 min: Stack drill. Marketplace matching algorithms, surge pricing, H3 spatial indexing, Michelangelo ML platform, DOMA + microservices architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- rider-driver matching, Uber One cross-product, Waymo marketplace integration. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with marketplace + multi-sided framing. 200 words each.',
        '70-78 min: Read on Uber vs Lyft + DoorDash. Articulate where Uber wins (breadth, Uber One bundling, AV partnerships) vs where competitors win.',
        '78-80 min: Close. One opinion on the AV-marketplace direction, one specific Uber decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Uber remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF (HQ) + Seattle + NYC + Toronto + Amsterdam + Bengaluru hubs. Some senior+ remote roles. RTO has tightened. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of mobility + delivery band post-2024 stock recovery. Strong RSU; total comp matches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including mobility + marketplace platforms like Uber. Free at aimvantage.uk.' },

      { type: 'p', text: 'Uber hires engineers who can reason about multi-sided marketplaces at planetary scale, navigate the AV-marketplace pivot, and engage with the Uber One + cross-product economics honestly. Prep the matching + Michelangelo + AV-marketplace stack, the gig-worker context, and a calibrated take on the orchestrator-vs-builder direction.' },
    ],
  },
];
