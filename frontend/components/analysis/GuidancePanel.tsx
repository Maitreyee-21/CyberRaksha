'use client';

import * as React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import type { MultilingualGuidance } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { LanguageCode } from '@/lib/languages';

interface GuidancePanelProps {
  guidance: MultilingualGuidance;
  safetyLock: boolean;
  summary: string;
}

type GuidanceCopy = {
  meaning: string;
  why: string;
  do: string;
  dont: string;
  avoidText: string;
  safeText: string;
  emergency: string;
  call: string;
  report: string;
  locked: string;
  steps: string;
};

const EN: GuidanceCopy = {
  meaning: 'What does this mean?',
  why: 'CyberRaksha explanation',
  do: 'What should I do?',
  dont: 'What should I avoid?',
  avoidText:
    'Do not click suspicious links, send money, or share OTP, PIN, password or banking details until you have verified the source.',
  safeText:
    'If you are unsure, stop and verify using the organisation’s official app, website or phone number.',
  emergency: 'Need immediate help?',
  call: 'Call Cyber Crime Helpline',
  report: 'Report Cyber Crime',
  locked:
    'Safety Lock is active. The suspicious destination has been blocked.',
  steps: 'Recommended steps',
};

const COPY: Partial<Record<LanguageCode, Partial<GuidanceCopy>>> = {
  hi: {
    meaning: 'इसका क्या मतलब है?',
    why: 'CyberRaksha की जानकारी',
    do: 'मुझे अब क्या करना चाहिए?',
    dont: 'मुझे क्या नहीं करना चाहिए?',
    avoidText:
      'स्रोत की पुष्टि होने तक संदिग्ध लिंक पर क्लिक न करें, पैसे न भेजें और OTP, PIN, पासवर्ड या बैंक की जानकारी साझा न करें।',
    safeText:
      'अगर आपको संदेह है, रुकें और संस्था के आधिकारिक ऐप, वेबसाइट या फोन नंबर से पुष्टि करें।',
    emergency: 'तुरंत मदद चाहिए?',
    call: 'साइबर क्राइम हेल्पलाइन पर कॉल करें',
    report: 'साइबर क्राइम रिपोर्ट करें',
    locked:
      'सेफ्टी लॉक सक्रिय है। संदिग्ध वेबसाइट को ब्लॉक कर दिया गया है।',
    steps: 'सुझाए गए कदम',
  },
  mr: {
    meaning: 'याचा अर्थ काय?',
    why: 'CyberRaksha चे स्पष्टीकरण',
    do: 'आता मी काय करावे?',
    dont: 'मी काय करू नये?',
    avoidText:
      'स्रोताची खात्री होईपर्यंत संशयास्पद लिंकवर क्लिक करू नका, पैसे पाठवू नका आणि OTP, PIN, पासवर्ड किंवा बँकेची माहिती शेअर करू नका.',
    safeText:
      'शंका असल्यास थांबा आणि संस्थेच्या अधिकृत अॅप, वेबसाइट किंवा फोन नंबरवरून खात्री करा.',
    emergency: 'तातडीची मदत हवी आहे?',
    call: 'सायबर क्राइम हेल्पलाइनवर कॉल करा',
    report: 'सायबर क्राइम रिपोर्ट करा',
    locked:
      'सेफ्टी लॉक सक्रिय आहे. संशयास्पद वेबसाइट ब्लॉक करण्यात आली आहे.',
    steps: 'शिफारस केलेले उपाय',
  },
  bn: {
    meaning: 'এর মানে কী?',
    why: 'CyberRaksha-এর ব্যাখ্যা',
    do: 'আমার কী করা উচিত?',
    dont: 'আমার কী এড়িয়ে চলা উচিত?',
    avoidText:
      'উৎস যাচাই না হওয়া পর্যন্ত সন্দেহজনক লিংকে ক্লিক করবেন না, টাকা পাঠাবেন না এবং OTP, PIN, পাসওয়ার্ড বা ব্যাংকের তথ্য শেয়ার করবেন না।',
    safeText:
      'নিশ্চিত না হলে থামুন এবং প্রতিষ্ঠানের অফিসিয়াল অ্যাপ, ওয়েবসাইট বা ফোন নম্বর ব্যবহার করে যাচাই করুন।',
    emergency: 'তাৎক্ষণিক সাহায্য দরকার?',
    call: 'সাইবার ক্রাইম হেল্পলাইনে কল করুন',
    report: 'সাইবার ক্রাইম রিপোর্ট করুন',
    locked: 'সেফটি লক সক্রিয়। সন্দেহজনক গন্তব্য ব্লক করা হয়েছে।',
    steps: 'প্রস্তাবিত পদক্ষেপ',
  },
  gu: {
    meaning: 'આનો અર્થ શું છે?',
    why: 'CyberRakshaનું સમજૂતી',
    do: 'મારે શું કરવું જોઈએ?',
    dont: 'મારે શું ટાળવું જોઈએ?',
    avoidText:
      'સ્રોતની ખાતરી થાય ત્યાં સુધી શંકાસ્પદ લિંક પર ક્લિક કરશો નહીં, પૈસા મોકલશો નહીં અને OTP, PIN, પાસવર્ડ અથવા બેંકની માહિતી શેર કરશો નહીં.',
    safeText:
      'ખાતરી ન હોય તો રોકાઈ જાઓ અને સંસ્થાની સત્તાવાર એપ, વેબસાઇટ અથવા ફોન નંબરથી ચકાસો.',
    emergency: 'તાત્કાલિક મદદ જોઈએ?',
    call: 'સાયબર ક્રાઇમ હેલ્પલાઇન પર કૉલ કરો',
    report: 'સાયબર ક્રાઇમની જાણ કરો',
    locked: 'સેફ્ટી લોક સક્રિય છે. શંકાસ્પદ ગંતવ્ય બ્લોક કરવામાં આવ્યું છે.',
    steps: 'ભલામણ કરેલા પગલાં',
  },
  ta: {
    meaning: 'இதன் பொருள் என்ன?',
    why: 'CyberRaksha விளக்கம்',
    do: 'நான் என்ன செய்ய வேண்டும்?',
    dont: 'நான் எதைத் தவிர்க்க வேண்டும்?',
    avoidText:
      'மூலத்தைச் சரிபார்க்கும் வரை சந்தேகமான இணைப்புகளைக் கிளிக் செய்யாதீர்கள், பணம் அனுப்பாதீர்கள், OTP, PIN, கடவுச்சொல் அல்லது வங்கி விவரங்களைப் பகிராதீர்கள்.',
    safeText:
      'உறுதியாக தெரியவில்லை என்றால் நிறுத்தி, நிறுவனத்தின் அதிகாரப்பூர்வ செயலி, இணையதளம் அல்லது தொலைபேசி எண்ணைப் பயன்படுத்தி சரிபார்க்கவும்.',
    emergency: 'உடனடி உதவி தேவையா?',
    call: 'சைபர் குற்ற உதவி எண்ணை அழைக்கவும்',
    report: 'சைபர் குற்றத்தைப் புகாரளிக்கவும்',
    locked: 'Safety Lock செயல்பாட்டில் உள்ளது. சந்தேகமான இலக்கு தடுக்கப்பட்டுள்ளது.',
    steps: 'பரிந்துரைக்கப்பட்ட படிகள்',
  },
  te: {
    meaning: 'దీని అర్థం ఏమిటి?',
    why: 'CyberRaksha వివరణ',
    do: 'నేను ఏమి చేయాలి?',
    dont: 'నేను దేనిని నివారించాలి?',
    avoidText:
      'మూలాన్ని ధృవీకరించే వరకు అనుమానాస్పద లింక్‌లను క్లిక్ చేయవద్దు, డబ్బు పంపవద్దు మరియు OTP, PIN, పాస్‌వర్డ్ లేదా బ్యాంకింగ్ వివరాలను పంచుకోవద్దు.',
    safeText:
      'ఖచ్చితంగా తెలియకపోతే ఆగి, సంస్థ అధికారిక యాప్, వెబ్‌సైట్ లేదా ఫోన్ నంబర్ ద్వారా ధృవీకరించండి.',
    emergency: 'తక్షణ సహాయం కావాలా?',
    call: 'సైబర్ క్రైమ్ హెల్ప్‌లైన్‌కు కాల్ చేయండి',
    report: 'సైబర్ క్రైమ్‌ను నివేదించండి',
    locked: 'సేఫ్టీ లాక్ సక్రియంగా ఉంది. అనుమానాస్పద గమ్యం బ్లాక్ చేయబడింది.',
    steps: 'సిఫార్సు చేసిన దశలు',
  },
  kn: {
    meaning: 'ಇದರ ಅರ್ಥವೇನು?',
    why: 'CyberRaksha ವಿವರಣೆ',
    do: 'ನಾನು ಏನು ಮಾಡಬೇಕು?',
    dont: 'ನಾನು ಯಾವುದನ್ನು ತಪ್ಪಿಸಬೇಕು?',
    avoidText:
      'ಮೂಲವನ್ನು ಪರಿಶೀಲಿಸುವವರೆಗೆ ಅನುಮಾನಾಸ್ಪದ ಲಿಂಕ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ, ಹಣ ಕಳುಹಿಸಬೇಡಿ ಮತ್ತು OTP, PIN, ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಬ್ಯಾಂಕಿಂಗ್ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.',
    safeText:
      'ಖಚಿತವಿಲ್ಲದಿದ್ದರೆ ನಿಲ್ಲಿಸಿ, ಸಂಸ್ಥೆಯ ಅಧಿಕೃತ ಆ್ಯಪ್, ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆಯ ಮೂಲಕ ಪರಿಶೀಲಿಸಿ.',
    emergency: 'ತಕ್ಷಣದ ಸಹಾಯ ಬೇಕೇ?',
    call: 'ಸೈಬರ್ ಕ್ರೈಮ್ ಹೆಲ್ಪ್‌ಲೈನ್‌ಗೆ ಕರೆ ಮಾಡಿ',
    report: 'ಸೈಬರ್ ಕ್ರೈಮ್ ವರದಿ ಮಾಡಿ',
    locked: 'ಸೇಫ್ಟಿ ಲಾಕ್ ಸಕ್ರಿಯವಾಗಿದೆ. ಅನುಮಾನಾಸ್ಪದ ಗಮ್ಯಸ್ಥಾನವನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.',
    steps: 'ಶಿಫಾರಸು ಮಾಡಿದ ಹಂತಗಳು',
  },
  ml: {
    meaning: 'ഇതിന്റെ അർത്ഥം എന്താണ്?',
    why: 'CyberRaksha വിശദീകരണം',
    do: 'ഞാൻ എന്ത് ചെയ്യണം?',
    dont: 'ഞാൻ എന്ത് ഒഴിവാക്കണം?',
    avoidText:
      'ഉറവിടം പരിശോധിക്കുന്നതുവരെ സംശയാസ്പദമായ ലിങ്കുകളിൽ ക്ലിക്ക് ചെയ്യരുത്, പണം അയയ്ക്കരുത്, OTP, PIN, പാസ്‌വേഡ് അല്ലെങ്കിൽ ബാങ്കിംഗ് വിവരങ്ങൾ പങ്കിടരുത്.',
    safeText:
      'ഉറപ്പില്ലെങ്കിൽ നിർത്തി സ്ഥാപനത്തിന്റെ ഔദ്യോഗിക ആപ്പ്, വെബ്‌സൈറ്റ് അല്ലെങ്കിൽ ഫോൺ നമ്പർ ഉപയോഗിച്ച് പരിശോധിക്കുക.',
    emergency: 'ഉടൻ സഹായം വേണോ?',
    call: 'സൈബർ ക്രൈം ഹെൽപ്പ്‌ലൈനിലേക്ക് വിളിക്കുക',
    report: 'സൈബർ ക്രൈം റിപ്പോർട്ട് ചെയ്യുക',
    locked: 'Safety Lock സജീവമാണ്. സംശയാസ്പദമായ ലക്ഷ്യസ്ഥാനം തടഞ്ഞിരിക്കുന്നു.',
    steps: 'ശുപാർശ ചെയ്യുന്ന ഘട്ടങ്ങൾ',
  },
  pa: {
    meaning: 'ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ?',
    why: 'CyberRaksha ਦੀ ਵਿਆਖਿਆ',
    do: 'ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',
    dont: 'ਮੈਨੂੰ ਕੀ ਨਹੀਂ ਕਰਨਾ ਚਾਹੀਦਾ?',
    avoidText:
      'ਸਰੋਤ ਦੀ ਪੁਸ਼ਟੀ ਹੋਣ ਤੱਕ ਸ਼ੱਕੀ ਲਿੰਕਾਂ ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ, ਪੈਸੇ ਨਾ ਭੇਜੋ ਅਤੇ OTP, PIN, ਪਾਸਵਰਡ ਜਾਂ ਬੈਂਕਿੰਗ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਨਾ ਕਰੋ।',
    safeText:
      'ਜੇ ਯਕੀਨ ਨਹੀਂ ਹੈ ਤਾਂ ਰੁਕੋ ਅਤੇ ਸੰਸਥਾ ਦੀ ਅਧਿਕਾਰਤ ਐਪ, ਵੈੱਬਸਾਈਟ ਜਾਂ ਫੋਨ ਨੰਬਰ ਰਾਹੀਂ ਪੁਸ਼ਟੀ ਕਰੋ।',
    emergency: 'ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?',
    call: 'ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਹੈਲਪਲਾਈਨ ਤੇ ਕਾਲ ਕਰੋ',
    report: 'ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    locked: 'ਸੇਫਟੀ ਲਾਕ ਸਰਗਰਮ ਹੈ। ਸ਼ੱਕੀ ਟਿਕਾਣਾ ਬਲੌਕ ਕੀਤਾ ਗਿਆ ਹੈ।',
    steps: 'ਸਿਫਾਰਸ਼ ਕੀਤੇ ਕਦਮ',
  },
  or: {
    meaning: 'ଏହାର ଅର୍ଥ କଣ?',
    why: 'CyberRaksha ବ୍ୟାଖ୍ୟା',
    do: 'ମୁଁ କଣ କରିବି?',
    dont: 'ମୁଁ କଣ ଏଡ଼ାଇବି?',
    avoidText:
      'ଉତ୍ସ ଯାଞ୍ଚ ନହେବା ପର୍ଯ୍ୟନ୍ତ ସନ୍ଦେହଜନକ ଲିଙ୍କରେ କ୍ଲିକ୍ କରନ୍ତୁ ନାହିଁ, ଟଙ୍କା ପଠାନ୍ତୁ ନାହିଁ ଏବଂ OTP, PIN, ପାସୱାର୍ଡ କିମ୍ବା ବ୍ୟାଙ୍କିଙ୍ଗ ସୂଚନା ସେୟାର କରନ୍ତୁ ନାହିଁ।',
    safeText:
      'ନିଶ୍ଚିତ ନହେଲେ ଅଟକନ୍ତୁ ଏବଂ ସଂସ୍ଥାର ଅଧିକୃତ ଆପ୍, ୱେବସାଇଟ୍ କିମ୍ବା ଫୋନ୍ ନମ୍ବର ଦ୍ୱାରା ଯାଞ୍ଚ କରନ୍ତୁ।',
    emergency: 'ତୁରନ୍ତ ସାହାଯ୍ୟ ଦରକାର?',
    call: 'ସାଇବର କ୍ରାଇମ୍ ହେଲ୍ପଲାଇନକୁ କଲ୍ କରନ୍ତୁ',
    report: 'ସାଇବର କ୍ରାଇମ୍ ରିପୋର୍ଟ କରନ୍ତୁ',
    locked: 'Safety Lock ସକ୍ରିୟ ଅଛି। ସନ୍ଦେହଜନକ ଗନ୍ତବ୍ୟକୁ ବ୍ଲକ୍ କରାଯାଇଛି।',
    steps: 'ସୁପାରିଶ କରାଯାଇଥିବା ପଦକ୍ଷେପ',
  },
  as: {
    meaning: 'ইয়াৰ অৰ্থ কি?',
    why: 'CyberRaksha-ৰ ব্যাখ্যা',
    do: 'মই কি কৰিব লাগে?',
    dont: 'মই কি এৰাই চলিব লাগে?',
    avoidText:
      'উৎসটো নিশ্চিত নোহোৱালৈকে সন্দেহজনক লিংকত ক্লিক নকৰিব, টকা পঠিয়াব নালাগে আৰু OTP, PIN, পাছৱৰ্ড বা বেংকৰ তথ্য শ্বেয়াৰ নকৰিব।',
    safeText:
      'নিশ্চিত নহ’লে ৰৈ যাওক আৰু প্ৰতিষ্ঠানৰ চৰকাৰী এপ, ৱেবছাইট বা ফোন নম্বৰৰ জৰিয়তে পৰীক্ষা কৰক।',
    emergency: 'তৎক্ষণাত সহায় লাগে নেকি?',
    call: 'চাইবাৰ ক্ৰাইম হেল্পলাইনলৈ ফোন কৰক',
    report: 'চাইবাৰ ক্ৰাইম ৰিপ’ৰ্ট কৰক',
    locked: 'Safety Lock সক্ৰিয় আছে। সন্দেহজনক গন্তব্যটো ব্লক কৰা হৈছে।',
    steps: 'পৰামৰ্শ দিয়া পদক্ষেপ',
  },
  ne: {
    meaning: 'यसको अर्थ के हो?',
    why: 'CyberRaksha को व्याख्या',
    do: 'मैले के गर्नुपर्छ?',
    dont: 'मैले के गर्नु हुँदैन?',
    avoidText:
      'स्रोत प्रमाणित नभएसम्म शंकास्पद लिंकमा क्लिक नगर्नुहोस्, पैसा नपठाउनुहोस् र OTP, PIN, पासवर्ड वा बैंकिङ विवरण साझा नगर्नुहोस्।',
    safeText:
      'निश्चित नभए रोक्नुहोस् र संस्थाको आधिकारिक एप, वेबसाइट वा फोन नम्बरबाट पुष्टि गर्नुहोस्।',
    emergency: 'तुरुन्त मद्दत चाहिन्छ?',
    call: 'साइबर क्राइम हेल्पलाइनमा फोन गर्नुहोस्',
    report: 'साइबर क्राइम रिपोर्ट गर्नुहोस्',
    locked: 'Safety Lock सक्रिय छ। शंकास्पद गन्तव्य रोकिएको छ।',
    steps: 'सिफारिस गरिएका चरणहरू',
  },
  kok: {
    meaning: 'हाचो अर्थ कितें?',
    why: 'CyberRaksha चे स्पश्टीकरण',
    do: 'हांवें कितें करपाक जाय?',
    dont: 'हांवें कितें टाळपाक जाय?',
    avoidText:
      'स्रोताची खात्री जावंक मेळो मेरेन संशयास्पद लिंकांचेर क्लिक करु नाका, पयशे धाडू नाका आनी OTP, PIN, पासवर्ड वा बँकेची माहिती वाटू नाका.',
    safeText:
      'खात्री नासल्यार थांबा आनी संस्थेच्या अधिकृत अॅप, वेबसाइट वा फोन नंबरान तपासात.',
    emergency: 'ताकती मदत जाय?',
    call: 'सायबर क्राइम हेल्पलाइनाक फोन करात',
    report: 'सायबर क्राइमाची तक्रार करात',
    locked: 'Safety Lock चालू आसा. संशयास्पद जागो ब्लॉक केला.',
    steps: 'शिफारस केल्ले उपाय',
  },
  mai: {
    meaning: 'एकर अर्थ की अछि?',
    why: 'CyberRaksha केर व्याख्या',
    do: 'हमरा की करबाक चाही?',
    dont: 'हमरा की नहि करबाक चाही?',
    avoidText:
      'स्रोतक पुष्टि नहि होय धरि संदिग्ध लिंक पर क्लिक नहि करू, पैसा नहि पठाउ आ OTP, PIN, पासवर्ड वा बैंकक जानकारी साझा नहि करू।',
    safeText:
      'जँ निश्चित नहि छी त रुकि जाउ आ संस्थाक आधिकारिक ऐप, वेबसाइट वा फोन नंबर सँ पुष्टि करू।',
    emergency: 'तुरन्त मदद चाही?',
    call: 'साइबर क्राइम हेल्पलाइन पर फोन करू',
    report: 'साइबर क्राइम रिपोर्ट करू',
    locked: 'Safety Lock सक्रिय अछि। संदिग्ध गन्तव्य ब्लॉक कएल गेल अछि।',
    steps: 'सुझाओल गेल कदम',
  },
  doi: {
    meaning: 'इसदा मतलब केह् ऐ?',
    why: 'CyberRaksha दा समझाना',
    do: 'मिगी केह् करना चाहिदा?',
    dont: 'मिगी केह् नेईं करना चाहिदा?',
    avoidText:
      'स्रोत दी पक्की जानकारी होने तगर संदिग्ध लिंक पर क्लिक नेईं करो, पैसे नेईं भेजो ते OTP, PIN, पासवर्ड जां बैंक दी जानकारी साझा नेईं करो।',
    safeText:
      'जे पक्का नेईं तां रुक्को ते संस्था दे आधिकारिक ऐप, वेबसाइट जां फोन नंबर कन्नै जांच करो।',
    emergency: 'तुरंत मदद चाहिदी?',
    call: 'साइबर क्राइम हेल्पलाइन पर फोन करो',
    report: 'साइबर क्राइम रिपोर्ट करो',
    locked: 'Safety Lock चालू ऐ। संदिग्ध जगह ब्लॉक करी दित्ती गेई ऐ।',
    steps: 'सिफारिश किट्टे कदम',
  },
  brx: {
    meaning: 'बेयो मोनसे नाय?',
    why: 'CyberRaksha नि बुंनाय',
    do: 'आं मा मा खालामनो हागोन?',
    dont: 'आं मा एराय खालामनो नांगौ?',
    avoidText:
      'स्रोतखौ नायबिजिरनाय सिगां संदिग्ध लिंकआव क्लिक खालामनो नाङा, रां होनो नाङा आरो OTP, PIN, पासवर्ड बा बेंकनि फोरमेसिनि खौरां होनो नाङा।',
    safeText:
      'नों सिगां नायनो हायाखैब्ला थांखा नायबिजिर आरो संस्था नि गोख्रै एप, वेबसाइट बा फोन नम्बरजों नायबिजिर।',
    emergency: 'थांनानै मदद नांगौ?',
    call: 'साइबर क्राइम हेल्पलाइनआव फोन खालाम',
    report: 'साइबर क्राइम रिपोर्ट खालाम',
    locked: 'Safety Lock जाग्रायो। संदिग्ध जायगाखौ ब्लक खालामनाय जायो।',
    steps: 'सिफारिस खालामनाय स्टेप',
  },
  mni: {
    meaning: 'ꯃꯁꯤꯒꯤ ꯃꯔꯝ ꯀꯔꯤꯅꯣ?',
    why: 'CyberRaksha ꯒꯤ ꯁꯦꯡꯗꯣꯛ',
    do: 'ꯑꯩꯅ ꯀꯔꯤ ꯇꯧꯒꯗꯕꯥ?',
    dont: 'ꯑꯩꯅ ꯀꯔꯤ ꯇꯧꯗꯕꯥ?',
    avoidText:
      'ꯃꯃꯥꯡ ꯂꯩꯕꯥ ꯌꯦꯡꯗ꯭ꯔꯤꯕ ꯃꯇꯝꯗꯥ ꯁꯤꯗꯤ ꯂꯤꯡꯛꯇꯥ ꯀ꯭ꯂꯤꯛ ꯇꯧꯗꯕꯥ, ꯁꯦꯟ ꯄꯤꯗꯕꯥ ꯑꯃꯁꯨꯡ OTP, PIN, ꯄꯥꯁꯋꯥꯔꯗ ꯅꯠꯇ꯭ꯔꯒꯥ ꯕꯦꯡꯛ ꯂꯣꯟ ꯄꯤꯗꯕꯥ꯫',
    safeText:
      'ꯅꯤꯁ꯭ꯆꯤꯠ ꯑꯣꯏꯗ꯭ꯔꯕꯗꯤ ꯊꯝꯃꯨ ꯑꯃꯁꯨꯡ ꯁꯤꯔꯨꯞꯒꯤ ꯑꯣꯐꯤꯁꯤꯌꯦꯜ ꯑꯦꯞ, ꯋꯦꯕꯁꯥꯏꯠ ꯅꯠꯇ꯭ꯔꯒꯥ ꯐꯣꯟ ꯅꯝꯕꯔꯒꯤ ꯃꯇꯦꯡꯅ ꯌꯦꯡꯕꯤꯌꯨ꯫',
    emergency: 'ꯅꯨꯃꯤꯠꯇꯥ ꯃꯇꯦꯡ ꯅꯥꯡꯕ꯭ꯔꯥ?',
    call: 'ꯁꯥꯏꯕꯔ ꯀ꯭ꯔꯥꯏꯝ ꯍꯦꯜꯄꯂꯥꯏꯟꯗꯥ ꯐꯣꯟ ꯇꯧꯕꯤꯌꯨ',
    report: 'ꯁꯥꯏꯕꯔ ꯀ꯭ꯔꯥꯏꯝ ꯔꯤꯄꯣꯔꯠ ꯇꯧꯕꯤꯌꯨ',
    locked: 'Safety Lock ꯆꯠꯂꯤ। ꯁꯤꯗꯤ ꯂꯩꯕꯥ ꯑꯣꯏꯕꯥ ꯐꯤꯌꯦꯠ ꯕ꯭ꯂꯣꯛ ꯇꯧꯔꯦ꯫',
    steps: 'ꯄꯥꯝꯕꯥ ꯁ꯭ꯇꯦꯞꯁ',
  },
  ks: {
    meaning: 'یہِ کیاہ مطلب چھُ؟',
    why: 'CyberRaksha ہُنٛد وضاحت',
    do: 'مےٚ کیاہ کرُن چھُ؟',
    dont: 'مےٚ کیاہ نَہ کرُن چھُ؟',
    avoidText:
      'ذریعہ تصدیق کرن تام مشکوک لنکس پٮ۪ٹھ کلک نَہ کٔرِو، پیسہ نَہ دِیو تہٕ OTP، PIN، پاسورڈ یا بینکنگ تفصیل نَہ شیئر کٔرِو۔',
    safeText:
      'اگر یقین نَہ آسہٕ تہٕ رُکِتھ ادارٕک آفیشل ایپ، ویب سائٹ یا فون نمبر سۭتۍ تصدیق کٔرِو۔',
    emergency: 'فوری مدد چھُ ضرورت؟',
    call: 'سائبر کرائم ہیلپ لائنس فون کٔرِو',
    report: 'سائبر کرائم رپورٹ کٔرِو',
    locked: 'Safety Lock فعال چھُ۔ مشکوک منزل بلاک کٔرِتھ چھِ۔',
    steps: 'سفارش کٔرِتھ قدم',
  },
  sd: {
    meaning: 'هن جو مطلب ڇا آهي؟',
    why: 'CyberRaksha جي وضاحت',
    do: 'مون کي ڇا ڪرڻ گهرجي؟',
    dont: 'مون کي ڇا کان پاسو ڪرڻ گهرجي؟',
    avoidText:
      'ذريعو تصديق ٿيڻ تائين مشڪوڪ لنڪ تي ڪلڪ نه ڪريو، پئسا نه موڪليو ۽ OTP، PIN، پاسورڊ يا بئنڪنگ معلومات شيئر نه ڪريو.',
    safeText:
      'جيڪڏهن پڪ نه هجي ته رڪجي وڃو ۽ اداري جي سرڪاري ايپ، ويب سائيٽ يا فون نمبر سان تصديق ڪريو.',
    emergency: 'فوري مدد گهرجي؟',
    call: 'سائبر ڪرائيم هيلپ لائن تي ڪال ڪريو',
    report: 'سائبر ڪرائيم رپورٽ ڪريو',
    locked: 'Safety Lock فعال آهي. مشڪوڪ منزل بلاڪ ڪئي وئي آهي.',
    steps: 'تجويز ڪيل قدم',
  },
  ur: {
    meaning: 'اس کا کیا مطلب ہے؟',
    why: 'CyberRaksha کی وضاحت',
    do: 'مجھے کیا کرنا چاہیے؟',
    dont: 'مجھے کس چیز سے بچنا چاہیے؟',
    avoidText:
      'ذریعے کی تصدیق ہونے تک مشکوک لنکس پر کلک نہ کریں، پیسے نہ بھیجیں اور OTP، PIN، پاس ورڈ یا بینکنگ معلومات شیئر نہ کریں۔',
    safeText:
      'اگر یقین نہ ہو تو رک جائیں اور ادارے کی سرکاری ایپ، ویب سائٹ یا فون نمبر کے ذریعے تصدیق کریں۔',
    emergency: 'فوری مدد چاہیے؟',
    call: 'سائبر کرائم ہیلپ لائن پر کال کریں',
    report: 'سائبر کرائم رپورٹ کریں',
    locked: 'Safety Lock فعال ہے۔ مشکوک منزل کو بلاک کر دیا گیا ہے۔',
    steps: 'تجویز کردہ اقدامات',
  },
  sa: {
    meaning: 'अस्य कः अर्थः?',
    why: 'CyberRaksha व्याख्या',
    do: 'मया किं करणीयम्?',
    dont: 'मया किं परिहरणीयम्?',
    avoidText:
      'स्रोतस्य पुष्टिं यावत् संदिग्धेषु लिङ्केषु क्लिक् न कुर्वन्तु, धनं न प्रेषयन्तु, OTP, PIN, कूटशब्दं वा बैंकविवरणं न साझीकुर्वन्तु।',
    safeText:
      'यदि निश्चयं नास्ति तर्हि विरम्य संस्थायाः आधिकारिकेन अनुप्रयोगेन, जालपुटेन वा दूरभाषसङ्ख्यया पुष्टिं कुर्वन्तु।',
    emergency: 'तत्कालं साहाय्यं आवश्यकम्?',
    call: 'साइबर अपराध सहायता-रेखां आह्वयतु',
    report: 'साइबर अपराधं निवेदयतु',
    locked: 'Safety Lock सक्रियम् अस्ति। संदिग्धं गन्तव्यं अवरुद्धम् अस्ति।',
    steps: 'अनुशंसिताः चरणाः',
  },
  sat: {
    meaning: 'ᱱᱚᱣᱟ ᱨᱮ ᱪᱮᱫ ᱢᱮᱱᱟ?',
    why: 'CyberRaksha ᱵᱩᱡᱷᱟᱹᱣ',
    do: 'ᱤᱧ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱢᱮ?',
    dont: 'ᱤᱧ ᱪᱮᱫ ᱵᱟᱝ ᱠᱟᱹᱢᱤ ᱢᱮ?',
    avoidText:
      'ᱥᱨᱚᱛ ᱵᱩᱡᱷᱟᱹᱣ ᱵᱟᱝ ᱦᱚᱪᱚ ᱫᱷᱟᱹᱵᱤᱡ ᱥᱟᱸᱫᱷᱟᱹᱱ ᱞᱤᱝᱠ ᱨᱮ ᱠᱞᱤᱠ ᱵᱟᱝ ᱢᱮ, ᱯᱟᱹᱭᱥᱟ ᱵᱟᱝ ᱯᱟᱴᱟᱣ ᱢᱮ, ᱟᱨ OTP, PIN, ᱯᱟᱥᱣᱟᱨᱰ ᱵᱟ ᱵᱮᱝᱠ ᱵᱤᱵᱨᱚᱱ ᱵᱟᱝ ᱮᱢ ᱢᱮ᱾',
    safeText:
      'ᱡᱟᱹᱞᱤ ᱵᱟᱝ ᱦᱚᱪᱚ ᱞᱟᱹᱜᱤᱫ ᱛᱷᱟᱢ ᱢᱮ ᱟᱨ ᱥᱚᱱᱥᱛᱷᱟ ᱨᱮᱭᱟᱜ ᱥᱟᱹᱨᱤ ᱮᱯ, ᱣᱮᱵᱽᱥᱟᱭᱤᱴ ᱵᱟ ᱯᱷᱳᱱ ᱱᱟᱢᱵᱟᱨ ᱛᱮ ᱧᱮᱞ ᱢᱮ᱾',
    emergency: 'ᱧᱟᱢ ᱛᱟᱦᱮᱸ ᱢᱟᱫᱟᱛ ᱞᱟᱹᱜᱤᱫ?',
    call: 'ᱥᱟᱭᱵᱟᱨ ᱠᱨᱟᱭᱤᱢ ᱦᱮᱞᱯᱞᱟᱭᱤᱱ ᱨᱮ ᱯᱷᱳᱱ ᱢᱮ',
    report: 'ᱥᱟᱭᱵᱟᱨ ᱠᱨᱟᱭᱤᱢ ᱨᱤᱯᱳᱨᱴ ᱢᱮ',
    locked: 'Safety Lock ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟ। ᱥᱟᱸᱫᱷᱟᱹᱱ ᱡᱟᱭᱜᱟ ᱵᱞᱚᱠ ᱢᱮᱱᱟ᱾',
    steps: 'ᱥᱤᱯᱷᱟᱨᱤᱥ ᱠᱟᱹᱢᱤ',
  },
};

function getCopy(language: LanguageCode): GuidanceCopy {
  const localized = COPY[language];
  return localized ? { ...EN, ...localized } : EN;
}

export function GuidancePanel({
  guidance,
  safetyLock,
  summary,
}: GuidancePanelProps) {
  const { language } = useLanguage();
  const t = getCopy(language);

  /*
   * The backend currently provides multilingual guidance data only for
   * the locales represented by the API response. For any newly selected
   * UI language that is not present in the response, fall back to English
   * guidance rather than breaking the result panel.
   */
  const guidanceMap = guidance as unknown as Record<
    string,
    { steps?: string[] } | undefined
  >;

  const content =
    guidanceMap?.[language] ??
    guidanceMap?.en ??
    { steps: [] };

  const stepsList = (content.steps || []).filter(
    (step) =>
      !step.includes('1930') &&
      !step.toLowerCase().includes('cybercrime.gov.in')
  );

  return (
    <section className="rounded-3xl border border-[#ddd8ca] bg-white shadow-[0_15px_45px_rgba(48,43,30,.06)] overflow-hidden">
      <div className="p-5 md:p-6 border-b border-[#e8e3d8]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#eef4e9] border border-[#d2dfc8] flex items-center justify-center text-[#55733d]">
                <ShieldCheck size={18} />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[.16em] font-black text-[#8a5d06]">
                  CyberRaksha
                </div>

                <h2 className="text-lg md:text-xl font-black text-[#20282f]">
                  {t.meaning}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#faf8f2] border border-[#e4dece] p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f4e7bf] text-[#8a5d06] flex items-center justify-center shrink-0">
              <Info size={16} />
            </div>

            <div className="min-w-0">
              <div className="text-xs font-black text-[#3b4449]">
                {t.why}
              </div>

              <p className="mt-1.5 text-sm leading-6 text-[#5e6668]">
                {summary}
              </p>
            </div>
          </div>
        </div>

        {safetyLock && (
          <div className="mt-3 flex items-start gap-3 rounded-2xl bg-[#fff3ef] border border-[#e4b9b0] p-4">
            <div className="w-8 h-8 rounded-lg bg-[#ffe4de] text-[#b33d32] flex items-center justify-center shrink-0">
              <AlertTriangle size={17} />
            </div>

            <div>
              <div className="text-sm font-black text-[#a7382e]">
                Safety Lock
              </div>

              <p className="mt-1 text-xs leading-5 text-[#69443f]">
                {t.locked}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 md:p-6 space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#edf5e9] text-[#55733d] flex items-center justify-center">
              <CheckCircle2 size={15} />
            </div>

            <h3 className="text-sm font-black text-[#26302f]">
              {t.do}
            </h3>
          </div>

          <div className="space-y-2">
            {stepsList.map((step, index) => (
              <div
                key={`${step}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-[#e2e7dd] bg-[#f7faf5] p-3"
              >
                <span className="w-6 h-6 rounded-full bg-[#dfead6] text-[#55733d] flex items-center justify-center text-[10px] font-black shrink-0">
                  {index + 1}
                </span>

                <span className="text-sm leading-5 text-[#485249]">
                  {step}
                </span>
              </div>
            ))}
          </div>

          {stepsList.length === 0 && (
            <div className="rounded-xl border border-[#e2e7dd] bg-[#f7faf5] p-3 text-xs text-[#5f695f]">
              {t.steps}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#e5c2bb] bg-[#fff7f5] p-4 md:p-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffe6e1] text-[#b33d32] flex items-center justify-center">
              <XCircle size={17} />
            </div>

            <h3 className="text-sm font-black text-[#a7382e]">
              {t.dont}
            </h3>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#614541]">
            {t.avoidText}
          </p>
        </div>

        <div className="rounded-2xl border border-[#d9dfd4] bg-[#f7f9f5] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={17}
              className="text-[#55733d] shrink-0 mt-0.5"
            />

            <p className="text-xs leading-5 text-[#5b645c]">
              {t.safeText}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
