
import React, { useState, useEffect } from 'react';
import { X, Save, Percent, IndianRupee, Layers, FileText } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';
import { useAppStore } from '../../../../../../store/index';

const TaxForm = ({ tax, onSave, onCancel }) => {
    const { branches, fetchBranches } = useAdminStore();
    const { user } = useAppStore();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        rate: '',
        type: 'percentage',
        applicableOn: 'fees',
        branchId: user?.branchId || '',
        isActive: true
    });

    useEffect(() => {
        fetchBranches();
        if (tax) {
            setFormData({
                name: tax.name || '',
                code: tax.code || '',
                description: tax.description || '',
                rate: tax.rate || '',
                type: tax.type || 'percentage',
                applicableOn: tax.applicableOn || 'fees',
                branchId: tax.branchId?._id || tax.branchId || user?.branchId || '',
                isActive: tax.isActive !== undefined ? tax.isActive : true
            });
        }
    }, [tax, branches.length, user?.branchId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col bg-white font-['Inter']">
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-gray-100">

                {/* Basic Info Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <FileText size={18} />
                        </div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Tax Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Tax Name</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. GST (Standard)"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Tax Code</label>
                            <input
                                required
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="e.g. GST-18"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium uppercase"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description (Optional)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Add a brief description for this tax rule..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Configuration Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Layers size={18} />
                        </div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Tax Rate</label>
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-indigo-900"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    {formData.type === 'percentage' ? <Percent size={18} /> : <span className="font-bold">₹</span>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Rate Type</label>
                            <div className="flex p-1 bg-gray-50 border border-gray-200 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, type: 'percentage' }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'percentage' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Percent size={14} /> Percentage
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, type: 'flat' }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'flat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <IndianRupee size={14} /> Fixed Amount
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Applicable On</label>
                            <select
                                name="applicableOn"
                                value={formData.applicableOn}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="fees">Tuition Fees</option>
                                <option value="transport">Transport Charges</option>
                                <option value="admission">Admission Fees</option>
                                <option value="hostel">Hostel Fees</option>
                                <option value="all">All Charges</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Branch</label>
                            <select
                                required
                                name="branchId"
                                value={formData.branchId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                            <Save size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-900">Active Rule</p>
                            <p className="text-xs text-gray-500">Enable or disable this tax calculation instantly.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3 shrink-0">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                >
                    Discard Changes
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all active:scale-95 hover:-translate-y-0.5"
                >
                    <Save size={18} />
                    {tax ? 'Update Tax Rule' : 'Create Tax Rule'}
                </button>
            </div>
        </form>
    );
};

export default TaxForm;
