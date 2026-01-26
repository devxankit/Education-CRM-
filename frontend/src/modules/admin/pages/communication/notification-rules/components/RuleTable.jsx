
import React from 'react';
import {
    Zap, // Trigger icon
    Bell, // Rules icon
    Clock,
    MoreVertical,
    Power, // Enable/Disable
    Edit,
    Eye,
    CheckCircle,
    XCircle,
    PauseCircle
} from 'lucide-react';

const RuleTable = ({ rules, onAction }) => {

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Active
                    </span>
                );
            case 'DISABLED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                        <PauseCircle size={12} />
                        Disabled
                    </span>
                );
            case 'DRAFT':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        Draft
                    </span>
                );
            default: return null;
        }
    };

    const getModuleColor = (mod) => {
        switch (mod) {
            case 'FEES': return 'text-emerald-600 bg-emerald-50';
            case 'ATTENDANCE': return 'text-blue-600 bg-blue-50';
            case 'EXAMS': return 'text-purple-600 bg-purple-50';
            case 'SECURITY': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Rule Name</th>
                        <th className="px-6 py-4">Trigger Event</th>
                        <th className="px-6 py-4">Target Audience</th>
                        <th className="px-6 py-4">Channels</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {rules.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No rules defined. Create automation logic.</p>
                            </td>
                        </tr>
                    ) : (
                        rules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors group">

                                {/* Name & Module */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${getModuleColor(rule.module)}`}>
                                            <Zap size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{rule.name}</h4>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                                {rule.module}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Trigger */}
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700 font-medium">When {rule.trigger}</div>
                                    {rule.condition && (
                                        <div className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                                            <Clock size={10} /> {rule.condition}
                                        </div>
                                    )}
                                </td>

                                {/* Audience */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {rule.audience.join(', ')}
                                </td>

                                {/* Channels */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-1.5">
                                        {rule.channels.map(ch => (
                                            <span key={ch} className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold text-gray-500 uppercase">
                                                {ch}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 text-center">
                                    {getStatusBadge(rule.status)}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                        <button
                                            onClick={() => onAction('EDIT', rule)}
                                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="Edit Rule"
                                        >
                                            <Edit size={16} />
                                        </button>

                                        {rule.status === 'ACTIVE' ? (
                                            <button
                                                onClick={() => onAction('DISABLE', rule)}
                                                className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                                title="Disable Rule"
                                            >
                                                <Power size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onAction('ACTIVATE', rule)}
                                                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                                title="Activate Rule"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}

                                    </div>
                                </td>

                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RuleTable;
