'use client';

import * as React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { ScamDNA } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dna } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { LanguageCode } from '@/lib/languages';

type DnaLabel = {
  label: string;
  desc: string;
};

type DnaCopy = Record<keyof ScamDNA, DnaLabel> & {
  title: string;
  score: string;
  presence: string;
};

const EN: DnaCopy = {
  urgency: {
    label: 'Urgency',
    desc: 'Time-pressure / deadline tactics',
  },
  fear: {
    label: 'Fear',
    desc: 'Threats / legal coercion / account blocks',
  },
  impersonation: {
    label: 'Impersonation',
    desc: 'Poses as legitimate entity / bank',
  },
  suspicious_link: {
    label: 'Bad Links',
    desc: 'Shortened or phishing URLs',
  },
  payment_pressure: {
    label: 'Payment',
    desc: 'Demands advance money / UPI',
  },
  title: 'Scam DNA — Manipulation Tactics',
  score: 'Score',
  presence: 'Presence',
};

const COPY: Partial<Record<LanguageCode, Partial<DnaCopy>>> = {
  hi: {
    urgency: { label: 'जल्दबाज़ी', desc: 'समय का दबाव / समय-सीमा की रणनीति' },
    fear: { label: 'डर', desc: 'धमकी / कानूनी दबाव / खाता बंद करने की धमकी' },
    impersonation: { label: 'नकली पहचान', desc: 'बैंक या वैध संस्था होने का दिखावा' },
    suspicious_link: { label: 'खराब लिंक', desc: 'छोटे या फ़िशिंग URL' },
    payment_pressure: { label: 'भुगतान', desc: 'अग्रिम पैसे / UPI की मांग' },
    title: 'Scam DNA — हेरफेर की रणनीतियाँ',
    score: 'स्कोर',
    presence: 'उपस्थिति',
  },
  mr: {
    urgency: { label: 'घाई', desc: 'वेळेचा दबाव / अंतिम मुदतीच्या युक्त्या' },
    fear: { label: 'भीती', desc: 'धमकी / कायदेशीर दबाव / खाते बंद करण्याची धमकी' },
    impersonation: { label: 'बनावट ओळख', desc: 'बँक किंवा वैध संस्थेचे रूप घेणे' },
    suspicious_link: { label: 'धोकादायक लिंक', desc: 'शॉर्ट किंवा फिशिंग URL' },
    payment_pressure: { label: 'पेमेंट', desc: 'आधी पैसे / UPI मागणे' },
    title: 'Scam DNA — फसवणुकीच्या युक्त्या',
    score: 'स्कोअर',
    presence: 'उपस्थिती',
  },
  bn: {
    urgency: { label: 'তাড়াহুড়ো', desc: 'সময়ের চাপ / সময়সীমার কৌশল' },
    fear: { label: 'ভয়', desc: 'হুমকি / আইনি চাপ / অ্যাকাউন্ট বন্ধের হুমকি' },
    impersonation: { label: 'পরিচয় জাল', desc: 'ব্যাংক বা বৈধ প্রতিষ্ঠানের পরিচয় নেওয়া' },
    suspicious_link: { label: 'খারাপ লিংক', desc: 'শর্ট বা ফিশিং URL' },
    payment_pressure: { label: 'পেমেন্ট', desc: 'আগাম টাকা / UPI দাবি' },
    title: 'Scam DNA — প্রভাবিত করার কৌশল',
    score: 'স্কোর',
    presence: 'উপস্থিতি',
  },
  gu: {
    urgency: { label: 'તાત્કાલિકતા', desc: 'સમયનું દબાણ / સમયમર્યાદાની યુક્તિઓ' },
    fear: { label: 'ભય', desc: 'ધમકી / કાનૂની દબાણ / ખાતું બંધ કરવાની ધમકી' },
    impersonation: { label: 'બનાવટી ઓળખ', desc: 'બેંક અથવા માન્ય સંસ્થાનું સ્વરૂપ ધારણ કરવું' },
    suspicious_link: { label: 'ખરાબ લિંક', desc: 'શોર્ટ અથવા ફિશિંગ URL' },
    payment_pressure: { label: 'ચુકવણી', desc: 'આગોતરા પૈસા / UPIની માંગ' },
    title: 'Scam DNA — હેરફેરની યુક્તિઓ',
    score: 'સ્કોર',
    presence: 'ઉપસ્થિતિ',
  },
  ta: {
    urgency: { label: 'அவசரம்', desc: 'நேர அழுத்தம் / காலக்கெடு உத்திகள்' },
    fear: { label: 'பயம்', desc: 'மிரட்டல் / சட்ட அழுத்தம் / கணக்கு முடக்கம்' },
    impersonation: { label: 'ஆள்மாறாட்டம்', desc: 'வங்கி அல்லது சட்டபூர்வ நிறுவனமாக நடிப்பது' },
    suspicious_link: { label: 'தவறான இணைப்புகள்', desc: 'சுருக்கப்பட்ட அல்லது ஃபிஷிங் URLகள்' },
    payment_pressure: { label: 'பணம்', desc: 'முன்பணம் / UPI கோரிக்கை' },
    title: 'Scam DNA — ஏமாற்றும் உத்திகள்',
    score: 'மதிப்பெண்',
    presence: 'இருப்பு',
  },
  te: {
    urgency: { label: 'అత్యవసరం', desc: 'సమయ ఒత్తిడి / గడువు వ్యూహాలు' },
    fear: { label: 'భయం', desc: 'బెదిరింపులు / చట్టపరమైన ఒత్తిడి / ఖాతా బ్లాక్' },
    impersonation: { label: 'నకిలీ గుర్తింపు', desc: 'బ్యాంక్ లేదా చట్టబద్ధ సంస్థలా నటించడం' },
    suspicious_link: { label: 'చెడు లింకులు', desc: 'షార్ట్ లేదా ఫిషింగ్ URLలు' },
    payment_pressure: { label: 'చెల్లింపు', desc: 'ముందస్తు డబ్బు / UPI డిమాండ్' },
    title: 'Scam DNA — మోసపూరిత వ్యూహాలు',
    score: 'స్కోర్',
    presence: 'ఉనికి',
  },
  kn: {
    urgency: { label: 'ತುರ್ತು', desc: 'ಸಮಯದ ಒತ್ತಡ / ಗಡುವಿನ ತಂತ್ರಗಳು' },
    fear: { label: 'ಭಯ', desc: 'ಬೆದರಿಕೆ / ಕಾನೂನು ಒತ್ತಡ / ಖಾತೆ ನಿರ್ಬಂಧ' },
    impersonation: { label: 'ನಕಲಿ ಗುರುತು', desc: 'ಬ್ಯಾಂಕ್ ಅಥವಾ ಮಾನ್ಯ ಸಂಸ್ಥೆಯಂತೆ ನಟಿಸುವುದು' },
    suspicious_link: { label: 'ಕೆಟ್ಟ ಲಿಂಕ್‌ಗಳು', desc: 'ಶಾರ್ಟ್ ಅಥವಾ ಫಿಶಿಂಗ್ URLಗಳು' },
    payment_pressure: { label: 'ಪಾವತಿ', desc: 'ಮುಂಗಡ ಹಣ / UPI ಬೇಡಿಕೆ' },
    title: 'Scam DNA — ವಂಚನೆಯ ತಂತ್ರಗಳು',
    score: 'ಸ್ಕೋರ್',
    presence: 'ಉಪಸ್ಥಿತಿ',
  },
  ml: {
    urgency: { label: 'അടിയന്തരത', desc: 'സമയ സമ്മർദ്ദം / സമയപരിധി തന്ത്രങ്ങൾ' },
    fear: { label: 'ഭയം', desc: 'ഭീഷണികൾ / നിയമ സമ്മർദ്ദം / അക്കൗണ്ട് തടയൽ' },
    impersonation: { label: 'ആൾമാറാട്ടം', desc: 'ബാങ്ക് അല്ലെങ്കിൽ നിയമാനുസൃത സ്ഥാപനമായി നടിക്കുക' },
    suspicious_link: { label: 'മോശം ലിങ്കുകൾ', desc: 'ചുരുക്കിയ അല്ലെങ്കിൽ ഫിഷിംഗ് URLകൾ' },
    payment_pressure: { label: 'പേയ്മെന്റ്', desc: 'മുൻകൂർ പണം / UPI ആവശ്യപ്പെടൽ' },
    title: 'Scam DNA — കബളിപ്പിക്കൽ തന്ത്രങ്ങൾ',
    score: 'സ്കോർ',
    presence: 'സാന്നിധ്യം',
  },
  pa: {
    urgency: { label: 'ਜਲਦਬਾਜ਼ੀ', desc: 'ਸਮੇਂ ਦਾ ਦਬਾਅ / ਅੰਤਿਮ ਮਿਤੀ ਦੀਆਂ ਚਾਲਾਂ' },
    fear: { label: 'ਡਰ', desc: 'ਧਮਕੀਆਂ / ਕਾਨੂੰਨੀ ਦਬਾਅ / ਖਾਤਾ ਬੰਦ ਕਰਨ ਦੀ ਧਮਕੀ' },
    impersonation: { label: 'ਨਕਲੀ ਪਛਾਣ', desc: 'ਬੈਂਕ ਜਾਂ ਕਾਨੂੰਨੀ ਸੰਸਥਾ ਹੋਣ ਦਾ ਦਿਖਾਵਾ' },
    suspicious_link: { label: 'ਖਰਾਬ ਲਿੰਕ', desc: 'ਛੋਟੇ ਜਾਂ ਫਿਸ਼ਿੰਗ URL' },
    payment_pressure: { label: 'ਭੁਗਤਾਨ', desc: 'ਅਗਾਊਂ ਪੈਸੇ / UPI ਦੀ ਮੰਗ' },
    title: 'Scam DNA — ਹੇਰਾਫੇਰੀ ਦੀਆਂ ਚਾਲਾਂ',
    score: 'ਸਕੋਰ',
    presence: 'ਮੌਜੂਦਗੀ',
  },
  or: {
    urgency: { label: 'ତତ୍କାଳତା', desc: 'ସମୟର ଚାପ / ସମୟସୀମା କୌଶଳ' },
    fear: { label: 'ଭୟ', desc: 'ଧମକ / ଆଇନଗତ ଚାପ / ଆକାଉଣ୍ଟ ବନ୍ଦ' },
    impersonation: { label: 'ନକଲି ପରିଚୟ', desc: 'ବ୍ୟାଙ୍କ କିମ୍ବା ବୈଧ ସଂସ୍ଥା ଭାବେ ଅଭିନୟ' },
    suspicious_link: { label: 'ଖରାପ ଲିଙ୍କ', desc: 'ସଂକ୍ଷିପ୍ତ କିମ୍ବା ଫିସିଂ URL' },
    payment_pressure: { label: 'ପେମେଣ୍ଟ', desc: 'ଆଗୁଆ ଟଙ୍କା / UPI ଦାବି' },
    title: 'Scam DNA — ପ୍ରତାରଣା କୌଶଳ',
    score: 'ସ୍କୋର',
    presence: 'ଉପସ୍ଥିତି',
  },
  as: {
    urgency: { label: 'জৰুৰীতা', desc: 'সময়ৰ চাপ / সময়সীমাৰ কৌশল' },
    fear: { label: 'ভয়', desc: 'ভাবুকি / আইনী চাপ / একাউণ্ট বন্ধ' },
    impersonation: { label: 'ভুৱা পৰিচয়', desc: 'বেংক বা বৈধ প্ৰতিষ্ঠানৰ ৰূপ ধৰা' },
    suspicious_link: { label: 'বেয়া লিংক', desc: 'চুটি বা ফিছিং URL' },
    payment_pressure: { label: 'পেমেণ্ট', desc: 'আগধন / UPI বিচৰা' },
    title: 'Scam DNA — প্ৰভাৱ পেলোৱাৰ কৌশল',
    score: 'স্ক’ৰ',
    presence: 'উপস্থিতি',
  },
  ne: {
    urgency: { label: 'हतार', desc: 'समयको दबाब / समयसीमा रणनीति' },
    fear: { label: 'डर', desc: 'धम्की / कानुनी दबाब / खाता बन्द' },
    impersonation: { label: 'नक्कली पहिचान', desc: 'बैंक वा वैध संस्थाको रूपमा प्रस्तुत हुनु' },
    suspicious_link: { label: 'खराब लिङ्क', desc: 'छोटो वा फिसिङ URL' },
    payment_pressure: { label: 'भुक्तानी', desc: 'अग्रिम पैसा / UPI माग' },
    title: 'Scam DNA — हेरफेरका रणनीतिहरू',
    score: 'स्कोर',
    presence: 'उपस्थिति',
  },
  kok: {
    urgency: { label: 'घाई', desc: 'वेळेचो दबाव / मुदतीच्या युक्त्यो' },
    fear: { label: 'भंय', desc: 'धमकी / कायदेशीर दबाव / खातें बंद करपाची धमकी' },
    impersonation: { label: 'बनावट ओळख', desc: 'बँक वा कायदेशीर संस्थेची नक्कल' },
    suspicious_link: { label: 'वाईट लिंक', desc: 'शॉर्ट वा फिशिंग URL' },
    payment_pressure: { label: 'पेमेंट', desc: 'आगावू पयशे / UPI मागणी' },
    title: 'Scam DNA — फटोवणुकीच्या युक्त्यो',
    score: 'स्कोर',
    presence: 'उपस्थिती',
  },
  mai: {
    urgency: { label: 'जल्दबाजी', desc: 'समयक दबाव / समयसीमाक युक्ति' },
    fear: { label: 'डर', desc: 'धमकी / कानूनी दबाव / खाता बन्द' },
    impersonation: { label: 'नकली पहचान', desc: 'बैंक वा वैध संस्थाक रूप धरब' },
    suspicious_link: { label: 'खराब लिंक', desc: 'छोट वा फिशिंग URL' },
    payment_pressure: { label: 'भुगतान', desc: 'अग्रिम पैसा / UPI माँग' },
    title: 'Scam DNA — ठगीक युक्ति',
    score: 'स्कोर',
    presence: 'उपस्थिति',
  },
  doi: {
    urgency: { label: 'जल्दी', desc: 'समें दा दबाव / समय सीमा दी चाल' },
    fear: { label: 'डर', desc: 'धमकी / कानूनी दबाव / खाता बंद' },
    impersonation: { label: 'नकली पन्छान', desc: 'बैंक जां जायज संस्था आंह्गर बनना' },
    suspicious_link: { label: 'खराब लिंक', desc: 'छोटे जां फिशिंग URL' },
    payment_pressure: { label: 'भुगतान', desc: 'अग्गे पैसे / UPI दी मंग' },
    title: 'Scam DNA — ठगी दी चालां',
    score: 'स्कोर',
    presence: 'मौजूदगी',
  },
  brx: {
    urgency: { label: 'जौगिया', desc: 'समायनि दबाब / समाय सिमा नि चाल' },
    fear: { label: 'खोसो', desc: 'धमकि / आइनि दबाब / एकाउन्ट बन्द' },
    impersonation: { label: 'नखल सान्दार', desc: 'बेंक बा जाथाय संस्था निफ्राय जों' },
    suspicious_link: { label: 'गोब्राब लिंक', desc: 'सर्ट बा फिसिं लिंक' },
    payment_pressure: { label: 'पेमेन्ट', desc: 'सिगांनि रां / UPI नायनाय' },
    title: 'Scam DNA — गोसो होनाय चाल',
    score: 'स्कोर',
    presence: 'दं',
  },
  mni: {
    urgency: { label: 'ꯇꯥꯡꯂꯤꯕꯥ', desc: 'ꯃꯇꯝꯒꯤ ꯄ꯭ꯔꯦꯁꯔ / ꯃꯇꯝ ꯂꯣꯏꯁꯤꯡ' },
    fear: { label: 'ꯀꯤꯕꯥ', desc: 'ꯍꯧꯔꯥꯡ / ꯂꯥꯏꯁꯤꯡꯒꯤ ꯄ꯭ꯔꯦꯁꯔ / ꯑꯦꯀꯥꯎꯟꯇ ꯕ꯭ꯂꯣꯛ' },
    impersonation: { label: 'ꯅꯀꯜ ꯃꯤꯇꯦꯡ', desc: 'ꯕꯦꯡꯛ ꯅꯠꯇ꯭ꯔꯒꯥ ꯃꯇꯦꯡ ꯄꯤꯕꯒꯤ ꯃꯐꯝ ꯑꯣꯏꯕꯥ' },
    suspicious_link: { label: 'ꯑꯁꯥꯏꯕꯥ ꯂꯤꯡꯛ', desc: 'ꯁ꯭ꯇ꯭ꯔꯤꯡ ꯅꯠꯇ꯭ꯔꯒꯥ ꯐꯤꯁꯤꯡ URL' },
    payment_pressure: { label: 'ꯄꯦꯃꯦꯟꯇ', desc: 'ꯃꯃꯥꯡꯒꯤ ꯆꯥꯎꯕꯥ ꯁꯦꯟ / UPI' },
    title: 'Scam DNA — ꯃꯤꯌꯥꯝ ꯍꯥꯏꯕꯒꯤ ꯃꯔꯣꯜ',
    score: 'ꯁ꯭ꯀꯣꯔ',
    presence: 'ꯂꯩꯕꯥ',
  },
  ks: {
    urgency: { label: 'جلدی', desc: 'وقتس دباؤ / آخری وقتس چال' },
    fear: { label: 'ڈر', desc: 'دھمکی / قانونی دباؤ / کھاتہ بند' },
    impersonation: { label: 'جعلی شناخت', desc: 'بینک یا جائز ادارے ہُند روپ دھارُن' },
    suspicious_link: { label: 'خراب لنک', desc: 'مختصر یا فِشنگ URL' },
    payment_pressure: { label: 'ادائیگی', desc: 'پیشگی پیسہ / UPI ہُنٛد مطالبہ' },
    title: 'Scam DNA — چالاکی ہُنٛد طریقہ',
    score: 'اسکور',
    presence: 'موجودگی',
  },
  sd: {
    urgency: { label: 'جلدي', desc: 'وقت جو دٻاءُ / آخري مدي جون چالون' },
    fear: { label: 'ڊپ', desc: 'ڌمڪيون / قانوني دٻاءُ / اڪائونٽ بند' },
    impersonation: { label: 'نقلي سڃاڻپ', desc: 'بئنڪ يا جائز اداري وانگر ظاهر ٿيڻ' },
    suspicious_link: { label: 'خراب لنڪ', desc: 'مختصر يا فشنگ URL' },
    payment_pressure: { label: 'ادائيگي', desc: 'اڳواٽ پئسا / UPI جي گهر' },
    title: 'Scam DNA — دوکي جون چالون',
    score: 'اسڪور',
    presence: 'موجودگي',
  },
  ur: {
    urgency: { label: 'جلد بازی', desc: 'وقت کا دباؤ / آخری تاریخ کی چالیں' },
    fear: { label: 'خوف', desc: 'دھمکیاں / قانونی دباؤ / اکاؤنٹ بند کرنا' },
    impersonation: { label: 'جعلی شناخت', desc: 'بینک یا جائز ادارے کا روپ دھارنا' },
    suspicious_link: { label: 'خراب لنکس', desc: 'مختصر یا فشنگ URL' },
    payment_pressure: { label: 'ادائیگی', desc: 'پیشگی رقم / UPI کا مطالبہ' },
    title: 'Scam DNA — دھوکے کی حکمت عملیاں',
    score: 'اسکور',
    presence: 'موجودگی',
  },
  sa: {
    urgency: { label: 'शीघ्रता', desc: 'समयदबावः / समयसीमायाः युक्तयः' },
    fear: { label: 'भयम्', desc: 'धमकी / कानूनीदबावः / खातानिरोधः' },
    impersonation: { label: 'कपटपरिचयः', desc: 'बैंकस्य वैधसंस्थायाः वा रूपधारणम्' },
    suspicious_link: { label: 'दुष्टलिङ्क्', desc: 'संक्षिप्ताः वा फिशिङ्ग् URL' },
    payment_pressure: { label: 'भुगतानम्', desc: 'अग्रिमधनस्य / UPI इत्यस्य आग्रहः' },
    title: 'Scam DNA — छलयुक्तयः',
    score: 'अङ्कः',
    presence: 'उपस्थितिः',
  },
  sat: {
    urgency: { label: 'ᱡᱚᱞᱫᱤ', desc: 'ᱚᱠᱛᱚ ᱫᱟᱵᱟᱵ / ᱚᱠᱛᱚ ᱥᱤᱢᱟ ᱪᱟᱞ' },
    fear: { label: 'ᱵᱷᱚᱭ', desc: 'ᱫᱷᱚᱢᱠᱤ / ᱠᱟᱱᱩᱱᱤ ᱫᱟᱵᱟᱵ / ᱠᱷᱟᱛᱟ ᱵᱚᱱᱫᱽ' },
    impersonation: { label: 'ᱡᱟᱞᱤ ᱯᱚᱪᱷᱟᱱ', desc: 'ᱵᱮᱝᱠ ᱵᱟ ᱡᱟᱹᱛᱤ ᱥᱚᱱᱥᱛᱷᱟ ᱞᱮᱠᱟ ᱥᱟᱡᱟᱣ' },
    suspicious_link: { label: 'ᱵᱟᱹᱝ ᱞᱤᱝᱠ', desc: 'ᱪᱷᱚᱴ ᱵᱟ ᱯᱷᱤᱥᱤᱝ URL' },
    payment_pressure: { label: 'ᱯᱮᱢᱮᱱᱴ', desc: 'ᱞᱟᱦᱟᱱᱛᱤ ᱯᱟᱹᱭᱥᱟ / UPI ᱦᱚᱲ' },
    title: 'Scam DNA — ᱫᱷᱚᱠᱟ ᱠᱟᱹᱢᱤ ᱠᱚ',
    score: 'ᱥᱠᱳᱨ',
    presence: 'ᱧᱮᱞ ᱫᱚ',
  },
};

function getCopy(language: LanguageCode): DnaCopy {
  const localized = COPY[language];
  if (!localized) return EN;

  return {
    ...EN,
    ...localized,
    urgency: { ...EN.urgency, ...(localized.urgency ?? {}) },
    fear: { ...EN.fear, ...(localized.fear ?? {}) },
    impersonation: {
      ...EN.impersonation,
      ...(localized.impersonation ?? {}),
    },
    suspicious_link: {
      ...EN.suspicious_link,
      ...(localized.suspicious_link ?? {}),
    },
    payment_pressure: {
      ...EN.payment_pressure,
      ...(localized.payment_pressure ?? {}),
    },
  };
}

export function ScamDNAChart({ dna }: { dna: ScamDNA }) {
  const { language } = useLanguage();
  const copy = getCopy(language);

  const data = (Object.keys(EN).filter(
    (key) =>
      key !== 'title' &&
      key !== 'score' &&
      key !== 'presence'
  ) as (keyof ScamDNA)[]).map((key) => ({
    tactic: copy[key].label,
    score: dna[key],
    fullMark: 100,
    description: copy[key].desc,
  }));

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-200">
          <Dna size={16} className="text-teal-400" />
          {copy.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="h-[220px] w-full">
          <ResponsiveContainer>
            <RadarChart data={data} outerRadius="75%">
              <PolarGrid stroke="#27272a" />

              <PolarAngleAxis
                dataKey="tactic"
                tick={{
                  fill: '#a1a1aa',
                  fontSize: 11,
                }}
              />

              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{
                  fill: '#52525b',
                  fontSize: 9,
                }}
                axisLine={false}
              />

              <Radar
                name={copy.score}
                dataKey="score"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.25}
                strokeWidth={1.5}
              />

              <Tooltip
                contentStyle={{
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{
                  color: '#f4f4f5',
                }}
                itemStyle={{
                  color: '#2dd4bf',
                }}
                formatter={(value: number) => [
                  `${value} / 100`,
                  copy.presence,
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {data.map((item) => (
            <div
              key={item.tactic}
              className="text-center p-1.5 rounded-lg bg-zinc-950 border border-zinc-800/80"
            >
              <div className="text-[10px] text-zinc-400 truncate">
                {item.tactic}
              </div>

              <div
                className="mt-0.5 text-sm font-semibold font-mono tabular-nums"
                style={{
                  color:
                    item.score >= 70
                      ? '#ef4444'
                      : item.score >= 40
                        ? '#f59e0b'
                        : '#10b981',
                }}
              >
                {item.score}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
