'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  CircleX,
  DatabaseZap,
  FileText,
  Flag,
  Lightbulb,
  Link2,
  MessageCircle,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShieldX,
  TriangleAlert,
  UserRound,
} from 'lucide-react';

import { RiskMeter } from '@/components/analysis/RiskMeter';
import { ScamDNAChart } from '@/components/analysis/ScamDNAChart';
import { RedFlagsList } from '@/components/analysis/RedFlagsList';
import { EmergencyAlert } from '@/components/analysis/EmergencyAlert';
import { SafetyLock } from '@/components/analysis/SafetyLock';
import { GuidancePanel } from '@/components/analysis/GuidancePanel';
import { ReportDraft } from '@/components/report/ReportDraft';
import type { ScanResult } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { LanguageCode } from '@/lib/languages';

interface ResultsPanelProps {
  result: ScanResult | null;
  loading: boolean;
  error: string | null;
}

type ResultCopy = {
  analyzing: string;
  analysisError: string;
  scannerTitle: string;
  scannerDescription: string;
  safeTitle: string;
  safeMessage: string;
  cautionTitle: string;
  cautionMessage: string;
  unsafeTitle: string;
  unsafeMessage: string;
  safeChecks: string[];
  redFlags: string;
  whatToDo: string;
  safeAction: string;
  cautionAction: string;
  unsafeAction: string;
  verifySender: string;
  dontClick: string;
  askSomeone: string;
  checkAnother: string;
  seeDetails: string;
  hideDetails: string;
  shareResult: string;
  reportScam: string;
  databaseMatch: string;
  liveAI: string;
  localFallback: string;
  decodedQr: string;
  qrExtracted: string;
  upiPayment: string;
  webDestination: string;
  textPayload: string;
  crucialAlert: string;
  upiWarning: string;
  helpTitle: string;
  helpSubtitle: string;
  helpline: string;
  safeQuote: string;
  cautionQuote: string;
  unsafeQuote: string;
  score: string;
  scamFingerprint: string;
  scamClassification: string;
  variantDetection: string;
  screenshotAnalysis: string;
  confidence: string;
  primaryTactic: string;
  scamFamily: string;
  similarity: string;
  extractedText: string;
  detectedUrls: string;
  analysisMethod: string;
  noScreenshotData: string;
  unsafeNoClick: string;
  unsafeNoShare: string;
  unsafeNoPayment: string;
  unsafeReport: string;
  shared: string;
  resultCopied: string;
  helplineAvailability: string;
};

const en: ResultCopy = {
  analyzing: 'Analyzing your content…',
  analysisError: 'Analysis Error',
  scannerTitle: 'CyberRaksha AI Threat Scanner',
  scannerDescription:
    'Check suspicious messages, links, QR codes and screenshots before you click, share or pay.',
  safeTitle: 'Looks Safe!',
  safeMessage: 'We didn’t find anything suspicious in this content.',
  cautionTitle: 'Be Careful',
  cautionMessage: 'Something about this looks unusual. Please check before you proceed.',
  unsafeTitle: 'Not Safe!',
  unsafeMessage: 'This looks like a scam. Do not take any action.',
  safeChecks: [
    'No harmful links found',
    'Sender looks safe',
    'No suspicious patterns detected',
  ],
  redFlags: 'Red flags detected',
  whatToDo: 'What should you do?',
  safeAction: 'You can proceed.',
  cautionAction: 'Still, always stay alert!',
  unsafeAction: 'Do not click, share personal details or make a payment.',
  verifySender: 'Verify the sender',
  dontClick: 'Avoid clicking the link right away',
  askSomeone: 'If unsure, ask someone you trust',
  checkAnother: 'Check Another',
  seeDetails: 'See Details',
  hideDetails: 'Hide Details',
  shareResult: 'Share Result',
  reportScam: 'Report Scam',
  databaseMatch: 'Database Match',
  liveAI: 'IBM Granite Live',
  localFallback: 'Local Fallback',
  decodedQr: 'Decoded QR Code Payload',
  qrExtracted: 'Data successfully extracted from image scan',
  upiPayment: '💳 UPI Payment Request',
  webDestination: '🔗 Web Destination Link',
  textPayload: '📝 Text Payload',
  crucialAlert: 'Crucial Safety Alert:',
  upiWarning:
    'This QR code directly initiates a UPI fund transfer. Scanning it and entering your UPI PIN can debit money from your bank account.',
  helpTitle: 'Need help?',
  helpSubtitle: '24×7 Cyber Helpline',
  helpline: '1930',
  safeQuote: '“Stay alert and keep yourself and your loved ones safe!”',
  cautionQuote: '“When in doubt, check it out!”',
  unsafeQuote: '“Don’t let scams win. Stay safe, stay aware!”',
  score: 'Risk score',
  scamFingerprint: 'Scam Fingerprint',
  scamClassification: 'Scam Classification',
  variantDetection: 'Variant Detection',
  screenshotAnalysis: 'Screenshot Analysis',
  confidence: 'Confidence',
  primaryTactic: 'Primary tactic',
  scamFamily: 'Scam family',
  similarity: 'Similarity',
  extractedText: 'Extracted text',
  detectedUrls: 'Detected URLs',
  analysisMethod: 'Analysis method',
  noScreenshotData: 'No readable text was detected in this screenshot.',
  unsafeNoClick: 'Do not click the link',
  unsafeNoShare: 'Do not share OTP or personal details',
  unsafeNoPayment: 'Do not make any payment',
  unsafeReport: 'Report it to help keep others safe',
  shared: 'Shared',
  resultCopied: 'Result copied',
  helplineAvailability: '(24×7 Cyber Helpline)',
};

const make = (overrides: Partial<ResultCopy>): ResultCopy => ({ ...en, ...overrides });

const translations: Record<LanguageCode, ResultCopy> = {
  en,
  hi: make({
    analyzing: 'आपकी सामग्री का विश्लेषण किया जा रहा है…',
    analysisError: 'विश्लेषण त्रुटि',
    scannerTitle: 'CyberRaksha AI खतरा स्कैनर',
    scannerDescription: 'क्लिक, शेयर या भुगतान करने से पहले संदिग्ध संदेश, लिंक, QR कोड और स्क्रीनशॉट जाँचें।',
    safeTitle: 'सुरक्षित लगता है!',
    safeMessage: 'हमें इस सामग्री में कुछ संदिग्ध नहीं मिला।',
    cautionTitle: 'सावधान रहें',
    cautionMessage: 'इसमें कुछ असामान्य लगता है। आगे बढ़ने से पहले जाँच करें।',
    unsafeTitle: 'सुरक्षित नहीं!',
    unsafeMessage: 'यह धोखाधड़ी जैसा लगता है। कोई कार्रवाई न करें।',
    safeChecks: ['कोई हानिकारक लिंक नहीं मिला', 'प्रेषक सुरक्षित लगता है', 'कोई संदिग्ध पैटर्न नहीं मिला'],
    redFlags: 'खतरे के संकेत मिले',
    whatToDo: 'आपको क्या करना चाहिए?',
    safeAction: 'आप आगे बढ़ सकते हैं।',
    cautionAction: 'फिर भी हमेशा सतर्क रहें!',
    unsafeAction: 'लिंक न खोलें, निजी जानकारी साझा न करें और भुगतान न करें।',
    verifySender: 'प्रेषक की पुष्टि करें',
    dontClick: 'तुरंत लिंक पर क्लिक करने से बचें',
    askSomeone: 'संदेह हो तो किसी भरोसेमंद व्यक्ति से पूछें',
    checkAnother: 'एक और जाँच करें',
    seeDetails: 'विवरण देखें',
    hideDetails: 'विवरण छिपाएँ',
    shareResult: 'परिणाम साझा करें',
    reportScam: 'घोटाले की रिपोर्ट करें',
    helpTitle: 'मदद चाहिए?',
    helpSubtitle: '24×7 साइबर हेल्पलाइन',
    safeQuote: '“सतर्क रहें और खुद को तथा अपने प्रियजनों को सुरक्षित रखें!”',
    cautionQuote: '“संदेह हो तो जाँच कर लें!”',
    unsafeQuote: '“घोटालों को जीतने न दें। सुरक्षित और जागरूक रहें!”',
    score: 'जोखिम स्कोर', unsafeNoClick: 'लिंक पर क्लिक न करें', unsafeNoShare: 'OTP या निजी जानकारी साझा न करें', unsafeNoPayment: 'कोई भुगतान न करें', unsafeReport: 'दूसरों को सुरक्षित रखने में मदद के लिए रिपोर्ट करें', shared: 'साझा किया गया', resultCopied: 'परिणाम कॉपी किया गया', helplineAvailability: '(24×7 साइबर हेल्पलाइन)'
  }),
  mr: make({
    analyzing: 'तुमच्या सामग्रीचे विश्लेषण केले जात आहे…',
    analysisError: 'विश्लेषण त्रुटी',
    scannerTitle: 'CyberRaksha AI धोका स्कॅनर',
    scannerDescription: 'क्लिक, शेअर किंवा पेमेंट करण्यापूर्वी संशयास्पद संदेश, लिंक, QR कोड आणि स्क्रीनशॉट तपासा.',
    safeTitle: 'सुरक्षित दिसते!',
    safeMessage: 'या सामग्रीमध्ये आम्हाला काहीही संशयास्पद आढळले नाही.',
    cautionTitle: 'सावध रहा',
    cautionMessage: 'यामध्ये काहीतरी असामान्य दिसते. पुढे जाण्यापूर्वी तपासा.',
    unsafeTitle: 'सुरक्षित नाही!',
    unsafeMessage: 'हे स्कॅमसारखे दिसते. कोणतीही कृती करू नका.',
    safeChecks: ['हानिकारक लिंक आढळल्या नाहीत', 'पाठवणारा सुरक्षित दिसतो', 'संशयास्पद पॅटर्न आढळले नाहीत'],
    redFlags: 'धोक्याची चिन्हे आढळली',
    whatToDo: 'तुम्ही काय करावे?',
    safeAction: 'तुम्ही पुढे जाऊ शकता.',
    cautionAction: 'तरीही नेहमी सतर्क रहा!',
    unsafeAction: 'लिंकवर क्लिक करू नका, वैयक्तिक माहिती शेअर करू नका आणि पेमेंट करू नका.',
    verifySender: 'पाठवणाऱ्याची खात्री करा',
    dontClick: 'लगेच लिंकवर क्लिक करणे टाळा',
    askSomeone: 'शंका असल्यास विश्वासू व्यक्तीला विचारा',
    checkAnother: 'आणखी एक तपासा',
    seeDetails: 'तपशील पहा',
    hideDetails: 'तपशील लपवा',
    shareResult: 'निकाल शेअर करा',
    reportScam: 'स्कॅमची तक्रार करा',
    helpTitle: 'मदत हवी आहे?',
    helpSubtitle: '24×7 सायबर हेल्पलाइन',
    safeQuote: '“सतर्क राहा आणि स्वतःला व आपल्या प्रियजनांना सुरक्षित ठेवा!”',
    cautionQuote: '“शंका असेल तर तपासून घ्या!”',
    unsafeQuote: '“स्कॅमला जिंकू देऊ नका. सुरक्षित आणि जागरूक रहा!”',
    score: 'जोखीम स्कोअर', unsafeNoClick: 'लिंकवर क्लिक करू नका', unsafeNoShare: 'OTP किंवा वैयक्तिक माहिती शेअर करू नका', unsafeNoPayment: 'कोणतेही पेमेंट करू नका', unsafeReport: 'इतरांना सुरक्षित ठेवण्यासाठी याची तक्रार करा', shared: 'शेअर केले', resultCopied: 'निकाल कॉपी केला', helplineAvailability: '(24×7 सायबर हेल्पलाइन)'
  }),
  bn: make({ safeTitle: 'নিরাপদ মনে হচ্ছে!', safeMessage: 'এই কনটেন্টে সন্দেহজনক কিছু পাওয়া যায়নি।', cautionTitle: 'সতর্ক থাকুন', unsafeTitle: 'নিরাপদ নয়!', checkAnother: 'আরেকটি পরীক্ষা করুন', seeDetails: 'বিস্তারিত দেখুন', shareResult: 'ফলাফল শেয়ার করুন', reportScam: 'স্ক্যামের রিপোর্ট করুন', whatToDo: 'আপনার কী করা উচিত?' }),
  gu: make({ safeTitle: 'સુરક્ષિત લાગે છે!', safeMessage: 'આ સામગ્રીમાં અમને કંઈ શંકાસ્પદ મળ્યું નથી.', cautionTitle: 'સાવચેત રહો', unsafeTitle: 'સુરક્ષિત નથી!', checkAnother: 'બીજું તપાસો', seeDetails: 'વિગતો જુઓ', shareResult: 'પરિણામ શેર કરો', reportScam: 'સ્કેમની જાણ કરો', whatToDo: 'તમારે શું કરવું જોઈએ?' }),
  ta: make({ safeTitle: 'பாதுகாப்பாகத் தெரிகிறது!', safeMessage: 'இந்த உள்ளடக்கத்தில் சந்தேகத்திற்குரியது எதுவும் இல்லை.', cautionTitle: 'கவனமாக இருங்கள்', unsafeTitle: 'பாதுகாப்பானது அல்ல!', checkAnother: 'மற்றொன்றைச் சரிபார்க்கவும்', seeDetails: 'விவரங்களைப் பார்க்கவும்', shareResult: 'முடிவைப் பகிரவும்', reportScam: 'மோசடியைப் புகாரளிக்கவும்', whatToDo: 'நீங்கள் என்ன செய்ய வேண்டும்?' }),
  te: make({ safeTitle: 'సురక్షితంగా కనిపిస్తోంది!', safeMessage: 'ఈ కంటెంట్‌లో అనుమానాస్పదంగా ఏమీ కనిపించలేదు.', cautionTitle: 'జాగ్రత్తగా ఉండండి', unsafeTitle: 'సురక్షితం కాదు!', checkAnother: 'మరొకటి తనిఖీ చేయండి', seeDetails: 'వివరాలు చూడండి', shareResult: 'ఫలితాన్ని షేర్ చేయండి', reportScam: 'స్కామ్‌ను నివేదించండి', whatToDo: 'మీరు ఏమి చేయాలి?' }),
  kn: make({ safeTitle: 'ಸುರಕ್ಷಿತವಾಗಿ ಕಾಣುತ್ತದೆ!', safeMessage: 'ಈ ವಿಷಯದಲ್ಲಿ ಅನುಮಾನಾಸ್ಪದವಾದದ್ದು ಕಂಡುಬಂದಿಲ್ಲ.', cautionTitle: 'ಎಚ್ಚರಿಕೆಯಿಂದಿರಿ', unsafeTitle: 'ಸುರಕ್ಷಿತವಲ್ಲ!', checkAnother: 'ಮತ್ತೊಂದನ್ನು ಪರಿಶೀಲಿಸಿ', seeDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ', shareResult: 'ಫಲಿತಾಂಶ ಹಂಚಿಕೊಳ್ಳಿ', reportScam: 'ವಂಚನೆಯನ್ನು ವರದಿ ಮಾಡಿ', whatToDo: 'ನೀವು ಏನು ಮಾಡಬೇಕು?' }),
  ml: make({ safeTitle: 'സുരക്ഷിതമാണെന്ന് തോന്നുന്നു!', safeMessage: 'ഈ ഉള്ളടക്കത്തിൽ സംശയാസ്പദമായ ഒന്നും കണ്ടെത്തിയില്ല.', cautionTitle: 'ജാഗ്രത പാലിക്കുക', unsafeTitle: 'സുരക്ഷിതമല്ല!', checkAnother: 'മറ്റൊന്ന് പരിശോധിക്കുക', seeDetails: 'വിശദാംശങ്ങൾ കാണുക', shareResult: 'ഫലം പങ്കിടുക', reportScam: 'തട്ടിപ്പ് റിപ്പോർട്ട് ചെയ്യുക', whatToDo: 'നിങ്ങൾ എന്ത് ചെയ്യണം?' }),
  or: make({ safeTitle: 'ସୁରକ୍ଷିତ ଲାଗୁଛି!', safeMessage: 'ଏହି ବିଷୟବସ୍ତୁରେ ସନ୍ଦେହଜନକ କିଛି ମିଳିଲା ନାହିଁ।', cautionTitle: 'ସତର୍କ ରୁହନ୍ତୁ', unsafeTitle: 'ସୁରକ୍ଷିତ ନୁହେଁ!', checkAnother: 'ଆଉ ଏକ ଯାଞ୍ଚ କରନ୍ତୁ', seeDetails: 'ବିବରଣୀ ଦେଖନ୍ତୁ', shareResult: 'ଫଳାଫଳ ସେୟାର କରନ୍ତୁ', reportScam: 'ଠକେଇ ରିପୋର୍ଟ କରନ୍ତୁ', whatToDo: 'ଆପଣ କଣ କରିବେ?' }),
  pa: make({ safeTitle: 'ਸੁਰੱਖਿਅਤ ਲੱਗਦਾ ਹੈ!', safeMessage: 'ਇਸ ਸਮੱਗਰੀ ਵਿੱਚ ਕੁਝ ਸ਼ੱਕੀ ਨਹੀਂ ਮਿਲਿਆ।', cautionTitle: 'ਸਾਵਧਾਨ ਰਹੋ', unsafeTitle: 'ਸੁਰੱਖਿਅਤ ਨਹੀਂ!', checkAnother: 'ਹੋਰ ਜਾਂਚੋ', seeDetails: 'ਵੇਰਵੇ ਵੇਖੋ', shareResult: 'ਨਤੀਜਾ ਸਾਂਝਾ ਕਰੋ', reportScam: 'ਘਪਲੇ ਦੀ ਰਿਪੋਰਟ ਕਰੋ', whatToDo: 'ਤੁਹਾਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?' }),
  ne: make({ safeTitle: 'सुरक्षित देखिन्छ!', safeMessage: 'यस सामग्रीमा शंकास्पद कुरा भेटिएन।', cautionTitle: 'सावधान रहनुहोस्', unsafeTitle: 'सुरक्षित छैन!', checkAnother: 'अर्को जाँच गर्नुहोस्', seeDetails: 'विवरण हेर्नुहोस्', shareResult: 'नतिजा साझा गर्नुहोस्', reportScam: 'ठगी रिपोर्ट गर्नुहोस्', whatToDo: 'तपाईंले के गर्नुपर्छ?' }),
  as: make({ safeTitle: 'নিৰাপদ যেন লাগিছে!', safeMessage: 'এই বিষয়বস্তুত সন্দেহজনক একো পোৱা নগ’ল।', cautionTitle: 'সাৱধান হওক', unsafeTitle: 'নিৰাপদ নহয়!', checkAnother: 'আন এটা পৰীক্ষা কৰক', seeDetails: 'বিৱৰণ চাওক', shareResult: 'ফলাফল শ্বেয়াৰ কৰক', reportScam: 'প্ৰৱঞ্চনা ৰিপ’ৰ্ট কৰক', whatToDo: 'আপুনি কি কৰিব লাগে?' }),
  kok: make({ safeTitle: 'सुरक्षित दिसता!', safeMessage: 'ह्या मजकुरांत आमी संशयास्पद कितेंच मेळोवप ना.', cautionTitle: 'जापसाळो आसात', unsafeTitle: 'सुरक्षित ना!', checkAnother: 'आनीक एक तपासात', seeDetails: 'तपशील पळयात', shareResult: 'निकाल वाटात', reportScam: 'फ्रॉड कळयात', whatToDo: 'तुमी कितें करपाक जाय?' }),
  mai: make({ safeTitle: 'सुरक्षित बुझाइत अछि!', safeMessage: 'एहि सामग्री मे संदिग्ध किछु नहि भेटल।', cautionTitle: 'सावधान रहू', unsafeTitle: 'सुरक्षित नहि अछि!', checkAnother: 'दोसर जाँच करू', seeDetails: 'विवरण देखू', shareResult: 'परिणाम साझा करू', reportScam: 'ठगी रिपोर्ट करू', whatToDo: 'अहाँकेँ की करबाक चाही?' }),
  brx: make({ safeTitle: 'रैखाथि जानो जाबाय!', safeMessage: 'बे सामग्रीआव संदिहानाय खन्थाइ नाजाबाय।', cautionTitle: 'सावधान जानो', unsafeTitle: 'रैखाथि नङा!', checkAnother: 'गुबुनखौ सोलों', seeDetails: 'फोरमायथिहोग्रा नाय', shareResult: 'फिथाइ बांट', reportScam: 'ठकायथि रिपर्ट खालाम', whatToDo: 'नोंथाङा मा खालामनो?' }),
  doi: make({ safeTitle: 'सुरक्षित लगदा ऐ!', safeMessage: 'इस सामग्री च कोई शक वाला चीज नेईं लब्भी।', cautionTitle: 'सावधान रवो', unsafeTitle: 'सुरक्षित नेईं!', checkAnother: 'होर जांच करो', seeDetails: 'विस्तार दिक्खो', shareResult: 'नतीजा सांझा करो', reportScam: 'ठगी दी रिपोर्ट करो', whatToDo: 'तुसीं केह् करना चाहिदा?' }),
  ks: make({ safeTitle: 'محفوظ چھُ لگن!', safeMessage: 'یِتھ موادس منز کُنہِ مشکوک چیز نہٕ آو.', cautionTitle: 'احتیاط کریو', unsafeTitle: 'محفوظ چھُ نہٕ!', checkAnother: 'بیاہ چیک کریو', seeDetails: 'تفصیل وُچھو', shareResult: 'نتیجہٕ شیئر کریو', reportScam: 'فراڈ رپورٹ کریو', whatToDo: 'تُہۍ کیاہ کَرُن چھُ؟' }),
  mni: make({ safeTitle: 'নিশিংবা ওইনা লৈরে!', safeMessage: 'মসিগী কনটেন্টদা সন্দেহজনক অমত্তা ফংদ্রে।', cautionTitle: 'মচা খংজব', unsafeTitle: 'নিশিংবা ওইনা লৈদ্রে!', checkAnother: 'অমুক হেনা চেক তৌ', seeDetails: 'ডিটেইলস্ যেংউ', shareResult: 'রিজাল্ট শেয়ার তৌ', reportScam: 'স্কেম রিপোর্ত তৌ', whatToDo: 'নহাক্না করিগুম্বা তৌগদৌরিবনো?' }),
  sat: make({ safeTitle: 'ᱵᱷᱟᱞᱚ ᱞᱟᱹᱜᱤᱫ ᱟ!', safeMessage: 'ᱱᱚᱣᱟ ᱠᱚᱱᱴᱮᱱᱴ ᱨᱮ ᱡᱷᱩᱠᱤ ᱛᱮ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।', cautionTitle: 'ᱥᱟᱵᱟᱫ ᱢᱮ', unsafeTitle: 'ᱵᱟᱝ ᱥᱩᱨᱟᱠᱷᱤᱛ!', checkAnother: 'ᱟᱨ ᱢᱤᱫ ᱵᱟᱹᱭᱥᱤ ᱧᱮᱞ ᱢᱮ', seeDetails: 'ᱵᱤᱵᱨᱚᱱ ᱧᱮᱞ ᱢᱮ', shareResult: 'ᱯᱷᱚᱞ ᱵᱟᱸᱴᱟᱣ ᱢᱮ', reportScam: 'ᱡᱚᱞᱟᱹᱱ ᱨᱤᱯᱳᱨᱴ ᱢᱮ', whatToDo: 'ᱟᱢ ᱪᱮᱫ ᱢᱮ ᱠᱚᱨᱟᱣ ᱢᱮ?' }),
  sd: make({ safeTitle: 'محفوظ لڳي ٿو!', safeMessage: 'هن مواد ۾ ڪا شڪي ڳالهه نه ملي.', cautionTitle: 'احتياط ڪريو', unsafeTitle: 'محفوظ ناهي!', checkAnother: 'ٻيو چيڪ ڪريو', seeDetails: 'تفصيل ڏسو', shareResult: 'نتيجو شيئر ڪريو', reportScam: 'اسڪيم رپورٽ ڪريو', whatToDo: 'توهان کي ڇا ڪرڻ گهرجي؟' }),
  ur: make({ safeTitle: 'محفوظ لگتا ہے!', safeMessage: 'اس مواد میں کوئی مشکوک چیز نہیں ملی۔', cautionTitle: 'محتاط رہیں', unsafeTitle: 'محفوظ نہیں!', checkAnother: 'ایک اور چیک کریں', seeDetails: 'تفصیلات دیکھیں', shareResult: 'نتیجہ شیئر کریں', reportScam: 'اسکیم کی رپورٹ کریں', whatToDo: 'آپ کو کیا کرنا چاہیے؟' }),
  sa: make({ safeTitle: 'सुरक्षितम् इव दृश्यते!', safeMessage: 'अस्मिन् विषये संशयास्पदं किमपि न प्राप्तम्।', cautionTitle: 'सावधानाः भवत', unsafeTitle: 'सुरक्षितं नास्ति!', checkAnother: 'अन्यत् परीक्षताम्', seeDetails: 'विवरणं पश्यत', shareResult: 'फलितं विभजत', reportScam: 'कपटं निवेदयत', whatToDo: 'भवता किं करणीयम्?' }),
};

function ResultIllustration({ state }: { state: 'safe' | 'caution' | 'unsafe' }) {
  if (state === 'safe') {
    return (
      <div className="relative mx-auto h-[210px] w-full max-w-[330px]">
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="absolute left-[22%] top-[24%] text-emerald-300">
          <UserRound size={112} strokeWidth={1.4} />
        </div>
        <div className="absolute right-[10%] top-[28%] flex h-28 w-28 items-center justify-center rounded-[30px] bg-emerald-400/15 text-emerald-300 shadow-[0_0_50px_rgba(52,211,153,.18)]">
          <ShieldCheck size={72} strokeWidth={1.7} />
        </div>
        <div className="absolute left-[17%] top-[18%] text-emerald-300">
          <Check size={25} strokeWidth={4} />
        </div>
        <div className="absolute right-[4%] top-[18%] h-3 w-8 rotate-12 rounded-full bg-lime-300" />
        <div className="absolute right-[3%] top-[58%] h-3 w-6 -rotate-12 rounded-full bg-lime-300" />
      </div>
    );
  }

  if (state === 'caution') {
    return (
      <div className="relative mx-auto h-[210px] w-full max-w-[330px]">
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-2xl" />
        <div className="absolute left-[24%] top-[25%] text-slate-300">
          <UserRound size={108} strokeWidth={1.4} />
        </div>
        <div className="absolute right-[8%] top-[27%] flex h-28 w-28 items-center justify-center rounded-[28px] bg-amber-400/12 text-amber-300 shadow-[0_0_50px_rgba(251,191,36,.14)]">
          <TriangleAlert size={72} strokeWidth={1.5} />
        </div>
        <div className="absolute right-[5%] top-[18%] h-3 w-8 rotate-12 rounded-full bg-yellow-300" />
        <div className="absolute right-[1%] top-[59%] h-3 w-6 -rotate-12 rounded-full bg-yellow-300" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[210px] w-full max-w-[330px]">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-2xl" />
      <div className="absolute left-[22%] top-[24%] text-rose-300">
        <UserRound size={110} strokeWidth={1.4} />
      </div>
      <div className="absolute right-[9%] top-[25%] flex h-28 w-28 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 shadow-[0_0_50px_rgba(244,63,94,.18)]">
        <CircleX size={76} strokeWidth={1.5} />
      </div>
      <div className="absolute left-[10%] top-[20%] text-rose-400">
        <ShieldX size={28} />
      </div>
    </div>
  );
}

export default function ResultsPanel({ result, loading, error }: ResultsPanelProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language] ?? en;
  const isRtl = language === 'ks' || language === 'sd' || language === 'ur';

  const [showEmergency, setShowEmergency] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const [shareStatus, setShareStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (result?.emergency_alert) setShowEmergency(true);
  }, [result?.emergency_alert, result]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 py-10">
        <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
          <span>{t.analyzing}</span>
        </div>
        <div className="h-80 animate-pulse rounded-[28px] border border-white/[0.06] bg-zinc-900/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-sm">
        <div className="mb-1 flex items-center gap-2 font-semibold text-red-400">
          <AlertTriangle size={17} />
          {t.analysisError}
        </div>
        <div className="whitespace-pre-wrap font-mono text-xs text-zinc-300">{error}</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-xl space-y-3 px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-teal-400">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-lg font-semibold text-zinc-100">{t.scannerTitle}</h2>
        <p className="mx-auto max-w-md text-sm leading-6 text-zinc-400">{t.scannerDescription}</p>
      </div>
    );
  }

  const score = Math.max(0, Math.min(100, Number(result.risk_score) || 0));
  const risk = String(result.risk_level ?? '').toUpperCase();
  const state: 'safe' | 'caution' | 'unsafe' =
    risk === 'HIGH' || risk === 'CRITICAL' || score >= 70
      ? 'unsafe'
      : risk === 'MEDIUM' || risk === 'CAUTION' || score >= 35
        ? 'caution'
        : 'safe';

  const stateData = {
    safe: {
      title: t.safeTitle,
      message: t.safeMessage,
      quote: t.safeQuote,
      icon: CheckCircle2,
      accent: 'emerald',
    },
    caution: {
      title: t.cautionTitle,
      message: t.cautionMessage,
      quote: t.cautionQuote,
      icon: TriangleAlert,
      accent: 'amber',
    },
    unsafe: {
      title: t.unsafeTitle,
      message: t.unsafeMessage,
      quote: t.unsafeQuote,
      icon: CircleX,
      accent: 'rose',
    },
  }[state];

  const shareResult = async () => {
    const text = `CyberRaksha result: ${stateData.title} — ${score}/100`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'CyberRaksha Safety Check', text });
        setShareStatus(t.shared);
      } else {
        await navigator.clipboard.writeText(text);
        setShareStatus(t.resultCopied);
      }
    } catch {
      setShareStatus(null);
    }
    window.setTimeout(() => setShareStatus(null), 2200);
  };

  const goToReport = () => router.push('/report');

  const accentClasses = {
    emerald: {
      panel: 'border-emerald-400/20 bg-emerald-400/[0.06]',
      text: 'text-emerald-300',
      button: 'bg-emerald-500 hover:bg-emerald-400',
      soft: 'bg-emerald-400/10',
    },
    amber: {
      panel: 'border-amber-400/20 bg-amber-400/[0.06]',
      text: 'text-amber-300',
      button: 'bg-amber-500 hover:bg-amber-400',
      soft: 'bg-amber-400/10',
    },
    rose: {
      panel: 'border-rose-400/20 bg-rose-400/[0.06]',
      text: 'text-rose-300',
      button: 'bg-rose-500 hover:bg-rose-400',
      soft: 'bg-rose-400/10',
    },
  }[stateData.accent as 'emerald' | 'amber' | 'rose'];

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

      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="mx-auto max-w-[900px] space-y-5 pb-16"
      >
        {/* RESULT HERO */}
        <section className={`overflow-hidden rounded-[28px] border ${accentClasses.panel} bg-[#081116] shadow-[0_25px_80px_rgba(0,0,0,.25)]`}>
          <div className="px-5 pb-7 pt-3 sm:px-8">
            <div className="mb-1 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => router.push('/scan')}
                className="flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
              >
                <RefreshCw size={14} />
                {t.checkAnother}
              </button>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-[10px] text-slate-400">
                  {result.scam_category}
                </Badge>
                {result.similarity_match && (
                  <Badge variant="secondary" className="border-zinc-700 bg-zinc-800 text-[10px] text-zinc-300">
                    <DatabaseZap size={10} className="mr-1 text-teal-400" />
                    {t.databaseMatch}
                  </Badge>
                )}
              </div>
            </div>

            <ResultIllustration state={state} />

            <div className="mx-auto max-w-[620px] text-center">
              <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full ${accentClasses.soft} ${accentClasses.text}`}>
                <stateData.icon size={27} strokeWidth={2.4} />
              </div>

              <h2 className={`text-4xl font-black tracking-tight sm:text-5xl ${accentClasses.text}`}>
                {stateData.title}
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                {stateData.message}
              </p>
            </div>

            {/* SAFE / WARNING CHECKS */}
            <div className="mx-auto mt-7 max-w-[680px]">
              {state === 'safe' ? (
                <div className="space-y-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
                  {t.safeChecks.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#06130f]">
                        <Check size={15} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`space-y-2 rounded-2xl border p-4 ${state === 'unsafe' ? 'border-rose-400/20 bg-rose-400/[0.06]' : 'border-amber-400/20 bg-amber-400/[0.06]'}`}>
                  {(result.red_flags?.length ? result.red_flags.slice(0, 4) : [
                    state === 'unsafe' ? 'This content has strong scam indicators' : 'This content has unusual indicators',
                    'The sender or destination could not be fully trusted',
                    'This type of content can be used in scams',
                  ]).map((flag, index) => (
                    <div key={`${flag}-${index}`} className="flex items-start gap-3 text-sm text-slate-200">
                      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${state === 'unsafe' ? 'bg-rose-400/15 text-rose-300' : 'bg-amber-400/15 text-amber-300'}`}>
                        {state === 'unsafe' ? <ShieldX size={15} /> : <AlertTriangle size={15} />}
                      </span>
                      <span className="leading-6">{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION CARD */}
            <div className={`mx-auto mt-4 max-w-[680px] rounded-2xl border p-4 ${state === 'unsafe' ? 'border-rose-300/30 bg-rose-100 text-rose-950' : state === 'caution' ? 'border-amber-300/30 bg-amber-100 text-amber-950' : 'border-emerald-300/30 bg-emerald-100 text-emerald-950'}`}>
              <div className="flex gap-3">
                <Lightbulb className="mt-0.5 shrink-0" size={23} />
                <div>
                  <h3 className="font-bold">{t.whatToDo}</h3>
                  {state === 'safe' ? (
                    <p className="mt-1 text-sm leading-6">{t.safeAction}<br />{t.cautionAction}</p>
                  ) : state === 'caution' ? (
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>✓ {t.verifySender}</li>
                      <li>✓ {t.dontClick}</li>
                      <li>✓ {t.askSomeone}</li>
                    </ul>
                  ) : (
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>⊘ Do not click the link</li>
                      <li>⊘ Do not share OTP or personal details</li>
                      <li>⊘ Do not make any payment</li>
                      <li>⊘ Report it to help keep others safe</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* PRIMARY ACTIONS */}
            <div className="mx-auto mt-4 max-w-[680px]">
              <button
                type="button"
                onClick={() => router.push('/scan')}
                className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl px-6 text-base font-bold text-white shadow-lg transition active:scale-[0.99] ${state === 'safe' ? 'bg-emerald-500 hover:bg-emerald-400' : state === 'caution' ? 'bg-amber-500 hover:bg-amber-400' : 'bg-rose-500 hover:bg-rose-400'}`}
              >
                <RefreshCw size={19} />
                {t.checkAnother}
              </button>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {state === 'unsafe' && (
                  <button
                    type="button"
                    onClick={goToReport}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 text-sm font-bold text-white transition hover:bg-rose-400"
                  >
                    <Flag size={17} />
                    {t.reportScam}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowDetails((value) => !value)}
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0E1A22] px-4 text-sm font-semibold text-slate-200 transition hover:bg-[#13222C] ${state === 'unsafe' ? '' : 'col-span-1'}`}
                >
                  <FileText size={17} />
                  {showDetails ? t.hideDetails : t.seeDetails}
                </button>

                <button
                  type="button"
                  onClick={shareResult}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0E1A22] px-4 text-sm font-semibold text-slate-200 transition hover:bg-[#13222C]"
                >
                  <Share2 size={17} />
                  {shareStatus ?? t.shareResult}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HELP CARD */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10151B]">
          <div className="flex flex-col items-center gap-4 px-5 py-5 sm:flex-row sm:justify-between sm:px-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-blue-300">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-white">{t.helpTitle}</p>
                <p className="mt-1 text-xs text-slate-500">{t.helpSubtitle}</p>
              </div>
            </div>
            <a
              href={`tel:${t.helpline}`}
              className="text-center"
            >
              <div className="text-3xl font-black text-white">{t.helpline}</div>
              <div className="text-[10px] text-slate-500">{t.helplineAvailability}</div>
            </a>
          </div>
          <div className={`border-t border-white/[0.06] px-5 py-4 text-center text-sm italic ${accentClasses.text}`}>
            {stateData.quote}
          </div>
        </section>

        {/* TECHNICAL DETAILS — hidden until requested */}
        {showDetails && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0D1319] px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={15} className="text-teal-400" />
                {t.score}: <span className="font-mono text-white">{score}/100</span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {result.api_mode === 'live_watsonx' ? t.liveAI : t.localFallback}
              </span>
            </div>

            {result.qr_payload && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-400">
                      <span className="font-mono text-xs font-bold">QR</span>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-200">{t.decodedQr}</h3>
                      <p className="text-[10px] text-zinc-400">{t.qrExtracted}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {result.qr_payload.startsWith('upi://')
                      ? t.upiPayment
                      : result.qr_payload.startsWith('http')
                        ? t.webDestination
                        : t.textPayload}
                  </Badge>
                </div>
                <div className="break-all rounded-lg border border-zinc-800/80 bg-zinc-950 p-3 font-mono text-xs text-zinc-300">
                  {result.qr_payload}
                </div>
                {result.qr_payload.startsWith('upi://') && (
                  <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-[11px] leading-relaxed text-amber-400/90">
                    ⚠️ <b>{t.crucialAlert}</b> {t.upiWarning}
                  </p>
                )}
              </div>
            )}

            {result.security_evaluation && result.security_evaluation.action !== 'ALLOW_WITH_CAUTION' && (
              <SafetyLock security={result.security_evaluation} urls={result.detected_urls} />
            )}

            {/* NEW AI FEATURE DETAILS */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* 🧬 Scam Fingerprint */}
              {result.scam_fingerprint && (
                <section className="rounded-xl border border-fuchsia-400/15 bg-fuchsia-400/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">🧬</span>
                    <h3 className="text-sm font-bold text-zinc-100">{t.scamFingerprint}</h3>
                  </div>

                  <p className="text-base font-semibold text-fuchsia-300">
                    {result.scam_fingerprint.name}
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                    {result.scam_fingerprint.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                    <Badge variant="outline">
                      {t.confidence}: {result.scam_fingerprint.confidence}%
                    </Badge>
                    {result.scam_fingerprint.primary_tactic && (
                      <Badge variant="outline">
                        {t.primaryTactic}: {result.scam_fingerprint.primary_tactic}
                      </Badge>
                    )}
                  </div>

                  {result.scam_fingerprint.secondary_tactics?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.scam_fingerprint.secondary_tactics.map((tactic) => (
                        <span
                          key={tactic}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-400"
                        >
                          {tactic}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* 🔍 Scam Classification */}
              {result.scam_classification && (
                <section className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">🔍</span>
                    <h3 className="text-sm font-bold text-zinc-100">{t.scamClassification}</h3>
                  </div>

                  <p className="text-base font-semibold text-cyan-300">
                    {result.scam_classification.category}
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                    {result.scam_classification.explanation}
                  </p>

                  <div className="mt-3">
                    <Badge variant="outline">
                      {t.confidence}: {result.scam_classification.confidence}%
                    </Badge>
                  </div>

                  {result.scam_classification.alternative_categories?.length > 0 && (
                    <div className="mt-3 text-[10px] text-zinc-500">
                      {result.scam_classification.alternative_categories.join(' • ')}
                    </div>
                  )}
                </section>
              )}

              {/* 🧩 Variant Detection */}
              {result.variant_detection && (
                <section className="rounded-xl border border-violet-400/15 bg-violet-400/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">🧩</span>
                    <h3 className="text-sm font-bold text-zinc-100">{t.variantDetection}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {result.variant_detection.match_type}
                    </Badge>
                    <Badge variant="outline">
                      {t.similarity}: {result.variant_detection.similarity_score}%
                    </Badge>
                  </div>

                  {result.variant_detection.scam_family && (
                    <p className="mt-3 text-xs text-zinc-300">
                      <span className="text-zinc-500">{t.scamFamily}: </span>
                      {result.variant_detection.scam_family}
                    </p>
                  )}

                  <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                    {result.variant_detection.explanation}
                  </p>

                  {result.variant_detection.matched_indicators?.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {result.variant_detection.matched_indicators.map((indicator, index) => (
                        <div key={`${indicator}-${index}`} className="text-[10px] text-zinc-500">
                          • {indicator}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* 📸 Screenshot Analysis */}
              {result.screenshot_analysis && (
                <section className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">📸</span>
                    <h3 className="text-sm font-bold text-zinc-100">{t.screenshotAnalysis}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {t.analysisMethod}: {result.screenshot_analysis.method}
                    </Badge>
                    {result.screenshot_analysis.text_detected && (
                      <Badge variant="outline">
                        {t.extractedText}: {result.screenshot_analysis.extracted_text.length} chars
                      </Badge>
                    )}
                  </div>

                  {result.screenshot_analysis.detected_urls?.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-1 text-[10px] uppercase tracking-wide text-zinc-500">
                        {t.detectedUrls}
                      </p>
                      <div className="space-y-1">
                        {result.screenshot_analysis.detected_urls.map((url) => (
                          <div key={url} className="break-all rounded-lg bg-zinc-950/70 p-2 font-mono text-[10px] text-zinc-400">
                            {url}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.screenshot_analysis.text_detected ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs font-medium text-amber-300">
                        {t.extractedText}
                      </summary>
                      <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-950/70 p-3 text-[10px] leading-5 text-zinc-400">
                        {result.screenshot_analysis.extracted_text}
                      </pre>
                    </details>
                  ) : (
                    <p className="mt-3 text-xs leading-5 text-zinc-500">
                      {t.noScreenshotData}
                    </p>
                  )}

                  {result.screenshot_analysis.explanation && (
                    <p className="mt-3 text-[10px] leading-5 text-zinc-500">
                      {result.screenshot_analysis.explanation}
                    </p>
                  )}
                </section>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <RedFlagsList flags={result.red_flags} category={result.scam_category} />
              <ScamDNAChart dna={result.scam_dna} />
            </div>

            <RiskMeter level={result.risk_level} score={result.risk_score} />

            <GuidancePanel
              guidance={result.guidance}
              safetyLock={result.safety_lock}
              summary={result.summary}
            />
          </div>
        )}
      </div>
    </>
  );
}
