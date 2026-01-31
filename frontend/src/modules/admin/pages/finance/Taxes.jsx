
import React, { useState, useEffect } from 'react';
import { Plus, SlidersHorizontal, Percent, AlertCircle, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';

const Taxes = () => {
    const taxes = useAdminStore(state => state.taxes);
    const setTaxes = useAdminStore(state => state.setTaxes);
    const updateTax = useAdminStore(state => state.updateTax);
    const deleteTax = useAdminStore(state => state.deleteTax);
    const addTax = useAdminStore(state => state.addTax);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState(null);

    const handleToggleStatus = (taxId) => {
        const tax = taxes.find(t => t.id === taxId);
        if (tax) {
            updateTax(taxId, { isActive: !tax.isActive });
        }
    };

    const handleDelete = (taxId) => {
        if (window.confirm('Are you sure you want to delete this tax configuration?')) {
            deleteTax(taxId);
        }
    };

    const handleEdit = (tax) => {
        setEditingTax(tax);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingTax(null);
        setIsModalOpen(true);
    };

    const getApplicableLabel = (on) => {
        const labels = {
            fees: 'Tuition Fees',
            transport: 'Transport',
            admission: 'Admission',
            hostel: 'Hostel',
            all: 'All Charges'
        };
        return labels[on] || on;
    };

    return (
        <div className="h-full flex flex-col pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Tax Configuration</h1>
                    <p className="text-gray-500 text-sm">Define and manage tax rules applicable to fees and charges.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:bg-white border border-gray-200 rounded-lg bg-gray-50">
                        <SlidersHorizontal size={18} />
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> Add Tax
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Percent size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{taxes.length}</div>
                            <div className="text-xs text-gray-500">Total Tax Rules</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <ToggleRight size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{taxes.filter(t => t.isActive).length}</div>
                            <div className="text-xs text-gray-500">Active Rules</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                            <ToggleLeft size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{taxes.filter(t => !t.isActive).length}</div>
                            <div className="text-xs text-gray-500">Inactive Rules</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tax Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Tax Name</th>
                                <th className="px-6 py-4 font-semibold">Code</th>
                                <th className="px-6 py-4 font-semibold">Rate</th>
                                <th className="px-6 py-4 font-semibold">Applicable On</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {taxes.map((tax) => (
                                <tr key={tax.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">{tax.name}</p>
                                            <p className="text-xs text-gray-500">{tax.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {tax.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900">
                                            {tax.type === 'percentage' ? `${tax.rate}%` : `₹${tax.rate}`}
                                        </span>
                                        <p className="text-xs text-gray-500 capitalize">{tax.type}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                                            {getApplicableLabel(tax.applicableOn)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(tax.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${tax.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {tax.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(tax)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tax.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Delete"
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

                {/* Empty State */}
                {taxes.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No tax rules configured. Add your first tax rule to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Taxes;
