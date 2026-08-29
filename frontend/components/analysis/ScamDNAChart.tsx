'use client';

import * as React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import type { ScamDNA } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dna } from 'lucide-react';

const LABELS: Record<keyof ScamDNA, { label: string; desc: string }> = {
  urgency: { label: 'Urgency', desc: 'Time-pressure / deadline tactics' },
  fear: { label: 'Fear', desc: 'Threats / legal coercion / account blocks' },
  impersonation: { label: 'Impersonation', desc: 'Poses as legitimate entity / bank' },
  suspicious_link: { label: 'Bad Links', desc: 'Shortened or phishing URLs' },
  payment_pressure: { label: 'Payment', desc: 'Demands advance money / UPI' },
};

export function ScamDNAChart({ dna }: { dna: ScamDNA }) {
  const data = (Object.keys(LABELS) as (keyof ScamDNA)[]).map((k) => ({
    tactic: LABELS[k].label,
    score: dna[k],
    fullMark: 100,
    description: LABELS[k].desc,
  }));

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-200">
          <Dna size={16} className="text-teal-400" />
          Scam DNA — Manipulation Tactics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-[220px] w-full">
          <ResponsiveContainer>
            <RadarChart data={data} outerRadius="75%">
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="tactic" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#52525b', fontSize: 9 }} axisLine={false} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.25}
                strokeWidth={1.5}
              />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#f4f4f5' }}
                itemStyle={{ color: '#2dd4bf' }}
                formatter={(v: number) => [`${v} / 100`, 'Presence']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {data.map((d) => (
            <div key={d.tactic} className="text-center p-1.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
              <div className="text-[10px] text-zinc-400 truncate">{d.tactic}</div>
              <div 
                className="mt-0.5 text-sm font-semibold font-mono tabular-nums"
                style={{ color: d.score >= 70 ? '#ef4444' : d.score >= 40 ? '#f59e0b' : '#10b981' }}
              >
                {d.score}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
