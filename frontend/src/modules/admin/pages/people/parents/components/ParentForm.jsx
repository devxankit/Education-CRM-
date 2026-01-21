
import React, { useState, useEffect } from 'react';
import { Save, User, Phone, MapPin, Briefcase } from 'lucide-react';
import StudentLinkPanel from './StudentLinkPanel';

const ParentForm = ({ parent: initialData, onSave, onCancel }) => {

    const [formData, setFormData] = useState({
        name: '',
        relationship: 'Father', // Father, Mother, Guardian
        mobile: '',
        email: '',
        occupation: '',
        address: '',
        status: 'Active',
        linkedStudents: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Basic Info */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <User size={14} /> Basic Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. Robert Smith"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship <span className="text-red-500">*</span></label>
                            <select
                                value={formData.relationship}
                                onChange={(e) => handleChange('relationship', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Contact */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <Phone size={14} /> Contact Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                required
                                value={formData.mobile}
                                onChange={(e) => handleChange('mobile', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="+91 ...."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="parent@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <Briefcase size={14} /> Other Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                            <input
                                type="text"
                                value={formData.occupation}
                                onChange={(e) => handleChange('occupation', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                rows="1"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Student Links */}
                <StudentLinkPanel
                    links={formData.linkedStudents}
                    onUpdate={(updated) => handleChange('linkedStudents', updated)}
                />

            </div>

            {/* Footer Button */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                >
                    <Save size={16} /> Save Parent
                </button>
            </div>
        </form>
    );
};

export default ParentForm;
