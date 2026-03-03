import { useLanguage } from "../i18n/LanguageContext";
import { Lock, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

export default function SSLMonitor() {
    const { t } = useLanguage();

    const certs = [
        { domain: "google.com", issuer: "GTS CA 1C3", expires: "2026-05-20", status: "valid", days: 78 },
        { domain: "bkimminich/juice-shop", issuer: "Self-Signed", expires: "2025-10-10", status: "warning", days: 0 },
        { domain: "expired.badssl.com", issuer: "DigiCert", expires: "2015-04-09", status: "expired", days: -3900 },
    ];

    const getStatusUI = (status) => {
        if (status === "valid") return { icon: CheckCircle2, cls: "text-green-400 bg-green-400/10", label: t("validSsl") };
        if (status === "warning") return { icon: Clock, cls: "text-yellow-400 bg-yellow-400/10", label: t("warningSsl") };
        return { icon: ShieldAlert, cls: "text-red-400 bg-red-400/10", label: t("expiredSsl") };
    };

    return (
        <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Lock size={20} className="text-cyan-400" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{t("sslMonitor")}</h2>
                    <p className="text-sm text-gray-400 mt-1">{t("sslMonitorDesc")}</p>
                </div>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="text-xs text-gray-500 border-b border-white/5">
                        <th className="text-left px-5 py-3 font-medium">{t("domain")}</th>
                        <th className="text-left px-5 py-3 font-medium">{t("certificateAuthority")}</th>
                        <th className="text-left px-5 py-3 font-medium">{t("expiration")}</th>
                        <th className="text-left px-5 py-3 font-medium">{t("status")}</th>
                    </tr>
                </thead>
                <tbody>
                    {certs.map((cert, i) => {
                        const ui = getStatusUI(cert.status);
                        return (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                <td className="px-5 py-4 text-gray-200 font-medium">{cert.domain}</td>
                                <td className="px-5 py-4 text-gray-400">{cert.issuer}</td>
                                <td className="px-5 py-4 text-gray-400">
                                    {cert.expires} {cert.days > 0 && <span className="opacity-50">(-{cert.days}d)</span>}
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${ui.cls}`}>
                                        <ui.icon size={12} /> {ui.label}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
