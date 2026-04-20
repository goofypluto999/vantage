import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowLeft, FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

const sectionClass = 'mb-10';
const headingClass = 'text-xl font-display font-bold text-white mb-4';
const bodyClass = 'text-white/60 leading-relaxed text-sm';
const listClass = 'list-disc list-inside text-white/60 leading-relaxed text-sm space-y-1.5 ml-2';
const emphasisClass = 'text-white/80 font-semibold';
const capsClass = 'text-white/70 font-bold text-xs uppercase tracking-wide leading-relaxed';

export default function TermsOfService() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 50%, #2d2654 100%)' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d0b1e]/80 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <BrainCircuit className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">Vantage</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Title */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">Terms of Service</h1>
                <p className="text-white/40 text-sm mt-1">Last updated: 9 April 2026</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-violet-500/30 via-purple-500/20 to-transparent mt-6" />
          </div>

          {/* Terms Content */}
          <div className="bg-[#181530]/50 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 lg:p-12">

            {/* 1. Acceptance of Terms */}
            <section className={sectionClass}>
              <h2 className={headingClass}>1. Acceptance of Terms</h2>
              <p className={bodyClass}>
                By accessing or using Vantage ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you must not access or use the Service. Your continued use of the Service following any changes to these Terms constitutes your acceptance of those changes.
              </p>
              <p className={`${bodyClass} mt-3`}>
                These Terms constitute a legally binding agreement between you ("User", "you", "your") and the operator of Vantage ("Operator", "we", "us", "our").
              </p>
            </section>

            {/* 2. Service Description */}
            <section className={sectionClass}>
              <h2 className={headingClass}>2. Service Description</h2>
              <p className={bodyClass}>
                Vantage is an AI-powered job preparation tool. The Service generates company intelligence reports, cover letters, strategic briefs, interview preparation materials, CV fit analysis, and related content using artificial intelligence.
              </p>
              <p className={`${bodyClass} mt-3 ${emphasisClass}`}>
                You expressly acknowledge and agree that:
              </p>
              <ul className={`${listClass} mt-2`}>
                <li>Vantage is a <span className={emphasisClass}>software tool</span>, not a recruitment agency, employment service, or career consultancy.</li>
                <li>The Service does not provide professional career advice, legal advice, financial advice, or any other form of professional advice.</li>
                <li>The Service does not guarantee, promise, or imply any specific job outcome, interview result, application success, or career advancement.</li>
                <li>All AI-generated content is produced algorithmically and must be independently reviewed by you before use.</li>
              </ul>
            </section>

            {/* 3. Operator Disclosure */}
            <section className={sectionClass}>
              <h2 className={headingClass}>3. Operator Disclosure</h2>
              <div className="bg-violet-500/5 border border-violet-500/10 rounded-xl p-5 mt-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div className={bodyClass}>
                    <p>
                      Vantage is operated by an individual based in England, United Kingdom, as a personal project. It is <span className={emphasisClass}>not</span> a registered company, limited liability entity, or incorporated business. There is no formal support team, dedicated customer service department, or guaranteed response infrastructure.
                    </p>
                    <p className="mt-2">
                      The Service is provided on a <span className={emphasisClass}>best-effort basis</span>. By using the Service, you acknowledge and accept that you are engaging with a product developed and maintained by a sole individual.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Account Terms */}
            <section className={sectionClass}>
              <h2 className={headingClass}>4. Account Terms</h2>
              <ul className={listClass}>
                <li>You must be at least <span className={emphasisClass}>16 years of age</span> to create an account and use the Service. By creating an account, you represent and warrant that you meet this age requirement.</li>
                <li>You are solely responsible for maintaining the confidentiality and security of your account credentials. You agree to notify us immediately of any unauthorised access to or use of your account.</li>
                <li>Each individual may maintain only one (1) account. Creating multiple accounts to circumvent usage limits, abuse promotions, or for any other purpose is strictly prohibited.</li>
                <li>You are responsible for all activity that occurs under your account, whether or not authorised by you.</li>
                <li>We reserve the right to suspend, restrict, or permanently terminate any account at our sole discretion, without prior notice and without liability, for any reason including but not limited to suspected abuse, violation of these Terms, or inactivity.</li>
              </ul>
            </section>

            {/* 5. Payment & Subscriptions */}
            <section className={sectionClass}>
              <h2 className={headingClass}>5. Payment, Subscriptions and Refunds</h2>
              <ul className={listClass}>
                <li>All payments are processed securely by <span className={emphasisClass}>Stripe</span>. We do not store your payment card details on our servers. By making a payment, you also agree to Stripe's terms of service.</li>
                <li>Prices are displayed and charged in <span className={emphasisClass}>British Pounds Sterling (GBP)</span> or <span className={emphasisClass}>US Dollars (USD)</span> depending on your selection or detected region. Exchange rates fluctuate and prices between currencies are not held to a fixed ratio. Currency conversion fees imposed by your bank are your responsibility.</li>
                <li>Subscriptions (Pro and Premium) automatically renew at the end of each billing period unless cancelled before the renewal date. The one-time Starter top-up is a single non-recurring charge.</li>
                <li>You may cancel your subscription at any time. Upon cancellation, you retain access to the Service and any previously allocated tokens until the end of your current paid billing period. No further charges will be made after cancellation.</li>
                <li><span className={emphasisClass}>ALL SALES ARE FINAL. NO REFUNDS.</span> Because our Service delivers digital content, AI-generated outputs, and consumable tokens that are made available to you immediately upon payment, you expressly acknowledge and agree that your statutory right of withdrawal (including under the UK Consumer Contracts Regulations 2013 and equivalent EU / US state laws) is waived at the moment of purchase and that you are not entitled to a refund for partially used billing periods, unused tokens, unused portions of a subscription, accidental purchases, change of mind, dissatisfaction with AI-generated output, or any remaining tokens at the time of cancellation.</li>
                <li>Refunds may only be granted at our sole discretion in exceptional circumstances (for example, a verified duplicate charge or a verified system-wide outage that prevented delivery). Requests must be emailed to <span className={emphasisClass}>giovanni.sizino.ennes@hotmail.co.uk</span> within 14 days of the charge and include your account email and the Stripe charge ID.</li>
                <li>If we grant a refund, the equivalent tokens will be deducted from your balance automatically. If you have already spent those tokens, your remaining balance will be reduced to zero; we will not issue cash in lieu of consumed tokens.</li>
                <li><span className={emphasisClass}>Chargebacks and payment disputes:</span> filing a chargeback or dispute with your bank or card issuer without first contacting us to resolve the matter is a material breach of these Terms. We will contest such disputes with evidence (including usage logs, IP records, and your acceptance of these Terms) and reserve the right to immediately terminate your account, recover any resulting dispute fees from you, blacklist your email and payment instrument from future use of the Service, and refer the matter to a collections agency.</li>
                <li>Tokens have no monetary value, cannot be exchanged for cash, transferred to another account, resold, or refunded once delivered.</li>
                <li>We reserve the right to change subscription prices at any time. We will provide at least <span className={emphasisClass}>30 days' notice</span> of any price increase. Continued use of the Service after a price change takes effect constitutes your acceptance of the new pricing.</li>
                <li>If a payment fails, we may suspend your access to the Service until a valid payment method is provided.</li>
                <li><span className={emphasisClass}>Fraud prevention:</span> we reserve the right to refuse or cancel any transaction we reasonably believe to be fraudulent, in breach of these Terms, or an abuse of promotional pricing (including but not limited to repeated account creation, payment-instrument cycling, and geographic price arbitrage by misrepresentation).</li>
              </ul>
            </section>

            {/* 6. Token System */}
            <section className={sectionClass}>
              <h2 className={headingClass}>6. Token System</h2>
              <p className={bodyClass}>
                The Service operates on an additive token balance model. Tokens are awarded when you pay for the Starter top-up, when you subscribe to Pro or Premium, and each time a subscription renews. Tokens are consumed when you use AI features (for example, a full analysis currently costs 3 tokens).
              </p>
              <ul className={`${listClass} mt-3`}>
                <li>Tokens are <span className={emphasisClass}>additive and do not expire</span>. Balances carry over indefinitely and are never reset at a billing boundary.</li>
                <li>Upgrading, downgrading, or switching plans adds the new plan's tokens to your existing balance; it does not replace or reduce your current balance.</li>
                <li>Cancelling a subscription does not remove any tokens you have already been granted. You keep all previously awarded tokens.</li>
                <li>The number of tokens consumed per action is indicated within the Service interface and may change with reasonable notice.</li>
                <li>We reserve the right to modify token grants, consumption rates, and the token system generally at any time with reasonable notice. Changes will not retroactively reduce balances you have already paid for.</li>
                <li>Tokens have <span className={emphasisClass}>no monetary value</span>, cannot be exchanged for cash, transferred to another account, resold, or refunded once delivered.</li>
              </ul>
            </section>

            {/* 7. AI-Generated Content Disclaimer */}
            <section className={sectionClass}>
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-display font-bold text-white">7. AI-Generated Content Disclaimer</h2>
                </div>
                <p className={capsClass}>
                  THIS SECTION CONTAINS CRITICAL INFORMATION ABOUT THE NATURE OF AI-GENERATED CONTENT. PLEASE READ IT CAREFULLY.
                </p>
                <div className="mt-4 space-y-3">
                  <p className={bodyClass}>
                    All content generated by the Service, including but not limited to company intelligence reports, cover letters, strategic briefs, interview preparation materials, fit scores, presentation outlines, and mock interview responses, is produced by artificial intelligence (currently powered by Google Gemini). You acknowledge and agree to the following:
                  </p>
                  <ul className={`${listClass} mt-2`}>
                    <li>We make <span className={emphasisClass}>absolutely no guarantees</span> regarding the accuracy, completeness, correctness, reliability, timeliness, or suitability of any AI-generated content for any purpose whatsoever.</li>
                    <li>AI-generated output <span className={emphasisClass}>may contain factual errors, inaccuracies, omissions, outdated information, misleading statements, or inappropriate content</span>. The AI may "hallucinate" information that appears plausible but is entirely fabricated.</li>
                    <li>You <span className={emphasisClass}>must independently review, verify, and validate</span> all AI-generated content before using it in any job application, interview, professional communication, or any other context.</li>
                    <li>We are <span className={emphasisClass}>not responsible</span> for any consequences, damages, losses, or adverse outcomes arising from your use of or reliance upon AI-generated content, including but not limited to: failed job applications, unsuccessful interviews, missed career opportunities, reputational damage, or any other professional or personal harm.</li>
                    <li>Cover letters, interview answers, company intelligence reports, and all other outputs <span className={emphasisClass}>may contain errors</span> and should never be submitted or used without your careful personal review and editing.</li>
                    <li>You must <span className={emphasisClass}>not rely solely</span> on this Service for job applications, career decisions, or any professional undertaking.</li>
                  </ul>
                  <p className={capsClass + ' mt-4'}>
                    THE SERVICE DOES NOT PROVIDE PROFESSIONAL CAREER ADVICE, LEGAL ADVICE, RECRUITMENT SERVICES, OR ANY OTHER FORM OF PROFESSIONAL ADVICE. AI-GENERATED CONTENT IS PROVIDED FOR INFORMATIONAL AND ASSISTIVE PURPOSES ONLY AND MUST NOT BE TREATED AS A SUBSTITUTE FOR INDEPENDENT PROFESSIONAL JUDGEMENT.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. User Content & Data */}
            <section className={sectionClass}>
              <h2 className={headingClass}>8. User Content and Data</h2>
              <ul className={listClass}>
                <li>You retain full ownership of all content you upload to the Service, including your CV, resume, and any other personal documents ("User Content").</li>
                <li>By uploading User Content, you grant us a limited, non-exclusive, worldwide, royalty-free licence to process, analyse, and transmit your content through our AI systems solely for the purpose of providing the Service to you.</li>
                <li>You represent and warrant that you own or have the necessary rights, licences, and permissions to upload all User Content, and that your content does not infringe upon the intellectual property rights, privacy rights, or any other rights of any third party.</li>
                <li>We do not claim ownership of your User Content or of the AI-generated outputs produced from it.</li>
                <li>We may retain anonymised, aggregated usage data for the purposes of improving the Service. This data will not be individually identifiable.</li>
              </ul>
            </section>

            {/* 9. Acceptable Use */}
            <section className={sectionClass}>
              <h2 className={headingClass}>9. Acceptable Use</h2>
              <p className={bodyClass}>
                You agree not to use the Service for any purpose that is unlawful, prohibited by these Terms, or that could damage, disable, or impair the Service. Specifically, you agree not to:
              </p>
              <ul className={`${listClass} mt-3`}>
                <li>Scrape, crawl, spider, or use any automated means to access the Service or extract data from it.</li>
                <li>Reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code, algorithms, or underlying technology of the Service.</li>
                <li>Share, transfer, sell, or sublicence your account credentials to any other person or entity.</li>
                <li>Access the Service through any automated tool, bot, script, or similar technology without our prior written consent.</li>
                <li>Use the Service for any illegal, fraudulent, defamatory, or harmful purpose.</li>
                <li>Upload or transmit any malicious code, virus, worm, trojan, or other harmful content.</li>
                <li>Attempt to gain unauthorised access to any part of the Service, other user accounts, or our systems and infrastructure.</li>
                <li>Use the Service in a manner that could interfere with, disrupt, or impose an unreasonable burden on our infrastructure.</li>
                <li>Resell, redistribute, or commercially exploit the Service or any portion thereof without our prior written consent.</li>
              </ul>
            </section>

            {/* 10. Intellectual Property */}
            <section className={sectionClass}>
              <h2 className={headingClass}>10. Intellectual Property</h2>
              <p className={bodyClass}>
                The Vantage name, brand, logo, user interface design, visual elements, code, and all other proprietary materials are the intellectual property of the Operator and are protected by applicable intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our proprietary materials without our prior written consent.
              </p>
              <p className={`${bodyClass} mt-3`}>
                AI-generated output produced by the Service from your User Content belongs to you, subject to these Terms. However, such output is provided <span className={emphasisClass}>without any warranty</span> of originality, non-infringement, or fitness for any particular purpose. You are solely responsible for ensuring that your use of AI-generated output does not infringe upon the rights of any third party.
              </p>
            </section>

            {/* 11. Limitation of Liability */}
            <section className={sectionClass}>
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-red-400" />
                  <h2 className="text-xl font-display font-bold text-white">11. Limitation of Liability</h2>
                </div>
                <div className="space-y-4">
                  <p className={capsClass}>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE OPERATOR SHALL NOT BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES OF ANY KIND, WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF, OR INABILITY TO USE, THE SERVICE.
                  </p>
                  <p className={capsClass}>
                    THIS LIMITATION APPLIES TO, WITHOUT LIMITATION: LOSS OF PROFITS, REVENUE, OR INCOME; LOSS OF DATA OR DATA CORRUPTION; LOSS OF BUSINESS OPPORTUNITY OR GOODWILL; LOSS OF ANTICIPATED SAVINGS; CAREER IMPACT OR ADVERSE JOB OUTCOMES; FAILED JOB APPLICATIONS OR INTERVIEWS; RELIANCE ON AI-GENERATED CONTENT; AND ANY OTHER PECUNIARY OR NON-PECUNIARY LOSS, EVEN IF THE OPERATOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                  </p>
                  <p className={bodyClass}>
                    Without limiting the foregoing, the Operator is expressly not liable for:
                  </p>
                  <ul className={listClass}>
                    <li>Any inaccuracies, errors, or omissions in AI-generated content.</li>
                    <li>Any decisions you make based on information provided by the Service.</li>
                    <li>Service downtime, interruptions, or unavailability, whether planned or unplanned.</li>
                    <li>Loss of or damage to your data, including uploaded documents.</li>
                    <li>Failures, outages, or changes to third-party services upon which the Service depends (including but not limited to Stripe, Supabase, Google AI, and Vercel).</li>
                    <li>The outcome of any job application, interview, or career decision made in connection with use of the Service.</li>
                    <li>Any action or inaction by prospective employers, recruiters, or other third parties.</li>
                    <li>Security breaches or unauthorised access to your data caused by factors beyond our reasonable control.</li>
                  </ul>
                  <p className={capsClass + ' mt-3'}>
                    IN ANY EVENT, THE OPERATOR'S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR IN CONNECTION WITH THE SERVICE SHALL NOT EXCEED THE TOTAL AMOUNT YOU HAVE ACTUALLY PAID TO THE OPERATOR IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM. IF YOU HAVE NOT MADE ANY PAYMENTS, THE OPERATOR'S MAXIMUM LIABILITY SHALL BE ZERO (£0).
                  </p>
                  <p className={`${bodyClass} mt-3`}>
                    Some jurisdictions do not allow the exclusion or limitation of certain types of liability. In such jurisdictions, the Operator's liability shall be limited to the fullest extent permitted by applicable law.
                  </p>
                </div>
              </div>
            </section>

            {/* 12. Disclaimer of Warranties */}
            <section className={sectionClass}>
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-red-400" />
                  <h2 className="text-xl font-display font-bold text-white">12. Disclaimer of Warranties</h2>
                </div>
                <div className="space-y-4">
                  <p className={capsClass}>
                    THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE OPERATOR EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO:
                  </p>
                  <ul className={`${listClass} mt-2`}>
                    <li className={capsClass}>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</li>
                    <li className={capsClass}>ANY WARRANTY THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, ERROR-FREE, OR FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS.</li>
                    <li className={capsClass}>ANY WARRANTY THAT THE RESULTS OBTAINED FROM USE OF THE SERVICE WILL BE ACCURATE, RELIABLE, COMPLETE, OR CURRENT.</li>
                    <li className={capsClass}>ANY WARRANTY THAT AI-GENERATED CONTENT WILL BE SUITABLE, APPROPRIATE, OR FIT FOR ANY PARTICULAR PURPOSE, INCLUDING JOB APPLICATIONS, INTERVIEWS, OR CAREER ADVANCEMENT.</li>
                    <li className={capsClass}>ANY WARRANTY REGARDING THE QUALITY, AVAILABILITY, OR PERFORMANCE OF THE SERVICE OR ANY THIRD-PARTY SERVICES INTEGRATED WITH IT.</li>
                  </ul>
                  <p className={capsClass + ' mt-3'}>
                    YOUR USE OF THE SERVICE IS ENTIRELY AT YOUR OWN RISK. YOU ASSUME FULL RESPONSIBILITY FOR ALL RISKS ASSOCIATED WITH YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO ANY RELIANCE ON THE ACCURACY, COMPLETENESS, OR USEFULNESS OF ANY AI-GENERATED CONTENT.
                  </p>
                </div>
              </div>
            </section>

            {/* 13. Indemnification */}
            <section className={sectionClass}>
              <h2 className={headingClass}>13. Indemnification</h2>
              <p className={bodyClass}>
                You agree to indemnify, defend, and hold harmless the Operator from and against any and all claims, demands, actions, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in connection with:
              </p>
              <ul className={`${listClass} mt-3`}>
                <li>Your use of or access to the Service.</li>
                <li>Your violation of these Terms or any applicable law or regulation.</li>
                <li>Your User Content, including any claim that your content infringes upon the rights of any third party.</li>
                <li>Any misuse of AI-generated content provided by the Service.</li>
                <li>Any dispute between you and a third party arising from your use of the Service.</li>
              </ul>
              <p className={`${bodyClass} mt-3`}>
                This indemnification obligation shall survive the termination of these Terms and your use of the Service.
              </p>
            </section>

            {/* 14. Service Availability */}
            <section className={sectionClass}>
              <h2 className={headingClass}>14. Service Availability</h2>
              <p className={bodyClass}>
                The Service is provided on a <span className={emphasisClass}>best-effort basis</span>. We do not guarantee any specific level of uptime, availability, or performance. The Service may experience downtime, interruptions, degraded performance, or outages at any time due to maintenance, updates, technical issues, third-party service failures, or any other reason.
              </p>
              <p className={`${bodyClass} mt-3`}>
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, temporarily or permanently, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            {/* 15. Third-Party Services */}
            <section className={sectionClass}>
              <h2 className={headingClass}>15. Third-Party Services</h2>
              <p className={bodyClass}>
                The Service relies on and integrates with third-party services, including but not limited to:
              </p>
              <ul className={`${listClass} mt-3`}>
                <li><span className={emphasisClass}>Supabase</span> — Authentication and data storage.</li>
                <li><span className={emphasisClass}>Stripe</span> — Payment processing.</li>
                <li><span className={emphasisClass}>Google AI (Gemini)</span> — AI content generation.</li>
                <li><span className={emphasisClass}>Vercel</span> — Hosting and deployment.</li>
              </ul>
              <p className={`${bodyClass} mt-3`}>
                We are not responsible for the availability, reliability, accuracy, or performance of any third-party services. Your use of such services may be subject to their own terms of service and privacy policies, which you should review independently. Any failure, outage, change, or discontinuation of a third-party service is outside our control and we accept no liability for any resulting impact on the Service.
              </p>
            </section>

            {/* 16. Governing Law */}
            <section className={sectionClass}>
              <h2 className={headingClass}>16. Governing Law</h2>
              <p className={bodyClass}>
                These Terms shall be governed by and construed in accordance with the laws of <span className={emphasisClass}>England and Wales</span>, without regard to conflict of law principles. The courts of England and Wales shall have exclusive jurisdiction over any dispute arising out of or in connection with these Terms or the Service.
              </p>
            </section>

            {/* 17. Dispute Resolution */}
            <section className={sectionClass}>
              <h2 className={headingClass}>17. Dispute Resolution</h2>
              <p className={bodyClass}>
                In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the Service, you agree to first attempt to resolve the matter informally by contacting us at <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">giovanni.sizino.ennes@hotmail.co.uk</a>.
              </p>
              <p className={`${bodyClass} mt-3`}>
                If the dispute is not resolved within <span className={emphasisClass}>thirty (30) days</span> of your initial written notification, either party may pursue formal resolution through the courts of England and Wales in accordance with Section 16 above.
              </p>
            </section>

            {/* 18. Termination */}
            <section className={sectionClass}>
              <h2 className={headingClass}>18. Termination</h2>
              <ul className={listClass}>
                <li>You may terminate your account at any time by contacting us or using the account deletion functionality within the Service, where available.</li>
                <li>We may suspend or terminate your account and access to the Service immediately and without prior notice if we reasonably believe you have breached these Terms, engaged in fraudulent or abusive behaviour, or for any other reason at our sole discretion.</li>
                <li>Upon termination, your right to access and use the Service ceases immediately. We are under no obligation to retain, return, or provide access to any of your data or content following termination.</li>
                <li>Sections of these Terms that by their nature should survive termination shall survive, including but not limited to: Limitation of Liability, Disclaimer of Warranties, Indemnification, Governing Law, and Dispute Resolution.</li>
              </ul>
            </section>

            {/* 19. Severability */}
            <section className={sectionClass}>
              <h2 className={headingClass}>19. Severability</h2>
              <p className={bodyClass}>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if modification is not possible, shall be severed from these Terms. The invalidity or unenforceability of any provision shall not affect the validity or enforceability of any other provision, and the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            {/* 20. Changes to Terms */}
            <section className={sectionClass}>
              <h2 className={headingClass}>20. Changes to Terms</h2>
              <p className={bodyClass}>
                We reserve the right to modify, amend, or update these Terms at any time and at our sole discretion. The "Last updated" date at the top of this page will be revised to reflect the date of the most recent changes.
              </p>
              <p className={`${bodyClass} mt-3`}>
                For material changes, we will make reasonable efforts to notify you via email or a prominent notice within the Service. Your continued use of the Service after any changes to these Terms constitutes your binding acceptance of the updated Terms. If you do not agree with any changes, you must stop using the Service and terminate your account.
              </p>
            </section>

            {/* 21. No Support Guarantee */}
            <section className={sectionClass}>
              <h2 className={headingClass}>21. No Support Guarantee</h2>
              <p className={bodyClass}>
                Vantage is a personal passion project. We do not guarantee customer support response times, availability, or resolution. Support enquiries are handled on a <span className={emphasisClass}>best-effort basis</span> and may be subject to significant delays. There is no service-level agreement (SLA) for support. We are under no obligation to provide technical support, troubleshooting, or assistance of any kind, although we will endeavour to help where we reasonably can.
              </p>
            </section>

            {/* 22. Contact */}
            <section className="mb-4">
              <h2 className={headingClass}>22. Contact</h2>
              <p className={bodyClass}>
                If you have any questions, concerns, or requests regarding these Terms, please contact us at:
              </p>
              <div className="mt-4 bg-violet-500/5 border border-violet-500/10 rounded-xl p-5">
                <p className="text-white/70 text-sm">
                  <span className={emphasisClass}>Email:</span>{' '}
                  <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">
                    giovanni.sizino.ennes@hotmail.co.uk
                  </a>
                </p>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-white/30 text-xs">
              These Terms of Service were last updated on 20 April 2026.
            </p>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <Link to="/" className="text-white/40 hover:text-white/70 transition-colors">Home</Link>
              <Link to="/privacy" className="text-white/40 hover:text-white/70 transition-colors">Privacy Policy</Link>
              <Link to="/pricing" className="text-white/40 hover:text-white/70 transition-colors">Pricing</Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
