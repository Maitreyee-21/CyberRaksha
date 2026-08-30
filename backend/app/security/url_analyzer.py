"""Deterministic, explainable URL security analysis.

This module intentionally performs no DNS lookup, page fetch, crawling, or exploit
attempt. It only inspects the supplied URL string.
"""

import ipaddress
import re
from urllib.parse import urlsplit

from .models import SecurityIndicator, URLAnalysisResult

SUSPICIOUS_KEYWORDS = {
    "kyc", "update-kyc", "pan-card", "aadhaar", "verify-account",
    "bank-login", "netbanking", "secure-login", "account-blocked",
    "unblock-account", "lottery", "winner", "claim-reward", "refund",
    "income-tax-refund", "electricity-bill", "disconnection", "payment-gateway",
    "free-recharge", "urgent-action", "security-alert", "otp-verification",
    "card-update", "cvv", "debit-card", "credit-reward",
}

SUSPICIOUS_TLDS = {
    "xyz", "top", "work", "click", "buzz", "tk", "ml", "ga", "cf", "gq",
    "fit", "rest", "support", "live", "club", "surf", "cam", "icu", "monster",
    "stream", "gdn", "vip", "kim",
}

# Demo-focused protected brands. This is not a complete allowlist of official domains.
PROTECTED_BRANDS = {
    "sbi": {"sbi.co.in", "sbi.bank.in", "onlinesbi.sbi"},
    "hdfc": {"hdfcbank.com"},
    "icici": {"icicibank.com"},
    "pnb": {"pnbindia.in"},
    "axisbank": {"axisbank.com"},
    "paytm": {"paytm.com"},
    "phonepe": {"phonepe.com"},
    "gpay": {"pay.google.com"},
    "googlepay": {"pay.google.com"},
    "bhim": {"bhimupi.org.in"},
    "uidai": {"uidai.gov.in"},
    "incometax": {"incometax.gov.in"},
    "cybercrime": {"cybercrime.gov.in"},
    "bescom": {"bescom.karnataka.gov.in"},
    "mahadiscom": {"mahadiscom.in"},
}

CREDENTIAL_PARAM_RE = re.compile(
    r"(?:^|[?&/])(?:password|passwd|pin|upi_pin|otp|cvv|secret|token|account_no)(?:=|/)",
    re.I,
)
REDIRECT_PARAM_RE = re.compile(
    r"(?:^|[?&])(?:redirect|return|next|target|dest|goto|r_url|callback)=https?%3A%2F%2F|"
    r"(?:^|[?&])(?:redirect|return|next|target|dest|goto|r_url|callback)=https?://",
    re.I,
)


def _indicator(type_: str, severity: str, description: str, evidence: str = "") -> SecurityIndicator:
    return SecurityIndicator(type_, severity, description, evidence)


def _is_ip(hostname: str) -> bool:
    try:
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False


def sanitize_url(raw_url: str):
    if not isinstance(raw_url, str) or not raw_url.strip():
        return False, "", "Empty or invalid URL input"
    raw = raw_url.strip()
    if any(ch.isspace() for ch in raw):
        return False, raw, "URL contains whitespace and cannot be safely parsed"
    candidate = raw if re.match(r"^[A-Za-z][A-Za-z0-9+.-]*://", raw) else f"https://{raw}"
    try:
        parsed = urlsplit(candidate)
        if parsed.scheme.lower() not in {"http", "https"}:
            return False, raw, "Only HTTP/HTTPS destinations are supported"
        if not parsed.hostname:
            return False, raw, "URL has no destination hostname"
        # Accessing .port validates malformed numeric ports.
        _ = parsed.port
        return True, parsed.geturl(), ""
    except (ValueError, TypeError):
        return False, raw, "Malformed URL structure"


def analyze_url(raw_url: str) -> URLAnalysisResult:
    raw = (raw_url or "").strip()
    valid, sanitized, error = sanitize_url(raw)
    if not valid:
        return URLAnalysisResult(
            url=raw,
            is_valid_url=False,
            sanitized_url=sanitized,
            indicators=[_indicator("MALFORMED_URL", "HIGH", error or "Malformed URL", raw[:120])],
            derived_risk_modifier=75,
            has_critical_indicators=True,
        )

    parsed = urlsplit(sanitized)
    scheme = parsed.scheme.lower()
    hostname = (parsed.hostname or "").lower().rstrip(".")
    pathname = parsed.path or "/"
    search = f"?{parsed.query}" if parsed.query else ""
    indicators: list[SecurityIndicator] = []

    if scheme == "http":
        indicators.append(_indicator(
            "INSECURE_SCHEME", "MEDIUM",
            "URL uses plaintext HTTP instead of encrypted HTTPS.",
            "Protocol: http://",
        ))

    if _is_ip(hostname):
        indicators.append(_indicator(
            "RAW_IP_HOST", "HIGH",
            "Destination uses a raw IP address instead of a domain name.",
            f"Host: {hostname}",
        ))

    if "@" in raw:
        indicators.append(_indicator(
            "AT_SYMBOL_ABUSE", "HIGH",
            'URL contains an @ symbol that can obscure the actual destination host.',
            "Found @ in URL",
        ))

    length = len(sanitized)
    if length > 250:
        indicators.append(_indicator(
            "EXCESSIVE_URL_LENGTH", "HIGH",
            f"URL is unusually long ({length} characters).",
            f"Length: {length}",
        ))
    elif length > 120:
        indicators.append(_indicator(
            "LONG_URL_LENGTH", "LOW",
            f"URL is longer than a typical navigation link ({length} characters).",
            f"Length: {length}",
        ))

    labels = hostname.split(".") if hostname else []
    if len(labels) > 4 and not _is_ip(hostname):
        indicators.append(_indicator(
            "EXCESSIVE_SUBDOMAINS", "MEDIUM",
            f"URL contains {len(labels) - 2} subdomain levels.",
            hostname,
        ))

    tld = labels[-1] if len(labels) > 1 else ""
    if tld in SUSPICIOUS_TLDS:
        indicators.append(_indicator(
            "SUSPICIOUS_TLD", "MEDIUM",
            f"The .{tld} TLD has been associated with disposable or abusive domains; TLD alone is not proof of fraud.",
            f"TLD: .{tld}",
        ))

    # Brand impersonation: only flag when the protected brand appears in the host but
    # the host is not one of the explicitly trusted demo domains.
    # Detect protected brand references at DNS-label boundaries or as hyphenated names.
    # This avoids false positives such as a legitimate hostname that merely contains
    # the letters "sbi" inside an unrelated word.
    host_labels = set(labels)
    for brand, official_domains in PROTECTED_BRANDS.items():
        brand_terms = {brand, brand.replace("bank", "")}
        references_brand = any(
            label == term or label.startswith(term + "-") or label.endswith("-" + term)
            for label in labels for term in brand_terms if term
        )
        if references_brand and hostname not in official_domains:
            indicators.append(_indicator(
                "POSSIBLE_IMPERSONATION", "HIGH",
                f'Hostname references protected brand "{brand}" but is not a known official domain.',
                f"Host: {hostname}",
            ))
            break

    if "xn--" in hostname:
        indicators.append(_indicator(
            "PUNYCODE_HOMOGLYPH", "HIGH",
            "Domain uses punycode, which can be used for lookalike-domain deception.",
            hostname,
        ))

    combined = f"{hostname}{pathname}{search}".lower()
    matched = sorted((kw for kw in SUSPICIOUS_KEYWORDS if kw in combined), key=len, reverse=True)
    if matched:
        high_terms = {"kyc", "unblock-account", "otp-verification", "cvv", "netbanking"}
        severity = "HIGH" if any(term in high_terms for term in matched) else "MEDIUM"
        indicators.append(_indicator(
            "SUSPICIOUS_KEYWORD", severity,
            "URL contains scam/phishing-related terms.",
            ", ".join(matched[:8]),
        ))

    if CREDENTIAL_PARAM_RE.search(search) or CREDENTIAL_PARAM_RE.search(pathname):
        indicators.append(_indicator(
            "CREDENTIAL_HARVESTING_PATTERN", "CRITICAL",
            "URL contains a parameter pattern associated with transmitting credentials or one-time secrets.",
            "Credential-like parameter detected",
        ))

    port = parsed.port
    if port and port not in {80, 443}:
        indicators.append(_indicator(
            "UNUSUAL_PORT", "MEDIUM",
            f"URL uses a non-standard web service port (:{port}).",
            f"Port: {port}",
        ))

    segments = [segment for segment in pathname.split("/") if segment]
    if len(segments) > 5:
        indicators.append(_indicator(
            "EXCESSIVE_PATH_DEPTH", "LOW",
            f"URL has unusually deep path nesting ({len(segments)} levels).",
            f"Segments: {len(segments)}",
        ))

    if re.search(r"%[0-9A-Fa-f]{2}%[0-9A-Fa-f]{2}", raw) or re.search(r"%25[0-9A-Fa-f]{2}", raw):
        indicators.append(_indicator(
            "OBFUSCATED_ENCODING", "HIGH",
            "URL contains nested percent-encoding patterns that can obscure its meaning.",
            "Nested percent-encoding detected",
        ))

    if REDIRECT_PARAM_RE.search(search):
        indicators.append(_indicator(
            "OPEN_REDIRECT_PARAMETER", "MEDIUM",
            "URL contains a parameter pointing to a secondary external destination.",
            "Redirect-like parameter detected",
        ))

    modifier = 0
    critical = False
    for indicator in indicators:
        if indicator.severity == "CRITICAL":
            modifier += 50
            critical = True
        elif indicator.severity == "HIGH":
            modifier += 30
            critical = True
        elif indicator.severity == "MEDIUM":
            modifier += 15
        else:
            modifier += 5

    return URLAnalysisResult(
        url=raw,
        is_valid_url=True,
        sanitized_url=sanitized,
        scheme=scheme,
        hostname=hostname,
        port=port,
        pathname=pathname,
        search=search,
        indicators=indicators,
        derived_risk_modifier=min(100, modifier),
        has_critical_indicators=critical,
    )
