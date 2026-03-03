"""
Tests para el scanner de cabeceras HTTP.
Ejecutar: python -m pytest test_scanner.py -v
"""

import json
import sys
import os
import pytest

# Añadir directorio scanner al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scanner"))

from headers_scanner import analyze_headers, SECURITY_HEADERS
from ssl_scanner import analyze_ssl
from config_checker import check_config


class TestHeadersScanner:
    """Tests para el módulo de análisis de cabeceras HTTP."""

    def test_analyze_headers_returns_dict(self):
        """El resultado debe ser un diccionario con las claves esperadas."""
        result = analyze_headers("https://example.com")
        assert isinstance(result, dict)
        assert "score" in result
        assert "findings" in result
        assert "module" in result
        assert result["module"] == "headers"

    def test_score_is_between_0_and_100(self):
        """El score debe estar entre 0 y 100."""
        result = analyze_headers("https://example.com")
        assert 0 <= result["score"] <= 100

    def test_findings_are_list(self):
        """Los hallazgos deben ser una lista."""
        result = analyze_headers("https://example.com")
        assert isinstance(result["findings"], list)

    def test_finding_structure(self):
        """Cada hallazgo debe tener las claves esperadas."""
        result = analyze_headers("https://example.com")
        if result["findings"]:
            finding = result["findings"][0]
            assert "category" in finding
            assert "severity" in finding
            assert "title" in finding
            assert "description" in finding
            assert "recommendation" in finding

    def test_invalid_url_returns_error(self):
        """Una URL inválida debe retornar un error."""
        result = analyze_headers("https://this-domain-does-not-exist-12345.com")
        assert result["score"] == 0
        assert "error" in result

    def test_security_headers_defined(self):
        """Debe haber al menos 5 cabeceras de seguridad definidas."""
        assert len(SECURITY_HEADERS) >= 5


class TestSSLScanner:
    """Tests para el módulo de verificación SSL/TLS."""

    def test_analyze_ssl_returns_dict(self):
        result = analyze_ssl("https://example.com")
        assert isinstance(result, dict)
        assert "score" in result
        assert "module" in result
        assert result["module"] == "ssl"

    def test_http_detected_as_insecure(self):
        """Una URL HTTP debe generar un hallazgo Critical."""
        result = analyze_ssl("http://example.com")
        critical_findings = [f for f in result["findings"] if f["severity"] == "Critical"]
        assert len(critical_findings) > 0


class TestConfigChecker:
    """Tests para el módulo de detección de configuraciones inseguras."""

    def test_check_config_returns_dict(self):
        result = check_config("https://example.com")
        assert isinstance(result, dict)
        assert "score" in result
        assert "module" in result
        assert result["module"] == "config"

    def test_score_is_between_0_and_100(self):
        result = check_config("https://example.com")
        assert 0 <= result["score"] <= 100
