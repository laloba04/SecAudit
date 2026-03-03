"""
SecAudit — Detección de configuraciones inseguras
Uso: python config_checker.py https://ejemplo.com
"""

import json
import sys
import httpx


def check_config(url: str) -> dict:
    """Detecta configuraciones inseguras en un servidor web."""
    findings = []
    score = 100

    if not url.startswith("http"):
        url = "https://" + url

    try:
        response = httpx.get(url, follow_redirects=True, timeout=15)
    except Exception as e:
        return {"error": str(e), "score": 0, "findings": [], "module": "config", "findings_count": 0}

    headers = response.headers

    # --- Server Information Disclosure ---
    server = headers.get("Server")
    if server:
        findings.append({
            "category": "Configuration",
            "severity": "Low",
            "title": "Server Information Disclosure",
            "description": f"Server header found: {server}. This can reveal software versions to attackers.",
            "recommendation": "Configure your server to hide version strings in the Server header.",
        })
        score -= 5

    # --- X-Powered-By Disclosure ---
    powered_by = headers.get("X-Powered-By")
    if powered_by:
        findings.append({
            "category": "Configuration",
            "severity": "Low",
            "title": "Technology Stack Disclosure",
            "description": f"X-Powered-By header found: {powered_by}. This reveals backend technology.",
            "recommendation": "Remove the X-Powered-By header from server responses.",
        })
        score -= 5

    # --- Dangerous HTTP Methods ---
    try:
        options_resp = httpx.options(url, timeout=10)
        allow = options_resp.headers.get("Allow", "")
        dangerous = ["TRACE", "DELETE", "PUT", "PATCH"]
        found_dangerous = [m for m in dangerous if m in allow.upper()]
        if found_dangerous:
            findings.append({
                "category": "Configuration",
                "severity": "Medium",
                "title": "Dangerous HTTP Methods Enabled",
                "description": f"The following potentially dangerous methods are allowed: {', '.join(found_dangerous)}",
                "recommendation": "Disable unnecessary HTTP methods. Only allow GET, POST, HEAD, OPTIONS as needed.",
            })
            score -= 10
    except Exception:
        pass  # OPTIONS request failed, not a finding

    # --- Directory Listing (heuristic) ---
    try:
        dir_resp = httpx.get(url.rstrip("/") + "/assets/", follow_redirects=True, timeout=10)
        body = dir_resp.text.lower()
        if "index of" in body or "directory listing" in body or "<pre>" in body and "parent directory" in body:
            findings.append({
                "category": "Configuration",
                "severity": "Medium",
                "title": "Directory Listing Enabled",
                "description": "The server appears to have directory listing enabled, exposing file structure.",
                "recommendation": "Disable directory listing in your web server configuration.",
            })
            score -= 10
    except Exception:
        pass

    # --- Mixed Content (HTTP resources on HTTPS page) ---
    if url.startswith("https://"):
        body = response.text
        if 'src="http://' in body or "src='http://" in body:
            findings.append({
                "category": "Configuration",
                "severity": "Medium",
                "title": "Mixed Content Detected",
                "description": "The HTTPS page loads resources over plain HTTP.",
                "recommendation": "Update all resource URLs to use HTTPS or protocol-relative URLs.",
            })
            score -= 10

    score = max(0, score)

    return {
        "module": "config",
        "url": url,
        "score": score,
        "findings_count": len(findings),
        "findings": findings,
    }


def main():
    if len(sys.argv) < 2:
        print("Uso: python config_checker.py <URL>")
        print("Ejemplo: python config_checker.py https://example.com")
        sys.exit(1)

    url = sys.argv[1]
    result = check_config(url)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
