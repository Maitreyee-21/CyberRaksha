/**
 * CyberRaksha - Safety Lock Real-Time Link Guard
 * In-Page Content Script (Manifest V3)
 */

(function () {
  // Prevent duplicate injection
  if (window.__CYBERRAKSHA_INJECTED__) return;
  window.__CYBERRAKSHA_INJECTED__ = true;

  const currentUrl = window.location.href;

  // Skip browser internal pages
  if (
    currentUrl.startsWith('chrome://') ||
    currentUrl.startsWith('chrome-extension://') ||
    currentUrl.startsWith('about:')
  ) {
    return;
  }

  // Ask background service worker to assess current URL
  chrome.runtime.sendMessage(
    { action: 'CLASSIFY_URL', url: currentUrl },
    (assessment) => {
      if (chrome.runtime.lastError || !assessment) return;

      if (assessment.status === 'Harmful') {
        // Also ensure protection toggle is active
        chrome.runtime.sendMessage({ action: 'GET_PROTECTION_STATUS' }, (status) => {
          if (status && status.protectionEnabled !== false) {
            triggerUrgentHarmfulIntervention(assessment);
          }
        });
      }
    }
  );

  /**
   * Block access and render urgent security overlay warning
   */
  function triggerUrgentHarmfulIntervention(assessment) {
    // Stop ongoing navigation/media/scripts where possible
    try {
      window.stop();
    } catch (e) {}

    // Log the incident in background
    chrome.runtime.sendMessage({
      action: 'LOG_BLOCKED_INCIDENT',
      url: currentUrl,
      threatType: assessment.threatType || 'Phishing'
    });

    // Create high-z-index urgent security overlay
    const overlay = document.createElement('div');
    overlay.id = 'cyberraksha-safety-lock-overlay';
    overlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 2147483647 !important;
      background: rgba(5, 8, 12, 0.96) !important;
      backdrop-filter: blur(12px) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      color: #ffffff !important;
      box-sizing: border-box !important;
      padding: 24px !important;
    `;

    const reasonsList = (assessment.reasons || [])
      .map(r => `<li style="margin-bottom: 6px;">• ${escapeHtml(r)}</li>`)
      .join('');

    overlay.innerHTML = `
      <div style="
        max-width: 620px;
        width: 100%;
        background: #0f161e;
        border: 2px solid #ff0000;
        border-radius: 20px;
        padding: 36px 32px;
        box-shadow: 0 0 50px rgba(255, 0, 0, 0.45);
        text-align: center;
        animation: cyberraksha-pulse 2s infinite;
      ">
        <div style="
          width: 68px;
          height: 68px;
          margin: 0 auto 20px;
          background: rgba(255, 0, 0, 0.15);
          border: 2px solid #ff0000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        ">
          ⚠️
        </div>

        <div style="
          display: inline-block;
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid #ff0000;
          color: #ff0000;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 1.5px;
          padding: 4px 14px;
          border-radius: 20px;
          text-transform: uppercase;
          margin-bottom: 16px;
        ">
          CYBERRAKSHA SAFETY LOCK • ${escapeHtml(assessment.threatType || 'HARMFUL LINK')}
        </div>

        <h1 style="
          color: #ff0000;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.3;
          margin: 0 0 14px 0;
          letter-spacing: -0.5px;
        ">
          This link is harmful. Do not click or proceed.
        </h1>

        <p style="
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        ">
          CyberRaksha Link Guard detected severe risk signatures on this page. Visiting this domain may expose you to credential theft, unauthorized bank debit, malicious redirects, or malware download.
        </p>

        <div style="
          background: #090e13;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 24px;
          text-align: left;
          font-size: 13px;
        ">
          <div style="color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
            Target URL
          </div>
          <div style="color: #f87171; word-break: break-all; font-family: monospace; font-size: 12px; margin-bottom: 12px;">
            ${escapeHtml(currentUrl)}
          </div>

          ${assessment.reasons && assessment.reasons.length ? `
            <div style="color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
              Threat Indicators
            </div>
            <ul style="color: #e2e8f0; margin: 0; padding: 0; list-style: none; font-size: 12px;">
              ${reasonsList}
            </ul>
          ` : ''}
        </div>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <button id="cyberraksha-btn-safety" style="
            flex: 1;
            background: #ff0000;
            color: #ffffff;
            font-weight: 700;
            font-size: 14px;
            border: none;
            padding: 14px 20px;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
            transition: all 0.2s ease;
          ">
            🛡️ Back to Safety
          </button>
        </div>
      </div>
    `;

    document.documentElement.appendChild(overlay);

    // Disable interaction with background document
    document.body?.style.setProperty('overflow', 'hidden', 'important');

    // Add button handler
    const btnSafety = document.getElementById('cyberraksha-btn-safety');
    if (btnSafety) {
      btnSafety.onclick = () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = 'https://google.com';
        }
      };
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
