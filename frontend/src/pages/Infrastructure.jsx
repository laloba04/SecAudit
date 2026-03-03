import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { Server, Play, Square, Activity } from "lucide-react";

export default function Infrastructure() {
    const { t } = useLanguage();

    const [nodes, setNodes] = useState([
        { id: 1, name: "SecAudit API", type: "Go Backend", status: "running", port: "8080", cpu: "1.2%", ram: "45 MB" },
        { id: 2, name: "SecAudit Frontend", type: "React Vite", status: "running", port: "5173", cpu: "0.1%", ram: "80 MB" },
        { id: 3, name: "OWASP Juice Shop", type: "Docker Sandbox", status: "stopped", port: "3000", cpu: "0%", ram: "0 MB" },
        { id: 4, name: "DVWA", type: "Docker Sandbox", status: "stopped", port: "8081", cpu: "0%", ram: "0 MB" },
        { id: 5, name: "Uptime Kuma", type: "Monitorización", status: "stopped", port: "3001", url: "http://localhost:3001", cpu: "0%", ram: "0 MB" },
        { id: 6, name: "Dozzle", type: "Visor de Logs", status: "stopped", port: "8888", url: "http://localhost:8888", cpu: "0%", ram: "0 MB" },
    ]);

    const handleStartNode = (id) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, status: "running", cpu: "0.5%", ram: "50 MB" } : n));
    };

    const handleStopNode = (id) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, status: "stopped", cpu: "0%", ram: "0 MB" } : n));
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#161b27] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Server size={20} className="text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{t("infrastructure")}</h2>
                        <p className="text-sm text-gray-400 mt-1">{t("infrastructureDesc")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {nodes.map((node, i) => (
                        <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-200">{node.name}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{node.type} • {t("port")}: {node.port}</p>
                                    {node.url && (
                                        <a href={node.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:underline mt-1 inline-block">
                                            ↗ {t("open")} {node.name}
                                        </a>
                                    )}
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                                    ${node.status === "running" ? "text-green-400 bg-green-400/10" : "text-gray-400 bg-gray-400/10"}`}>
                                    {node.status === "running" ? <Activity size={10} /> : <Square size={10} fill="currentColor" />}
                                    {node.status}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                                <div className="flex gap-4 text-xs text-gray-400">
                                    <span><strong className="text-gray-300">CPU:</strong> {node.cpu}</span>
                                    <span><strong className="text-gray-300">RAM:</strong> {node.ram}</span>
                                </div>
                                {node.status === "stopped" ? (
                                    <button onClick={() => handleStartNode(node.id)} className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                                        <Play size={12} fill="currentColor" /> {t("startNode")}
                                    </button>
                                ) : (
                                    <button onClick={() => handleStopNode(node.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
                                        <Square size={12} fill="currentColor" /> {t("stopNode")}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
