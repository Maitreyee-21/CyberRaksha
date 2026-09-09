'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Globe,
  Type,
  Volume2,
  Moon,
  Sun,
  Shield,
  FileText,
  Info,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import {
  LANGUAGES,
  type LanguageCode,
  getLanguage,
} from '@/lib/languages';
import { useLanguage } from '@/components/providers/LanguageProvider';

type TextSize = 'small' | 'normal' | 'large' | 'extra-large';

type SettingsCopy = {
  title: string;
  subtitle: string;
  language: string;
  textSize: string;
  listen: string;
  darkMode: string;
  lightMode: string;
  privacy: string;
  terms: string;
  about: string;
  selectLanguage: string;
  selectTextSize: string;
  small: string;
  normal: string;
  large: string;
  extraLarge: string;
  on: string;
  off: string;
  close: string;
  privacyTitle: string;
  privacyBody: string;
  termsTitle: string;
  termsBody: string;
  aboutTitle: string;
  aboutBody: string;
  saved: string;
};

const en: SettingsCopy = {
  title: 'Settings',
  subtitle: 'Manage your CyberRaksha preferences.',
  language: 'Language',
  textSize: 'Text Size',
  listen: 'Listen (Read Aloud)',
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  about: 'About CyberRaksha',
  selectLanguage: 'Select Language',
  selectTextSize: 'Select Text Size',
  small: 'Small',
  normal: 'Normal',
  large: 'Large',
  extraLarge: 'Extra Large',
  on: 'On',
  off: 'Off',
  close: 'Close',
  privacyTitle: 'Privacy Policy',
  privacyBody:
    'CyberRaksha is designed to help you check suspicious messages, links, QR codes and images. Your scan content should be handled only as required for analysis. Do not share passwords, OTPs or other secrets with anyone.',
  termsTitle: 'Terms of Use',
  termsBody:
    'CyberRaksha provides safety guidance and automated analysis. Results are informational and should not replace official cybercrime, banking or legal advice. Always verify important decisions with trusted official sources.',
  aboutTitle: 'About CyberRaksha',
  aboutBody:
    'CyberRaksha is a digital safety assistant built to help people detect, understand and respond to common cyber scams before they click, share or pay.',
  saved: 'Saved',
};

const translations: Partial<Record<LanguageCode, Partial<SettingsCopy>>> = {
  hi: {
    title: 'सेटिंग्स',
    subtitle: 'अपनी CyberRaksha प्राथमिकताएँ प्रबंधित करें।',
    language: 'भाषा',
    textSize: 'टेक्स्ट आकार',
    listen: 'सुनें (पढ़कर सुनाएँ)',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    privacy: 'गोपनीयता नीति',
    terms: 'उपयोग की शर्तें',
    about: 'CyberRaksha के बारे में',
    selectLanguage: 'भाषा चुनें',
    selectTextSize: 'टेक्स्ट आकार चुनें',
    small: 'छोटा',
    normal: 'सामान्य',
    large: 'बड़ा',
    extraLarge: 'बहुत बड़ा',
    on: 'चालू',
    off: 'बंद',
    close: 'बंद करें',
    privacyTitle: 'गोपनीयता नीति',
    termsTitle: 'उपयोग की शर्तें',
    aboutTitle: 'CyberRaksha के बारे में',
    saved: 'सहेजा गया',
  },
  mr: {
    title: 'सेटिंग्ज',
    subtitle: 'तुमच्या CyberRaksha पसंती व्यवस्थापित करा.',
    language: 'भाषा',
    textSize: 'मजकूर आकार',
    listen: 'ऐका (मोठ्याने वाचा)',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    privacy: 'गोपनीयता धोरण',
    terms: 'वापराच्या अटी',
    about: 'CyberRaksha बद्दल',
    selectLanguage: 'भाषा निवडा',
    selectTextSize: 'मजकूर आकार निवडा',
    small: 'लहान',
    normal: 'सामान्य',
    large: 'मोठा',
    extraLarge: 'अतिशय मोठा',
    on: 'चालू',
    off: 'बंद',
    close: 'बंद करा',
    privacyTitle: 'गोपनीयता धोरण',
    termsTitle: 'वापराच्या अटी',
    aboutTitle: 'CyberRaksha बद्दल',
    saved: 'जतन केले',
  },
  bn: { title: 'সেটিংস', language: 'ভাষা', textSize: 'লেখার আকার', listen: 'শুনুন (পড়ে শোনান)', darkMode: 'ডার্ক মোড', lightMode: 'লাইট মোড', privacy: 'গোপনীয়তা নীতি', terms: 'ব্যবহারের শর্তাবলি', about: 'CyberRaksha সম্পর্কে', selectLanguage: 'ভাষা নির্বাচন করুন', selectTextSize: 'লেখার আকার নির্বাচন করুন', small: 'ছোট', normal: 'স্বাভাবিক', large: 'বড়', extraLarge: 'অতিরিক্ত বড়', on: 'চালু', off: 'বন্ধ', close: 'বন্ধ করুন' },
  gu: { title: 'સેટિંગ્સ', language: 'ભાષા', textSize: 'ટેક્સ્ટ કદ', listen: 'સાંભળો (વાંચીને સંભળાવો)', darkMode: 'ડાર્ક મોડ', lightMode: 'લાઇટ મોડ', privacy: 'ગોપનીયતા નીતિ', terms: 'ઉપયોગની શરતો', about: 'CyberRaksha વિશે', selectLanguage: 'ભાષા પસંદ કરો', selectTextSize: 'ટેક્સ્ટ કદ પસંદ કરો', small: 'નાનું', normal: 'સામાન્ય', large: 'મોટું', extraLarge: 'ખૂબ મોટું', on: 'ચાલુ', off: 'બંધ', close: 'બંધ કરો' },
  ta: { title: 'அமைப்புகள்', language: 'மொழி', textSize: 'உரை அளவு', listen: 'கேளுங்கள் (வாசித்துக் காட்டவும்)', darkMode: 'டார்க் மோடு', lightMode: 'லைட் மோடு', privacy: 'தனியுரிமைக் கொள்கை', terms: 'பயன்பாட்டு விதிமுறைகள்', about: 'CyberRaksha பற்றி', selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்', selectTextSize: 'உரை அளவைத் தேர்ந்தெடுக்கவும்', small: 'சிறியது', normal: 'இயல்பானது', large: 'பெரியது', extraLarge: 'மிகப் பெரியது', on: 'இயக்கம்', off: 'நிறுத்தம்', close: 'மூடு' },
  te: { title: 'సెట్టింగ్‌లు', language: 'భాష', textSize: 'టెక్స్ట్ పరిమాణం', listen: 'వినండి (చదివి వినిపించండి)', darkMode: 'డార్క్ మోడ్', lightMode: 'లైట్ మోడ్', privacy: 'గోప్యతా విధానం', terms: 'వినియోగ నిబంధనలు', about: 'CyberRaksha గురించి', selectLanguage: 'భాషను ఎంచుకోండి', selectTextSize: 'టెక్స్ట్ పరిమాణాన్ని ఎంచుకోండి', small: 'చిన్నది', normal: 'సాధారణం', large: 'పెద్దది', extraLarge: 'చాలా పెద్దది', on: 'ఆన్', off: 'ఆఫ్', close: 'మూసివేయండి' },
  kn: { title: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', language: 'ಭಾಷೆ', textSize: 'ಪಠ್ಯ ಗಾತ್ರ', listen: 'ಕೇಳಿ (ಓದಿ ಕೇಳಿಸಿ)', darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್', lightMode: 'ಲೈಟ್ ಮೋಡ್', privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ', terms: 'ಬಳಕೆಯ ನಿಯಮಗಳು', about: 'CyberRaksha ಬಗ್ಗೆ', selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ', selectTextSize: 'ಪಠ್ಯ ಗಾತ್ರ ಆಯ್ಕೆಮಾಡಿ', small: 'ಚಿಕ್ಕದು', normal: 'ಸಾಮಾನ್ಯ', large: 'ದೊಡ್ಡದು', extraLarge: 'ಬಹಳ ದೊಡ್ಡದು', on: 'ಆನ್', off: 'ಆಫ್', close: 'ಮುಚ್ಚಿ' },
  ml: { title: 'ക്രമീകരണങ്ങൾ', language: 'ഭാഷ', textSize: 'ടെക്സ്റ്റ് വലുപ്പം', listen: 'കേൾക്കുക (വായിച്ചു കേൾപ്പിക്കുക)', darkMode: 'ഡാർക്ക് മോഡ്', lightMode: 'ലൈറ്റ് മോഡ്', privacy: 'സ്വകാര്യതാ നയം', terms: 'ഉപയോഗ നിബന്ധനകൾ', about: 'CyberRakshaയെ കുറിച്ച്', selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക', selectTextSize: 'ടെക്സ്റ്റ് വലുപ്പം തിരഞ്ഞെടുക്കുക', small: 'ചെറുത്', normal: 'സാധാരണ', large: 'വലുത്', extraLarge: 'വളരെ വലുത്', on: 'ഓൺ', off: 'ഓഫ്', close: 'അടയ്ക്കുക' },
  or: { title: 'ସେଟିଂସ୍', language: 'ଭାଷା', textSize: 'ଟେକ୍ସଟ୍ ଆକାର', listen: 'ଶୁଣନ୍ତୁ (ପଢ଼ି ଶୁଣାନ୍ତୁ)', darkMode: 'ଡାର୍କ ମୋଡ୍', lightMode: 'ଲାଇଟ୍ ମୋଡ୍', privacy: 'ଗୋପନୀୟତା ନୀତି', terms: 'ବ୍ୟବହାର ନିୟମ', about: 'CyberRaksha ବିଷୟରେ', selectLanguage: 'ଭାଷା ବାଛନ୍ତୁ', selectTextSize: 'ଟେକ୍ସଟ୍ ଆକାର ବାଛନ୍ତୁ', small: 'ଛୋଟ', normal: 'ସାଧାରଣ', large: 'ବଡ଼', extraLarge: 'ଅତି ବଡ଼', on: 'ଚାଲୁ', off: 'ବନ୍ଦ', close: 'ବନ୍ଦ କରନ୍ତୁ' },
  pa: { title: 'ਸੈਟਿੰਗਾਂ', language: 'ਭਾਸ਼ਾ', textSize: 'ਟੈਕਸਟ ਆਕਾਰ', listen: 'ਸੁਣੋ (ਪੜ੍ਹ ਕੇ ਸੁਣਾਓ)', darkMode: 'ਡਾਰਕ ਮੋਡ', lightMode: 'ਲਾਈਟ ਮੋਡ', privacy: 'ਪਰਦੇਦਾਰੀ ਨੀਤੀ', terms: 'ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ', about: 'CyberRaksha ਬਾਰੇ', selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ', selectTextSize: 'ਟੈਕਸਟ ਆਕਾਰ ਚੁਣੋ', small: 'ਛੋਟਾ', normal: 'ਸਧਾਰਨ', large: 'ਵੱਡਾ', extraLarge: 'ਬਹੁਤ ਵੱਡਾ', on: 'ਚਾਲੂ', off: 'ਬੰਦ', close: 'ਬੰਦ ਕਰੋ' },
  ne: { title: 'सेटिङहरू', language: 'भाषा', textSize: 'पाठ आकार', listen: 'सुन्नुहोस् (पढेर सुनाउनुहोस्)', darkMode: 'डार्क मोड', lightMode: 'लाइट मोड', privacy: 'गोपनीयता नीति', terms: 'प्रयोगका सर्तहरू', about: 'CyberRaksha बारे', selectLanguage: 'भाषा छान्नुहोस्', selectTextSize: 'पाठ आकार छान्नुहोस्', small: 'सानो', normal: 'सामान्य', large: 'ठूलो', extraLarge: 'अति ठूलो', on: 'अन', off: 'अफ', close: 'बन्द गर्नुहोस्' },
  as: { title: 'ছেটিংছ', language: 'ভাষা', textSize: 'লিখন আকাৰ', listen: 'শুনক (পঢ়ি শুনাওক)', darkMode: 'ডাৰ্ক মোড', lightMode: 'লাইট মোড', privacy: 'গোপনীয়তা নীতি', terms: 'ব্যৱহাৰৰ চৰ্ত', about: 'CyberRakshaৰ বিষয়ে', selectLanguage: 'ভাষা বাছক', selectTextSize: 'লিখন আকাৰ বাছক', small: 'সৰু', normal: 'স্বাভাৱিক', large: 'ডাঙৰ', extraLarge: 'অতি ডাঙৰ', on: 'চালু', off: 'বন্ধ', close: 'বন্ধ কৰক' },
  kok: { title: 'सेटिंग्स', language: 'भास', textSize: 'मजकूर आकार', listen: 'आयकात (वाचून आयकयात)', darkMode: 'डार्क मोड', lightMode: 'लायट मोड', privacy: 'गोपनीयता धोरण', terms: 'वापराचीं अटी', about: 'CyberRaksha विशीं', selectLanguage: 'भास निवडात', selectTextSize: 'मजकूर आकार निवडात', small: 'ल्हान', normal: 'सामान्य', large: 'व्हड', extraLarge: 'अतिशय व्हड', on: 'चालू', off: 'बंद', close: 'बंद करात' },
  mai: { title: 'सेटिंग्स', language: 'भाषा', textSize: 'टेक्स्ट आकार', listen: 'सुनू (पढ़ि कऽ सुनाउ)', darkMode: 'डार्क मोड', lightMode: 'लाइट मोड', privacy: 'गोपनीयता नीति', terms: 'उपयोगक शर्त', about: 'CyberRakshaक बारे मे', selectLanguage: 'भाषा चुनू', selectTextSize: 'टेक्स्ट आकार चुनू', small: 'छोट', normal: 'सामान्य', large: 'पैघ', extraLarge: 'बहुत पैघ', on: 'चालू', off: 'बन्द', close: 'बन्द करू' },
  brx: { title: 'सेटिं', language: 'राव', textSize: 'टेक्सट गेजेर', listen: 'खोनो (राव फोरमाय)', darkMode: 'डार्क मोड', lightMode: 'लाइट मोड', privacy: 'गोपनीयता नीतिखौ', terms: 'बाहायनाय नेम', about: 'CyberRaksha सोमोन्दै', selectLanguage: 'राव सायख', selectTextSize: 'टेक्सट गेजेर सायख', small: 'फिसा', normal: 'गोनां', large: 'गेजेर', extraLarge: 'जेरै गेजेर', on: 'अन', off: 'अफ', close: 'बन्द खालाम' },
  doi: { title: 'सेटिंगां', language: 'भाशा', textSize: 'टेक्स्ट आकार', listen: 'सुनो (पढ़ियै सुनाओ)', darkMode: 'डार्क मोड', lightMode: 'लाइट मोड', privacy: 'गोपनीयता नीति', terms: 'बरतून दीआं शर्तां', about: 'CyberRaksha बारै', selectLanguage: 'भाशा चुनो', selectTextSize: 'टेक्स्ट आकार चुनो', small: 'छोटा', normal: 'साधारण', large: 'बड्डा', extraLarge: 'बहुत बड्डा', on: 'चालू', off: 'बंद', close: 'बंद करो' },
  ks: { title: 'سیٹنگز', language: 'زبان', textSize: 'ٹیکسٹ سائز', listen: 'وُچھِو (پڑھِتھ سُناون)', darkMode: 'ڈارک موڈ', lightMode: 'لایٹ موڈ', privacy: 'پرائیویسی پالیسی', terms: 'استعمالُک شراٸط', about: 'CyberRaksha متعلق', selectLanguage: 'زبان ژاریو', selectTextSize: 'ٹیکسٹ سائز ژاریو', small: 'چھوٹ', normal: 'عام', large: 'وُڈ', extraLarge: 'بہٕ وُڈ', on: 'آن', off: 'آف', close: 'بند کریو' },
  mni: { title: 'সেটিংশ', language: 'ꯂꯣꯟ', textSize: 'ꯄꯥꯏꯕꯥꯛ ꯃꯆꯥ', listen: 'ꯈꯣꯟꯖꯤꯟ (ꯄꯥꯏꯕꯥꯛ ꯈꯣꯟꯖꯤꯟ)', darkMode: 'ꯗꯥꯔꯛ ꯃꯣꯗ', lightMode: 'ꯂꯥꯏꯠ ꯃꯣꯗ', privacy: 'ꯄ꯭ꯔꯥꯏꯕꯦꯁꯤ ꯄꯣꯂꯤꯁꯤ', terms: 'ꯌꯨꯖ ꯇꯧꯕꯒꯤ ꯅꯤꯌꯃ', about: 'CyberRaksha ꯃꯇꯥꯡꯗꯥ', selectLanguage: 'ꯂꯣꯟ ꯈꯜꯂꯨ', selectTextSize: 'ꯄꯥꯏꯕꯥꯛ ꯃꯆꯥ ꯈꯜꯂꯨ', small: 'ꯃꯆꯥ', normal: 'ꯅꯣꯔꯃꯥꯂ', large: 'ꯃꯥꯌꯥꯝ', extraLarge: 'ꯑꯇꯣꯞꯄꯥ', on: 'ꯑꯣꯟ', off: 'ꯑꯐ', close: 'ꯂꯣꯏꯁꯤꯟ' },
  sat: { title: 'ᱥᱮᱴᱤᱝᱥ', language: 'ᱯᱟᱹᱨᱥᱤ', textSize: 'ᱚᱞ ᱢᱟᱯ', listen: 'ᱟᱹᱭᱟᱹᱛ ᱢᱮ (ᱯᱟᱹᱴᱷ ᱥᱩᱱᱟᱹᱣ)', darkMode: 'ᱰᱟᱨᱠ ᱢᱳᱰ', lightMode: 'ᱞᱟᱭᱴ ᱢᱳᱰ', privacy: 'ᱯᱨᱟᱭᱵᱷᱮᱥᱤ ᱱᱤᱛᱤ', terms: 'ᱵᱟᱵᱚᱦᱟᱨ ᱥᱚᱨᱛ', about: 'CyberRaksha ᱵᱟᱵᱚᱛ', selectLanguage: 'ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱱᱟᱣ', selectTextSize: 'ᱚᱞ ᱢᱟᱯ ᱵᱟᱪᱷᱱᱟᱣ', small: 'ᱠᱚᱢ', normal: 'ᱥᱟᱢᱟᱱᱭᱟ', large: 'ᱢᱟᱨᱟᱝ', extraLarge: 'ᱥᱟᱱᱟᱝ ᱢᱟᱨᱟᱝ', on: 'ᱚᱱ', off: 'ᱚᱯᱷ', close: 'ᱵᱚᱱᱫᱚ' },
  sd: { title: 'سيٽنگز', language: 'ٻولي', textSize: 'متن جي ماپ', listen: 'ٻڌو (پڙهي ٻڌايو)', darkMode: 'ڊارڪ موڊ', lightMode: 'لائيٽ موڊ', privacy: 'رازداري پاليسي', terms: 'استعمال جون شرطون', about: 'CyberRaksha بابت', selectLanguage: 'ٻولي چونڊيو', selectTextSize: 'متن جي ماپ چونڊيو', small: 'ننڍو', normal: 'عام', large: 'وڏو', extraLarge: 'تمام وڏو', on: 'آن', off: 'آف', close: 'بند ڪريو' },
  ur: { title: 'ترتیبات', language: 'زبان', textSize: 'متن کا سائز', listen: 'سنیں (پڑھ کر سنائیں)', darkMode: 'ڈارک موڈ', lightMode: 'لائٹ موڈ', privacy: 'رازداری کی پالیسی', terms: 'استعمال کی شرائط', about: 'CyberRaksha کے بارے میں', selectLanguage: 'زبان منتخب کریں', selectTextSize: 'متن کا سائز منتخب کریں', small: 'چھوٹا', normal: 'عام', large: 'بڑا', extraLarge: 'بہت بڑا', on: 'آن', off: 'آف', close: 'بند کریں' },
  sa: { title: 'सेटिङ्ग्स्', language: 'भाषा', textSize: 'पाठस्य आकारः', listen: 'शृणोतु (पठित्वा श्रावयतु)', darkMode: 'अन्धकारविधिः', lightMode: 'प्रकाशविधिः', privacy: 'गोपनीयतानियमः', terms: 'उपयोगनियमाः', about: 'CyberRaksha विषये', selectLanguage: 'भाषां चिनोतु', selectTextSize: 'पाठस्य आकारं चिनोतु', small: 'लघु', normal: 'सामान्य', large: 'बृहत्', extraLarge: 'अतिबृहत्', on: 'चलति', off: 'न चलति', close: 'पिधत्ताम्' },
};

const TEXT_SIZE_KEY = 'cyberraksha-text-size';
const LISTEN_KEY = 'cyberraksha-listen';
const THEME_KEY = 'cyberraksha-theme';

const textSizeLabels: Record<TextSize, keyof SettingsCopy> = {
  small: 'small',
  normal: 'normal',
  large: 'large',
  'extra-large': 'extraLarge',
};

function readStoredTextSize(): TextSize {
  if (typeof window === 'undefined') return 'normal';
  const value = window.localStorage.getItem(TEXT_SIZE_KEY);
  return value === 'small' || value === 'normal' || value === 'large' || value === 'extra-large'
    ? value
    : 'normal';
}

function readStoredBoolean(key: string, fallback: boolean) {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  if (value === null) return fallback;
  return value === 'true';
}

function applyTextSize(size: TextSize) {
  const root = document.documentElement;
  const scale = {
    small: '90%',
    normal: '100%',
    large: '112.5%',
    'extra-large': '125%',
  }[size];

  root.style.fontSize = scale;
  root.dataset.textSize = size;
}

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.dataset.theme = dark ? 'dark' : 'light';
  root.classList.toggle('dark', dark);
  document.body?.classList.toggle('cyberraksha-light', !dark);
  document.body?.classList.toggle('cyberraksha-dark', dark);
}

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();

  const [languageOpen, setLanguageOpen] = useState(false);
  const [textSizeOpen, setTextSizeOpen] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [listen, setListen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [modal, setModal] = useState<'privacy' | 'terms' | 'about' | null>(null);

  const t = useMemo(
    () => ({ ...en, ...(translations[language] ?? {}) }),
    [language]
  );

  const currentLanguage = getLanguage(language);

  useEffect(() => {
    const savedSize = readStoredTextSize();
    const savedListen = readStoredBoolean(LISTEN_KEY, true);
    const savedTheme = window.localStorage.getItem(THEME_KEY);

    setTextSize(savedSize);
    setListen(savedListen);
    setDarkMode(savedTheme ? savedTheme === 'dark' : true);

    applyTextSize(savedSize);
    applyTheme(savedTheme ? savedTheme === 'dark' : true);

    const onStorage = () => {
      setTextSize(readStoredTextSize());
      setListen(readStoredBoolean(LISTEN_KEY, true));
      const theme = window.localStorage.getItem(THEME_KEY);
      setDarkMode(theme ? theme === 'dark' : true);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const changeLanguage = (next: LanguageCode) => {
    setLanguage(next);
    setLanguageOpen(false);
  };

  const changeTextSize = (next: TextSize) => {
    setTextSize(next);
    window.localStorage.setItem(TEXT_SIZE_KEY, next);
    applyTextSize(next);
    window.dispatchEvent(
      new CustomEvent('cyberraksha-text-size-change', { detail: next })
    );
    setTextSizeOpen(false);
  };

  const toggleListen = () => {
    const next = !listen;
    setListen(next);
    window.localStorage.setItem(LISTEN_KEY, String(next));
    window.dispatchEvent(
      new CustomEvent('cyberraksha-listen-change', { detail: next })
    );
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    window.localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    applyTheme(next);
    window.dispatchEvent(
      new CustomEvent('cyberraksha-theme-change', { detail: next ? 'dark' : 'light' })
    );
  };

  const speakSetting = (text: string) => {
    if (!listen || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.code;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AppShell>
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[800px]">
          <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.subtitle}</p>

          <div className="mt-8 overflow-visible rounded-2xl border border-white/[0.07] bg-[#10161C]">
            <Row
              icon={<Globe size={19} />}
              title={t.language}
              value={currentLanguage.nativeName}
              onClick={() => {
                setLanguageOpen((value) => !value);
                setTextSizeOpen(false);
              }}
              active={languageOpen}
            />

            {languageOpen && (
              <div className="border-b border-white/[0.06] bg-[#0B1116] p-3">
                <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t.selectLanguage}
                </div>
                <div className="grid max-h-[360px] grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
                  {LANGUAGES.map((item) => {
                    const selected = item.code === language;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => changeLanguage(item.code)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                          selected
                            ? 'bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/20'
                            : 'text-slate-300 hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="w-7 shrink-0 text-xs font-mono text-slate-500">
                          {item.code.toUpperCase()}
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium">{item.nativeName}</span>
                          <span className="block text-[10px] text-slate-500">{item.name}</span>
                        </span>
                        {selected && <Check size={16} className="text-teal-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Row
              icon={<Type size={19} />}
              title={t.textSize}
              value={t[textSizeLabels[textSize]]}
              onClick={() => {
                setTextSizeOpen((value) => !value);
                setLanguageOpen(false);
              }}
              active={textSizeOpen}
            />

            {textSizeOpen && (
              <div className="border-b border-white/[0.06] bg-[#0B1116] p-3">
                <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t.selectTextSize}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['small', 'normal', 'large', 'extra-large'] as TextSize[]).map((size) => {
                    const selected = textSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => changeTextSize(size)}
                        className={`rounded-xl border px-3 py-3 text-left transition ${
                          selected
                            ? 'border-teal-400/30 bg-teal-400/10 text-teal-300'
                            : 'border-white/[0.06] bg-white/[0.02] text-slate-300 hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="block text-sm font-medium">
                          {t[textSizeLabels[size]]}
                        </span>
                        <span className="mt-1 block text-[10px] text-slate-500">
                          {size === 'small' ? '90%' : size === 'normal' ? '100%' : size === 'large' ? '112.5%' : '125%'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Toggle
              icon={<Volume2 size={19} />}
              title={t.listen}
              enabled={listen}
              onChange={toggleListen}
              onLabel={t.on}
              offLabel={t.off}
              onTest={() => speakSetting(t.listen)}
            />

            <Toggle
              icon={darkMode ? <Moon size={19} /> : <Sun size={19} />}
              title={darkMode ? t.darkMode : t.lightMode}
              enabled={darkMode}
              onChange={toggleDarkMode}
              onLabel={t.on}
              offLabel={t.off}
            />

            <Row
              icon={<Shield size={19} />}
              title={t.privacy}
              onClick={() => setModal('privacy')}
            />

            <Row
              icon={<FileText size={19} />}
              title={t.terms}
              onClick={() => setModal('terms')}
            />

            <Row
              icon={<Info size={19} />}
              title={t.about}
              onClick={() => setModal('about')}
            />
          </div>
        </div>
      </section>

      {modal && (
        <InfoModal
          title={
            modal === 'privacy'
              ? t.privacyTitle
              : modal === 'terms'
                ? t.termsTitle
                : t.aboutTitle
          }
          body={
            modal === 'privacy'
              ? t.privacyBody
              : modal === 'terms'
                ? t.termsBody
                : t.aboutBody
          }
          closeLabel={t.close}
          onClose={() => setModal(null)}
        />
      )}
    </AppShell>
  );
}

function Row({
  icon,
  title,
  value,
  onClick,
  active = false,
}: {
  icon: ReactNode;
  title: string;
  value?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[60px] w-full items-center gap-4 border-b border-white/[0.06] px-5 text-left transition ${
        active ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
      }`}
    >
      <span className="text-slate-500">{icon}</span>
      <span className="flex-1 text-sm font-medium text-white">{title}</span>
      {value && <span className="text-xs text-slate-500">{value}</span>}
      <ChevronRight size={16} className="text-slate-700" />
    </button>
  );
}

function Toggle({
  icon,
  title,
  enabled,
  onChange,
  onLabel,
  offLabel,
  onTest,
}: {
  icon: ReactNode;
  title: string;
  enabled: boolean;
  onChange: () => void;
  onLabel: string;
  offLabel: string;
  onTest?: () => void;
}) {
  return (
    <div className="flex min-h-[60px] items-center gap-4 border-b border-white/[0.06] px-5">
      <span className="text-slate-500">{icon}</span>
      <button
        type="button"
        onClick={onChange}
        className="flex-1 text-left text-sm font-medium text-white hover:text-teal-300"
      >
        {title}
      </button>

      {onTest && enabled && (
        <button
          type="button"
          onClick={onTest}
          className="hidden rounded-lg border border-white/[0.07] px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-teal-300 sm:block"
          title="Test read aloud"
        >
          Test
        </button>
      )}

      <span className={`text-[10px] font-semibold uppercase tracking-wider ${enabled ? 'text-teal-300' : 'text-slate-600'}`}>
        {enabled ? onLabel : offLabel}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? 'bg-[#00D394]' : 'bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

function InfoModal({
  title,
  body,
  closeLabel,
  onClose,
}: {
  title: string;
  body: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#10161C] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">{body}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-400"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
