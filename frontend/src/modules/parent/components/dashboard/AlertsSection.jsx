
import React from 'react';
import { AlertTriangle, TrendingDown, Clock, CreditCard, BookOpen } from 'lucide-react';

const AlertCard = ({ alert, onClick }) => {
    const iconMap = {
        homework: BookOpen,
        fee: CreditCard,
        attendance: TrendingDown
    };

    const Icon = iconMap[alert.type] || AlertTriangle;

    return (
        <button
            onClick={() => onClick(alert)}
            className="w-full text-left bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-start gap-4 mb-3 active:bg-red-50 transition-colors"
        >
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">{alert.title}</h4>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{alert.message}</p>
                <span className="text-xs font-bold text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-lg inline-block">
                    {alert.cta}
                </span>
            </div>
        </button>
    );
};

const AlertsSection = ({ alerts, onAlertClick }) => {
    if (!alerts || alerts.length === 0) return null;

    return (
        <div className="mb-6 px-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Action Required</h3>
            {alerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} onClick={onAlertClick} />
            ))}
        </div>
    );
}

export default AlertsSection;
