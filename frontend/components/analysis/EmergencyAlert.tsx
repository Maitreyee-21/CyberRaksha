'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { SecurityEvaluation } from '@/lib/security';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { LanguageCode } from '@/lib/languages';

interface EmergencyAlertProps {
  open: boolean;
  onDismiss: () => void;
  security?: SecurityEvaluation | null;
  riskScore: number;
  scamCategory: string;
  detectedUrls: string[];
}

type EmergencyCopy = {
  emergency: string;
  warning: string;
  dangerous: string;
  highRisk: string;
  riskDescription: string;
  whyFlagged: string;
  destination: string;
  whatToDo: string;
  acknowledge: string;
};

const EN: EmergencyCopy = {
  emergency: 'Emergency Cyber Alert',
  warning: 'Cyber Security Warning',
  dangerous: 'Potentially Dangerous Destination',
  highRisk: 'High-Risk Scam Alert',
  riskDescription:
    'CyberRaksha applies a deterministic safety policy before allowing navigation.',
  whyFlagged: 'Why this was flagged',
  destination: 'Blocked / flagged destination',
  whatToDo: 'What you should do',
  acknowledge: 'Acknowledge & View Details',
};

const COPY: Partial<Record<LanguageCode, Partial<EmergencyCopy>>> = {
  hi: {
    emergency: 'आपातकालीन साइबर अलर्ट',
    warning: 'साइबर सुरक्षा चेतावनी',
    dangerous: 'संभावित रूप से खतरनाक गंतव्य',
    highRisk: 'उच्च-जोखिम घोटाला अलर्ट',
    riskDescription:
      'नेविगेशन की अनुमति देने से पहले CyberRaksha एक निर्धारित सुरक्षा नीति लागू करता है।',
    whyFlagged: 'इसे क्यों चिह्नित किया गया',
    destination: 'ब्लॉक / चिह्नित गंतव्य',
    whatToDo: 'आपको क्या करना चाहिए',
    acknowledge: 'समझ गया और विवरण देखें',
  },
  mr: {
    emergency: 'आपत्कालीन सायबर इशारा',
    warning: 'सायबर सुरक्षा चेतावणी',
    dangerous: 'संभाव्य धोकादायक गंतव्य',
    highRisk: 'उच्च-जोखीम घोटाळा इशारा',
    riskDescription:
      'नेव्हिगेशनला परवानगी देण्यापूर्वी CyberRaksha निश्चित सुरक्षा धोरण लागू करते.',
    whyFlagged: 'हे का चिन्हांकित केले',
    destination: 'ब्लॉक / चिन्हांकित गंतव्य',
    whatToDo: 'तुम्ही काय करावे',
    acknowledge: 'समजले आणि तपशील पहा',
  },
  bn: {
    emergency: 'জরুরি সাইবার সতর্কতা',
    warning: 'সাইবার নিরাপত্তা সতর্কতা',
    dangerous: 'সম্ভাব্য বিপজ্জনক গন্তব্য',
    highRisk: 'উচ্চ-ঝুঁকির প্রতারণা সতর্কতা',
    riskDescription: 'নেভিগেশনের অনুমতি দেওয়ার আগে CyberRaksha একটি নির্ধারিত নিরাপত্তা নীতি প্রয়োগ করে।',
    whyFlagged: 'কেন এটি চিহ্নিত হয়েছে',
    destination: 'ব্লক / চিহ্নিত গন্তব্য',
    whatToDo: 'আপনার কী করা উচিত',
    acknowledge: 'বুঝেছি এবং বিস্তারিত দেখুন',
  },
  gu: {
    emergency: 'કટોકટી સાયબર ચેતવણી',
    warning: 'સાયબર સુરક્ષા ચેતવણી',
    dangerous: 'સંભવિત જોખમી ગંતવ્ય',
    highRisk: 'ઉચ્ચ જોખમની છેતરપિંડી ચેતવણી',
    riskDescription: 'નેવિગેશનની મંજૂરી આપતા પહેલાં CyberRaksha નિર્ધારિત સુરક્ષા નીતિ લાગુ કરે છે.',
    whyFlagged: 'આને શા માટે ચિહ્નિત કરવામાં આવ્યું',
    destination: 'બ્લોક / ચિહ્નિત ગંતવ્ય',
    whatToDo: 'તમારે શું કરવું જોઈએ',
    acknowledge: 'સમજ્યું અને વિગતો જુઓ',
  },
  ta: {
    emergency: 'அவசர சைபர் எச்சரிக்கை',
    warning: 'சைபர் பாதுகாப்பு எச்சரிக்கை',
    dangerous: 'ஆபத்தானதாக இருக்கக்கூடிய இலக்கு',
    highRisk: 'அதிக ஆபத்து மோசடி எச்சரிக்கை',
    riskDescription: 'வழிசெலுத்தலை அனுமதிக்கும் முன் CyberRaksha ஒரு நிர்ணயிக்கப்பட்ட பாதுகாப்புக் கொள்கையைப் பயன்படுத்துகிறது.',
    whyFlagged: 'இது ஏன் குறிக்கப்பட்டது',
    destination: 'தடுக்கப்பட்ட / குறிக்கப்பட்ட இலக்கு',
    whatToDo: 'நீங்கள் என்ன செய்ய வேண்டும்',
    acknowledge: 'புரிந்துகொண்டேன் & விவரங்களைக் காண்க',
  },
  te: {
    emergency: 'అత్యవసర సైబర్ హెచ్చరిక',
    warning: 'సైబర్ భద్రతా హెచ్చరిక',
    dangerous: 'ప్రమాదకరమైన గమ్యం కావచ్చు',
    highRisk: 'అధిక-ప్రమాద మోసం హెచ్చరిక',
    riskDescription: 'నావిగేషన్‌కు అనుమతి ఇచ్చే ముందు CyberRaksha నిర్ణీత భద్రతా విధానాన్ని అమలు చేస్తుంది.',
    whyFlagged: 'ఇది ఎందుకు గుర్తించబడింది',
    destination: 'బ్లాక్ / గుర్తించిన గమ్యం',
    whatToDo: 'మీరు ఏమి చేయాలి',
    acknowledge: 'అర్థమైంది & వివరాలు చూడండి',
  },
  kn: {
    emergency: 'ತುರ್ತು ಸೈಬರ್ ಎಚ್ಚರಿಕೆ',
    warning: 'ಸೈಬರ್ ಭದ್ರತಾ ಎಚ್ಚರಿಕೆ',
    dangerous: 'ಅಪಾಯಕಾರಿ ಗಮ್ಯಸ್ಥಾನವಾಗಿರಬಹುದು',
    highRisk: 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಂಚನೆ ಎಚ್ಚರಿಕೆ',
    riskDescription: 'ನ್ಯಾವಿಗೇಶನ್‌ಗೆ ಅನುಮತಿ ನೀಡುವ ಮೊದಲು CyberRaksha ನಿಗದಿತ ಭದ್ರತಾ ನೀತಿಯನ್ನು ಅನ್ವಯಿಸುತ್ತದೆ.',
    whyFlagged: 'ಇದನ್ನು ಏಕೆ ಗುರುತಿಸಲಾಗಿದೆ',
    destination: 'ನಿರ್ಬಂಧಿತ / ಗುರುತಿಸಲಾದ ಗಮ್ಯಸ್ಥಾನ',
    whatToDo: 'ನೀವು ಏನು ಮಾಡಬೇಕು',
    acknowledge: 'ಅರ್ಥವಾಯಿತು ಮತ್ತು ವಿವರಗಳನ್ನು ನೋಡಿ',
  },
  ml: {
    emergency: 'അടിയന്തര സൈബർ മുന്നറിയിപ്പ്',
    warning: 'സൈബർ സുരക്ഷാ മുന്നറിയിപ്പ്',
    dangerous: 'അപകടകരമായേക്കാവുന്ന ലക്ഷ്യസ്ഥാനം',
    highRisk: 'ഉയർന്ന അപകടസാധ്യതയുള്ള തട്ടിപ്പ് മുന്നറിയിപ്പ്',
    riskDescription: 'നാവിഗേഷൻ അനുവദിക്കുന്നതിന് മുമ്പ് CyberRaksha നിർദ്ദിഷ്ട സുരക്ഷാ നയം പ്രയോഗിക്കുന്നു.',
    whyFlagged: 'ഇത് എന്തുകൊണ്ട് അടയാളപ്പെടുത്തി',
    destination: 'തടഞ്ഞ / അടയാളപ്പെടുത്തിയ ലക്ഷ്യസ്ഥാനം',
    whatToDo: 'നിങ്ങൾ എന്ത് ചെയ്യണം',
    acknowledge: 'മനസ്സിലായി & വിശദാംശങ്ങൾ കാണുക',
  },
  pa: {
    emergency: 'ਐਮਰਜੈਂਸੀ ਸਾਈਬਰ ਚੇਤਾਵਨੀ',
    warning: 'ਸਾਈਬਰ ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀ',
    dangerous: 'ਸੰਭਾਵਿਤ ਖਤਰਨਾਕ ਟਿਕਾਣਾ',
    highRisk: 'ਉੱਚ-ਖਤਰੇ ਵਾਲੀ ਧੋਖਾਧੜੀ ਚੇਤਾਵਨੀ',
    riskDescription: 'ਨੇਵੀਗੇਸ਼ਨ ਦੀ ਇਜਾਜ਼ਤ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ CyberRaksha ਨਿਰਧਾਰਤ ਸੁਰੱਖਿਆ ਨੀਤੀ ਲਾਗੂ ਕਰਦਾ ਹੈ।',
    whyFlagged: 'ਇਸ ਨੂੰ ਕਿਉਂ ਚਿੰਨ੍ਹਿਤ ਕੀਤਾ ਗਿਆ',
    destination: 'ਬਲੌਕ / ਚਿੰਨ੍ਹਿਤ ਟਿਕਾਣਾ',
    whatToDo: 'ਤੁਹਾਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ',
    acknowledge: 'ਸਮਝ ਗਿਆ ਅਤੇ ਵੇਰਵੇ ਵੇਖੋ',
  },
  or: {
    emergency: 'ଜରୁରୀ ସାଇବର ସତର୍କତା',
    warning: 'ସାଇବର ସୁରକ୍ଷା ସତର୍କତା',
    dangerous: 'ସମ୍ଭାବ୍ୟ ବିପଜ୍ଜନକ ଗନ୍ତବ୍ୟ',
    highRisk: 'ଉଚ୍ଚ-ବିପଦ ଠକେଇ ସତର୍କତା',
    riskDescription: 'ନେଭିଗେସନ୍ ଅନୁମତି ଦେବା ପୂର୍ବରୁ CyberRaksha ଏକ ନିର୍ଦ୍ଧାରିତ ସୁରକ୍ଷା ନୀତି ପ୍ରୟୋଗ କରେ।',
    whyFlagged: 'ଏହାକୁ କାହିଁକି ଚିହ୍ନିତ କରାଯାଇଛି',
    destination: 'ବ୍ଲକ୍ / ଚିହ୍ନିତ ଗନ୍ତବ୍ୟ',
    whatToDo: 'ଆପଣ କଣ କରିବା ଉଚିତ',
    acknowledge: 'ବୁଝିଲି ଏବଂ ବିବରଣୀ ଦେଖନ୍ତୁ',
  },
  as: {
    emergency: 'জৰুৰী চাইবাৰ সতৰ্কতা',
    warning: 'চাইবাৰ সুৰক্ষা সতৰ্কতা',
    dangerous: 'সম্ভাৱ্য বিপজ্জনক গন্তব্য',
    highRisk: 'উচ্চ-বিপদৰ প্ৰৱঞ্চনা সতৰ্কতা',
    riskDescription: 'নেভিগেচনৰ অনুমতি দিয়াৰ আগতে CyberRaksha-এ এটা নিৰ্ধাৰিত সুৰক্ষা নীতি প্ৰয়োগ কৰে।',
    whyFlagged: 'ইয়াক কিয় চিহ্নিত কৰা হৈছে',
    destination: 'ব্লক / চিহ্নিত গন্তব্য',
    whatToDo: 'আপুনি কি কৰিব লাগে',
    acknowledge: 'বুজিলোঁ আৰু বিৱৰণ চাওক',
  },
  ne: {
    emergency: 'आपतकालीन साइबर चेतावनी',
    warning: 'साइबर सुरक्षा चेतावनी',
    dangerous: 'सम्भावित खतरनाक गन्तव्य',
    highRisk: 'उच्च जोखिम ठगी चेतावनी',
    riskDescription: 'नेभिगेसन अनुमति दिनुअघि CyberRaksha ले निर्धारित सुरक्षा नीति लागू गर्छ।',
    whyFlagged: 'यसलाई किन चिन्ह लगाइयो',
    destination: 'ब्लक / चिन्ह लगाइएको गन्तव्य',
    whatToDo: 'तपाईंले के गर्नुपर्छ',
    acknowledge: 'बुझें र विवरण हेर्नुहोस्',
  },
  kok: {
    emergency: 'आपत्कालीन सायबर इशारो',
    warning: 'सायबर सुरक्षा इशारो',
    dangerous: 'धोको आसपी शकता आशिल्लें जागो',
    highRisk: 'चड धोका फटवणूक इशारो',
    riskDescription: 'नेव्हिगेशनाक परवानगी दिवचे पयलीं CyberRaksha एक नेमिल्ली सुरक्षा नीती लागू करता.',
    whyFlagged: 'हें कित्याक चिन्हीत जालें',
    destination: 'ब्लॉक / चिन्हीत जागो',
    whatToDo: 'तुमी कितें करपाक जाय',
    acknowledge: 'समजलें आनी तपशील पळोवात',
  },
  mai: {
    emergency: 'आपातकालीन साइबर चेतावनी',
    warning: 'साइबर सुरक्षा चेतावनी',
    dangerous: 'संभावित खतरनाक गन्तव्य',
    highRisk: 'उच्च जोखिम ठगी चेतावनी',
    riskDescription: 'नेविगेशनक अनुमति देबाक पहिने CyberRaksha निर्धारित सुरक्षा नीति लागू करैत अछि।',
    whyFlagged: 'एकरा किएक चिन्हित कएल गेल',
    destination: 'ब्लॉक / चिन्हित गन्तव्य',
    whatToDo: 'अहाँ केँ की करबाक चाही',
    acknowledge: 'बुझलहुँ आ विवरण देखू',
  },
  doi: {
    emergency: 'आपातकालीन साइबर चेतावनी',
    warning: 'साइबर सुरक्षा चेतावनी',
    dangerous: 'संभावित खतरनाक मंजिल',
    highRisk: 'उच्च-जोखिम ठगी चेतावनी',
    riskDescription: 'नेविगेशन दी इजाजत देने शा पैह्लें CyberRaksha तय सुरक्षा नीति लागू करदा ऐ।',
    whyFlagged: 'एह् गी क्यूं चिन्हत कीता गेआ',
    destination: 'ब्लॉक / चिन्हत मंजिल',
    whatToDo: 'तुसें केह् करना चाहिदा',
    acknowledge: 'समझी गेआ ते विवरण दिक्खो',
  },
  brx: {
    emergency: 'जरुरि साइबर सावधान',
    warning: 'साइबर रैखाथि सावधान',
    dangerous: 'बोसो गोरोब जायगा जानो हागौ',
    highRisk: 'बांद्रा खैफोद स्काम सावधान',
    riskDescription: 'नेभिगेसननि अनुमोदानि सिगां CyberRaksha थि रैखाथि नीति बाहायो।',
    whyFlagged: 'बेयो मानो चिन्हित',
    destination: 'ब्लक / चिन्हित जायगा',
    whatToDo: 'नों मा खालामनो नांगौ',
    acknowledge: 'बुजिगोन आरो बिबरन नाय',
  },
  mni: {
    emergency: 'ꯑꯦꯃꯔꯖꯦꯟꯁꯤ ꯁꯥꯏꯕꯔ ꯍꯦꯜꯄ',
    warning: 'ꯁꯥꯏꯕꯔ ꯁꯦꯐꯇꯤ ꯍꯦꯜꯄ',
    dangerous: 'ꯍꯥꯏꯔꯕꯥ ꯃꯐꯝ ꯌꯥꯝ ꯑꯥꯄꯥꯏꯕꯥ ꯑꯣꯏꯕꯥ',
    highRisk: 'ꯑꯇꯤꯀꯥ ꯔꯤꯁ꯭ꯛ ꯁ꯭ꯀꯥꯃ ꯍꯦꯜꯄ',
    riskDescription: 'ꯅꯦꯕꯤꯒꯦꯁꯟ ꯇꯧꯕꯒꯤ ꯃꯃꯥꯡꯗꯥ CyberRaksha ꯁꯦꯐꯇꯤ ꯄꯣꯂꯤꯁꯤ ꯁꯤꯗꯥ ꯁꯤꯕꯥ꯫',
    whyFlagged: 'ꯀꯔꯤꯒꯤ ꯃꯁꯤ ꯃꯥꯔꯛ ꯇꯧꯔꯦ',
    destination: 'ꯕ꯭ꯂꯣꯛ / ꯃꯥꯔꯛ ꯇꯧꯔꯕꯥ ꯃꯐꯝ',
    whatToDo: 'ꯅꯪꯅ ꯀꯔꯤ ꯇꯧꯒꯗꯕꯥ',
    acknowledge: 'ꯈꯪꯂꯦ ꯑꯃꯁꯨꯡ ꯗꯤꯇꯦꯜꯁ ꯌꯦꯡꯕꯤꯌꯨ',
  },
  ks: {
    emergency: 'ہنگامی سائبر خبردار',
    warning: 'سائبر حفاظتی خبردار',
    dangerous: 'ممکنہ طور خطرناک منزل',
    highRisk: 'زیادہ خطرے ہُنٛد فراڈ خبردار',
    riskDescription: 'نیویگیشن اجازت دِنس پیٚٹھ پہلے CyberRaksha مقرر حفاظتی پالیسی لاگو کران۔',
    whyFlagged: 'یہِ کیوں نشان زد کٔرِتھ',
    destination: 'بلاک / نشان زد منزل',
    whatToDo: 'تُہۍ کیاہ کٔرِو',
    acknowledge: 'سمجھ آو تہٕ تفصیل دِژِو',
  },
  sd: {
    emergency: 'ايمرجنسي سائبر خبرداري',
    warning: 'سائبر سيڪيورٽي خبرداري',
    dangerous: 'ممڪن طور خطرناڪ منزل',
    highRisk: 'وڏي خطري واري فراڊ جي خبرداري',
    riskDescription: 'نيويگيشن جي اجازت ڏيڻ کان اڳ CyberRaksha مقرر حفاظتي پاليسي لاڳو ڪري ٿو.',
    whyFlagged: 'هن کي ڇو نشان لڳايو ويو',
    destination: 'بلاڪ / نشان لڳايل منزل',
    whatToDo: 'توهان کي ڇا ڪرڻ گهرجي',
    acknowledge: 'سمجهيم ۽ تفصيل ڏسو',
  },
  ur: {
    emergency: 'ہنگامی سائبر انتباہ',
    warning: 'سائبر سیکیورٹی انتباہ',
    dangerous: 'ممکنہ طور پر خطرناک منزل',
    highRisk: 'زیادہ خطرے کی فراڈ وارننگ',
    riskDescription: 'نیویگیشن کی اجازت دینے سے پہلے CyberRaksha ایک مقررہ حفاظتی پالیسی لاگو کرتا ہے۔',
    whyFlagged: 'اسے کیوں نشان زد کیا گیا',
    destination: 'بلاک / نشان زد منزل',
    whatToDo: 'آپ کو کیا کرنا چاہیے',
    acknowledge: 'سمجھ گیا اور تفصیلات دیکھیں',
  },
  sa: {
    emergency: 'आपत्कालीन साइबर चेतावनी',
    warning: 'साइबरसुरक्षा चेतावनी',
    dangerous: 'सम्भाव्यं भयङ्करं गन्तव्यम्',
    highRisk: 'उच्चजोखिमस्य वञ्चनासूचना',
    riskDescription: 'नेविगेशनस्य अनुमतिं दातुं पूर्वं CyberRaksha नियतां सुरक्षानीतिं प्रयुङ्क्ते।',
    whyFlagged: 'एतत् किमर्थं चिह्नितम्',
    destination: 'अवरुद्धं / चिह्नितं गन्तव्यम्',
    whatToDo: 'भवता किं करणीयम्',
    acknowledge: 'अवगतम् तथा विवरणं पश्यतु',
  },
  sat: {
    emergency: 'ᱡᱚᱨᱩᱨᱤ ᱥᱟᱭᱵᱟᱨ ᱦᱚᱥᱤᱭᱟᱹᱨ',
    warning: 'ᱥᱟᱭᱵᱟᱨ ᱥᱩᱨᱟᱠᱷᱟ ᱦᱚᱥᱤᱭᱟᱹᱨ',
    dangerous: 'ᱦᱚᱲᱚ ᱵᱟᱝ ᱥᱩᱨᱟᱠᱷᱤᱛ ᱡᱟᱭᱜᱟ',
    highRisk: 'ᱢᱟᱨᱟᱝ ᱡᱚᱠᱷᱚᱢ ᱥᱠᱟᱢ ᱦᱚᱥᱤᱭᱟᱹᱨ',
    riskDescription: 'ᱱᱟᱣᱤᱜᱮᱥᱚᱱ ᱪᱟᱞᱩ ᱢᱟᱲᱟᱝ CyberRaksha ᱢᱤᱫ ᱱᱤᱭᱚᱢᱤᱛ ᱥᱩᱨᱟᱠᱷᱟ ᱱᱤᱛᱤ ᱞᱟᱹᱜᱩᱜ-ᱟ᱾',
    whyFlagged: 'ᱱᱚᱣᱟ ᱪᱮᱫ ᱞᱟᱹᱜᱤᱫ ᱪᱤᱱᱦᱟᱹ ᱢᱮᱱᱟ',
    destination: 'ᱵᱞᱚᱠ / ᱪᱤᱱᱦᱟᱹ ᱡᱟᱭᱜᱟ',
    whatToDo: 'ᱟᱢ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱢᱮ',
    acknowledge: 'ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ ᱟᱨ ᱵᱤᱵᱨᱚᱱ ᱧᱮᱞ ᱢᱮ',
  },
};

function getCopy(language: LanguageCode): EmergencyCopy {
  const localized = COPY[language];
  return localized ? { ...EN, ...localized } : EN;
}

export function EmergencyAlert({
  open,
  onDismiss,
  security,
  riskScore,
  scamCategory,
  detectedUrls,
}: EmergencyAlertProps) {
  const { language } = useLanguage();
  const t = getCopy(language);

  const isHigh =
    security?.risk_level === 'HIGH' ||
    security?.action === 'BLOCK' ||
    (!security && riskScore >= 70);

  const reasons = security?.emergency_alert.reasons ?? [];

  const actions =
    security?.emergency_alert.safe_actions ?? [
      'Do not click the link or enter credentials.',
      'Verify the organization through an official channel.',
      'Report suspected cyber fraud through official channels.',
    ];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onDismiss()}
    >
      <DialogContent className="max-w-xl bg-zinc-900 border-red-500/30 text-zinc-100 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert size={22} />
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
                {isHigh ? t.emergency : t.warning}
              </div>

              <DialogTitle className="text-lg font-bold mt-0.5">
                {security ? t.dangerous : t.highRisk}
              </DialogTitle>
            </div>
          </div>

          <DialogDescription className="text-sm text-zinc-300 leading-relaxed">
            {scamCategory} — {t.riskDescription}{' '}
            <span>
              {t.riskDescription.endsWith('.') ? '' : ''}
            </span>
            <b className="text-red-400 font-mono">
              {security?.risk_score ?? riskScore}/100
            </b>
          </DialogDescription>
        </DialogHeader>

        {reasons.length > 0 && (
          <div className="p-3 rounded-xl bg-zinc-950 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
              <AlertTriangle size={14} />
              {t.whyFlagged}
            </div>

            <ul className="space-y-1.5 text-xs text-zinc-300">
              {reasons.slice(0, 6).map((reason, i) => (
                <li key={i}>• {reason}</li>
              ))}
            </ul>
          </div>
        )}

        {detectedUrls.length > 0 && (
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-400 mb-1.5">
              {t.destination}
            </div>

            <div className="font-mono text-[11px] text-zinc-300 break-all">
              {detectedUrls[0]}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold text-zinc-200 mb-2">
            {t.whatToDo}
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {actions.slice(0, 4).map((action, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-300"
              >
                <CheckCircle2
                  size={14}
                  className="text-teal-400 shrink-0 mt-0.5"
                />

                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button onClick={onDismiss} variant="secondary">
            {t.acknowledge}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
