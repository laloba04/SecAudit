import { useLanguage } from "../i18n/LanguageContext";
import { Save, Bell, Monitor, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function Preferences() {
    const { t } = useLanguage();
    const [theme, setTheme] = useState("dark");
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load prefs
        const prefs = JSON.parse(localStorage.getItem("secaudit_prefs") || "{}");
        if (prefs.theme) setTheme(prefs.theme);
        if (prefs.notifications !== undefined) setNotifications(prefs.notifications);
        if (prefs.emailAlerts !== undefined) setEmailAlerts(prefs.emailAlerts);
    }, []);

    const handleSave = () => {
        localStorage.setItem("secaudit_prefs", JSON.stringify({ theme, notifications, emailAlerts }));
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            window.location.reload(); // Reload to apply theme from App.js top level
        }, 600);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold mb-6">{t("preferences")}</h2>

            <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center gap-2">
                    <Monitor size={18} className="text-cyan-400" />
                    <h3 className="font-medium text-gray-200">{t("appearance")}</h3>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">{t("interfaceTheme")}</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setTheme("dark")}
                                className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-colors ${theme === "dark" ? "border-cyan-500 bg-cyan-500/5" : "border-white/10 bg-[#0d1117] hover:border-white/20"}`}
                            >
                                <div className="w-16 h-10 bg-[#0d1117] rounded shadow-inner border border-white/5 flex flex-col gap-1 p-1.5 no-invert">
                                    <div className="h-2 w-full bg-cyan-500/20 rounded-sm"></div>
                                    <div className="h-full w-full bg-white/5 rounded-sm"></div>
                                </div>
                                <span className="text-sm font-medium">{t("dark")}</span>
                            </button>
                            <button
                                onClick={() => setTheme("light")}
                                className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-colors ${theme === "light" ? "border-cyan-500 bg-cyan-500/5" : "border-white/10 bg-[#0d1117] hover:border-white/20"}`}
                            >
                                <div className="w-16 h-10 bg-white rounded shadow-inner border border-gray-200 flex flex-col gap-1 p-1.5 no-invert">
                                    <div className="h-2 w-full bg-cyan-500/20 rounded-sm"></div>
                                    <div className="h-full w-full bg-gray-100 rounded-sm"></div>
                                </div>
                                <span className="text-sm font-medium">{t("light")}</span>
                            </button>
                            <button
                                onClick={() => setTheme("system")}
                                className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-colors ${theme === "system" ? "border-cyan-500 bg-cyan-500/5" : "border-white/10 bg-[#0d1117] hover:border-white/20"}`}
                            >
                                <div className="w-16 h-10 flex rounded shadow-inner border border-white/10 overflow-hidden no-invert">
                                    <div className="w-1/2 h-full bg-white"></div>
                                    <div className="w-1/2 h-full bg-[#0d1117]"></div>
                                </div>
                                <span className="text-sm font-medium">{t("system")}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden mt-6">
                <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center gap-2">
                    <Bell size={18} className="text-cyan-400" />
                    <h3 className="font-medium text-gray-200">{t("notificationsAndAlerts")}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <label className="flex items-center justify-between p-4 bg-[#0d1117] border border-white/5 rounded-lg cursor-pointer hover:border-white/10 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-gray-200">{t("uiNotifications")}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{t("uiNotificationsDesc")}</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            className="w-5 h-5 rounded border-white/20 bg-[#161b27] text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-[#0d1117] border border-white/5 rounded-lg cursor-pointer hover:border-white/10 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-gray-200">{t("emailAlerts")}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{t("emailAlertsDesc")}</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={emailAlerts}
                            onChange={(e) => setEmailAlerts(e.target.checked)}
                            className="w-5 h-5 rounded border-white/20 bg-[#161b27] text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                    </label>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
                >
                    {saved ? <><Check size={16} /> {t("savedOk")}</> : <><Save size={16} /> {t("saveChanges")}</>}
                </button>
            </div>
        </div>
    );
}
