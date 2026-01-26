
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Layers, FileText, Settings } from 'lucide-react';
import VerificationWorkflowBuilder from './VerificationWorkflowBuilder';

const PolicyCard = ({ policy, onUpdateMode, onUpdateLevels, isExpanded, onToggleExpand }) => {

    // Derived State
    const modeOptions = [
        { id: 'none', label: 'No Verification (Auto-Verify)', icon: CheckCircleIcon },
        { id: 'manual', label: 'Manual Verification (1 Level)', icon: UserIcon },
        { id: 'multi', label: 'Multi-Level Verification', icon: LayersIcon }
    ];

    const currentMode = modeOptions.find(m => m.id === policy.mode);

    return (
        <div className={`bg-white border rounded-xl shadow-sm transition-all duration-300 ${isExpanded ? 'ring-1 ring-indigo-500 border-indigo-500' : 'border-gray-200'}`}>

            {/* Header / Summary Row */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 rounded-t-xl"
                onClick={onToggleExpand}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">{policy.documentName}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            {policy.category}
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className={policy.mode === 'none' ? 'text-amber-600' : 'text-green-600'}>
                                {currentMode?.label}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Level Indicator Badge */}
                    {policy.mode !== 'none' && (
                        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-semibold text-gray-600">
                            <Layers size={12} />
                            {policy.levels.length} Level{policy.levels.length > 1 ? 's' : ''}
                        </div>
                    )}

                    <button className="text-gray-400 p-1">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/30 rounded-b-xl space-y-6 animate-in slide-in-from-top-2">

                    {/* Section 2: Mode Selection */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Verification Strategy</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {modeOptions.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = policy.mode === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={(e) => { e.stopPropagation(); onUpdateMode(policy.id, opt.id); }}
                                        className={`
                                            flex items-center gap-3 p-3 rounded-lg border text-left transition-all
                                            ${isSelected
                                                ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600 text-indigo-700'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className={`p-1.5 rounded-full ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Icon size={16} />
                                        </div>
                                        <span className="text-xs font-bold">{opt.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Section 3: Workflow Builder */}
                    <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
                        <VerificationWorkflowBuilder
                            policyId={policy.id}
                            levels={policy.levels}
                            mode={policy.mode}
                            onUpdateLevels={onUpdateLevels}
                        />
                    </div>

                    {/* Advanced Settings (Placeholder) */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                            <Settings size={14} />
                            Configure Rejection & Expiry Rules
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

// Icons Helpers
const CheckCircleIcon = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const UserIcon = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const LayersIcon = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;

export default PolicyCard;
