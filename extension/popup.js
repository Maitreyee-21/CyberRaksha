/**
 * CyberRaksha - Safety Lock Popup Dashboard Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  const protectionToggle = document.getElementById('protection-toggle');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');

  const activeUrlDisplay = document.getElementById('active-url-display');
  const tabThreatBadge = document.getElementById('tab-threat-badge');
  const tabVarietyBadge = document.getElementById('tab-variety-badge');
  const tabReasonsBox = document.getElementById('tab-reasons-box');
  const tabReasonsList = document.getElementById('tab-reasons-list');
  const btnRefreshTab = document.getElementById('btn-refresh-tab');

  const manualUrlInput = document.getElementById('manual-url-input');
  const btnManualScan = document.getElementById('btn-manual-scan');
  const manualResult = document.getElementById('manual-result');

  const blockedCountEl = document.getElementById('blocked-count');
  const blockedLinksList = document.getElementById('blocked-links-list');
  const btnClearHistory = document.getElementById('btn-clear-history');

  // 1. Initialize Toggle State
  chrome.storage.local.get(['protectionEnabled', 'blockedLinks'], (data) => {
    const isEnabled = data.protectionEnabled !== false;
    protectionToggle.checked = isEnabled;
    updateStatusIndicator(isEnabled);
    renderBlockedLinks(data.blockedLinks || []);
  });

  protectionToggle.addEventListener('change', () => {
    const isEnabled = protectionToggle.checked;
    chrome.runtime.sendMessage({ action: 'TOGGLE_PROTECTION', enabled: isEnabled }, () => {
      updateStatusIndicator(isEnabled);
      // Re-evaluate active tab
      inspectActiveTab();
    });
  });

  function updateStatusIndicator(enabled) {
    const container = statusDot.parentElement;
    if (enabled) {
      container.classList.remove('disabled');
      statusText.textContent = 'Active';
    } else {
      container.classList.add('disabled');
      statusText.textContent = 'Disabled';
    }
  }

  // 2. Active Tab Inspection
  async function inspectActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.url) {
        activeUrlDisplay.textContent = 'No active webpage detected';
        setThreatBadge('Safe', null);
        return;
      }

      activeUrlDisplay.textContent = tab.url;

      chrome.runtime.sendMessage({ action: 'CLASSIFY_URL', url: tab.url }, (assessment) => {
        if (!assessment) return;
        renderActiveTabAssessment(assessment);
      });
    } catch (err) {
      activeUrlDisplay.textContent = 'Unable to inspect active tab';
      console.error(err);
    }
  }

  function renderActiveTabAssessment(assessment) {
    setThreatBadge(assessment.status, assessment.threatType);

    if (assessment.reasons && assessment.reasons.length > 0 && assessment.status !== 'Safe') {
      tabReasonsBox.style.display = 'block';
      tabReasonsList.innerHTML = assessment.reasons
        .map(r => `<li>${escapeHtml(r)}</li>`)
        .join('');
    } else {
      tabReasonsBox.style.display = 'none';
      tabReasonsList.innerHTML = '';
    }
  }

  function setThreatBadge(status, threatType) {
    tabThreatBadge.className = 'threat-badge';
    tabVarietyBadge.style.display = 'none';

    if (status === 'Safe') {
      tabThreatBadge.classList.add('badge-safe');
      tabThreatBadge.innerHTML = '🛡️ Safe / Valid';
    } else if (status === 'Suspicious') {
      tabThreatBadge.classList.add('badge-suspicious');
      tabThreatBadge.innerHTML = '⚠️ Suspicious';
      if (threatType) {
        tabVarietyBadge.style.display = 'inline-flex';
        tabVarietyBadge.textContent = threatType;
      }
    } else if (status === 'Harmful') {
      tabThreatBadge.classList.add('badge-harmful');
      tabThreatBadge.innerHTML = '🛑 Harmful / Blocked';
      if (threatType) {
        tabVarietyBadge.style.display = 'inline-flex';
        tabVarietyBadge.textContent = threatType;
      }
    } else {
      tabThreatBadge.classList.add('badge-neutral');
      tabThreatBadge.innerHTML = 'Unknown';
    }
  }

  btnRefreshTab.addEventListener('click', () => {
    inspectActiveTab();
  });

  // 3. Quick Manual URL Scanner
  btnManualScan.addEventListener('click', runManualScan);
  manualUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runManualScan();
  });

  function runManualScan() {
    const rawUrl = manualUrlInput.value.trim();
    if (!rawUrl) return;

    let target = rawUrl;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    manualResult.style.display = 'block';
    manualResult.innerHTML = '<span style="color: #94A3B8;">Analyzing link signatures...</span>';

    chrome.runtime.sendMessage({ action: 'CLASSIFY_URL', url: target }, (res) => {
      if (!res) {
        manualResult.innerHTML = '<span style="color: #F87171;">Scan failed</span>';
        return;
      }

      let color = '#34D399';
      let icon = '🛡️';
      if (res.status === 'Suspicious') {
        color = '#FBBF24';
        icon = '⚠️';
      } else if (res.status === 'Harmful') {
        color = '#FF4D4D';
        icon = '🛑';
      }

      const threatInfo = res.threatType ? ` • <strong>${escapeHtml(res.threatType)}</strong>` : '';

      manualResult.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: ${color}; font-weight: 700;">${icon} ${res.status}${threatInfo}</span>
          <span style="color: #64748B; font-size: 10px;">Risk Score: ${res.score}/100</span>
        </div>
        <div style="color: #94A3B8; font-size: 10px;">${escapeHtml(res.reasons[0] || 'Domain validation verified')}</div>
      `;
    });
  }

  // 4. Blocked Links History Rendering
  function renderBlockedLinks(links) {
    blockedCountEl.textContent = links.length;

    if (!links || links.length === 0) {
      blockedLinksList.innerHTML = `
        <div class="empty-state">No harmful links blocked yet. Real-time guard active.</div>
      `;
      return;
    }

    blockedLinksList.innerHTML = links.map(item => {
      const timeFormatted = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';
      return `
        <div class="blocked-item">
          <div class="blocked-item-header">
            <span class="blocked-item-domain" title="${escapeHtml(item.domain)}">${escapeHtml(item.domain)}</span>
            <span class="blocked-item-threat">${escapeHtml(item.threatType || 'Harmful')}</span>
          </div>
          <div class="blocked-item-url" title="${escapeHtml(item.url)}">${escapeHtml(item.url)}</div>
          <div class="blocked-item-time">Blocked at ${timeFormatted} • Threat neutralised</div>
        </div>
      `;
    }).join('');
  }

  // Clear History
  btnClearHistory.addEventListener('click', () => {
    if (confirm('Clear blocked links history?')) {
      chrome.runtime.sendMessage({ action: 'CLEAR_BLOCKED_LINKS' }, () => {
        renderBlockedLinks([]);
      });
    }
  });

  // Listen for background updates
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.blockedLinks) {
        renderBlockedLinks(changes.blockedLinks.newValue || []);
      }
      if (changes.protectionEnabled !== undefined) {
        protectionToggle.checked = changes.protectionEnabled.newValue;
        updateStatusIndicator(changes.protectionEnabled.newValue);
      }
    }
  });

  // Run initial tab inspection
  inspectActiveTab();

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
