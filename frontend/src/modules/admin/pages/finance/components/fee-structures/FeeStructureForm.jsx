
import React, { useState } from 'react';
import { ChevronRight, Save, X, Layers, List, Calendar } from 'lucide-react';
import FeeComponentsEditor from './FeeComponentsEditor';
import InstallmentScheduler from './InstallmentScheduler';

const FeeStructureForm = ({ onSave, onCancel, initialData }) => {

    const [step, setStep] = useState(1);

    // Form State
    const [basicInfo, setBasicInfo] = useState({
        name: initialData?.name || '',
        academicYear: initialData?.academicYear || '2025-26',
        classOrProgram: initialData?.classOrProgram || '',
        branch: initialData?.branch || 'Main'
    });

    const [components, setComponents] = useState(initialData?.components || []);

    // Prepare initial installments
    const [installments, setInstallments] = useState(initialData?.installments || [
        { id: 1, name: 'Full Payment', dueDate: '', amount: 0 }
    ]);

    // Computed
    const totalAmount = components.reduce((sum, c) => sum + c.amount, 0);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleFinalSave = () => {
        onSave({
            ...basicInfo,
            components,
            installments,
            totalAmount
        });
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Fee Structure' : 'Create Fee Structure'}
                    </h2>
                    <p className="text-xs text-gray-500">Step {step} of 3</p>
                </div>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            {/* Stepper */}
            <div className="flex border-b border-gray-200 bg-white">
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${step === 1 ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>
                    1. Basic Details
                </div>
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${step === 2 ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>
                    2. Fee Heads
                </div>
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${step === 3 ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>
                    3. Installments
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 overflow-y-auto">

                {step === 1 && (
                    <div className="max-w-md mx-auto space-y-5 animate-slide-in">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Structure Name</label>
                            <input
                                type="text"
                                value={basicInfo.name}
                                onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                                placeholder="e.g. Standard Annual Fee 2025"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                                <select
                                    value={basicInfo.academicYear}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, academicYear: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none"
                                >
                                    <option>2025-26</option>
                                    <option>2024-25</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                <select
                                    value={basicInfo.branch}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, branch: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none"
                                >
                                    <option>Main Campus</option>
                                    <option>North Wing</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valid For (Class/Program)</label>
                            <input
                                type="text"
                                value={basicInfo.classOrProgram}
                                onChange={(e) => setBasicInfo({ ...basicInfo, classOrProgram: e.target.value })}
                                placeholder="e.g. Class 10 or B.Tech CS"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-2xl mx-auto animate-slide-in">
                        <FeeComponentsEditor components={components} onChange={setComponents} readOnly={false} />
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-2xl mx-auto animate-slide-in">
                        <div className="mb-6 bg-indigo-50 p-4 rounded-lg flex justify-between items-center text-indigo-900">
                            <span className="font-medium">Total Fee to Split:</span>
                            <span className="font-bold text-xl">${totalAmount.toLocaleString()}</span>
                        </div>
                        <InstallmentScheduler
                            totalAmount={totalAmount}
                            installments={installments}
                            onChange={setInstallments}
                            readOnly={false}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
                <div>
                    {step > 1 && (
                        <button onClick={handleBack} className="px-4 py-2 text-sm text-gray-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
                            Back
                        </button>
                    )}
                </div>

                <div>
                    {step < 3 ? (
                        <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                            Next Step <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button onClick={handleFinalSave} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                            <Save size={16} /> Save Structure
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default FeeStructureForm;
