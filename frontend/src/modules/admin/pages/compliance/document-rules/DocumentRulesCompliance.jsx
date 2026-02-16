import React, { useState, useEffect } from 'react';
import { Plus, FileCheck, FileX, AlertTriangle, Settings, Edit, Trash2, Eye, X, Save } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const APPLIES_TO_OPTIONS = [
    { value: 'students', label: 'Students' },
    { value: 'employees', label: 'Employees' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'all', label: 'All Users' },
];

const DocumentRulesCompliance = () => {
    const {
        branches,
        fetchBranches,
        fetchComplianceRules,
        createComplianceRule,
        updateComplianceRule,
        deleteComplianceRule,
        toggleComplianceRuleStatus,
    } = useAdminStore();

    const [loading, setLoading] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        documentTypes: [],
        validationRules: [],
        retention: '7 years',
        isActive: true,
        appliesTo: 'students',
    });
    const [documentTypesText, setDocumentTypesText] = useState('');
    const [validationRulesText, setValidationRulesText] = useState('');

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length && !selectedBranchId) setSelectedBranchId(branches[0]._id);
    }, [branches, selectedBranchId]);

    useEffect(() => {
        if (!selectedBranchId) return;
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchComplianceRules(selectedBranchId);
                setRules(Array.isArray(data) ? data : []);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedBranchId, fetchComplianceRules]);

    const openAdd = () => {
        setEditingRule(null);
        setFormData({
            name: '',
            description: '',
            documentTypes: [],
            validationRules: [],
            retention: '7 years',
            isActive: true,
            appliesTo: 'students',
        });
        setDocumentTypesText('');
        setValidationRulesText('');
        setShowFormModal(true);
    };

    const openEdit = (rule) => {
        setEditingRule(rule);
        setFormData({
            name: rule.name,
            description: rule.description || '',
            documentTypes: rule.documentTypes || [],
            validationRules: rule.validationRules || [],
            retention: rule.retention || '7 years',
            isActive: rule.isActive !== false,
            appliesTo: rule.appliesTo || 'students',
        });
        setDocumentTypesText((rule.documentTypes || []).join(', '));
        setValidationRulesText((rule.validationRules || []).join('\n'));
        setShowFormModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const documentTypes = documentTypesText
            ? documentTypesText.split(',').map((s) => s.trim()).filter(Boolean)
            : [];
        const validationRules = validationRulesText
            ? validationRulesText.split('\n').map((s) => s.trim()).filter(Boolean)
            : [];
        const payload = {
            ...formData,
            branchId: selectedBranchId,
            documentTypes,
            validationRules,
        };
        setLoading(true);
        try {
            if (editingRule) {
                await updateComplianceRule(editingRule._id, payload);
            } else {
                await createComplianceRule(payload);
            }
            const data = await fetchComplianceRules(selectedBranchId);
            setRules(Array.isArray(data) ? data : []);
            setShowFormModal(false);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (rule) => {
        try {
            await toggleComplianceRuleStatus(rule._id);
            const data = await fetchComplianceRules(selectedBranchId);
            setRules(Array.isArray(data) ? data : []);
            if (selectedRule?._id === rule._id) setSelectedRule({ ...rule, isActive: !rule.isActive });
        } catch (_) {}
    };

    const handleDelete = async (rule) => {
        if (!window.confirm('Are you sure you want to delete this compliance rule?')) return;
        try {
            await deleteComplianceRule(rule._id);
            const data = await fetchComplianceRules(selectedBranchId);
            setRules(Array.isArray(data) ? data : []);
            if (selectedRule?._id === rule._id) setSelectedRule(null);
        } catch (_) {}
    };

    const getAppliesToLabel = (type) => {
        const o = APPLIES_TO_OPTIONS.find((x) => x.value === type);
        return o ? o.label : type;
    };

    return (
        <div className="h-full flex flex-col pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Document Compliance Rules</h1>
                    <p className="text-gray-500 text-sm">Define validation, retention, and storage rules for documents.</p>
                </div>
                <div className="flex items-center gap-3">
                    {branches.length > 1 && (
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                            {branches.map((b) => (
                                <option key={b._id} value={b._id}>{b.name || b.branchName || b._id}</option>
                            ))}
                        </select>
                    )}
                    <button className="p-2 text-gray-500 hover:bg-white border border-gray-200 rounded-lg bg-gray-50">
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> Add Rule
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FileCheck size={20} /></div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{rules.length}</div>
                        <div className="text-xs text-gray-500">Total Rules</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><FileCheck size={20} /></div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{rules.filter((r) => r.isActive).length}</div>
                        <div className="text-xs text-gray-500">Active Rules</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={20} /></div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">—</div>
                        <div className="text-xs text-gray-500">Pending Reviews</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><FileX size={20} /></div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">—</div>
                        <div className="text-xs text-gray-500">Non-Compliant</div>
                    </div>
                </div>
            </div>

            {loading && !rules.length ? (
                <div className="text-center py-12 text-gray-500">Loading rules...</div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 flex-1">
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Rule Name</th>
                                        <th className="px-6 py-4 font-semibold">Applies To</th>
                                        <th className="px-6 py-4 font-semibold">Doc Types</th>
                                        <th className="px-6 py-4 font-semibold">Retention</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rules.map((rule) => (
                                        <tr
                                            key={rule._id}
                                            className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedRule?._id === rule._id ? 'bg-indigo-50' : ''}`}
                                            onClick={() => setSelectedRule(rule)}
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{rule.name}</p>
                                                    <p className="text-xs text-gray-500">{rule.description || '—'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                    {getAppliesToLabel(rule.appliesTo)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {(rule.documentTypes || []).length} types
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">{rule.retention || '—'}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(rule); }}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                                >
                                                    {rule.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); setSelectedRule(rule); }} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye size={16} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); openEdit(rule); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(rule); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {rules.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">No rules yet. Add a rule to get started.</div>
                        )}
                    </div>

                    {selectedRule && (
                        <div className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">{selectedRule.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{selectedRule.description || '—'}</p>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Document Types</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedRule.documentTypes || []).map((type, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{type}</span>
                                        ))}
                                        {(selectedRule.documentTypes || []).length === 0 && <span className="text-gray-400 text-xs">None</span>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Validation Rules</h4>
                                    <ul className="space-y-1">
                                        {(selectedRule.validationRules || []).map((r, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />{r}
                                            </li>
                                        ))}
                                        {(selectedRule.validationRules || []).length === 0 && <li className="text-gray-400 text-sm">None</li>}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Retention Period</h4>
                                    <p className="text-sm text-gray-700 font-medium">{selectedRule.retention || '—'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">{editingRule ? 'Edit Rule' : 'Add Rule'}</h3>
                            <button onClick={() => setShowFormModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Types (comma-separated)</label>
                                <input
                                    type="text"
                                    value={documentTypesText}
                                    onChange={(e) => setDocumentTypesText(e.target.value)}
                                    placeholder="e.g. Mark Sheets, Degree Certificates"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Validation Rules (one per line)</label>
                                <textarea
                                    value={validationRulesText}
                                    onChange={(e) => setValidationRulesText(e.target.value)}
                                    rows={3}
                                    placeholder="File size &lt; 5MB&#10;PDF format only"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Retention</label>
                                <input
                                    type="text"
                                    value={formData.retention}
                                    onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
                                    placeholder="e.g. 7 years"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Applies To</label>
                                <select
                                    value={formData.appliesTo}
                                    onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {APPLIES_TO_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded text-indigo-600"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                    <Save size={16} /> {editingRule ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentRulesCompliance;
