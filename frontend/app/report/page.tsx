'use client';

import { useState } from 'react';

import {
  ArrowRight,
  ExternalLink,
  Phone,
  ShieldAlert,
  ClipboardCheck,
  Copy,
  Check,
  FileText,
  LockKeyhole,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { LanguageCode } from '@/lib/languages';

type ReportTranslation = {
  title: string;
  subtitle: string;
  governmentPortal: string;
  governmentPortalDescription: string;
  nationalHelpline: string;
  helplineDescription: string;
  cyberFraudAssistance: string;
  emergencyAdvice: string;
  beforeReporting: string;
  beforeReportingDescription: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  whatToKeep: string;
  whatToKeepDescription: string;
  doNotDelete: string;
  copyNumber: string;
  copied: string;
  officialOnly: string;
  officialOnlyDescription: string;
};

const englishReport: ReportTranslation = {
  title: 'Report a Cyber Scam',
  subtitle: 'Help make the internet safer for everyone.',
  governmentPortal: 'Report to Government Portal',
  governmentPortalDescription:
    'Open the official National Cyber Crime Reporting Portal.',
  nationalHelpline: 'National Helpline',
  helplineDescription: 'Call 1930 for cyber fraud assistance.',
  cyberFraudAssistance: 'Cyber fraud assistance.',
  emergencyAdvice:
    'If you have lost money, contact your bank immediately and report the incident as soon as possible.',
  beforeReporting: 'Before you report',
  beforeReportingDescription:
    'Keep the important details ready. Do not delete messages or evidence before saving them.',
  step1: 'Save screenshots of suspicious messages, links and profiles.',
  step2: 'Keep transaction IDs, dates, amounts and payment details.',
  step3: 'Note the scammer’s phone number, email, username or website.',
  step4: 'If money was lost, contact your bank/payment provider immediately.',
  whatToKeep: 'What evidence should you keep?',
  whatToKeepDescription:
    'Keep original messages, URLs, call details, payment receipts, transaction IDs and screenshots. These details can help with investigation and reporting.',
  doNotDelete: 'Do not delete evidence until you have saved the details needed for your report.',
  copyNumber: 'Copy 1930',
  copied: 'Copied',
  officialOnly: 'Use official channels',
  officialOnlyDescription:
    'CyberRaksha will never ask you to pay a fee to file a complaint. Use the official portal or helpline for reporting.',
};

const hindiReport: ReportTranslation = {
  title: 'साइबर स्कैम की रिपोर्ट करें',
  subtitle: 'इंटरनेट को सभी के लिए सुरक्षित बनाने में मदद करें।',
  governmentPortal: 'सरकारी पोर्टल पर रिपोर्ट करें',
  governmentPortalDescription:
    'आधिकारिक राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल खोलें।',
  nationalHelpline: 'राष्ट्रीय हेल्पलाइन',
  helplineDescription: 'साइबर धोखाधड़ी सहायता के लिए 1930 पर कॉल करें।',
  cyberFraudAssistance: 'साइबर धोखाधड़ी सहायता।',
  emergencyAdvice:
    'यदि आपके पैसे खो गए हैं, तो तुरंत अपने बैंक से संपर्क करें और जल्द से जल्द घटना की रिपोर्ट करें।',
  beforeReporting: 'रिपोर्ट करने से पहले',
  beforeReportingDescription:
    'जरूरी जानकारी तैयार रखें। उन्हें सुरक्षित करने से पहले संदेश या सबूत डिलीट न करें।',
  step1: 'संदिग्ध संदेश, लिंक और प्रोफाइल के स्क्रीनशॉट सुरक्षित रखें।',
  step2: 'ट्रांजैक्शन आईडी, तारीख, राशि और भुगतान की जानकारी रखें।',
  step3: 'स्कैमर का फोन नंबर, ईमेल, यूज़रनेम या वेबसाइट नोट करें।',
  step4: 'यदि पैसे खो गए हैं, तो तुरंत बैंक/पेमेंट सेवा से संपर्क करें।',
  whatToKeep: 'कौन सा सबूत सुरक्षित रखें?',
  whatToKeepDescription:
    'मूल संदेश, URL, कॉल की जानकारी, भुगतान रसीद, ट्रांजैक्शन आईडी और स्क्रीनशॉट सुरक्षित रखें।',
  doNotDelete: 'रिपोर्ट के लिए जरूरी जानकारी सुरक्षित करने से पहले सबूत डिलीट न करें।',
  copyNumber: '1930 कॉपी करें',
  copied: 'कॉपी हो गया',
  officialOnly: 'आधिकारिक चैनल का उपयोग करें',
  officialOnlyDescription:
    'CyberRaksha शिकायत दर्ज करने के लिए आपसे कोई शुल्क नहीं मांगेगा। रिपोर्ट के लिए आधिकारिक पोर्टल या हेल्पलाइन का उपयोग करें।',
};

const marathiReport: ReportTranslation = {
  title: 'सायबर स्कॅमची तक्रार करा',
  subtitle: 'इंटरनेट सर्वांसाठी अधिक सुरक्षित बनविण्यात मदत करा.',
  governmentPortal: 'सरकारी पोर्टलवर तक्रार करा',
  governmentPortalDescription:
    'अधिकृत राष्ट्रीय सायबर क्राईम रिपोर्टिंग पोर्टल उघडा.',
  nationalHelpline: 'राष्ट्रीय हेल्पलाइन',
  helplineDescription: 'सायबर फसवणूक मदतीसाठी 1930 वर कॉल करा.',
  cyberFraudAssistance: 'सायबर फसवणूक मदत.',
  emergencyAdvice:
    'तुमचे पैसे गेले असल्यास, त्वरित तुमच्या बँकेशी संपर्क साधा आणि शक्य तितक्या लवकर घटनेची तक्रार करा.',
  beforeReporting: 'तक्रार करण्यापूर्वी',
  beforeReportingDescription:
    'महत्त्वाची माहिती तयार ठेवा. पुरावे सुरक्षित केल्याशिवाय संदेश किंवा पुरावे डिलीट करू नका.',
  step1: 'संशयास्पद संदेश, लिंक आणि प्रोफाइलचे स्क्रीनशॉट जतन करा.',
  step2: 'ट्रान्झॅक्शन आयडी, तारीख, रक्कम आणि पेमेंटची माहिती जतन करा.',
  step3: 'स्कॅमरचा फोन नंबर, ईमेल, युजरनेम किंवा वेबसाइट नोंदवा.',
  step4: 'पैसे गेले असल्यास त्वरित बँक/पेमेंट सेवेशी संपर्क साधा.',
  whatToKeep: 'कोणते पुरावे जतन करावेत?',
  whatToKeepDescription:
    'मूळ संदेश, URL, कॉलची माहिती, पेमेंट पावत्या, ट्रान्झॅक्शन आयडी आणि स्क्रीनशॉट जतन करा.',
  doNotDelete: 'तक्रारीसाठी आवश्यक माहिती जतन करण्यापूर्वी पुरावे डिलीट करू नका.',
  copyNumber: '1930 कॉपी करा',
  copied: 'कॉपी झाले',
  officialOnly: 'अधिकृत माध्यमांचा वापर करा',
  officialOnlyDescription:
    'CyberRaksha तक्रार नोंदवण्यासाठी तुमच्याकडून शुल्क मागणार नाही. तक्रारीसाठी अधिकृत पोर्टल किंवा हेल्पलाइन वापरा.',
};

const reportTranslations: Record<LanguageCode, ReportTranslation> = {
  en: englishReport,
  hi: hindiReport,
  mr: marathiReport,

  // The current project has the complete 22-language selector.
  // These languages safely fall back to the English reporting copy until
  // professionally verified translations are added.
  as: englishReport,
  bn: englishReport,
  brx: englishReport,
  doi: englishReport,
  gu: englishReport,
  kn: englishReport,
  ks: englishReport,
  kok: englishReport,
  mai: englishReport,
  ml: englishReport,
  mni: englishReport,
  ne: englishReport,
  or: englishReport,
  pa: englishReport,
  sa: englishReport,
  sat: englishReport,
  sd: englishReport,
  ta: englishReport,
  te: englishReport,
  ur: englishReport,
};

export default function ReportPage() {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const text = reportTranslations[language] ?? englishReport;

  const openGovernmentPortal = () => {
    window.open(
      'https://cybercrime.gov.in/',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const callNationalHelpline = () => {
    window.location.href = 'tel:1930';
  };

  const copyHelpline = async () => {
    try {
      await navigator.clipboard.writeText('1930');
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard access can be unavailable in some browsers.
      setCopied(false);
    }
  };

  const reportingSteps = [
    text.step1,
    text.step2,
    text.step3,
    text.step4,
  ];

  return (
    <AppShell>
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          {/* PAGE HEADER */}
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {text.title}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {text.subtitle}
            </p>
          </div>

          {/* GOVERNMENT PORTAL */}
          <button
            type="button"
            onClick={openGovernmentPortal}
            className="mt-8 flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#10161C] p-5 text-left transition hover:border-[#00E6D0]/30 hover:bg-[#121A21] focus:outline-none focus:ring-2 focus:ring-[#00E6D0]/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00E6D0]/10 text-[#00E6D0]">
              <ExternalLink size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-white">
                {text.governmentPortal}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {text.governmentPortalDescription}
              </div>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-slate-600"
            />
          </button>

          {/* NATIONAL HELPLINE */}
          <div className="mt-3 flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#10161C] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00E6D0]/10 text-[#00E6D0]">
              <Phone size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-white">
                {text.nationalHelpline}
              </div>

              <button
                type="button"
                onClick={callNationalHelpline}
                className="mt-1 block text-3xl font-extrabold text-[#00E6D0] transition hover:opacity-80 focus:outline-none"
                aria-label="Call cyber fraud helpline 1930"
              >
                1930
              </button>

              <div className="text-xs text-slate-500">
                {text.helplineDescription}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={callNationalHelpline}
                className="rounded-lg border border-[#00E6D0]/20 px-3 py-2 text-xs font-semibold text-[#00E6D0] transition hover:bg-[#00E6D0]/10"
              >
                {text.cyberFraudAssistance}
              </button>

              <button
                type="button"
                onClick={copyHelpline}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.04]"
                title={copied ? text.copied : text.copyNumber}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span className="hidden sm:inline">
                  {copied ? text.copied : text.copyNumber}
                </span>
              </button>
            </div>
          </div>

          {/* BEFORE REPORTING */}
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#10161C] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00E6D0]/10 text-[#00E6D0]">
                <ClipboardCheck size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-white">
                  {text.beforeReporting}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {text.beforeReportingDescription}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {reportingSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00E6D0]/10 text-xs font-bold text-[#00E6D0]">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-5 text-slate-400">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* EVIDENCE */}
          <div className="mt-4 rounded-2xl border border-white/[0.07] bg-[#10161C] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  {text.whatToKeep}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {text.whatToKeepDescription}
                </p>

                <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-400/10 bg-amber-400/[0.04] p-3">
                  <ShieldAlert
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-300"
                  />
                  <p className="text-xs leading-5 text-slate-400">
                    {text.doNotDelete}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* EMERGENCY ADVICE */}
          <div className="mt-4 flex gap-3 rounded-xl border border-red-500/10 bg-red-500/[0.04] p-5">
            <ShieldAlert
              size={22}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div className="text-sm leading-6 text-slate-400">
              {text.emergencyAdvice}
            </div>
          </div>

          {/* OFFICIAL CHANNEL NOTICE */}
          <div className="mt-4 flex gap-3 rounded-xl border border-[#00E6D0]/10 bg-[#00E6D0]/[0.04] p-5">
            <LockKeyhole
              size={21}
              className="mt-0.5 shrink-0 text-[#00E6D0]"
            />

            <div>
              <div className="font-semibold text-white">
                {text.officialOnly}
              </div>

              <div className="mt-1 text-sm leading-6 text-slate-500">
                {text.officialOnlyDescription}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
