import { useLanguage } from "../i18n/LanguageContext";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { useState } from "react";

export default function Reports() {
    const { t } = useLanguage();

    const [reports, setReports] = useState([
        { id: 1, name: "Google Audit - Q1 2026", date: "2026-03-03", size: "1.2 MB" },
        { id: 2, name: "Juice Shop Sandbox Scan", date: "2026-03-01", size: "2.4 MB" },
        { id: 3, name: "DVWA Comprehensive", date: "2026-02-28", size: "3.1 MB" },
    ]);
    const [newTarget, setNewTarget] = useState("");
    const [generating, setGenerating] = useState(false);

    const generateFakePDF = (name) => {
        const docHtml = `
            <!DOCTYPE html>
            <html>
            <head><title>SecAudit Report - ${name}</title>
            <style>
                body { font-family: sans-serif; padding: 40px; color: #333; }
                h1 { color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
                .meta { color: #666; font-size: 0.9em; margin-bottom: 30px; }
                .finding { background: #f8f9fa; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 20px; }
            </style>
            </head>
            <body>
                <h1>Security Audit Report</h1>
                <div class="meta">Target: <strong>${name}</strong><br>Generated on: ${new Date().toLocaleString()}</div>
                <h2>Executive Summary</h2>
                <p>This report contains a summary of the passive security audit findings. (This is an auto-generated HTML export).</p>
                <div class="finding">
                    <h3>Missing Security Headers</h3>
                    <p><strong>Severity:</strong> Medium</p>
                    <p><strong>Recommendation:</strong> Ensure Strict-Transport-Security and Content-Security-Policy are properly configured.</p>
                </div>
            </body>
            </html>
        `;
        const blob = new Blob([docHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name.replace(/\s+/g, '_')}_Report.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGenerateNew = (e) => {
        e.preventDefault();
        if (!newTarget.trim()) return;
        setGenerating(true);
        setTimeout(() => {
            const reportName = `${newTarget} Audit`;
            const newReport = {
                id: Date.now(),
                name: reportName,
                date: new Date().toISOString().split('T')[0],
                size: "0.8 MB"
            };
            setReports([newReport, ...reports]);
            generateFakePDF(reportName);
            setNewTarget("");
            setGenerating(false);
        }, 1500);
    };

    return (
        <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-semibold">{t("reports")}</h2>
                    <p className="text-sm text-gray-400 mt-1">{t("reportsDesc")}</p>
                </div>
                <button className="flex items-center gap-2 bg-[#1e2433] border border-white/5 hover:bg-white/5 px-4 py-2 rounded-lg text-sm transition-colors">
                    <Filter size={16} className="text-cyan-400" /> {t("filter")}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reports.map((report) => (
                    <div key={report.id} className="bg-[#0d1117] border border-white/5 hover:border-cyan-500/30 rounded-xl p-5 transition-colors group cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                            <FileText size={20} className="text-cyan-400" />
                        </div>
                        <h3 className="font-semibold text-gray-200 truncate mb-1">{report.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {report.date}</span>
                            <span>{report.size}</span>
                        </div>
                        <button onClick={() => generateFakePDF(report.name)} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 py-2 rounded-lg transition-colors">
                            <Download size={14} /> {t("downloadReport")}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 rounded-xl border border-white/5 bg-[#0d1117] flex flex-col items-center">
                <FileText size={32} className="text-cyan-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-200 mb-1">{t("reportGenerator")}</h3>
                <p className="text-sm text-gray-400 mb-6 text-center max-w-md">{t("reportGeneratorDesc")}</p>

                <form onSubmit={handleGenerateNew} className="flex gap-3 w-full max-w-md">
                    <input
                        type="text"
                        value={newTarget}
                        onChange={(e) => setNewTarget(e.target.value)}
                        placeholder={t("reportPlaceholder")}
                        className="flex-1 bg-[#161b27] border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50"
                        required
                    />
                    <button
                        type="submit"
                        disabled={generating}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {generating ? t("generating") : t("createReport")}
                    </button>
                </form>
            </div>
        </div>
    );
}
