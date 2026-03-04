"""
SecAudit — Generador de Reportes PDF + HTML
Uso: python report_generator.py <scan_result.json> [--format pdf|html]

Genera reportes de auditoría profesionales usando Jinja2 + WeasyPrint.
"""

import json
import sys
import os
from datetime import datetime

try:
    from jinja2 import Environment, FileSystemLoader
except ImportError:
    print("⚠️  Jinja2 no instalado. Ejecuta: pip install jinja2")
    sys.exit(1)

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")


def severity_color(severity: str) -> str:
    """Devuelve el color CSS correspondiente a la severidad."""
    colors = {
        "Critical": "#ef4444",
        "High": "#f97316",
        "Medium": "#eab308",
        "Low": "#3b82f6",
    }
    return colors.get(severity, "#6b7280")


def severity_bg(severity: str) -> str:
    """Devuelve el color de fondo CSS correspondiente a la severidad."""
    colors = {
        "Critical": "#fef2f2",
        "High": "#fff7ed",
        "Medium": "#fefce8",
        "Low": "#eff6ff",
    }
    return colors.get(severity, "#f9fafb")


def score_color(score: int) -> str:
    """Devuelve el color CSS correspondiente al score."""
    if score >= 80:
        return "#22c55e"
    if score >= 50:
        return "#eab308"
    return "#ef4444"


def score_label(score: int) -> str:
    """Devuelve una etiqueta textual para el score."""
    if score >= 90:
        return "Excellent"
    if score >= 80:
        return "Good"
    if score >= 60:
        return "Fair"
    if score >= 40:
        return "Poor"
    return "Critical"


def generate_html_report(scan_data: dict, output_path: str = None) -> str:
    """
    Genera un reporte HTML a partir de los datos de un escaneo.
    
    Args:
        scan_data: Diccionario con los resultados del scan (output de scanner.py)
        output_path: Ruta donde guardar el HTML. Si None, solo retorna el string.
    
    Returns:
        String con el contenido HTML del reporte.
    """
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template("report.html")

    # Agrupar findings por categoría
    findings_by_category = {}
    for f in scan_data.get("findings", []):
        cat = f.get("category", "Other")
        if cat not in findings_by_category:
            findings_by_category[cat] = []
        findings_by_category[cat].append(f)

    # Ordenar findings por severidad dentro de cada categoría
    severity_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    for cat in findings_by_category:
        findings_by_category[cat].sort(
            key=lambda f: severity_order.get(f.get("severity", "Low"), 4)
        )

    context = {
        "url": scan_data.get("url", "Unknown"),
        "score": scan_data.get("score", 0),
        "score_color": score_color(scan_data.get("score", 0)),
        "score_label": score_label(scan_data.get("score", 0)),
        "severity_counts": scan_data.get("severity_counts", {}),
        "findings_count": scan_data.get("findings_count", 0),
        "findings": scan_data.get("findings", []),
        "findings_by_category": findings_by_category,
        "modules_run": scan_data.get("modules_run", []),
        "scores": scan_data.get("scores", {}),
        "elapsed_seconds": scan_data.get("elapsed_seconds", 0),
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "severity_color": severity_color,
        "severity_bg": severity_bg,
    }

    html = template.render(**context)

    if output_path:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"📄 Reporte HTML generado: {output_path}")

    return html


def generate_pdf_report(scan_data: dict, output_path: str) -> None:
    """
    Genera un reporte PDF a partir de los datos de un escaneo.
    Requiere WeasyPrint instalado.
    """
    try:
        from weasyprint import HTML
    except ImportError:
        print("⚠️  WeasyPrint no instalado. Ejecuta: pip install weasyprint")
        print("   Generando versión HTML en su lugar...")
        html_path = output_path.replace(".pdf", ".html")
        generate_html_report(scan_data, html_path)
        return

    html_content = generate_html_report(scan_data)
    HTML(string=html_content).write_pdf(output_path)
    print(f"📄 Reporte PDF generado: {output_path}")


def main():
    if len(sys.argv) < 2:
        print("Uso: python report_generator.py <scan_result.json> [--format pdf|html]")
        print("Ejemplo: python report_generator.py result.json --format html")
        sys.exit(1)

    json_path = sys.argv[1]
    report_format = "html"

    if "--format" in sys.argv:
        idx = sys.argv.index("--format")
        if idx + 1 < len(sys.argv):
            report_format = sys.argv[idx + 1].lower()

    with open(json_path, "r", encoding="utf-8") as f:
        scan_data = json.load(f)

    url_slug = scan_data.get("url", "unknown").replace("https://", "").replace("http://", "").replace("/", "_").replace(":", "_")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    if report_format == "pdf":
        output_path = f"SecAudit_Report_{url_slug}_{timestamp}.pdf"
        generate_pdf_report(scan_data, output_path)
    else:
        output_path = f"SecAudit_Report_{url_slug}_{timestamp}.html"
        generate_html_report(scan_data, output_path)


if __name__ == "__main__":
    main()
