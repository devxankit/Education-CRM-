import React, { useState } from 'react';
import { DatabaseBackup, Play, Loader2 } from 'lucide-react';

const ManualBackupPanel = ({ onTrigger }) => {

    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBackup = async () => {
        if (!reason.trim()) return alert("Please specify a reason for this manual backup.");

        setLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 2000));
        onTrigger(reason);
        setLoading(false);
        setReason('');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <DatabaseBackup size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">On-Demand Backup</h3>
                    <p className="text-xs text-gray-500">Trigger an immediate system snapshot.</p>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Audit Reason <span className="text-red-500">*</span></label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 min-h-[80px]"
                        placeholder="e.g. Pre-upgrade safety snapshot..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                </div>

                <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 leading-relaxed border border-blue-100">
                    <strong>Note:</strong> Manual backups are resource intensive. Only run during low traffic periods.
                </div>

                <button
                    onClick={handleBackup}
                    disabled={loading || !reason.trim()}
                    className={`
                        w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-bold shadow-sm transition-all
                        ${loading || !reason.trim() ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'}
                    `}
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                    {loading ? 'Processing...' : 'Start Backup Now'}
                </button>

            </div>
        </div>
    );
};

export default ManualBackupPanel;
