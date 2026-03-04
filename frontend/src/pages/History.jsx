import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { scoreColor, StatusBadge } from "../components/utils";
import { Search } from "lucide-react";

export default function History() {
    const { t, language } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const [scans, setScans] = useState([]);
    const [isLoadingScans, setIsLoadingScans] = useState(true);

    // Initialize search query from URL parameter 'q'
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

    useEffect(() => {
        // Update URL when search query changes
        if (searchQuery) {
            setSearchParams({ q: searchQuery });
        } else {
            setSearchParams({});
        }
    }, [searchQuery, setSearchParams]);

    // Also update internal state if URL changes externally (e.g. from Header)
    useEffect(() => {
        const q = searchParams.get("q") || "";
        setSearchQuery(q);
    }, [searchParams]);

    useEffect(() => { fetchScans(); }, []);

    const fetchScans = async () => {
        setIsLoadingScans(true);
        try {
            const res = await fetch("/api/scans");
            if (res.ok) {
                const data = await res.json();
                setScans(Array.isArray(data) ? data : []);
            }
        } catch (_) { }
        setIsLoadingScans(false);
    };

    const filteredScans = scans.filter((s) =>
        s.target_url?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">{t("scanHistory")}</h2>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#0d1117] border border-white/5 rounded-lg pl-8 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 w-64 focus:outline-none focus:border-cyan-500/50"
                    />
                </div>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="text-xs text-gray-500 border-b border-white/5">
                        <th className="text-left px-5 py-3 font-medium">{t("targetUrl")}</th>
                        <th className="text-left px-5 py-3 font-medium">{t("status")}</th>
                        <th className="text-left px-5 py-3 font-medium">{t("score")}</th>
                        <th className="text-left px-5 py-3 font-medium">{t("date")}</th>
                        <th className="text-left px-5 py-3 font-medium">{t("action")}</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoadingScans ? (
                        <tr><td colSpan={5} className="text-center py-10 text-gray-500 text-sm">{t("loadingAudits")}</td></tr>
                    ) : filteredScans.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-10 text-gray-500 text-sm">{t("noAuditsFound")}</td></tr>
                    ) : (
                        filteredScans.map((scan) => (
                            <tr key={scan.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                <td className="px-5 py-4 text-gray-200 max-w-sm truncate font-medium">{scan.target_url}</td>
                                <td className="px-5 py-4"><StatusBadge status={scan.status} /></td>
                                <td className={`px-5 py-4 font-bold ${scoreColor(scan.score)}`}>{scan.score ?? "—"}</td>
                                <td className="px-5 py-4 text-gray-400 text-sm">
                                    {scan.created_at ? new Date(scan.created_at).toLocaleString(language) : "—"}
                                </td>
                                <td className="px-5 py-4">
                                    <Link to={`/scan/${scan.id}`} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                        {t("viewDetails") || "Ver Detalles"} →
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
