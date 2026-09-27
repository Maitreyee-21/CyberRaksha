'use client';

import * as React from 'react';
import {
  Shield,
  Link2,
  QrCode,
  Cpu,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  User,
  Mail,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Search,
  Sparkles,
  Layers,
  Clock,
  Zap,
  Activity,
  X,
  BookOpen,
  ExternalLink,
  RefreshCw,
  FileText,
  PhoneCall,
  Radio,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { CyberArticle } from '@/app/api/cyber-news/route';

interface LandingPageProps {
  onGoToLogin: () => void;
  onRegistered: (creds?: { identifier: string; password?: string }) => void;
  onGoToRegister?: () => void;
}

const FEATURES = [
  {
    icon: Link2,
    title: 'Suspicious URL Detection',
    description: 'Detect phishing and malicious links before clicking.',
    accent: 'from-cyan-500/20 to-teal-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: QrCode,
    title: 'QR Code Security Analysis',
    description: 'Scan QR codes and identify hidden malicious destinations.',
    accent: 'from-teal-500/20 to-emerald-500/10',
    iconColor: 'text-teal-400',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Threat Intelligence',
    description: 'Intelligent analysis to identify potential cyber threats.',
    accent: 'from-blue-500/20 to-indigo-500/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: MessageSquare,
    title: 'Scam Message Detection',
    description: 'Analyze suspicious messages and identify scam patterns.',
    accent: 'from-purple-500/20 to-pink-500/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Score & Explanation',
    description: 'Get a clear security score along with understandable reasons.',
    accent: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: ShieldCheck,
    title: 'Cyber Safety Recommendations',
    description: 'Receive actionable steps to stay protected online.',
    accent: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Upload or Paste',
    description: 'Paste a URL, upload a QR code, image, or suspicious content.',
    icon: UploadCloud,
    tag: 'Input Intake',
  },
  {
    title: 'AI Security Analysis',
    description: 'CyberRaksha intelligently analyzes multiple threat indicators.',
    icon: Search,
    tag: 'Granite AI Defense',
  },
  {
    title: 'Get Protection Insights',
    description: 'Receive a risk score, threat explanation, and safety recommendations.',
    icon: ShieldCheck,
    tag: 'Actionable Shield',
  },
];

const TRUST_METRICS = [
  {
    icon: Sparkles,
    title: 'AI Powered Analysis',
    description: 'Continuous threat intelligence models trained on confirmed digital scam vectors.',
  },
  {
    icon: Layers,
    title: 'Multi-Source Threat Detection',
    description: 'Multi-layered verification across DNS records, domain reputation, and NLP models.',
  },
  {
    icon: Clock,
    title: 'Instant Risk Assessment',
    description: 'High-speed heuristic scans evaluate danger indicators in real time.',
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'Zero logging of personal scanned queries; secure ephemeral sandbox processing.',
  },
];

const SOCIAL_CHANNELS = [
  {
    name: 'X (Twitter)',
    href: 'https://x.com',
    ariaLabel: 'Follow CyberRaksha on X (Twitter)',
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    ariaLabel: 'Connect with CyberRaksha on LinkedIn',
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.54a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com',
    ariaLabel: 'CyberRaksha GitHub Repository',
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    ariaLabel: 'CyberRaksha YouTube Channel',
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://telegram.org',
    ariaLabel: 'CyberRaksha Alerts on Telegram',
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

export function LandingPage({ onGoToLogin, onRegistered }: LandingPageProps) {
  // Registration modal state
  const [registerOpen, setRegisterOpen] = React.useState(false);

  // Registration form state
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);

  // Auto-redirect after success
  React.useEffect(() => {
    if (!success) return;
    if (countdown <= 0) {
      setRegisterOpen(false);
      onRegistered({
        identifier: email.trim().toLowerCase() || username.trim().toLowerCase(),
        password,
      });
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, onRegistered, email, username, password]);

  // Cyber News / Latest Articles state
  const [articles, setArticles] = React.useState<CyberArticle[]>([]);
  const [newsLoading, setNewsLoading] = React.useState(true);
  const [newsCategory, setNewsCategory] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedArticle, setSelectedArticle] = React.useState<CyberArticle | null>(null);
  const [lastRefreshed, setLastRefreshed] = React.useState<string>('Just now');

  const fetchNews = React.useCallback(async () => {
    setNewsLoading(true);
    try {
      const res = await fetch('/api/cyber-news');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch {
      // Keep existing or fallback
    } finally {
      setNewsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required.';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Enter at least 2 characters.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address.';
    }

    const effectiveUsername = (username.trim() || email.trim().split('@')[0] || '').replace(/\s+/g, '_');
    if (username.trim() && !/^[a-zA-Z0-9_.\-@+]+$/.test(effectiveUsername)) {
      errs.username = 'Only letters, numbers, hyphens, dots, and underscores are allowed.';
    } else if (effectiveUsername && effectiveUsername.length < 2) {
      errs.username = 'Username must be at least 2 characters.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    const emailClean = email.trim().toLowerCase();
    const effectiveUsername = (username.trim() || emailClean.split('@')[0]).replace(/\s+/g, '_').toLowerCase();

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: emailClean,
          username: effectiveUsername,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          if (data.error?.toLowerCase().includes('email')) {
            setErrors((prev) => ({ ...prev, email: data.error }));
          } else if (data.error?.toLowerCase().includes('username')) {
            setErrors((prev) => ({ ...prev, username: data.error }));
          } else {
            setGeneralError(data.error || 'Registration conflict occurred.');
          }
        } else {
          setGeneralError(data.error || 'Failed to complete registration.');
        }
        return;
      }

      // Sync user session to localStorage
      if (typeof window !== 'undefined' && data.user) {
        try {
          if (data.token) {
            localStorage.setItem('cyberraksha-token', data.token);
          }
          localStorage.setItem('cyberraksha-user', JSON.stringify(data.user));
          localStorage.setItem('cyberraksha-profile', JSON.stringify({
            name: data.user.fullName,
            email: data.user.email,
          }));
          window.dispatchEvent(new CustomEvent('cyberraksha-profile-updated'));
        } catch {
          // ignore
        }
      }

      setSuccess(true);
    } catch (err: any) {
      setGeneralError(err?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient radial glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -left-20 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-10 right-1/3 h-[400px] w-[400px] rounded-full bg-teal-500/8 blur-[130px]" />
      </div>

      {/* ═══════════════════════════════ 1. NAVBAR ═══════════════════════════════ */}
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-6 sm:px-12 py-3.5 backdrop-blur-md">
        <a href="#" className="flex items-center gap-2.5 group" aria-label="CyberRaksha Home">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-transform group-hover:scale-105">
            <Shield size={18} aria-hidden="true" />
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-100">
            Cyber<span className="text-cyan-400">Raksha</span>
          </span>
        </a>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white hover:text-cyan-400 transition-colors">
            Home
          </button>
          <button onClick={() => scrollToSection('features')} className="text-white hover:text-cyan-400 transition-colors">
            Features
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-white hover:text-cyan-400 transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection('threat-intelligence')} className="text-white hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
            <Radio size={13} className="text-white group-hover:text-cyan-400 transition-colors" />
            Threat Intelligence
          </button>
          <button onClick={() => scrollToSection('about')} className="text-white hover:text-cyan-400 transition-colors">
            About
          </button>
        </div>

        {/* Top-Right Action Buttons: Register | Login */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setSuccess(false);
              setCountdown(3);
              setGeneralError(null);
              setRegisterOpen(true);
            }}
            size="sm"
            variant="outline"
            className="border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-semibold px-4 transition shadow-xs"
          >
            Register
          </Button>

          <Button
            onClick={onGoToLogin}
            size="sm"
            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold px-5 shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            Login
          </Button>
        </div>
      </nav>

      {/* ═══════════════════════════════ 2. UPPER-CENTERED HERO SECTION ═══════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-12 lg:pb-14 text-center">
        <div className="flex flex-col items-center mx-auto space-y-5">

          {/* Main Heading (Upper Centered) */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem] font-extrabold tracking-tight text-zinc-50 leading-[1.12] max-w-3xl">
            Your Digital Shield Against{' '}
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
              Cyber Threats
            </span>
          </h1>

          {/* Live Security Threat Intel Chip (Positioned Below Main Heading) */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>AI Threat Intel v2.4</span>
            <span className="text-zinc-500 font-mono">|</span>
            <span className="text-zinc-300 normal-case font-normal text-[11px]">Real-Time Security Active</span>
          </div>

          {/* Supporting Copy (Centered) */}
          <p className="text-base sm:text-lg text-zinc-300/90 leading-relaxed max-w-2xl mx-auto pt-1">
            CyberRaksha uses intelligent AI-powered analysis to help detect suspicious links, QR codes, messages, images, and digital threats before they can harm you.
          </p>

          {/* Supporting Cybersecurity Signals (Centered 4-column Grid) */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl w-full text-left">
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-3 backdrop-blur-sm shadow-sm transition hover:border-cyan-500/30">
              <ShieldCheck size={18} className="text-cyan-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">Zero-Day Shield</div>
                <div className="text-[10px] text-zinc-400 truncate">Heuristic AI models</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-3 backdrop-blur-sm shadow-sm transition hover:border-teal-500/30">
              <Lock size={18} className="text-teal-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">Zero-Log Privacy</div>
                <div className="text-[10px] text-zinc-400 truncate">Transient RAM analysis</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-3 backdrop-blur-sm shadow-sm transition hover:border-blue-500/30">
              <Activity size={18} className="text-blue-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">Multi-Format</div>
                <div className="text-[10px] text-zinc-400 truncate">URLs, SMS, QR &amp; Images</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-3 backdrop-blur-sm shadow-sm transition hover:border-purple-500/30">
              <Zap size={18} className="text-purple-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">Instant Rating</div>
                <div className="text-[10px] text-zinc-400 truncate">Clear risk score 0–100</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════ REGISTRATION POPUP / MODAL ═══════════════════════════════ */}
      {registerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setRegisterOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-reg-title"
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-900/95 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setRegisterOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              aria-label="Close registration popup"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="mb-5 text-left pr-6">
              <div className="flex items-center justify-between">
                <h2 id="modal-reg-title" className="text-lg sm:text-xl font-bold text-zinc-100">
                  Create Your Secure Account
                </h2>
                <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 tracking-wide">
                  FREE ACCESS
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                Join CyberRaksha and take control of your digital safety.
              </p>
            </div>

            {generalError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 text-left" role="alert">
                {generalError}
              </div>
            )}

            {success ? (
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-8 text-center animate-in fade-in zoom-in duration-300" aria-live="polite">
                <CheckCircle2 size={44} className="mx-auto mb-3 text-cyan-400" aria-hidden="true" />
                <h3 className="text-base font-bold text-zinc-100">Registration successful!</h3>
                <p className="mt-2 text-xs text-zinc-300">
                  Welcome, <span className="font-semibold text-cyan-400">{fullName}</span>. Your account is secured.
                </p>
                <p className="mt-3 text-xs text-zinc-400">
                  Redirecting to login in <span className="font-mono font-bold text-cyan-400">{countdown}s</span>...
                </p>
                <Button
                  onClick={() => {
                    setRegisterOpen(false);
                    onRegistered({
                      identifier: email.trim().toLowerCase() || username.trim().toLowerCase(),
                      password,
                    });
                  }}
                  size="sm"
                  className="mt-5 w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold gap-2"
                >
                  Proceed to Login <ArrowRight size={14} aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3 text-left" noValidate>
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300" htmlFor="modal-reg-fullname">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                    <Input
                      id="modal-reg-fullname"
                      type="text"
                      placeholder="Aarav Sharma"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      className="pl-9 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                      autoComplete="name"
                    />
                  </div>
                  {errors.fullName && <p className="text-[11px] text-red-400">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300" htmlFor="modal-reg-email">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                    <Input
                      id="modal-reg-email"
                      type="email"
                      placeholder="aarav@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className="pl-9 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300" htmlFor="modal-reg-username">
                    Username <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <AtSign size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                    <Input
                      id="modal-reg-username"
                      type="text"
                      placeholder="aarav_shield"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrors((prev) => ({ ...prev, username: '' }));
                      }}
                      className="pl-9 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                      autoComplete="username"
                    />
                  </div>
                  {errors.username && <p className="text-[11px] text-red-400">{errors.username}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300" htmlFor="modal-reg-password">
                    Password <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                    <Input
                      id="modal-reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      className="pl-9 pr-9 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-400">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300" htmlFor="modal-reg-confirm">
                    Confirm Password <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                    <Input
                      id="modal-reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      className="pl-9 pr-9 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                      tabIndex={-1}
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirm ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] text-red-400">{errors.confirmPassword}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  {loading ? 'Creating Account...' : 'Register'}
                  {!loading && <ArrowRight size={15} aria-hidden="true" />}
                </Button>

                <p className="pt-1.5 text-center text-xs text-zinc-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterOpen(false);
                      onGoToLogin();
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 transition"
                  >
                    Login here
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════ 3. FEATURES SECTION ═══════════════════════════════ */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 py-16 lg:py-20 text-center">
        <div className="mx-auto max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Deep Capabilities
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
            Advanced Cyber Defense Toolkit
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            CyberRaksha integrates multiple intelligence-gathering vectors to provide a complete picture of your safety before interactions occur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {FEATURES.map(({ icon: Icon, title, description, accent, iconColor }) => (
            <div
              key={title}
              className="group relative rounded-3xl border border-white/10 bg-zinc-900/60 p-7 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)]"
            >
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${accent} ${iconColor} transition-transform group-hover:scale-110`}>
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">
                {title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════ 4. HOW IT WORKS SECTION ═══════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 border-t border-white/5 bg-zinc-900/20 py-16 lg:py-20 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Step-By-Step Defense
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
              Simple Integration, Dynamic Protection
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Secure checking works in seconds to evaluate digital materials for danger points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
            {HOW_IT_WORKS_STEPS.map(({ title, description, icon: Icon, tag }) => (
              <div
                key={title}
                className="relative rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-cyan-500/30"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-400">
                    <ShieldCheck size={13} />
                    <span>{tag}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 5. LATEST ARTICLES & THREAT INTELLIGENCE ═══════════════════════════════ */}
      <section id="threat-intelligence" data-section="articles" className="relative z-10 border-t border-white/10 bg-[#080d12] py-16 lg:py-24 px-6 sm:px-12 scroll-mt-14">
        <div id="articles" className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
                <Radio size={13} className="text-cyan-400 animate-pulse" />
                Live Cyber Threat Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Latest Articles & Verified Advisories
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm text-zinc-400 leading-relaxed">
                Stay informed with genuine, up-to-date threat reports and actionable defense tactics verified by CERT-In, I4C (MHA), NPCI, and RBI.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Updated: <strong className="text-zinc-200">{lastRefreshed}</strong></span>
              </div>
              <button
                type="button"
                onClick={fetchNews}
                disabled={newsLoading}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition disabled:opacity-50"
                title="Refresh latest cyber threat news"
              >
                <RefreshCw size={13} className={newsLoading ? 'animate-spin' : ''} />
                <span>Refresh Feed</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search articles by keyword (e.g. Digital Arrest, APK, UPI, eSIM, Phishing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-500/50 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
              {['All', 'Official Advisory', 'Payment Security', 'Malware Alert', 'Financial Fraud', 'Mobile Threat'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewsCategory(cat)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition ${
                    newsCategory === cat
                      ? 'bg-cyan-500 text-zinc-950 font-bold shadow-sm'
                      : 'border border-white/5 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {newsLoading && articles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl border border-white/5 bg-zinc-900/40 animate-pulse p-6" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter((art) => (newsCategory === 'All' ? true : art.category === newsCategory))
                .filter((art) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    art.title.toLowerCase().includes(q) ||
                    art.summary.toLowerCase().includes(q) ||
                    art.tags.some((t) => t.toLowerCase().includes(q))
                  );
                })
                .map((art) => {
                  const isCritical = art.severity === 'CRITICAL';
                  const isHigh = art.severity === 'HIGH';

                  return (
                    <article
                      key={art.id}
                      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:bg-zinc-900/90 hover:shadow-xl hover:shadow-cyan-950/20"
                    >
                      <div>
                        {/* Top meta */}
                        <div className="flex items-center justify-between gap-2 mb-3 text-[11px]">
                          <span
                            className={`rounded-md px-2 py-0.5 font-bold uppercase tracking-wider ${
                              isCritical
                                ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                                : isHigh
                                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                                : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                            }`}
                          >
                            {art.severity}
                          </span>
                          <span className="text-zinc-500 font-mono">{art.readTime}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-zinc-100 group-hover:text-cyan-300 transition leading-snug line-clamp-2">
                          {art.title}
                        </h3>

                        {/* Source badge */}
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-cyan-400/90 font-medium">
                          <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
                          <span className="truncate">{art.source}</span>
                        </div>

                        {/* Summary */}
                        <p className="mt-3 text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {art.summary}
                        </p>

                        {/* Key takeaway highlight box */}
                        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] leading-relaxed text-amber-300/90">
                          {art.keyTakeaway}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {art.tags.slice(0, 2).map((t) => (
                            <span key={t} className="rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400">
                              #{t}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedArticle(art)}
                          className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                        >
                          <span>Read Full</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </article>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════ 6. ABOUT SECTION (VISION) ═══════════════════════════════ */}
      <section id="about" className="relative z-10 mx-auto max-w-5xl px-6 sm:px-12 py-16 lg:py-20 text-center">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/30 via-zinc-900/60 to-zinc-900/80 p-8 sm:p-12 backdrop-blur-md shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-400">
            <Shield size={28} aria-hidden="true" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            Our Vision
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
            Empowering Everyone with Threat Intelligence
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed">
            CyberRaksha is built with the vision of making cybersecurity simple, accessible, and understandable for everyone. Our intelligent security platform helps users identify potential digital threats and make safer decisions online.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <span>
              National Cyber Helpline:{' '}
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
                title="National Cybercrime Reporting Portal (1930)"
              >
                1930
              </a>
            </span>
            <span>•</span>
            <span>Official Portal: <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-200 hover:text-white underline underline-offset-2 transition">cybercrime.gov.in</a></span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 7. TRUST / IMPACT SECTION ═══════════════════════════════ */}
      <section className="relative z-10 border-t border-white/5 bg-zinc-900/30 py-14 px-6 sm:px-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_METRICS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-start rounded-2xl border border-white/5 bg-zinc-900/40 p-5 text-left transition hover:border-cyan-500/30 hover:bg-zinc-900/70"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 8. STANDARDIZED ABOUT & HELPLINES FOOTER ═══════════════════════════════ */}
      <footer id="about" className="relative z-10 border-t border-white/10 bg-[#06090d] px-6 sm:px-12 pt-16 pb-12 text-zinc-400">
        <div className="mx-auto max-w-7xl">
          {/* Main Footer Grid: Left (About & Social) + Right (Official Helplines & Portals) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b border-white/10 items-start">
            {/* Left Column: About CyberRaksha & Social Media Handles */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-400">
                  <Shield size={18} aria-hidden="true" />
                </div>
                <span className="text-lg font-bold text-zinc-100">
                  Cyber<span className="text-cyan-400">Raksha</span>
                </span>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                  AI Defense
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  About CyberRaksha
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  CyberRaksha is an AI-powered public cybersecurity assistant engineered to empower citizens, small businesses, and institutions against digital deception. Designed around IBM Granite models and deterministic safety policies to detect quishing, fake UPI requests, malicious URLs, and scam messages in real time.
                </p>
              </div>

              {/* Social Media Handles */}
              <div className="pt-1 space-y-3">
                <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Official Channels &amp; Threat Feeds
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {SOCIAL_CHANNELS.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.ariaLabel}
                      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-cyan-500/50 hover:bg-zinc-800 hover:text-white hover:shadow-[0_0_12px_rgba(6,182,212,0.12)]"
                    >
                      <span className="text-zinc-400 transition-colors group-hover:text-cyan-400">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Official Helplines & Portals (Shifted Right with generous spacing) */}
            <div className="lg:col-span-5 space-y-4 lg:pl-8 w-full">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Official Helplines &amp; Portals
                </div>
                <span className="text-[11px] text-cyan-400 font-mono font-medium">Govt. of India</span>
              </div>

              {/* 1930 National Cyber Helpline Featured Card */}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 transition-all hover:border-cyan-500/60 hover:bg-cyan-500/15 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 transition group-hover:bg-cyan-500/30">
                    <PhoneCall size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white transition group-hover:text-cyan-300">
                      National Cyber Helpline
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Toll-Free 24x7 Citizen Support
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-extrabold text-cyan-400">1930</div>
                  <div className="text-[10px] text-cyan-300/80 font-medium">Dial Immediately</div>
                </div>
              </a>

              {/* Portals List */}
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-3.5 py-2.5 text-zinc-300 transition hover:border-white/15 hover:bg-zinc-900 hover:text-white"
                  >
                    <span>National Cyber Crime Reporting Portal</span>
                    <ExternalLink size={13} className="text-zinc-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.cert-in.org.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-3.5 py-2.5 text-zinc-300 transition hover:border-white/15 hover:bg-zinc-900 hover:text-white"
                  >
                    <span>CERT-In National Incident Response</span>
                    <ExternalLink size={13} className="text-zinc-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://sachet.rbi.org.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-3.5 py-2.5 text-zinc-300 transition hover:border-white/15 hover:bg-zinc-900 hover:text-white"
                  >
                    <span>RBI Sachet Financial Fraud Registry</span>
                    <ExternalLink size={13} className="text-zinc-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://sancharsaathi.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-3.5 py-2.5 text-zinc-300 transition hover:border-white/15 hover:bg-zinc-900 hover:text-white"
                  >
                    <span>DoT Sanchar Saathi (Lost/Stolen Phones)</span>
                    <ExternalLink size={13} className="text-zinc-500" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Standardized Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>
              &copy; 2026 CyberRaksha. Built for Digital India Cyber Safety.
            </p>

            <div className="flex flex-wrap items-center gap-4 font-medium text-xs">
              <a href="#about" className="hover:text-cyan-400 transition">About Us</a>
              <span className="text-zinc-700">•</span>
              <a href="#articles" className="hover:text-cyan-400 transition">Threat Intelligence</a>
              <span className="text-zinc-700">•</span>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">Emergency 1930</a>
              <span className="text-zinc-700">•</span>
              <span className="text-zinc-600">Privacy First &amp; Zero Retention</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════ ARTICLE READER MODAL ═══════════════════════════════ */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8 text-left shadow-2xl custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Close article modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-md bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-400">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-zinc-500 font-mono">• {selectedArticle.date}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="mt-3 flex items-center gap-2 text-xs text-cyan-400 font-medium">
              <ShieldCheck size={16} />
              <span>Verified Source: {selectedArticle.source}</span>
            </div>

            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-300 font-medium leading-relaxed">
              ⚠️ {selectedArticle.keyTakeaway}
            </div>

            <div className="mt-6 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-zinc-400">
                Report incidents: <strong className="text-cyan-400 font-mono">1930</strong> or <strong className="text-white">cybercrime.gov.in</strong>
              </div>

              {selectedArticle.sourceUrl && (
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
                >
                  <span>Visit Official Source</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
