
import React, { useState } from 'react';
import { Plus, FileCheck, FileX, AlertTriangle, Settings, Edit, Trash2, Eye } from 'lucide-react';

const DocumentRulesCompliance = () => {

    // Mock Data
    const [rules, setRules] = useState([
        {
            id: 1,
            name: 'Academic Certificates',
            description: 'Rules for validating and storing academic certificates',
            documentTypes: ['Mark Sheets', 'Degree Certificates', 'Transfer Certificates'],
            validationRules: ['File size < 5MB', 'PDF format only', 'Must be certified copy'],
            retention: '10 years',
            isActive: true,
            appliesTo: 'students'
        },
        {
            id: 2,
            name: 'Identity Documents',
            description: 'Validation rules for identity proofs',
            documentTypes: ['Aadhar Card', 'PAN Card', 'Passport'],
            validationRules: ['Clear scan required', 'Both sides needed', 'Not expired'],
            retention: '7 years',
            isActive: true,
            appliesTo: 'all'
        },
        {
            id: 3,
            name: 'Medical Records',
            description: 'Health and medical document requirements',
            documentTypes: ['Vaccination Records', 'Medical Fitness Certificate', 'Blood Group Report'],
            validationRules: ['Recent (< 6 months)', 'Doctor signed', 'Hospital letterhead'],
            retention: '5 years',
            isActive: true,
            appliesTo: 'students'
        },
        {
            id: 4,
            name: 'Employee Documents',
            description: 'Staff employment related documents',
            documentTypes: ['Resume/CV', 'Experience Letters', 'Background Check'],
            validationRules: ['Original or attested', 'Complete employment history'],
            retention: 'Till employment + 3 years',
            isActive: false,
            appliesTo: 'employees'
        },
    ]);

    const [selectedRule, setSelectedRule] = useState(null);

    const handleToggleStatus = (ruleId) => {
        setRules(prev => prev.map(rule =>
            rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
        ));
    };

    const handleDelete = (ruleId) => {
        if (window.confirm('Are you sure you want to delete this compliance rule?')) {
            setRules(prev => prev.filter(rule => rule.id !== ruleId));
        }
    };

    const getAppliesToLabel = (type) => {
        const labels = {
            students: 'Students',
            employees: 'Employees',
            teachers: 'Teachers',
            all: 'All Users'
        };
        return labels[type] || type;
    };

    return (
        <div className="h-full flex flex-col pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Document Compliance Rules</h1>
                    <p className="text-gray-500 text-sm">Define validation, retention, and storage rules for documents.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:bg-white border border-gray-200 rounded-lg bg-gray-50">
                        <Settings size={18} />
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> Add Rule
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FileCheck size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{rules.length}</div>
                        <div className="text-xs text-gray-500">Total Rules</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <FileCheck size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{rules.filter(r => r.isActive).length}</div>
                        <div className="text-xs text-gray-500">Active Rules</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">12</div>
                        <div className="text-xs text-gray-500">Pending Reviews</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <FileX size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">3</div>
                        <div className="text-xs text-gray-500">Non-Compliant</div>
                    </div>
                </div>
            </div>

            {/* Rules List */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1">
                {/* Rules Table */}
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
                                        key={rule.id}
                                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedRule?.id === rule.id ? 'bg-indigo-50' : ''}`}
                                        onClick={() => setSelectedRule(rule)}
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{rule.name}</p>
                                                <p className="text-xs text-gray-500">{rule.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                {getAppliesToLabel(rule.appliesTo)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {rule.documentTypes.length} types
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                            {rule.retention}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(rule.id); }}
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${rule.isActive
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {rule.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedRule(rule); }}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(rule.id); }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail Panel */}
                {selectedRule && (
                    <div className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-4">{selectedRule.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{selectedRule.description}</p>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Document Types</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRule.documentTypes.map((type, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Validation Rules</h4>
                                <ul className="space-y-1">
                                    {selectedRule.validationRules.map((rule, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Retention Period</h4>
                                <p className="text-sm text-gray-700 font-medium">{selectedRule.retention}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentRulesCompliance;
