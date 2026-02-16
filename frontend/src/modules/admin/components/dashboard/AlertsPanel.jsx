
import React from 'react';
import { AlertCircle, AlertTriangle, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlertsPanel = ({ alerts = [] }) => {
    const criticalCount = alerts.filter((a) => a.type === 'critical').length;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <AlertCircle className="text-red-500" size={20} />
                    Critical Alerts
                </h2>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                    {criticalCount > 0 ? criticalCount : alerts.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {alerts.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">No alerts at the moment.</p>
                ) : (
                    alerts.map((alert) => {
                        const isInfo = alert.type === 'info';
                        const isCritical = alert.type === 'critical';
                        const borderClass = isInfo
                            ? 'border-blue-400 bg-blue-50/50'
                            : isCritical
                                ? 'border-red-500 bg-red-50/50'
                                : 'border-amber-500 bg-amber-50/50';
                        const titleClass = isInfo
                            ? 'text-blue-900'
                            : isCritical
                                ? 'text-red-900'
                                : 'text-amber-900';
                        return (
                            <div
                                key={alert.id}
                                className={`p-4 rounded-lg border-l-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${borderClass}`}
                            >
                                {isInfo ? (
                                    <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                ) : isCritical ? (
                                    <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                                ) : (
                                    <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm font-semibold ${titleClass}`}>{alert.title}</h3>
                                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                                    {alert.link && (
                                        <Link to={alert.link} className="text-xs font-medium text-blue-600 mt-2 block hover:underline flex items-center gap-1">
                                            View Details <ChevronRight size={12} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AlertsPanel;
