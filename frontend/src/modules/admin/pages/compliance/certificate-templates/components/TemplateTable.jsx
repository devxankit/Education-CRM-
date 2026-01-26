
import React from 'react';
import { FileText, MoreVertical, Edit, User, Users, Archive, CheckCircle, Clock } from 'lucide-react';

const TemplateTable = ({ templates, onEdit, onStatusChange }) => {

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'DRAFT': return 'bg-yellow-100 text-yellow-700';
            case 'ARCHIVED': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Template Name</th>
                        <th className="px-6 py-4">Type & Category</th>
                        <th className="px-6 py-4">Version</th>
                        <th className="px-6 py-4">Last Updated</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {templates.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No templates found. Create your first certificate template.</p>
                            </td>
                        </tr>
                    ) : (
                        templates.map((template) => (
                            <tr key={template.id} className="hover:bg-gray-50/50 transition-colors group">

                                {/* Name */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onEdit(template)}>
                                                {template.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{template.code}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Type */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                            {template.type === 'STUDENT' ? <GraduationCapIcon size={14} /> : <Users size={14} />}
                                            {template.type === 'STUDENT' ? 'Student' : 'Employee'}
                                        </div>
                                        <span className="text-xs text-gray-500">{template.category}</span>
                                    </div>
                                </td>

                                {/* Version */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                        v{template.version}
                                    </span>
                                </td>

                                {/* Last Updated */}
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {template.updatedAt}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">by {template.updatedBy}</div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(template.status)}`}>
                                        {template.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(template)}
                                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Edit Template"
                                        >
                                            <Edit size={16} />
                                        </button>

                                        {template.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => onStatusChange(template.id, 'ARCHIVED')}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Archive Template"
                                            >
                                                <Archive size={16} />
                                            </button>
                                        )}

                                        {template.status === 'DRAFT' && (
                                            <button
                                                onClick={() => onStatusChange(template.id, 'ACTIVE')}
                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Activate Template"
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

// Helper Icon
const GraduationCapIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
);

export default TemplateTable;
