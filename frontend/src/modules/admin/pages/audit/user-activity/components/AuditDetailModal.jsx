import React, { useState } from 'react';
import { X, Clock, MapPin, Monitor, Shield, FileText } from 'lucide-react';

const AuditDetailModal = ({ log, onClose }) => {

    if (!log) return null;

    const getStatusColor = (status) => {
        return status === 'success' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Log Details</h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {log.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">

                    {/* Top Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-1">
                                <Clock size={12} /> Timestamp
                            </div>
                            <div className="text-sm font-medium text-gray-900">{log.timestamp}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase mb-1">
                                <Shield size={12} /> Action Status
                            </div>
                            <div className={`inline-flex px-2 py-0.5 rounded text-xs font-bold capitalize ${getStatusColor(log.status)}`}>
                                {log.status}
                            </div>
                        </div>
                    </div>

                    {/* Actor Info */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            Actor Information
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">User</label>
                                <div className="text-sm font-medium flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                        {log.user[0]}
                                    </div>
                                    {log.user}
                                    <span className="text-xs text-gray-400">({log.role})</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">IP Address</label>
                                <div className="text-sm font-mono text-gray-800 flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" /> {log.ip}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">User Agent / Device</label>
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                    <Monitor size={14} className="text-gray-400" />
                                    {log.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Payload */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-gray-500" /> Event Payload (JSON)
                        </h4>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">
                                {JSON.stringify(log.details || { event: log.action, target: log.module, authorized: true }, null, 2)}
                            </pre>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditDetailModal;
