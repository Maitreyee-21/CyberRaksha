'use client';

import * as React from 'react';
import {
  Shield, ScanSearch, MessageSquareWarning, BellRing, ShieldCheck,
  Compass, ArrowRight, MessageSquare, Image as ImageIcon, Link2, QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingPageProps {
  userName?: string;
  onStartScanning: () => void;
}

const FLOW_STEPS = [
  { label: 'Detect', icon: ScanSearch, blurb: 'AI scans the message, image, link or QR code for scam signals.' },
  { label: 'Explain', icon: MessageSquareWarning, blurb: 'Red flags and manipulation tactics are broken down in plain language.' },
  { label: 'Alert', icon: BellRing, blurb: 'A clear risk score and level flag how dangerous the content is.' },
  { label: 'Prevent', icon: ShieldCheck, blurb: 'Known scam patterns are matched to stop repeat attacks early.' },
  { label: 'Guide', icon: Compass, blurb: 'Localized next steps, plus helpline and reporting info, if needed.' },
];

const INPUT_TYPES = [
  { icon: MessageSquare, label: 'SMS & WhatsApp' },
  { icon: ImageIcon, label: 'Screenshots' },
  { icon: Link2, label: 'URLs' },
  { icon: QrCode, label: 'QR Codes' },
];

export function LandingPage({ userName, onStartScanning }: LandingPageProps) {
  return (
    <div className="h-screen w-full overflow-y-auto custom-scrollbar bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-500/15 text-teal-400">
          <Shield size={26} />
        </div>

        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-teal-400">
          {userName ? `Welcome, ${userName}` : 'Welcome'}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          CyberRaksha
        </h1>

        {/* Overview */}
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          CyberRaksha is your AI scam-detection assistant. Paste a suspicious SMS or WhatsApp
          message, upload a screenshot, or share a URL or QR code, and it instantly flags scam
          tactics and tells you what to do next — powered by IBM Granite models on watsonx.ai.
        </p>

        {/* Supported input types */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {INPUT_TYPES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300"
            >
              <Icon size={13} className="text-teal-400" />
              {label}
            </span>
          ))}
        </div>

        {/* Start Scanning CTA */}
        <Button
          onClick={onStartScanning}
          size="lg"
          className="mt-9 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-medium gap-2 shadow-lg shadow-teal-500/20"
        >
          Start Scanning
          <ArrowRight size={16} />
        </Button>

        {/* Core flow */}
        <div className="mt-14 w-full">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            How it works
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {FLOW_STEPS.map(({ label, icon: Icon, blurb }) => (
              <Card
                key={label}
                className="flex flex-col items-center gap-2 rounded-2xl border-white/10 bg-card/60 p-4 text-center"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
                  <Icon size={16} />
                </div>
                <span className="text-sm font-medium text-zinc-100">{label}</span>
                <span className="text-[11px] leading-snug text-zinc-500">{blurb}</span>
              </Card>
            ))}
          </div>
        </div>

        <p className="mt-10 font-mono text-[11px] text-zinc-500">
          National Cyber Helpline: <b className="text-zinc-300">1930</b> · cybercrime.gov.in
        </p>
      </div>
    </div>
  );
}
