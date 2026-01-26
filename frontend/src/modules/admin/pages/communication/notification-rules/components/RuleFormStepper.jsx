
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Save, Zap, Users, Sliders, CheckCircle } from 'lucide-react';

const RuleFormStepper = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);

    // Mocks
    const triggers = {
        'ATTENDANCE': ['Student Marked Absent', 'Late Arrival'],
        'FEES': ['Fee Invoice Generated', 'Payment Overdue'],
        'EXAMS': ['Result Published', 'Exam Schedule Updated'],
        'SYSTEM': ['New Login from Unknown Device', 'Password Changed']
    };

    const [formData, setFormData] = useState({
        name: '',
        module: 'FEES',
        trigger: 'Payment Overdue',
        conditionVal: 3, // e.g. 3 days overdue
        audience: ['PARENTS'],
        channels: ['SMS', 'EMAIL'],
        status: 'DRAFT'
    });

    const updateField = (f, v) => setFormData(p => ({ ...p, [f]: v }));

    const nextStep = () => setStep(p => p + 1);
    const prevStep = () => setStep(p => p - 1);

    const handleSubmit = () => {
        onSave({ ...formData, status: 'ACTIVE' });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Automation Engine</div>
                        <h2 className="text-xl font-bold text-gray-900">Configure Notification Rule</h2>
                    </div>

                    {/* Steps Indicator */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`flex items-center gap-2 ${step >= i ? 'text-indigo-600' : 'text-gray-300'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= i ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                                    {i}
                                </div>
                                {i < 3 && <div className={`w-12 h-0.5 ${step > i ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">

                    {/* Step 1: Definition */}
                    {step === 1 && (
                        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-8">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Zap size={20} className="text-indigo-600" /> Defining the Trigger
                            </h3>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 p-2.5"
                                        placeholder="e.g. Fee Overdue Alert"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Module</label>
                                        <select
                                            value={formData.module}
                                            onChange={(e) => updateField('module', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm p-2.5"
                                        >
                                            {Object.keys(triggers).map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Trigger</label>
                                        <select
                                            value={formData.trigger}
                                            onChange={(e) => updateField('trigger', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm p-2.5"
                                        >
                                            {triggers[formData.module]?.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                                <span className="font-bold">Logic:</span> IF <b>{formData.module}</b> detects event <b>"{formData.trigger}"</b>...
                            </div>
                        </div>
                    )}

                    {/* Step 2: Conditions & Audience */}
                    {step === 2 && (
                        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-8">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Sliders size={20} className="text-indigo-600" /> Conditions & Audience
                            </h3>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delay Condition (Wait Time)</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={formData.conditionVal}
                                            onChange={(e) => updateField('conditionVal', e.target.value)}
                                            className="w-24 rounded-lg border-gray-300 shadow-sm p-2.5"
                                        />
                                        <span className="text-gray-500 text-sm">Days after event occurs</span>
                                    </div>
                                </div>

                                <hr />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                    <div className="flex gap-3">
                                        {['STUDENTS', 'PARENTS', 'TEACHERS'].map(aud => (
                                            <button
                                                key={aud}
                                                onClick={() => {
                                                    const newArr = formData.audience.includes(aud)
                                                        ? formData.audience.filter(a => a !== aud)
                                                        : [...formData.audience, aud];
                                                    updateField('audience', newArr);
                                                }}
                                                className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${formData.audience.includes(aud)
                                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {aud}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Action */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-8">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <CheckCircle size={20} className="text-indigo-600" /> Action & Activation
                            </h3>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Channels</label>
                                    <div className="flex gap-3">
                                        {['SMS', 'EMAIL', 'APP'].map(ch => (
                                            <button
                                                key={ch}
                                                onClick={() => {
                                                    const newArr = formData.channels.includes(ch)
                                                        ? formData.channels.filter(c => c !== ch)
                                                        : [...formData.channels, ch];
                                                    updateField('channels', newArr);
                                                }}
                                                className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${formData.channels.includes(ch)
                                                        ? 'bg-green-50 border-green-500 text-green-700'
                                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {ch}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-lg text-sm text-yellow-800 mt-4">
                                    <p><b>Note:</b> Ensure you have valid ACTIVE templates for the selected channels in the 'Templates' section. This rule will use the default template assigned to "{formData.trigger}".</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between shrink-0">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className="px-6 py-2 text-sm font-bold text-gray-600 disabled:opacity-30"
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2"
                        >
                            Next Step <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm flex items-center gap-2"
                        >
                            <Save size={16} /> Save & Activate Rule
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RuleFormStepper;
