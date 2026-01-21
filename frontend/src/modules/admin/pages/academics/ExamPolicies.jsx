
import React, { useState } from 'react';
import { Settings, Save, ChevronRight, CheckCircle } from 'lucide-react';

import PolicyLockBanner from './components/policies/PolicyLockBanner';
import ExamTypesConfig from './components/policies/ExamTypesConfig';
import GradingSystemConfig from './components/policies/GradingSystemConfig';
import PromotionRulesConfig from './components/policies/PromotionRulesConfig';

const ExamPolicies = () => {

    const [isLocked, setIsLocked] = useState(true); // Locked by default (safe)
    const [activeTab, setActiveTab] = useState('types');

    const handleUnlock = () => {
        const reason = prompt("Please provide a reason for Unlocking the Policy (Mandatory for Audit):");
        if (reason && reason.length > 5) {
            setIsLocked(false);
        } else if (reason !== null) {
            alert("Valid reason required.");
        }
    };

    const handleLock = () => {
        if (window.confirm("Lock this policy? Changes will apply immediately.")) {
            setIsLocked(true);
        }
    };

    const steps = [
        { id: 'types', label: '1. Exam Types & Weightage' },
        { id: 'grading', label: '2. Grading & Marks' },
        { id: 'promotion', label: '3. Promotion Rules' },
        { id: 'visibility', label: '4. Visibility & Publish' }
    ];

    return (
        <div className="h-full flex flex-col relative pb-10">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Exam Rules & Policies</h1>
                <p className="text-gray-500 text-sm">Configure the academic evaluation framework.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">

                {/* Lock Status Banner */}
                <PolicyLockBanner
                    isLocked={isLocked}
                    onLock={handleLock}
                    onUnlock={handleUnlock}
                />

                <div className="flex flex-1">

                    {/* Left Sidebar Steps */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 shrink-0">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Configuration Steps</h3>
                        <nav className="space-y-1">
                            {steps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveTab(step.id)}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group
                                        ${activeTab === step.id
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-white hover:text-gray-900'
                                        }
                                    `}
                                >
                                    {step.label}
                                    {activeTab === step.id && <ChevronRight size={14} />}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-8 p-4 bg-indigo-900 rounded-lg text-indigo-100 text-xs shadow-inner">
                            <strong className="block mb-1 text-white">Active Policy</strong>
                            <div className="flex justify-between mt-2">
                                <span>Year:</span> <span className="font-mono text-white">2025-26</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span>Version:</span> <span className="font-mono text-white">v1.2</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 p-8 bg-white overflow-y-auto">

                        {activeTab === 'types' && <ExamTypesConfig isLocked={isLocked} />}
                        {activeTab === 'grading' && <GradingSystemConfig isLocked={isLocked} />}
                        {activeTab === 'promotion' && <PromotionRulesConfig isLocked={isLocked} />}

                        {activeTab === 'visibility' && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                                <Settings size={48} className="mb-4 text-gray-200" />
                                <h3 className="text-gray-900 font-medium">Result Visibility Rules</h3>
                                <p className="text-sm max-w-xs mt-2">Configure when and how results are published to students and parents.</p>
                                <button className="mt-4 px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Configure Defaults</button>
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ExamPolicies;
