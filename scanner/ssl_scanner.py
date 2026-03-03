"""
SecAudit — Verificación SSL/TLS
Uso: python ssl_scanner.py https://ejemplo.com
"""

import json
import socket
import ssl
import sys
from datetime import datetime, timezone


def analyze_ssl(url: str) -> dict:
    """Analiza el certificado SSL/TLS de una URL."""
    findings = []
    score = 100

    # Limpiar URL para obtener hostname
    hostname = url.replace("https://", "").replace("http://", "").split("/")[0].split(":")[0]

    # --- Verificar si usa HTTPS ---
    if url.startswith("http://"):
        findings.append({
            "category": "SSL/TLS",
            "severity": "Critical",
            "title": "Unencrypted Connection",
            "description": "The site is using plain HTTP instead of HTTPS.",
            "recommendation": "Redirect all traffic to HTTPS and use a valid SSL certificate.",
        })
        score -= 40

    # --- Verificar certificado SSL ---
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=10) as sock:
            with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                protocol = ssock.version()
                cipher = ssock.cipher()

                # Verificar expiración
                not_after_str = cert.get("notAfter", "")
                if not_after_str:
                    not_after = datetime.strptime(not_after_str, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
                    now = datetime.now(timezone.utc)
                    days_left = (not_after - now).days

                    if days_left < 0:
                        findings.append({
                            "category": "SSL/TLS",
                            "severity": "Critical",
                            "title": "SSL Certificate Expired",
                            "description": f"The certificate expired {abs(days_left)} days ago ({not_after_str}).",
                            "recommendation": "Renew the SSL certificate immediately.",
                        })
                        score -= 30
                    elif days_left < 30:
                        findings.append({
                            "category": "SSL/TLS",
                            "severity": "High",
                            "title": "SSL Certificate Expiring Soon",
                            "description": f"The certificate expires in {days_left} days ({not_after_str}).",
                            "recommendation": "Renew the SSL certificate before it expires.",
                        })
                        score -= 15

                # Verificar protocolo débil
                weak_protocols = ["SSLv2", "SSLv3", "TLSv1", "TLSv1.1"]
                if protocol in weak_protocols:
                    findings.append({
                        "category": "SSL/TLS",
                        "severity": "High",
                        "title": f"Weak Protocol: {protocol}",
                        "description": f"The server is using {protocol}, which is considered insecure.",
                        "recommendation": "Disable TLSv1.0 and TLSv1.1. Use TLSv1.2 or TLSv1.3 only.",
                    })
                    score -= 15

                # Verificar cipher suite débil
                if cipher:
                    cipher_name = cipher[0]
                    weak_ciphers = ["RC4", "DES", "3DES", "NULL", "EXPORT", "MD5"]
                    for wc in weak_ciphers:
                        if wc in cipher_name.upper():
                            findings.append({
                                "category": "SSL/TLS",
                                "severity": "High",
                                "title": f"Weak Cipher Suite: {cipher_name}",
                                "description": f"The cipher suite contains {wc}, which is considered insecure.",
                                "recommendation": "Configure the server to use only strong cipher suites (e.g., AES-GCM, ChaCha20).",
                            })
                            score -= 15
                            break

                # Información del certificado
                cert_info = {
                    "subject": dict(x[0] for x in cert.get("subject", [])),
                    "issuer": dict(x[0] for x in cert.get("issuer", [])),
                    "notBefore": cert.get("notBefore"),
                    "notAfter": cert.get("notAfter"),
                    "protocol": protocol,
                    "cipher": cipher[0] if cipher else None,
                }

    except ssl.SSLCertVerificationError as e:
        findings.append({
            "category": "SSL/TLS",
            "severity": "Critical",
            "title": "Invalid SSL Certificate",
            "description": f"SSL certificate verification failed: {e}",
            "recommendation": "Install a valid SSL certificate from a trusted Certificate Authority.",
        })
        score -= 30
        cert_info = {"error": str(e)}
    except socket.timeout:
        findings.append({
            "category": "SSL/TLS",
            "severity": "Medium",
            "title": "SSL Connection Timeout",
            "description": "Could not establish an SSL connection within the timeout period.",
            "recommendation": "Verify the server is accepting SSL connections on port 443.",
        })
        score -= 10
        cert_info = {"error": "connection timeout"}
    except ConnectionRefusedError:
        findings.append({
            "category": "SSL/TLS",
            "severity": "High",
            "title": "SSL Port Closed",
            "description": "Port 443 is not accepting connections.",
            "recommendation": "Enable HTTPS on port 443 with a valid SSL certificate.",
        })
        score -= 20
        cert_info = {"error": "connection refused"}
    except Exception as e:
        cert_info = {"error": str(e)}

    score = max(0, score)

    return {
        "module": "ssl",
        "hostname": hostname,
        "score": score,
        "findings_count": len(findings),
        "findings": findings,
        "certificate": cert_info if "cert_info" in dir() else {},
    }


def main():
    if len(sys.argv) < 2:
        print("Uso: python ssl_scanner.py <URL>")
        print("Ejemplo: python ssl_scanner.py https://example.com")
        sys.exit(1)

    url = sys.argv[1]
    result = analyze_ssl(url)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
