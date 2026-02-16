import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const CreateChecklistModal = ({ onClose, onSave }) => {

    const [formData, setFormData] = useState({
        title: '',
        targetRole: 'student',
        description: '',
        isActive: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, items: [] });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4">

                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Create New Checklist</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Checklist Title <span className='text-red-500'>*</span></label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Student Admission 2025"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Target Audience</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                            value={formData.targetRole}
                            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher / Staff</option>
                            <option value="parent">Parent</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows="3"
                            placeholder="Brief purpose of this checklist..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md"
                        >
                            <Save size={18} /> Create Draft
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateChecklistModal;
