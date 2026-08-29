'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Phone, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import type { MultilingualGuidance } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function GuidancePanel({ 
  guidance, 
  safetyLock, 
  summary 
}: { 
  guidance: MultilingualGuidance; 
  safetyLock: boolean; 
  summary: string 
}) {
  const [locale, setLocale] = React.useState<'en' | 'hi' | 'mr'>('en');

  const localeLabels = {
    en: 'English',
    hi: 'हिंदी',
    mr: 'मराठी',
  } as const;

  const content = guidance[locale];

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <BookOpen size={16} className="text-teal-400" />
            Recommended Safety Actions
          </CardTitle>

          {/* Clean minimal language switcher */}
          <div className="flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
            {(['en', 'hi', 'mr'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                  locale === l 
                    ? 'bg-zinc-800 text-zinc-100 shadow-xs' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {localeLabels[l]}
              </button>
            ))}
          </div>
        </div>

        {/* AI Summary Banner */}
        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2.5">
          <Info size={15} className="text-teal-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{summary}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-zinc-200 mb-2">
            {content.title}
          </div>
          <ol className="space-y-2">
            {content.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-zinc-300 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Helpline quick links */}
        <div className="grid sm:grid-cols-2 gap-2 pt-1">
          <a
            href="tel:1930"
            className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition group text-xs"
          >
            <Phone size={15} className="text-red-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400">National Cyber Helpline</div>
              <div className="font-semibold text-zinc-200 font-mono">1930</div>
            </div>
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition group text-xs"
          >
            <div>
              <div className="text-[10px] text-zinc-400">Official Reporting Portal</div>
              <div className="font-semibold text-zinc-200">cybercrime.gov.in</div>
            </div>
            <ExternalLink size={13} className="text-zinc-400 group-hover:text-zinc-200" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
