import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Shield, ExternalLink, ArrowLeft } from "lucide-react";
import { scoreColor, severityColor, StatusBadge } from "../components/utils";

export default function ScanDetail() {
    const { id } = useParams();
    const { t } = useLanguage();
    const [scanDetails, setScanDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/scans/${id}`);
                if (res.ok) setScanDetails(await res.json());
            } catch (_) { }
            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return <div className="text-gray-400 text-sm text-center py-20">{t("loadingDetails")}</div>;
    }

    if (!scanDetails) {
        return <div className="text-gray-400 text-sm text-center py-20">{t("noScanSelected")}</div>;
    }

    return (
        <div className="bg-[#161b27] border border-white/5 rounded-xl p-6">
            <Link to="/" className="flex items-center gap-2 text-cyan-400 hover:underline text-sm mb-6">
                <ArrowLeft size={16} /> {t("dashboard") ?? "Dashboard"}
            </Link>

            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-2xl font-bold truncate">{scanDetails.target_url}</h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                        <StatusBadge status={scanDetails.status} />
                        <span>{t("date") ?? "Date"}: {new Date(scanDetails.created_at).toLocaleString()}</span>
                        <a href={scanDetails.target_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-400 hover:underline">
                            <ExternalLink size={12} /> {t("visit")}
                        </a>
                    </div>
                </div>
                <div className={`text-5xl font-bold ${scoreColor(scanDetails.score)}`}>
                    {scanDetails.score ?? "—"}
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">{t("findings")} ({scanDetails.findings_count})</h3>

            {!scanDetails.findings?.length ? (
                <div className="text-center py-10">
                    <Shield size={48} className="mx-auto text-green-500 mb-4" />
                    <p className="text-green-400 text-lg">{t("noSecurityIssues")}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {scanDetails.findings.map((f, i) => (
                        <div key={i} className="bg-[#0d1117] border border-white/5 rounded-lg p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase ${severityColor(f.severity)}`}>
                                        {f.severity}
                                    </span>
                                    <h4 className="font-semibold text-lg">{f.title}</h4>
                                </div>
                                <span className="text-xs py-1 px-2 rounded bg-white/5 text-gray-400 border border-white/10 uppercase">{f.category}</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{f.description}</p>
                            <div className="bg-[#161b27] border border-blue-500/20 rounded-lg p-3 mt-2">
                                <p className="text-sm text-blue-300">
                                    <strong className="text-blue-400">{t("recommendation")}: </strong>{f.recommendation}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
