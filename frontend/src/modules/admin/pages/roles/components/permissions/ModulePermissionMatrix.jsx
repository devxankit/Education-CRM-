
import React from 'react';
import { Eye, Plus, Edit, Trash2, Download } from 'lucide-react';

const ModulePermissionMatrix = ({ permissions, onChange }) => {

    // Config: Defines structure of the Matrix
    const modules = [
        { key: 'students', label: 'Student Management' },
        { key: 'parents', label: 'Parent Portal' },
        { key: 'teachers', label: 'Teacher Database' },
        { key: 'staff', label: 'HR & Staff' },
        { key: 'academics', label: 'Academics (Classes/Subjects)' },
        { key: 'fees', label: 'Fee Collection' },
        { key: 'finance', label: 'Finance & Accounts' },
        { key: 'transport', label: 'Transport' },
        { key: 'reports', label: 'Reports & Analytics' }
    ];

    const actions = [
        { key: 'view', label: 'View', icon: Eye, color: 'text-blue-600' },
        { key: 'create', label: 'Create', icon: Plus, color: 'text-green-600' },
        { key: 'edit', label: 'Edit', icon: Edit, color: 'text-amber-600' },
        { key: 'delete', label: 'Delete', icon: Trash2, color: 'text-red-600' },
        { key: 'export', label: 'Export', icon: Download, color: 'text-gray-600' }
    ];

    const handleToggle = (moduleKey, actionKey) => {
        onChange(moduleKey, actionKey);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Matrix Header */}
            <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                <div className="p-4 text-left border-r border-gray-100">Module Scope</div>
                {actions.map(action => (
                    <div key={action.key} className="p-4 border-r border-gray-100 last:border-0 flex flex-col items-center gap-1">
                        <action.icon size={16} className={action.color} />
                        {action.label}
                    </div>
                ))}
            </div>

            {/* Matrix Body */}
            <div className="divide-y divide-gray-100">
                {modules.map(module => (
                    <div key={module.key} className="grid grid-cols-6 hover:bg-gray-50/50 transition-colors group">
                        {/* Module Label */}
                        <div className="p-4 text-sm font-medium text-gray-800 border-r border-gray-100 flex items-center">
                            {module.label}
                        </div>

                        {/* Checkboxes */}
                        {actions.map(action => {
                            const isChecked = permissions[module.key]?.[action.key] === true;
                            // Mock logic: If Delete, make it harder (e.g. red background if checked)
                            const cellClass = action.key === 'delete' && isChecked ? 'bg-red-50' : '';

                            return (
                                <div key={action.key} className={`p-4 border-r border-gray-100 last:border-0 flex items-center justify-center ${cellClass}`}>
                                    <label className="relative flex items-center justify-center cursor-pointer w-full h-full">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                            checked={isChecked}
                                            onChange={() => handleToggle(module.key, action.key)}
                                        />
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend Footer */}
            <div className="px-6 py-3 bg-gray-50 text-[10px] text-gray-400 border-t border-gray-200">
                * Delete permission should be granted with extreme caution.
            </div>
        </div>
    );
};

export default ModulePermissionMatrix;
