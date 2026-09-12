'use client';

import * as React from 'react';
import { Shield, Lock, ArrowRight, AtSign, Eye, EyeOff, ArrowLeft, User, Mail, CheckCircle2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RegisterScreenProps {
  onGoToLogin: () => void;
  onGoToHome?: () => void;
  onRegistered?: (creds?: { identifier: string; password?: string }) => void;
}

export function RegisterScreen({ onGoToLogin, onGoToHome, onRegistered }: RegisterScreenProps) {
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
      if (onRegistered) {
        onRegistered({
          identifier: email.trim().toLowerCase() || username.trim().toLowerCase(),
          password,
        });
      } else {
        onGoToLogin();
      }
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [success, countdown, onRegistered, onGoToLogin, email, username, password]);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100 overflow-y-auto selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Top Navigation Bar with clearly visible Home Button */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/10 bg-zinc-950/80 px-6 sm:px-12 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onGoToHome ? (
            <button
              onClick={onGoToHome}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-cyan-400 transition shadow-sm"
              title="Return to Homepage"
            >
              <ArrowLeft size={14} />
              <span>Home</span>
            </button>
          ) : (
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-cyan-400 transition shadow-sm"
            >
              <ArrowLeft size={14} />
              <span>Home</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-400">
            <Shield size={15} />
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-100">
            Cyber<span className="text-cyan-400">Raksha</span>
          </span>
        </div>
      </header>

      {/* Register Card Container */}
      <div className="relative z-10 w-full max-w-md pt-12">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <UserPlus size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Create Your Account
          </h1>
          <p className="mt-1.5 text-xs text-zinc-400">
            Join CyberRaksha and take control of your digital security.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-7 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {generalError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 text-left">
              {generalError}
            </div>
          )}

          {success ? (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={44} className="mx-auto mb-3 text-cyan-400" />
              <h3 className="text-base font-bold text-zinc-100">Registration Successful!</h3>
              <p className="mt-2 text-xs text-zinc-300">
                Welcome, <span className="font-semibold text-cyan-400">{fullName}</span>. Your account is secured.
              </p>
              <p className="mt-3 text-xs text-zinc-400">
                Redirecting to login in <span className="font-mono font-bold text-cyan-400">{countdown}s</span>...
              </p>
              <Button
                onClick={() => {
                  if (onRegistered) {
                    onRegistered({
                      identifier: email.trim().toLowerCase() || username.trim().toLowerCase(),
                      password,
                    });
                  } else {
                    onGoToLogin();
                  }
                }}
                size="sm"
                className="mt-5 w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Proceed to Login <ArrowRight size={14} />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left" noValidate>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300" htmlFor="reg-fullname">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="reg-fullname"
                    type="text"
                    placeholder="Aarav Sharma"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    className="pl-10 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                    autoComplete="name"
                  />
                </div>
                {errors.fullName && <p className="text-[11px] text-red-400">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300" htmlFor="reg-email">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="aarav@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    className="pl-10 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300" htmlFor="reg-username">
                  Username <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <AtSign size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="aarav_sharma"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors((prev) => ({ ...prev, username: '' }));
                    }}
                    className="pl-10 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                    autoComplete="username"
                  />
                </div>
                {errors.username && <p className="text-[11px] text-red-400">{errors.username}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300" htmlFor="reg-password">
                  Password <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    className="pl-10 pr-10 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300" htmlFor="reg-confirmpassword">
                  Confirm Password <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="reg-confirmpassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    className="pl-10 pr-10 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-400">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
              >
                {loading ? 'Creating Account...' : 'Register Account'}
                {!loading && <ArrowRight size={15} />}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <button
            onClick={onGoToLogin}
            className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 transition"
          >
            Login to CyberRaksha
          </button>
        </p>
      </div>
    </div>
  );
}
