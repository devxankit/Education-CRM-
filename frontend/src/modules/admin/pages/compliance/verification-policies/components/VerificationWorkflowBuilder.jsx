
import React from 'react';
import { UserCheck, GitCommit, CheckCircle, Clock } from 'lucide-react';

const VerificationWorkflowBuilder = ({ policyId, levels, onUpdateLevels, mode }) => {

    const roleOptions = ['Admin', 'Compliance Officer', 'Department Head', 'Class Teacher', 'HR Manager'];

    // Helper to add level
    const addLevel = () => {
        if (levels.length >= 3) return;
        const newLevel = {
            id: Date.now(),
            role: roleOptions[0],
            slaHours: 24,
            canReject: true
        };
        onUpdateLevels(policyId, [...levels, newLevel]);
    };

    // Helper to remove level
    const removeLevel = (index) => {
        const newLevels = [...levels];
        newLevels.splice(index, 1);
        onUpdateLevels(policyId, newLevels);
    };

    // Helper to update level field
    const updateLevel = (index, field, value) => {
        const newLevels = [...levels];
        newLevels[index] = { ...newLevels[index], [field]: value };
        onUpdateLevels(policyId, newLevels);
    };

    if (mode === 'none') {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-400">
                <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Documents will be auto-accepted upon upload.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <GitCommit size={14} /> Verification Hierarchy
            </h4>

            <div className="space-y-3 relative">
                {/* Vertical Line for Stepper */}
                {levels.length > 1 && (
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 -z-10"></div>
                )}

                {levels.map((level, index) => (
                    <div key={level.id} className="bg-white border border-gray-200 rounded-lg p-3 relative shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* Step Badge */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-mono border-2 border-white shadow-sm z-10">
                            {index + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pl-4">

                            {/* Role Selector */}
                            <div className="md:col-span-5">
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Verifier Role</label>
                                <select
                                    value={level.role}
                                    onChange={(e) => updateLevel(index, 'role', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 text-sm py-1.5 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            {/* SLA Time */}
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">SLA (Hours)</label>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-gray-400" />
                                    <input
                                        type="number"
                                        value={level.slaHours}
                                        onChange={(e) => updateLevel(index, 'slaHours', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 text-sm py-1.5 px-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="md:col-span-3">
                                <label className="flex items-center gap-2 cursor-pointer mt-5">
                                    <input
                                        type="checkbox"
                                        checked={level.canReject}
                                        onChange={(e) => updateLevel(index, 'canReject', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-xs text-gray-600 font-medium">Can Reject?</span>
                                </label>
                            </div>

                            {/* Remove Button */}
                            <div className="md:col-span-1 text-right">
                                {levels.length > 1 && (
                                    <button
                                        onClick={() => removeLevel(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* Add Level Button */}
            {mode === 'multi' && levels.length < 3 && (
                <button
                    onClick={addLevel}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100 border-dashed w-full justify-center hover:bg-indigo-100"
                >
                    + Add Next Verification Level
                </button>
            )}
        </div>
    );
};

export default VerificationWorkflowBuilder;
