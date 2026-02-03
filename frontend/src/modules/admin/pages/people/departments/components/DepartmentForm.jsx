
import React, { useState, useEffect } from 'react';
import { Save, Building, Users, MoreHorizontal, Plus } from 'lucide-react';
import DesignationList from './DesignationList';
import { useAdminStore } from '../../../../../../store/adminStore';

const DepartmentForm = ({ department: initialData, onSave, onDelete }) => {
    const { addToast } = useAdminStore();

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

    const [editingDesignation, setEditingDesignation] = useState(null);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            addToast('Department Name is required', 'error');
            return;
        }
        if (!formData.code.trim()) {
            addToast('Department Code is required', 'error');
            return;
        }
        onSave(formData);
    };

    // Designation Handlers
    const handleAddDesignation = () => {
        const newDes = {
            name: 'New Role',
            code: `DES-${Math.floor(Math.random() * 1000)}`,
            level: 1,
            reportsTo: '',
            status: 'Active'
        };
        setFormData(prev => ({ ...prev, designations: [...(prev.designations || []), newDes] }));
    };

    const handleDeleteDesignation = (index) => {
        if (window.confirm('Remove this designation?')) {
            const newDesignations = [...formData.designations];
            newDesignations.splice(index, 1);
            setFormData(prev => ({ ...prev, designations: newDesignations }));
        }
    };

    const handleEditDesignation = (des, index) => {
        setEditingDesignation({ ...des, index });
    };

    const saveDesignationEdit = () => {
        const newDesignations = [...formData.designations];
        newDesignations[editingDesignation.index] = {
            name: editingDesignation.name,
            code: editingDesignation.code,
            level: editingDesignation.level,
            reportsTo: editingDesignation.reportsTo,
            status: editingDesignation.status
        };
        setFormData(prev => ({ ...prev, designations: newDesignations }));
        setEditingDesignation(null);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await onDelete(initialData._id);
            } catch (error) {
                addToast('Failed to delete department', 'error');
            }
        }
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
                        <button 
                            onClick={handleDelete}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
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
                        onEdit={handleEditDesignation}
                        onDelete={handleDeleteDesignation}
                    />

                    {/* Designation Edit Modal/Form Overlay */}
                    {editingDesignation && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-800">Edit Designation</h4>
                                    <button onClick={() => setEditingDesignation(null)} className="text-gray-400 hover:text-gray-600">×</button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Designation Name</label>
                                        <input
                                            type="text"
                                            value={editingDesignation.name}
                                            onChange={(e) => setEditingDesignation({ ...editingDesignation, name: e.target.value })}
                                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code</label>
                                            <input
                                                type="text"
                                                value={editingDesignation.code}
                                                onChange={(e) => setEditingDesignation({ ...editingDesignation, code: e.target.value })}
                                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                                            <input
                                                type="number"
                                                value={editingDesignation.level}
                                                onChange={(e) => setEditingDesignation({ ...editingDesignation, level: parseInt(e.target.value) })}
                                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                        <select
                                            value={editingDesignation.status}
                                            onChange={(e) => setEditingDesignation({ ...editingDesignation, status: e.target.value })}
                                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                                    <button
                                        onClick={() => setEditingDesignation(null)}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveDesignationEdit}
                                        className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
                                    >
                                        Save Designation
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
