import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, MapPin } from 'lucide-react';

const ExpenseCategoryForm = ({ category, onSave, onCancel, branches = [], defaultBranchId = '' }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'variable',
        budgetLimit: '',
        branchId: '',
        approvalRequired: false,
        isActive: true
    });

    useEffect(() => {
        if (category) {
            setFormData(prev => ({
                ...category,
                branchId: category.branchId?._id || category.branchId || prev.branchId
            }));
        } else {
            const randomCode = 'EXP-' + Math.floor(1000 + Math.random() * 9000);
            setFormData({
                name: '',
                code: randomCode,
                type: 'variable',
                budgetLimit: '',
                branchId: defaultBranchId || (branches[0]?._id || ''),
                approvalRequired: false,
                isActive: true
            });
        }
    }, [category, defaultBranchId, branches]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col bg-white font-['Inter']">

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-gray-100">

                {/* Basic Details */}
                <div className="space-y-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Classification</h3>

                    {branches.length > 0 && (
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <MapPin size={12} /> Branch <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.branchId || ''}
                                onChange={(e) => handleChange('branchId', e.target.value)}
                                disabled={!!category}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-gray-700 cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
                            >
                                <option value="">Select Branch</option>
                                {branches.map((b) => (
                                    <option key={b._id} value={b._id}>{b.name || b.code || b._id}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Category Name <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g. Office Supplies"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Cost Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-gray-700 cursor-pointer"
                        >
                            <option value="variable">Variable (One-off)</option>
                            <option value="fixed">Fixed (Recurring)</option>
                        </select>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                {/* Controls */}
                <div className="space-y-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Compliance & Limits</h3>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Monthly Budget Limit</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold transition-colors group-focus-within:text-indigo-500">₹</span>
                            <input
                                type="number"
                                value={formData.budgetLimit}
                                onChange={(e) => handleChange('budgetLimit', e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono font-bold text-gray-700 placeholder:text-gray-200"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertTriangle size={10} className="text-amber-400" />
                            Leave empty for zero restriction.
                        </p>
                    </div>

                </div>

                {category && (
                    <div className="pt-6 border-t border-gray-50">
                        <div className="group flex justify-between items-center bg-rose-50/30 p-5 rounded-2xl border border-rose-50 hover:bg-rose-50/50 transition-all">
                            <div>
                                <span className="block text-sm font-bold text-rose-800">Operational Status</span>
                                <p className="text-xs text-rose-600 font-medium">If deactivated, new vouchers cannot be linked.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.isActive}
                                    onChange={(e) => handleChange('isActive', e.target.checked)}
                                />
                                <div className="w-12 h-6.5 bg-rose-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                            </label>
                        </div>
                    </div>
                )}

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
                    {category ? 'Update Category' : 'Create Category'}
                </button>
            </div>

        </form>
    );
};

export default ExpenseCategoryForm;
