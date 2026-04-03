import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { Mail, User, ArrowRight, Check, Clock, Sparkles, Zap } from 'lucide-react';
import { joinWaitlist, getWaitlistCount } from '../services/api';

interface WaitlistProps {
  launchDate?: Date;
  onPreOrderClick?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Waitlist({ launchDate, onPreOrderClick }: WaitlistProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  const targetDate = launchDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    getWaitlistCount().then(setWaitlistCount).catch(() => {});
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (countdownRef.current) {
      const digits = countdownRef.current.querySelectorAll('.digit-group');
      gsap.fromTo(digits, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const result = await joinWaitlist(email.trim(), name.trim() || undefined);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Failed to join waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-semibold text-violet-300">Launching Soon</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Get Early Access
              </h2>
              <p className="text-lg text-white/60 max-w-xl mx-auto">
                Join the waitlist to be notified when Vantage launches. Be the first to experience AI-powered job preparation.
              </p>
            </div>

            <div ref={countdownRef} className="flex justify-center gap-3 md:gap-5 mb-10">
              {timeUnits.map((unit, index) => (
                <div key={unit.label} className="digit-group">
                  <div className="relative">
                    <div className="w-16 md:w-20 h-20 md:h-24 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center">
                      <span className="text-3xl md:text-4xl font-mono font-bold text-white">
                        {String(unit.value).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <span className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest">
                        {unit.label}
                      </span>
                    </div>
                  </div>
                  {index < timeUnits.length - 1 && (
                    <div className="absolute top-1/2 -right-3 md:-right-4 -translate-y-1/2 text-2xl text-white/20 font-light">
                      :
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 font-medium outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 font-medium outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Join the Waitlist <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Clock className="w-4 h-4" />
                <span>{waitlistCount} people already waiting</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <button
                onClick={onPreOrderClick}
                className="flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>Pre-order now &rarr;</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-green-500/30 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">
              You're on the list!
            </h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              We'll notify you when Vantage launches. In the meantime, watch the countdown above as we prepare to go live.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white/40 text-sm">Share with friends:</span>
              <button className="text-white/60 hover:text-white transition-colors text-sm font-semibold">
                Twitter
              </button>
              <button className="text-white/60 hover:text-white transition-colors text-sm font-semibold">
                LinkedIn
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}