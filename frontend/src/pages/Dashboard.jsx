import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { Shield, Plus, BarChart2, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { scoreColor, severityColor, StatusBadge } from "../components/utils";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { t } = useLanguage();
    const [scans, setScans] = useState([]);
    const [urlInput, setUrlInput] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isLoadingScans, setIsLoadingScans] = useState(true);
    const [statusMessage, setStatusMessage] = useState(null);

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

    const handleAuditNow = async () => {
        if (!urlInput.trim() || isScanning) return;
        setIsScanning(true);
        setStatusMessage(t("startingAudit"));
        try {
            const res = await fetch("/api/scans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: urlInput.trim() }),
            });
            if (res.ok) {
                setStatusMessage(t("scanCompleted"));
                setUrlInput("");
                setTimeout(() => fetchScans(), 3000);
                setTimeout(() => fetchScans(), 8000);
                setTimeout(() => fetchScans(), 15000);
            } else {
                setStatusMessage(t("scanFailed"));
            }
        } catch (_) {
            setStatusMessage(t("scanFailed"));
        }
        setIsScanning(false);
        setTimeout(() => setStatusMessage(null), 5000);
    };

    const chartData = [...scans]
        .filter((s) => s.score != null && s.status === "completed")
        .slice(0, 10).reverse()
        .map((s) => ({
            name: new Date(s.created_at).toLocaleDateString("es", { day: "2-digit", month: "2-digit" }),
            score: s.score,
        }));

    return (
        <>
            <div className="bg-[#161b27] border border-white/5 rounded-xl p-6 text-center">
                <h2 className="text-lg font-semibold mb-1">{t("performSecurityAudit")}</h2>
                <p className="text-sm text-gray-400 mb-4">{t("auditDescription")}</p>
                <div className="flex gap-3 max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder={t("enterWebsiteUrl")}
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAuditNow()}
                        className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                        onClick={handleAuditNow}
                        disabled={isScanning || !urlInput.trim()}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                    >
                        {isScanning ? <span>{t("scanning")}</span> : <><Plus size={16} />{t("auditNow")}</>}
                    </button>
                </div>
                {statusMessage && <p className="text-sm text-cyan-400 mt-3">{statusMessage}</p>}
            </div>

            <div className="bg-[#161b27] border border-white/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart2 size={16} className="text-cyan-400" />
                    <h3 className="font-medium text-sm">{t("auditScoreTrend")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        {chartData.length > 0 && <Tooltip contentStyle={{ background: "#1e2433", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />}
                        <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: "#06b6d4" }} connectNulls={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <h3 className="font-medium text-sm">{t("recentAudits")}</h3>
                    <Link to="/history" className="text-xs text-cyan-400 hover:underline">{t("viewAll")}</Link>
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
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500 text-xs">{t("loadingAudits")}</td></tr>
                        ) : scans.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500 text-xs">{t("noAuditsFound")}</td></tr>
                        ) : (
                            scans.slice(0, 5).map((scan) => (
                                <tr key={scan.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                    <td className="px-5 py-3 text-gray-200 max-w-xs truncate">{scan.target_url}</td>
                                    <td className="px-5 py-3"><StatusBadge status={scan.status} /></td>
                                    <td className={`px-5 py-3 font-semibold ${scoreColor(scan.score)}`}>{scan.score ?? "—"}</td>
                                    <td className="px-5 py-3 text-gray-400 text-xs">
                                        {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-5 py-3">
                                        <Link to={`/scan/${scan.id}`} className="text-xs text-cyan-400 hover:underline">{t("report")}</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
