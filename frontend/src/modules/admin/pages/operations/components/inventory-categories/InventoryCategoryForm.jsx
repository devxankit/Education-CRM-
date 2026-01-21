
import React, { useState, useEffect } from 'react';
import { Save, Layers, AlertTriangle } from 'lucide-react';

const InventoryCategoryForm = ({ category: initialData, onSave, onCancel }) => {

    const [formData, setFormData] = useState({
        name: '',
        code: `CAT-${Math.floor(Math.random() * 10000)}`,
        type: 'Asset', // Asset | Consumable
        trackingType: 'Item-based', // Item-based | Quantity-based
        serialRequired: true,
        depreciation: false,
        depMethod: 'Straight Line',
        status: 'Active',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTypeChange = (value) => {
        // Auto-set defaults based on type
        if (value === 'Consumable') {
            setFormData(prev => ({
                ...prev,
                type: value,
                trackingType: 'Quantity-based',
                serialRequired: false,
                depreciation: false
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                type: value,
                trackingType: 'Item-based',
                serialRequired: true
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="p-6 flex-1 overflow-y-auto space-y-6">

                {/* Basic Info */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <Layers size={14} /> Basic Classification
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="e.g. IT Equipment"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Code</label>
                                <input
                                    type="text"
                                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-500 font-mono"
                                    value={formData.code}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.type}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                >
                                    <option value="Asset">Asset (Fixed)</option>
                                    <option value="Consumable">Consumable</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Tracking Rules */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Inventory Tracking</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleChange('trackingType', 'Item-based')}
                                    className={`p-3 text-left border rounded-lg transition-all ${formData.trackingType === 'Item-based' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <span className="block text-sm font-bold text-gray-800">Item-based</span>
                                    <span className="text-xs text-gray-500">Track unique assets (Laptops)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange('trackingType', 'Quantity-based')}
                                    className={`p-3 text-left border rounded-lg transition-all ${formData.trackingType === 'Quantity-based' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <span className="block text-sm font-bold text-gray-800">Quantity-based</span>
                                    <span className="text-xs text-gray-500">Track bulk counts (Pens)</span>
                                </button>
                            </div>
                        </div>

                        {formData.trackingType === 'Item-based' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="serial"
                                    checked={formData.serialRequired}
                                    onChange={(e) => handleChange('serialRequired', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                                />
                                <label htmlFor="serial" className="text-sm text-gray-700">Enforce Serial Number requirement</label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Financials - Only for Assets */}
                {formData.type === 'Asset' && (
                    <>
                        <hr className="border-gray-100" />
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Financial Configuration</h4>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Depreciation Applicable</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.depreciation}
                                            onChange={(e) => handleChange('depreciation', e.target.checked)}
                                        />
                                        <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600`}></div>
                                    </label>
                                </div>

                                {formData.depreciation && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Depreciation Method</label>
                                        <select
                                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={formData.depMethod}
                                            onChange={(e) => handleChange('depMethod', e.target.value)}
                                        >
                                            <option value="Straight Line">Straight Line</option>
                                            <option value="Written Down Value">Written Down Value</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <hr className="border-gray-100" />

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                    <textarea
                        rows="3"
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                    ></textarea>
                </div>

            </div>

            {/* Footer */}
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
                    <Save size={16} /> Save Category
                </button>
            </div>
        </form>
    );
};

export default InventoryCategoryForm;
