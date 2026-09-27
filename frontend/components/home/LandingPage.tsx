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
  Heart,
  HelpCircle,
  Users,
  Check,
  ChevronDown,
  ShieldAlert,
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
    title: 'Safe Link Verifier',
    description: 'Received a strange link on WhatsApp, SMS, or Telegram? Check if it is legitimate before tapping.',
    accent: 'from-cyan-500/20 to-teal-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: QrCode,
    title: 'QR Code Scam Shield',
    description: 'Verify payment QR codes safely. Remember: scanning a QR code only SENDS money, never receives it.',
    accent: 'from-teal-500/20 to-emerald-500/10',
    iconColor: 'text-teal-400',
  },
  {
    icon: MessageSquare,
    title: 'Scam Message Analyzer',
    description: 'Spot fake electricity bills, lottery rewards, bank account blocks, and deceptive job lures in seconds.',
    accent: 'from-purple-500/20 to-pink-500/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: AlertTriangle,
    title: 'Plain-English Safety Score',
    description: 'No intimidating technical jargon. You get an honest 0 to 100 risk score with clear reasons in everyday language.',
    accent: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: ShieldCheck,
    title: 'Calm Step-by-Step Advice',
    description: 'If something looks suspicious, we guide you through exact steps to protect your money, identity, and family.',
    accent: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Heart,
    title: 'Built for Families & Seniors',
    description: 'Designed to protect parents, grandparents, students, and everyday citizens with zero technical complexity.',
    accent: 'from-rose-500/20 to-pink-500/10',
    iconColor: 'text-rose-400',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: '1. Share What Looks Suspicious',
    description: 'Paste a link, upload a screenshot, or type in that strange text message you received.',
    icon: UploadCloud,
    tag: 'Private & Simple',
  },
  {
    title: '2. We Review It Instantly',
    description: 'CyberRaksha checks hidden red flags, fake bank websites, and manipulative psychological traps.',
    icon: Search,
    tag: 'Fast AI Verification',
  },
  {
    title: '3. Get Calm, Actionable Advice',
    description: 'Know right away whether it is safe or risky, with clear guidance on what to do next.',
    icon: ShieldCheck,
    tag: 'Peace of Mind',
  },
];

const COMMON_SCAMS = [
  {
    category: 'Electricity Bill Disconnection',
    sample: '"Dear Consumer, your power will be cut tonight at 9:30 PM due to an unpaid bill. Call officer Rajesh at 98765-XXXXX immediately to update..."',
    tactic: 'Creates false panic and urgency to trick you into downloading a remote-control screen app or making an unauthorized transfer.',
    protectionTip: 'Electricity providers never send disconnection threats from personal WhatsApp or mobile numbers.',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  },
  {
    category: 'Fake Bank KYC / PAN Block',
    sample: '"Dear Customer, your bank account is suspended due to pending KYC. Click http://sbi-kyc-update.xyz to verify your PAN card within 24 hours."',
    tactic: 'Impersonates your bank with a lookalike website to capture your login credentials, MPIN, and secret SMS OTPs.',
    protectionTip: 'Banks will NEVER ask you to update KYC credentials via links sent over SMS.',
    badgeColor: 'border-red-500/30 bg-red-500/10 text-red-400',
  },
  {
    category: 'Part-Time Job / Telegram Lure',
    sample: '"Earn ₹3,000 to ₹8,000 daily from home! Just like YouTube videos or give 5-star Google ratings. Join our VIP Telegram channel to claim ₹250 bonus..."',
    tactic: 'Gives small initial payouts to build trust, then coerces you into depositing your own savings into fake crypto wallets.',
    protectionTip: 'Legitimate employers never ask candidates to deposit money to receive their salary.',
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  },
  {
    category: 'QR Code Cashback Trap',
    sample: '"Congratulations! You won ₹1,500 cashback on your recent shopping. Scan this QR code to receive the money directly into your bank account."',
    tactic: 'Scammers send a payment request disguised as a reward QR code that debits money from YOUR account.',
    protectionTip: 'Golden Rule: You NEVER need to scan a QR code or enter your UPI PIN to RECEIVE money.',
    badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  },
];

const REAL_STORIES = [
  {
    name: 'Priya N.',
    location: 'Pune',
    scenario: 'Fake Pension KYC SMS',
    quote: 'My 68-year-old father received a message saying his pension was stopped due to pending KYC. We checked the link on CyberRaksha and it immediately flagged the website as a fake bank clone. Saved his life savings.',
    avatarColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    name: 'Rohan S.',
    location: 'Jaipur',
    scenario: 'OLX Buyer QR Code',
    quote: 'A buyer on OLX sent me a QR code claiming it would transfer ₹15,000 to my account. CyberRaksha clearly explained that scanning a QR code only sends money. That single tip saved me from a major loss.',
    avatarColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    name: 'Sunita V.',
    location: 'Delhi',
    scenario: 'WhatsApp Lottery Lure',
    quote: 'Our family WhatsApp group was flooded with a fake lottery link with our photo. CyberRaksha gave us a plain, reassuring explanation we could forward to all relatives so nobody clicked.',
    avatarColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
];

const HUMAN_FAQS = [
  {
    q: 'How does CyberRaksha know if a message or link is dangerous?',
    a: 'CyberRaksha analyzes subtle red flags: deceptive domain spellings (like "sbi-kyc.xyz"), false urgency phrases ("arrest warrant", "power cut tonight"), coercive requests for OTPs, and verified threat databases. We explain these indicators in simple, human words.',
  },
  {
    q: 'Is my personal data or message saved on your servers?',
    a: 'Never. Your trust is our foundation. Scans are processed ephemerally in volatile memory. We do not sell, store, or profile your personal conversations or links.',
  },
  {
    q: 'What should I do if I already clicked a suspicious link or sent money?',
    a: 'Do not panic. Immediately disconnect your internet or turn on Airplane Mode, call your bank customer care to freeze your net banking and cards, and dial the National Cyber Crime Helpline at 1930 (Toll-Free, 24x7).',
  },
  {
    q: 'Can my parents or grandparents use this without tech knowledge?',
    a: 'Yes, absolutely. CyberRaksha was designed specifically with families and non-technical citizens in mind. Simply paste a message or upload an image and get a clear, calm explanation in plain language.',
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

const TRUST_METRICS = [
  {
    icon: ShieldCheck,
    title: 'Zero Data Retention',
    description: 'Your submitted URLs, messages, and QR codes are analyzed in volatile memory and never retained or sold.',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description: 'All network transmissions utilize modern TLS encryption to keep your scans private and tamper-proof.',
  },
  {
    icon: Heart,
    title: '100% Free Public Resource',
    description: 'Built as a compassionate defense tool for families, students, and seniors across India.',
  },
  {
    icon: PhoneCall,
    title: 'Helpline 1930 Integration',
    description: 'Directly aligned with National Cyber Crime Reporting Portal protocols for rapid emergency assistance.',
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
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [selectedScamTab, setSelectedScamTab] = React.useState<number>(0);

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

      {/* ═══════════════════════════════ 2. UPPER-CENTERED HERO SECTION (HUMANIZED) ═══════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-12 lg:pb-14 text-center">
        <div className="flex flex-col items-center mx-auto space-y-5">

          {/* Reassuring Care Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-300 shadow-sm">
            <Heart size={13} className="text-teal-400 fill-teal-400/30" />
            <span>Caring Digital Protection for You &amp; Your Loved Ones</span>
            <span className="text-zinc-500 font-mono">|</span>
            <span className="text-zinc-300 font-normal text-[11px]">100% Free &amp; Confidential</span>
          </div>

          {/* Main Heading (Warm, Empowering, Human) */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem] font-extrabold tracking-tight text-zinc-50 leading-[1.12] max-w-3xl">
            Never Feel Unsure About a Link or Message{' '}
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
              Ever Again.
            </span>
          </h1>

          {/* Supporting Copy (Empathetic, Clear, Non-Jargon) */}
          <p className="text-base sm:text-lg text-zinc-300/90 leading-relaxed max-w-2xl mx-auto pt-1">
            Received an unexpected WhatsApp message, an urgent bank alert, or a payment QR code? We help you check what is safe and what is a scam in plain words — so you can protect your hard-earned money and peace of mind.
          </p>

          {/* Supporting Human Signals (Centered 4-column Grid) */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl w-full text-left">
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-3.5 backdrop-blur-sm shadow-sm transition hover:border-cyan-500/30 hover:bg-zinc-900/90">
              <MessageSquare size={18} className="text-cyan-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">WhatsApp &amp; SMS</div>
                <div className="text-[10px] text-zinc-400 truncate">Detect fake alerts &amp; threats</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-3.5 backdrop-blur-sm shadow-sm transition hover:border-teal-500/30 hover:bg-zinc-900/90">
              <QrCode size={18} className="text-teal-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">UPI &amp; QR Shield</div>
                <div className="text-[10px] text-zinc-400 truncate">Never lose money receiving</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-3.5 backdrop-blur-sm shadow-sm transition hover:border-blue-500/30 hover:bg-zinc-900/90">
              <ShieldCheck size={18} className="text-blue-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">Plain Explanations</div>
                <div className="text-[10px] text-zinc-400 truncate">Zero tech jargon, pure clarity</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-3.5 backdrop-blur-sm shadow-sm transition hover:border-purple-500/30 hover:bg-zinc-900/90">
              <Lock size={18} className="text-purple-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">100% Private</div>
                <div className="text-[10px] text-zinc-400 truncate">Never stored or tracked</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════ 2.1 COMMON SCAMS WE PROTECT YOU FROM ═══════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 py-10 text-center">
        <div className="mx-auto max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <ShieldAlert size={13} />
            <span>Real Scams Hitting Citizens Everyday</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Scams Prey on Fear, Urgency &amp; Trust. Here is How to Spot Them:
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            These are actual messages and payment tricks received by Indian families every single day. See the tactic and the golden rule to stay safe:
          </p>
        </div>

        {/* 4 Everyday Scam Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {COMMON_SCAMS.map((item, idx) => (
            <div
              key={item.category}
              className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:bg-zinc-900/90 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">Scenario #{idx + 1}</span>
                </div>

                {/* Simulated Scam Message Box */}
                <div className="rounded-2xl border border-white/5 bg-zinc-950/80 p-3.5 mb-4 text-xs font-mono text-zinc-300 leading-relaxed italic border-l-2 border-l-amber-500/80">
                  {item.sample}
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                    The Scammer&apos;s Trap:
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {item.tactic}
                  </p>
                </div>
              </div>

              {/* Protection Tip */}
              <div className="mt-2 pt-3 border-t border-white/5 flex items-start gap-2.5 text-xs text-emerald-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400">Golden Rule:</strong> {item.protectionTip}
                </div>
              </div>
            </div>
          ))}
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

      {/* ═══════════════════════════════ 3. FEATURES SECTION (HUMANIZED) ═══════════════════════════════ */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 py-16 lg:py-20 text-center">
        <div className="mx-auto max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300">
            Care &amp; Protection
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
            Thoughtful Features Designed to Keep You Safe
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Whether it is an unexpected WhatsApp forward, a suspicious bank link, or a payment QR code — we check it quietly and explain the risks in plain everyday language.
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

      {/* ═══════════════════════════════ 4. HOW IT WORKS SECTION (HUMANIZED) ═══════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 border-t border-white/5 bg-zinc-900/20 py-16 lg:py-20 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Simple 3-Step Check
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
              No Complicated Settings. Just Plain Clarity.
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              You don&apos;t need to be a cybersecurity specialist to protect your savings and family. Here is how simple it is:
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

      {/* ═══════════════════════════════ 4.1 CITIZEN STORIES & REAL EXPERIENCES ═══════════════════════════════ */}
      <section className="relative z-10 border-t border-white/5 bg-zinc-950 py-16 lg:py-20 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-rose-300">
              <Users size={13} />
              <span>Real Experiences</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
              Everyday People Protected When It Counted
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Hear how a quick 10-second check prevented real financial losses and distress for families across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {REAL_STORIES.map((story) => (
              <div
                key={story.name}
                className="flex flex-col justify-between rounded-3xl border border-white/10 bg-zinc-900/60 p-7 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:bg-zinc-900/90 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm border ${story.avatarColor}`}>
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-100">{story.name}</div>
                        <div className="text-xs text-zinc-400">{story.location}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      {story.scenario}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 size={15} />
                  <span>Fraud prevented successfully</span>
                </div>
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
                Latest Articles &amp; Verified Advisories
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

      {/* ═══════════════════════════════ 6. ABOUT SECTION (EMPATHETIC VISION & HELPLINE) ═══════════════════════════════ */}
      <section id="about" className="relative z-10 mx-auto max-w-5xl px-6 sm:px-12 py-16 lg:py-20 text-center">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/30 via-zinc-900/60 to-zinc-900/80 p-8 sm:p-12 backdrop-blur-md shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-400">
            <Heart size={28} className="text-rose-400 fill-rose-400/20" aria-hidden="true" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 mb-3">
            Our Mission &amp; Purpose
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
            Protecting What Matters Most: Your Hard-Earned Peace of Mind
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed">
            CyberRaksha was founded on a simple belief: cybersecurity should never be an elite privilege full of confusing technical jargon. Every parent, student, small business owner, and senior citizen deserves to browse, pay, and communicate online with calm confidence.
          </p>

          {/* Golden Emergency Callout */}
          <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 max-w-2xl mx-auto text-left flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <PhoneCall size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Fell for a scam or feeling anxious? Take a deep breath.
              </h4>
              <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                You are not alone, and help is available right now. Dial <strong className="text-amber-300 font-mono text-sm">1930</strong> (National Cybercrime Reporting Helpline) immediately to help freeze fraudulent bank transactions.
              </p>
              <div className="mt-2 text-xs">
                <a
                  href="https://cybercrime.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
                >
                  File a confidential complaint on cybercrime.gov.in &rarr;
                </a>
              </div>
            </div>
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

      {/* ═══════════════════════════════ 7.1 CITIZEN FAQs & PEACE OF MIND ═══════════════════════════════ */}
      <section className="relative z-10 border-t border-white/5 bg-zinc-900/30 py-16 lg:py-20 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <HelpCircle size={13} />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
              Clear Answers for Your Peace of Mind
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              We know digital scams can feel confusing and overwhelming. Here is what you need to know:
            </p>
          </div>

          <div className="space-y-4 text-left">
            {HUMAN_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-zinc-900/70 overflow-hidden transition-all duration-200 hover:border-cyan-500/30"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-zinc-100 hover:text-cyan-300 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-zinc-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 bg-zinc-950/40 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
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
