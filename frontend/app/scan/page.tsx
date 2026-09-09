'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  Link2,
  MessageSquare,
  QrCode,
  Image as ImageIcon,
  FileText,
  Search,
  LockKeyhole,
  Upload,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';

import {
  runTextScan,
  runUrlScan,
  runImageScan,
} from '@/lib/api';

import { saveScanHistoryItem } from '@/lib/history';

import type { ScanResult } from '@/lib/types';
import ResultsPanel from '@/components/analysis/ResultsPanel';
import { useLanguage } from '@/components/providers/LanguageProvider';

type InputType =
  | 'text'
  | 'url'
  | 'qr'
  | 'image'
  | 'document';

function ScanPageContent() {
  const searchParams = useSearchParams();
  const { language, currentLanguage, translations } =
    useLanguage();

  const currentTranslation =
    translations[language] ?? translations.en;
  const home = currentTranslation.home;
  const englishHome = translations.en.home;

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [selectedType, setSelectedType] =
    useState<InputType>('text');
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] =
    useState<ScanResult | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');

    if (
      type === 'text' ||
      type === 'url' ||
      type === 'qr' ||
      type === 'image'
    ) {
      setSelectedType(type);
      setError('');
      setSelectedFile(null);
      setText('');
      setResult(null);
    }
  }, [searchParams]);

  /*
   * Use the global 22-language translation system.
   * The existing translations contain the core labels for every
   * supported language; technical helper text falls back to English
   * where a dedicated key does not exist.
   */
  const copy = {
    heroBadge:
      language === 'en'
        ? 'CyberRaksha Safety Check'
        : language === 'hi'
          ? 'CyberRaksha सुरक्षा जाँच'
          : language === 'mr'
            ? 'CyberRaksha सुरक्षा तपासणी'
            : 'CyberRaksha Safety Check',

    heroPrefix: home.safePrefix || englishHome.safePrefix,
    heroHighlight:
      home.safeHighlight || englishHome.safeHighlight,
    heroSubtitle:
      home.subtitle || englishHome.subtitle,

    privacy:
      home.privacy || englishHome.privacy,

    checkNow:
      home.checkNow || englishHome.checkNow,

    checking:
      home.checking || englishHome.checking,

    message:
      home.message || englishHome.message,
    messageSubtitle:
      home.messageSubtitle || englishHome.messageSubtitle,

    link:
      home.link || englishHome.link,
    linkSubtitle:
      home.linkSubtitle || englishHome.linkSubtitle,

    qr:
      home.qrCode || englishHome.qrCode,
    qrSubtitle:
      home.qrSubtitle || englishHome.qrSubtitle,

    image:
      home.image || englishHome.image,
    imageSubtitle:
      home.imageSubtitle || englishHome.imageSubtitle,

    document:
      home.document || englishHome.document,
    documentSubtitle:
      home.documentSubtitle || englishHome.documentSubtitle,

    textPlaceholder:
      home.textPlaceholder || englishHome.textPlaceholder,
    urlPlaceholder:
      home.urlPlaceholder || englishHome.urlPlaceholder,

    urlRequired:
      home.urlRequired || englishHome.urlRequired,
    textRequired:
      home.textRequired || englishHome.textRequired,
    imageRequired:
      home.imageRequired || englishHome.imageRequired,

    documentUnavailable:
      home.documentUnavailable ||
      englishHome.documentUnavailable,

    scanError:
      home.scanError || englishHome.scanError,
  };

  const inputOptions = [
    {
      type: 'text' as InputType,
      title: copy.message,
      subtitle: copy.messageSubtitle,
      icon: MessageSquare,
      gradient: 'from-[#159CFF] to-[#1976D2]',
      description:
        language === 'hi'
          ? 'संदिग्ध संदेश, ईमेल और टेक्स्ट की जाँच करें।'
          : language === 'mr'
            ? 'संशयास्पद संदेश, ईमेल आणि मजकूर तपासा.'
            : 'Check suspicious messages, emails and text.',
    },
    {
      type: 'url' as InputType,
      title: copy.link,
      subtitle: copy.linkSubtitle,
      icon: Link2,
      gradient: 'from-[#9857FF] to-[#6734D6]',
      description:
        language === 'hi'
          ? 'वेबसाइट खोलने से पहले उसकी जाँच करें।'
          : language === 'mr'
            ? 'वेबसाइट उघडण्यापूर्वी ती तपासा.'
            : 'Check a website before opening it.',
    },
    {
      type: 'qr' as InputType,
      title: copy.qr,
      subtitle: copy.qrSubtitle,
      icon: QrCode,
      gradient: 'from-[#FFB12C] to-[#F27A00]',
      description:
        language === 'hi'
          ? 'QR कोड कहाँ ले जाता है, यह जाँचें।'
          : language === 'mr'
            ? 'QR कोड कुठे नेतो ते तपासा.'
            : 'Check where a QR code wants to take you.',
    },
    {
      type: 'image' as InputType,
      title: copy.image,
      subtitle: copy.imageSubtitle,
      icon: ImageIcon,
      gradient: 'from-[#18D77B] to-[#079B56]',
      description:
        language === 'hi'
          ? 'स्क्रीनशॉट और संदिग्ध इमेज की जाँच करें।'
          : language === 'mr'
            ? 'स्क्रीनशॉट आणि संशयास्पद इमेज तपासा.'
            : 'Check screenshots and suspicious images.',
    },
    {
      type: 'document' as InputType,
      title: copy.document,
      subtitle: copy.documentSubtitle,
      icon: FileText,
      gradient: 'from-[#FF536C] to-[#E52E50]',
      description:
        language === 'hi'
          ? 'दस्तावेज़ स्कैनिंग जल्द उपलब्ध होगी।'
          : language === 'mr'
            ? 'दस्तऐवज स्कॅनिंग लवकरच उपलब्ध होईल.'
            : 'Document scanning will be available soon.',
      disabled: true,
    },
  ];

  const selectType = (type: InputType) => {
    setSelectedType(type);
    setError('');
    setResult(null);
    setSelectedFile(null);
    setText('');

    if (type === 'document') {
      setError(copy.documentUnavailable);
      return;
    }

    if (type === 'qr' || type === 'image') {
      window.setTimeout(() => {
        fileInputRef.current?.click();
      }, 50);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setError('');
    setResult(null);

    // Allow selecting the same file again later.
    event.target.value = '';
  };

  const openFilePicker = () => {
    if (
      selectedType === 'qr' ||
      selectedType === 'image'
    ) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    setResult(null);
  };

  const handleScan = async () => {
    setError('');

    if (selectedType === 'document') {
      setError(copy.documentUnavailable);
      return;
    }

    if (
      (selectedType === 'text' ||
        selectedType === 'url') &&
      !text.trim()
    ) {
      setError(
        selectedType === 'url'
          ? copy.urlRequired
          : copy.textRequired
      );
      return;
    }

    if (
      (selectedType === 'qr' ||
        selectedType === 'image') &&
      !selectedFile
    ) {
      setError(
        copy.imageRequired
      );
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response: ScanResult;
      let preview = '';

      if (selectedType === 'text') {
        preview = text.trim();
        response = await runTextScan(text.trim());
      } else if (selectedType === 'url') {
        preview = text.trim();
        response = await runUrlScan(text.trim());
      } else if (selectedType === 'qr') {
        preview = selectedFile?.name || 'QR Code';
        response = await runImageScan(
          selectedFile!,
          'qr'
        );
      } else {
        preview = selectedFile?.name || 'Image';
        response = await runImageScan(
          selectedFile!,
          'image'
        );
      }

      setResult(response);

      saveScanHistoryItem(
        selectedType === 'url'
          ? 'url'
          : selectedType === 'qr'
            ? 'qr'
            : selectedType === 'image'
              ? 'image'
              : 'text',
        preview,
        response
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : '';

      setError(message || copy.scanError);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === 'Enter'
    ) {
      event.preventDefault();

      if (!loading) {
        void handleScan();
      }
    }
  };

  const selectedOption = inputOptions.find(
    (option) => option.type === selectedType
  );

  const SelectedIcon =
    selectedOption?.icon || MessageSquare;

  return (
    <AppShell>
      <section
        className="min-h-screen px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-10"
        dir={currentLanguage.rtl ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto max-w-[1200px]">
          {/* HERO */}
          <div className="mx-auto max-w-[800px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E6D0]/10 bg-[#00E6D0]/5 px-4 py-2 text-xs font-medium text-[#72EDE3]">
              <Sparkles
                size={12}
                className="text-[#00E6D0]"
              />
              {copy.heroBadge}
            </div>

            <h1 className="text-[42px] font-extrabold leading-[1.05] tracking-[-2px] text-white sm:text-[58px] lg:text-[70px]">
              {copy.heroPrefix}{' '}
              <span className="bg-gradient-to-r from-[#00E6D0] via-[#21D8CB] to-[#00AFA3] bg-clip-text text-transparent">
                {copy.heroHighlight}
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-[620px] text-sm leading-6 text-slate-400 sm:text-base">
              {copy.heroSubtitle}
            </p>
          </div>

          {/* INPUT TYPE CARDS */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {inputOptions.map((option) => {
              const Icon = option.icon;
              const selected =
                selectedType === option.type;

              return (
                <button
                  key={option.type}
                  type="button"
                  disabled={option.disabled}
                  onClick={() =>
                    selectType(option.type)
                  }
                  aria-pressed={selected}
                  className={`
                    group relative min-h-[175px]
                    overflow-hidden rounded-2xl border
                    p-5 text-center
                    transition-all duration-200
                    ${
                      selected
                        ? 'border-[#00E6D0]/40 bg-[#101C20] shadow-[0_0_35px_rgba(0,230,208,.07)]'
                        : 'border-white/[0.07] bg-[#10151B] hover:-translate-y-1 hover:border-white/[0.14] hover:bg-[#11181F]'
                    }
                    ${
                      option.disabled
                        ? 'cursor-not-allowed opacity-45'
                        : 'cursor-pointer'
                    }
                  `}
                >
                  {selected && (
                    <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E6D0] to-transparent" />
                  )}

                  <div
                    className={`
                      mx-auto flex h-[56px] w-[56px]
                      items-center justify-center
                      rounded-full bg-gradient-to-br
                      ${option.gradient}
                      shadow-lg
                      transition-transform duration-200
                      ${
                        !option.disabled
                          ? 'group-hover:scale-105'
                          : ''
                      }
                    `}
                  >
                    <Icon
                      size={23}
                      strokeWidth={2}
                      className="text-white"
                    />
                  </div>

                  <h2 className="mt-4 text-sm font-bold text-white sm:text-base">
                    {option.title}
                  </h2>

                  <p className="mt-1 whitespace-pre-line text-[11px] leading-5 text-slate-500">
                    {option.subtitle}
                  </p>

                  {option.disabled && (
                    <span className="mt-2 inline-block rounded-full bg-white/5 px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-slate-500">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN INPUT */}
          <div className="mt-7">
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1319] shadow-[0_20px_60px_rgba(0,0,0,.15)]">
              {/* INPUT HEADER */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                    <SelectedIcon
                      size={16}
                      className="text-[#00E6D0]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selectedOption?.title ||
                        copy.message}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {selectedOption?.description}
                    </p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-slate-500 sm:flex">
                  <ShieldCheck
                    size={11}
                    className="text-[#00CDBE]"
                  />
                  {language === 'hi'
                    ? 'गोपनीयता सुरक्षित'
                    : language === 'mr'
                      ? 'गोपनीयता संरक्षित'
                      : 'Privacy protected'}
                </div>
              </div>

              {/* TEXT / URL */}
              {(selectedType === 'text' ||
                selectedType === 'url') && (
                <div className="p-4">
                  <div className="rounded-xl border border-white/[0.07] bg-[#11181F] transition focus-within:border-[#00E6D0]/30">
                    <div className="flex items-start gap-3 px-4 pt-3.5">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A232B]">
                        {selectedType === 'url' ? (
                          <Link2
                            size={15}
                            className="text-slate-400"
                          />
                        ) : (
                          <MessageSquare
                            size={15}
                            className="text-slate-400"
                          />
                        )}
                      </div>

                      <textarea
                        value={text}
                        onChange={(event) =>
                          setText(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        rows={3}
                        disabled={loading}
                        dir={currentLanguage.rtl ? 'rtl' : 'ltr'}
                        placeholder={
                          selectedType === 'url'
                            ? copy.urlPlaceholder
                            : copy.textPlaceholder
                        }
                        className="min-h-[85px] flex-1 resize-none bg-transparent py-1 text-sm leading-6 text-white outline-none placeholder:text-slate-600 disabled:opacity-60"
                      />
                    </div>

                    <div className="flex items-center justify-between px-4 pb-2.5 pt-1">
                      <span className="text-[10px] text-slate-600">
                        {selectedType === 'url'
                          ? 'Example: https://example.com'
                          : 'Ctrl + Enter to check'}
                      </span>

                      <span className="text-[10px] text-slate-600">
                        {text.length} characters
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      disabled={
                        loading || !text.trim()
                      }
                      onClick={() => void handleScan()}
                      className="flex h-[50px] min-w-[145px] items-center justify-center gap-2 rounded-xl bg-[#00E6D0] px-6 text-sm font-bold text-[#041311] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Search size={17} />
                      {loading
                        ? copy.checking
                        : copy.checkNow}
                    </button>
                  </div>
                </div>
              )}

              {/* QR / IMAGE */}
              {(selectedType === 'qr' ||
                selectedType === 'image') && (
                <div className="p-4">
                  {!selectedFile ? (
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="group flex min-h-[180px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-[#11181F] px-5 transition hover:border-[#00E6D0]/30 hover:bg-[#121B20]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00E6D0]/10 transition group-hover:scale-105">
                        <Upload
                          size={19}
                          className="text-[#00E6D0]"
                        />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-white">
                        {selectedType === 'qr'
                          ? copy.qr
                          : copy.image}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        PNG, JPG, WEBP
                      </p>

                      <span className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300">
                        Choose File
                      </span>
                    </button>
                  ) : (
                    <div className="rounded-xl border border-white/[0.07] bg-[#11181F] p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00E6D0]/10">
                          {selectedType === 'qr' ? (
                            <QrCode
                              size={19}
                              className="text-[#00E6D0]"
                            />
                          ) : (
                            <ImageIcon
                              size={19}
                              className="text-[#00E6D0]"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {selectedFile.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {(
                              selectedFile.size / 1024
                            ).toFixed(1)}{' '}
                            KB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={removeFile}
                          disabled={loading}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                          aria-label="Remove file"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => void handleScan()}
                          className="flex h-[50px] min-w-[145px] items-center justify-center gap-2 rounded-xl bg-[#00E6D0] px-6 text-sm font-bold text-[#041311] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Search size={17} />
                          {loading
                            ? copy.checking
                            : copy.checkNow}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DOCUMENT */}
              {selectedType === 'document' && (
                <div className="p-5">
                  <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#11181F] text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF536C]/10">
                      <FileText
                        size={19}
                        className="text-[#FF536C]"
                      />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-white">
                      {copy.document}
                    </p>

                    <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
                      {copy.documentUnavailable}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* PRIVACY */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11px] text-slate-600">
              <LockKeyhole
                size={12}
                className="text-slate-500"
              />

              <span>{copy.privacy}</span>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
              <div className="mt-0.5 shrink-0">
                <ShieldCheck size={15} />
              </div>

              <div className="flex-1">
                <p className="font-semibold">
                  {language === 'hi'
                    ? 'जाँच शुरू नहीं हो सकी'
                    : language === 'mr'
                      ? 'तपासणी सुरू होऊ शकली नाही'
                      : 'Check could not start'}
                </p>

                <p className="mt-1 text-xs leading-5 text-red-300/70">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="mt-10">
              <ResultsPanel
                result={result}
                loading={loading}
                error={null}
              />
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={null}>
      <ScanPageContent />
    </Suspense>
  );
}
