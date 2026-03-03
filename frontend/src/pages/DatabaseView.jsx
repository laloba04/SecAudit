import { useState, useEffect } from "react";
import { Database, Table, RefreshCw } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function DatabaseView() {
    const { t } = useLanguage();
    const [dbData, setDbData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTable, setActiveTable] = useState("scans");

    const fetchDb = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/dev/db");
            if (res.ok) setDbData(await res.json());
        } catch (_) { }
        setLoading(false);
    };

    useEffect(() => {
        fetchDb();
    }, []);

    const formatValue = (val) => {
        if (val === null) return <span className="text-gray-500 italic">null</span>;
        if (typeof val === "object") return JSON.stringify(val);
        return String(val);
    };

    return (
        <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden p-6 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Database size={20} className="text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{t("dbInspector")}</h2>
                        <p className="text-sm text-gray-400 mt-1">{t("dbViewDesc")}</p>
                    </div>
                </div>
                <button onClick={fetchDb} className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-sm transition-colors text-gray-300">
                    <RefreshCw size={14} className={loading ? "animate-spin text-cyan-400" : ""} /> {t("refresh")}
                </button>
            </div>

            {loading && !dbData ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">{t("queryingDb")}</div>
            ) : dbData ? (
                <>
                    <div className="flex gap-2 mb-4">
                        {dbData.tables.map(tbl => (
                            <button
                                key={tbl}
                                onClick={() => setActiveTable(tbl)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTable === tbl ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent"}`}
                            >
                                <Table size={14} /> {t("table")} {tbl}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-auto border border-white/5 rounded-lg bg-[#0d1117]">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#1e2433] sticky top-0 border-b border-white/10 z-10">
                                <tr>
                                    {dbData[activeTable]?.length > 0 ? (
                                        Object.keys(dbData[activeTable][0]).map(k => (
                                            <th key={k} className="px-4 py-3 font-semibold text-gray-300">{k}</th>
                                        ))
                                    ) : (
                                        <th className="px-4 py-3">{t("noData")}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {dbData[activeTable]?.length > 0 ? (
                                    dbData[activeTable].map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} className="px-4 py-3 text-gray-400 truncate max-w-xs">{formatValue(val)}</td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-gray-500 italic">{t("emptyTable")}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-red-400">{t("dbError")}</div>
            )}
        </div>
    );
}
