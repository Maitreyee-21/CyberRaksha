'use client';

import * as React from 'react';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { LandingPage } from '@/components/home/LandingPage';
import { ScanApp } from '@/components/scan/ScanApp';

type View = 'login' | 'home' | 'scan';
type Identity = { name: string; guest: boolean };

const SESSION_KEY = 'cyberraksha_session';

export default function RootPage() {
  // Start with a stable view for the server-rendered/initial client pass,
  // then hydrate from localStorage once mounted (avoids SSR/client mismatch).
  const [view, setView] = React.useState<View>('login');
  const [identity, setIdentity] = React.useState<Identity | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved: Identity = JSON.parse(raw);
        setIdentity(saved);
        setView('home');
      }
    } catch {
      // ignore corrupt/blocked storage — falls back to login
    }
    setHydrated(true);
  }, []);

  const handleAuthenticated = (newIdentity: Identity) => {
    setIdentity(newIdentity);
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(newIdentity));
    } catch {
      // best-effort demo persistence only
    }
    setView('home');
  };

  if (!hydrated) {
    return <div className="min-h-screen w-full bg-zinc-950" />;
  }

  if (view === 'login') {
    return <LoginScreen onAuthenticated={handleAuthenticated} />;
  }

  if (view === 'home') {
    return (
      <LandingPage
        userName={identity?.name}
        onStartScanning={() => setView('scan')}
      />
    );
  }

  return <ScanApp onGoHome={() => setView('home')} />;
}
