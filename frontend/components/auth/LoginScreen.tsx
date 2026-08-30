'use client';

import * as React from 'react';
import { Shield, Mail, Lock, ArrowRight, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginScreenProps {
  onAuthenticated: (identity: { name: string; guest: boolean }) => void;
}

/**
 * Minimal placeholder auth screen. There is no real backend for this yet —
 * both paths just confirm an identity locally and hand off to the app.
 * Swap the onAuthenticated handlers for real API calls when auth ships.
 */
export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter an email and password to continue.');
      return;
    }
    setError(null);
    onAuthenticated({ name: email.trim().split('@')[0], guest: false });
  };

  const handleGuest = () => {
    onAuthenticated({ name: 'Guest', guest: true });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-y-auto custom-scrollbar bg-zinc-950 px-4">
      {/* Ambient backdrop, matches the app's dark/teal identity */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-500/15 text-teal-400">
            <Shield size={22} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">CyberRaksha</h1>
          <p className="mt-1 text-xs text-zinc-400">Sign in to your scam intelligence assistant</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-zinc-900 border-zinc-700/80 text-zinc-100 placeholder:text-zinc-500"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-zinc-900 border-zinc-700/80 text-zinc-100 placeholder:text-zinc-500"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-950 font-medium gap-2 mt-1"
            >
              Sign in
              <ArrowRight size={15} />
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">or</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <Button
            type="button"
            onClick={handleGuest}
            variant="outline"
            className="w-full border-zinc-700/80 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 gap-2"
          >
            <UserRound size={15} />
            Continue as Guest
          </Button>
        </div>

        <p className="mt-5 text-center text-[11px] text-zinc-500">
          Demo login — no account is created and nothing is verified.
        </p>
      </div>
    </div>
  );
}
