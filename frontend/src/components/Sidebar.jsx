import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Shield, LayoutDashboard, History, FileText, AlertTriangle, Lock, Server, Settings, Database, Settings as SettingsIcon } from "lucide-react";

export default function Sidebar() {
    const { t } = useLanguage();

    const navItems = [
        { icon: LayoutDashboard, label: t("dashboard"), path: "/" },
        { icon: History, label: t("scanHistory"), path: "/history" },
        { icon: FileText, label: t("reports"), path: "/reports" },
    ];
    const secItems = [
        { icon: AlertTriangle, label: t("vulnerabilities") ?? "Vulnerabilidades", path: "/vulnerabilities" },
        { icon: Lock, label: t("sslMonitor") ?? "Monitor SSL", path: "/ssl" },
        { icon: Server, label: t("infrastructure") ?? "Infraestructura", path: "/infra" },
        { icon: Database, label: t("dbViewer") ?? "Visor SQLite", path: "/db" },
    ];

    return (
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
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={label}
                        to={path}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-cyan-500/10 text-cyan-400 font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={16} />
                                <span>{label}</span>
                                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                            </>
                        )}
                    </NavLink>
                ))}
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 mb-2 mt-5">
                    {t("security")}
                </p>
                {secItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={label}
                        to={path}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-cyan-500/10 text-cyan-400 font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        <Icon size={16} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
