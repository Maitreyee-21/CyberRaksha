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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface LandingPageProps {
  onGoToLogin: () => void;
  onRegistered: () => void;
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
    step: '01',
    title: 'Upload or Paste',
    description: 'Paste a URL, upload a QR code, image, or suspicious content.',
    icon: UploadCloud,
  },
  {
    step: '02',
    title: 'AI Security Analysis',
    description: 'CyberRaksha intelligently analyzes multiple threat indicators.',
    icon: Search,
  },
  {
    step: '03',
    title: 'Get Protection Insights',
    description: 'Receive a risk score, threat explanation, and safety recommendations.',
    icon: ShieldCheck,
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
      onRegistered();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, onRegistered]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    else if (fullName.trim().length < 2) errs.fullName = 'Enter at least 2 characters.';

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address.';
    }

    if (!username.trim()) {
      errs.username = 'Username is required.';
    } else if (username.trim().length < 3 || username.trim().length > 20) {
      errs.username = 'Username must be 3–20 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      errs.username = 'Only letters, numbers, and underscores are allowed.';
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

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          username: username.trim().toLowerCase(),
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
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors">
            Home
          </button>
          <button onClick={() => scrollToSection('features')} className="hover:text-cyan-400 transition-colors">
            Features
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-cyan-400 transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors">
            About
          </button>
        </div>

        {/* Top-Right Action Buttons: Register | Login */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setSuccess(false);
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
                    onRegistered();
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
            {HOW_IT_WORKS_STEPS.map(({ step, title, description, icon: Icon }) => (
              <div
                key={step}
                className="relative rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-cyan-500/30"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <span className="font-mono text-3xl font-extrabold text-white/20">
                    {step}
                  </span>
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

      {/* ═══════════════════════════════ 5. ABOUT SECTION ═══════════════════════════════ */}
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

      {/* ═══════════════════════════════ 6. TRUST / IMPACT SECTION ═══════════════════════════════ */}
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

      {/* ═══════════════════════════════ 7. FOOTER ═══════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/10 bg-zinc-950 px-6 sm:px-12 py-10 text-zinc-400">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-400">
              <Shield size={15} aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-zinc-100">
              Cyber<span className="text-cyan-400">Raksha</span>
            </span>
            <span className="text-xs text-zinc-500 hidden sm:inline">| Intelligent Cyber Safety Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition">
              Home
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-cyan-400 transition">
              Features
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition">
              About
            </button>
            <a href="#" className="hover:text-cyan-400 transition">
              Privacy
            </a>
          </div>

          <p className="text-xs text-zinc-500">
            &copy; 2026 CyberRaksha. Building a Safer Digital World.
          </p>
        </div>
      </footer>
    </div>
  );
}
