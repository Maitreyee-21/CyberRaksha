'use client';

import {
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Info,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { LanguageCode } from '@/lib/languages';

type RedFlagsCopy = {
  concerned: string;
  found: string;
  warningSigns: string;
  noWarningSigns: string;
  noMajorSigns: string;
  noMajorDescription: string;
  warning: string;
  info: string;
};

const EN: RedFlagsCopy = {
  concerned: 'Why CyberRaksha is concerned',
  found: 'What CyberRaksha found',
  warningSigns: 'These are the warning signs we found in what you submitted.',
  noWarningSigns: 'We did not find any specific scam warning signs.',
  noMajorSigns: 'No major warning signs found',
  noMajorDescription:
    'This does not appear to contain obvious scam indicators. However, always verify links, payments, and requests for sensitive information before taking action.',
  warning: 'Warning',
  info: 'One warning sign alone does not always mean something is a scam. Multiple warning signs together can indicate that you should stop and verify the source before continuing.',
};

const COPY: Partial<Record<LanguageCode, Partial<RedFlagsCopy>>> = {
  hi: {
    concerned: 'CyberRaksha को चिंता क्यों है',
    found: 'CyberRaksha ने क्या पाया',
    warningSigns: 'आपके द्वारा भेजी गई सामग्री में ये चेतावनी संकेत मिले हैं।',
    noWarningSigns: 'हमें घोटाले के कोई विशेष चेतावनी संकेत नहीं मिले।',
    noMajorSigns: 'कोई बड़े चेतावनी संकेत नहीं मिले',
    noMajorDescription:
      'इसमें घोटाले के स्पष्ट संकेत नहीं दिखते। फिर भी कार्रवाई करने से पहले लिंक, भुगतान और संवेदनशील जानकारी के अनुरोधों की हमेशा पुष्टि करें।',
    warning: 'चेतावनी',
    info: 'केवल एक चेतावनी संकेत का मतलब हमेशा घोटाला नहीं होता। कई संकेत साथ में मिलें तो आगे बढ़ने से पहले रुककर स्रोत की पुष्टि करें।',
  },
  mr: {
    concerned: 'CyberRaksha ला चिंता का आहे',
    found: 'CyberRaksha ला काय आढळले',
    warningSigns: 'तुम्ही दिलेल्या माहितीमध्ये आम्हाला हे धोक्याचे संकेत आढळले.',
    noWarningSigns: 'आम्हाला घोटाळ्याचे कोणतेही ठराविक धोक्याचे संकेत आढळले नाहीत.',
    noMajorSigns: 'कोणतेही मोठे धोक्याचे संकेत आढळले नाहीत',
    noMajorDescription:
      'यामध्ये घोटाळ्याचे स्पष्ट संकेत दिसत नाहीत. तरीही कृती करण्यापूर्वी लिंक, पेमेंट आणि संवेदनशील माहितीच्या विनंत्यांची नेहमी खात्री करा.',
    warning: 'इशारा',
    info: 'एकच धोक्याचा संकेत नेहमी घोटाळा असल्याचे दर्शवत नाही. अनेक संकेत एकत्र आढळल्यास पुढे जाण्यापूर्वी थांबा आणि स्रोताची खात्री करा.',
  },
  bn: {
    concerned: 'CyberRaksha কেন সতর্ক',
    found: 'CyberRaksha কী পেয়েছে',
    warningSigns: 'আপনার পাঠানো তথ্যে আমরা এই সতর্কতার সংকেত পেয়েছি।',
    noWarningSigns: 'আমরা নির্দিষ্ট কোনো প্রতারণার সতর্কতার সংকেত পাইনি।',
    noMajorSigns: 'কোনো বড় সতর্কতার সংকেত পাওয়া যায়নি',
    noMajorDescription:
      'এতে স্পষ্ট প্রতারণার লক্ষণ দেখা যাচ্ছে না। তবুও কাজ করার আগে লিংক, পেমেন্ট এবং সংবেদনশীল তথ্যের অনুরোধ যাচাই করুন।',
    warning: 'সতর্কতা',
    info: 'একটি সতর্কতার সংকেত একাই সবসময় প্রতারণা বোঝায় না। একাধিক সংকেত থাকলে এগিয়ে যাওয়ার আগে থামুন এবং উৎস যাচাই করুন।',
  },
  gu: {
    concerned: 'CyberRaksha શા માટે ચિંતિત છે',
    found: 'CyberRaksha ને શું મળ્યું',
    warningSigns: 'તમે મોકલેલી માહિતીમાં અમને આ ચેતવણીના સંકેતો મળ્યા.',
    noWarningSigns: 'અમને છેતરપિંડીના કોઈ ચોક્કસ ચેતવણી સંકેતો મળ્યા નથી.',
    noMajorSigns: 'કોઈ મોટા ચેતવણી સંકેતો મળ્યા નથી',
    noMajorDescription:
      'આમાં છેતરપિંડીના સ્પષ્ટ સંકેતો દેખાતા નથી. તેમ છતાં કાર્યવાહી કરતા પહેલાં લિંક, ચુકવણી અને સંવેદનશીલ માહિતીની વિનંતીઓ ચકાસો.',
    warning: 'ચેતવણી',
    info: 'એક ચેતવણી સંકેત હંમેશા છેતરપિંડી દર્શાવતો નથી. ઘણા સંકેતો સાથે મળે તો આગળ વધતા પહેલાં રોકાઈને સ્રોત ચકાસો.',
  },
  ta: {
    concerned: 'CyberRaksha ஏன் கவலைப்படுகிறது',
    found: 'CyberRaksha கண்டறிந்தது என்ன',
    warningSigns: 'நீங்கள் சமர்ப்பித்த தகவலில் இந்த எச்சரிக்கை அறிகுறிகள் கண்டறியப்பட்டன.',
    noWarningSigns: 'குறிப்பிட்ட மோசடி எச்சரிக்கை அறிகுறிகள் எதுவும் கிடைக்கவில்லை.',
    noMajorSigns: 'பெரிய எச்சரிக்கை அறிகுறிகள் எதுவும் இல்லை',
    noMajorDescription:
      'இதில் வெளிப்படையான மோசடி அறிகுறிகள் தெரியவில்லை. இருப்பினும் செயல்படுவதற்கு முன் இணைப்புகள், பணம் செலுத்துதல் மற்றும் முக்கிய தகவல் கோரிக்கைகளை சரிபார்க்கவும்.',
    warning: 'எச்சரிக்கை',
    info: 'ஒரே ஒரு எச்சரிக்கை அறிகுறி மட்டும் மோசடியைக் குறிக்காது. பல அறிகுறிகள் இருந்தால் தொடர்வதற்கு முன் நின்று மூலத்தைச் சரிபார்க்கவும்.',
  },
  te: {
    concerned: 'CyberRaksha ఎందుకు ఆందోళన చెందుతోంది',
    found: 'CyberRaksha ఏమి గుర్తించింది',
    warningSigns: 'మీరు సమర్పించిన సమాచారంలో ఈ హెచ్చరిక సంకేతాలను గుర్తించాము.',
    noWarningSigns: 'మోసానికి సంబంధించిన నిర్దిష్ట హెచ్చరిక సంకేతాలు కనిపించలేదు.',
    noMajorSigns: 'ప్రధాన హెచ్చరిక సంకేతాలు ఏవీ కనిపించలేదు',
    noMajorDescription:
      'ఇందులో స్పష్టమైన మోసం సంకేతాలు కనిపించడం లేదు. అయినప్పటికీ చర్య తీసుకునే ముందు లింకులు, చెల్లింపులు మరియు సున్నితమైన సమాచార అభ్యర్థనలను ధృవీకరించండి.',
    warning: 'హెచ్చరిక',
    info: 'ఒక్క హెచ్చరిక సంకేతం మాత్రమే ఎల్లప్పుడూ మోసాన్ని సూచించదు. అనేక సంకేతాలు కలిసి ఉంటే కొనసాగించే ముందు ఆగి మూలాన్ని ధృవీకరించండి.',
  },
  kn: {
    concerned: 'CyberRaksha ಏಕೆ ಕಾಳಜಿ ವಹಿಸುತ್ತದೆ',
    found: 'CyberRaksha ಏನು ಕಂಡುಹಿಡಿದಿದೆ',
    warningSigns: 'ನೀವು ಸಲ್ಲಿಸಿದ ಮಾಹಿತಿಯಲ್ಲಿ ಈ ಎಚ್ಚರಿಕೆ ಸೂಚನೆಗಳನ್ನು ಕಂಡುಹಿಡಿದಿದ್ದೇವೆ.',
    noWarningSigns: 'ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ವಂಚನೆ ಎಚ್ಚರಿಕೆ ಸೂಚನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    noMajorSigns: 'ಯಾವುದೇ ಪ್ರಮುಖ ಎಚ್ಚರಿಕೆ ಸೂಚನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    noMajorDescription:
      'ಇದರಲ್ಲಿ ಸ್ಪಷ್ಟವಾದ ವಂಚನೆಯ ಸೂಚನೆಗಳು ಕಂಡುಬರುವುದಿಲ್ಲ. ಆದರೂ ಕ್ರಮ ಕೈಗೊಳ್ಳುವ ಮೊದಲು ಲಿಂಕ್‌ಗಳು, ಪಾವತಿಗಳು ಮತ್ತು ಸೂಕ್ಷ್ಮ ಮಾಹಿತಿಯ ವಿನಂತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    warning: 'ಎಚ್ಚರಿಕೆ',
    info: 'ಒಂದು ಎಚ್ಚರಿಕೆ ಸೂಚನೆ ಮಾತ್ರ ಯಾವಾಗಲೂ ವಂಚನೆಯನ್ನು ಸೂಚಿಸುವುದಿಲ್ಲ. ಹಲವು ಸೂಚನೆಗಳು ಇದ್ದರೆ ಮುಂದುವರಿಯುವ ಮೊದಲು ನಿಲ್ಲಿಸಿ ಮೂಲವನ್ನು ಪರಿಶೀಲಿಸಿ.',
  },
  ml: {
    concerned: 'CyberRaksha എന്തുകൊണ്ട് ജാഗ്രത പുലർത്തുന്നു',
    found: 'CyberRaksha കണ്ടെത്തിയത്',
    warningSigns: 'നിങ്ങൾ നൽകിയ വിവരങ്ങളിൽ ഈ മുന്നറിയിപ്പ് സൂചനകൾ കണ്ടെത്തി.',
    noWarningSigns: 'വഞ്ചനയുടെ പ്രത്യേക മുന്നറിയിപ്പ് സൂചനകളൊന്നും കണ്ടെത്തിയില്ല.',
    noMajorSigns: 'പ്രധാന മുന്നറിയിപ്പ് സൂചനകളൊന്നും കണ്ടെത്തിയില്ല',
    noMajorDescription:
      'ഇതിൽ വ്യക്തമായ വഞ്ചനാ സൂചനകൾ കാണുന്നില്ല. എന്നിരുന്നാലും പ്രവർത്തിക്കുന്നതിന് മുമ്പ് ലിങ്കുകൾ, പേയ്‌മെന്റുകൾ, സെൻസിറ്റീവ് വിവരങ്ങൾക്കുള്ള അഭ്യർത്ഥനകൾ എന്നിവ പരിശോധിക്കുക.',
    warning: 'മുന്നറിയിപ്പ്',
    info: 'ഒരു മുന്നറിയിപ്പ് സൂചന മാത്രം എല്ലായ്പ്പോഴും വഞ്ചനയെ സൂചിപ്പിക്കില്ല. ഒന്നിലധികം സൂചനകൾ ഉണ്ടെങ്കിൽ തുടരുന്നതിന് മുമ്പ് നിർത്തി ഉറവിടം പരിശോധിക്കുക.',
  },
  pa: {
    concerned: 'CyberRaksha ਨੂੰ ਚਿੰਤਾ ਕਿਉਂ ਹੈ',
    found: 'CyberRaksha ਨੇ ਕੀ ਲੱਭਿਆ',
    warningSigns: 'ਤੁਹਾਡੇ ਵੱਲੋਂ ਭੇਜੀ ਜਾਣਕਾਰੀ ਵਿੱਚ ਇਹ ਚੇਤਾਵਨੀ ਸੰਕੇਤ ਮਿਲੇ ਹਨ।',
    noWarningSigns: 'ਸਾਨੂੰ ਧੋਖਾਧੜੀ ਦੇ ਕੋਈ ਖਾਸ ਚੇਤਾਵਨੀ ਸੰਕੇਤ ਨਹੀਂ ਮਿਲੇ।',
    noMajorSigns: 'ਕੋਈ ਵੱਡੇ ਚੇਤਾਵਨੀ ਸੰਕੇਤ ਨਹੀਂ ਮਿਲੇ',
    noMajorDescription:
      'ਇਸ ਵਿੱਚ ਧੋਖਾਧੜੀ ਦੇ ਸਪੱਸ਼ਟ ਸੰਕੇਤ ਨਹੀਂ ਦਿਸਦੇ। ਫਿਰ ਵੀ ਕਾਰਵਾਈ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਲਿੰਕ, ਭੁਗਤਾਨ ਅਤੇ ਸੰਵੇਦਨਸ਼ੀਲ ਜਾਣਕਾਰੀ ਦੀਆਂ ਬੇਨਤੀਆਂ ਦੀ ਜਾਂਚ ਕਰੋ।',
    warning: 'ਚੇਤਾਵਨੀ',
    info: 'ਇੱਕ ਚੇਤਾਵਨੀ ਸੰਕੇਤ ਇਕੱਲਾ ਹਮੇਸ਼ਾ ਧੋਖਾਧੜੀ ਨਹੀਂ ਦੱਸਦਾ। ਕਈ ਸੰਕੇਤ ਹੋਣ ਤੇ ਅੱਗੇ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ ਰੁਕੋ ਅਤੇ ਸਰੋਤ ਦੀ ਜਾਂਚ ਕਰੋ।',
  },
  or: {
    concerned: 'CyberRaksha କାହିଁକି ଚିନ୍ତିତ',
    found: 'CyberRaksha କଣ ପାଇଲା',
    warningSigns: 'ଆପଣ ଦେଇଥିବା ସୂଚନାରେ ଏହି ସତର୍କତା ସଙ୍କେତ ମିଳିଛି।',
    noWarningSigns: 'ଆମେ ଠକେଇର କୌଣସି ନିର୍ଦ୍ଦିଷ୍ଟ ସତର୍କତା ସଙ୍କେତ ପାଇନାହୁଁ।',
    noMajorSigns: 'କୌଣସି ବଡ଼ ସତର୍କତା ସଙ୍କେତ ମିଳିଲା ନାହିଁ',
    noMajorDescription:
      'ଏଥିରେ ସ୍ପଷ୍ଟ ଠକେଇର ସଙ୍କେତ ଦେଖାଯାଉନାହିଁ। ତଥାପି କାର୍ଯ୍ୟ କରିବା ପୂର୍ବରୁ ଲିଙ୍କ, ପେମେଣ୍ଟ ଏବଂ ସମ୍ବେଦନଶୀଳ ସୂଚନାର ଅନୁରୋଧ ଯାଞ୍ଚ କରନ୍ତୁ।',
    warning: 'ସତର୍କତା',
    info: 'ଗୋଟିଏ ସତର୍କତା ସଙ୍କେତ ଏକାକୀ ସବୁବେଳେ ଠକେଇକୁ ଦର୍ଶାଏ ନାହିଁ। ଏକାଧିକ ସଙ୍କେତ ଥିଲେ ଆଗକୁ ବଢ଼ିବା ପୂର୍ବରୁ ଅଟକି ଉତ୍ସ ଯାଞ୍ଚ କରନ୍ତୁ।',
  },
  as: {
    concerned: 'CyberRaksha কিয় চিন্তিত',
    found: 'CyberRaksha-এ কি পাইছে',
    warningSigns: 'আপুনি দিয়া তথ্যত এই সতৰ্কতাৰ সংকেতবোৰ পোৱা গৈছে।',
    noWarningSigns: 'প্ৰৱঞ্চনাৰ কোনো নিৰ্দিষ্ট সতৰ্কতাৰ সংকেত পোৱা নগ’ল।',
    noMajorSigns: 'কোনো ডাঙৰ সতৰ্কতাৰ সংকেত পোৱা নগ’ল',
    noMajorDescription:
      'ইয়াত স্পষ্ট প্ৰৱঞ্চনাৰ সংকেত দেখা নাযায়। তথাপি কোনো পদক্ষেপ লোৱাৰ আগতে লিংক, পেমেণ্ট আৰু সংবেদনশীল তথ্যৰ অনুৰোধ পৰীক্ষা কৰক।',
    warning: 'সতৰ্কতা',
    info: 'এটা সতৰ্কতাৰ সংকেতেই সদায় প্ৰৱঞ্চনা বুজাব নোৱাৰে। একাধিক সংকেত থাকিলে আগবাঢ়াৰ আগতে ৰৈ উৎসটো পৰীক্ষা কৰক।',
  },
  ne: {
    concerned: 'CyberRaksha किन चिन्तित छ',
    found: 'CyberRaksha ले के पत्ता लगायो',
    warningSigns: 'तपाईंले पठाउनुभएको सामग्रीमा यी चेतावनी संकेतहरू भेटिए।',
    noWarningSigns: 'ठगीका कुनै विशेष चेतावनी संकेत भेटिएनन्।',
    noMajorSigns: 'कुनै ठूला चेतावनी संकेत भेटिएनन्',
    noMajorDescription:
      'यसमा स्पष्ट ठगीका संकेत देखिँदैनन्। तर पनि अघि बढ्नुअघि लिंक, भुक्तानी र संवेदनशील जानकारीका अनुरोधहरू जाँच गर्नुहोस्।',
    warning: 'चेतावनी',
    info: 'एउटा चेतावनी संकेत मात्रले सधैं ठगी जनाउँदैन। धेरै संकेतहरू भए अघि बढ्नुअघि रोकिएर स्रोत जाँच गर्नुहोस्।',
  },
  kok: {
    concerned: 'CyberRaksha कशें चिंतित आसा',
    found: 'CyberRaksha कायतें सोदता',
    warningSigns: 'तुमी दिल्ल्या माहितींत हे इशारे मेळ्ळे.',
    noWarningSigns: 'आमकां फटवणुकीचे खास इशारे मेळ्ळे ना.',
    noMajorSigns: 'मोठे इशारे मेळ्ळे ना',
    noMajorDescription:
      'हातूंत फटवणुकीचे स्पश्ट संकेत दिसना. तरी कृती करचे पयलीं लिंक, पेमेंट आनी संवेदनशील माहितीची मागणी तपासात.',
    warning: 'इशारो',
    info: 'एक इशारो एकट्यान सदांच फटवणूक दाखयना. जायते इशारे आसल्यार फुडें वचचे पयलीं थांबा आनी स्रोत तपासा.',
  },
  mai: {
    concerned: 'CyberRaksha केँ चिंता किएक अछि',
    found: 'CyberRaksha की पाबि रहल अछि',
    warningSigns: 'अहाँक देल सामग्री मे ई चेतावनी संकेत भेटल।',
    noWarningSigns: 'ठगीक कोनो विशेष चेतावनी संकेत नहि भेटल।',
    noMajorSigns: 'कोनो पैघ चेतावनी संकेत नहि भेटल',
    noMajorDescription:
      'एहि मे स्पष्ट ठगीक संकेत नहि देखाइत अछि। तथापि आगाँ बढ़बा सँ पहिने लिंक, भुगतान आ संवेदनशील जानकारीक अनुरोध जाँचू।',
    warning: 'चेतावनी',
    info: 'एकटा चेतावनी संकेत मात्र सँ हमेशा ठगी सिद्ध नहि होइत अछि। कईटा संकेत हो त आगाँ बढ़बा सँ पहिने रुकि स्रोतक पुष्टि करू।',
  },
  doi: {
    concerned: 'CyberRaksha गी चिंता क्यूं ऐ',
    found: 'CyberRaksha ने केह् लब्भेआ',
    warningSigns: 'तुसें भेजी दीती जानकारी च एह् चेतावनी संकेत लब्भे न।',
    noWarningSigns: 'साढ़े गी ठगी दे कोई खास चेतावनी संकेत नेईं लब्भे।',
    noMajorSigns: 'कोई बड्डे चेतावनी संकेत नेईं लब्भे',
    noMajorDescription:
      'इस च साफ ठगी दे संकेत नेईं दिक्खी जंदे। फिर बी अग्गें बधने शा पैह्लें लिंक, भुगतान ते संवेदनशील जानकारी दी मांग दी जांच करो।',
    warning: 'चेतावनी',
    info: 'इक चेतावनी संकेत अकेला हमेशा ठगी नेईं दसदा। जे कई संकेत होन त अग्गें बधने शा पैह्लें रुक्को ते स्रोत दी जांच करो।',
  },
  brx: {
    concerned: 'CyberRaksha मा मानो हाबाफारो',
    found: 'CyberRaksha मा मा नागिरनाय',
    warningSigns: 'नों होबथायना बेसेनाव बे सावधानीनि सिगनाल नागिरनाय।',
    noWarningSigns: 'जों नोंथांनि बेसेनाव जालियाति स्कामनि सिगनाल मोनाखै।',
    noMajorSigns: 'बांद्रा सावधानीनि सिगनाल मोनाखै',
    noMajorDescription:
      'बेयाव जालियाति स्कामनि गोरोब सिगनाल नायनो मोना। नाथाय कारबाइ खालामनायनि सिगां लिंक, पेमेन्ट आरो गोसोआव नांनाय फोरमेसिनि खौरां नायबिजिर।',
    warning: 'सावधानी',
    info: 'सेबां सावधानीनि सिगनालजोंबो स्काम खालामनाय नङा। गोबां सिगनाल मोनब्ला आगोलाव थांनायनि सिगां थांनाय निफ्राय थांखा नायबिजिर।',
  },
  mni: {
    concerned: 'CyberRaksha ꯀꯔꯤꯒꯤ ꯐꯔꯦꯕꯥ',
    found: 'CyberRaksha ꯑꯗꯨꯅꯥ ꯀꯔꯤ ꯈꯪꯗꯣꯛꯂꯤ',
    warningSigns: 'ꯅꯪꯅ ꯄꯤꯔꯤꯕꯥ ꯃꯇꯦꯡꯒꯤ ꯃꯊꯛꯇꯥ ꯑꯁꯤꯒꯤ ꯍꯦꯜꯄꯇꯤ ꯁꯤꯒꯅꯥꯜ ꯂꯩꯔꯦ.',
    noWarningSigns: 'ꯁ꯭ꯀꯥꯃꯒꯤ ꯈꯔꯥ ꯍꯦꯜꯄ ꯁꯤꯒꯅꯥꯜ ꯈꯪꯗꯦ.',
    noMajorSigns: 'ꯃꯔꯨꯑꯣꯏꯕꯥ ꯍꯦꯜꯄ ꯁꯤꯒꯅꯥꯜ ꯂꯩꯇꯦ',
    noMajorDescription:
      'ꯃꯁꯤꯗꯥ ꯁ꯭ꯀꯥꯃꯒꯤ ꯆꯞ ꯁꯤꯒꯅꯥꯜ ꯌꯥꯎꯗꯦ. ꯑꯗꯨꯕꯨ ꯊꯕꯛ ꯇꯧꯔꯤꯕꯥ ꯃꯃꯥꯡꯗꯥ ꯂꯤꯡꯛ, ꯄꯦꯃꯦꯟꯇ ꯑꯃꯁꯨꯡ ꯁꯦꯟꯁꯤꯇꯤꯕ ꯏꯅꯐꯣꯔꯃꯦꯁꯟꯒꯤ ꯑꯃꯥꯡ ꯌꯦꯡꯕꯤꯌꯨ.',
    warning: 'ꯍꯦꯜꯄ',
    info: 'ꯑꯃꯥ ꯍꯦꯜꯄ ꯁꯤꯒꯅꯥꯜ ꯈꯛꯇꯅ ꯁ꯭ꯀꯥꯃ ꯍꯥꯏꯕ ꯎꯠꯄꯥ ꯉꯝꯗꯦ. ꯌꯥꯝ ꯁꯤꯒꯅꯥꯜ ꯂꯩꯔꯕꯗꯤ ꯃꯃꯥꯡꯗꯥ ꯊꯝꯃꯨꯗꯅꯥ ꯏꯁꯨ ꯌꯦꯡꯕꯤꯌꯨ.',
  },
  ks: {
    concerned: 'CyberRaksha چھُ کیوں فکر مند',
    found: 'CyberRaksha چھُ کیاہ لۄکھ',
    warningSigns: 'تُہۍ جمع کٔرِت موادس منز یہِ خبردار کرن وول نشان لۄکھ۔',
    noWarningSigns: 'کُنہِ خاص دھوکہ دہی ہُنٛد نشان نَہ لۄکھ۔',
    noMajorSigns: 'کوٚنہِ بٔڈ خبردار کرن وول نشان نَہ لۄکھ',
    noMajorDescription:
      'یِم منز صاف دھوکہ دہی ہُنٛد نشان نَہ دِژھان۔ مگر عمل کرنس پیٚٹھ لینک، پیمنٹ تہ حساس معلومات ہُنٛد درخواست ضرور چیک کٔرِو۔',
    warning: 'خبردار',
    info: 'اکھ نشان اکیلہٕ ہمیشہ دھوکہ دہی نَہ ثابت کَران۔ اگر کئی نشان آسہٕ تہٕ پَگاہ بڑھاون سۭتۍ پہلے رُکِتھ ذریعہ چیک کٔرِو۔',
  },
  sd: {
    concerned: 'CyberRaksha کي ڇو ڳڻتي آهي',
    found: 'CyberRaksha ڇا ڳولي ورتو',
    warningSigns: 'توهان جي موڪليل مواد ۾ هي خبرداري جا نشان مليا.',
    noWarningSigns: 'اسان کي فراڊ جا ڪو خاص خبرداري نشان نه مليا.',
    noMajorSigns: 'ڪو به وڏو خبرداري نشان نه مليو',
    noMajorDescription:
      'هن ۾ واضح فراڊ جا نشان نظر نٿا اچن. تنهن هوندي به عمل ڪرڻ کان اڳ لنڪ، ادائيگي ۽ حساس معلومات جي درخواستن جي تصديق ڪريو.',
    warning: 'خبرداري',
    info: 'هڪ خبرداري نشان اڪيلو هميشه فراڊ ظاهر نٿو ڪري. ڪيترائي نشان گڏ هجن ته اڳتي وڌڻ کان اڳ رڪجي ذريعو چيڪ ڪريو.',
  },
  ur: {
    concerned: 'CyberRaksha کو تشویش کیوں ہے',
    found: 'CyberRaksha نے کیا پایا',
    warningSigns: 'آپ کی جمع کردہ معلومات میں یہ انتباہی نشانیاں ملی ہیں۔',
    noWarningSigns: 'ہمیں فراڈ کی کوئی مخصوص انتباہی نشانیاں نہیں ملیں۔',
    noMajorSigns: 'کوئی بڑی انتباہی نشانی نہیں ملی',
    noMajorDescription:
      'اس میں فراڈ کی واضح علامات نظر نہیں آتیں۔ پھر بھی کارروائی سے پہلے لنکس، ادائیگیوں اور حساس معلومات کی درخواستوں کی تصدیق کریں۔',
    warning: 'انتباہ',
    info: 'صرف ایک انتباہی نشانی ہمیشہ فراڈ ثابت نہیں کرتی۔ متعدد نشانیاں ہوں تو آگے بڑھنے سے پہلے رک کر ذریعہ چیک کریں۔',
  },
  sa: {
    concerned: 'CyberRaksha किमर्थं चिन्तितम्',
    found: 'CyberRaksha किम् अन्वेषितवान्',
    warningSigns: 'भवता समर्पिते विषये एते सावधानतासङ्केताः प्राप्ताः।',
    noWarningSigns: 'वञ्चनायाः विशिष्टाः सावधानतासङ्केताः न प्राप्ताः।',
    noMajorSigns: 'मुख्याः सावधानतासङ्केताः न प्राप्ताः',
    noMajorDescription:
      'अत्र स्पष्टाः वञ्चनासङ्केताः न दृश्यन्ते। तथापि कार्यकरणात् पूर्वं लिङ्क्, भुगतानं तथा संवेदनशीलसूचनायाः अनुरोधान् परीक्षयतु।',
    warning: 'सावधानता',
    info: 'एकः सावधानतासङ्केतः एव सर्वदा वञ्चनां न सूचयति। अनेकसङ्केताः सन्ति चेत् अग्रे गमनात् पूर्वं स्थगित्वा स्रोतः परीक्षयतु।',
  },
  sat: {
    concerned: 'CyberRaksha ᱪᱤᱱᱛᱟ ᱪᱮᱫ ᱠᱟᱛᱷᱟ ᱢᱮᱱᱟ',
    found: 'CyberRaksha ᱪᱮᱫ ᱧᱮᱞ ᱠᱮᱫᱟ',
    warningSigns: 'ᱟᱢ ᱡᱟᱦᱟᱸ ᱡᱟᱹᱞᱤ ᱟᱠᱟᱱᱟ ᱢᱮ ᱱᱚᱣᱟ ᱦᱚᱥᱤᱭᱟᱹᱨ ᱪᱤᱱᱦᱟᱹ ᱧᱮᱞ ᱠᱮᱫᱟ᱾',
    noWarningSigns: 'ᱥᱠᱟᱢ ᱦᱚᱥᱤᱭᱟᱹᱨ ᱪᱤᱱᱦᱟᱹ ᱫᱚ ᱵᱟᱝ ᱧᱮᱞ ᱠᱮᱫᱟ᱾',
    noMajorSigns: 'ᱢᱟᱨᱟᱝ ᱦᱚᱥᱤᱭᱟᱹᱨ ᱪᱤᱱᱦᱟᱹ ᱵᱟᱝ ᱧᱮᱞ ᱠᱮᱫᱟ',
    noMajorDescription:
      'ᱱᱚᱣᱟ ᱨᱮ ᱥᱠᱟᱢ ᱦᱚᱥᱤᱭᱟᱹᱨ ᱪᱤᱱᱦᱟᱹ ᱵᱟᱝ ᱧᱮᱞᱚᱜ-ᱟ᱾ ᱢᱮᱱᱛᱮ ᱠᱟᱹᱢᱤ ᱠᱚᱨᱟᱣ ᱢᱟᱲᱟᱝ ᱞᱤᱝᱠ, ᱯᱮᱢᱮᱱᱴ ᱟᱨ ᱡᱟᱣᱛᱤ ᱵᱟᱹᱰᱤ ᱞᱟᱹᱜᱤᱫ ᱠᱚ ᱧᱮᱞ ᱢᱮ᱾',
    warning: 'ᱦᱚᱥᱤᱭᱟᱹᱨ',
    info: 'ᱢᱤᱫᱴᱟᱝ ᱦᱚᱥᱤᱭᱟᱹᱨ ᱪᱤᱱᱦᱟᱹ ᱮᱠᱟ ᱥᱠᱟᱢ ᱵᱟᱝ ᱥᱟᱹᱛ ᱢᱮᱱᱟ᱾ ᱜᱚᱲᱟᱹᱣ ᱪᱤᱱᱦᱟᱹ ᱠᱚ ᱡᱚᱲᱟᱣ ᱢᱮᱱᱟ ᱠᱷᱟᱱ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱡᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱨᱚᱛ ᱧᱮᱞ ᱢᱮ᱾',
  },
};

function getCopy(language: LanguageCode): RedFlagsCopy {
  const localized = COPY[language];
  return localized ? { ...EN, ...localized } : EN;
}

export function RedFlagsList({
  flags,
  category,
}: {
  flags: string[];
  category: string;
}) {
  const { language } = useLanguage();
  const copy = getCopy(language);
  const hasFlags = flags && flags.length > 0;

  return (
    <Card className="border-[#dedbd2] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#172029]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff4d6]">
                {hasFlags ? (
                  <ShieldAlert size={17} className="text-[#a56b00]" />
                ) : (
                  <CheckCircle2 size={17} className="text-[#5f7f3e]" />
                )}
              </div>

              {hasFlags ? copy.concerned : copy.found}
            </CardTitle>

            <p className="mt-1.5 ml-10 text-xs leading-relaxed text-[#687078]">
              {hasFlags ? copy.warningSigns : copy.noWarningSigns}
            </p>
          </div>

          <Badge
            variant="secondary"
            className="border-[#e2ded4] bg-[#f7f5ef] text-[11px] font-medium text-[#4d565e]"
          >
            {category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {!hasFlags ? (
          <div className="rounded-xl border border-[#dce7d2] bg-[#f3f7ef] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-[#5f7f3e]"
              />

              <div>
                <p className="text-sm font-semibold text-[#304321]">
                  {copy.noMajorSigns}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-[#5f695f]">
                  {copy.noMajorDescription}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {flags.map((flag, index) => (
              <div
                key={`${flag}-${index}`}
                className="group rounded-xl border border-[#eadfc5] bg-[#fffaf0] p-3.5 transition-colors hover:border-[#d9c894]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f7e8bb]">
                    <AlertCircle size={15} className="text-[#a56b00]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#a56b00]">
                        {copy.warning} {index + 1}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-[#343c42]">
                      {flag}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasFlags && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#d9e0e5] bg-[#f6f8f9] p-3">
            <Info size={15} className="mt-0.5 shrink-0 text-[#42658a]" />

            <p className="text-[11px] leading-relaxed text-[#59636b]">
              {copy.info}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
