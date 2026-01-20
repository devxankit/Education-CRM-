import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, Plus, Filter, PenTool } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';

const MOCK_ISSUES = [
    { id: 'ISS-001', type: 'Breakdown', route: 'Route 4', bus: 'DL-1PC-1234', date: '2024-10-12', status: 'Open', desc: 'Engine heating up rapidly.' },
    { id: 'ISS-002', type: 'Delay', route: 'Route 1', bus: 'DL-1PC-4502', date: '2024-10-12', status: 'Resolved', desc: 'Traffic congestion at main square.' },
    { id: 'ISS-003', type: 'Accident', route: 'Route 2', bus: 'DL-1PC-4510', date: '2024-10-10', status: 'In Progress', desc: 'Minor scratch by biker. Police report filed.' },
];

const TransportIssues = () => {
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [filter, setFilter] = useState('All');

    // Only Transport / Admin can edit
    const canEdit = [STAFF_ROLES.TRANSPORT, STAFF_ROLES.ADMIN].includes(user?.role);

    const filteredIssues = filter === 'All' ? MOCK_ISSUES : MOCK_ISSUES.filter(i => i.status === filter);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-50 text-red-700 border-red-200';
            case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className="max-w-3xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/staff/transport')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Issue Log</h1>
                            <p className="text-xs text-gray-500">Breakdowns & Delays</p>
                        </div>
                    </div>
                    {canEdit && (
                        <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-red-700">
                            <Plus size={14} /> Report
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['All', 'Open', 'In Progress', 'Resolved'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${filter === tab
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {filteredIssues.map(issue => (
                    <div key={issue.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(issue.status)}`}>
                                    {issue.status}
                                </span>
                                <span className="text-xs font-bold text-gray-400">#{issue.id}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">{issue.date}</span>
                        </div>

                        <div className="flex items-start gap-3 mb-3">
                            <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${issue.type === 'Accident' || issue.type === 'Breakdown' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                <AlertTriangle size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{issue.type}: {issue.route}</h3>
                                <p className="text-xs text-gray-500 font-mono mb-1">{issue.bus}</p>
                                <p className="text-sm text-gray-600">{issue.desc}</p>
                            </div>
                        </div>

                        {canEdit && issue.status !== 'Resolved' && (
                            <div className="pt-3 border-t border-gray-50 flex justify-end gap-2">
                                <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 bg-white">
                                    Update Status
                                </button>
                                <button className="text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 bg-white flex items-center gap-1">
                                    <CheckCircle size={12} /> Resolve
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransportIssues;
