
import React, { useState, useEffect } from 'react';
import { Save, Calendar, Tag, DollarSign, MapPin } from 'lucide-react';
import AssetStatusBadge from './AssetStatusBadge';

const AssetForm = ({ asset: initialData, onSave, onCancel, readOnly }) => {

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: `AST-${Math.floor(Math.random() * 100000)}`,
        category: '',
        status: 'Available',
        serialNumber: '',
        model: '',
        location: 'Storage A',
        assignedTo: '',
        purchaseDate: '',
        consultant: '',
        value: 0,
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        if (readOnly) return;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isAssigned = formData.status === 'Assigned';

    return (
        <div className="flex flex-col h-full bg-white">

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Header Section in Form */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{initialData ? formData.name : 'New Asset'}</h3>
                        <p className="text-xs text-gray-500 font-mono">{formData.code}</p>
                    </div>
                    <AssetStatusBadge status={formData.status} />
                </div>

                {/* Assignment Banner (if Assigned) */}
                {isAssigned && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex items-center gap-2">
                        <span className="font-bold">Currently Assigned to:</span> {formData.assignedTo || 'Unknown'}
                        <span className="text-xs text-blue-500 ml-auto block">Managed via Allocation Module</span>
                    </div>
                )}

                <hr className="border-gray-100" />

                {/* 1. Identification */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <Tag size={14} /> Item Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                disabled={readOnly || isAssigned}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="e.g. MacBook Pro 16"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                disabled={readOnly || isAssigned}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                            >
                                <option value="">Select Category</option>
                                <option value="IT Assets">IT Assets</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Lab Equipment">Lab Equipment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model / Make</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                disabled={readOnly}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                            <input
                                type="text"
                                value={formData.serialNumber}
                                onChange={(e) => handleChange('serialNumber', e.target.value)}
                                disabled={readOnly || isAssigned}
                                placeholder="SN-XXXXXXXX"
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase placeholder:normal-case disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Location & Status */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <MapPin size={14} /> Tracking
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                            <select
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                disabled={readOnly || isAssigned} // Location usually tied to assignment
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                            >
                                <option value="Storage A">Storage A</option>
                                <option value="Storage B">Storage B</option>
                                <option value="IT Room 1">IT Room 1</option>
                                <option value="Classroom 5B">Classroom 5B</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Override</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                disabled={readOnly || isAssigned} // Cannot override assigned status manually easily
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                            >
                                <option value="Available">Available</option>
                                <option value="Under Maintenance">Under Maintenance</option>
                                <option value="Damaged">Damaged</option>
                                <option value="Lost">Lost</option>
                                <option value="Retired">Retired</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. Financials */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <DollarSign size={14} /> Financials
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.purchaseDate}
                                    onChange={(e) => handleChange('purchaseDate', e.target.value)}
                                    disabled={readOnly}
                                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                                />
                                <Calendar size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Cost</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                                <input
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) => handleChange('value', Number(e.target.value))}
                                    disabled={readOnly}
                                    className="w-full text-sm border border-gray-300 rounded-lg pl-6 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {/* Footer Button - Hidden if readOnly */}
            {!readOnly && (
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                    >
                        <Save size={16} /> Save Asset
                    </button>
                </div>
            )}
        </div>
    );
};

export default AssetForm;
