'use client';

import * as React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RISK_META, RiskLevel } from '@/lib/types';
import { cn } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { LanguageCode } from '@/lib/languages';

type RiskCopy = {
  safetyCheck: string;
  riskScore: string;
  riskLevel: string;
  safe: string;
  caution: string;
  highRisk: string;
  critical: string;
  reminder: string;
  levels: {
    LOW: { title: string; description: string; action: string };
    MEDIUM: { title: string; description: string; action: string };
    HIGH: { title: string; description: string; action: string };
  };
};

const EN: RiskCopy = {
  safetyCheck: 'CyberRaksha Safety Check',
  riskScore: 'Risk Score',
  riskLevel: 'Risk level',
  safe: 'Safe',
  caution: 'Needs caution',
  highRisk: 'High risk',
  critical: 'Critical',
  reminder: 'CyberRaksha explains the warning so you can make a safer decision.',
  levels: {
    LOW: {
      title: 'Looks Safe',
      description:
        'We did not find major warning signs. Still, verify the sender before sharing money or personal information.',
      action: 'You can continue, but stay careful.',
    },
    MEDIUM: {
      title: 'This Looks Suspicious',
      description:
        'We found some warning signs. Pause and verify before clicking, paying, or sharing any information.',
      action: 'Stop and verify before you continue.',
    },
    HIGH: {
      title: 'This May Be a Scam',
      description:
        'We found strong warning signs that could indicate fraud, theft, or an attempt to steal your information or money.',
      action: 'Do not click, pay, or share OTP/PIN/passwords.',
    },
  },
};

const COPY: Partial<Record<LanguageCode, Partial<RiskCopy>>> = {
  hi: {
    safetyCheck: 'CyberRaksha सुरक्षा जाँच',
    riskScore: 'जोखिम स्कोर',
    riskLevel: 'जोखिम स्तर',
    safe: 'सुरक्षित',
    caution: 'सावधानी आवश्यक',
    highRisk: 'उच्च जोखिम',
    critical: 'गंभीर',
    reminder: 'CyberRaksha चेतावनी समझाता है ताकि आप सुरक्षित निर्णय ले सकें।',
    levels: {
      LOW: {
        title: 'सुरक्षित लगता है',
        description: 'हमें कोई बड़े चेतावनी संकेत नहीं मिले। फिर भी पैसे या निजी जानकारी साझा करने से पहले भेजने वाले की पुष्टि करें।',
        action: 'आप आगे बढ़ सकते हैं, लेकिन सावधान रहें।',
      },
      MEDIUM: {
        title: 'यह संदिग्ध लगता है',
        description: 'हमें कुछ चेतावनी संकेत मिले हैं। क्लिक करने, भुगतान करने या जानकारी साझा करने से पहले रुकें और पुष्टि करें।',
        action: 'आगे बढ़ने से पहले रुकें और पुष्टि करें।',
      },
      HIGH: {
        title: 'यह घोटाला हो सकता है',
        description: 'हमें धोखाधड़ी, चोरी या आपकी जानकारी या पैसे चुराने के प्रयास के मजबूत संकेत मिले हैं।',
        action: 'क्लिक, भुगतान या OTP/PIN/पासवर्ड साझा न करें।',
      },
    },
  },
  mr: {
    safetyCheck: 'CyberRaksha सुरक्षा तपासणी',
    riskScore: 'जोखीम स्कोअर',
    riskLevel: 'जोखीम पातळी',
    safe: 'सुरक्षित',
    caution: 'सावधगिरी आवश्यक',
    highRisk: 'उच्च जोखीम',
    critical: 'गंभीर',
    reminder: 'CyberRaksha इशारा समजावून सांगते, जेणेकरून तुम्ही अधिक सुरक्षित निर्णय घेऊ शकता.',
    levels: {
      LOW: {
        title: 'सुरक्षित वाटते',
        description: 'आम्हाला मोठे धोक्याचे संकेत आढळले नाहीत. तरीही पैसे किंवा वैयक्तिक माहिती देण्यापूर्वी पाठवणाऱ्याची खात्री करा.',
        action: 'तुम्ही पुढे जाऊ शकता, पण सावध रहा.',
      },
      MEDIUM: {
        title: 'हे संशयास्पद दिसते',
        description: 'आम्हाला काही धोक्याचे संकेत आढळले. क्लिक, पेमेंट किंवा माहिती शेअर करण्यापूर्वी थांबा आणि खात्री करा.',
        action: 'पुढे जाण्यापूर्वी थांबा आणि खात्री करा.',
      },
      HIGH: {
        title: 'हा घोटाळा असू शकतो',
        description: 'फसवणूक, चोरी किंवा तुमची माहिती अथवा पैसे चोरण्याच्या प्रयत्नाचे ठोस संकेत आढळले आहेत.',
        action: 'क्लिक करू नका, पैसे देऊ नका आणि OTP/PIN/पासवर्ड शेअर करू नका.',
      },
    },
  },
  bn: {
    safetyCheck: 'CyberRaksha নিরাপত্তা পরীক্ষা',
    riskScore: 'ঝুঁকির স্কোর',
    riskLevel: 'ঝুঁকির স্তর',
    safe: 'নিরাপদ',
    caution: 'সতর্কতা প্রয়োজন',
    highRisk: 'উচ্চ ঝুঁকি',
    critical: 'গুরুতর',
    reminder: 'CyberRaksha সতর্কতাটি বুঝিয়ে দেয়, যাতে আপনি আরও নিরাপদ সিদ্ধান্ত নিতে পারেন।',
  },
  gu: {
    safetyCheck: 'CyberRaksha સુરક્ષા તપાસ',
    riskScore: 'જોખમ સ્કોર',
    riskLevel: 'જોખમ સ્તર',
    safe: 'સુરક્ષિત',
    caution: 'સાવચેતી જરૂરી',
    highRisk: 'ઉચ્ચ જોખમ',
    critical: 'ગંભીર',
    reminder: 'CyberRaksha ચેતવણી સમજાવે છે જેથી તમે વધુ સુરક્ષિત નિર્ણય લઈ શકો.',
  },
  ta: {
    safetyCheck: 'CyberRaksha பாதுகாப்பு சோதனை',
    riskScore: 'ஆபத்து மதிப்பெண்',
    riskLevel: 'ஆபத்து நிலை',
    safe: 'பாதுகாப்பானது',
    caution: 'எச்சரிக்கை தேவை',
    highRisk: 'அதிக ஆபத்து',
    critical: 'மிகவும் ஆபத்தானது',
    reminder: 'நீங்கள் பாதுகாப்பான முடிவை எடுக்க CyberRaksha எச்சரிக்கையை விளக்குகிறது.',
  },
  te: {
    safetyCheck: 'CyberRaksha భద్రతా తనిఖీ',
    riskScore: 'ప్రమాద స్కోర్',
    riskLevel: 'ప్రమాద స్థాయి',
    safe: 'సురక్షితం',
    caution: 'జాగ్రత్త అవసరం',
    highRisk: 'అధిక ప్రమాదం',
    critical: 'తీవ్రమైనది',
    reminder: 'మీరు సురక్షితమైన నిర్ణయం తీసుకునేందుకు CyberRaksha హెచ్చరికను వివరిస్తుంది.',
  },
  kn: {
    safetyCheck: 'CyberRaksha ಸುರಕ್ಷತಾ ಪರಿಶೀಲನೆ',
    riskScore: 'ಅಪಾಯದ ಸ್ಕೋರ್',
    riskLevel: 'ಅಪಾಯದ ಮಟ್ಟ',
    safe: 'ಸುರಕ್ಷಿತ',
    caution: 'ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ',
    highRisk: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    critical: 'ಗಂಭೀರ',
    reminder: 'ನೀವು ಸುರಕ್ಷಿತ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳಲು CyberRaksha ಎಚ್ಚರಿಕೆಯನ್ನು ವಿವರಿಸುತ್ತದೆ.',
  },
  ml: {
    safetyCheck: 'CyberRaksha സുരക്ഷാ പരിശോധന',
    riskScore: 'അപകട സ്കോർ',
    riskLevel: 'അപകട നില',
    safe: 'സുരക്ഷിതം',
    caution: 'ജാഗ്രത ആവശ്യമാണ്',
    highRisk: 'ഉയർന്ന അപകടസാധ്യത',
    critical: 'ഗുരുതരം',
    reminder: 'നിങ്ങൾക്ക് സുരക്ഷിതമായ തീരുമാനം എടുക്കാൻ CyberRaksha മുന്നറിയിപ്പ് വിശദീകരിക്കുന്നു.',
  },
  pa: {
    safetyCheck: 'CyberRaksha ਸੁਰੱਖਿਆ ਜਾਂਚ',
    riskScore: 'ਖਤਰੇ ਦਾ ਸਕੋਰ',
    riskLevel: 'ਖਤਰੇ ਦਾ ਪੱਧਰ',
    safe: 'ਸੁਰੱਖਿਅਤ',
    caution: 'ਸਾਵਧਾਨੀ ਲੋੜੀਂਦੀ',
    highRisk: 'ਉੱਚ ਖਤਰਾ',
    critical: 'ਗੰਭੀਰ',
    reminder: 'CyberRaksha ਚੇਤਾਵਨੀ ਸਮਝਾਉਂਦਾ ਹੈ ਤਾਂ ਜੋ ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਫੈਸਲਾ ਲੈ ਸਕੋ।',
  },
  or: {
    safetyCheck: 'CyberRaksha ସୁରକ୍ଷା ଯାଞ୍ଚ',
    riskScore: 'ବିପଦ ସ୍କୋର',
    riskLevel: 'ବିପଦ ସ୍ତର',
    safe: 'ସୁରକ୍ଷିତ',
    caution: 'ସାବଧାନତା ଆବଶ୍ୟକ',
    highRisk: 'ଉଚ୍ଚ ବିପଦ',
    critical: 'ଗୁରୁତର',
    reminder: 'ଆପଣ ଅଧିକ ସୁରକ୍ଷିତ ନିଷ୍ପତ୍ତି ନେବା ପାଇଁ CyberRaksha ସତର୍କତା ବୁଝାଏ।',
  },
  as: {
    safetyCheck: 'CyberRaksha সুৰক্ষা পৰীক্ষা',
    riskScore: 'বিপদৰ স্ক’ৰ',
    riskLevel: 'বিপদৰ স্তৰ',
    safe: 'নিৰাপদ',
    caution: 'সাৱধানতা প্ৰয়োজন',
    highRisk: 'উচ্চ বিপদ',
    critical: 'গুৰুতৰ',
    reminder: 'CyberRaksha-এ সতৰ্কবাণী বুজাই দিয়ে যাতে আপুনি নিৰাপদ সিদ্ধান্ত ল’ব পাৰে।',
  },
  ne: {
    safetyCheck: 'CyberRaksha सुरक्षा जाँच',
    riskScore: 'जोखिम स्कोर',
    riskLevel: 'जोखिम स्तर',
    safe: 'सुरक्षित',
    caution: 'सावधानी आवश्यक',
    highRisk: 'उच्च जोखिम',
    critical: 'गम्भीर',
    reminder: 'तपाईंलाई सुरक्षित निर्णय लिन CyberRaksha ले चेतावनी बुझाउँछ।',
  },
  kok: {
    safetyCheck: 'CyberRaksha सुरक्षा तपासणी',
    riskScore: 'धोको स्कोर',
    riskLevel: 'धोक्याची पातळी',
    safe: 'सुरक्षित',
    caution: 'सावधगिरी गरजेची',
    highRisk: 'चड धोको',
    critical: 'गंभीर',
    reminder: 'CyberRaksha इशारो समजायतलो, जणे करून तुमी सुरक्षित निर्णय घेवंक शकतात.',
  },
  mai: {
    safetyCheck: 'CyberRaksha सुरक्षा जाँच',
    riskScore: 'जोखिम स्कोर',
    riskLevel: 'जोखिम स्तर',
    safe: 'सुरक्षित',
    caution: 'सावधानी आवश्यक',
    highRisk: 'उच्च जोखिम',
    critical: 'गंभीर',
    reminder: 'CyberRaksha चेतावनी बुझबैत अछि जाहि सँ अहाँ सुरक्षित निर्णय ल सकी।',
  },
  doi: {
    safetyCheck: 'CyberRaksha सुरक्षा जांच',
    riskScore: 'जोखिम स्कोर',
    riskLevel: 'जोखिम स्तर',
    safe: 'सुरक्षित',
    caution: 'सावधानी जरूरी',
    highRisk: 'उच्च जोखिम',
    critical: 'गंभीर',
    reminder: 'CyberRaksha चेतावनी समझांदा ऐ, तां जे तुस सुरक्षित फैसला लै सको।',
  },
  brx: {
    safetyCheck: 'CyberRaksha रैखाथि नायनो',
    riskScore: 'खैफोद स्कोर',
    riskLevel: 'खैफोद थाखो',
    safe: 'रैखाथि',
    caution: 'सावधानी नांगौ',
    highRisk: 'बांद्रा खैफोद',
    critical: 'गोरोब',
    reminder: 'CyberRaksha गोहोमखौ बुंनो, जेरै नों सुरक्षित निर्णय लानो हागोन।',
  },
  mni: {
    safetyCheck: 'CyberRaksha ꯁꯦꯐꯇꯤ ꯆꯦꯛ',
    riskScore: 'ꯔꯤꯁ꯭ꯛ ꯁ꯭ꯀꯣꯔ',
    riskLevel: 'ꯔꯤꯁ꯭ꯛ ꯂꯦꯕꯦꯜ',
    safe: 'ꯁꯦꯐ',
    caution: 'ꯆꯤꯡꯗꯥ ꯉꯥꯏꯅꯕꯥ',
    highRisk: 'ꯑꯇꯤꯀꯥ ꯔꯤꯁ꯭ꯛ',
    critical: 'ꯆꯥꯎꯕꯥ',
    reminder: 'CyberRaksha ꯑꯗꯨꯕꯥ ꯍꯥꯏꯔꯤꯕꯥ ꯂꯣꯏꯁꯤꯡ ꯈꯪꯍꯟꯗꯨꯅꯥ ꯁꯦꯐ ꯑꯣꯏꯅꯥ ꯄꯥꯡꯊꯣꯛꯄꯥ ꯉꯝꯃꯤ꯫',
  },
  ks: {
    safetyCheck: 'CyberRaksha حفاظتی جانچ',
    riskScore: 'خطرے کا اسکور',
    riskLevel: 'خطرے کی سطح',
    safe: 'محفوظ',
    caution: 'احتیاط ضروری',
    highRisk: 'زیادہ خطرہ',
    critical: 'سنگین',
    reminder: 'CyberRaksha انتباہ سمجھاتا ہے تاکہ آپ زیادہ محفوظ فیصلہ لے سکیں۔',
  },
  sd: {
    safetyCheck: 'CyberRaksha حفاظتي جاچ',
    riskScore: 'خطري جو اسڪور',
    riskLevel: 'خطري جي سطح',
    safe: 'محفوظ',
    caution: 'احتياط ضروري',
    highRisk: 'وڏو خطرو',
    critical: 'سنگين',
    reminder: 'CyberRaksha خبرداري سمجهائي ٿو ته جيئن توهان محفوظ فيصلو ڪري سگهو.',
  },
  ur: {
    safetyCheck: 'CyberRaksha حفاظتی جانچ',
    riskScore: 'خطرے کا اسکور',
    riskLevel: 'خطرے کی سطح',
    safe: 'محفوظ',
    caution: 'احتیاط ضروری',
    highRisk: 'زیادہ خطرہ',
    critical: 'سنگین',
    reminder: 'CyberRaksha انتباہ سمجھاتا ہے تاکہ آپ زیادہ محفوظ فیصلہ کر سکیں۔',
  },
  sa: {
    safetyCheck: 'CyberRaksha सुरक्षा परीक्षणम्',
    riskScore: 'जोखिमाङ्कः',
    riskLevel: 'जोखिमस्तरः',
    safe: 'सुरक्षितम्',
    caution: 'सावधानता आवश्यकी',
    highRisk: 'उच्चजोखिमम्',
    critical: 'गम्भीरम्',
    reminder: 'सुरक्षितं निर्णयं कर्तुं CyberRaksha चेतावनीम् अवगमयति।',
  },
  sat: {
    safetyCheck: 'CyberRaksha ᱥᱩᱨᱟᱠᱷᱟ ᱯᱟᱹᱨᱥᱤ',
    riskScore: 'ᱡᱚᱠᱷᱚᱢ ᱥᱠᱳᱨ',
    riskLevel: 'ᱡᱚᱠᱷᱚᱢ ᱛᱷᱟᱠ',
    safe: 'ᱥᱩᱨᱟᱠᱷᱤᱛ',
    caution: 'ᱥᱟᱵᱷᱟᱱ ᱞᱟᱹᱜᱤᱫ',
    highRisk: 'ᱢᱟᱨᱟᱝ ᱡᱚᱠᱷᱚᱢ',
    critical: 'ᱜᱟᱹᱱᱟ',
    reminder: 'CyberRaksha ᱦᱚᱥᱤᱭᱟᱹᱨ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ ᱡᱟᱦᱟᱸ ᱟᱢ ᱥᱩᱨᱟᱠᱷᱤᱛ ᱱᱤᱨᱱᱟᱹᱭ ᱦᱚᱪᱚ ᱢᱮᱭᱟ᱾',
  },
};

function mergeCopy(language: LanguageCode): RiskCopy {
  const localized = COPY[language];
  if (!localized) return EN;

  return {
    ...EN,
    ...localized,
    levels: {
      ...EN.levels,
      ...(localized.levels ?? {}),
    },
  };
}

export function RiskMeter({
  level,
  score,
}: {
  level: RiskLevel;
  score: number;
}) {
  const { language } = useLanguage();
  const copy = mergeCopy(language);
  const meta = RISK_META[level];

  const Icon =
    level === 'LOW'
      ? ShieldCheck
      : level === 'MEDIUM'
        ? AlertTriangle
        : AlertOctagon;

  const variant =
    level === 'LOW'
      ? 'low'
      : level === 'MEDIUM'
        ? 'medium'
        : 'high';

  const current = copy.levels[level];

  const ActionIcon =
    level === 'LOW'
      ? CheckCircle2
      : level === 'MEDIUM'
        ? AlertTriangle
        : AlertOctagon;

  return (
    <section
      className={cn(
        'rounded-2xl border p-5 md:p-6 shadow-[0_10px_30px_rgba(40,35,20,.05)]',
        level === 'LOW'
          ? 'bg-[#f3f8ee] border-[#cbdcbf]'
          : level === 'MEDIUM'
            ? 'bg-[#fff9e9] border-[#ead7a4]'
            : 'bg-[#fff4f1] border-[#e5bdb6]'
      )}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl border flex items-center justify-center shrink-0',
            level === 'LOW'
              ? 'bg-[#e8f2df] border-[#c8dbb8] text-[#55733d]'
              : level === 'MEDIUM'
                ? 'bg-[#fff1cc] border-[#e6ce8d] text-[#9a6908]'
                : 'bg-[#ffe8e3] border-[#e4b4ab] text-[#b33d32]'
          )}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.16em] font-black text-[#7a7b72]">
            {copy.safetyCheck}
          </div>

          <h2
            className={cn(
              'mt-1 text-xl md:text-2xl font-black tracking-tight',
              level === 'LOW'
                ? 'text-[#55733d]'
                : level === 'MEDIUM'
                  ? 'text-[#956707]'
                  : 'text-[#b33d32]'
            )}
          >
            {current.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#4f5653] max-w-2xl">
            {current.description}
          </p>

          <div
            className={cn(
              'mt-4 flex items-start gap-2 text-sm font-bold',
              level === 'LOW'
                ? 'text-[#55733d]'
                : level === 'MEDIUM'
                  ? 'text-[#956707]'
                  : 'text-[#a7382e]'
            )}
          >
            <ActionIcon size={17} className="mt-0.5 shrink-0" />
            <span>{current.action}</span>
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-[#172029] px-4 py-3 text-center min-w-[105px] shadow-sm">
          <div className="text-[9px] uppercase tracking-[0.15em] text-[#d1d4d2]">
            {copy.riskScore}
          </div>

          <div
            className={cn(
              'mt-0.5 font-mono text-2xl font-black tabular-nums',
              level === 'HIGH'
                ? 'text-[#e8a49b]'
                : level === 'MEDIUM'
                  ? 'text-[#F0C85A]'
                  : 'text-[#a9ca8e]'
            )}
          >
            {score}
            <span className="text-xs font-normal text-[#c8ccca]">
              /100
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#727873]">
            {copy.riskLevel}
          </span>

          <span
            className={cn(
              'text-[10px] uppercase tracking-wider font-black',
              level === 'LOW'
                ? 'text-[#55733d]'
                : level === 'MEDIUM'
                  ? 'text-[#956707]'
                  : 'text-[#b33d32]'
            )}
          >
            {meta.label}
          </span>
        </div>

        <Progress
          value={Math.max(0, Math.min(100, score))}
          variant={variant}
          showValue={false}
        />

        <div className="mt-2 flex justify-between text-[9px] text-[#858a86] font-medium">
          <span>{copy.safe}</span>
          <span>{copy.caution}</span>
          <span>{copy.highRisk}</span>
          <span>{copy.critical}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-black/5 flex items-center gap-2 text-[11px] text-[#69706c]">
        <ShieldCheck size={14} className="text-[#58713f] shrink-0" />
        <span>{copy.reminder}</span>
      </div>
    </section>
  );
}

