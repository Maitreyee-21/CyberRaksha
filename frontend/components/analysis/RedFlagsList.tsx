'use client';

import { Flag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function RedFlagsList({ flags, category }: { flags: string[]; category: string }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <Flag size={16} className="text-teal-400" />
            Detected Red Flags
          </CardTitle>
          <Badge variant="secondary" className="text-[11px] bg-zinc-800 text-zinc-300 border-zinc-700">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {flags.length === 0 ? (
          <div className="p-4 text-center rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400" />
            No specific fraud indicators matched. Always exercise standard caution.
          </div>
        ) : (
          <ul className="space-y-2">
            {flags.map((f, i) => (
              <li key={i} className="flex gap-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs">
                <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-zinc-300 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
