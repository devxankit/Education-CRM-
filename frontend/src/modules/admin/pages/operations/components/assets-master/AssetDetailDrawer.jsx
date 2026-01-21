
import React, { useState } from 'react';
import { X, History, FileText } from 'lucide-react';
import AssetForm from './AssetForm';
import AssetLifecycleTimeline from './AssetLifecycleTimeline';

const AssetDetailDrawer = ({ isOpen, onClose, asset, isNew, onSave }) => {

    const [activeTab, setActiveTab] = useState('details'); // details | history

    if (!isOpen) return null;

    // Mock History if viewing
    const mockHistory = [
        { date: '2024-03-10', action: 'Assigned', user: 'Admin', notes: 'Allocated to John Doe (Student)' },
        { date: '2024-01-15', action: 'Under Maintenance', user: 'Tech Support', notes: 'Screen replacement' },
        { date: '2023-11-01', action: 'Created', user: 'System', notes: 'Initial Purchase Entry' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            {/* Drawer */}
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {isNew ? 'New Asset Entry' : 'Asset Details'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {isNew ? 'Register a new physical asset.' : `Managing ${asset?.code}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs (Only if not new) */}
                {!isNew && (
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'details' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'history' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            History & Audit
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'details' ? (
                        <AssetForm
                            asset={asset}
                            isNew={isNew}
                            onSave={onSave}
                            onCancel={onClose}
                        />
                    ) : (
                        <div className="p-6 h-full overflow-y-auto">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                <History size={14} /> Lifecycle Log
                            </h4>
                            <AssetLifecycleTimeline history={mockHistory} />

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                    <FileText size={14} /> Documents
                                </h4>
                                <div className="text-sm text-gray-500 italic text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    No invoices or warranty cards attached.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AssetDetailDrawer;
