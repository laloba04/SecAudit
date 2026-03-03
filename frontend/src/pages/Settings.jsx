import { useLanguage } from "../i18n/LanguageContext";
import { Settings as SettingsIcon, Save, Key, Globe, Database, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function Settings() {
    const { t } = useLanguage();
    const [timeout, setTimeoutVal] = useState(15);
    const [depth, setDepth] = useState("Fast (Passive Headers + SSL)");
    const [saved, setSaved] = useState(false);
    const [dbSize, setDbSize] = useState("12 KB");

    useEffect(() => {
        const prefs = JSON.parse(localStorage.getItem("secaudit_engine_settings") || "{}");
        if (prefs.timeout) setTimeoutVal(prefs.timeout);
        if (prefs.depth) setDepth(prefs.depth);
    }, []);

    const handleSave = () => {
        localStorage.setItem("secaudit_engine_settings", JSON.stringify({ timeout, depth }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handlePurge = () => {
        if (window.confirm("¿Seguro que deseas purgar la base de datos de historiales? Se eliminarán todos los escaneos previos.")) {
            // Mock purge
            fetch("/api/dev/db", { method: "DELETE" }).catch(() => { });
            setDbSize("0 KB");
            alert("Historial limpiado.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold mb-6">{t("settings") ?? "Configuración"}</h2>

            {/* General */}
            <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center gap-2">
                    <Globe size={18} className="text-gray-400" />
                    <h3 className="font-medium text-gray-200">General</h3>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">{t("scanTimeout") ?? "Timeout de Escaneo (segundos)"}</label>
                        <input
                            type="number"
                            value={timeout}
                            onChange={(e) => setTimeoutVal(e.target.value)}
                            className="w-full max-w-xs bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">{t("scannerDepth") ?? "Profundidad del Scanner Python"}</label>
                        <select
                            value={depth}
                            onChange={(e) => setDepth(e.target.value)}
                            className="w-full max-w-xs bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                        >
                            <option value="Fast (Passive Headers + SSL)">{t("depthFast") ?? "Rápido (Passive Headers + SSL)"}</option>
                            <option value="Standard (Fast + Config Detection)">{t("depthStandard") ?? "Estándar (Rápido + Detección Config)"}</option>
                            <option value="Full (Add CVEs from OSV.dev)">{t("depthFull") ?? "Completo (Añadir CVEs de OSV.dev)"}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Base de datos */}
            <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center gap-2">
                    <Database size={18} className="text-gray-400" />
                    <h3 className="font-medium text-gray-200">{t("sqliteDb") ?? "Base de Datos SQLite"}</h3>
                </div>
                <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between p-4 bg-[#0d1117] border border-white/5 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-200">{t("dbSize") ?? "Tamaño de la BD"}</p>
                            <p className="text-xs text-gray-500">./secaudit.db</p>
                        </div>
                        <span className="text-sm font-mono text-cyan-400">{dbSize}</span>
                    </div>
                    <button onClick={handlePurge} className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">{t("purgeHistory") ?? "Purgar todos los historiales"}</button>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
                >
                    {saved ? <><Check size={16} /> ¡Guardado!</> : <><Save size={16} /> {t("saveChanges") ?? "Guardar Cambios"}</>}
                </button>
            </div>
        </div>
    );
}
