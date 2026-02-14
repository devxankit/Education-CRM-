
import React, { useState, useEffect } from 'react';
import { Save, Building, Plus, Trash2, Briefcase } from 'lucide-react';
import DesignationList from './DesignationList';
import { useAdminStore } from '../../../../../../store/adminStore';

const genCode = (prefix) => `${prefix}-${Date.now().toString(36).slice(-4).toUpperCase()}`;

const DepartmentForm = ({ department: initialData, onSave, onDelete }) => {
    const { addToast } = useAdminStore();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        code: genCode('DEPT'),
        type: 'Academic',
        status: 'Active',
        description: '',
        designations: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                designations: initialData.designations || []
            });
            setActiveTab((initialData.designations?.length ?? 0) === 0 ? 'designations' : 'details');
        } else {
            setFormData({
                name: '',
                code: genCode('DEPT'),
                type: 'Academic',
                status: 'Active',
                description: '',
                designations: []
            });
            setActiveTab('details');
        }
    }, [initialData?._id]);

    const [editingDesignation, setEditingDesignation] = useState(null);
    const [isAddingDesignation, setIsAddingDesignation] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'designations'

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            addToast('Department name is required', 'error');
            return;
        }
        if (!formData.code?.trim()) {
            addToast('Department code is required', 'error');
            return;
        }
        const codes = (formData.designations || []).map(d => (d.code || '').toUpperCase());
        if (new Set(codes).size !== codes.length) {
            addToast('Duplicate designation codes are not allowed', 'error');
            return;
        }
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    const [newDesignation, setNewDesignation] = useState({
        name: '',
        code: '',
        level: 1,
        reportsTo: '',
        status: 'Active'
    });

    const handleOpenAddDesignation = () => {
        setNewDesignation({
            name: '',
            code: genCode('DES'),
            level: 1,
            reportsTo: '',
            status: 'Active'
        });
        setIsAddingDesignation(true);
    };

    const handleSaveNewDesignation = () => {
        if (!newDesignation.name?.trim()) {
            addToast('Designation name is required', 'error');
            return;
        }
        const code = newDesignation.code?.toUpperCase().trim();
        if (!code) {
            addToast('Designation code is required', 'error');
            return;
        }
        const exists = (formData.designations || []).some(d => (d.code || '').toUpperCase() === code);
        if (exists) {
            addToast('A designation with this code already exists', 'error');
            return;
        }
        setFormData(prev => ({
            ...prev,
            designations: [...(prev.designations || []), {
                name: newDesignation.name.trim(),
                code,
                level: Number(newDesignation.level) || 1,
                reportsTo: newDesignation.reportsTo?.trim() || '',
                status: newDesignation.status || 'Active'
            }]
        }));
        setIsAddingDesignation(false);
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
        if (!editingDesignation.name?.trim()) {
            addToast('Designation name is required', 'error');
            return;
        }
        const code = (editingDesignation.code || '').toUpperCase().trim();
        if (!code) {
            addToast('Designation code is required', 'error');
            return;
        }
        const duplicate = (formData.designations || []).some((d, i) =>
            i !== editingDesignation.index && (d.code || '').toUpperCase() === code
        );
        if (duplicate) {
            addToast('A designation with this code already exists', 'error');
            return;
        }
        const newDesignations = [...formData.designations];
        newDesignations[editingDesignation.index] = {
            name: editingDesignation.name.trim(),
            code,
            level: Number(editingDesignation.level) || 1,
            reportsTo: editingDesignation.reportsTo?.trim() || '',
            status: editingDesignation.status || 'Active'
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
            <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-start gap-4 bg-gradient-to-r from-indigo-50/50 to-white">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 rounded-lg bg-indigo-100">
                            <Building className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {initialData ? (formData.name || 'Department') : 'New Department'}
                            </h2>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                                {formData.code || '—'} • {formData.type || 'Academic'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {initialData && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            title="Delete department"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    >
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50/50 px-6">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors -mb-px ${
                        activeTab === 'details'
                            ? 'border-indigo-600 text-indigo-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <Building size={14} /> Department Details
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('designations')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors -mb-px flex items-center gap-2 ${
                        activeTab === 'designations'
                            ? 'border-indigo-600 text-indigo-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Briefcase size={14} /> Designations
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {(formData.designations || []).length}
                    </span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {activeTab === 'details' && (
                <div className="p-6 md:p-8 space-y-6">
                <section className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department Code *</label>
                        <input
                            type="text"
                            value={formData.code || ''}
                            onChange={(e) => handleChange('code', e.target.value.toUpperCase().replace(/\s/g, ''))}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
                            placeholder="e.g. CS, DEPT-001"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Academic">Academic</option>
                            <option value="Administrative">Administrative</option>
                            <option value="Operations">Operations</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                        <select
                            value={formData.status || 'Active'}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Mandate (Optional)</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows="2"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="Primary responsibilities of this department..."
                        />
                    </div>
                    </div>
                </section>

                {/* Usage stats - only in details tab when editing */}
                {initialData && (
                    <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-5">
                        <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-3">Usage</h3>
                        <div className="flex flex-wrap gap-8 text-sm">
                            <div>
                                <span className="block text-2xl font-bold text-indigo-900">{initialData.employeeCount ?? 0}</span>
                                <span className="text-indigo-600 text-xs">Active Employees</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-bold text-indigo-900">{(formData.designations || []).length}</span>
                                <span className="text-indigo-600 text-xs">Designations</span>
                            </div>
                        </div>
                    </div>
                )}
                </div>
                )}

                {activeTab === 'designations' && (
                <div className="p-6 md:p-8">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <p className="text-sm text-gray-600">Add roles like Lecturer, HOD, Accountant for this department.</p>
                        <button
                            onClick={handleOpenAddDesignation}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
                        >
                            <Plus size={16} /> Add Designation
                        </button>
                    </div>

                    <DesignationList
                        designations={formData.designations || []}
                        onEdit={handleEditDesignation}
                        onDelete={handleDeleteDesignation}
                        onAdd={handleOpenAddDesignation}
                    />
                </section>
                </div>
                )}
            </div>

            {/* Modals - outside tabs so they stay visible when switching */}
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
                                                onChange={(e) => setEditingDesignation({ ...editingDesignation, code: e.target.value.toUpperCase() })}
                                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={editingDesignation.level}
                                                onChange={(e) => setEditingDesignation({ ...editingDesignation, level: parseInt(e.target.value) || 1 })}
                                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reports To (Optional)</label>
                                        <input
                                            type="text"
                                            value={editingDesignation.reportsTo || ''}
                                            onChange={(e) => setEditingDesignation({ ...editingDesignation, reportsTo: e.target.value })}
                                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g. HOD, Principal"
                                        />
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

            {isAddingDesignation && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-800">Add Designation</h4>
                                    <button onClick={() => setIsAddingDesignation(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Designation Name *</label>
                                        <input
                                            type="text"
                                            value={newDesignation.name}
                                            onChange={(e) => setNewDesignation({ ...newDesignation, name: e.target.value })}
                                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g. Senior Lecturer"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code *</label>
                                            <input
                                                type="text"
                                                value={newDesignation.code}
                                                onChange={(e) => setNewDesignation({ ...newDesignation, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
                                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
                                                placeholder="e.g. SLEC"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newDesignation.level}
                                                onChange={(e) => setNewDesignation({ ...newDesignation, level: parseInt(e.target.value) || 1 })}
                                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reports To (Optional)</label>
                                        <input
                                            type="text"
                                            value={newDesignation.reportsTo}
                                            onChange={(e) => setNewDesignation({ ...newDesignation, reportsTo: e.target.value })}
                                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g. HOD, Principal"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                        <select
                                            value={newDesignation.status}
                                            onChange={(e) => setNewDesignation({ ...newDesignation, status: e.target.value })}
                                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsAddingDesignation(false)}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveNewDesignation}
                                        className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
                                    >
                                        Add Designation
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
        </div>
    );
};

export default DepartmentForm;
