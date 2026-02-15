import React, { useState, useEffect } from 'react';
import { Info, ShieldCheck } from 'lucide-react';

// Sub Components
import BackupConfigPanel from './components/BackupConfigPanel';
import ManualBackupPanel from './components/ManualBackupPanel';
import BackupHistoryTable from './components/BackupHistoryTable';
import RestoreWizard from './components/RestoreWizard';

const BackupsRecovery = () => {

    // Mock Data
    const [config, setConfig] = useState({
        frequency: 'daily',
        time: '02:00',
        retention: '30',
        scope: { database: true, documents: false, configs: true }
    });

    const [history, setHistory] = useState([
        { id: 'BK-20250125-0200', date: '2025-01-25', time: '02:00 AM', type: 'auto', scope: 'Full System', size: '1.2 GB', status: 'completed' },
        { id: 'BK-20250124-0200', date: '2025-01-24', time: '02:00 AM', type: 'auto', scope: 'Full System', size: '1.2 GB', status: 'completed' },
        { id: 'BK-20250123-1430', date: '2025-01-23', time: '02:30 PM', type: 'manual', scope: 'Database Only', size: '450 MB', status: 'completed' },
        { id: 'BK-20250122-0200', date: '2025-01-22', time: '02:00 AM', type: 'auto', scope: 'Full System', size: '0 MB', status: 'failed' },
    ]);

    const [activeRestore, setActiveRestore] = useState(null); // The backup object being restored
    const [isProcessing, setIsProcessing] = useState(false);

    // Actions
    const handleSaveConfig = (newConfig) => {
        setConfig(newConfig);
        console.log(`[AUDIT] Backup Config Updated | User: Admin`, newConfig);
        alert("Backup schedule updated.");
    };

    const handleManualBackup = (reason) => {
        const newBackup = {
            id: `BK-${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12)}`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString(),
            type: 'manual',
            scope: 'Full System',
            size: 'Processing...',
            status: 'processing'
        };
        setHistory([newBackup, ...history]);

        // Simulate completion
        setTimeout(() => {
            setHistory(prev => prev.map(b => b.id === newBackup.id ? { ...b, size: '1.1 GB', status: 'completed' } : b));
            console.log(`[AUDIT] Manual Backup Completed | Reason: ${reason}`);
        }, 3000);
    };

    const handleRestoreTrigger = (backup) => {
        setActiveRestore(backup);
    };

    const handleExecuteRestore = (id, scope) => {
        setActiveRestore(null); // Close modal
        setIsProcessing(true); // Show global loading overlay

        console.log(`[AUDIT] RESTORE INITIATED | Point: ${id} | Scope: ${scope} | User: Admin`);

        setTimeout(() => {
            setIsProcessing(false);
            alert("System restore completed successfully. Please re-login.");
            window.location.reload();
        }, 4000);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Backups & Disaster Recovery</h1>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-wider">Restricted Area</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        Data Protection • Snapshots • System Restore
                        <Info size={14} className="text-gray-400" />
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                <div className="max-w-7xl mx-auto space-y-8 pb-10">

                    {/* Top Row: Config & Manual Trigger */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <BackupConfigPanel config={config} onSave={handleSaveConfig} />
                        </div>
                        <div>
                            <ManualBackupPanel onTrigger={handleManualBackup} />
                        </div>
                    </div>

                    {/* Timeline */}
                    <BackupHistoryTable history={history} onRestore={handleRestoreTrigger} />

                    {/* Assurance Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-8">
                        <ShieldCheck size={14} />
                        <span>All backups are encrypted at rest using AES-256 standards.</span>
                    </div>

                </div>
            </div>

            {/* Restore Wizard Modal */}
            {activeRestore && (
                <RestoreWizard
                    backup={activeRestore}
                    onConfirm={handleExecuteRestore}
                    onCancel={() => setActiveRestore(null)}
                />
            )}

            {/* Global Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <h2 className="mt-6 text-xl font-bold text-gray-800">Restoring System...</h2>
                    <p className="text-gray-500 mt-2">Do not close this window. This may take several minutes.</p>
                </div>
            )}

        </div>
    );
};

export default BackupsRecovery;
