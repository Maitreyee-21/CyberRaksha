/**
 * CyberRaksha - Safety Lock Real-Time Link Guard
 * Background Service Worker (Manifest V3)
 */

// Known Safe Authority Domains
const SAFE_AUTHORITY_DOMAINS = [
  'google.com',
  'google.co.in',
  'youtube.com',
  'github.com',
  'microsoft.com',
  'apple.com',
  'amazon.com',
  'amazon.in',
  'wikipedia.org',
  'linkedin.com',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'sbi.co.in',
  'onlinesbi.sbi',
  'hdfcbank.com',
  'icicibank.com',
  'rbi.org.in',
  'cybercrime.gov.in',
  'gov.in',
  'nic.in',
  'uidai.gov.in',
  'incometax.gov.in'
];

// Suspicious/Abused TLDs
const SUSPICIOUS_TLDS = ['.xyz', '.top', '.work', '.click', '.buzz', '.tk', '.ml', '.ga', '.cf', '.link', '.gq', '.rest', '.quest', '.country'];

// Dangerous Executable Extensions
const MALWARE_EXTENSIONS = ['.exe', '.scr', '.vbs', '.bat', '.cmd', '.pif', '.msi', '.ps1'];

/**
 * AI & Heuristic Classification Engine
 * Analyzes target URL and categorizes as Safe, Suspicious, or Harmful.
 */
function classifyUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { status: 'Safe', threatType: null, score: 0, reasons: [] };
  }

  // Allow browser internal URLs
  if (
    urlString.startsWith('chrome://') ||
    urlString.startsWith('chrome-extension://') ||
    urlString.startsWith('about:') ||
    urlString.startsWith('edge://')
  ) {
    return { status: 'Safe', threatType: null, score: 0, reasons: ['Browser internal page'] };
  }

  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const fullUrl = urlString.toLowerCase();

    // Check Safe Authority Whitelist
    const isWhitelisted = SAFE_AUTHORITY_DOMAINS.some(
      domain => hostname === domain || hostname.endsWith('.' + domain)
    );

    if (isWhitelisted) {
      return {
        status: 'Safe',
        threatType: null,
        score: 5,
        reasons: ['Verified legitimate domain in authority whitelist']
      };
    }

    let riskScore = 0;
    const reasons = [];
    let detectedThreat = 'Phishing';

    // 1. IP address used as hostname
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipRegex.test(hostname)) {
      riskScore += 45;
      reasons.push('Raw IP address used as domain host');
      detectedThreat = 'Phishing';
    }

    // 2. Malware extensions in path
    if (MALWARE_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
      riskScore += 60;
      reasons.push('Direct link to dangerous executable file');
      detectedThreat = 'Malware Vector';
    }

    // 3. Known Phishing & Scam Keyword Combinations
    const bankOrKycKeywords = ['sbi', 'hdfc', 'icici', 'pnb', 'rbi', 'bank', 'kyc', 'pan', 'aadhaar', 'income-tax', 'yono'];
    const lureKeywords = ['update', 'verify', 'blocked', 'suspended', 'claim', 'reward', 'lottery', 'free-recharge', 'cashback', 'bonus', 'urgent'];

    const hasBankKeyword = bankOrKycKeywords.some(kw => hostname.includes(kw));
    const hasLureKeyword = lureKeywords.some(kw => fullUrl.includes(kw));

    if (hasBankKeyword && hasLureKeyword) {
      riskScore += 55;
      reasons.push('Financial brand impersonation combined with urgent verification lure');
      detectedThreat = 'Phishing';
    }

    // 4. Suspicious TLD combined with sensitive actions
    const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld));
    if (hasSuspiciousTld) {
      riskScore += 35;
      reasons.push('High-risk, frequently abused top-level domain');
      if (hasBankKeyword || hasLureKeyword) {
        riskScore += 30;
      }
    }

    // 5. Malicious Redirect indicators
    if (
      fullUrl.includes('redirect=') ||
      fullUrl.includes('dest=') ||
      fullUrl.includes('url=http') ||
      fullUrl.includes('forward=') ||
      fullUrl.includes('tinyurl.com') ||
      fullUrl.includes('bit.ly')
    ) {
      if (hasLureKeyword || hasBankKeyword) {
        riskScore += 40;
        reasons.push('Obfuscated multi-hop redirect detected targeting sensitive lure');
        detectedThreat = 'Malicious Redirect';
      }
    }

    // 6. Smishing/Social Engineering pattern (SMS OTP claim patterns)
    if (fullUrl.includes('otp') && (fullUrl.includes('submit') || fullUrl.includes('verify') || fullUrl.includes('login'))) {
      riskScore += 50;
      reasons.push('Deceptive OTP credential harvesting endpoint');
      detectedThreat = 'Smishing';
    }

    // 7. Excessive subdomains or punycode
    if (hostname.split('.').length > 4) {
      riskScore += 25;
      reasons.push('Excessive subdomain depth used for brand cloaking');
    }
    if (hostname.includes('xn--')) {
      riskScore += 30;
      reasons.push('Punycode / Homograph domain character spoofing');
    }

    // Final Categorization
    if (riskScore >= 60) {
      return {
        status: 'Harmful',
        threatType: detectedThreat,
        score: riskScore,
        reasons
      };
    } else if (riskScore >= 30) {
      return {
        status: 'Suspicious',
        threatType: detectedThreat,
        score: riskScore,
        reasons
      };
    }

    return {
      status: 'Safe',
      threatType: null,
      score: riskScore,
      reasons: reasons.length ? reasons : ['Standard domain validation verified']
    };
  } catch (e) {
    return { status: 'Suspicious', threatType: 'Suspicious Link', score: 40, reasons: ['Malformed or invalid URL structure'] };
  }
}

/**
 * Record a blocked incident into persistent chrome.storage.local
 */
async function recordBlockedIncident(url, threatType) {
  try {
    const { blockedLinks = [] } = await chrome.storage.local.get('blockedLinks');
    let domain = 'Unknown';
    try {
      domain = new URL(url).hostname;
    } catch {
      domain = url;
    }

    const newRecord = {
      id: 'blk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      url,
      domain,
      threatType: threatType || 'Phishing',
      timestamp: new Date().toISOString()
    };

    // Keep most recent 100 blocked links
    const updated = [newRecord, ...blockedLinks.filter(item => item.url !== url)].slice(0, 100);
    await chrome.storage.local.set({ blockedLinks: updated });
    return newRecord;
  } catch (err) {
    console.error('Failed to persist blocked link incident:', err);
  }
}

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(async () => {
  const { protectionEnabled } = await chrome.storage.local.get('protectionEnabled');
  if (protectionEnabled === undefined) {
    await chrome.storage.local.set({
      protectionEnabled: true,
      blockedLinks: []
    });
  }
  console.log('[CyberRaksha] Safety Lock Extension initialized.');
});

/**
 * Real-time Active Tab & Navigation Guard
 */
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only inspect top-level frame navigation
  if (details.frameId !== 0) return;

  const url = details.url;
  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) {
    return;
  }

  const { protectionEnabled = true } = await chrome.storage.local.get('protectionEnabled');
  if (!protectionEnabled) return;

  const assessment = classifyUrl(url);

  if (assessment.status === 'Harmful') {
    console.warn('[CyberRaksha Guard] HARMFUL LINK INTERCEPTED:', url, assessment);

    // 1. Immediately log the incident to persistent history
    await recordBlockedIncident(url, assessment.threatType);

    // 2. Redirect tab to safety warning page
    const warningPageUrl = chrome.runtime.getURL(
      `warning.html?url=${encodeURIComponent(url)}&threat=${encodeURIComponent(assessment.threatType || 'Malicious Threat')}`
    );

    chrome.tabs.update(details.tabId, { url: warningPageUrl });
  }
});

/**
 * Message Dispatcher for Popup and Content Script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'CLASSIFY_URL') {
    const result = classifyUrl(request.url);
    sendResponse(result);
    return true;
  }

  if (request.action === 'GET_PROTECTION_STATUS') {
    chrome.storage.local.get(['protectionEnabled', 'blockedLinks'], (data) => {
      sendResponse({
        protectionEnabled: data.protectionEnabled !== false,
        blockedCount: (data.blockedLinks || []).length
      });
    });
    return true;
  }

  if (request.action === 'TOGGLE_PROTECTION') {
    chrome.storage.local.set({ protectionEnabled: request.enabled }, () => {
      sendResponse({ success: true, enabled: request.enabled });
    });
    return true;
  }

  if (request.action === 'GET_BLOCKED_LINKS') {
    chrome.storage.local.get('blockedLinks', (data) => {
      sendResponse({ blockedLinks: data.blockedLinks || [] });
    });
    return true;
  }

  if (request.action === 'CLEAR_BLOCKED_LINKS') {
    chrome.storage.local.set({ blockedLinks: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'LOG_BLOCKED_INCIDENT') {
    recordBlockedIncident(request.url, request.threatType).then((rec) => {
      sendResponse({ success: true, record: rec });
    });
    return true;
  }
});
