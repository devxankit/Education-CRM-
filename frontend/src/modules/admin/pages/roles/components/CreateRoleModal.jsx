
import React, { useState, useEffect } from 'react';
import { X, ShieldPlus, MapPin } from 'lucide-react';

const CreateRoleModal = ({ isOpen, onClose, onCreate, branches = [] }) => {

    // Initial State
    const defaultData = {
        name: '',
        code: '',
        description: '',
        branchId: 'all',
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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-['Poppins']">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                <ShieldPlus size={18} />
                            </div>
                            Define New Role
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 ml-9">Set up a new access level for your team</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Role Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Senior Accountant"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex justify-between">
                            System Code
                            <span className="text-gray-400 font-normal normal-case text-xs">(Auto-generated)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="code"
                                readOnly
                                value={formData.code}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-mono text-xs cursor-lock"
                            />
                            <div className="absolute right-3 top-2.5 text-gray-400">
                                <ShieldPlus size={14} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <MapPin size={14} className="text-indigo-500" /> Branch
                        </label>
                        <select
                            name="branchId"
                            value={formData.branchId || 'all'}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                        >
                            <option value="all">All Branches</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1">Assign this role to a specific branch or all branches</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            placeholder="Briefly describe the responsibilities and access level of this role..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none text-sm transition-all"
                        ></textarea>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200 transition-all transform active:scale-95"
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
