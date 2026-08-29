import unittest

from app.security import analyze_url, evaluate_safety_policy, analyze_qr_payload


class SecurityLayerTests(unittest.TestCase):
    def test_high_raw_ip_is_blocked(self):
        result = evaluate_safety_policy("http://45.33.32.156/bank-login", risk_score=20)
        self.assertEqual(result["risk_level"], "HIGH")
        self.assertEqual(result["action"], "BLOCK")
        self.assertFalse(result["navigation_allowed"])
        self.assertTrue(result["safety_lock"]["locked"])
        self.assertTrue(result["emergency_alert"]["active"])

    def test_high_guardian_score_is_blocked(self):
        result = evaluate_safety_policy("https://example.com/page", risk_score=94, risk_level="HIGH")
        self.assertEqual(result["action"], "BLOCK")
        self.assertFalse(result["navigation_allowed"])

    def test_medium_requires_confirmation(self):
        result = evaluate_safety_policy("https://example.com/page", risk_score=50)
        self.assertEqual(result["risk_level"], "MEDIUM")
        self.assertEqual(result["action"], "WARN")
        self.assertTrue(result["requires_confirmation"])
        self.assertFalse(result["navigation_allowed"])

    def test_low_can_proceed_with_caution(self):
        result = evaluate_safety_policy("https://cybercrime.gov.in", risk_score=5)
        self.assertEqual(result["risk_level"], "LOW")
        self.assertEqual(result["action"], "ALLOW_WITH_CAUTION")
        self.assertTrue(result["navigation_allowed"])

    def test_malformed_fails_safe(self):
        result = evaluate_safety_policy("not a valid url")
        self.assertEqual(result["action"], "BLOCK")
        self.assertFalse(result["navigation_allowed"])
        self.assertTrue(result["fail_safe_triggered"])

    def test_credential_parameter_is_critical(self):
        result = analyze_url("https://example.com/login?password=test")
        types = {i.type for i in result.indicators}
        self.assertIn("CREDENTIAL_HARVESTING_PATTERN", types)
        self.assertTrue(result.has_critical_indicators)

    def test_qr_url_is_analyzed(self):
        result = analyze_qr_payload("http://sbi-kyc-update.top/login", risk_score=94)
        self.assertTrue(result["success"])
        self.assertEqual(result["payload_type"], "URL")
        self.assertEqual(result["security_evaluation"]["action"], "BLOCK")

    def test_qr_plain_text_is_non_navigable(self):
        result = analyze_qr_payload("WIFI:S:Guest;T:WPA;P:test;;")
        self.assertTrue(result["success"])
        self.assertEqual(result["payload_type"], "PLAIN_TEXT")
        self.assertIsNone(result.get("security_evaluation"))

    def test_http_url_is_at_least_medium(self):
        result = evaluate_safety_policy("http://example.com", risk_score=0)
        self.assertEqual(result["risk_level"], "MEDIUM")
        self.assertTrue(result["requires_confirmation"])

    def test_unrelated_hostname_containing_sbi_letters_is_not_brand_match(self):
        result = analyze_url("https://possible.example.com")
        types = {i.type for i in result.indicators}
        self.assertNotIn("POSSIBLE_IMPERSONATION", types)

    def test_upi_qr_gets_payment_warning_not_web_navigation(self):
        result = analyze_qr_payload("upi://pay?pa=merchant@upi&pn=Merchant&am=250&cu=INR")
        self.assertEqual(result["payload_type"], "UPI_PAYMENT")
        self.assertIsNone(result["security_evaluation"])
        self.assertIn("payment_security", result)
        self.assertFalse(result["payment_security"]["navigation_allowed"])

    def test_thresholds_are_consistent(self):
        self.assertEqual(evaluate_safety_policy("https://example.com", risk_score=39)["risk_level"], "LOW")
        self.assertEqual(evaluate_safety_policy("https://example.com", risk_score=40)["risk_level"], "MEDIUM")
        self.assertEqual(evaluate_safety_policy("https://example.com", risk_score=70)["risk_level"], "HIGH")


if __name__ == "__main__":
    unittest.main()
