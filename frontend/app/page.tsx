'use client';

import * as React from 'react';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { LandingPage } from '@/components/home/LandingPage';
import { ScanApp } from '@/components/scan/ScanApp';

type View = 'home' | 'login' | 'scan';
type Identity = { name: string; guest: boolean };

export default function RootPage() {
  const [view, setView] = React.useState<View>('home');
  const [identity, setIdentity] = React.useState<Identity | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  // Check backend authentication status on initial load
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setIdentity({ name: data.user.fullName || data.user.username, guest: false });
            setView('scan');
          } else {
            setIdentity(null);
          }
        } else {
          setIdentity(null);
        }
      } catch {
        setIdentity(null);
      } finally {
        setHydrated(true);
      }
    }

    checkAuth();
  }, []);

  /** Called by LoginScreen after successful credential check. */
  const handleAuthenticated = (newIdentity: Identity) => {
    setIdentity(newIdentity);
    setView('scan');
  };

  /** Called by ScanApp logout button. */
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // best-effort logout
    }
    setIdentity(null);
    setView('home');
  };

  if (!hydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <span className="text-xs font-medium text-zinc-400">Loading CyberRaksha...</span>
        </div>
      </div>
    );
  }

  if (view === 'home') {
    return (
      <LandingPage
        onGoToLogin={() => setView('login')}
        onRegistered={() => setView('login')}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginScreen
        onAuthenticated={handleAuthenticated}
        onGoToHome={() => setView('home')}
      />
    );
  }

  // view === 'scan' — protected; identity checked
  if (!identity) {
    // If not authenticated, redirect to login
    return (
      <LoginScreen
        onAuthenticated={handleAuthenticated}
        onGoToHome={() => setView('home')}
      />
    );
  }

  return <ScanApp onLogout={handleLogout} userName={identity.name} />;
}
