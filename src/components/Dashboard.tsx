import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Link as LinkIcon, FileText, Loader2, Sparkles, ChevronRight,
  User, LogOut, CreditCard, Plus, Zap, Crown, Star, Settings
} from 'lucide-react';
import { useAuth } from '../App';
import { getCreditsRemaining, hasCredits } from '../lib/supabase';
import { analyzeJob } from '../services/api';

const PLANS = [
  { name: 'Starter', price: 5, credits: 10, color: '#6B6B8D', icon: Zap, features: ['10 analyses/mo', 'Strategic Brief', 'Cover Letter', 'Interview Pack'] },
  { name: 'Pro', price: 12, credits: 30, color: '#4F46E5', icon: Star, features: ['30 analyses/mo', 'AI Mock Interview', 'STAR Stories', 'Everything in Starter'] },
  { name: 'Premium', price: 20, credits: 60, color: '#7C3AED', icon: Crown, features: ['60 analyses/mo', 'CV Fit Score', 'Presentation Deck', 'Priority', 'Everything in Pro'] },
];

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'processing' | 'results'>('input');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  const creditsRemaining = profile ? getCreditsRemaining(profile) : 0;
  const canAnalyze = hasCredits(profile || null, 2);

  const handleStart = async () => {
    if (!cvFile) { setError('Please upload your CV'); return; }
    if (!jobUrl) { setError('Please add a job URL'); return; }
    if (!canAnalyze) { 
      setError('Not enough credits. Upgrade your plan!'); 
      return; 
    }

    setError('');
    setStep('processing');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const cvText = e.target?.result as string;
        
        let jobDescText = null;
        if (jobDescFile) {
          jobDescText = await jobDescFile.text();
        }

        const result = await analyzeJob(
          {
            cvFile,
            jobUrl,
            jobDescFile: jobDescFile || undefined,
          },
          (msg) => console.log(msg)
        );

        if (result.success) {
          setResults(result.data);
          setStep('results');
        } else {
          setError(result.error || 'Analysis failed');
          setStep('input');
        }
      };
      reader.readAsText(cvFile);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setStep('input');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">Vantage</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-sm font-bold text-emerald-400">{creditsRemaining} Credits</span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-display font-bold text-white mb-2">New Analysis</h1>
                <p className="text-white/50">Upload your CV and add a job URL to get started</p>
              </div>

              {!canAnalyze && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-amber-400 font-semibold">Low on credits</p>
                    <p className="text-amber-400/70 text-sm">Upgrade your plan to continue</p>
                  </div>
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold text-sm"
                  >
                    Upgrade
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-5 mb-6">
                {/* CV Upload */}
                <div
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) setCvFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setCvFile(e.target.files[0])}
                  />
                  <div className="text-center">
                    {cvFile ? (
                      <>
                        <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-white font-semibold text-sm truncate">{cvFile.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                        <p className="text-white/50 text-sm">Upload CV</p>
                        <p className="text-white/30 text-xs">PDF, DOCX, TXT</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Job Description Upload */}
                <div
                  className="p-6 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer"
                  onClick={() => jdInputRef.current?.click()}
                >
                  <input
                    ref={jdInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setJobDescFile(e.target.files[0])}
                  />
                  <div className="text-center">
                    {jobDescFile ? (
                      <>
                        <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-white font-semibold text-sm truncate">{jobDescFile.name}</p>
                      </>
                    ) : (
                      <>
                        <FileText className="w-8 h-8 text-white/30 mx-auto mb-2" />
                        <p className="text-white/50 text-sm">Job Description</p>
                        <p className="text-white/30 text-xs">Optional</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Job URL */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    Job URL
                  </label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-transparent text-white placeholder-white/30 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!cvFile || !jobUrl || !canAnalyze}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Intelligence
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Analyzing...</h2>
              <p className="text-white/50">This usually takes 30-60 seconds</p>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-bold text-white">Results</h1>
                <button
                  onClick={() => { setStep('input'); setCvFile(null); setJobUrl(''); setResults(null); }}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10"
                >
                  New Analysis
                </button>
              </div>

              {/* Company Snapshot */}
              {results.companySnapshot && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Company Intelligence</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/40 uppercase">Mission</p>
                      <p className="text-white">{results.companySnapshot.mission}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {results.companySnapshot.name && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Company</p>
                          <p className="text-white font-semibold">{results.companySnapshot.name}</p>
                        </div>
                      )}
                      {results.companySnapshot.industry && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Industry</p>
                          <p className="text-white">{results.companySnapshot.industry}</p>
                        </div>
                      )}
                      {results.companySnapshot.size && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Size</p>
                          <p className="text-white">{results.companySnapshot.size}</p>
                        </div>
                      )}
                      {results.companySnapshot.founded && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Founded</p>
                          <p className="text-white">{results.companySnapshot.founded}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Strategic Brief */}
              {results.strategicBrief && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Strategic Brief</h3>
                  <p className="text-white/70 whitespace-pre-wrap">{results.strategicBrief}</p>
                </div>
              )}

              {/* Cover Letter */}
              {results.coverLetter && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Cover Letter</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/70 whitespace-pre-wrap font-serif leading-relaxed">{results.coverLetter}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}