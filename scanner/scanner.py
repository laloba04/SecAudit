"""
SecAudit — Scanner principal (orquestador)
Uso: python scanner.py <URL> [--json]

Ejecuta todos los módulos de análisis y genera un resultado unificado.
Diseñado para ser llamado desde la API Go via subprocess.
"""

import json
import sys
import time

from headers_scanner import analyze_headers
from ssl_scanner import analyze_ssl
from config_checker import check_config
from deps_auditor import check_dependencies


def run_all_scans(url: str) -> dict:
    """
    Ejecuta todos los módulos de análisis (headers, ssl, config, deps).
    Calcula un score global ponderado.
    """
    if not url.startswith("http"):
        url = "https://" + url

    start = time.time()

    # Ejecutar módulos (simulando threading/paralelismo para el futuro)
    headers_result = analyze_headers(url)
    ssl_result = analyze_ssl(url)
    config_result = check_config(url)
    deps_result = check_dependencies(url)

    modules = [headers_result, ssl_result, config_result, deps_result]
    
    global_score = 0
    total_weight = 0
    all_findings = []
    scores_breakdown = {}

    # Ponderaciones
    weights = {
        "headers": 0.3,
        "ssl": 0.3,
        "config": 0.2,
        "deps": 0.2
    }

    modules_run_names = []

    for mod in modules:
        if mod.get("error"):
            # Si un módulo falla enteramente (ej: timeout al chequear configuraciones oscuras), 
            # lo ignoramos del score total para no arruinar el escaneo de otros.
            if mod.get("module") == "headers" and "Could not connect" in mod.get("error", ""):
                # Falla crítica (host down), salir rápido
                return {
                    "url": url,
                    "score": 0,
                    "scores": {},
                    "severity_counts": {"Critical": 0, "High": 0, "Medium": 0, "Low": 0},
                    "findings_count": 0,
                    "modules_run": [],
                    "findings": [],
                    "elapsed_seconds": round(time.time() - start, 2),
                    "error": mod.get("error")
                }
            continue

        mod_name = mod["module"]
        modules_run_names.append(mod_name)
        weight = weights.get(mod_name, 0)
        
        module_score = mod.get("score", 0)
        global_score += module_score * weight
        total_weight += weight
        scores_breakdown[mod_name] = module_score
        
        all_findings.extend(mod.get("findings", []))

    # Normalizar score si algún módulo no pudo correr
    final_score = int(global_score / total_weight) if total_weight > 0 else 0

    # Contar severidades
    severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    for f in all_findings:
        sev = f.get("severity", "Low")
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

    elapsed = round(time.time() - start, 2)

    return {
        "url": url,
        "score": final_score,
        "scores": scores_breakdown,
        "severity_counts": severity_counts,
        "findings_count": len(all_findings),
        "findings": all_findings,
        "modules_run": modules_run_names,
        "elapsed_seconds": elapsed,
    }


def main():
    if len(sys.argv) < 2:
        print("Uso: python scanner.py <URL>")
        print("Ejemplo: python scanner.py https://example.com")
        sys.exit(1)

    url = sys.argv[1]
    result = run_all_scans(url)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
