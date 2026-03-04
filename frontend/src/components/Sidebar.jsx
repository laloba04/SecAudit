import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Shield, LayoutDashboard, History, FileText, AlertTriangle, Lock, Server, Settings, Database, Sliders } from "lucide-react";

export default function Sidebar() {
    const { t } = useLanguage();

    const navItems = [
        { icon: LayoutDashboard, label: t("dashboard"), path: "/" },
        { icon: History, label: t("scanHistory"), path: "/history" },
        { icon: FileText, label: t("reports"), path: "/reports" },
    ];
    const secItems = [
        { icon: AlertTriangle, label: t("vulnerabilities"), path: "/vulnerabilities" },
        { icon: Lock, label: t("sslMonitor"), path: "/ssl" },
        { icon: Server, label: t("infrastructure"), path: "/infra" },
        { icon: Database, label: t("dbViewer"), path: "/db" },
    ];
    const configItems = [
        { icon: Settings, label: t("settings"), path: "/settings" },
        { icon: Sliders, label: t("preferences"), path: "/preferences" },
    ];

    const renderNavGroup = (items, showActiveDot = false) =>
        items.map(({ icon: Icon, label, path }) => (
            <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                    `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-cyan-500/10 text-cyan-400 font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`
                }
            >
                {showActiveDot ? (({ isActive }) => (
                    <>
                        <Icon size={16} />
                        <span>{label}</span>
                        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </>
                )) : (
                    <>
                        <Icon size={16} />
                        <span>{label}</span>
                    </>
                )}
            </NavLink>
        ));

    return (
        <aside className="w-52 flex-shrink-0 bg-[#161b27] flex flex-col border-r border-white/5">
            <div className="flex items-center gap-2 px-4 py-5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Shield size={18} className="text-cyan-400" />
                </div>
                <span className="font-bold text-lg tracking-tight">SecAudit</span>
            </div>
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 mb-2">
                    {t("mainMenu")}
                </p>
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
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
                        key={path}
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
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 mb-2 mt-5">
                    {t("settings")}
                </p>
                {configItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
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
