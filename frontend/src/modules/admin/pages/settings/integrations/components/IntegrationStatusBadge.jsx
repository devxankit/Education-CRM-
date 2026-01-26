import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const IntegrationStatusBadge = ({ status, lastSync }) => {

    // Status Logic
    let color = 'bg-gray-100 text-gray-500 border-gray-200';
    let icon = <RefreshCw size={12} />;
    let label = 'Not Configured';

    if (status === 'connected') {
        color = 'bg-green-50 text-green-700 border-green-200';
        icon = <CheckCircle size={12} />;
        label = 'Connected';
    } else if (status === 'error') {
        color = 'bg-red-50 text-red-700 border-red-200';
        icon = <XCircle size={12} />;
        label = 'Connection Failed';
    } else if (status === 'testing') {
        color = 'bg-blue-50 text-blue-700 border-blue-200';
        icon = <RefreshCw size={12} className="animate-spin" />;
        label = 'Testing...';
    } else if (status === 'disabled') {
        color = 'bg-gray-100 text-gray-400 border-gray-200';
        icon = <AlertTriangle size={12} />;
        label = 'Disabled';
    }

    return (
        <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
                {icon} {label}
            </span>
            {lastSync && status === 'connected' && (
                <span className="text-[10px] text-gray-400">Synced: {lastSync}</span>
            )}
        </div>
    );
};

export default IntegrationStatusBadge;
