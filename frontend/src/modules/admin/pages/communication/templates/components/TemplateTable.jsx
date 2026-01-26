
import React from 'react';
import { FileText, Mail, MessageSquare, Bell, Edit, Archive, Lock, Play } from 'lucide-react';

const TemplateTable = ({ templates, onAction }) => {

    const getChannelIcon = (channel) => {
        switch (channel) {
            case 'EMAIL': return <Mail size={16} className="text-blue-600" />;
            case 'SMS': return <MessageSquare size={16} className="text-amber-600" />;
            case 'APP': return <Bell size={16} className="text-indigo-600" />;
            default: return <FileText size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'DRAFT': return 'bg-gray-100 text-gray-700';
            case 'LOCKED': return 'bg-red-100 text-red-700';
            case 'ARCHIVED': return 'bg-gray-50 text-gray-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Template Name</th>
                        <th className="px-6 py-4">Channel & Category</th>
                        <th className="px-6 py-4">Usage</th>
                        <th className="px-6 py-4">Version</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {templates.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No templates found. Create your first communication template.</p>
                            </td>
                        </tr>
                    ) : (
                        templates.map((template) => (
                            <tr key={template.id} className="hover:bg-gray-50/50 transition-colors group">

                                {/* Name */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                            {getChannelIcon(template.channel)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 line-clamp-1" title={template.name}>
                                                {template.name}
                                            </h4>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{template.code}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Channel & Category */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-gray-700">{template.channel}</span>
                                        <span className="text-[10px] text-gray-500 uppercase">{template.category}</span>
                                    </div>
                                </td>

                                {/* Usage */}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${template.usageType === 'AUTOMATED' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {template.usageType}
                                    </span>
                                </td>

                                {/* Version */}
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                        v{template.version}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold ${getStatusColor(template.status)}`}>
                                        {template.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                        {/* Edit / View */}
                                        <button
                                            onClick={() => onAction('EDIT', template)}
                                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title={template.status === 'LOCKED' ? "View Template" : "Edit Template"}
                                        >
                                            <Edit size={16} />
                                        </button>

                                        {/* Activate */}
                                        {template.status === 'DRAFT' && (
                                            <button
                                                onClick={() => onAction('ACTIVATE', template)}
                                                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                                title="Activate"
                                            >
                                                <Play size={16} />
                                            </button>
                                        )}

                                        {/* Archive */}
                                        {template.status !== 'ARCHIVED' && template.status !== 'LOCKED' && (
                                            <button
                                                onClick={() => onAction('ARCHIVE', template)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Archive"
                                            >
                                                <Archive size={16} />
                                            </button>
                                        )}

                                        {/* Lock indicator */}
                                        {template.status === 'LOCKED' && (
                                            <span className="p-1.5 text-gray-400 cursor-not-allowed">
                                                <Lock size={16} />
                                            </span>
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

export default TemplateTable;
