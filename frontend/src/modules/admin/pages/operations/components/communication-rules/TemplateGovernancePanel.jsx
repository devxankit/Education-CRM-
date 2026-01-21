
import React, { useState } from 'react';
import { FileText, Lock } from 'lucide-react';

const TemplateGovernancePanel = ({ isLocked }) => {

    // Config
    const [policy, setPolicy] = useState({
        mandatoryTemplates: true, // If true, free text is disabled for certain roles
        strictApproval: false,
        categories: [
            { id: 'fees', name: 'Fee Reminders', locked: true },
            { id: 'exam', name: 'Exam Results', locked: true },
            { id: 'general', name: 'General Notice', locked: false }
        ]
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setPolicy(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <FileText className="text-indigo-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Template Governance</h3>
                    <p className="text-xs text-gray-500">Standardize outbound communication.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Master Switch */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Enforce Template Usage</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={policy.mandatoryTemplates}
                            disabled={isLocked}
                            onChange={(e) => handleChange('mandatoryTemplates', e.target.checked)}
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-indigo-600`}></div>
                    </label>
                </div>

                <p className="text-[10px] text-gray-500 -mt-4">
                    If enabled, staff cannot send "Free Text" messages for critical categories.
                </p>

                <hr className="border-gray-100" />

                {/* Category Locks */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Category Locks</label>
                    <div className="grid grid-cols-2 gap-3">
                        {policy.categories.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-2 p-2 border border-gray-100 rounded bg-gray-50">
                                {cat.locked ? <Lock size={14} className="text-red-500" /> : <FileText size={14} className="text-gray-400" />}
                                <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TemplateGovernancePanel;
