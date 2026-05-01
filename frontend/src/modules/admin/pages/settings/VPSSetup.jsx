import React, { useState, useEffect, useRef } from 'react';
import { Server, Shield, Terminal, Play, CheckCircle2, AlertCircle, Loader2, Copy } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const VPSSetup = () => {
    const [config, setConfig] = useState({
        host: '187.127.134.252',
        username: 'root',
        password: 'Jastinew@123'
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
        const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

        socket.on('deployment-log', (data) => {
            setLogs(prev => [...prev, { text: data.data, isError: data.isError, time: new Date().toLocaleTimeString() }]);
        });

        return () => socket.disconnect();
    }, []);

    const handleDeploy = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('deploying');
        setLogs([{ text: '🚀 Starting deployment process...', time: new Date().toLocaleTimeString() }]);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || '/api/v1'}/deployment/setup-vps`, config);
            if (response.data.success) {
                setStatus('success');
                setLogs(prev => [...prev, { text: '✅ Deployment completed successfully!', time: new Date().toLocaleTimeString() }]);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
            setLogs(prev => [...prev, { 
                text: `❌ Error: ${error.response?.data?.message || error.message}`, 
                isError: true, 
                time: new Date().toLocaleTimeString() 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Server className="text-indigo-600" size={36} />
                        VPS One-Click Setup
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Deploy the School CRM to any remote VPS automatically.</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                    status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                    status === 'deploying' ? 'bg-indigo-100 text-indigo-700' :
                    status === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${
                        status === 'success' ? 'bg-emerald-500' :
                        status === 'deploying' ? 'bg-indigo-500 animate-pulse' :
                        status === 'error' ? 'bg-rose-500' : 'bg-gray-400'
                    }`} />
                    {status.toUpperCase()}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">VPS Credentials</h3>
                        </div>

                        <form onSubmit={handleDeploy} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IP Address</label>
                                <input 
                                    required
                                    placeholder="e.g. 157.245.xx.xx"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-2xl text-sm font-bold shadow-inner"
                                    value={config.host}
                                    onChange={e => setConfig({...config, host: e.target.value})}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SSH Username</label>
                                <input 
                                    required
                                    placeholder="usually root"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-2xl text-sm font-bold shadow-inner"
                                    value={config.username}
                                    onChange={e => setConfig({...config, username: e.target.value})}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SSH Password</label>
                                <input 
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-2xl text-sm font-bold shadow-inner"
                                    value={config.password}
                                    onChange={e => setConfig({...config, password: e.target.value})}
                                    disabled={loading}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                                    loading 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-[0.98]'
                                }`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                                {loading ? 'Deploying...' : 'Start Installation'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-[28px] space-y-3">
                        <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                            <AlertCircle size={18} />
                            Important Note
                        </div>
                        <p className="text-xs text-amber-600 font-medium leading-relaxed">
                            Ensure your VPS is running **Ubuntu 20.04+** and you have **root** access. Existing data in the `education-crm` folder will be overwritten.
                        </p>
                    </div>
                </div>

                {/* Console Card */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900 rounded-[32px] border border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
                        <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal size={18} className="text-indigo-400" />
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Deployment Console</span>
                            </div>
                            <button 
                                onClick={() => setLogs([])}
                                className="text-[10px] font-black text-gray-500 hover:text-white uppercase transition-colors"
                            >Clear Console</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {logs.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-600 flex-col gap-4 italic">
                                    <Terminal size={48} className="opacity-20" />
                                    Waiting for deployment to start...
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-gray-600 shrink-0">[{log.time}]</span>
                                        <span className={log.isError ? 'text-rose-400' : 'text-emerald-400'}>{log.text}</span>
                                    </div>
                                ))
                            )}
                            <div ref={logEndRef} />
                        </div>

                        {status === 'success' && (
                            <div className="p-6 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-emerald-500" />
                                    <div className="text-sm font-bold text-emerald-400">Application is now live!</div>
                                </div>
                                <a 
                                    href={`http://${config.host}:3000`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl hover:bg-emerald-600 transition-all"
                                >OPEN CRM</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VPSSetup;
