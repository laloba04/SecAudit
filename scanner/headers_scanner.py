"""
SecAudit — Análisis de cabeceras HTTP de seguridad
Uso: python headers_scanner.py https://ejemplo.com
"""

import json
import sys
import httpx

# Cabeceras de seguridad que se verifican, con severidad y recomendación
SECURITY_HEADERS = [
    {
        "name": "Strict-Transport-Security",
        "title": "HSTS Not Enabled",
        "severity": "Medium",
        "penalty": 10,
        "recommendation": "Enable HSTS to force HTTPS connections. Add: Strict-Transport-Security: max-age=31536000; includeSubDomains",
    },
    {
        "name": "Content-Security-Policy",
        "title": "CSP Missing",
        "severity": "High",
        "penalty": 15,
        "recommendation": "Implement a Content-Security-Policy to prevent XSS and data injection attacks.",
    },
    {
        "name": "X-Frame-Options",
        "title": "Clickjacking Protection Missing",
        "severity": "Medium",
        "penalty": 10,
        "recommendation": "Set X-Frame-Options to DENY or SAMEORIGIN to prevent clickjacking.",
    },
    {
        "name": "X-Content-Type-Options",
        "title": "MIME Sniffing Protection Missing",
        "severity": "Low",
        "penalty": 5,
        "recommendation": "Set X-Content-Type-Options to nosniff to prevent MIME type sniffing.",
    },
    {
        "name": "Referrer-Policy",
        "title": "Referrer Policy Missing",
        "severity": "Low",
        "penalty": 5,
        "recommendation": "Set a Referrer-Policy header to control information sent in the Referer header.",
    },
    {
        "name": "Permissions-Policy",
        "title": "Permissions Policy Missing",
        "severity": "Low",
        "penalty": 5,
        "recommendation": "Set Permissions-Policy to restrict access to browser features like camera, microphone, geolocation.",
    },
    {
        "name": "X-XSS-Protection",
        "title": "XSS Protection Header Missing",
        "severity": "Low",
        "penalty": 3,
        "recommendation": "Set X-XSS-Protection: 1; mode=block (legacy browsers) or rely on CSP for modern browsers.",
    },
]

# Cookies inseguras
COOKIE_FLAGS = ["Secure", "HttpOnly", "SameSite"]


def analyze_headers(url: str) -> dict:
    """Analiza las cabeceras HTTP de seguridad de una URL."""
    findings = []
    score = 100

    # Asegurar protocolo
    if not url.startswith("http"):
        url = "https://" + url

    try:
        response = httpx.get(url, follow_redirects=True, timeout=15)
    except httpx.ConnectError:
        return {"error": f"Could not connect to {url}", "score": 0, "findings": [], "module": "headers", "findings_count": 0}
    except httpx.TimeoutException:
        return {"error": f"Connection timed out for {url}", "score": 0, "findings": [], "module": "headers", "findings_count": 0}
    except Exception as e:
        return {"error": str(e), "score": 0, "findings": [], "module": "headers", "findings_count": 0}

    headers = response.headers

    # --- Verificar cabeceras de seguridad ---
    for sh in SECURITY_HEADERS:
        value = headers.get(sh["name"])
        if not value:
            findings.append({
                "category": "Headers",
                "severity": sh["severity"],
                "title": sh["title"],
                "description": f"The {sh['name']} header was not found in the response.",
                "recommendation": sh["recommendation"],
            })
            score -= sh["penalty"]

    # --- Verificar cookies inseguras ---
    set_cookie_headers = response.headers.get_list("set-cookie") if hasattr(response.headers, "get_list") else []
    for cookie_str in set_cookie_headers:
        cookie_name = cookie_str.split("=")[0].strip()
        for flag in COOKIE_FLAGS:
            if flag.lower() not in cookie_str.lower():
                findings.append({
                    "category": "Cookies",
                    "severity": "Medium" if flag == "Secure" else "Low",
                    "title": f"Cookie '{cookie_name}' missing {flag} flag",
                    "description": f"The cookie '{cookie_name}' does not have the {flag} flag set.",
                    "recommendation": f"Add the {flag} flag to the '{cookie_name}' cookie.",
                })
                score -= 3

    # --- Verificar CORS permisivo ---
    acao = headers.get("Access-Control-Allow-Origin")
    if acao == "*":
        findings.append({
            "category": "Headers",
            "severity": "Medium",
            "title": "Overly Permissive CORS",
            "description": "Access-Control-Allow-Origin is set to '*', allowing any origin.",
            "recommendation": "Restrict CORS to specific trusted origins instead of wildcard.",
        })
        score -= 10

    score = max(0, score)

    return {
        "module": "headers",
        "url": url,
        "status_code": response.status_code,
        "score": score,
        "findings_count": len(findings),
        "findings": findings,
    }


def main():
    if len(sys.argv) < 2:
        print("Uso: python headers_scanner.py <URL>")
        print("Ejemplo: python headers_scanner.py https://example.com")
        sys.exit(1)

    url = sys.argv[1]
    result = analyze_headers(url)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
