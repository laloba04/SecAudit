import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { Server, Play, Square, RefreshCw, AlertTriangle, ExternalLink } from "lucide-react";

const SERVICE_INFO = {
    "juice-shop": { name: "OWASP Juice Shop", desc: "Docker Sandbox", port: 3000, url: "http://localhost:3000" },
    "dvwa": { name: "DVWA", desc: "Docker Sandbox", port: 8081, url: "http://localhost:8081" },
    "uptime-kuma": { name: "Uptime Kuma", desc: "Monitorización", port: 3001, url: "http://localhost:3001" },
    "dozzle": { name: "Dozzle", desc: "Visor de Logs", port: 8888, url: "http://localhost:8888" },
};

export default function Infrastructure() {
    const { t } = useLanguage();
    const [services, setServices] = useState([]);
    const [dockerAvailable, setDockerAvailable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    const fetchStatus = () => {
        setLoading(true);
        fetch("/api/infra/status")
            .then(r => r.json())
            .then(d => {
                setDockerAvailable(d.docker_available);
                setServices(d.services || []);
                setLoading(false);
            })
            .catch(() => {
                setDockerAvailable(false);
                setLoading(false);
            });
    };

    useEffect(() => { fetchStatus(); }, []);

    const handleAction = async (service, action) => {
        setActionLoading(prev => ({ ...prev, [service]: true }));
        try {
            await fetch(`/api/infra/${action}/${service}`, { method: "POST" });
            // Esperar un poco para que Docker arranque/pare
            setTimeout(() => {
                fetchStatus();
                setActionLoading(prev => ({ ...prev, [service]: false }));
            }, 2000);
        } catch {
            setActionLoading(prev => ({ ...prev, [service]: false }));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-[#161b27] border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Server size={20} className="text-cyan-400" />
                        <div>
                            <h1 className="text-lg font-bold">{t("infrastructure")}</h1>
                            <p className="text-sm text-gray-400">{t("infraDesc") ?? "Gestiona los nodos de SecAudit y los entornos Sandbox de Docker."}</p>
                        </div>
                    </div>
                    <button onClick={fetchStatus} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> {t("refresh") ?? "Refrescar"}
                    </button>
                </div>

                {/* Docker status */}
                {dockerAvailable === false && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        {t("dockerNotAvailable") ?? "Docker no está disponible. Instala Docker Desktop para gestionar los servicios del sandbox."}
                    </div>
                )}

                {dockerAvailable === true && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
                        ✅ Docker disponible
                    </div>
                )}

                {/* Services grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((svc) => {
                        const info = SERVICE_INFO[svc.service] || { name: svc.service, desc: "Service", port: "—" };
                        const isRunning = svc.status === "running";
                        const isLoading = actionLoading[svc.service];

                        return (
                            <div key={svc.service} className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold">{info.name}</h3>
                                        <p className="text-xs text-gray-500">{info.desc} • Puerto: {info.port}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isRunning ? "text-green-400 bg-green-400/10" : "text-gray-400 bg-gray-400/10"}`}>
                                        {isRunning ? "● RUNNING" : "■ STOPPED"}
                                    </span>
                                </div>

                                {isRunning && info.url && (
                                    <a href={info.url} target="_blank" rel="noopener noreferrer"
                                        className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mb-3">
                                        <ExternalLink size={11} /> {t("open") ?? "Abrir"} {info.name}
                                    </a>
                                )}

                                <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs text-gray-500">
                                        Container: {svc.container}
                                    </div>
                                    <button
                                        disabled={isLoading || !dockerAvailable}
                                        onClick={() => handleAction(svc.service, isRunning ? "stop" : "start")}
                                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${isRunning
                                                ? "text-red-400 hover:bg-red-400/10"
                                                : "text-green-400 hover:bg-green-400/10"
                                            }`}
                                    >
                                        {isLoading ? (
                                            <RefreshCw size={12} className="animate-spin" />
                                        ) : isRunning ? (
                                            <><Square size={12} /> {t("stop") ?? "Detener"}</>
                                        ) : (
                                            <><Play size={12} /> {t("start") ?? "Arrancar"}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {services.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        {t("noServices") ?? "No se encontraron servicios configurados."}
                    </div>
                )}
            </div>
        </div>
    );
}
