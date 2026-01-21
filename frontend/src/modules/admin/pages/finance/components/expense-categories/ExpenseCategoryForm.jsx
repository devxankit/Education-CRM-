
import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, ShieldCheck, X } from 'lucide-react';

const ExpenseCategoryForm = ({ category, onSave, onCancel }) => {

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'variable',
        budgetLimit: '',
        approvalRequired: false,
        isActive: true
    });

    useEffect(() => {
        if (category) {
            setFormData(category);
        } else {
            // Reset for new
            const randomCode = 'EXP-' + Math.floor(1000 + Math.random() * 9000);
            setFormData({
                name: '',
                code: randomCode,
                type: 'variable',
                budgetLimit: '',
                approvalRequired: false,
                isActive: true
            });
        }
    }, [category]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col bg-white">

            {/* Header removed, handled by drawer */}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Basic Details */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Classification</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g. Office Supplies"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code (Immutable)</label>
                            <input
                                type="text"
                                value={formData.code}
                                disabled
                                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none"
                            >
                                <option value="variable">Variable (One-off)</option>
                                <option value="fixed">Fixed (Recurring)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Controls */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Governance Controls</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget Limit (Optional)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input
                                type="number"
                                value={formData.budgetLimit}
                                onChange={(e) => handleChange('budgetLimit', e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Leave empty for unlimited spending.</p>
                    </div>

                    <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <input
                            type="checkbox"
                            id="approvalReq"
                            checked={formData.approvalRequired}
                            onChange={(e) => handleChange('approvalRequired', e.target.checked)}
                            className="mt-1 w-4 h-4 text-indigo-600 rounded"
                        />
                        <div>
                            <label htmlFor="approvalReq" className="block text-sm font-bold text-blue-900 flex items-center gap-2">
                                <ShieldCheck size={14} /> Require Manager Approval
                            </label>
                            <p className="text-xs text-blue-700 mt-1">
                                If enabled, expenses in this category must be approved by the Finance Head before payout.
                            </p>
                        </div>
                    </div>
                </div>

                {category && (
                    <div className="pt-4 mt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-100">
                            <div>
                                <span className="block text-sm font-bold text-red-800">Deactivate Category</span>
                                <p className="text-xs text-red-600">Prevents new expenses from being logged.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.isActive}
                                    onChange={(e) => handleChange('isActive', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm transition-transform active:scale-95">
                    <Save size={16} /> Save Changes
                </button>
            </div>

        </form>
    );
};

export default ExpenseCategoryForm;
