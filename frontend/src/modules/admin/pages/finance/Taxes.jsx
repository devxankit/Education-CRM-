
import React, { useState, useEffect } from 'react';
import { Plus, SlidersHorizontal, Percent, AlertCircle, Edit, Trash2, ToggleLeft, ToggleRight, Loader2, X } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';
import TaxForm from './components/taxes/TaxForm';

const Taxes = () => {
    const {
        taxes, fetchTaxes, addTax, updateTax, deleteTax,
        branches, fetchBranches
    } = useAdminStore();
    const { user } = useAppStore();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingTax, setEditingTax] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({ branchId: '' });

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            await fetchBranches();
            const branchId = user?.branchId || '';
            await fetchTaxes(branchId);
            setLoading(false);
        };
        loadInitial();
    }, [user, fetchTaxes, fetchBranches]);

    const handleToggleStatus = async (tax) => {
        const id = tax._id || tax.id;
        await updateTax(id, { isActive: !tax.isActive });
    };

    const handleDelete = async (taxId) => {
        if (window.confirm('Are you sure you want to delete this tax configuration?')) {
            await deleteTax(taxId);
        }
    };

    const handleEdit = (tax) => {
        setEditingTax(tax);
        setIsDrawerOpen(true);
    };

    const handleCreate = () => {
        setEditingTax(null);
        setIsDrawerOpen(true);
    };

    const handleSave = async (data) => {
        if (editingTax) {
            const id = editingTax._id || editingTax.id;
            await updateTax(id, data);
        } else {
            await addTax({ ...data, branchId: data.branchId || user?.branchId });
        }
        setIsDrawerOpen(false);
        setEditingTax(null);
    };

    const handleBranchFilter = async (branchId) => {
        setFilter({ branchId });
        setLoading(true);
        await fetchTaxes(branchId);
        setLoading(false);
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

    if (loading && taxes.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm font-medium italic">Loading tax configurations...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pb-10 font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 transition-all duration-300">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] tracking-tight">Tax Configuration</h1>
                    <p className="text-gray-500 text-sm">Define and manage tax rules applicable to fees and charges.</p>
                </div>

                <div className="flex items-center gap-3">
                    {branches.length > 0 && (
                        <select
                            value={filter.branchId}
                            onChange={(e) => handleBranchFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase tracking-wider"
                        >
                            <option value="">All Branches</option>
                            {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    )}
                    <button className="p-2.5 text-gray-500 hover:bg-white border border-gray-200 rounded-lg bg-gray-50 shadow-sm transition-all hover:shadow-md active:scale-95">
                        <SlidersHorizontal size={18} />
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold text-sm shadow-md active:scale-95"
                    >
                        <Plus size={18} /> Add Tax
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                            <Percent size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 tracking-tight">{taxes.length}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tax Rules</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <ToggleRight size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 tracking-tight">{taxes.filter(t => t.isActive).length}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Rules</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                            <ToggleLeft size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 tracking-tight">{taxes.filter(t => !t.isActive).length}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inactive Rules</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tax Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                            <tr>
                                <th className="px-8 py-5">Tax Name</th>
                                <th className="px-6 py-5">Code</th>
                                <th className="px-6 py-5 text-center">Rate</th>
                                <th className="px-6 py-5">Applicable On</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {taxes.map((tax) => (
                                <tr key={tax._id || tax.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{tax.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{tax.description || 'No description provided'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-mono text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md tracking-wider">
                                            {tax.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="font-black text-gray-900 text-base">
                                            {tax.type === 'percentage' ? `${tax.rate}%` : `₹${tax.rate}`}
                                        </span>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{tax.type}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-tight">
                                            {getApplicableLabel(tax.applicableOn)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-xs">
                                        <button
                                            onClick={() => handleToggleStatus(tax)}
                                            className={`px-4 py-1.5 rounded-full font-black uppercase tracking-[0.05em] text-[10px] shadow-sm transition-all active:scale-95 ${tax.isActive
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            {tax.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all transform md:translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleEdit(tax)}
                                                className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tax._id || tax.id)}
                                                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
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
                    <div className="flex flex-col items-center justify-center p-20 text-center animate-pulse">
                        <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <p className="font-bold text-gray-400 text-lg">No tax rules configured.</p>
                        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Add your first tax rule to start calculating applicable taxes on fees and charges.</p>
                    </div>
                )}

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                    </div>
                )}
            </div>

            {/* Side Drawer for Add/Edit */}
            <div
                className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
                <div
                    className={`absolute inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl transition-transform duration-500 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="h-full flex flex-col">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
                                    {editingTax ? 'Edit Tax Configuration' : 'Create New Tax Rule'}
                                </h2>
                                <p className="text-xs text-gray-500 font-medium">Define how taxes are calculated for institutional charges.</p>
                            </div>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl shadow-sm transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <TaxForm
                                tax={editingTax}
                                onSave={handleSave}
                                onCancel={() => setIsDrawerOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Taxes;
