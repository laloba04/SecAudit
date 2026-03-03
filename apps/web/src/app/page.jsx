"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/utils/i18n/LanguageContext";
import {
  Shield,
  LayoutDashboard,
  History,
  FileText,
  AlertTriangle,
  Lock,
  Server,
  Settings,
  Search,
  Bell,
  Globe,
  ExternalLink,
  BarChart2,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "@/client-integrations/recharts";

const severityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case "critical": return "text-red-400 bg-red-400/10";
    case "high":     return "text-orange-400 bg-orange-400/10";
    case "medium":   return "text-yellow-400 bg-yellow-400/10";
    case "low":      return "text-blue-400 bg-blue-400/10";
    default:         return "text-gray-400 bg-gray-400/10";
  }
};

const scoreColor = (score) => {
  if (score == null) return "text-gray-400";
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
};

function IkurrinaFlag() {
  return (
    <svg width="20" height="14" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, display: "inline-block" }}>
      <rect width="30" height="20" fill="#D52B1E" />
      <line x1="0" y1="0" x2="30" y2="20" stroke="#007A33" strokeWidth="7" />
      <line x1="30" y1="0" x2="0" y2="20" stroke="#007A33" strokeWidth="7" />
      <rect x="12.5" y="0" width="5" height="20" fill="white" />
      <rect x="0" y="7.5" width="30" height="5" fill="white" />
    </svg>
  );
}

function StatusBadge({ status, t }) {
  const map = {
    completed:  { label: t("completed"),  cls: "text-green-400 bg-green-400/10" },
    processing: { label: t("processing"), cls: "text-yellow-400 bg-yellow-400/10" },
    failed:     { label: t("failed"),     cls: "text-red-400 bg-red-400/10" },
    pending:    { label: t("pending"),    cls: "text-blue-400 bg-blue-400/10" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "text-gray-400 bg-gray-400/10" };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

export default function Page() {
  const { language, setLanguage, t } = useLanguage();
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [scanDetails, setScanDetails] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const langMenuRef = useRef(null);

  useEffect(() => { fetchScans(); }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target))
        setShowLanguageMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchScans = async () => {
    setIsLoadingScans(true);
    try {
      const res = await fetch("/api/scans");
      if (res.ok) {
        const data = await res.json();
        setScans(Array.isArray(data) ? data : []);
      }
    } catch (_) {}
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
        await fetchScans();
      } else {
        setStatusMessage(t("scanFailed"));
      }
    } catch (_) {
      setStatusMessage(t("scanFailed"));
    }
    setIsScanning(false);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSelectScan = async (scan) => {
    setSelectedScan(scan);
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`/api/scans/${scan.id}`);
      if (res.ok) setScanDetails(await res.json());
    } catch (_) {}
    setIsLoadingDetails(false);
  };

  const filteredScans = scans.filter((s) =>
    s.target_url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = [...scans]
    .filter((s) => s.score != null && s.status === "completed")
    .slice(0, 10)
    .reverse()
    .map((s) => ({
      name: new Date(s.created_at).toLocaleDateString("es", { day: "2-digit", month: "2-digit" }),
      score: s.score,
    }));

  const langLabel = { en: "EN", es: "ES", eu: "EU" };
  const navItems = [
    { icon: LayoutDashboard, label: t("dashboard"), active: true },
    { icon: History,         label: t("scanHistory") },
    { icon: FileText,        label: t("reports") },
  ];
  const secItems = [
    { icon: AlertTriangle, label: t("vulnerabilities") },
    { icon: Lock,          label: t("sslMonitor") },
    { icon: Server,        label: t("infrastructure") },
    { icon: Settings,      label: t("settings") },
  ];

  return (
    <div className="flex h-screen bg-[#0d1117] text-white overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-52 flex-shrink-0 bg-[#161b27] flex flex-col border-r border-white/5">
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Shield size={18} className="text-cyan-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">SecAudit</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 mb-2">
            {t("mainMenu")}
          </p>
          {navItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-cyan-500/10 text-cyan-400 font-medium"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 mb-2 mt-5">
            {t("security")}
          </p>
          {secItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0d1117]">
          <h1 className="text-xl font-semibold">{t("vulnerabilityDashboard")}</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1e2433] border border-white/5 rounded-lg pl-8 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 w-52 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLanguageMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e2433] border border-white/5 text-sm text-gray-300 hover:border-cyan-500/30 transition-colors"
              >
                <Globe size={14} className="text-cyan-400" />
                <span>{langLabel[language]}</span>
                <ChevronDown size={12} className="text-gray-500" />
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-[#1e2433] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                  {[
                    { code: "en", label: "English", flag: "🇬🇧" },
                    { code: "es", label: "Español", flag: "🇪🇸" },
                    { code: "eu", label: "Euskara", flag: null },
                  ].map(({ code, label, flag }) => (
                    <button
                      key={code}
                      onClick={() => { setLanguage(code); setShowLanguageMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                        language === code ? "text-cyan-400" : "text-gray-300"
                      }`}
                    >
                      {flag ? <span>{flag}</span> : <IkurrinaFlag />}
                      <span>{label}</span>
                      {language === code && <span className="ml-auto">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="w-9 h-9 rounded-lg bg-[#1e2433] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Bell size={16} />
            </button>
            <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-sm select-none">
              S
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Scan form */}
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
                {isScanning ? (
                  <span>{t("scanning")}</span>
                ) : (
                  <>
                    <Plus size={16} />
                    {t("auditNow")}
                  </>
                )}
              </button>
            </div>
            {statusMessage && (
              <p className="text-sm text-cyan-400 mt-3">{statusMessage}</p>
            )}
          </div>

          {/* Chart + Details */}
          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-3 bg-[#161b27] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={16} className="text-cyan-400" />
                <h3 className="font-medium text-sm">{t("auditScoreTrend")}</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  {chartData.length > 0 && (
                    <Tooltip
                      contentStyle={{ background: "#1e2433", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                    />
                  )}
                  <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: "#06b6d4" }} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="col-span-2 bg-[#161b27] border border-white/5 rounded-xl p-5 flex flex-col min-h-[220px]">
              {!selectedScan ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                  <Shield size={40} className="text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-300 text-sm">{t("noScanSelected")}</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">{t("noScanSelectedDescription")}</p>
                  </div>
                </div>
              ) : isLoadingDetails ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">{t("loadingDetails")}</div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">{t("scanId")} #{scanDetails?.id}</p>
                      <p className="font-medium text-sm truncate">{scanDetails?.target_url}</p>
                    </div>
                    <div className={`text-2xl font-bold flex-shrink-0 ${scoreColor(scanDetails?.score)}`}>
                      {scanDetails?.score ?? "—"}
                    </div>
                  </div>
                  <a
                    href={scanDetails?.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:underline w-fit"
                  >
                    <ExternalLink size={12} />{t("visit")}
                  </a>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("findings")}</p>
                    {!scanDetails?.findings?.length ? (
                      <p className="text-xs text-green-400">{t("noSecurityIssues")}</p>
                    ) : (
                      scanDetails.findings.map((f, i) => (
                        <div key={i} className="bg-[#0d1117] rounded-lg p-3 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${severityColor(f.severity)}`}>
                              {f.severity?.toUpperCase()}
                            </span>
                            <span className="text-xs font-medium">{f.title}</span>
                          </div>
                          <p className="text-xs text-gray-400">{f.description}</p>
                          <p className="text-xs text-cyan-400/80">
                            <span className="font-medium">{t("recommendation")}: </span>{f.recommendation}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Audits Table */}
          <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="font-medium text-sm">{t("recentAudits")}</h3>
              <button className="text-xs text-cyan-400 hover:underline">{t("viewAll")}</button>
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
                ) : filteredScans.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500 text-xs">{t("noAuditsFound")}</td></tr>
                ) : (
                  filteredScans.map((scan) => (
                    <tr
                      key={scan.id}
                      onClick={() => handleSelectScan(scan)}
                      className={`border-b border-white/5 cursor-pointer hover:bg-white/[0.03] transition-colors ${
                        selectedScan?.id === scan.id ? "bg-cyan-500/5" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-gray-200 max-w-xs truncate">{scan.target_url}</td>
                      <td className="px-5 py-3"><StatusBadge status={scan.status} t={t} /></td>
                      <td className={`px-5 py-3 font-semibold ${scoreColor(scan.score)}`}>{scan.score ?? "—"}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelectScan(scan); }}
                          className="text-xs text-cyan-400 hover:underline"
                        >
                          {t("report")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
