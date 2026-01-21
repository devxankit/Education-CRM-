
import React from 'react';
import { Activity, Database, Server, Wifi } from 'lucide-react';

const SystemHealthPanel = () => {
    const metrics = [
        { label: 'API Status', value: 'Operational', status: 'healthy', icon: Wifi },
        { label: 'Integrations', value: '4/4 Active', status: 'healthy', icon: Server },
        { label: 'Last Backup', value: '15 mins ago', status: 'warning', icon: Database }, // Example warning
        { label: 'Latency', value: '45ms', status: 'healthy', icon: Activity },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-gray-600" />
                System Health
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                            <div className={`p-2 rounded-full ${metric.status === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                <Icon size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{metric.label}</p>
                                <p className="text-sm font-bold text-gray-900">{metric.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SystemHealthPanel;
