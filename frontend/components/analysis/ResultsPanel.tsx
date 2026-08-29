'use client';

import * as React from 'react';
import { RiskMeter } from '@/components/analysis/RiskMeter';
import { ScamDNAChart } from '@/components/analysis/ScamDNAChart';
import { RedFlagsList } from '@/components/analysis/RedFlagsList';
import { EmergencyAlert } from '@/components/analysis/EmergencyAlert';
import { SafetyLock } from '@/components/analysis/SafetyLock';
import { GuidancePanel } from '@/components/analysis/GuidancePanel';
import type { ScanResult } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { DatabaseZap, ShieldCheck } from 'lucide-react';

interface ResultsPanelProps { 
  result: ScanResult | null; 
  loading: boolean; 
  error: string | null; 
}

export function ResultsPanel({ result, loading, error }: ResultsPanelProps) {
  const [showEmergency, setShowEmergency] = React.useState(false);

  React.useEffect(() => {
    if (result?.emergency_alert) setShowEmergency(true);
  }, [result?.emergency_alert, result]);

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto py-8">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing with IBM Granite 4.1 AI models…</span>
        </div>
        <div className="space-y-3">
          <div className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
          <div className="h-64 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-sm">
        <div className="font-semibold text-red-400 mb-1">Analysis Error</div>
        <div className="text-zinc-300 font-mono text-xs whitespace-pre-wrap">{error}</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-teal-400 shadow-xs">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-lg font-semibold text-zinc-100">CyberRaksha AI Threat Scanner</h2>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
          Paste any suspicious SMS, WhatsApp message, URL, or upload a screenshot. IBM Granite AI will analyze the tactics, red flags, and risk score.
        </p>
      </div>
    );
  }

  return (
    <>
      <EmergencyAlert
        open={showEmergency}
        onDismiss={() => setShowEmergency(false)}
        riskScore={result.risk_score}
        scamCategory={result.scam_category}
        detectedUrls={result.detected_urls}
        security={result.security_evaluation}
      />

      <div className="max-w-3xl mx-auto space-y-4 pb-12">
        {/* Header summary info */}
        <div className="flex items-center justify-between gap-2 flex-wrap px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-100">{result.scam_category}</span>
            {result.similarity_match && (
              <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-300 border-zinc-700">
                <DatabaseZap size={10} className="mr-1 text-teal-400" /> Database Match
              </Badge>
            )}
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {result.api_mode === 'live_watsonx' ? 'IBM Granite Live' : 'Local Fallback'}
          </span>
        </div>

        {/* Risk meter */}
        <RiskMeter level={result.risk_level} score={result.risk_score} />

        {/* QR Payload Card */}
        {result.qr_payload && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <span className="font-bold text-xs font-mono">QR</span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-200">Decoded QR Code Payload</h3>
                  <p className="text-[10px] text-zinc-400">Data successfully extracted from image scan</p>
                </div>
              </div>
              <Badge variant="outline" className={
                result.qr_payload.startsWith("upi://") ? "text-amber-400 border-amber-500/30 bg-amber-500/5" :
                result.qr_payload.startsWith("http") ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/5" :
                "text-zinc-400 border-zinc-800 bg-zinc-900/40"
              }>
                {result.qr_payload.startsWith("upi://") ? "💳 UPI Payment Request" :
                 result.qr_payload.startsWith("http") ? "🔗 Web Destination Link" :
                 "📝 Text Payload"}
              </Badge>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-300 break-all select-all selection:bg-teal-500/25 select-text">
              {result.qr_payload}
            </div>
            {result.qr_payload.startsWith("upi://") && (
              <p className="text-[11px] text-amber-400/90 leading-relaxed bg-amber-500/5 p-2 rounded-lg border border-amber-500/20">
                ⚠️ <b>Crucial Safety Alert:</b> This QR code directly initiates a UPI fund transfer. Scanning this QR code and entering your UPI PIN will <b>DEBIT/DEDUCT</b> money from your bank account, never credit it.
              </p>
            )}
          </div>
        )}

        {/* Safety Lock if active */}
        {result.security_evaluation && result.security_evaluation.action !== 'ALLOW_WITH_CAUTION' && (
          <SafetyLock
            security={result.security_evaluation}
            urls={result.detected_urls}
          />
        )}

        {/* Red Flags & Scam DNA Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <RedFlagsList flags={result.red_flags} category={result.scam_category} />
          <ScamDNAChart dna={result.scam_dna} />
        </div>

        {/* Multilingual Guidance */}
        <GuidancePanel
          guidance={result.guidance}
          safetyLock={result.safety_lock}
          summary={result.summary}
        />
      </div>
    </>
  );
}
