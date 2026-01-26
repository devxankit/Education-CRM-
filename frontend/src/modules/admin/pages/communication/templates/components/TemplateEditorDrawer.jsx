
import React, { useState, useEffect } from 'react';
import { X, Save, Lock, Variable, Globe, Smartphone, Mail } from 'lucide-react';
import VariablePicker from './VariablePicker';
import TemplatePreview from './TemplatePreview';

const TemplateEditorDrawer = ({ isOpen, onClose, template, onSave }) => {

    const [formData, setFormData] = useState({
        name: '',
        channel: 'EMAIL',
        category: 'FEES',
        usageType: 'MANUAL',
        subject: '', // Used as Title for App
        content: '',
        status: 'DRAFT'
    });

    const [activeTab, setActiveTab] = useState('EDITOR'); // EDITOR | PREVIEW

    useEffect(() => {
        if (template) {
            setFormData(template);
        } else {
            // Reset for new
            setFormData({
                name: '',
                channel: 'EMAIL',
                category: 'FEES',
                usageType: 'MANUAL',
                subject: '',
                content: '',
                status: 'DRAFT'
            });
        }
    }, [template, isOpen]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const insertVariable = (variable) => {
        // Simple append - real editor needs cursor position
        setFormData(prev => ({ ...prev, content: prev.content + ' ' + variable }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.content) return alert("Please fill required fields");
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 w-full max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-right duration-300">

                {/* Left Panel: Editor Form (60%) */}
                <div className="w-full md:w-3/5 flex flex-col h-full bg-white border-r border-gray-200">

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {template?.id ? 'Edit Template' : 'New Template'}
                            {formData.status === 'LOCKED' && <Lock size={16} className="text-red-500" />}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* 1. Basic Settings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Template Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 text-sm py-2 px-3"
                                    placeholder="e.g. Fee Reminder - Term 1"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Channel</label>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    {['EMAIL', 'SMS', 'APP'].map(ch => (
                                        <button
                                            key={ch}
                                            onClick={() => updateField('channel', ch)}
                                            className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all ${formData.channel === ch
                                                    ? 'bg-white shadow-sm text-indigo-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {ch}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => updateField('category', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm text-sm"
                                >
                                    <option value="FEES">Fees</option>
                                    <option value="ATTENDANCE">Attendance</option>
                                    <option value="EXAMS">Exams / Results</option>
                                    <option value="DOCUMENTS">Documents</option>
                                    <option value="EMERGENCY">Emergency</option>
                                    <option value="SYSTEM">System</option>
                                </select>
                            </div>
                        </div>

                        {/* 2. Content Editor */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">

                            {(formData.channel === 'EMAIL' || formData.channel === 'APP') && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        {formData.channel === 'APP' ? 'Notification Title' : 'Email Subject'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => updateField('subject', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 text-sm py-2 px-3"
                                        placeholder="Enter subject line..."
                                    />
                                </div>
                            )}

                            {/* Variable Picker */}
                            <VariablePicker
                                category={formData.category}
                                onSelectVariable={insertVariable}
                            />

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Message Body
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => updateField('content', e.target.value)}
                                    rows={10}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 font-mono text-sm p-3 leading-relaxed"
                                    placeholder="Type your message here. Use variables from above."
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-gray-400">
                                        {formData.channel === 'SMS' ? 'Plain text only' : 'HTML supported'}
                                    </span>
                                    <span className={`text-[10px] font-bold ${formData.channel === 'SMS' && formData.content.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.content.length} chars
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={formData.status === 'LOCKED'}
                            className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={16} /> Save Template
                        </button>
                    </div>

                </div>

                {/* Right Panel: Live Preview (40%) */}
                <div className="hidden md:flex flex-col w-2/5 bg-gray-100 border-l border-gray-200 h-full relative">
                    <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 shadow-sm uppercase tracking-wide">
                        Live Preview
                    </div>

                    <div className="flex-1 flex items-center justify-center p-8 bg-grid-pattern">
                        <TemplatePreview
                            channel={formData.channel}
                            subject={formData.subject}
                            content={formData.content}
                        />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200 text-xs text-gray-500 text-center">
                        Preview shows sample data. Actual values will vary per recipient.
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TemplateEditorDrawer;
