
import React, { useState, useEffect } from 'react';
import { X, ShieldPlus, Copy } from 'lucide-react';

const CreateRoleModal = ({ isOpen, onClose, onCreate }) => {

    // Initial State
    const defaultData = {
        name: '',
        code: '',
        description: '',
        defaultDashboard: '/staff/dashboard',
        cloneFrom: '' // Optional
    };

    const [formData, setFormData] = useState(defaultData);

    // Auto-generate Code from Name
    useEffect(() => {
        if (formData.name) {
            const autoCode = 'ROLE_' + formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
            setFormData(prev => ({ ...prev, code: autoCode }));
        }
    }, [formData.name]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        setFormData(defaultData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <ShieldPlus size={20} /> Define New Role
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                        <select
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-sm"
                        >
                            <option value="">Select a Role...</option>
                            <option value="Front Desk">Front Desk</option>
                            <option value="Accounts Officer">Accounts Officer</option>
                            <option value="Transport Coordinator">Transport Coordinator</option>
                            <option value="Data Entry Operator">Data Entry Operator</option>
                            <option value="Support Executive">Support Executive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">System Code (Auto)</label>
                        <input
                            type="text"
                            name="code"
                            readOnly
                            value={formData.code}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-mono text-xs cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="2"
                            placeholder="Briefly describe what this role does..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Dashboard</label>
                            <select
                                name="defaultDashboard"
                                value={formData.defaultDashboard}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-sm"
                            >
                                <option value="/staff/dashboard">Staff Dashboard</option>
                                <option value="/teacher/dashboard">Teacher Dashboard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">Clone Perms <Copy size={12} /></label>
                            <select
                                name="cloneFrom"
                                value={formData.cloneFrom}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-sm"
                            >
                                <option value="">(None - Blank)</option>
                                <option value="teacher">Teacher (System)</option>
                                <option value="accountant">Accountant (System)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm"
                        >
                            Create Role
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateRoleModal;
