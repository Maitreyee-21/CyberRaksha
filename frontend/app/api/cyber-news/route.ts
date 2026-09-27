import { NextResponse } from 'next/server';

export interface CyberArticle {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string;
  date: string;
  readTime: string;
  category: 'Official Advisory' | 'Payment Security' | 'Malware Alert' | 'Financial Fraud' | 'Mobile Threat';
  severity: 'CRITICAL' | 'HIGH' | 'ADVISORY';
  summary: string;
  keyTakeaway: string;
  verifiedOfficial: boolean;
  tags: string[];
  content: string[];
}

const ARTICLES_DATABASE: CyberArticle[] = [
  {
    id: 'digital-arrest-mha-advisory',
    title: 'MHA & I4C Issue National Advisory on "Digital Arrest" Cyber Extortion Syndicates',
    source: 'I4C / Ministry of Home Affairs (MHA)',
    sourceUrl: 'https://cybercrime.gov.in',
    date: 'Updated Live • 2026',
    readTime: '3 min read',
    category: 'Official Advisory',
    severity: 'CRITICAL',
    summary:
      'Criminal syndicates impersonate CBI, Narcotics Control Bureau (NCB), ED, and Supreme Court officials over Skype/WhatsApp video calls, holding victims under coercive "digital arrest" to extort lakhs.',
    keyTakeaway:
      'CRUCIAL FACT: Indian law enforcement and courts NEVER conduct arrests, take statements, or demand bond deposits over video calls or messaging apps.',
    verifiedOfficial: true,
    tags: ['Digital Arrest', 'Impersonation', 'Video Scam', 'I4C'],
    content: [
      'The Indian Cyber Crime Coordination Centre (I4C) under the Ministry of Home Affairs has issued a public advisory cautioning citizens against fake video call arrests.',
      'Perpetrators set up realistic mock police stations or courtroom studio backdrops and accuse victims of having parcels intercepted containing narcotics, passports, or illegal currency in their name.',
      'Victims are threatened with immediate physical arrest unless they transfer funds to "RBI security verification accounts" (which are actually mule accounts controlled by scammers).',
      'Protective Guidance: If you receive any video call claiming to be law enforcement threatening arrest, immediately disconnect. Call the National Cyber Crime Helpline at 1930 or lodge a complaint at cybercrime.gov.in.',
    ],
  },
  {
    id: 'quishing-fake-upi-qr-npc',
    title: 'Quishing Alert: Tampered QR Codes at Merchant Terminals and "Scan to Receive" Cashback Fraud',
    source: 'National Payments Corporation of India (NPCI)',
    sourceUrl: 'https://www.npci.org.in',
    date: 'Updated Live • 2026',
    readTime: '2 min read',
    category: 'Payment Security',
    severity: 'HIGH',
    summary:
      'Fraudsters replace legitimate merchant QR codes with malicious stickers, or send QR codes on WhatsApp claiming users must scan them to receive refunds, lottery prizes, or government subsidies.',
    keyTakeaway:
      'GOLDEN RULE: Entering your UPI PIN ALWAYS DEBITS money from your account. You NEVER need to enter a UPI PIN or scan a QR code to RECEIVE money.',
    verifiedOfficial: true,
    tags: ['Quishing', 'UPI Safety', 'QR Code Scam', 'NPCI'],
    content: [
      'Quishing (QR Code Phishing) has surged across public payment counters. Scammers paste deceptive QR code stickers over verified merchant stands.',
      'Additionally, online sellers on marketplace apps are targeted with fake payment QR codes claiming "Scan to collect payment".',
      'Entering your UPI PIN authorizes a withdrawal, not a deposit. Once entered, funds are instantaneously debited.',
      'Protective Guidance: Always verify the merchant name displayed on your UPI app before confirming payments. Never scan a QR code sent over chat to receive funds.',
    ],
  },
  {
    id: 'malicious-android-apk-wedding-utility',
    title: 'CERT-In Warning: Malicious Android APKs Disguised as Wedding Invites & Electricity Notices',
    source: 'CERT-In (Indian Computer Emergency Response Team)',
    sourceUrl: 'https://www.cert-in.org.in',
    date: 'Updated Live • 2026',
    readTime: '3 min read',
    category: 'Malware Alert',
    severity: 'CRITICAL',
    summary:
      'Attackers circulate malicious Android `.apk` files via WhatsApp and SMS disguised as "Wedding_Card.apk", "PM_Yojana.apk", or "Bill_Update.apk", which stealthily steal banking SMS and OTPs.',
    keyTakeaway:
      'SAFETY RULE: Never download or install `.apk` files received over WhatsApp, Telegram, or SMS. Restrict installations strictly to the Google Play Store.',
    verifiedOfficial: true,
    tags: ['Android APK', 'SMS Forwarder', 'Trojan', 'CERT-In'],
    content: [
      'CERT-In has warned mobile users about rapid propagation of malicious Android Package (APK) files transmitted through social messaging groups.',
      'Once installed, these apps prompt users to grant accessibility and SMS read permissions. They then silently forward two-factor authentication (2FA) codes and bank OTPs to remote attacker servers.',
      'The malware can also automate transactions in the background without user knowledge.',
      'Protective Guidance: If you inadvertently installed an unknown APK, immediately turn on Airplane Mode, uninstall the application from Settings > Apps, and contact your bank to freeze internet banking and UPI.',
    ],
  },
  {
    id: 'fake-stock-market-whatsapp-sebi',
    title: 'SEBI & RBI Advisory: Fraudulent WhatsApp & Telegram Stock Market Investment Groups',
    source: 'Securities and Exchange Board of India (SEBI)',
    sourceUrl: 'https://www.sebi.gov.in',
    date: 'Updated Live • 2026',
    readTime: '4 min read',
    category: 'Financial Fraud',
    severity: 'HIGH',
    summary:
      'Unregistered syndicates lure retail investors into WhatsApp trading groups promising 200%–500% returns and fake institutional IPO allocations, manipulating bogus trading dashboards.',
    keyTakeaway:
      'INVESTOR TIP: Verify all stock brokers on the official SEBI portal. Legitimate brokerages never trade or collect deposits through personal bank accounts or WhatsApp groups.',
    verifiedOfficial: true,
    tags: ['Investment Fraud', 'Fake Trading App', 'SEBI', 'WhatsApp Scam'],
    content: [
      'Fraudulent investment schemes are proliferating across WhatsApp and Telegram. Scammers display forged SEBI registration certificates and fabricated screenshots of massive trading profits.',
      'Victims are directed to download customized trading applications (often not on Google Play) that display simulated astronomical returns.',
      'When victims attempt to withdraw their funds, scammers demand "withdrawal taxes", "margin fees", or "compliance deposits", leading to complete loss of principal.',
      'Protective Guidance: Never transfer funds to individuals or unknown bank accounts for stock trading. Report fraudulent trading apps immediately to SEBI SCORES and 1930.',
    ],
  },
  {
    id: 'esim-hijacking-sim-swap-dot',
    title: 'Department of Telecommunications (DoT) Alert on eSIM Hijacking & SIM Swap Attacks',
    source: 'Department of Telecommunications (DoT) & RBI',
    sourceUrl: 'https://sachet.rbi.org.in',
    date: 'Updated Live • 2026',
    readTime: '3 min read',
    category: 'Mobile Threat',
    severity: 'HIGH',
    summary:
      'Cybercriminals deceive telecom subscribers into sharing verification codes to convert physical SIMs into digital eSIMs, instantly seizing control of mobile numbers and intercepting two-factor banking codes.',
    keyTakeaway:
      'COMMUNICATION SECURITY: Telecom operators NEVER call customers demanding OTPs or SMS confirmation codes to upgrade or transfer SIM cards.',
    verifiedOfficial: true,
    tags: ['SIM Swap', 'eSIM Hijack', 'Telecom Alert', 'DoT'],
    content: [
      'In eSIM swapping attacks, fraudsters initiate an eSIM QR or transfer request via telecom portals using victim credentials collected from phishing.',
      'They then call the victim pretending to be telecom customer care agents, claiming the mobile network will disconnect unless the subscriber forwards an SMS or verification PIN.',
      'Once the transfer is approved, the victim’s physical SIM loses all network connectivity while the attacker’s device gains access to all incoming calls and SMS OTPs.',
      'Protective Guidance: If your mobile phone abruptly displays "No Service" in an area with normally good reception, contact your telecom operator immediately from an alternative phone.',
    ],
  },
  {
    id: 'electricity-bill-disconnection-sms',
    title: 'State DISCOMs & Cyber Cell Warning: Mass "Electricity Power Disconnection" SMS Scam',
    source: 'State Electricity Boards & Cyber Crime Cell',
    sourceUrl: 'https://cybercrime.gov.in',
    date: 'Updated Live • 2026',
    readTime: '2 min read',
    category: 'Official Advisory',
    severity: 'ADVISORY',
    summary:
      'Urgent SMS alerts claim: "Your electricity connection will be disconnected tonight at 9:30 PM due to unpaid previous month bill. Call officer at 98xxxx immediately to avoid disconnection."',
    keyTakeaway:
      'ACTIONABLE ADVICE: Power distribution companies never send disconnection notices via personal 10-digit mobile numbers or demand instant payment over WhatsApp or UPI links.',
    verifiedOfficial: true,
    tags: ['Electricity Scam', 'Threat SMS', 'Smishing', 'DISCOM'],
    content: [
      'Citizens across India frequently receive panic-inducing SMS notices claiming power supplies will be disconnected within a few hours.',
      'When callers dial the listed 10-digit phone number, fraudsters instruct them to install remote-desktop applications (such as AnyDesk or TeamViewer QuickSupport) or transfer nominal fees of ₹10 via an unverified link.',
      'The remote application allows the fraudster to view the user screen and capture login credentials and OTPs.',
      'Protective Guidance: Always verify electricity bills and dues exclusively through official state electricity utility portals or official consumer apps.',
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    status: 'success',
    updated_at: new Date().toISOString(),
    total_articles: ARTICLES_DATABASE.length,
    articles: ARTICLES_DATABASE,
  });
}
