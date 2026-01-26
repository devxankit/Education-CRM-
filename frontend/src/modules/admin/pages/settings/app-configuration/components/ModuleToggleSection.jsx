import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const MODULES = [
    { id: 'admissions', label: 'Admissions Management', required: false },
    { id: 'attendance', label: 'Attendance Tracking', required: false },
    { id: 'exams', label: 'Exams & Results', required: false },
    { id: 'fees', label: 'Fees & Finance', required: false },
    { id: 'hostel', label: 'Hostel & Housing', required: false },
    { id: 'transport', label: 'Transport Management', required: false },
    { id: 'hr', label: 'HR & Payroll', required: false },
    { id: 'compliance', label: 'Documents & Compliance', required: false },
    { id: 'support', label: 'Helpdesk & Support', required: false },
    { id: 'reports', label: 'Reports & Analytics', required: true }, // Core
    { id: 'custom_reports', label: 'Custom Reports Builder', required: false },
];

const ModuleToggleSection = ({ values, onChange }) => {

    const handleToggle = (id, currentVal) => {
        const newVal = !currentVal;
        onChange(`module_${id}`, newVal);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((module) => {
                const isEnabled = values[`module_${module.id}`];
                const isRequired = module.required;

                return (
                    <div
                        key={module.id}
                        className={`
                            border rounded-lg p-4 flex items-start justify-between gap-3 transition-colors
                            ${isEnabled
                                ? 'bg-white border-gray-200'
                                : 'bg-gray-50 border-gray-200 opacity-75'
                            }
                        `}
                    >
                        <div className="flex-1">
                            <h4 className={`text-sm font-bold ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                {module.label}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5 ">
                                {isEnabled ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                        <CheckCircle size={10} /> ACTIVE
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                        <XCircle size={10} /> DISABLED
                                    </span>
                                )}
                                {isRequired && (
                                    <span className="text-[10px] text-gray-400 italic">Core Module</span>
                                )}
                            </div>
                        </div>

                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isEnabled}
                                onChange={() => handleToggle(module.id, isEnabled)}
                                disabled={isRequired}
                            />
                            <div className={`
                                w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                                after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                                ${isRequired ? 'opacity-50 cursor-not-allowed' : ''}
                                ${isEnabled ? 'peer-checked:bg-indigo-600' : ''}
                            `}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ModuleToggleSection;
