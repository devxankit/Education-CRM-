
import React, { useState, useEffect } from 'react';
import { Save, Building, Users, MoreHorizontal, Plus } from 'lucide-react';
import DesignationList from './DesignationList';

const DepartmentForm = ({ department: initialData, onSave, onDelete }) => {

    // Mode: View/Edit existing or Create New
    // If ID exists, it's edit.

    const [formData, setFormData] = useState({
        name: '',
        code: `DEPT-${Math.floor(Math.random() * 1000)}`,
        type: 'Academic',
        status: 'Active',
        description: '',
        designations: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                code: `DEPT-${Math.floor(Math.random() * 1000)}`,
                type: 'Academic',
                status: 'Active',
                description: '',
                designations: []
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    // Designation Mock Handlers
    const handleAddDesignation = () => {
        const newDes = {
            id: Date.now(),
            name: 'New Role',
            code: 'DES-NEW',
            level: 1,
            reportsTo: '',
            status: 'Active',
            employeeCount: 0
        };
        setFormData(prev => ({ ...prev, designations: [...prev.designations, newDes] }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">

            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Building className="text-indigo-600" size={20} />
                        <h2 className="text-xl font-bold text-gray-900">{initialData ? formData.name : 'New Department'}</h2>
                    </div>
                    <p className="text-xs text-gray-500 font-mono pl-7">{formData.code} • {formData.type}</p>
                </div>
                <div className="flex gap-2">
                    {initialData && (
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm font-bold text-sm"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">

                {/* 1. Department Details */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Computer Science"
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Academic">Academic</option>
                            <option value="Administrative">Administrative</option>
                            <option value="Operations">Operations</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Mandate</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows="2"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="Primary responsibilities of this department..."
                        ></textarea>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* 2. Hierarchical Designations */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <Users size={16} className="text-gray-400" /> Organizational Hierarchy
                        </h4>
                        <button
                            onClick={handleAddDesignation}
                            className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                            <Plus size={14} /> Add Designation
                        </button>
                    </div>

                    <DesignationList
                        designations={formData.designations || []}
                        onEdit={(des) => alert(`Edit ${des.name} - Modal to be implemented`)}
                    />
                </div>

                {/* 3. System Stats (Read Only) */}
                {initialData && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">System Impact</h4>
                        <div className="flex gap-6 text-sm">
                            <div>
                                <span className="block font-bold text-blue-900">{initialData.employeeCount || 0}</span>
                                <span className="text-blue-600 text-xs">Active Employees</span>
                            </div>
                            <div>
                                <span className="block font-bold text-blue-900">3</span>
                                <span className="text-blue-600 text-xs">Payroll Rules</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DepartmentForm;
