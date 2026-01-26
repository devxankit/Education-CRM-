
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Save, Send, UploadCloud, Info } from 'lucide-react';
import AudienceSelector from './AudienceSelector';
import ChannelSelector from './ChannelSelector';

const NoticeFormStepper = ({ onClose, onPublish }) => {

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        title: '',
        category: 'ACADEMIC',
        priority: 'NORMAL',
        content: '',
        audiences: [],
        channels: ['APP'],
        ackRequired: false
    });

    // Handlers
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = (status) => {
        // status = 'DRAFT' | 'PUBLISHED'
        onPublish({ ...formData, status });
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col h-screen overflow-hidden animate-in slide-in-from-bottom duration-300">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">New Communication</div>
                    <h2 className="text-xl font-bold text-gray-900">Compose Notice</h2>
                </div>

                {/* Stepper Indicator (Desktop) */}
                <div className="hidden md:flex items-center gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`flex items-center gap-2 ${step >= i ? 'text-indigo-600' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= i ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                                {i}
                            </div>
                            {i < 4 && <div className={`w-12 h-0.5 ${step > i ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>}
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    {step < 4 ? (
                        <button onClick={nextStep} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                            Next Step <ChevronRight size={18} />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => handleSubmit('DRAFT')} className="px-4 py-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 font-medium">
                                Save Draft
                            </button>
                            <button onClick={() => handleSubmit('PUBLISHED')} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-bold shadow-md">
                                <Send size={18} /> Publish Now
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 md:p-8">

                {/* Step 1: Basics */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-lg font-bold text-gray-800">1. Basic Details</h3>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 text-lg font-medium placeholder-gray-300"
                                    placeholder="Enter a clear subject line..."
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => updateField('category', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm p-2.5"
                                    >
                                        <option value="ACADEMIC">Academic</option>
                                        <option value="EXAM">Exam / Results</option>
                                        <option value="FEES">Fee Reminder</option>
                                        <option value="HOLIDAY">Holiday / Event</option>
                                        <option value="ADMINISTRATIVE">Administrative</option>
                                        <option value="EMERGENCY">Emergency Alert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        {['NORMAL', 'IMPORTANT', 'URGENT'].map(p => (
                                            <button
                                                key={p}
                                                onClick={() => updateField('priority', p)}
                                                className={`flex-1 text-xs font-bold py-2 rounded-md transition-all ${formData.priority === p
                                                        ? (p === 'URGENT' ? 'bg-white text-red-600 shadow-sm' : p === 'IMPORTANT' ? 'bg-white text-amber-600 shadow-sm' : 'bg-white text-indigo-600 shadow-sm')
                                                        : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Content */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-lg font-bold text-gray-800">2. Message Content</h3>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Body</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => updateField('content', e.target.value)}
                                    rows={10}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 font-normal text-gray-800 leading-relaxed"
                                    placeholder="Type your message details here. You can use standard formatting..."
                                />
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer">
                                <UploadCloud size={32} className="mb-2 text-gray-400" />
                                <span className="text-sm font-medium">Click to Attach Files (PDF, JPG, PNG)</span>
                                <span className="text-xs opacity-60 mt-1">Max size: 5MB</span>
                            </div>

                        </div>
                    </div>
                )}

                {/* Step 3: Audience */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-lg font-bold text-gray-800">3. Target Audience</h3>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <AudienceSelector
                                selectedAudiences={formData.audiences}
                                onUpdate={(audiences) => updateField('audiences', audiences)}
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Channels & Delivery */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-lg font-bold text-gray-800">4. Delivery Channels</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                                <ChannelSelector
                                    selectedChannels={formData.channels}
                                    onUpdate={(channels) => updateField('channels', channels)}
                                    priority={formData.priority}
                                />
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                                <h4 className="text-sm font-bold text-gray-700">Additional Settings</h4>

                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={formData.ackRequired}
                                        onChange={(e) => updateField('ackRequired', e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-800 text-sm">Require Acknowledgment</div>
                                        <div className="text-xs text-gray-500">Recipients must explicitly mark as 'Read'</div>
                                    </div>
                                </label>

                                {formData.ackRequired && (
                                    <div className="pl-8 text-xs text-indigo-600 flex items-center gap-1">
                                        <Info size={12} />
                                        System will track open rates and pending acknowledgments.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Mobile Navigation Footer (Sticky) */}
            <div className="md:hidden border-t border-gray-200 bg-white p-4 flex justify-between shrink-0">
                <button onClick={prevStep} disabled={step === 1} className="px-4 py-2 text-gray-500 disabled:opacity-30">
                    <ChevronLeft />
                </button>
                <span className="font-bold text-gray-500 py-2">Step {step} of 4</span>
                {step < 4 ? (
                    <button onClick={nextStep} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <ChevronRight />
                    </button>
                ) : (
                    <button onClick={() => handleSubmit('PUBLISHED')} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                        <Send size={18} />
                    </button>
                )}
            </div>

        </div>
    );
};

export default NoticeFormStepper;
