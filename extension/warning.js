/**
 * CyberRaksha - Safety Lock Warning Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const targetUrl = params.get('url') || 'Unknown Destination';
  const threat = params.get('threat') || 'Harmful Link';

  const blockedUrlEl = document.getElementById('blocked-url');
  const threatTypeEl = document.getElementById('threat-type');
  const threatBadgeEl = document.getElementById('threat-badge');
  const timestampEl = document.getElementById('timestamp-val');

  if (blockedUrlEl) blockedUrlEl.textContent = targetUrl;
  if (threatTypeEl) threatTypeEl.textContent = threat;
  if (threatBadgeEl) threatBadgeEl.textContent = `CYBERRAKSHA SAFETY LOCK • ${threat.toUpperCase()}`;
  if (timestampEl) timestampEl.textContent = new Date().toLocaleString();

  const btnBack = document.getElementById('btn-back');
  const btnClose = document.getElementById('btn-close');

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (window.history.length > 2) {
        window.history.go(-2);
      } else {
        window.location.href = 'https://google.com';
      }
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      window.close();
    });
  }
});
