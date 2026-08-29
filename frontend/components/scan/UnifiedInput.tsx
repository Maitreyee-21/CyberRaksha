'use client';

import * as React from 'react';
import { 
  Plus, ArrowUp, Image as ImageIcon, Link2, QrCode, 
  X, FileText, Sparkles, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/types';

interface UnifiedInputProps {
  onSubmit: (args: { 
    type: 'text' | 'image' | 'url' | 'qr'; 
    text?: string; 
    url?: string; 
    file?: File 
  }) => void | Promise<void>;
  loading?: boolean;
}

const SAMPLE_PROMPTS = [
  { label: 'RBI Scam Message', text: 'FROM RBI GOVERNOR OFFICE: Your PAN card linked to 2 Crore Black Money Transaction. Submit Rs.45000 Tax penalty within 3 hours on UPI rbi@gov otherwise arrest warrant will be issued against you by Narcotics Dept. Call Officer Rajesh 9900099000 immediately or face legal consequences.' },
  { label: 'Fake SBI KYC Warning', text: 'Dear Customer Your SBI Bank Account KYC is Pending. Update KYC within 24 Hours to avoid permanent Account Block. Click link: http://sbi-kyc-update.xyz/verify now and share OTP sent to your mobile to proceed.' },
  { label: 'OTP Cashback Scam', text: 'Your Flipkart order OTP is 382911. Send this OTP back to 9876543210 immediately to confirm delivery today and get Rs.500 cashback URGENTLY within 30 minutes otherwise order will be cancelled and you will be BLOCKED from Flipkart forever!' },
  { label: 'Benign Dinner Message', text: "Hi Mom, I will be late for dinner today. Eating at friend's place. Don't wait for me. Love you!" },
];

export function UnifiedInput({ onSubmit, loading }: UnifiedInputProps) {
  const [text, setText] = React.useState('');
  const [mode, setMode] = React.useState<'text' | 'url' | 'image' | 'qr'>('text');
  const [attachedFile, setAttachedFile] = React.useState<File | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const qrInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (loading) return;

    if (mode === 'image' && attachedFile) {
      onSubmit({ type: 'image', file: attachedFile, text: text.trim() });
      setAttachedFile(null);
      setText('');
      setMode('text');
      return;
    }

    if (mode === 'qr' && attachedFile) {
      onSubmit({ type: 'qr', file: attachedFile, text: text.trim() });
      setAttachedFile(null);
      setText('');
      setMode('text');
      return;
    }

    if (mode === 'url' && text.trim()) {
      onSubmit({ type: 'url', url: text.trim() });
      setText('');
      setMode('text');
      return;
    }

    if (text.trim()) {
      onSubmit({ type: 'text', text: text.trim() });
      setText('');
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setMode('text');
  };

  const selectMode = (newMode: 'url' | 'image' | 'qr') => {
    setMenuOpen(false);
    if (newMode === 'image') {
      fileInputRef.current?.click();
    } else if (newMode === 'qr') {
      qrInputRef.current?.click();
    } else if (newMode === 'url') {
      setMode('url');
      textareaRef.current?.focus();
    }
  };

  const hasContent = text.trim().length > 0 || attachedFile !== null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2.5">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setAttachedFile(file);
            setMode('image');
          }
        }}
      />
      <input
        ref={qrInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setAttachedFile(file);
            setMode('qr');
          }
        }}
      />

      {/* Main Unified Input Box (Claude / ChatGPT style) */}
      <div className="relative rounded-[16px] bg-zinc-900/80 border border-zinc-800/60 shadow-xs transition-all duration-200 focus-within:border-zinc-700/80 focus-within:ring-1 focus-within:ring-teal-500/20 focus-within:shadow-[0_0_20px_rgba(20,184,166,0.06)]">
        
        {/* Attachment chips above input */}
        {(attachedFile || mode === 'url') && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 pb-0">
            {attachedFile && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/60 text-xs text-zinc-200">
                {mode === 'image' ? <ImageIcon size={13} className="text-teal-400" /> : <QrCode size={13} className="text-teal-400" />}
                <span className="font-medium max-w-[200px] truncate">{attachedFile.name}</span>
                <span className="text-[10px] text-zinc-400 font-mono">({(attachedFile.size / 1024).toFixed(0)} KB)</span>
                <button
                  onClick={removeAttachment}
                  className="p-0.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition ml-0.5"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {mode === 'url' && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/60 text-xs text-teal-300">
                <Link2 size={13} />
                <span>URL Scan Mode</span>
                <button
                  onClick={() => setMode('text')}
                  className="p-0.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition ml-0.5"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Text Area and Buttons */}
        <div className="flex items-end gap-1.5 p-2 sm:p-2.5">
          {/* Plus / Attach Button with Menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition',
                menuOpen && 'bg-zinc-800 text-zinc-100'
              )}
              title="Add attachment / mode"
            >
              <Plus size={18} />
            </button>

            {/* Menu Popup */}
            {menuOpen && (
              <div className="absolute bottom-11 left-0 z-50 w-56 rounded-xl bg-zinc-900 border border-zinc-750 shadow-xl p-1.5 space-y-0.5 text-xs text-zinc-300 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => selectMode('image')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-left hover:text-zinc-100 transition"
                >
                  <ImageIcon size={15} className="text-teal-400" />
                  <div>
                    <div className="font-medium text-zinc-200">Upload Screenshot</div>
                    <div className="text-[10px] text-zinc-400">Scan SMS / WhatsApp image</div>
                  </div>
                </button>

                <button
                  onClick={() => selectMode('url')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-left hover:text-zinc-100 transition"
                >
                  <Link2 size={15} className="text-teal-400" />
                  <div>
                    <div className="font-medium text-zinc-200">Paste Suspicious URL</div>
                    <div className="text-[10px] text-zinc-400">Analyze domain and webpage</div>
                  </div>
                </button>

                <button
                  onClick={() => selectMode('qr')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-left hover:text-zinc-100 transition"
                >
                  <QrCode size={15} className="text-teal-400" />
                  <div>
                    <div className="font-medium text-zinc-200">Upload QR Code</div>
                    <div className="text-[10px] text-zinc-400">Decode and inspect destination</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'url'
                ? 'Paste URL to analyze (e.g. https://sbi-kyc-verify.xyz)...'
                : attachedFile
                ? 'Add optional notes or context (press Enter to run scan)...'
                : 'Paste suspicious SMS, WhatsApp message, or description...'
            }
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 ring-0 focus-visible:ring-0 focus-visible:outline-none text-sm text-zinc-100 placeholder:text-zinc-500 resize-none py-1.5 px-1.5 max-h-[180px] custom-scrollbar"
          />

          {/* Send / Submit Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!hasContent || loading}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0',
              hasContent && !loading
                ? 'bg-teal-500 hover:bg-teal-400 text-zinc-950 shadow-xs'
                : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
            )}
            title="Run Threat Analysis (Enter)"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp size={16} className="font-bold" />
            )}
          </button>
        </div>
      </div>

      {/* Quick sample chips */}
      {!hasContent && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="text-[11px] text-zinc-400 mr-1 flex items-center gap-1">
            <Sparkles size={11} className="text-teal-400" /> Quick Samples:
          </span>
          {SAMPLE_PROMPTS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setText(p.text);
                setMode('text');
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800/90 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
