from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class SecurityIndicator:
    type: str
    severity: str
    description: str
    evidence: str = ""

    def as_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "severity": self.severity,
            "description": self.description,
            "evidence": self.evidence,
        }


@dataclass
class URLAnalysisResult:
    url: str
    is_valid_url: bool
    sanitized_url: str
    scheme: str = ""
    hostname: str = ""
    port: Optional[int] = None
    pathname: str = ""
    search: str = ""
    indicators: List[SecurityIndicator] = field(default_factory=list)
    derived_risk_modifier: int = 0
    has_critical_indicators: bool = False

    def as_dict(self) -> Dict[str, Any]:
        return {
            "url": self.url,
            "is_valid_url": self.is_valid_url,
            "sanitized_url": self.sanitized_url,
            "scheme": self.scheme,
            "hostname": self.hostname,
            "port": self.port,
            "pathname": self.pathname,
            "search": self.search,
            "indicators": [i.as_dict() for i in self.indicators],
            "indicator_count": len(self.indicators),
            "has_critical_indicators": self.has_critical_indicators,
            "derived_risk_modifier": self.derived_risk_modifier,
        }
