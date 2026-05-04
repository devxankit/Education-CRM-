import React, { useState, useEffect, useRef } from 'react';
import { Server, Shield, Terminal, Play, CheckCircle2, AlertCircle, Loader2, Globe, Cpu, Activity, Zap } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const VPSSetup = () => {
    const [config, setConfig] = useState({
        host: '',
        username: '',
        password: '',
        domain: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, deploying, success, error
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);

    const scrollToBottom = () => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    useEffect(() => {
        const socket = io(window.location.origin);

        socket.on('deployment-log', (data) => {
            setLogs(prev => [...prev, { text: data.data, isError: data.isError, time: new Date().toLocaleTimeString() }]);
        });

        return () => socket.disconnect();
    }, []);

    const handleDeploy = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('deploying');
        setLogs([{ text: '🚀 System Check: Initiating Remote VPS Deployment...', time: new Date().toLocaleTimeString() }]);

        try {
            const apiBase = import.meta.env.VITE_API_URL || (window.location.origin + '/api/v1');
            const response = await axios.post(`${apiBase}/deployment/setup-vps`, config);
            if (response.data.success) {
                setStatus('success');
                setLogs(prev => [...prev, { text: '✅ CORE SYSTEM READY: All services are operational.', time: new Date().toLocaleTimeString() }]);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
            setLogs(prev => [...prev, { 
                text: `❌ FAIL: ${error.response?.data?.message || error.message}`, 
                isError: true, 
                time: new Date().toLocaleTimeString() 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-indigo-500/30 flex flex-col overflow-hidden fixed inset-0">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Zap className="text-white fill-white" size={16} />
                    </div>
                    <div>
                        <h1 className="text-base font-black text-white tracking-tight uppercase leading-none">System Core <span className="text-indigo-400">Deployer</span></h1>
                        <p className="text-[8px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">v2.0 Module</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                        <Activity size={12} className="text-indigo-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{config.host || 'DISCONNECTED'}</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border ${
                        status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        status === 'deploying' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        status === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                    }`}>
                        <div className={`w-1 h-1 rounded-full ${
                            status === 'success' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' :
                            status === 'deploying' ? 'bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.6)]' :
                            status === 'error' ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]' : 'bg-slate-500'
                        }`} />
                        {status}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
                
                {/* Left Panel: Configuration */}
                <div className="lg:col-span-4 border-r border-white/5 p-6 overflow-y-auto bg-black/10">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white tracking-tight">Provisioning</h2>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Enter remote credentials to initiate containerization.</p>
                        </div>

                        <form onSubmit={handleDeploy} className="space-y-4">
                            <div className="space-y-3">
                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-indigo-400 transition-colors">Target IP (Public or NATed)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                        <input 
                                            required
                                            placeholder="0.0.0.0"
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07] outline-none rounded-xl text-xs font-medium text-white transition-all shadow-inner"
                                            value={config.host}
                                            onChange={e => setConfig({...config, host: e.target.value})}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-indigo-400 transition-colors">Auth User</label>
                                    <div className="relative">
                                        <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                        <input 
                                            required
                                            placeholder="root"
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07] outline-none rounded-xl text-xs font-medium text-white transition-all shadow-inner"
                                            value={config.username}
                                            onChange={e => setConfig({...config, username: e.target.value})}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-indigo-400 transition-colors">Domain Name (Optional for SSL)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                        <input 
                                            placeholder="crm.example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07] outline-none rounded-xl text-xs font-medium text-white transition-all shadow-inner"
                                            value={config.domain}
                                            onChange={e => setConfig({...config, domain: e.target.value})}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-indigo-400 transition-colors">Access Key</label>
                                    <div className="relative">
                                        <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                        <input 
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07] outline-none rounded-xl text-xs font-medium text-white transition-all shadow-inner"
                                            value={config.password}
                                            onChange={e => setConfig({...config, password: e.target.value})}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${
                                    loading 
                                    ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98]'
                                }`}
                            >
                                {loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Play className="fill-white" size={16} />}
                                {loading ? 'EXECUTING...' : 'Start Installation'}
                            </button>
                        </form>

                        <div className="pt-4 space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                    <Cpu size={16} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">Container Engine</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Docker Orchestration</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-1">
                                <div className="flex items-center gap-2 text-amber-500 font-black text-[8px] uppercase tracking-widest">
                                    <AlertCircle size={12} />
                                    Warning
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    This will provision a fresh environment. Existing data on target will be lost.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Console */}
                <div className="lg:col-span-8 bg-black/40 flex flex-col relative overflow-hidden">
                    {/* Console Header */}
                    <div className="px-6 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-rose-500/40" />
                                <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                            </div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Kernel_Logs.log</span>
                        </div>
                        <button 
                            onClick={() => setLogs([])}
                            className="text-[8px] font-black text-slate-600 hover:text-indigo-400 uppercase transition-colors"
                        >Clear</button>
                    </div>

                    {/* Console Output */}
                    <div className="flex-1 overflow-y-auto p-6 font-mono text-[12px] leading-relaxed space-y-1.5 custom-scrollbar scroll-smooth">
                        {logs.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-700 flex-col gap-4 select-none opacity-40">
                                <Terminal size={24} />
                                <p className="text-[8px] font-black uppercase tracking-[0.3em]">Ready...</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-3 group animate-in fade-in slide-in-from-left-1 duration-200">
                                        <span className="text-slate-700 shrink-0 select-none text-[10px]">{log.time}</span>
                                        <span className="text-indigo-500/30 shrink-0 select-none">›</span>
                                        <span className={`break-all ${
                                            log.isError ? 'text-rose-400' : 
                                            log.text.startsWith('✅') ? 'text-emerald-400' :
                                            log.text.startsWith('🚀') ? 'text-indigo-400' : 'text-slate-400'
                                        }`}>
                                            {log.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div ref={logEndRef} className="h-2" />
                    </div>

                    {/* Success Overlay Bar */}
                    {status === 'success' && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between animate-in zoom-in-95 duration-300 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight leading-none">System Online</p>
                                    <p className="text-[9px] text-emerald-400 font-bold tracking-wider mt-1">READY</p>
                                </div>
                            </div>
                            <a 
                                href={`http://${config.host}:3000`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="px-5 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-lg hover:bg-emerald-600 transition-all uppercase tracking-widest"
                            >Launch</a>
                        </div>
                    )}
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                body { overflow: hidden !important; }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.08);
                }
            `}} />
        </div>
    );
};

export default VPSSetup;
