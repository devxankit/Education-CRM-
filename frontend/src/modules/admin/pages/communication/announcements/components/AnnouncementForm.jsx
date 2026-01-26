
import React, { useState } from 'react';
import { X, Send, Save, AlertCircle } from 'lucide-react';
import AudienceSelector from './AudienceSelector';
import ChannelSelector from './ChannelSelector';

const AnnouncementForm = ({ onClose, onPublish }) => {

    // Single page form instead of stepper
    const [formData, setFormData] = useState({
        title: '',
        category: 'GENERAL',
        content: '',
        audiences: [],
        channels: ['APP'],
        isEmergency: false
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setFormData(prev => ({
            ...prev,
            category: val,
            isEmergency: val === 'EMERGENCY'
        }));
    };

    const handleSubmit = (status) => {
        if (!formData.title || !formData.content) return alert("Please fill title and content");
        if (formData.audiences.length === 0) return alert("Please select audience");

        onPublish({ ...formData, status });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">New Announcement</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">

                    {/* 1. Basic Info */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Headline <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 font-medium placeholder-gray-400"
                                placeholder="What's happening?"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={handleCategoryChange}
                                className="w-full rounded-md border-gray-300 shadow-sm py-2 px-3 text-sm"
                            >
                                <option value="GENERAL">General Info</option>
                                <option value="EVENT">Event / Activity</option>
                                <option value="ACADEMIC">Academic Update</option>
                                <option value="SPORTS">Sports & Cultural</option>
                                <option value="ADMINISTRATIVE">Administrative</option>
                                <option value="EMERGENCY">Emergency (FYI Only)</option>
                            </select>
                        </div>
                    </div>

                    {/* 2. Content */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message Content <span className="text-red-500">*</span></label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => updateField('content', e.target.value)}
                            rows={6}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-sm leading-relaxed"
                            placeholder="Type your announcement details..."
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] text-gray-400">Attachments allowed after creation</span>
                            <span className={`text-[10px] font-medium ${formData.content.length > 160 ? 'text-orange-500' : 'text-gray-400'}`}>
                                {formData.content.length} chars
                            </span>
                        </div>
                    </div>

                    {/* 3. Target Audience */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Broadcast To</label>
                        <AudienceSelector
                            selectedAudiences={formData.audiences}
                            onUpdate={(list) => updateField('audiences', list)}
                        />
                    </div>

                    {/* 4. Delivery */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Delivery Method</label>
                        <ChannelSelector
                            selectedChannels={formData.channels}
                            onUpdate={(list) => updateField('channels', list)}
                            isEmergency={formData.isEmergency}
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
                    <button onClick={() => handleSubmit('DRAFT')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                        Save as Draft
                    </button>
                    <button
                        onClick={() => handleSubmit('PUBLISHED')}
                        className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2"
                    >
                        <Send size={16} /> Broadcast Now
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AnnouncementForm;
