import type { LanguageCode } from '@/lib/languages';

export type HomeTranslation = {
  safePrefix: string;
  safeHighlight: string;
  subtitle: string;
  message: string;
  messageSubtitle: string;
  link: string;
  linkSubtitle: string;
  qrCode: string;
  qrSubtitle: string;
  image: string;
  imageSubtitle: string;
  document: string;
  documentSubtitle: string;
  textPlaceholder: string;
  urlPlaceholder: string;
  checkNow: string;
  checking: string;
  privacy: string;
  listen: string;
  selectLanguage: string;
  documentUnavailable: string;
  urlRequired: string;
  textRequired: string;
  imageRequired: string;
  scanError: string;

  // Result intelligence / screenshot details
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
};

export type NavigationTranslation = {
  home: string;
  check: string;
  history: string;
  safetyLock: string;
  safetyTips: string;
  reportScam: string;
  settings: string;
};

export type BrandTranslation = {
  tagline: string;
  digitalIndia: string;
};

export type AppTranslation = {
  brand: BrandTranslation;
  nav: NavigationTranslation;
  home: HomeTranslation;
};

const englishTranslation: AppTranslation = {
  brand: {
    tagline: 'Be Aware. Be Safer.',
    digitalIndia: 'A Safer Digital India',
  },
  nav: {
    home: 'Home',
    check: 'Check',
    history: 'History',
    safetyLock: 'Safety Lock',
    safetyTips: 'Safety Tips',
    reportScam: 'Report Scam',
    settings: 'Settings',
  },
  home: {
    safePrefix: 'Is this',
    safeHighlight: 'safe?',
    subtitle: 'Check before you click, share or pay.',
    message: 'Message',
    messageSubtitle: 'SMS, WhatsApp,\nEmail, etc.',
    link: 'Link',
    linkSubtitle: 'Website URL',
    qrCode: 'QR Code',
    qrSubtitle: 'Scan or upload',
    image: 'Image',
    imageSubtitle: 'Screenshot or photo',
    document: 'Document',
    documentSubtitle: 'PDF, DOC, etc.',
    textPlaceholder: 'Paste your message, link or any text here...',
    urlPlaceholder: 'Paste a website URL here...',
    checkNow: 'Check Now',
    checking: 'Checking...',
    privacy: 'Your data is private. We do not store your personal information.',
    listen: 'Listen',
    selectLanguage: 'Select Language',
    documentUnavailable: 'Document scanning is not connected yet. Please use Message, Link, QR Code or Image.',
    urlRequired: 'Please enter a website URL first.',
    textRequired: 'Please paste a message or text first.',
    imageRequired: 'Please select an image first.',
    scanError: 'Unable to analyse this content. Please try again.',
    scamFingerprint: 'Scam Fingerprint',
    scamClassification: 'Scam Classification',
    variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis',
    confidence: 'Confidence',
    primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family',
    similarity: 'Similarity',
    extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs',
    analysisMethod: 'Analysis Method',
    noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const hindiTranslation: AppTranslation = {
  brand: { tagline: 'सतर्क रहें। सुरक्षित रहें।', digitalIndia: 'एक सुरक्षित डिजिटल भारत' },
  nav: { home: 'होम', check: 'जाँच करें', history: 'इतिहास', safetyLock: 'सुरक्षा लॉक', safetyTips: 'सुरक्षा सुझाव', reportScam: 'स्कैम रिपोर्ट करें', settings: 'सेटिंग्स' },
  home: {
    safePrefix: 'क्या यह', safeHighlight: 'सुरक्षित है?', subtitle: 'क्लिक, शेयर या भुगतान करने से पहले जाँच करें।',
    message: 'संदेश', messageSubtitle: 'SMS, WhatsApp,\nईमेल आदि।', link: 'लिंक', linkSubtitle: 'वेबसाइट URL',
    qrCode: 'QR कोड', qrSubtitle: 'स्कैन या अपलोड करें', image: 'इमेज', imageSubtitle: 'स्क्रीनशॉट या फोटो',
    document: 'दस्तावेज़', documentSubtitle: 'PDF, DOC आदि।', textPlaceholder: 'अपना संदेश, लिंक या टेक्स्ट यहाँ पेस्ट करें...',
    urlPlaceholder: 'वेबसाइट URL यहाँ पेस्ट करें...', checkNow: 'अभी जाँचें', checking: 'जाँच हो रही है...',
    privacy: 'आपका डेटा निजी है। हम आपकी व्यक्तिगत जानकारी संग्रहीत नहीं करते।', listen: 'सुनें', selectLanguage: 'भाषा चुनें',
    documentUnavailable: 'दस्तावेज़ स्कैनिंग अभी उपलब्ध नहीं है। संदेश, लिंक, QR कोड या इमेज का उपयोग करें।',
    urlRequired: 'कृपया पहले वेबसाइट URL दर्ज करें।', textRequired: 'कृपया पहले संदेश या टेक्स्ट पेस्ट करें।',
    imageRequired: 'कृपया पहले एक इमेज चुनें।', scanError: 'इस सामग्री का विश्लेषण नहीं हो सका। कृपया फिर प्रयास करें।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const marathiTranslation: AppTranslation = {
  brand: { tagline: 'सतर्क रहा. सुरक्षित रहा.', digitalIndia: 'अधिक सुरक्षित डिजिटल भारत' },
  nav: { home: 'होम', check: 'तपासा', history: 'इतिहास', safetyLock: 'सुरक्षा लॉक', safetyTips: 'सुरक्षा टिप्स', reportScam: 'स्कॅम रिपोर्ट करा', settings: 'सेटिंग्ज' },
  home: {
    safePrefix: 'हे', safeHighlight: 'सुरक्षित आहे का?', subtitle: 'क्लिक, शेअर किंवा पेमेंट करण्यापूर्वी तपासा.',
    message: 'संदेश', messageSubtitle: 'SMS, WhatsApp,\nईमेल इ.', link: 'लिंक', linkSubtitle: 'वेबसाइट URL',
    qrCode: 'QR कोड', qrSubtitle: 'स्कॅन किंवा अपलोड करा', image: 'इमेज', imageSubtitle: 'स्क्रीनशॉट किंवा फोटो',
    document: 'दस्तऐवज', documentSubtitle: 'PDF, DOC इ.', textPlaceholder: 'तुमचा संदेश, लिंक किंवा मजकूर येथे पेस्ट करा...',
    urlPlaceholder: 'वेबसाइट URL येथे पेस्ट करा...', checkNow: 'आता तपासा', checking: 'तपासत आहे...',
    privacy: 'तुमचा डेटा खाजगी आहे. आम्ही तुमची वैयक्तिक माहिती साठवत नाही.', listen: 'ऐका', selectLanguage: 'भाषा निवडा',
    documentUnavailable: 'दस्तऐवज स्कॅनिंग अद्याप उपलब्ध नाही. संदेश, लिंक, QR कोड किंवा इमेज वापरा.',
    urlRequired: 'कृपया आधी वेबसाइट URL टाका.', textRequired: 'कृपया आधी संदेश किंवा मजकूर पेस्ट करा.',
    imageRequired: 'कृपया आधी इमेज निवडा.', scanError: 'या सामग्रीचे विश्लेषण करता आले नाही. कृपया पुन्हा प्रयत्न करा.',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const bengaliTranslation: AppTranslation = {
  brand: { tagline: 'সচেতন থাকুন। নিরাপদ থাকুন।', digitalIndia: 'আরও নিরাপদ ডিজিটাল ভারত' },
  nav: { home: 'হোম', check: 'পরীক্ষা করুন', history: 'ইতিহাস', safetyLock: 'সেফটি লক', safetyTips: 'নিরাপত্তা টিপস', reportScam: 'স্ক্যাম রিপোর্ট করুন', settings: 'সেটিংস' },
  home: {
    safePrefix: 'এটি কি', safeHighlight: 'নিরাপদ?', subtitle: 'ক্লিক, শেয়ার বা পেমেন্ট করার আগে পরীক্ষা করুন।',
    message: 'বার্তা', messageSubtitle: 'SMS, WhatsApp,\nইমেল ইত্যাদি', link: 'লিংক', linkSubtitle: 'ওয়েবসাইট URL',
    qrCode: 'QR কোড', qrSubtitle: 'স্ক্যান বা আপলোড করুন', image: 'ছবি', imageSubtitle: 'স্ক্রিনশট বা ছবি',
    document: 'নথি', documentSubtitle: 'PDF, DOC ইত্যাদি', textPlaceholder: 'আপনার বার্তা, লিংক বা যেকোনো লেখা এখানে পেস্ট করুন...',
    urlPlaceholder: 'ওয়েবসাইট URL এখানে পেস্ট করুন...', checkNow: 'এখন পরীক্ষা করুন', checking: 'পরীক্ষা করা হচ্ছে...',
    privacy: 'আপনার ডেটা ব্যক্তিগত। আমরা আপনার ব্যক্তিগত তথ্য সংরক্ষণ করি না।', listen: 'শুনুন', selectLanguage: 'ভাষা নির্বাচন করুন',
    documentUnavailable: 'নথি স্ক্যান এখনো সংযুক্ত নয়। বার্তা, লিংক, QR কোড বা ছবি ব্যবহার করুন।',
    urlRequired: 'অনুগ্রহ করে আগে একটি ওয়েবসাইট URL দিন।', textRequired: 'অনুগ্রহ করে আগে একটি বার্তা বা লেখা পেস্ট করুন।',
    imageRequired: 'অনুগ্রহ করে আগে একটি ছবি নির্বাচন করুন।', scanError: 'এই বিষয়বস্তু বিশ্লেষণ করা যায়নি। আবার চেষ্টা করুন।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const gujaratiTranslation: AppTranslation = {
  brand: { tagline: 'સજાગ રહો. સુરક્ષિત રહો.', digitalIndia: 'વધુ સુરક્ષિત ડિજિટલ ભારત' },
  nav: { home: 'હોમ', check: 'ચકાસો', history: 'ઇતિહાસ', safetyLock: 'સેફ્ટી લોક', safetyTips: 'સુરક્ષા સૂચનો', reportScam: 'સ્કેમની જાણ કરો', settings: 'સેટિંગ્સ' },
  home: {
    safePrefix: 'શું આ', safeHighlight: 'સુરક્ષિત છે?', subtitle: 'ક્લિક, શેર અથવા ચુકવણી કરતા પહેલાં ચકાસો.',
    message: 'સંદેશ', messageSubtitle: 'SMS, WhatsApp,\nઈમેલ વગેરે', link: 'લિંક', linkSubtitle: 'વેબસાઇટ URL',
    qrCode: 'QR કોડ', qrSubtitle: 'સ્કેન અથવા અપલોડ કરો', image: 'છબી', imageSubtitle: 'સ્ક્રીનશોટ અથવા ફોટો',
    document: 'દસ્તાવેજ', documentSubtitle: 'PDF, DOC વગેરે', textPlaceholder: 'તમારો સંદેશ, લિંક અથવા કોઈપણ ટેક્સ્ટ અહીં પેસ્ટ કરો...',
    urlPlaceholder: 'વેબસાઇટ URL અહીં પેસ્ટ કરો...', checkNow: 'હમણાં ચકાસો', checking: 'ચકાસી રહ્યા છીએ...',
    privacy: 'તમારો ડેટા ખાનગી છે. અમે તમારી વ્યક્તિગત માહિતી સંગ્રહિત કરતા નથી.', listen: 'સાંભળો', selectLanguage: 'ભાષા પસંદ કરો',
    documentUnavailable: 'દસ્તાવેજ સ્કેનિંગ હજુ જોડાયેલું નથી. સંદેશ, લિંક, QR કોડ અથવા છબીનો ઉપયોગ કરો.',
    urlRequired: 'કૃપા કરીને પહેલા વેબસાઇટ URL દાખલ કરો.', textRequired: 'કૃપા કરીને પહેલા સંદેશ અથવા ટેક્સ્ટ પેસ્ટ કરો.',
    imageRequired: 'કૃપા કરીને પહેલા છબી પસંદ કરો.', scanError: 'આ સામગ્રીનું વિશ્લેષણ થઈ શક્યું નથી. કૃપા કરીને ફરી પ્રયાસ કરો.',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const tamilTranslation: AppTranslation = {
  brand: { tagline: 'விழிப்புடன் இருங்கள். பாதுகாப்பாக இருங்கள்.', digitalIndia: 'பாதுகாப்பான டிஜிட்டல் இந்தியா' },
  nav: { home: 'முகப்பு', check: 'சரிபார்க்கவும்', history: 'வரலாறு', safetyLock: 'பாதுகாப்பு பூட்டு', safetyTips: 'பாதுகாப்பு குறிப்புகள்', reportScam: 'மோசடியைப் புகாரளிக்கவும்', settings: 'அமைப்புகள்' },
  home: {
    safePrefix: 'இது', safeHighlight: 'பாதுகாப்பானதா?', subtitle: 'கிளிக், பகிர்வு அல்லது பணம் செலுத்துவதற்கு முன் சரிபார்க்கவும்.',
    message: 'செய்தி', messageSubtitle: 'SMS, WhatsApp,\nமின்னஞ்சல் போன்றவை', link: 'இணைப்பு', linkSubtitle: 'வலைத்தள URL',
    qrCode: 'QR குறியீடு', qrSubtitle: 'ஸ்கேன் அல்லது பதிவேற்றவும்', image: 'படம்', imageSubtitle: 'ஸ்கிரீன்ஷாட் அல்லது புகைப்படம்',
    document: 'ஆவணம்', documentSubtitle: 'PDF, DOC போன்றவை', textPlaceholder: 'உங்கள் செய்தி, இணைப்பு அல்லது உரையை இங்கே ஒட்டவும்...',
    urlPlaceholder: 'வலைத்தள URL-ஐ இங்கே ஒட்டவும்...', checkNow: 'இப்போது சரிபார்க்கவும்', checking: 'சரிபார்க்கப்படுகிறது...',
    privacy: 'உங்கள் தரவு தனிப்பட்டது. உங்கள் தனிப்பட்ட தகவலை நாங்கள் சேமிப்பதில்லை.', listen: 'கேளுங்கள்', selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    documentUnavailable: 'ஆவண ஸ்கேனிங் இன்னும் இணைக்கப்படவில்லை. செய்தி, இணைப்பு, QR குறியீடு அல்லது படத்தைப் பயன்படுத்தவும்.',
    urlRequired: 'முதலில் வலைத்தள URL-ஐ உள்ளிடவும்.', textRequired: 'முதலில் செய்தி அல்லது உரையை ஒட்டவும்.',
    imageRequired: 'முதலில் ஒரு படத்தைத் தேர்ந்தெடுக்கவும்.', scanError: 'இந்த உள்ளடக்கத்தை பகுப்பாய்வு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const teluguTranslation: AppTranslation = {
  brand: { tagline: 'అవగాహనతో ఉండండి. సురక్షితంగా ఉండండి.', digitalIndia: 'మరింత సురక్షితమైన డిజిటల్ భారత్' },
  nav: { home: 'హోమ్', check: 'తనిఖీ చేయండి', history: 'చరిత్ర', safetyLock: 'సేఫ్టీ లాక్', safetyTips: 'భద్రతా సూచనలు', reportScam: 'స్కామ్‌ను నివేదించండి', settings: 'సెట్టింగ్‌లు' },
  home: {
    safePrefix: 'ఇది', safeHighlight: 'సురక్షితమేనా?', subtitle: 'క్లిక్ చేయడానికి, షేర్ చేయడానికి లేదా చెల్లించడానికి ముందు తనిఖీ చేయండి.',
    message: 'సందేశం', messageSubtitle: 'SMS, WhatsApp,\nఇమెయిల్ మొదలైనవి', link: 'లింక్', linkSubtitle: 'వెబ్‌సైట్ URL',
    qrCode: 'QR కోడ్', qrSubtitle: 'స్కాన్ లేదా అప్‌లోడ్ చేయండి', image: 'చిత్రం', imageSubtitle: 'స్క్రీన్‌షాట్ లేదా ఫోటో',
    document: 'పత్రం', documentSubtitle: 'PDF, DOC మొదలైనవి', textPlaceholder: 'మీ సందేశం, లింక్ లేదా ఏదైనా టెక్స్ట్‌ను ఇక్కడ పేస్ట్ చేయండి...',
    urlPlaceholder: 'వెబ్‌సైట్ URL‌ను ఇక్కడ పేస్ట్ చేయండి...', checkNow: 'ఇప్పుడే తనిఖీ చేయండి', checking: 'తనిఖీ చేస్తోంది...',
    privacy: 'మీ డేటా ప్రైవేట్‌గా ఉంటుంది. మీ వ్యక్తిగత సమాచారాన్ని మేము నిల్వ చేయము.', listen: 'వినండి', selectLanguage: 'భాషను ఎంచుకోండి',
    documentUnavailable: 'డాక్యుమెంట్ స్కానింగ్ ఇంకా కనెక్ట్ కాలేదు. సందేశం, లింక్, QR కోడ్ లేదా చిత్రాన్ని ఉపయోగించండి.',
    urlRequired: 'దయచేసి ముందుగా వెబ్‌సైట్ URL నమోదు చేయండి.', textRequired: 'దయచేసి ముందుగా సందేశం లేదా టెక్స్ట్ పేస్ట్ చేయండి.',
    imageRequired: 'దయచేసి ముందుగా ఒక చిత్రాన్ని ఎంచుకోండి.', scanError: 'ఈ కంటెంట్‌ను విశ్లేషించలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి.',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const kannadaTranslation: AppTranslation = {
  brand: { tagline: 'ಎಚ್ಚರಿಕೆಯಿಂದಿರಿ. ಸುರಕ್ಷಿತವಾಗಿರಿ.', digitalIndia: 'ಹೆಚ್ಚು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಭಾರತ' },
  nav: { home: 'ಮುಖಪುಟ', check: 'ಪರಿಶೀಲಿಸಿ', history: 'ಇತಿಹಾಸ', safetyLock: 'ಸುರಕ್ಷತಾ ಲಾಕ್', safetyTips: 'ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು', reportScam: 'ವಂಚನೆಯನ್ನು ವರದಿ ಮಾಡಿ', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು' },
  home: {
    safePrefix: 'ಇದು', safeHighlight: 'ಸುರಕ್ಷಿತವೇ?', subtitle: 'ಕ್ಲಿಕ್ ಮಾಡುವ, ಹಂಚಿಕೊಳ್ಳುವ ಅಥವಾ ಪಾವತಿಸುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ.',
    message: 'ಸಂದೇಶ', messageSubtitle: 'SMS, WhatsApp,\nಇಮೇಲ್ ಇತ್ಯಾದಿ', link: 'ಲಿಂಕ್', linkSubtitle: 'ವೆಬ್‌ಸೈಟ್ URL',
    qrCode: 'QR ಕೋಡ್', qrSubtitle: 'ಸ್ಕ್ಯಾನ್ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', image: 'ಚಿತ್ರ', imageSubtitle: 'ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಥವಾ ಫೋಟೋ',
    document: 'ದಾಖಲೆ', documentSubtitle: 'PDF, DOC ಇತ್ಯಾದಿ', textPlaceholder: 'ನಿಮ್ಮ ಸಂದೇಶ, ಲಿಂಕ್ ಅಥವಾ ಯಾವುದೇ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ...',
    urlPlaceholder: 'ವೆಬ್‌ಸೈಟ್ URL ಅನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ...', checkNow: 'ಈಗ ಪರಿಶೀಲಿಸಿ', checking: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    privacy: 'ನಿಮ್ಮ ಡೇಟಾ ಖಾಸಗಿಯಾಗಿದೆ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ನಾವು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.', listen: 'ಆಲಿಸಿ', selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    documentUnavailable: 'ದಾಖಲೆ ಸ್ಕ್ಯಾನಿಂಗ್ ಇನ್ನೂ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ. ಸಂದೇಶ, ಲಿಂಕ್, QR ಕೋಡ್ ಅಥವಾ ಚಿತ್ರವನ್ನು ಬಳಸಿ.',
    urlRequired: 'ದಯವಿಟ್ಟು ಮೊದಲು ವೆಬ್‌ಸೈಟ್ URL ನಮೂದಿಸಿ.', textRequired: 'ದಯವಿಟ್ಟು ಮೊದಲು ಸಂದೇಶ ಅಥವಾ ಪಠ್ಯವನ್ನು ಪೇಸ್ಟ್ ಮಾಡಿ.',
    imageRequired: 'ದಯವಿಟ್ಟು ಮೊದಲು ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', scanError: 'ಈ ವಿಷಯವನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const malayalamTranslation: AppTranslation = {
  brand: { tagline: 'ജാഗ്രതയോടെ ഇരിക്കുക. സുരക്ഷിതരായിരിക്കുക.', digitalIndia: 'കൂടുതൽ സുരക്ഷിതമായ ഡിജിറ്റൽ ഇന്ത്യ' },
  nav: { home: 'ഹോം', check: 'പരിശോധിക്കുക', history: 'ചരിത്രം', safetyLock: 'സേഫ്റ്റി ലോക്ക്', safetyTips: 'സുരക്ഷാ നിർദ്ദേശങ്ങൾ', reportScam: 'തട്ടിപ്പ് റിപ്പോർട്ട് ചെയ്യുക', settings: 'ക്രമീകരണങ്ങൾ' },
  home: {
    safePrefix: 'ഇത്', safeHighlight: 'സുരക്ഷിതമാണോ?', subtitle: 'ക്ലിക്ക് ചെയ്യുന്നതിന്, പങ്കിടുന്നതിന് അല്ലെങ്കിൽ പണമടയ്ക്കുന്നതിന് മുമ്പ് പരിശോധിക്കുക.',
    message: 'സന്ദേശം', messageSubtitle: 'SMS, WhatsApp,\nഇമെയിൽ മുതലായവ', link: 'ലിങ്ക്', linkSubtitle: 'വെബ്‌സൈറ്റ് URL',
    qrCode: 'QR കോഡ്', qrSubtitle: 'സ്കാൻ ചെയ്യുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യുക', image: 'ചിത്രം', imageSubtitle: 'സ്ക്രീൻഷോട്ട് അല്ലെങ്കിൽ ഫോട്ടോ',
    document: 'രേഖ', documentSubtitle: 'PDF, DOC മുതലായവ', textPlaceholder: 'നിങ്ങളുടെ സന്ദേശമോ ലിങ്കോ മറ്റേതെങ്കിലും ടെക്സ്റ്റോ ഇവിടെ പേസ്റ്റ് ചെയ്യുക...',
    urlPlaceholder: 'വെബ്‌സൈറ്റ് URL ഇവിടെ പേസ്റ്റ് ചെയ്യുക...', checkNow: 'ഇപ്പോൾ പരിശോധിക്കുക', checking: 'പരിശോധിക്കുന്നു...',
    privacy: 'നിങ്ങളുടെ ഡാറ്റ സ്വകാര്യമാണ്. നിങ്ങളുടെ വ്യക്തിഗത വിവരങ്ങൾ ഞങ്ങൾ സംഭരിക്കുന്നില്ല.', listen: 'കേൾക്കുക', selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    documentUnavailable: 'രേഖ സ്കാനിംഗ് ഇതുവരെ ബന്ധിപ്പിച്ചിട്ടില്ല. സന്ദേശം, ലിങ്ക്, QR കോഡ് അല്ലെങ്കിൽ ചിത്രം ഉപയോഗിക്കുക.',
    urlRequired: 'ആദ്യം ഒരു വെബ്‌സൈറ്റ് URL നൽകുക.', textRequired: 'ആദ്യം ഒരു സന്ദേശമോ ടെക്സ്റ്റോ പേസ്റ്റ് ചെയ്യുക.',
    imageRequired: 'ആദ്യം ഒരു ചിത്രം തിരഞ്ഞെടുക്കുക.', scanError: 'ഈ ഉള്ളടക്കം വിശകലനം ചെയ്യാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const odiaTranslation: AppTranslation = {
  brand: { tagline: 'ସଚେତନ ରୁହନ୍ତୁ। ସୁରକ୍ଷିତ ରୁହନ୍ତୁ।', digitalIndia: 'ଅଧିକ ସୁରକ୍ଷିତ ଡିଜିଟାଲ ଭାରତ' },
  nav: { home: 'ହୋମ', check: 'ଯାଞ୍ଚ କରନ୍ତୁ', history: 'ଇତିହାସ', safetyLock: 'ସୁରକ୍ଷା ଲକ୍', safetyTips: 'ସୁରକ୍ଷା ଟିପ୍ସ', reportScam: 'ଠକେଇ ରିପୋର୍ଟ କରନ୍ତୁ', settings: 'ସେଟିଂସ୍' },
  home: {
    safePrefix: 'ଏହା', safeHighlight: 'ସୁରକ୍ଷିତ କି?', subtitle: 'କ୍ଲିକ୍, ସେୟାର କିମ୍ବା ପେମେଣ୍ଟ କରିବା ପୂର୍ବରୁ ଯାଞ୍ଚ କରନ୍ତୁ।',
    message: 'ବାର୍ତ୍ତା', messageSubtitle: 'SMS, WhatsApp,\nଇମେଲ୍ ଇତ୍ୟାଦି', link: 'ଲିଙ୍କ୍', linkSubtitle: 'ୱେବସାଇଟ୍ URL',
    qrCode: 'QR କୋଡ୍', qrSubtitle: 'ସ୍କାନ୍ କିମ୍ବା ଅପଲୋଡ୍ କରନ୍ତୁ', image: 'ଛବି', imageSubtitle: 'ସ୍କ୍ରିନସଟ୍ କିମ୍ବା ଫଟୋ',
    document: 'ଦଲିଲ', documentSubtitle: 'PDF, DOC ଇତ୍ୟାଦି', textPlaceholder: 'ଆପଣଙ୍କ ବାର୍ତ୍ତା, ଲିଙ୍କ୍ କିମ୍ବା ଯେକୌଣସି ଟେକ୍ସଟ୍ ଏଠାରେ ପେଷ୍ଟ କରନ୍ତୁ...',
    urlPlaceholder: 'ୱେବସାଇଟ୍ URL ଏଠାରେ ପେଷ୍ଟ କରନ୍ତୁ...', checkNow: 'ବର୍ତ୍ତମାନ ଯାଞ୍ଚ କରନ୍ତୁ', checking: 'ଯାଞ୍ଚ ହେଉଛି...',
    privacy: 'ଆପଣଙ୍କ ଡାଟା ବ୍ୟକ୍ତିଗତ। ଆମେ ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ସୂଚନା ସଂରକ୍ଷଣ କରୁନାହୁଁ।', listen: 'ଶୁଣନ୍ତୁ', selectLanguage: 'ଭାଷା ବାଛନ୍ତୁ',
    documentUnavailable: 'ଦଲିଲ ସ୍କାନିଂ ଏପର୍ଯ୍ୟନ୍ତ ସଂଯୁକ୍ତ ହୋଇନାହିଁ। ବାର୍ତ୍ତା, ଲିଙ୍କ୍, QR କୋଡ୍ କିମ୍ବା ଛବି ବ୍ୟବହାର କରନ୍ତୁ।',
    urlRequired: 'ଦୟାକରି ପ୍ରଥମେ ୱେବସାଇଟ୍ URL ଦିଅନ୍ତୁ।', textRequired: 'ଦୟାକରି ପ୍ରଥମେ ବାର୍ତ୍ତା କିମ୍ବା ଟେକ୍ସଟ୍ ପେଷ୍ଟ କରନ୍ତୁ।',
    imageRequired: 'ଦୟାକରି ପ୍ରଥମେ ଏକ ଛବି ବାଛନ୍ତୁ।', scanError: 'ଏହି ବିଷୟବସ୍ତୁକୁ ବିଶ୍ଳେଷଣ କରିହେଲା ନାହିଁ। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const punjabiTranslation: AppTranslation = {
  brand: { tagline: 'ਸਚੇਤ ਰਹੋ। ਸੁਰੱਖਿਅਤ ਰਹੋ।', digitalIndia: 'ਇੱਕ ਹੋਰ ਸੁਰੱਖਿਅਤ ਡਿਜੀਟਲ ਭਾਰਤ' },
  nav: { home: 'ਹੋਮ', check: 'ਜਾਂਚ ਕਰੋ', history: 'ਇਤਿਹਾਸ', safetyLock: 'ਸੇਫਟੀ ਲੌਕ', safetyTips: 'ਸੁਰੱਖਿਆ ਸੁਝਾਅ', reportScam: 'ਘਪਲੇ ਦੀ ਰਿਪੋਰਟ ਕਰੋ', settings: 'ਸੈਟਿੰਗਾਂ' },
  home: {
    safePrefix: 'ਕੀ ਇਹ', safeHighlight: 'ਸੁਰੱਖਿਅਤ ਹੈ?', subtitle: 'ਕਲਿੱਕ, ਸਾਂਝਾ ਜਾਂ ਭੁਗਤਾਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ ਕਰੋ।',
    message: 'ਸੁਨੇਹਾ', messageSubtitle: 'SMS, WhatsApp,\nਈਮੇਲ ਆਦਿ', link: 'ਲਿੰਕ', linkSubtitle: 'ਵੈੱਬਸਾਈਟ URL',
    qrCode: 'QR ਕੋਡ', qrSubtitle: 'ਸਕੈਨ ਜਾਂ ਅੱਪਲੋਡ ਕਰੋ', image: 'ਤਸਵੀਰ', imageSubtitle: 'ਸਕ੍ਰੀਨਸ਼ਾਟ ਜਾਂ ਫੋਟੋ',
    document: 'ਦਸਤਾਵੇਜ਼', documentSubtitle: 'PDF, DOC ਆਦਿ', textPlaceholder: 'ਆਪਣਾ ਸੁਨੇਹਾ, ਲਿੰਕ ਜਾਂ ਕੋਈ ਵੀ ਟੈਕਸਟ ਇੱਥੇ ਪੇਸਟ ਕਰੋ...',
    urlPlaceholder: 'ਵੈੱਬਸਾਈਟ URL ਇੱਥੇ ਪੇਸਟ ਕਰੋ...', checkNow: 'ਹੁਣ ਜਾਂਚ ਕਰੋ', checking: 'ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...',
    privacy: 'ਤੁਹਾਡਾ ਡਾਟਾ ਨਿੱਜੀ ਹੈ। ਅਸੀਂ ਤੁਹਾਡੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਸਟੋਰ ਨਹੀਂ ਕਰਦੇ।', listen: 'ਸੁਣੋ', selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    documentUnavailable: 'ਦਸਤਾਵੇਜ਼ ਸਕੈਨਿੰਗ ਹਾਲੇ ਕਨੈਕਟ ਨਹੀਂ ਹੈ। ਸੁਨੇਹਾ, ਲਿੰਕ, QR ਕੋਡ ਜਾਂ ਤਸਵੀਰ ਵਰਤੋ।',
    urlRequired: 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਵੈੱਬਸਾਈਟ URL ਦਾਖਲ ਕਰੋ।', textRequired: 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਸੁਨੇਹਾ ਜਾਂ ਟੈਕਸਟ ਪੇਸਟ ਕਰੋ।',
    imageRequired: 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਇੱਕ ਤਸਵੀਰ ਚੁਣੋ।', scanError: 'ਇਸ ਸਮੱਗਰੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const nepaliTranslation: AppTranslation = {
  brand: { tagline: 'सचेत रहनुहोस्। सुरक्षित रहनुहोस्।', digitalIndia: 'सुरक्षित डिजिटल भारत' },
  nav: { home: 'गृहपृष्ठ', check: 'जाँच गर्नुहोस्', history: 'इतिहास', safetyLock: 'सुरक्षा लक', safetyTips: 'सुरक्षा सुझाव', reportScam: 'ठगी रिपोर्ट गर्नुहोस्', settings: 'सेटिङहरू' },
  home: {
    safePrefix: 'के यो', safeHighlight: 'सुरक्षित छ?', subtitle: 'क्लिक, सेयर वा भुक्तानी गर्नुअघि जाँच गर्नुहोस्।',
    message: 'सन्देश', messageSubtitle: 'SMS, WhatsApp,\nइमेल आदि', link: 'लिङ्क', linkSubtitle: 'वेबसाइट URL',
    qrCode: 'QR कोड', qrSubtitle: 'स्क्यान वा अपलोड गर्नुहोस्', image: 'तस्बिर', imageSubtitle: 'स्क्रिनसट वा फोटो',
    document: 'कागजात', documentSubtitle: 'PDF, DOC आदि', textPlaceholder: 'आफ्नो सन्देश, लिङ्क वा कुनै पनि पाठ यहाँ पेस्ट गर्नुहोस्...',
    urlPlaceholder: 'वेबसाइट URL यहाँ पेस्ट गर्नुहोस्...', checkNow: 'अहिले जाँच गर्नुहोस्', checking: 'जाँच हुँदैछ...',
    privacy: 'तपाईंको डाटा निजी छ। हामी तपाईंको व्यक्तिगत जानकारी भण्डारण गर्दैनौँ।', listen: 'सुन्नुहोस्', selectLanguage: 'भाषा छान्नुहोस्',
    documentUnavailable: 'कागजात स्क्यानिङ अझै जोडिएको छैन। सन्देश, लिङ्क, QR कोड वा तस्बिर प्रयोग गर्नुहोस्।',
    urlRequired: 'कृपया पहिले वेबसाइट URL प्रविष्ट गर्नुहोस्।', textRequired: 'कृपया पहिले सन्देश वा पाठ पेस्ट गर्नुहोस्।',
    imageRequired: 'कृपया पहिले एउटा तस्बिर छान्नुहोस्।', scanError: 'यो सामग्री विश्लेषण गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const assameseTranslation: AppTranslation = {
  brand: { tagline: 'সচেতন থাকক। সুৰক্ষিত থাকক।', digitalIndia: 'অধিক সুৰক্ষিত ডিজিটেল ভাৰত' },
  nav: { home: 'হোম', check: 'পৰীক্ষা কৰক', history: 'ইতিহাস', safetyLock: 'সুৰক্ষা লক', safetyTips: 'সুৰক্ষা পৰামৰ্শ', reportScam: 'প্ৰৱঞ্চনাৰ ৰিপৰ্ট কৰক', settings: 'ছেটিংছ' },
  home: {
    safePrefix: 'এইটো', safeHighlight: 'সুৰক্ষিত নে?', subtitle: 'ক্লিক, শ্বেয়াৰ বা পেমেণ্ট কৰাৰ আগতে পৰীক্ষা কৰক।',
    message: 'বাৰ্তা', messageSubtitle: 'SMS, WhatsApp,\nইমেইল আদি', link: 'লিংক', linkSubtitle: 'ৱেবছাইট URL',
    qrCode: 'QR ক’ড', qrSubtitle: 'স্কেন বা আপলোড কৰক', image: 'ছবি', imageSubtitle: 'স্ক্ৰিনশ্বট বা ফটো',
    document: 'নথি', documentSubtitle: 'PDF, DOC আদি', textPlaceholder: 'আপোনাৰ বাৰ্তা, লিংক বা যিকোনো টেক্সট ইয়াত পেষ্ট কৰক...',
    urlPlaceholder: 'ৱেবছাইট URL ইয়াত পেষ্ট কৰক...', checkNow: 'এতিয়া পৰীক্ষা কৰক', checking: 'পৰীক্ষা কৰা হৈছে...',
    privacy: 'আপোনাৰ ডাটা ব্যক্তিগত। আমি আপোনাৰ ব্যক্তিগত তথ্য সংৰক্ষণ নকৰোঁ।', listen: 'শুনক', selectLanguage: 'ভাষা বাছক',
    documentUnavailable: 'নথি স্কেনিং এতিয়াও সংযুক্ত হোৱা নাই। বাৰ্তা, লিংক, QR ক’ড বা ছবি ব্যৱহাৰ কৰক।',
    urlRequired: 'অনুগ্ৰহ কৰি প্ৰথমে ৱেবছাইট URL দিয়ক।', textRequired: 'অনুগ্ৰহ কৰি প্ৰথমে বাৰ্তা বা টেক্সট পেষ্ট কৰক।',
    imageRequired: 'অনুগ্ৰহ কৰি প্ৰথমে এখন ছবি বাছক।', scanError: 'এই বিষয়বস্তু বিশ্লেষণ কৰিব পৰা নগ’ল। পুনৰ চেষ্টা কৰক।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const konkaniTranslation: AppTranslation = {
  brand: { tagline: 'जागृत आसात. सुरक्षित आसात.', digitalIndia: 'सुरक्षित डिजिटल भारत' },
  nav: { home: 'घर', check: 'तपासात', history: 'इतिहास', safetyLock: 'सुरक्षा लॉक', safetyTips: 'सुरक्षा सुचोवणी', reportScam: 'फ्रॉड रिपोर्ट करात', settings: 'सेटिंग्स' },
  home: {
    safePrefix: 'हें', safeHighlight: 'सुरक्षित आसा?', subtitle: 'क्लिक, शेअर वा पेमेंट करचे पयलीं तपासात.',
    message: 'संदेश', messageSubtitle: 'SMS, WhatsApp,\nईमेल इ.', link: 'लिंक', linkSubtitle: 'वेबसायट URL',
    qrCode: 'QR कोड', qrSubtitle: 'स्कॅन वा अपलोड करात', image: 'इमेज', imageSubtitle: 'स्क्रीनशॉट वा फोटो',
    document: 'दस्तावेज', documentSubtitle: 'PDF, DOC इ.', textPlaceholder: 'तुमचो संदेश, लिंक वा मजकूर हांगा पेस्ट करात...',
    urlPlaceholder: 'वेबसायट URL हांगा पेस्ट करात...', checkNow: 'आतां तपासात', checking: 'तपासता...',
    privacy: 'तुमचो डेटा खाजगी आसा. आमी तुमची वैयक्तिक म्हायती साठोवप ना.', listen: 'आयकात', selectLanguage: 'भाशा निवडात',
    documentUnavailable: 'दस्तावेज स्कॅनिंग अजून जोडलेलें ना. संदेश, लिंक, QR कोड वा इमेज वापरात.',
    urlRequired: 'कृपया पयलीं वेबसायट URL दियात.', textRequired: 'कृपया पयलीं संदेश वा मजकूर पेस्ट करात.',
    imageRequired: 'कृपया पयलीं इमेज निवडात.', scanError: 'ह्या मजकुराचें विश्लेषण जालें ना. परत प्रयत्न करात.',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const maithiliTranslation: AppTranslation = {
  brand: { tagline: 'सजग रहू। सुरक्षित रहू।', digitalIndia: 'सुरक्षित डिजिटल भारत' },
  nav: { home: 'घर', check: 'जाँच करू', history: 'इतिहास', safetyLock: 'सुरक्षा लॉक', safetyTips: 'सुरक्षा सुझाव', reportScam: 'ठगीक रिपोर्ट करू', settings: 'सेटिंग्स' },
  home: {
    safePrefix: 'की ई', safeHighlight: 'सुरक्षित अछि?', subtitle: 'क्लिक, शेयर अथवा भुगतान करबाक पहिने जाँच करू।',
    message: 'संदेश', messageSubtitle: 'SMS, WhatsApp,\nईमेल आदि', link: 'लिंक', linkSubtitle: 'वेबसाइट URL',
    qrCode: 'QR कोड', qrSubtitle: 'स्कैन अथवा अपलोड करू', image: 'चित्र', imageSubtitle: 'स्क्रीनशॉट अथवा फोटो',
    document: 'दस्तावेज', documentSubtitle: 'PDF, DOC आदि', textPlaceholder: 'अपन संदेश, लिंक अथवा कोनो टेक्स्ट एतय पेस्ट करू...',
    urlPlaceholder: 'वेबसाइट URL एतय पेस्ट करू...', checkNow: 'आब जाँच करू', checking: 'जाँच भऽ रहल अछि...',
    privacy: 'अहाँक डेटा निजी अछि। हम अहाँक व्यक्तिगत जानकारी संग्रह नहि करैत छी।', listen: 'सुनू', selectLanguage: 'भाषा चुनू',
    documentUnavailable: 'दस्तावेज स्कैनिंग एखन उपलब्ध नहि अछि। संदेश, लिंक, QR कोड अथवा चित्रक उपयोग करू।',
    urlRequired: 'कृपया पहिने वेबसाइट URL दर्ज करू।', textRequired: 'कृपया पहिने संदेश अथवा टेक्स्ट पेस्ट करू।',
    imageRequired: 'कृपया पहिने एकटा चित्र चुनू।', scanError: 'एहि सामग्रीक विश्लेषण नहि भऽ सकल। फेर प्रयास करू।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const bhojpuriLikeBodoTranslation: AppTranslation = {
  brand: { tagline: 'सावधान जों। सुरक्षित जों।', digitalIndia: 'सुरक्षित डिजिटल भारत' },
  nav: { home: 'नौ', check: 'फिननाय', history: 'इतिहास', safetyLock: 'सुरक्षा लॉक', safetyTips: 'सुरक्षा सलाह', reportScam: 'ठगी रिपोर्ट खालाम', settings: 'सेटिंग्स' },
  home: {
    safePrefix: 'बेयो', safeHighlight: 'सुरक्षित नामा?', subtitle: 'क्लिक, शेयर एबा पेमेंट खालामनायनि सिगां फिननाय खालाम।',
    message: 'संदेश', messageSubtitle: 'SMS, WhatsApp,\nइमेल आदि', link: 'लिंक', linkSubtitle: 'वेबसाइट URL',
    qrCode: 'QR कोड', qrSubtitle: 'स्क्यान एबा अपलोड खालाम', image: 'चित्र', imageSubtitle: 'स्क्रीनशॉट एबा फोटो',
    document: 'दस्तावेज', documentSubtitle: 'PDF, DOC आदि', textPlaceholder: 'नोंथांनि संदेश, लिंक एबा टेक्स्ट बेयाव पेस्ट खालाम...',
    urlPlaceholder: 'वेबसाइट URL बेयाव पेस्ट खालाम...', checkNow: 'दानो फिननाय खालाम', checking: 'फिननाय खालामगासिनो...',
    privacy: 'नोंथांनि डेटा प्राइभेट। जों नोंथांनि निजि फोरमेसन सहेज नखालाम।', listen: 'खोनासं', selectLanguage: 'राव सायख',
    documentUnavailable: 'दस्तावेज स्क्यानिंग दानो जोडाखै। संदेश, लिंक, QR कोड एबा चित्र बाहाय।',
    urlRequired: 'अननानै सिगां वेबसाइट URL हो।', textRequired: 'अननानै सिगां संदेश एबा टेक्स्ट पेस्ट खालाम।',
    imageRequired: 'अननानै सिगां चित्र सायख।', scanError: 'बे बिसयखौ विश्लेषण खालामनो हायाखै। फिन प्रयास खालाम।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const dogriTranslation: AppTranslation = {
  brand: { tagline: 'सजग रौ। सुरक्षित रौ।', digitalIndia: 'सुरक्षित डिजिटल भारत' },
  nav: { home: 'घर', check: 'जाँच करो', history: 'इतिहास', safetyLock: 'सुरक्षा लॉक', safetyTips: 'सुरक्षा सुझाव', reportScam: 'ठगी दी रिपोर्ट करो', settings: 'सेटिंगां' },
  home: {
    safePrefix: 'क्या एह', safeHighlight: 'सुरक्षित ऐ?', subtitle: 'क्लिक, शेयर जां भुगतान करने थमां पैह्लें जाँच करो।',
    message: 'सनेहा', messageSubtitle: 'SMS, WhatsApp,\nईमेल बगैरा', link: 'लिंक', linkSubtitle: 'वेबसाइट URL',
    qrCode: 'QR कोड', qrSubtitle: 'स्कैन जां अपलोड करो', image: 'तस्वीर', imageSubtitle: 'स्क्रीनशॉट जां फोटो',
    document: 'दस्तावेज', documentSubtitle: 'PDF, DOC बगैरा', textPlaceholder: 'अपना सनेहा, लिंक जां कोई टेक्स्ट इत्थे पेस्ट करो...',
    urlPlaceholder: 'वेबसाइट URL इत्थे पेस्ट करो...', checkNow: 'हुन जाँच करो', checking: 'जाँच होआ करदी ऐ...',
    privacy: 'तुंदा डेटा निजी ऐ। अस तुंदी निजी जानकारी स्टोर नेईं करदे।', listen: 'सुणो', selectLanguage: 'भाशा चुनो',
    documentUnavailable: 'दस्तावेज स्कैनिंग अजें उपलब्ध नेईं। सनेहा, लिंक, QR कोड जां तस्वीर बरतो।',
    urlRequired: 'कृपया पैह्लें वेबसाइट URL दाखल करो।', textRequired: 'कृपया पैह्लें सनेहा जां टेक्स्ट पेस्ट करो।',
    imageRequired: 'कृपया पैह्लें तस्वीर चुनो।', scanError: 'इस सामग्री दा विश्लेषण नेईं होई सकेआ। दोबारा कोशिश करो।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const kashmiriTranslation: AppTranslation = {
  brand: { tagline: 'باخبر رٕہیو۔ محفوظ رٕہیو۔', digitalIndia: 'محفوظ ڈیجیٹل بھارت' },
  nav: { home: 'ہوم', check: 'جانچ', history: 'تاریخ', safetyLock: 'سیفٹی لاک', safetyTips: 'حفاظتی مشورے', reportScam: 'فراڈ رپورٹ کریو', settings: 'سیٹنگز' },
  home: {
    safePrefix: 'کیا یہ', safeHighlight: 'محفوظ چھ؟', subtitle: 'کلک، شیئر یا ادائیگی کرنہٕ برونہٕ جانچ کریو۔',
    message: 'پیغام', messageSubtitle: 'SMS، WhatsApp،\nای میل وغیرہ', link: 'لنک', linkSubtitle: 'ویب سائٹ URL',
    qrCode: 'QR کوڈ', qrSubtitle: 'اسکین یا اپلوڈ کریو', image: 'تصویر', imageSubtitle: 'اسکرین شاٹ یا فوٹو',
    document: 'دستاویز', documentSubtitle: 'PDF، DOC وغیرہ', textPlaceholder: 'پنُن پیغام، لنک یا متن یتھ پٲٹھۍ پیسٹ کریو...',
    urlPlaceholder: 'ویب سائٹ URL یتھ پٲٹھۍ پیسٹ کریو...', checkNow: 'وُن جانچ کریو', checking: 'جانچ جاری...',
    privacy: 'تُہند ڈیٹا نجی چھ۔ اَس تُہند ذاتی معلومات محفوظ نہٕ کران۔', listen: 'سُنو', selectLanguage: 'زبان ژٲریو',
    documentUnavailable: 'دستاویز اسکیننگ ابھی دستیاب چھ نہ۔ پیغام، لنک، QR کوڈ یا تصویر استعمال کریو۔',
    urlRequired: 'مہربانی کٔرتھ پہلے ویب سائٹ URL درج کریو۔', textRequired: 'مہربانی کٔرتھ پہلے پیغام یا متن پیسٹ کریو۔',
    imageRequired: 'مہربانی کٔرتھ پہلے تصویر ژٲریو۔', scanError: 'یہ مواد تجزیہ کرنہٕ منز ناکام۔ دوبارہ کوشش کریو۔',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const manipuriTranslation: AppTranslation = {
  brand: { tagline: 'সচেতন ওইরো। সুরক্ষিত ওইরো।', digitalIndia: 'সুরক্ষিত ডিজিটেল ভারত' },
  nav: { home: 'হোম', check: 'যাচাই তৌ', history: 'ইতিহাস', safetyLock: 'সেফটি লক', safetyTips: 'সেফটি টিপস', reportScam: 'স্কেম রিপোর্ট তৌ', settings: 'সেটিংস' },
  home: {
    safePrefix: 'মসি', safeHighlight: 'সুরক্ষিত নত্ত্রা?', subtitle: 'ক্লিক, শেয়ার নত্ত্রগা পেমেন্ট তৌদ্রিঙৈ মমাংদা যাচাই তৌ।',
    message: 'মেসেজ', messageSubtitle: 'SMS, WhatsApp,\nইমেল অমসুং', link: 'লিংক', linkSubtitle: 'ৱেবসাইট URL',
    qrCode: 'QR কোড', qrSubtitle: 'স্কেন নত্ত্রগা আপলোড তৌ', image: 'ইমেজ', imageSubtitle: 'স্ক্রীনশট নত্ত্রগা ফোটো',
    document: 'ডকুমেন্ট', documentSubtitle: 'PDF, DOC অমসুং', textPlaceholder: 'নহাক্কী মেসেজ, লিংক নত্ত্রগা টেক্সট মফম অসিদা পেস্ট তৌ...',
    urlPlaceholder: 'ৱেবসাইট URL মফম অসিদা পেস্ট তৌ...', checkNow: 'হৌজিক যাচাই তৌ', checking: 'যাচাই তৌরিবা...',
    privacy: 'নহাক্কী ডাটা প্রাইভেট ওই। ঐখোয়না নহাক্কী ব্যক্তিগত তথ্য স্টোর তৌদে।', listen: 'তারো', selectLanguage: 'লোন খল্লো',
    documentUnavailable: 'ডকুমেন্ট স্কেনিং হায়রিবা সংযোগ তৌদে। মেসেজ, লিংক, QR কোড নত্ত্রগা ইমেজ শিজিন্নৌ।',
    urlRequired: 'চান্দ্রা ৱেবসাইট URL মমাংদা ইয়ারো।', textRequired: 'চান্দ্রা মেসেজ নত্ত্রগা টেক্সট মমাংদা পেস্ট তৌ।',
    imageRequired: 'চান্দ্রা ইমেজ মমাংদা খল্লো।', scanError: 'মসিগী কনটেন্ট অ্যানালাইস তৌবা য়ারোই। অমুক হন্না ট্রাই তৌ।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const santaliTranslation: AppTranslation = {
  brand: { tagline: 'সচেতন মেনাম। নিরাপদ মেনাম।', digitalIndia: 'নিরাপদ ডিজিটাল ভারত' },
  nav: { home: 'অঁড়াক', check: 'তোল', history: 'ইতিহাস', safetyLock: 'নিরাপত্তা লক', safetyTips: 'নিরাপত্তা পরামর্শ', reportScam: 'ঠকবাজি জানাও', settings: 'সেটিংস' },
  home: {
    safePrefix: 'নোয়া কি', safeHighlight: 'নিরাপদ কান?', subtitle: 'ক্লিক, ভাগ বা টাকা দেওয়ার আগে তোল কাতাম।',
    message: 'কথা', messageSubtitle: 'SMS, WhatsApp,\nইমেল আদ', link: 'লিংক', linkSubtitle: 'ওয়েবসাইট URL',
    qrCode: 'QR কোড', qrSubtitle: 'স্ক্যান বা আপলোড কাতাম', image: 'ছবি', imageSubtitle: 'স্ক্রিনশট বা ফটো',
    document: 'কাগজ', documentSubtitle: 'PDF, DOC আদ', textPlaceholder: 'আমের কথা, লিংক বা লেখা নোড়ে পেস্ট কাতাম...',
    urlPlaceholder: 'ওয়েবসাইট URL নোড়ে পেস্ট কাতাম...', checkNow: 'এখন তোল কাতাম', checking: 'তোল হোচে...',
    privacy: 'আমের ডাটা ব্যক্তিগত। আম আমের ব্যক্তিগত তথ্য জমা নাকাতাম।', listen: 'আয়মে', selectLanguage: 'ভাষা বাছাও',
    documentUnavailable: 'কাগজ স্ক্যানিং এখনও জোড়া নাকানা। কথা, লিংক, QR কোড বা ছবি ব্যবহার কাতাম।',
    urlRequired: 'দয়া কাতাম আগে ওয়েবসাইট URL দাও।', textRequired: 'দয়া কাতাম আগে কথা বা লেখা পেস্ট কাতাম।',
    imageRequired: 'দয়া কাতাম আগে ছবি বাছাও।', scanError: 'নোয়া জিনিস বিশ্লেষণ নাকানা। আবার চেষ্টা কাতাম।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const sindhiTranslation: AppTranslation = {
  brand: { tagline: 'باخبر رهو. محفوظ رهو.', digitalIndia: 'محفوظ ڊجيٽل ڀارت' },
  nav: { home: 'گهر', check: 'چڪاس ڪريو', history: 'تاريخ', safetyLock: 'حفاظتي لاڪ', safetyTips: 'حفاظتي صلاحون', reportScam: 'اسڪيم جي رپورٽ ڪريو', settings: 'سيٽنگون' },
  home: {
    safePrefix: 'ڇا هي', safeHighlight: 'محفوظ آهي؟', subtitle: 'ڪلڪ، شيئر يا ادائيگي ڪرڻ کان اڳ چڪاس ڪريو.',
    message: 'پيغام', messageSubtitle: 'SMS، WhatsApp،\nاي ميل وغيره', link: 'لنڪ', linkSubtitle: 'ويب سائيٽ URL',
    qrCode: 'QR ڪوڊ', qrSubtitle: 'اسڪين يا اپلوڊ ڪريو', image: 'تصوير', imageSubtitle: 'اسڪرين شاٽ يا فوٽو',
    document: 'دستاويز', documentSubtitle: 'PDF، DOC وغيره', textPlaceholder: 'پنهنجو پيغام، لنڪ يا متن هتي پيسٽ ڪريو...',
    urlPlaceholder: 'ويب سائيٽ URL هتي پيسٽ ڪريو...', checkNow: 'هاڻي چڪاس ڪريو', checking: 'چڪاس ٿي رهي آهي...',
    privacy: 'توهان جو ڊيٽا نجي آهي. اسان توهان جي ذاتي معلومات محفوظ نٿا ڪريون.', listen: 'ٻڌو', selectLanguage: 'ٻولي چونڊيو',
    documentUnavailable: 'دستاويز اسڪيننگ اڃا ڳنڍيل ناهي. پيغام، لنڪ، QR ڪوڊ يا تصوير استعمال ڪريو.',
    urlRequired: 'مهرباني ڪري پهرين ويب سائيٽ URL داخل ڪريو.', textRequired: 'مهرباني ڪري پهرين پيغام يا متن پيسٽ ڪريو.',
    imageRequired: 'مهرباني ڪري پهرين تصوير چونڊيو.', scanError: 'هن مواد جو تجزيو نه ٿي سگهيو. ٻيهر ڪوشش ڪريو.',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const urduTranslation: AppTranslation = {
  brand: { tagline: 'باخبر رہیں۔ محفوظ رہیں۔', digitalIndia: 'ایک محفوظ ڈیجیٹل بھارت' },
  nav: { home: 'ہوم', check: 'جانچ کریں', history: 'تاریخ', safetyLock: 'سیفٹی لاک', safetyTips: 'حفاظتی تجاویز', reportScam: 'اسکیم کی رپورٹ کریں', settings: 'ترتیبات' },
  home: {
    safePrefix: 'کیا یہ', safeHighlight: 'محفوظ ہے؟', subtitle: 'کلک، شیئر یا ادائیگی کرنے سے پہلے جانچ کریں۔',
    message: 'پیغام', messageSubtitle: 'SMS، WhatsApp،\nای میل وغیرہ', link: 'لنک', linkSubtitle: 'ویب سائٹ URL',
    qrCode: 'QR کوڈ', qrSubtitle: 'اسکین یا اپ لوڈ کریں', image: 'تصویر', imageSubtitle: 'اسکرین شاٹ یا فوٹو',
    document: 'دستاویز', documentSubtitle: 'PDF، DOC وغیرہ', textPlaceholder: 'اپنا پیغام، لنک یا متن یہاں پیسٹ کریں...',
    urlPlaceholder: 'ویب سائٹ URL یہاں پیسٹ کریں...', checkNow: 'ابھی جانچ کریں', checking: 'جانچ ہو رہی ہے...',
    privacy: 'آپ کا ڈیٹا نجی ہے۔ ہم آپ کی ذاتی معلومات محفوظ نہیں کرتے۔', listen: 'سنیں', selectLanguage: 'زبان منتخب کریں',
    documentUnavailable: 'دستاویز اسکیننگ ابھی منسلک نہیں ہے۔ پیغام، لنک، QR کوڈ یا تصویر استعمال کریں۔',
    urlRequired: 'براہ کرم پہلے ویب سائٹ URL درج کریں۔', textRequired: 'براہ کرم پہلے پیغام یا متن پیسٹ کریں۔',
    imageRequired: 'براہ کرم پہلے ایک تصویر منتخب کریں۔', scanError: 'اس مواد کا تجزیہ نہیں ہو سکا۔ دوبارہ کوشش کریں۔',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

const sanskritTranslation: AppTranslation = {
  brand: { tagline: 'सावधानाः भवत। सुरक्षिताः भवत।', digitalIndia: 'सुरक्षितं डिजिटल भारतम्' },
  nav: { home: 'गृहम्', check: 'परीक्षताम्', history: 'इतिहासः', safetyLock: 'सुरक्षा-कुलुपम्', safetyTips: 'सुरक्षा-सूचनाः', reportScam: 'छलस्य सूचनां ददातु', settings: 'विन्यासाः' },
  home: {
    safePrefix: 'किम् एतत्', safeHighlight: 'सुरक्षितम् अस्ति?', subtitle: 'क्लिक्, साझाकरणं वा भुगतानं कर्तुं पूर्वं परीक्षताम्।',
    message: 'सन्देशः', messageSubtitle: 'SMS, WhatsApp,\nईमेल् इत्यादि', link: 'सङ्केतः', linkSubtitle: 'जालस्थलस्य URL',
    qrCode: 'QR कोडः', qrSubtitle: 'स्कैन् वा अपलोड् कुर्वन्तु', image: 'चित्रम्', imageSubtitle: 'स्क्रीनशॉट् वा छायाचित्रम्',
    document: 'दस्तावेजः', documentSubtitle: 'PDF, DOC इत्यादि', textPlaceholder: 'स्वसन्देशं, सङ्केतं वा पाठं अत्र पेस्ट् कुर्वन्तु...',
    urlPlaceholder: 'जालस्थलस्य URL अत्र पेस्ट् कुर्वन्तु...', checkNow: 'अधुना परीक्षताम्', checking: 'परीक्षणं क्रियते...',
    privacy: 'भवतः दत्तांशः निजः अस्ति। वयं भवतः व्यक्तिगतसूचनां न संगृह्णीमः।', listen: 'शृणुत', selectLanguage: 'भाषां चिनुत',
    documentUnavailable: 'दस्तावेज-परीक्षणं अद्यापि सम्बद्धं नास्ति। सन्देशं, सङ्केतं, QR कोडं वा चित्रं प्रयुञ्जताम्।',
    urlRequired: 'कृपया प्रथमं जालस्थलस्य URL प्रविशतु।', textRequired: 'कृपया प्रथमं सन्देशं वा पाठं पेस्ट् कुर्वन्तु।',
    imageRequired: 'कृपया प्रथमं चित्रं चिनुत।', scanError: 'अस्य विषयस्य विश्लेषणं कर्तुं न शक्यम्। पुनः प्रयत्नं कुर्वन्तु।',
    scamFingerprint: 'Scam Fingerprint', scamClassification: 'Scam Classification', variantDetection: 'Variant Detection',
    screenshotAnalysis: 'Screenshot Analysis', confidence: 'Confidence', primaryTactic: 'Primary Tactic',
    scamFamily: 'Scam Family', similarity: 'Similarity', extractedText: 'Extracted Text',
    detectedUrls: 'Detected URLs', analysisMethod: 'Analysis Method', noScreenshotData: 'No screenshot analysis data is available.',
  },
};

export const englishFallback = englishTranslation;

export const translations: Record<LanguageCode, AppTranslation> = {
  en: englishTranslation,
  hi: hindiTranslation,
  mr: marathiTranslation,
  bn: bengaliTranslation,
  gu: gujaratiTranslation,
  ta: tamilTranslation,
  te: teluguTranslation,
  kn: kannadaTranslation,
  ml: malayalamTranslation,
  or: odiaTranslation,
  pa: punjabiTranslation,
  ne: nepaliTranslation,
  as: assameseTranslation,
  kok: konkaniTranslation,
  mai: maithiliTranslation,
  brx: bhojpuriLikeBodoTranslation,
  doi: dogriTranslation,
  ks: kashmiriTranslation,
  mni: manipuriTranslation,
  sat: santaliTranslation,
  sd: sindhiTranslation,
  ur: urduTranslation,
  sa: sanskritTranslation,
};
