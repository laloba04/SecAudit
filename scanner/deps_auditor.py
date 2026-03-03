import httpx
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import re

def check_dependencies(url):
    """
    Analiza las etiquetas <script> y <link> de la página principal
    buscando versiones expuestas de librerías comunes (jQuery, React, Vue, Bootstrap, etc.)
    y simula una comprobación de CVEs.
    """
    findings = []
    score_deduction = 0

    try:
        response = httpx.get(url, follow_redirects=True, timeout=15)
        soup = BeautifulSoup(response.text, "html.parser")
    except Exception as e:
        return {"error": str(e), "score": 0, "findings": [], "module": "deps", "findings_count": 0}

    # Patrones comunes de archivos o URLs que exponen la versión
    patterns = {
        "jQuery": re.compile(r'jquery[.-]([0-9]+\.[0-9]+\.[0-9]+)\.min\.js', re.IGNORECASE),
        "Bootstrap": re.compile(r'bootstrap[.-]([0-9]+\.[0-9]+\.[0-9]+)\.min\.(js|css)', re.IGNORECASE),
        "React": re.compile(r'react[.-]([0-9]+\.[0-9]+\.[0-9]+)\.production\.min\.js', re.IGNORECASE),
        "Vue": re.compile(r'vue[.-]([0-9]+\.[0-9]+\.[0-9]+)\.min\.js', re.IGNORECASE),
        "Angular": re.compile(r'angular[.-]([0-9]+\.[0-9]+\.[0-9]+)\.min\.js', re.IGNORECASE)
    }

    # Recopilar todos los src de scripts y href de links
    sources = []
    for script in soup.find_all('script'):
        if script.get('src'):
            sources.append(script.get('src'))
    
    for link in soup.find_all('link', rel='stylesheet'):
        if link.get('href'):
            sources.append(link.get('href'))

    detected_libs = {}

    # Analizar fuentes buscando versiones
    for src in sources:
        for lib, pattern in patterns.items():
            match = pattern.search(src)
            if match:
                version = match.group(1)
                detected_libs[lib] = version

    # Por ahora, alertar siempre que se detecta una versión en el frontend 
    # (information disclosure) ya que facilita el reconocimiento a un atacante
    for lib, version in detected_libs.items():
        findings.append({
            "category": "Dependency",
            "severity": "Low",
            "title": f"Exposed {lib} Version",
            "description": f"The application exposes the version of {lib} ({version}) in the frontend source code.",
            "recommendation": "Bundle and minify your assets using tools like Webpack or Vite to abstract away library versions."
        })
        score_deduction += 5

        # Simular vulnerabilidades graves para versiones viejas conocidas
        if lib == "jQuery" and version.startswith("1."):
            findings.append({
                "category": "CVE",
                "severity": "High",
                "title": f"Outdated {lib} Version ({version})",
                "description": f"{lib} {version} is known to have multiple Cross-Site Scripting (XSS) vulnerabilities.",
                "recommendation": "Upgrade to the latest secure version (3.x.x)."
            })
            score_deduction += 20

    final_score = max(0, 100 - score_deduction)

    return {
        "module": "deps",
        "score": final_score,
        "findings": findings,
        "findings_count": len(findings)
    }
