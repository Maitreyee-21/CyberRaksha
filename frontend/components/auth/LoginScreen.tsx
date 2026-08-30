'use client';

import * as React from 'react';
import { Shield, Lock, ArrowRight, AtSign, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginScreenProps {
  onAuthenticated: (identity: { name: string; guest: boolean }) => void;
  onGoToHome?: () => void;
}

export function LoginScreen({ onAuthenticated, onGoToHome }: LoginScreenProps) {
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid username/email or password.');
        return;
      }

      onAuthenticated({
        name: data.user?.fullName || identifier.trim(),
        guest: false,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to authentication service.');
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

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-md pt-12">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Welcome Back to CyberRaksha
          </h1>
          <p className="mt-1.5 text-xs text-zinc-400">
            Secure access to your intelligent digital protection system.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-7 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email or Username */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-medium text-zinc-300" htmlFor="login-identifier">
                Email or Username
              </label>
              <div className="relative">
                <AtSign size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="login-identifier"
                  type="text"
                  placeholder="you@example.com or username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError(null);
                  }}
                  className="pl-10 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-medium text-zinc-300" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className="pl-10 pr-10 bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500"
                  autoComplete="current-password"
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
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 text-left animate-in fade-in duration-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              {loading ? 'Verifying...' : 'Login to CyberRaksha'}
              {!loading && <ArrowRight size={15} />}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          New to CyberRaksha?{' '}
          {onGoToHome ? (
            <button
              onClick={onGoToHome}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 transition"
            >
              Create an account
            </button>
          ) : (
            <a
              href="/"
              className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 transition"
            >
              Create an account
            </a>
          )}
        </p>
      </div>
    </div>
  );
}
