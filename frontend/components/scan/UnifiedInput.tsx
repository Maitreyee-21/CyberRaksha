'use client';

import * as React from 'react';
import {
  Plus,
  ArrowUp,
  Image as ImageIcon,
  Link2,
  QrCode,
  X,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';

type UnifiedInputProps = {
  onSubmit: (args: {
    type: 'text' | 'image' | 'url' | 'qr';
    text?: string;
    url?: string;
    file?: File;
  }) => void | Promise<void>;
  loading?: boolean;
  language?: string;
};

const SAMPLE_PROMPTS = [
  {
    label: 'RBI Scam Message',
    text: 'FROM RBI GOVERNOR OFFICE: Your PAN card linked to 2 Crore Black Money Transaction. Submit Rs.45000 Tax penalty within 3 hours on UPI rbi@gov otherwise arrest warrant will be issued against you by Narcotics Dept. Call Officer Rajesh 9900099000 immediately or face legal consequences.',
  },
  {
    label: 'Fake SBI KYC Warning',
    text: 'Dear Customer Your SBI Bank Account KYC is Pending. Update KYC within 24 Hours to avoid permanent Account Block. Click link: http://sbi-kyc-update.xyz/verify now and share OTP sent to your mobile to proceed.',
  },
  {
    label: 'OTP Cashback Scam',
    text: 'Your Flipkart order OTP is 382911. Send this OTP back to 9876543210 immediately to confirm delivery today and get Rs.500 cashback URGENTLY within 30 minutes otherwise order will be cancelled and you will be BLOCKED from Flipkart forever!',
  },
  {
    label: 'Benign Dinner Message',
    text: "Hi Mom, I will be late for dinner today. Eating at friend's place. Don't wait for me. Love you!",
  },
];

const SAMPLE_LABELS = {
  en: ['RBI Scam', 'SBI KYC', 'OTP Scam', 'Benign Message'],
  hi: ['RBI स्कैम', 'SBI KYC', 'OTP स्कैम', 'सामान्य मैसेज'],
  mr: ['RBI स्कॅम', 'SBI KYC', 'OTP स्कॅम', 'सामान्य मेसेज'],
} as const;

export function UnifiedInput({
  onSubmit,
  loading = false,
}: UnifiedInputProps) {
  const { language, currentLanguage, translations } = useLanguage();

  const currentTranslation =
    translations[language] ?? translations.en;
  const home = currentTranslation.home;
  const englishHome = translations.en.home;

  /*
   * The global translation file contains the main labels for every supported
   * language. Some input-specific labels are derived from those shared labels
   * so the component no longer falls back to only en/hi/mr.
   */
  const copy = {
    screenshot: home.image || englishHome.image,
    screenshotHint:
      home.imageSubtitle || englishHome.imageSubtitle,
    url: home.link || englishHome.link,
    urlHint: home.linkSubtitle || englishHome.linkSubtitle,
    qr: home.qrCode || englishHome.qrCode,
    qrHint: home.qrSubtitle || englishHome.qrSubtitle,
    urlMode: home.link || englishHome.link,
    add:
      language === 'en'
        ? 'Add attachment / mode'
        : language === 'hi'
          ? 'अटैचमेंट / मोड जोड़ें'
          : language === 'mr'
            ? 'अटॅचमेंट / मोड जोडा'
            : 'Add attachment / mode',
    placeholder:
      home.textPlaceholder || englishHome.textPlaceholder,
    urlPlaceholder:
      home.urlPlaceholder || englishHome.urlPlaceholder,
    attachmentPlaceholder:
      home.imageSubtitle || englishHome.imageSubtitle,
    quick:
      language === 'en'
        ? 'Quick Samples:'
        : language === 'hi'
          ? 'त्वरित नमूने:'
          : language === 'mr'
            ? 'जलद नमुने:'
            : 'Quick Samples:',
  };

  const sampleLabels =
    language === 'hi'
      ? SAMPLE_LABELS.hi
      : language === 'mr'
        ? SAMPLE_LABELS.mr
        : SAMPLE_LABELS.en;

  const [text, setText] = React.useState('');
  const [mode, setMode] = React.useState<
    'text' | 'url' | 'image' | 'qr'
  >('text');
  const [attachedFile, setAttachedFile] =
    React.useState<File | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const qrInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef =
    React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  React.useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      180
    )}px`;
  }, [text]);

  const handleSend = React.useCallback(() => {
    if (loading) return;

    if (mode === 'image' && attachedFile) {
      void onSubmit({
        type: 'image',
        file: attachedFile,
        text: text.trim(),
      });

      setAttachedFile(null);
      setText('');
      setMode('text');
      return;
    }

    if (mode === 'qr' && attachedFile) {
      void onSubmit({
        type: 'qr',
        file: attachedFile,
        text: text.trim(),
      });

      setAttachedFile(null);
      setText('');
      setMode('text');
      return;
    }

    if (mode === 'url' && text.trim()) {
      void onSubmit({
        type: 'url',
        url: text.trim(),
      });

      setText('');
      setMode('text');
      return;
    }

    if (text.trim()) {
      void onSubmit({
        type: 'text',
        text: text.trim(),
      });

      setText('');
    }
  }, [attachedFile, loading, mode, onSubmit, text]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setMode('text');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (qrInputRef.current) {
      qrInputRef.current.value = '';
    }
  };

  const selectMode = (
    newMode: 'url' | 'image' | 'qr'
  ) => {
    setMenuOpen(false);

    if (newMode === 'image') {
      fileInputRef.current?.click();
      return;
    }

    if (newMode === 'qr') {
      qrInputRef.current?.click();
      return;
    }

    setAttachedFile(null);
    setMode('url');

    window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const hasContent =
    text.trim().length > 0 || attachedFile !== null;

  const inputDirection = currentLanguage.rtl
    ? 'rtl'
    : 'ltr';

  return (
    <div
      className="mx-auto w-full max-w-3xl space-y-2.5"
      dir={inputDirection}
    >
      {/* Hidden image input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label={copy.screenshot}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            setAttachedFile(file);
            setMode('image');
          }
        }}
      />

      {/* Hidden QR input */}
      <input
        ref={qrInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label={copy.qr}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            setAttachedFile(file);
            setMode('qr');
          }
        }}
      />

      {/* Main Unified Input Box */}
      <div className="relative rounded-[16px] border border-zinc-800/60 bg-zinc-900/80 shadow-xs transition-all duration-200 focus-within:border-zinc-700/80 focus-within:ring-1 focus-within:ring-teal-500/20 focus-within:shadow-[0_0_20px_rgba(20,184,166,0.06)]">
        {/* Attachment chips */}
        {(attachedFile || mode === 'url') && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 pb-0">
            {attachedFile && (
              <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/90 px-2.5 py-1 text-xs text-zinc-200">
                {mode === 'image' ? (
                  <ImageIcon
                    size={13}
                    className="shrink-0 text-teal-400"
                  />
                ) : (
                  <QrCode
                    size={13}
                    className="shrink-0 text-teal-400"
                  />
                )}

                <span className="max-w-[200px] truncate font-medium">
                  {attachedFile.name}
                </span>

                <span className="shrink-0 font-mono text-[10px] text-zinc-400">
                  ({(attachedFile.size / 1024).toFixed(0)} KB)
                </span>

                <button
                  type="button"
                  onClick={removeAttachment}
                  aria-label="Remove attachment"
                  className="ml-0.5 rounded p-0.5 text-zinc-400 transition hover:bg-zinc-700 hover:text-zinc-200"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {mode === 'url' && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/90 px-2.5 py-1 text-xs text-teal-300">
                <Link2 size={13} />
                <span>{copy.urlMode}</span>

                <button
                  type="button"
                  onClick={() => setMode('text')}
                  aria-label="Close URL mode"
                  className="ml-0.5 rounded p-0.5 text-zinc-400 transition hover:bg-zinc-700 hover:text-zinc-200"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Text area and buttons */}
        <div className="flex items-end gap-1.5 p-2 sm:p-2.5">
          <div
            className="relative shrink-0"
            ref={menuRef}
          >
            <button
              type="button"
              onClick={() =>
                setMenuOpen((previous) => !previous)
              }
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label={copy.add}
              title={copy.add}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800/80 hover:text-zinc-100',
                menuOpen &&
                  'bg-zinc-800 text-zinc-100'
              )}
            >
              <Plus size={18} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute bottom-11 left-0 z-50 w-56 space-y-0.5 rounded-xl border border-zinc-750 bg-zinc-900 p-1.5 text-xs text-zinc-300 shadow-xl"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    selectMode('image')
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-zinc-800 hover:text-zinc-100"
                >
                  <ImageIcon
                    size={15}
                    className="text-teal-400"
                  />
                  <div>
                    <div className="font-medium text-zinc-200">
                      {copy.screenshot}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {copy.screenshotHint}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    selectMode('url')
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-zinc-800 hover:text-zinc-100"
                >
                  <Link2
                    size={15}
                    className="text-teal-400"
                  />
                  <div>
                    <div className="font-medium text-zinc-200">
                      {copy.url}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {copy.urlHint}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => selectMode('qr')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-zinc-800 hover:text-zinc-100"
                >
                  <QrCode
                    size={15}
                    className="text-teal-400"
                  />
                  <div>
                    <div className="font-medium text-zinc-200">
                      {copy.qr}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {copy.qrHint}
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'url'
                ? copy.urlPlaceholder
                : attachedFile
                  ? copy.attachmentPlaceholder
                  : copy.placeholder
            }
            aria-label={copy.placeholder}
            dir={inputDirection}
            className="max-h-[180px] flex-1 resize-none border-none bg-transparent px-1.5 py-1.5 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!hasContent || loading}
            aria-label="Run threat analysis"
            title="Run Threat Analysis (Enter)"
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition',
              hasContent && !loading
                ? 'bg-teal-500 text-zinc-950 shadow-xs hover:bg-teal-400'
                : 'cursor-not-allowed bg-zinc-800/50 text-zinc-600'
            )}
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
            ) : (
              <ArrowUp size={16} />
            )}
          </button>
        </div>
      </div>

      {!hasContent && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="mr-1 flex items-center gap-1 text-[11px] text-zinc-400">
            <Sparkles
              size={11}
              className="text-teal-400"
            />
            {copy.quick}
          </span>

          {SAMPLE_PROMPTS.map((sample, index) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setText(sample.text);
                setMode('text');
              }}
              className="rounded-full border border-zinc-800/90 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
            >
              {sampleLabels[index]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
