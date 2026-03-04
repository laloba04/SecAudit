import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { AlertTriangle, Shield, Bug, Lock } from "lucide-react";
import { severityColor } from "../components/utils";

export default function Vulnerabilities() {
    const { t } = useLanguage();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/stats/vulnerabilities")
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const counts = data?.counts || { Critical: 0, High: 0, Medium: 0, Low: 0 };
    const findings = data?.findings || [];
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const categories = [
        { key: "Critical", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10" },
        { key: "High", icon: Shield, color: "text-orange-400", bg: "bg-orange-400/10" },
        { key: "Medium", icon: Bug, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { key: "Low", icon: Lock, color: "text-blue-400", bg: "bg-blue-400/10" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-xl font-bold">{t("vulnerabilities")}</h1>
                <p className="text-sm text-gray-400 mt-1">{t("vulnDesc") ?? "Resumen de vulnerabilidades detectadas en todos los escaneos."}</p>
            </div>

            {/* Severity counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(({ key, icon: Icon, color, bg }) => (
                    <div key={key} className="bg-[#161b27] border border-white/5 rounded-xl p-5 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                            <Icon size={20} className={color} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${color}`}>{loading ? "—" : counts[key]}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{t(key.toLowerCase()) || key}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="bg-[#161b27] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">{t("totalFindings") ?? "Total de hallazgos detectados"}</span>
                <span className="text-xl font-bold text-cyan-400">{loading ? "—" : total}</span>
            </div>

            {/* Top findings table */}
            {findings.length > 0 && (
                <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-sm font-semibold">{t("topVulnerabilities") ?? "Vulnerabilidades más frecuentes"}</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-[11px] uppercase">
                                <th className="px-4 py-3 text-left">{t("finding") ?? "Hallazgo"}</th>
                                <th className="px-4 py-3 text-left">{t("category") ?? "Categoría"}</th>
                                <th className="px-4 py-3 text-left">{t("severity") ?? "Severidad"}</th>
                                <th className="px-4 py-3 text-right">{t("occurrences") ?? "Ocurrencias"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {findings.map((f, i) => {
                                const catalog = t("vulnCatalog") || {};
                                const localized = catalog[f.title] || {};

                                // Mapping raw backend strings to translation keys
                                const sevKey = (f.severity || "low").toLowerCase();
                                const catMapping = {
                                    "Headers": "catHeaders",
                                    "SSL/TLS": "catSSL",
                                    "Configuration": "catConfig",
                                    "Dependency": "catDeps",
                                    "CVE": "catDeps",
                                    "AI Inference": "catAI"
                                };
                                const catKey = catMapping[f.category] || f.category;

                                return (
                                    <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02]">
                                        <td className="px-4 py-3 font-medium">{localized.title || f.title}</td>
                                        <td className="px-4 py-3 text-gray-400">{t(catKey) || f.category}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityColor(f.severity)}`}>
                                                {t(sevKey) || f.severity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-cyan-400">{f.occurrences}×</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && total === 0 && (
                <div className="bg-[#161b27] border border-white/5 rounded-xl p-10 text-center">
                    <Shield size={40} className="mx-auto text-green-400 mb-3" />
                    <p className="text-green-400 font-semibold">{t("noVulnerabilities") ?? "¡Sin vulnerabilidades!"}</p>
                    <p className="text-sm text-gray-500 mt-1">{t("scanToSeeVulns") ?? "Realiza un escaneo desde el Panel para ver resultados aquí."}</p>
                </div>
            )}
        </div>
    );
}
