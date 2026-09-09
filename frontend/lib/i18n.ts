import type {
  LanguageCode,
} from './languages';

const translationData = {
  en: {
    home: 'Home',
    check: 'Check',
    history: 'History',
    safetyLock: 'Safety Lock',
    safetyTips: 'Safety Tips',
    reportScam: 'Report Scam',
    settings: 'Settings',
    newCheck: 'New Check',
    recentChecks: 'Recent Checks',
    protected: 'You are Protected',
    protectionOn: 'Safety Lock is active',

    isThisSafe: 'Is this safe?',
    checkBefore: 'Check before you click, share or pay.',
    message: 'Message',
    link: 'Link',
    qrCode: 'QR Code',
    image: 'Image',
    document: 'Document',

    messageSub: 'SMS, WhatsApp, Email, etc.',
    linkSub: 'Website URL',
    qrSub: 'Scan or upload',
    imageSub: 'Screenshot or photo',
    documentSub: 'PDF, DOC, etc.',

    checkNow: 'Check Now',
    checking: 'Checking...',
    pasteMessage:
      'Paste your message, link or any text here...',
    pasteUrl:
      'Paste a website URL here...',

    private:
      'Your data is private. We do not store your personal information.',

    looksSafe: 'Looks Safe',
    beCareful: 'Be Careful',
    notSafe: 'Not Safe',

    yourChecks: 'Your Checks',
    searchChecks: 'Search your checks...',

    learnTips: 'Learn Simple Safety Tips',
    smallSteps: 'Small steps. A safer you.',

    reportTitle: 'Report a Cyber Scam',
    reportSubtitle:
      'Help make the internet safer for everyone.',

    settingsTitle: 'Settings',
    language: 'Language',
    textSize: 'Text Size',
    listen: 'Listen (Read Aloud)',
    darkMode: 'Dark Mode',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    about: 'About CyberRaksha',

    english: 'English',
    listenButton: 'Listen',
  },

  hi: {
    home: 'होम',
    check: 'जाँच',
    history: 'इतिहास',
    safetyLock: 'सुरक्षा लॉक',
    safetyTips: 'सुरक्षा सुझाव',
    reportScam: 'धोखाधड़ी रिपोर्ट करें',
    settings: 'सेटिंग्स',
    newCheck: 'नई जाँच',
    recentChecks: 'हाल की जाँच',
    protected: 'आप सुरक्षित हैं',
    protectionOn: 'सुरक्षा लॉक सक्रिय है',

    isThisSafe: 'क्या यह सुरक्षित है?',
    checkBefore:
      'क्लिक, शेयर या भुगतान करने से पहले जाँच करें।',

    message: 'संदेश',
    link: 'लिंक',
    qrCode: 'QR कोड',
    image: 'छवि',
    document: 'दस्तावेज़',

    messageSub: 'SMS, WhatsApp, ईमेल आदि',
    linkSub: 'वेबसाइट URL',
    qrSub: 'स्कैन या अपलोड करें',
    imageSub: 'स्क्रीनशॉट या फोटो',
    documentSub: 'PDF, DOC आदि',

    checkNow: 'अभी जाँच करें',
    checking: 'जाँच हो रही है...',
    pasteMessage:
      'अपना संदेश, लिंक या कोई टेक्स्ट यहाँ पेस्ट करें...',
    pasteUrl:
      'वेबसाइट URL यहाँ पेस्ट करें...',

    private:
      'आपका डेटा निजी है। हम आपकी व्यक्तिगत जानकारी संग्रहीत नहीं करते।',

    looksSafe: 'सुरक्षित लगता है',
    beCareful: 'सावधान रहें',
    notSafe: 'सुरक्षित नहीं है',

    yourChecks: 'आपकी जाँच',
    searchChecks: 'अपनी जाँच खोजें...',

    learnTips: 'आसान सुरक्षा सुझाव सीखें',
    smallSteps: 'छोटे कदम। अधिक सुरक्षित आप।',

    reportTitle: 'साइबर धोखाधड़ी की रिपोर्ट करें',
    reportSubtitle:
      'इंटरनेट को सभी के लिए सुरक्षित बनाने में मदद करें।',

    settingsTitle: 'सेटिंग्स',
    language: 'भाषा',
    textSize: 'टेक्स्ट आकार',
    listen: 'सुनें (पढ़कर सुनाएँ)',
    darkMode: 'डार्क मोड',
    privacy: 'गोपनीयता नीति',
    terms: 'उपयोग की शर्तें',
    about: 'CyberRaksha के बारे में',

    english: 'अंग्रेज़ी',
    listenButton: 'सुनें',
  },

  bn: {
    home: 'হোম',
    check: 'পরীক্ষা',
    history: 'ইতিহাস',
    safetyLock: 'সেফটি লক',
    safetyTips: 'নিরাপত্তা টিপস',
    reportScam: 'স্ক্যাম রিপোর্ট',
    settings: 'সেটিংস',
    newCheck: 'নতুন পরীক্ষা',
    recentChecks: 'সাম্প্রতিক পরীক্ষা',
    protected: 'আপনি সুরক্ষিত',
    protectionOn: 'সেফটি লক সক্রিয়',

    isThisSafe: 'এটি কি নিরাপদ?',
    checkBefore:
      'ক্লিক, শেয়ার বা পেমেন্ট করার আগে পরীক্ষা করুন।',

    message: 'বার্তা',
    link: 'লিংক',
    qrCode: 'QR কোড',
    image: 'ছবি',
    document: 'ডকুমেন্ট',

    messageSub: 'SMS, WhatsApp, ইমেল ইত্যাদি',
    linkSub: 'ওয়েবসাইট URL',
    qrSub: 'স্ক্যান বা আপলোড করুন',
    imageSub: 'স্ক্রিনশট বা ছবি',
    documentSub: 'PDF, DOC ইত্যাদি',

    checkNow: 'এখন পরীক্ষা করুন',
    checking: 'পরীক্ষা হচ্ছে...',
    pasteMessage:
      'আপনার বার্তা, লিংক বা যেকোনো লেখা এখানে পেস্ট করুন...',
    pasteUrl:
      'ওয়েবসাইট URL এখানে পেস্ট করুন...',

    private:
      'আপনার ডেটা ব্যক্তিগত। আমরা আপনার ব্যক্তিগত তথ্য সংরক্ষণ করি না।',

    looksSafe: 'নিরাপদ মনে হচ্ছে',
    beCareful: 'সতর্ক থাকুন',
    notSafe: 'নিরাপদ নয়',

    yourChecks: 'আপনার পরীক্ষাগুলি',
    searchChecks: 'আপনার পরীক্ষা খুঁজুন...',

    learnTips: 'সহজ নিরাপত্তা টিপস শিখুন',
    smallSteps: 'ছোট পদক্ষেপ। আরও নিরাপদ আপনি।',

    reportTitle: 'সাইবার স্ক্যাম রিপোর্ট করুন',
    reportSubtitle:
      'সবার জন্য ইন্টারনেটকে আরও নিরাপদ করতে সাহায্য করুন।',

    settingsTitle: 'সেটিংস',
    language: 'ভাষা',
    textSize: 'টেক্সটের আকার',
    listen: 'শুনুন',
    darkMode: 'ডার্ক মোড',
    privacy: 'গোপনীয়তা নীতি',
    terms: 'ব্যবহারের শর্তাবলী',
    about: 'CyberRaksha সম্পর্কে',

    english: 'ইংরেজি',
    listenButton: 'শুনুন',
  },

  te: {
    home: 'హోమ్',
    check: 'చెక్',
    history: 'చరిత్ర',
    safetyLock: 'సేఫ్టీ లాక్',
    safetyTips: 'భద్రతా చిట్కాలు',
    reportScam: 'స్కామ్ రిపోర్ట్',
    settings: 'సెట్టింగ్స్',
    newCheck: 'కొత్త చెక్',
    recentChecks: 'ఇటీవలి చెక్స్',
    protected: 'మీరు సురక్షితంగా ఉన్నారు',
    protectionOn: 'సేఫ్టీ లాక్ యాక్టివ్‌గా ఉంది',

    isThisSafe: 'ఇది సురక్షితమేనా?',
    checkBefore:
      'క్లిక్, షేర్ లేదా చెల్లింపు చేసే ముందు చెక్ చేయండి.',

    message: 'సందేశం',
    link: 'లింక్',
    qrCode: 'QR కోడ్',
    image: 'చిత్రం',
    document: 'డాక్యుమెంట్',

    messageSub: 'SMS, WhatsApp, Email మొదలైనవి',
    linkSub: 'వెబ్‌సైట్ URL',
    qrSub: 'స్కాన్ లేదా అప్‌లోడ్ చేయండి',
    imageSub: 'స్క్రీన్‌షాట్ లేదా ఫోటో',
    documentSub: 'PDF, DOC మొదలైనవి',

    checkNow: 'ఇప్పుడే చెక్ చేయండి',
    checking: 'చెక్ చేస్తోంది...',
    pasteMessage:
      'మీ సందేశం, లింక్ లేదా టెక్స్ట్ ఇక్కడ పేస్ట్ చేయండి...',
    pasteUrl:
      'వెబ్‌సైట్ URL ఇక్కడ పేస్ట్ చేయండి...',

    private:
      'మీ డేటా ప్రైవేట్. మేము మీ వ్యక్తిగత సమాచారాన్ని నిల్వ చేయము.',

    looksSafe: 'సురక్షితంగా కనిపిస్తోంది',
    beCareful: 'జాగ్రత్తగా ఉండండి',
    notSafe: 'సురక్షితం కాదు',

    yourChecks: 'మీ చెక్స్',
    searchChecks: 'మీ చెక్స్ కోసం వెతకండి...',

    learnTips: 'సులభమైన భద్రతా చిట్కాలు నేర్చుకోండి',
    smallSteps: 'చిన్న అడుగులు. మరింత సురక్షితమైన మీరు.',

    reportTitle: 'సైబర్ స్కామ్‌ను రిపోర్ట్ చేయండి',
    reportSubtitle:
      'అందరికీ ఇంటర్నెట్‌ను సురక్షితంగా చేయడంలో సహాయం చేయండి.',

    settingsTitle: 'సెట్టింగ్స్',
    language: 'భాష',
    textSize: 'టెక్స్ట్ పరిమాణం',
    listen: 'వినండి',
    darkMode: 'డార్క్ మోడ్',
    privacy: 'గోప్యతా విధానం',
    terms: 'ఉపయోగ నిబంధనలు',
    about: 'CyberRaksha గురించి',

    english: 'ఇంగ్లీష్',
    listenButton: 'వినండి',
  },

  mr: {
    home: 'मुख्यपृष्ठ',
    check: 'तपासा',
    history: 'इतिहास',
    safetyLock: 'सुरक्षा लॉक',
    safetyTips: 'सुरक्षा टिप्स',
    reportScam: 'फसवणूक रिपोर्ट करा',
    settings: 'सेटिंग्ज',
    newCheck: 'नवीन तपासणी',
    recentChecks: 'अलीकडील तपासण्या',
    protected: 'तुम्ही सुरक्षित आहात',
    protectionOn: 'सुरक्षा लॉक सक्रिय आहे',

    isThisSafe: 'हे सुरक्षित आहे का?',
    checkBefore:
      'क्लिक, शेअर किंवा पेमेंट करण्यापूर्वी तपासा.',

    message: 'संदेश',
    link: 'लिंक',
    qrCode: 'QR कोड',
    image: 'प्रतिमा',
    document: 'दस्तऐवज',

    messageSub: 'SMS, WhatsApp, ईमेल इ.',
    linkSub: 'वेबसाइट URL',
    qrSub: 'स्कॅन किंवा अपलोड करा',
    imageSub: 'स्क्रीनशॉट किंवा फोटो',
    documentSub: 'PDF, DOC इ.',

    checkNow: 'आता तपासा',
    checking: 'तपासत आहे...',
    pasteMessage:
      'तुमचा संदेश, लिंक किंवा कोणताही मजकूर येथे पेस्ट करा...',
    pasteUrl:
      'वेबसाइट URL येथे पेस्ट करा...',

    private:
      'तुमचा डेटा खाजगी आहे. आम्ही तुमची वैयक्तिक माहिती साठवत नाही.',

    looksSafe: 'सुरक्षित दिसत आहे',
    beCareful: 'सावध रहा',
    notSafe: 'सुरक्षित नाही',

    yourChecks: 'तुमच्या तपासण्या',
    searchChecks: 'तुमच्या तपासण्या शोधा...',

    learnTips: 'सोप्या सुरक्षा टिप्स शिका',
    smallSteps: 'छोटी पावले. अधिक सुरक्षित तुम्ही.',

    reportTitle: 'सायबर फसवणुकीची तक्रार करा',
    reportSubtitle:
      'इंटरनेट सर्वांसाठी सुरक्षित करण्यास मदत करा.',

    settingsTitle: 'सेटिंग्ज',
    language: 'भाषा',
    textSize: 'मजकूर आकार',
    listen: 'ऐका',
    darkMode: 'डार्क मोड',
    privacy: 'गोपनीयता धोरण',
    terms: 'वापरण्याच्या अटी',
    about: 'CyberRaksha बद्दल',

    english: 'इंग्रजी',
    listenButton: 'ऐका',
  },

  ta: {
    home: 'முகப்பு',
    check: 'சரிபார்க்க',
    history: 'வரலாறு',
    safetyLock: 'பாதுகாப்பு பூட்டு',
    safetyTips: 'பாதுகாப்பு குறிப்புகள்',
    reportScam: 'மோசடியைப் புகாரளிக்கவும்',
    settings: 'அமைப்புகள்',
    newCheck: 'புதிய சரிபார்ப்பு',
    recentChecks: 'சமீபத்திய சரிபார்ப்புகள்',
    protected: 'நீங்கள் பாதுகாப்பாக உள்ளீர்கள்',
    protectionOn: 'பாதுகாப்பு பூட்டு செயலில் உள்ளது',

    isThisSafe: 'இது பாதுகாப்பானதா?',
    checkBefore:
      'கிளிக், பகிர்வு அல்லது பணம் செலுத்துவதற்கு முன் சரிபார்க்கவும்.',

    message: 'செய்தி',
    link: 'இணைப்பு',
    qrCode: 'QR குறியீடு',
    image: 'படம்',
    document: 'ஆவணம்',

    messageSub: 'SMS, WhatsApp, Email போன்றவை',
    linkSub: 'இணையதள URL',
    qrSub: 'ஸ்கேன் அல்லது பதிவேற்றவும்',
    imageSub: 'ஸ்கிரீன்ஷாட் அல்லது புகைப்படம்',
    documentSub: 'PDF, DOC போன்றவை',

    checkNow: 'இப்போது சரிபார்க்கவும்',
    checking: 'சரிபார்க்கிறது...',
    pasteMessage:
      'உங்கள் செய்தி, இணைப்பு அல்லது உரையை இங்கே ஒட்டவும்...',
    pasteUrl:
      'இணையதள URL-ஐ இங்கே ஒட்டவும்...',

    private:
      'உங்கள் தரவு தனிப்பட்டது. உங்கள் தனிப்பட்ட தகவலை நாங்கள் சேமிப்பதில்லை.',

    looksSafe: 'பாதுகாப்பாகத் தெரிகிறது',
    beCareful: 'கவனமாக இருங்கள்',
    notSafe: 'பாதுகாப்பானது அல்ல',

    yourChecks: 'உங்கள் சரிபார்ப்புகள்',
    searchChecks: 'உங்கள் சரிபார்ப்புகளைத் தேடுங்கள்...',

    learnTips: 'எளிய பாதுகாப்பு குறிப்புகளைக் கற்றுக்கொள்ளுங்கள்',
    smallSteps: 'சிறிய படிகள். பாதுகாப்பான நீங்கள்.',

    reportTitle: 'சைபர் மோசடியைப் புகாரளிக்கவும்',
    reportSubtitle:
      'அனைவருக்கும் இணையத்தை பாதுகாப்பானதாக மாற்ற உதவுங்கள்.',

    settingsTitle: 'அமைப்புகள்',
    language: 'மொழி',
    textSize: 'உரை அளவு',
    listen: 'கேளுங்கள்',
    darkMode: 'டார்க் மோட்',
    privacy: 'தனியுரிமைக் கொள்கை',
    terms: 'பயன்பாட்டு விதிமுறைகள்',
    about: 'CyberRaksha பற்றி',

    english: 'ஆங்கிலம்',
    listenButton: 'கேளுங்கள்',
  },

  gu: {
    home: 'હોમ',
    check: 'ચેક',
    history: 'ઇતિહાસ',
    safetyLock: 'સેફ્ટી લોક',
    safetyTips: 'સુરક્ષા ટીપ્સ',
    reportScam: 'સ્કેમ રિપોર્ટ કરો',
    settings: 'સેટિંગ્સ',
    newCheck: 'નવી તપાસ',
    recentChecks: 'તાજેતરની તપાસ',
    protected: 'તમે સુરક્ષિત છો',
    protectionOn: 'સેફ્ટી લોક સક્રિય છે',

    isThisSafe: 'શું આ સુરક્ષિત છે?',
    checkBefore:
      'ક્લિક, શેર અથવા ચુકવણી કરતા પહેલા તપાસો.',

    message: 'સંદેશ',
    link: 'લિંક',
    qrCode: 'QR કોડ',
    image: 'છબી',
    document: 'દસ્તાવેજ',

    messageSub: 'SMS, WhatsApp, ઈમેલ વગેરે',
    linkSub: 'વેબસાઇટ URL',
    qrSub: 'સ્કેન અથવા અપલોડ કરો',
    imageSub: 'સ્ક્રીનશોટ અથવા ફોટો',
    documentSub: 'PDF, DOC વગેરે',

    checkNow: 'હમણાં ચેક કરો',
    checking: 'ચેક થઈ રહ્યું છે...',
    pasteMessage:
      'તમારો સંદેશ, લિંક અથવા કોઈપણ ટેક્સ્ટ અહીં પેસ્ટ કરો...',
    pasteUrl:
      'વેબસાઇટ URL અહીં પેસ્ટ કરો...',

    private:
      'તમારો ડેટા ખાનગી છે. અમે તમારી વ્યક્તિગત માહિતી સંગ્રહિત કરતા નથી.',

    looksSafe: 'સુરક્ષિત લાગે છે',
    beCareful: 'સાવચેત રહો',
    notSafe: 'સુરક્ષિત નથી',

    yourChecks: 'તમારી તપાસ',
    searchChecks: 'તમારી તપાસ શોધો...',

    learnTips: 'સરળ સુરક્ષા ટીપ્સ શીખો',
    smallSteps: 'નાના પગલાં. વધુ સુરક્ષિત તમે.',

    reportTitle: 'સાયબર સ્કેમની જાણ કરો',
    reportSubtitle:
      'દરેક માટે ઇન્ટરનેટને સુરક્ષિત બનાવવામાં મદદ કરો.',

    settingsTitle: 'સેટિંગ્સ',
    language: 'ભાષા',
    textSize: 'ટેક્સ્ટ કદ',
    listen: 'સાંભળો',
    darkMode: 'ડાર્ક મોડ',
    privacy: 'ગોપનીયતા નીતિ',
    terms: 'ઉપયોગની શરતો',
    about: 'CyberRaksha વિશે',

    english: 'અંગ્રેજી',
    listenButton: 'સાંભળો',
  },

  ur: {
    home: 'ہوم',
    check: 'چیک',
    history: 'تاریخ',
    safetyLock: 'سیفٹی لاک',
    safetyTips: 'حفاظتی تجاویز',
    reportScam: 'اسکیم کی رپورٹ',
    settings: 'ترتیبات',
    newCheck: 'نیا چیک',
    recentChecks: 'حالیہ چیکس',
    protected: 'آپ محفوظ ہیں',
    protectionOn: 'سیفٹی لاک فعال ہے',

    isThisSafe: 'کیا یہ محفوظ ہے؟',
    checkBefore:
      'کلک، شیئر یا ادائیگی سے پہلے چیک کریں۔',

    message: 'پیغام',
    link: 'لنک',
    qrCode: 'QR کوڈ',
    image: 'تصویر',
    document: 'دستاویز',

    messageSub: 'SMS، WhatsApp، ای میل وغیرہ',
    linkSub: 'ویب سائٹ URL',
    qrSub: 'اسکین یا اپ لوڈ کریں',
    imageSub: 'اسکرین شاٹ یا تصویر',
    documentSub: 'PDF، DOC وغیرہ',

    checkNow: 'ابھی چیک کریں',
    checking: 'چیک ہو رہا ہے...',
    pasteMessage:
      'اپنا پیغام، لنک یا متن یہاں پیسٹ کریں...',
    pasteUrl:
      'ویب سائٹ URL یہاں پیسٹ کریں...',

    private:
      'آپ کا ڈیٹا نجی ہے۔ ہم آپ کی ذاتی معلومات محفوظ نہیں کرتے۔',

    looksSafe: 'محفوظ لگتا ہے',
    beCareful: 'محتاط رہیں',
    notSafe: 'محفوظ نہیں',

    yourChecks: 'آپ کے چیکس',
    searchChecks: 'اپنے چیکس تلاش کریں...',

    learnTips: 'آسان حفاظتی تجاویز سیکھیں',
    smallSteps: 'چھوٹے قدم۔ زیادہ محفوظ آپ۔',

    reportTitle: 'سائبر اسکیم کی رپورٹ کریں',
    reportSubtitle:
      'انٹرنیٹ کو سب کے لیے محفوظ بنانے میں مدد کریں۔',

    settingsTitle: 'ترتیبات',
    language: 'زبان',
    textSize: 'متن کا سائز',
    listen: 'سنیں',
    darkMode: 'ڈارک موڈ',
    privacy: 'رازداری کی پالیسی',
    terms: 'استعمال کی شرائط',
    about: 'CyberRaksha کے بارے میں',

    english: 'انگریزی',
    listenButton: 'سنیں',
  },

  kn: {
    home: 'ಮುಖಪುಟ',
    check: 'ಪರಿಶೀಲಿಸಿ',
    history: 'ಇತಿಹಾಸ',
    safetyLock: 'ಸೇಫ್ಟಿ ಲಾಕ್',
    safetyTips: 'ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು',
    reportScam: 'ಸ್ಕ್ಯಾಮ್ ವರದಿ',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    newCheck: 'ಹೊಸ ಪರಿಶೀಲನೆ',
    recentChecks: 'ಇತ್ತೀಚಿನ ಪರಿಶೀಲನೆಗಳು',
    protected: 'ನೀವು ಸುರಕ್ಷಿತರಾಗಿದ್ದೀರಿ',
    protectionOn: 'ಸೇಫ್ಟಿ ಲಾಕ್ ಸಕ್ರಿಯವಾಗಿದೆ',

    isThisSafe: 'ಇದು ಸುರಕ್ಷಿತವೇ?',
    checkBefore:
      'ಕ್ಲಿಕ್, ಹಂಚಿಕೆ ಅಥವಾ ಪಾವತಿಸುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ.',

    message: 'ಸಂದೇಶ',
    link: 'ಲಿಂಕ್',
    qrCode: 'QR ಕೋಡ್',
    image: 'ಚಿತ್ರ',
    document: 'ದಾಖಲೆ',

    messageSub: 'SMS, WhatsApp, Email ಇತ್ಯಾದಿ',
    linkSub: 'ವೆಬ್‌ಸೈಟ್ URL',
    qrSub: 'ಸ್ಕ್ಯಾನ್ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    imageSub: 'ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಥವಾ ಫೋಟೋ',
    documentSub: 'PDF, DOC ಇತ್ಯಾದಿ',

    checkNow: 'ಈಗ ಪರಿಶೀಲಿಸಿ',
    checking: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    pasteMessage:
      'ನಿಮ್ಮ ಸಂದೇಶ, ಲಿಂಕ್ ಅಥವಾ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...',
    pasteUrl:
      'ವೆಬ್‌ಸೈಟ್ URL ಅನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...',

    private:
      'ನಿಮ್ಮ ಡೇಟಾ ಖಾಸಗಿಯಾಗಿದೆ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ನಾವು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.',

    looksSafe: 'ಸುರಕ್ಷಿತವಾಗಿ ಕಾಣುತ್ತದೆ',
    beCareful: 'ಎಚ್ಚರಿಕೆಯಿಂದಿರಿ',
    notSafe: 'ಸುರಕ್ಷಿತವಲ್ಲ',

    yourChecks: 'ನಿಮ್ಮ ಪರಿಶೀಲನೆಗಳು',
    searchChecks: 'ನಿಮ್ಮ ಪರಿಶೀಲನೆಗಳನ್ನು ಹುಡುಕಿ...',

    learnTips: 'ಸರಳ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳನ್ನು ಕಲಿಯಿರಿ',
    smallSteps: 'ಸಣ್ಣ ಹೆಜ್ಜೆಗಳು. ಹೆಚ್ಚು ಸುರಕ್ಷಿತ ನೀವು.',

    reportTitle: 'ಸೈಬರ್ ಸ್ಕ್ಯಾಮ್ ವರದಿ ಮಾಡಿ',
    reportSubtitle:
      'ಎಲ್ಲರಿಗೂ ಇಂಟರ್ನೆಟ್ ಅನ್ನು ಸುರಕ್ಷಿತವಾಗಿಸಲು ಸಹಾಯ ಮಾಡಿ.',

    settingsTitle: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    language: 'ಭಾಷೆ',
    textSize: 'ಪಠ್ಯ ಗಾತ್ರ',
    listen: 'ಕೇಳಿ',
    darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್',
    privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
    terms: 'ಬಳಕೆಯ ನಿಯಮಗಳು',
    about: 'CyberRaksha ಕುರಿತು',

    english: 'ಇಂಗ್ಲಿಷ್',
    listenButton: 'ಕೇಳಿ',
  },

  or: {
    home: 'ମୁଖ୍ୟପୃଷ୍ଠା',
    check: 'ଯାଞ୍ଚ',
    history: 'ଇତିହାସ',
    safetyLock: 'ସୁରକ୍ଷା ଲକ୍',
    safetyTips: 'ସୁରକ୍ଷା ଟିପ୍ସ',
    reportScam: 'ସ୍କାମ୍ ରିପୋର୍ଟ',
    settings: 'ସେଟିଂସ୍',
    newCheck: 'ନୂଆ ଯାଞ୍ଚ',
    recentChecks: 'ସାମ୍ପ୍ରତିକ ଯାଞ୍ଚ',
    protected: 'ଆପଣ ସୁରକ୍ଷିତ',
    protectionOn: 'ସୁରକ୍ଷା ଲକ୍ ସକ୍ରିୟ',

    isThisSafe: 'ଏହା ସୁରକ୍ଷିତ କି?',
    checkBefore:
      'କ୍ଲିକ୍, ସେୟାର୍ କିମ୍ବା ପେମେଣ୍ଟ କରିବା ପୂର୍ବରୁ ଯାଞ୍ଚ କରନ୍ତୁ।',

    message: 'ସନ୍ଦେଶ',
    link: 'ଲିଙ୍କ',
    qrCode: 'QR କୋଡ୍',
    image: 'ଛବି',
    document: 'ଦଲିଲ',

    messageSub: 'SMS, WhatsApp, ଇମେଲ୍ ଇତ୍ୟାଦି',
    linkSub: 'ୱେବସାଇଟ୍ URL',
    qrSub: 'ସ୍କାନ୍ କିମ୍ବା ଅପଲୋଡ୍ କରନ୍ତୁ',
    imageSub: 'ସ୍କ୍ରିନସଟ୍ କିମ୍ବା ଫଟୋ',
    documentSub: 'PDF, DOC ଇତ୍ୟାଦି',

    checkNow: 'ବର୍ତ୍ତମାନ ଯାଞ୍ଚ କରନ୍ତୁ',
    checking: 'ଯାଞ୍ଚ ହେଉଛି...',
    pasteMessage:
      'ଆପଣଙ୍କ ସନ୍ଦେଶ, ଲିଙ୍କ କିମ୍ବା ଟେକ୍ସଟ୍ ଏଠାରେ ପେଷ୍ଟ କରନ୍ତୁ...',
    pasteUrl:
      'ୱେବସାଇଟ୍ URL ଏଠାରେ ପେଷ୍ଟ କରନ୍ତୁ...',

    private:
      'ଆପଣଙ୍କ ଡାଟା ବ୍ୟକ୍ତିଗତ। ଆମେ ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ସୂଚନା ସଂରକ୍ଷଣ କରୁନାହୁଁ।',

    looksSafe: 'ସୁରକ୍ଷିତ ଲାଗୁଛି',
    beCareful: 'ସାବଧାନ ରୁହନ୍ତୁ',
    notSafe: 'ସୁରକ୍ଷିତ ନୁହେଁ',

    yourChecks: 'ଆପଣଙ୍କ ଯାଞ୍ଚ',
    searchChecks: 'ଆପଣଙ୍କ ଯାଞ୍ଚ ଖୋଜନ୍ତୁ...',

    learnTips: 'ସହଜ ସୁରକ୍ଷା ଟିପ୍ସ ଶିଖନ୍ତୁ',
    smallSteps: 'ଛୋଟ ପଦକ୍ଷେପ। ଅଧିକ ସୁରକ୍ଷିତ ଆପଣ।',

    reportTitle: 'ସାଇବର ସ୍କାମ୍ ରିପୋର୍ଟ କରନ୍ତୁ',
    reportSubtitle:
      'ସମସ୍ତଙ୍କ ପାଇଁ ଇଣ୍ଟରନେଟକୁ ସୁରକ୍ଷିତ କରିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ।',

    settingsTitle: 'ସେଟିଂସ୍',
    language: 'ଭାଷା',
    textSize: 'ଟେକ୍ସଟ୍ ଆକାର',
    listen: 'ଶୁଣନ୍ତୁ',
    darkMode: 'ଡାର୍କ ମୋଡ୍',
    privacy: 'ଗୋପନୀୟତା ନୀତି',
    terms: 'ବ୍ୟବହାର ସର୍ତ୍ତ',
    about: 'CyberRaksha ବିଷୟରେ',

    english: 'ଇଂରାଜୀ',
    listenButton: 'ଶୁଣନ୍ତୁ',
  },

  ml: {
    home: 'ഹോം',
    check: 'പരിശോധിക്കുക',
    history: 'ചരിത്രം',
    safetyLock: 'സേഫ്റ്റി ലോക്ക്',
    safetyTips: 'സുരക്ഷാ ടിപ്പുകൾ',
    reportScam: 'സ്കാം റിപ്പോർട്ട്',
    settings: 'ക്രമീകരണങ്ങൾ',
    newCheck: 'പുതിയ പരിശോധന',
    recentChecks: 'സമീപകാല പരിശോധനകൾ',
    protected: 'നിങ്ങൾ സുരക്ഷിതരാണ്',
    protectionOn: 'സേഫ്റ്റി ലോക്ക് സജീവമാണ്',

    isThisSafe: 'ഇത് സുരക്ഷിതമാണോ?',
    checkBefore:
      'ക്ലിക്ക് ചെയ്യുന്നതിന് മുമ്പ്, പങ്കിടുന്നതിന് മുമ്പ് അല്ലെങ്കിൽ പണമടയ്ക്കുന്നതിന് മുമ്പ് പരിശോധിക്കുക.',

    message: 'സന്ദേശം',
    link: 'ലിങ്ക്',
    qrCode: 'QR കോഡ്',
    image: 'ചിത്രം',
    document: 'രേഖ',

    messageSub: 'SMS, WhatsApp, ഇമെയിൽ തുടങ്ങിയവ',
    linkSub: 'വെബ്സൈറ്റ് URL',
    qrSub: 'സ്കാൻ അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യുക',
    imageSub: 'സ്ക്രീൻഷോട്ട് അല്ലെങ്കിൽ ഫോട്ടോ',
    documentSub: 'PDF, DOC തുടങ്ങിയവ',

    checkNow: 'ഇപ്പോൾ പരിശോധിക്കുക',
    checking: 'പരിശോധിക്കുന്നു...',
    pasteMessage:
      'നിങ്ങളുടെ സന്ദേശം, ലിങ്ക് അല്ലെങ്കിൽ ടെക്സ്റ്റ് ഇവിടെ പേസ്റ്റ് ചെയ്യുക...',
    pasteUrl:
      'വെബ്സൈറ്റ് URL ഇവിടെ പേസ്റ്റ് ചെയ്യുക...',

    private:
      'നിങ്ങളുടെ ഡാറ്റ സ്വകാര്യമാണ്. നിങ്ങളുടെ വ്യക്തിഗത വിവരങ്ങൾ ഞങ്ങൾ സൂക്ഷിക്കുന്നില്ല.',

    looksSafe: 'സുരക്ഷിതമാണെന്ന് തോന്നുന്നു',
    beCareful: 'ശ്രദ്ധിക്കുക',
    notSafe: 'സുരക്ഷിതമല്ല',

    yourChecks: 'നിങ്ങളുടെ പരിശോധനകൾ',
    searchChecks: 'നിങ്ങളുടെ പരിശോധനകൾ തിരയുക...',

    learnTips: 'ലളിതമായ സുരക്ഷാ ടിപ്പുകൾ പഠിക്കുക',
    smallSteps: 'ചെറിയ ചുവടുകൾ. കൂടുതൽ സുരക്ഷിതമായ നിങ്ങൾ.',

    reportTitle: 'സൈബർ സ്കാം റിപ്പോർട്ട് ചെയ്യുക',
    reportSubtitle:
      'എല്ലാവർക്കും ഇന്റർനെറ്റ് സുരക്ഷിതമാക്കാൻ സഹായിക്കുക.',

    settingsTitle: 'ക്രമീകരണങ്ങൾ',
    language: 'ഭാഷ',
    textSize: 'ടെക്സ്റ്റ് വലുപ്പം',
    listen: 'കേൾക്കുക',
    darkMode: 'ഡാർക്ക് മോഡ്',
    privacy: 'സ്വകാര്യതാ നയം',
    terms: 'ഉപയോഗ നിബന്ധനകൾ',
    about: 'CyberRaksha-യെ കുറിച്ച്',

    english: 'ഇംഗ്ലീഷ്',
    listenButton: 'കേൾക്കുക',
  },

  pa: {
    home: 'ਹੋਮ',
    check: 'ਜਾਂਚ',
    history: 'ਇਤਿਹਾਸ',
    safetyLock: 'ਸੇਫਟੀ ਲੌਕ',
    safetyTips: 'ਸੁਰੱਖਿਆ ਸੁਝਾਅ',
    reportScam: 'ਸਕੈਮ ਰਿਪੋਰਟ',
    settings: 'ਸੈਟਿੰਗਾਂ',
    newCheck: 'ਨਵੀਂ ਜਾਂਚ',
    recentChecks: 'ਹਾਲੀਆ ਜਾਂਚਾਂ',
    protected: 'ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਹੋ',
    protectionOn: 'ਸੇਫਟੀ ਲੌਕ ਸਰਗਰਮ ਹੈ',

    isThisSafe: 'ਕੀ ਇਹ ਸੁਰੱਖਿਅਤ ਹੈ?',
    checkBefore:
      'ਕਲਿੱਕ, ਸਾਂਝਾ ਜਾਂ ਭੁਗਤਾਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ ਕਰੋ।',

    message: 'ਸੁਨੇਹਾ',
    link: 'ਲਿੰਕ',
    qrCode: 'QR ਕੋਡ',
    image: 'ਤਸਵੀਰ',
    document: 'ਦਸਤਾਵੇਜ਼',

    messageSub: 'SMS, WhatsApp, ਈਮੇਲ ਆਦਿ',
    linkSub: 'ਵੈੱਬਸਾਈਟ URL',
    qrSub: 'ਸਕੈਨ ਜਾਂ ਅਪਲੋਡ ਕਰੋ',
    imageSub: 'ਸਕ੍ਰੀਨਸ਼ਾਟ ਜਾਂ ਫੋਟੋ',
    documentSub: 'PDF, DOC ਆਦਿ',

    checkNow: 'ਹੁਣੇ ਜਾਂਚ ਕਰੋ',
    checking: 'ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...',
    pasteMessage:
      'ਆਪਣਾ ਸੁਨੇਹਾ, ਲਿੰਕ ਜਾਂ ਟੈਕਸਟ ਇੱਥੇ ਪੇਸਟ ਕਰੋ...',
    pasteUrl:
      'ਵੈੱਬਸਾਈਟ URL ਇੱਥੇ ਪੇਸਟ ਕਰੋ...',

    private:
      'ਤੁਹਾਡਾ ਡੇਟਾ ਨਿੱਜੀ ਹੈ। ਅਸੀਂ ਤੁਹਾਡੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਸਟੋਰ ਨਹੀਂ ਕਰਦੇ।',

    looksSafe: 'ਸੁਰੱਖਿਅਤ ਲੱਗਦਾ ਹੈ',
    beCareful: 'ਸਾਵਧਾਨ ਰਹੋ',
    notSafe: 'ਸੁਰੱਖਿਅਤ ਨਹੀਂ',

    yourChecks: 'ਤੁਹਾਡੀਆਂ ਜਾਂਚਾਂ',
    searchChecks: 'ਆਪਣੀਆਂ ਜਾਂਚਾਂ ਖੋਜੋ...',

    learnTips: 'ਸਧਾਰਨ ਸੁਰੱਖਿਆ ਸੁਝਾਅ ਸਿੱਖੋ',
    smallSteps: 'ਛੋਟੇ ਕਦਮ। ਹੋਰ ਸੁਰੱਖਿਅਤ ਤੁਸੀਂ।',

    reportTitle: 'ਸਾਈਬਰ ਸਕੈਮ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    reportSubtitle:
      'ਹਰ ਕਿਸੇ ਲਈ ਇੰਟਰਨੈੱਟ ਨੂੰ ਸੁਰੱਖਿਅਤ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰੋ।',

    settingsTitle: 'ਸੈਟਿੰਗਾਂ',
    language: 'ਭਾਸ਼ਾ',
    textSize: 'ਟੈਕਸਟ ਆਕਾਰ',
    listen: 'ਸੁਣੋ',
    darkMode: 'ਡਾਰਕ ਮੋਡ',
    privacy: 'ਪਰਦੇਦਾਰੀ ਨੀਤੀ',
    terms: 'ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ',
    about: 'CyberRaksha ਬਾਰੇ',

    english: 'ਅੰਗਰੇਜ਼ੀ',
    listenButton: 'ਸੁਣੋ',
  },

  as: {
    home: 'হোম',
    check: 'পৰীক্ষা',
    history: 'ইতিহাস',
    safetyLock: 'সুৰক্ষা লক',
    safetyTips: 'সুৰক্ষা টিপছ',
    reportScam: 'স্কেম ৰিপৰ্ট',
    settings: 'ছেটিংছ',
    newCheck: 'নতুন পৰীক্ষা',
    recentChecks: 'শেহতীয়া পৰীক্ষা',
    protected: 'আপুনি সুৰক্ষিত',
    protectionOn: 'সুৰক্ষা লক সক্ৰিয়',

    isThisSafe: 'এইটো সুৰক্ষিত নেকি?',
    checkBefore:
      'ক্লিক, শ্বেয়াৰ বা পেমেণ্ট কৰাৰ আগতে পৰীক্ষা কৰক।',

    message: 'বাৰ্তা',
    link: 'লিংক',
    qrCode: 'QR কোড',
    image: 'ছবি',
    document: 'নথি',

    messageSub: 'SMS, WhatsApp, ইমেইল আদি',
    linkSub: 'ৱেবছাইট URL',
    qrSub: 'স্কেন বা আপলোড কৰক',
    imageSub: 'স্ক্ৰীনশ্বট বা ফটো',
    documentSub: 'PDF, DOC আদি',

    checkNow: 'এতিয়াই পৰীক্ষা কৰক',
    checking: 'পৰীক্ষা হৈ আছে...',
    pasteMessage:
      'আপোনাৰ বাৰ্তা, লিংক বা টেক্সট ইয়াত পেষ্ট কৰক...',
    pasteUrl:
      'ৱেবছাইট URL ইয়াত পেষ্ট কৰক...',

    private:
      'আপোনাৰ ডাটা ব্যক্তিগত। আমি আপোনাৰ ব্যক্তিগত তথ্য সংৰক্ষণ নকৰোঁ।',

    looksSafe: 'সুৰক্ষিত যেন লাগে',
    beCareful: 'সাৱধান হওক',
    notSafe: 'সুৰক্ষিত নহয়',

    yourChecks: 'আপোনাৰ পৰীক্ষাসমূহ',
    searchChecks: 'আপোনাৰ পৰীক্ষা বিচাৰক...',

    learnTips: 'সহজ সুৰক্ষা টিপছ শিকক',
    smallSteps: 'সৰু পদক্ষেপ। অধিক সুৰক্ষিত আপুনি।',

    reportTitle: 'চাইবাৰ স্কেম ৰিপৰ্ট কৰক',
    reportSubtitle:
      'সকলোৰে বাবে ইণ্টাৰনেট সুৰক্ষিত কৰাত সহায় কৰক।',

    settingsTitle: 'ছেটিংছ',
    language: 'ভাষা',
    textSize: 'টেক্সট আকাৰ',
    listen: 'শুনক',
    darkMode: 'ডাৰ্ক মোড',
    privacy: 'গোপনীয়তা নীতি',
    terms: 'ব্যৱহাৰৰ চৰ্ত',
    about: 'CyberRaksha ৰ বিষয়ে',

    english: 'ইংৰাজী',
    listenButton: 'শুনক',
  },

  sa: {
    home: 'मुखपृष्ठम्',
    check: 'परीक्षणम्',
    history: 'इतिहासः',
    safetyLock: 'सुरक्षातालकम्',
    safetyTips: 'सुरक्षासूचनाः',
    reportScam: 'धोखाधड़ी निवेदयतु',
    settings: 'विन्यासाः',
    newCheck: 'नूतनं परीक्षणम्',
    recentChecks: 'समीपकालीन परीक्षणानि',
    protected: 'भवान् सुरक्षितः अस्ति',
    protectionOn: 'सुरक्षातालकं सक्रियम् अस्ति',

    isThisSafe: 'किमिदं सुरक्षितम्?',
    checkBefore:
      'क्लिक्, साझाकरणं वा भुगतानं कर्तुं पूर्वं परीक्षणं कुरुत।',

    message: 'सन्देशः',
    link: 'सम्पर्कसूत्रम्',
    qrCode: 'QR संकेतः',
    image: 'चित्रम्',
    document: 'दस्तावेजः',

    messageSub: 'SMS, WhatsApp, ईमेल इत्यादि',
    linkSub: 'जालस्थल URL',
    qrSub: 'स्कैन अथवा अपलोड कुरुत',
    imageSub: 'स्क्रीनशॉट अथवा चित्रम्',
    documentSub: 'PDF, DOC इत्यादि',

    checkNow: 'अधुना परीक्षणं कुरुत',
    checking: 'परीक्षणं भवति...',
    pasteMessage:
      'स्वस्य सन्देशं, सम्पर्कसूत्रं वा पाठं अत्र स्थापयतु...',
    pasteUrl:
      'जालस्थल URL अत्र स्थापयतु...',

    private:
      'भवतः दत्तांशः गोपनीयः अस्ति। वयं व्यक्तिगतसूचनां न संगृह्णीमः।',

    looksSafe: 'सुरक्षितं दृश्यते',
    beCareful: 'सावधानः भवतु',
    notSafe: 'सुरक्षितं नास्ति',

    yourChecks: 'भवतः परीक्षणानि',
    searchChecks: 'परीक्षणानि अन्विष्यताम्...',

    learnTips: 'सरलाः सुरक्षासूचनाः ज्ञातुम्',
    smallSteps: 'लघुपदानि। अधिकं सुरक्षितं जीवनम्।',

    reportTitle: 'साइबर धोखाधड़ी निवेदयतु',
    reportSubtitle:
      'सर्वेषां कृते अन्तर्जालं सुरक्षितं कर्तुं साहाय्यं कुरुत।',

    settingsTitle: 'विन्यासाः',
    language: 'भाषा',
    textSize: 'पाठस्य आकारः',
    listen: 'श्रुणुत',
    darkMode: 'अन्धकारविधिः',
    privacy: 'गोपनीयतानितिः',
    terms: 'उपयोगस्य नियमाः',
    about: 'CyberRaksha विषये',

    english: 'आङ्ग्लभाषा',
    listenButton: 'श्रुणुत',
  },
};

export const translations: Record<
  LanguageCode,
  Record<string, string>
> = {
  ...translationData,
  brx: translationData.en,
  doi: translationData.en,
  ks: translationData.en,
  kok: translationData.en,
  mai: translationData.en,
  mni: translationData.en,
  ne: translationData.en,
  sat: translationData.en,
  sd: translationData.en,
};