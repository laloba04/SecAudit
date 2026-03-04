import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { Lock, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

export default function SSLMonitor() {
    const { t } = useLanguage();
    const [sslData, setSSLData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/stats/ssl")
            .then(r => r.json())
            .then(d => { setSSLData(d || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const statusConfig = {
        valid: { icon: ShieldCheck, label: t("valid") ?? "Válido", cls: "text-green-400 bg-green-400/10" },
        warning: { icon: AlertTriangle, label: t("warning") ?? "Revisar", cls: "text-yellow-400 bg-yellow-400/10" },
        expired: { icon: XCircle, label: t("expired") ?? "Problema", cls: "text-red-400 bg-red-400/10" },
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-[#161b27] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Lock size={20} className="text-cyan-400" />
                    <div>
                        <h1 className="text-lg font-bold">{t("sslMonitor")}</h1>
                        <p className="text-sm text-gray-400">{t("sslDesc") ?? "Estado SSL/TLS de los dominios escaneados."}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">{t("loading") ?? "Cargando..."}</div>
                ) : sslData.length === 0 ? (
                    <div className="text-center py-10">
                        <ShieldCheck size={40} className="mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-400">{t("noSSLData") ?? "No hay datos SSL todavía."}</p>
                        <p className="text-sm text-gray-500 mt-1">{t("scanToSeeSSL") ?? "Realiza un escaneo desde el Panel para ver el estado SSL aquí."}</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-[11px] uppercase">
                                <th className="px-4 py-3 text-left">{t("domain") ?? "Dominio"}</th>
                                <th className="px-4 py-3 text-left">{t("sslFinding") ?? "Resultado SSL"}</th>
                                <th className="px-4 py-3 text-left">{t("scannedAt") ?? "Escaneado"}</th>
                                <th className="px-4 py-3 text-left">{t("status") ?? "Estado"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sslData.map((item, i) => {
                                const cfg = statusConfig[item.status] || statusConfig.valid;
                                const Icon = cfg.icon;
                                return (
                                    <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02]">
                                        <td className="px-4 py-3 font-medium">{item.domain}</td>
                                        <td className="px-4 py-3 text-gray-400">
                                            {item.finding || `✅ ${t("noSSLIssuesDetected")}`}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(item.scanned_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                                                <Icon size={12} /> {cfg.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
