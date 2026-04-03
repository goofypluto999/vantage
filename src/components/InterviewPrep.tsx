import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Lightbulb, Clock, CheckCircle, Target, Briefcase, User, MessageSquare, HelpCircle, GraduationCap } from 'lucide-react';

const TABS = [
  { id: '5min', label: '5-Min Drill', icon: Clock },
  { id: 'company', label: 'Know the Company', icon: Target },
  { id: 'role', label: 'Know the Role', icon: Briefcase },
  { id: 'fit', label: 'Why You Fit', icon: User },
  { id: 'stories', label: 'Interview Stories', icon: MessageSquare },
  { id: 'questions', label: 'Questions to Ask', icon: HelpCircle },
  { id: 'flashcards', label: 'Flashcards', icon: GraduationCap },
  { id: 'mock', label: 'Mock Interview', icon: Lightbulb },
  { id: 'timed', label: 'Timed Practice', icon: Clock },
];

export default function InterviewPrep({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('flashcards');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-6 overflow-hidden flex flex-col h-[700px]">
      {/* Header Tabs */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive ? 'bg-[#4F46E5] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-[#fafafa] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 p-8 overflow-y-auto"
          >
            {activeTab === 'flashcards' && <FlashcardsView />}
            {activeTab === 'mock' && <MockInterviewView />}
            {activeTab === 'timed' && <TimedPracticeView />}
            {activeTab === '5min' && <FiveMinDrillView />}
            {activeTab === 'company' && <KnowTheCompanyView />}
            {activeTab === 'role' && <KnowTheRoleView />}
            {activeTab === 'fit' && <WhyYouFitView />}
            {activeTab === 'stories' && <InterviewStoriesView />}
            {activeTab === 'questions' && <QuestionsToAskView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FiveMinDrillView() {
  return (
    <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-[#4F46E5]" />
          <h3 className="font-display font-bold text-xl text-[#2D2B4E]">5-Minute Quick Recap</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#4F46E5]/5 rounded-xl p-4 border border-[#4F46E5]/10">
            <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-widest">Company</span>
            <p className="text-sm font-bold text-[#2D2B4E] mt-1">Acme Corp</p>
          </div>
          <div className="bg-[#A8E6CF]/10 rounded-xl p-4 border border-[#A8E6CF]/30">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Role</span>
            <p className="text-sm font-bold text-[#2D2B4E] mt-1">Senior Product Manager</p>
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-widest">Top 3 Strengths</span>
          <ul className="mt-2 space-y-2">
            {['7 years product leadership in SaaS', 'Led 3 successful product launches', 'Strong data-driven decision making'].map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#3B3A5C] font-medium">
                <CheckCircle className="w-4 h-4 text-[#A8E6CF] mt-0.5 flex-shrink-0" />{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#FFB7B2]/10 rounded-xl p-4 border border-[#FFB7B2]/30">
          <span className="text-[10px] font-bold text-[#FFB7B2] uppercase tracking-widest">Potential Weakness — Frame It</span>
          <p className="text-sm text-[#3B3A5C] mt-1 font-medium">Limited enterprise sales experience → Frame as "strategic partner-facing product leadership"</p>
        </div>
      </div>
    </div>
  );
}

function KnowTheCompanyView() {
  const sections = [
    { title: 'Mission', content: 'Building the future of sustainable enterprise software solutions.' },
    { title: 'Recent News', content: 'Announced Series C funding of $120M. Expanding into LATAM markets. New AI-powered analytics platform launched Q1 2026.' },
    { title: 'Core Values', content: 'Innovation, Transparency, Customer Obsession, Sustainable Growth' },
    { title: 'Key Language', content: '"Move fast with purpose", "Data-driven decisions", "Customer-first engineering"' },
  ];
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h3 className="font-display font-bold text-2xl text-[#2D2B4E] mb-6">Know the Company</h3>
      {sections.map((s, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-2">{s.title}</h4>
          <p className="text-sm text-[#3B3A5C] font-medium leading-relaxed">{s.content}</p>
        </div>
      ))}
    </div>
  );
}

function KnowTheRoleView() {
  const skills = [
    { skill: 'Cross-functional Leadership', weight: 'Critical', desc: 'Ability to align engineering, design, and business stakeholders' },
    { skill: 'Data Analysis', weight: 'High', desc: 'Comfort with SQL, analytics dashboards, and A/B testing frameworks' },
    { skill: 'Strategic Roadmapping', weight: 'High', desc: 'Experience building and defending product roadmaps to leadership' },
    { skill: 'Customer Research', weight: 'Medium', desc: 'Conducting user interviews and translating insights into features' },
  ];
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h3 className="font-display font-bold text-2xl text-[#2D2B4E] mb-2">Know the Role</h3>
      <p className="text-sm text-[#6B6B8D] font-medium mb-4">What this job is really testing for, decoded into plain language.</p>
      {skills.map((s, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${s.weight === 'Critical' ? 'bg-[#4F46E5]/10 text-[#4F46E5]' : s.weight === 'High' ? 'bg-[#A1C9F1]/20 text-[#3B3A5C]' : 'bg-gray-100 text-[#6B6B8D]'}`}>{s.weight}</div>
          <div>
            <h4 className="font-bold text-[#2D2B4E] text-sm">{s.skill}</h4>
            <p className="text-sm text-[#6B6B8D] mt-1">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WhyYouFitView() {
  const evidence = [
    { requirement: 'Cross-functional Leadership', match: 'Led product team of 8 across 3 time zones at TechCo', strength: 95 },
    { requirement: 'Data-Driven Decisions', match: 'Built analytics dashboard increasing retention by 23%', strength: 88 },
    { requirement: 'Strategic Roadmapping', match: '3 product launches from concept to market in 18 months', strength: 92 },
    { requirement: 'Customer Research', match: 'Conducted 50+ user interviews for enterprise product', strength: 75 },
  ];
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h3 className="font-display font-bold text-2xl text-[#2D2B4E] mb-2">Why You Fit</h3>
      <p className="text-sm text-[#6B6B8D] font-medium mb-4">CV-to-role evidence map with strength indicators.</p>
      {evidence.map((e, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-[#2D2B4E] text-sm">{e.requirement}</h4>
            <span className="text-xs font-mono font-bold text-[#A8E6CF]">{e.strength}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3">
            <div className="h-full bg-gradient-to-r from-[#A8E6CF] to-[#A1C9F1] rounded-full" style={{ width: `${e.strength}%` }} />
          </div>
          <p className="text-sm text-[#6B6B8D] font-medium"><span className="text-[#4F46E5] font-bold">Evidence:</span> {e.match}</p>
        </div>
      ))}
    </div>
  );
}

function InterviewStoriesView() {
  const stories = [
    { situation: 'Product pivot during market downturn', task: 'Needed to reposition the product for enterprise segment', action: 'Led cross-functional team to rebuild positioning and pricing', result: 'Achieved 40% increase in enterprise pipeline within 6 months' },
    { situation: 'Team scaling from 3 to 12 engineers', task: 'Maintain velocity and culture during rapid growth', action: 'Implemented structured onboarding and pair programming', result: 'Zero regrettable attrition, shipped 2 major features on schedule' },
  ];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="font-display font-bold text-2xl text-[#2D2B4E] mb-2">Interview Stories</h3>
      <p className="text-sm text-[#6B6B8D] font-medium mb-4">STAR framework prompts built from your CV achievements.</p>
      {stories.map((s, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
          {Object.entries(s).map(([key, val]) => (
            <div key={key} className="flex items-start gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-widest w-16 mt-0.5 flex-shrink-0 ${
                key === 'situation' ? 'text-[#4F46E5]' : key === 'task' ? 'text-[#A1C9F1]' : key === 'action' ? 'text-[#A8E6CF]' : 'text-[#FFB7B2]'
              }`}>{key.charAt(0).toUpperCase()}</span>
              <p className="text-sm text-[#3B3A5C] font-medium">{val}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function QuestionsToAskView() {
  const questions = [
    'What does success look like in the first 90 days for this role?',
    'How does the product team collaborate with engineering leadership on roadmap priorities?',
    'What are the biggest challenges the team is facing right now?',
    'How does the company approach experimentation and A/B testing?',
    'Can you tell me about the team culture and how decisions are made?',
    'What\'s the company\'s approach to professional development?',
  ];
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h3 className="font-display font-bold text-2xl text-[#2D2B4E] mb-2">Questions to Ask</h3>
      <p className="text-sm text-[#6B6B8D] font-medium mb-4">Intelligent questions generated from company research.</p>
      {questions.map((q, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
          <span className="text-lg font-mono font-bold text-[#9B99B7]/40 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
          <p className="text-sm text-[#3B3A5C] font-medium leading-relaxed">{q}</p>
        </div>
      ))}
    </div>
  );
}

function FlashcardsView() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARDS = [
    { q: "What is your biggest weakness?", h: "Focus on a real weakness that you are actively improving. Use the STAR method to show progress." },
    { q: "Why do you want to work here?", h: "Link their mission to your personal values. Mention a recent project they launched." },
    { q: "Tell me about a time you failed.", h: "Own the mistake. Explain what you learned and how you've changed your process to prevent it." },
  ];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % CARDS.length), 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length), 150);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl flex items-center justify-between gap-8 h-80" style={{ perspective: '1200px' }}>
        <button onClick={handlePrev} className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm text-gray-500 hover:text-[#4F46E5] transition-colors"><ChevronLeft className="w-6 h-6" /></button>
        
        <div
          className="flex-grow h-full relative font-body cursor-pointer transition-transform duration-500 will-change-transform"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-[#4F46E5] font-bold text-sm uppercase tracking-widest mb-6">Question</span>
            <h3 className="text-2xl font-display font-bold text-[#2D2B4E] leading-tight mb-8 px-4">{CARDS[currentIndex].q}</h3>
            <span className="text-xs text-gray-400 font-medium">Click to flip</span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#A8A5E6]/10 to-[#A1C9F1]/10 border border-white/60 rounded-3xl shadow-[0_16px_48px_rgba(79,70,229,0.1)] p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Hint</span>
            <p className="text-lg font-medium text-[#3B3A5C] leading-relaxed px-4">{CARDS[currentIndex].h}</p>
          </div>
        </div>

        <button onClick={handleNext} className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm text-gray-500 hover:text-[#4F46E5] transition-colors"><ChevronRight className="w-6 h-6" /></button>
      </div>

      <div className="mt-8 font-mono text-sm text-[#9B99B7] font-semibold">
        Card {currentIndex + 1} of {CARDS.length}
      </div>
    </div>
  );
}

function MockInterviewView() {
  return (
    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
      <div className="w-20 h-20 bg-[#4F46E5]/10 rounded-full flex items-center justify-center border border-[#4F46E5]/20">
        <MessageSquare className="w-8 h-8 text-[#4F46E5]" />
      </div>
      <h3 className="text-3xl font-display font-bold text-[#2D2B4E]">Walk me through your resume.</h3>
      <p className="text-[#6B6B8D] font-medium">Record your answer out loud. Focus on the narrative arc, not just reciting bullet points.</p>
      
      <div className="flex gap-4 pt-4">
        <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Show Hint</button>
        <button className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg shadow-md font-semibold hover:bg-[#6366F1] transition-colors">Next Prompt <ChevronRight className="w-4 h-4 inline" /></button>
      </div>
    </div>
  );
}

function TimedPracticeView() {
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => { setIsActive(false); setTimeLeft(120); };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (timeLeft / 120) * circumference;

  let strokeColor = '#10B981'; // green
  if (timeLeft <= 30) strokeColor = '#EF4444'; // red
  else if (timeLeft <= 60) strokeColor = '#F59E0B'; // amber

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8">
      <h3 className="text-2xl font-display font-bold text-[#2D2B4E]">Timed Practice</h3>
      
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* SVG Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 260 260">
          <circle cx="130" cy="130" r="120" stroke="#f3f4f6" strokeWidth="12" fill="none" />
          <motion.circle 
            cx="130" 
            cy="130" 
            r="120" 
            stroke={strokeColor} 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round"
            animate={{ strokeDashoffset }}
            style={{ strokeDasharray: circumference }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        <div className="text-6xl font-mono font-bold text-[#2D2B4E] tracking-tighter shadow-sm">{formatTime(timeLeft)}</div>
      </div>
      
      <div className="flex gap-4 flex-col items-center mt-8">
        <p className="text-[#6B6B8D] font-medium text-center">Tell me about a time you handled a difficult stakeholder.</p>
        <div className="flex gap-4">
          <button onClick={toggle} className="w-32 py-3 bg-[#4F46E5] text-white rounded-lg shadow-md font-semibold hover:bg-[#6366F1] transition-colors">
            {isActive ? 'Pause' : 'Start Timer'}
          </button>
          <button onClick={reset} className="w-32 py-3 bg-white border border-gray-200 rounded-lg shadow-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Reset
          </button>
        </div>
      </div>
      
      {timeLeft === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg mt-8">
          <h4 className="font-bold text-[#2D2B4E] mb-2 text-center">Rate your answer</h4>
          <div className="flex gap-2 justify-center">
            {[1,2,3,4,5].map(s => (
              <button key={s} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#FFB7B2] font-bold text-gray-500 hover:text-white transition-colors">{s}</button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
