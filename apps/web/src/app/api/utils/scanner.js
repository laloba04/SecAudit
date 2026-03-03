import sql from "@/app/api/utils/sql";

export async function performScan(scanId, url) {
  try {
    // 1. Update status to processing
    await sql`UPDATE scans SET status = 'processing' WHERE id = ${scanId}`;

    const findings = [];
    let score = 100;

    // Ensure URL has protocol
    let targetUrl = url;
    if (!targetUrl.startsWith("http")) {
      targetUrl = "https://" + targetUrl;
    }

    const startTime = Date.now();
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
    });
    const headers = response.headers;

    // --- Header Analysis ---
    const securityHeaders = [
      {
        name: "Strict-Transport-Security",
        title: "HSTS Not Enabled",
        severity: "Medium",
        rec: "Enable HSTS to force HTTPS connections.",
      },
      {
        name: "Content-Security-Policy",
        title: "CSP Missing",
        severity: "High",
        rec: "Implement a CSP to prevent XSS and data injection.",
      },
      {
        name: "X-Frame-Options",
        title: "Clickjacking Protection Missing",
        severity: "Medium",
        rec: "Set X-Frame-Options to DENY or SAMEORIGIN.",
      },
      {
        name: "X-Content-Type-Options",
        title: "MIME Sniffing Protection Missing",
        severity: "Low",
        rec: "Set X-Content-Type-Options to nosniff.",
      },
      {
        name: "Referrer-Policy",
        title: "Referrer Policy Missing",
        severity: "Low",
        rec: "Set a Referrer-Policy to control information sent in the Referer header.",
      },
    ];

    securityHeaders.forEach((sh) => {
      if (!headers.get(sh.name)) {
        findings.push({
          category: "Headers",
          severity: sh.severity,
          title: sh.title,
          description: `The ${sh.name} header was not found in the response.`,
          recommendation: sh.rec,
        });
        score -=
          sh.severity === "High" ? 15 : sh.severity === "Medium" ? 10 : 5;
      }
    });

    // --- SSL/TLS Check (Basic) ---
    if (!targetUrl.startsWith("https")) {
      findings.push({
        category: "SSL/TLS",
        severity: "Critical",
        title: "Unencrypted Connection",
        description: "The site is using plain HTTP.",
        recommendation:
          "Redirect all traffic to HTTPS and use a valid SSL certificate.",
      });
      score -= 40;
    }

    // --- Server Info ---
    const serverHeader = headers.get("Server");
    if (serverHeader) {
      findings.push({
        category: "Configuration",
        severity: "Low",
        title: "Server Information Leak",
        description: `Server header found: ${serverHeader}. This can reveal software versions.`,
        recommendation:
          "Configure your server to hide version strings in the Server header.",
      });
      score -= 5;
    }

    // --- Finish Scan ---
    score = Math.max(0, score);

    // Save findings
    if (findings.length > 0) {
      for (const f of findings) {
        await sql`
          INSERT INTO findings (scan_id, category, severity, title, description, recommendation)
          VALUES (${scanId}, ${f.category}, ${f.severity}, ${f.title}, ${f.description}, ${f.recommendation})
        `;
      }
    }

    await sql`
      UPDATE scans 
      SET status = 'completed', score = ${score}, findings_count = ${findings.length} 
      WHERE id = ${scanId}
    `;

    return { success: true, score, findingsCount: findings.length };
  } catch (error) {
    console.error("Scan failed:", error);
    await sql`UPDATE scans SET status = 'failed' WHERE id = ${scanId}`;
    return { success: false, error: error.message };
  }
}
