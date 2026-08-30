'use client';

import * as React from 'react';
import { FileText, Copy, Check, Download, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { generateReportDraft } from '@/lib/api';
import type { ScanResult } from '@/lib/types';

interface ReportDraftProps {
  result: ScanResult;
}

/**
 * Automated Official Reporting Engine.
 *
 * Fully isolated: only reads the already-computed `result` prop it's given.
 * It does not call, import, or modify the scan pipeline, ResultsPanel logic,
 * or safety-lock behavior — it just offers a draft complaint for MEDIUM/HIGH
 * risk scans, and a reference link to cybercrime.gov.in. It never submits
 * anything to that site on the user's behalf.
 */
export function ReportDraft({ result }: ReportDraftProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const eligible = result.risk_level === 'MEDIUM' || result.risk_level === 'HIGH';
  if (!eligible) return null;

  const handleGenerate = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const res = await generateReportDraft(result);
      setDraft(res.draft_text);
    } catch (err: any) {
      setError(err?.message || 'Could not generate a report draft right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — user can still select-and-copy from the textarea.
    }
  };

  const handleDownload = () => {
    if (!draft) return;
    const blob = new Blob([draft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeCategory = result.scam_category.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    a.href = url;
    a.download = `cyberraksha-report-draft-${safeCategory || 'scam'}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <FileText size={16} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">Report This to Authorities</h3>
            <p className="text-[11px] text-zinc-400">
              Get a pre-filled complaint draft for the National Cyber Crime Reporting Portal.
            </p>
          </div>
        </div>
        <Button
          onClick={handleGenerate}
          size="sm"
          className="bg-teal-500 hover:bg-teal-400 text-zinc-950 font-medium gap-2 shrink-0"
        >
          <FileText size={14} />
          Generate Report Draft
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Draft Complaint — {result.scam_category}</DialogTitle>
        </DialogHeader>

        <DialogContent>
          {loading && (
            <div className="flex items-center gap-3 text-sm text-zinc-400 py-8 justify-center">
              <Loader2 size={16} className="animate-spin text-teal-400" />
              Drafting your report with IBM Granite AI…
            </div>
          )}

          {!loading && error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-sm">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-400 mb-1">Couldn't generate a draft</p>
                <p className="text-zinc-300 text-xs">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && draft && (
            <>
              <textarea
                readOnly
                value={draft}
                className="w-full h-72 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs font-mono text-zinc-300 resize-y custom-scrollbar"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  onClick={handleCopy}
                  size="sm"
                  variant="outline"
                  className="border-zinc-700/80 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 gap-2"
                >
                  {copied ? <Check size={14} className="text-teal-400" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy to Clipboard'}
                </Button>
                <Button
                  onClick={handleDownload}
                  size="sm"
                  variant="outline"
                  className="border-zinc-700/80 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 gap-2"
                >
                  <Download size={14} />
                  Download as .txt
                </Button>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-zinc-500 border-t border-zinc-800 pt-3">
                This is an AI-generated draft to help you report faster. Please review all
                details before submitting to the official portal. CyberRaksha does not submit
                this on your behalf.
              </p>
            </>
          )}
        </DialogContent>

        <DialogFooter>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">
            <Button className="bg-teal-500 hover:bg-teal-400 text-zinc-950 font-medium gap-2 w-full sm:w-auto">
              Report on cybercrime.gov.in
              <ExternalLink size={14} />
            </Button>
          </a>
        </DialogFooter>
      </Dialog>
    </>
  );
}
