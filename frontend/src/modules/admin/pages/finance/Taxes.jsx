import React, { useState, useEffect } from 'react';
import { Plus, Search, Percent, AlertCircle, Edit, Trash2, Loader2, X, DollarSign, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterApplicableOn, setFilterApplicableOn] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, filterType, filterStatus, filterApplicableOn]);

    // Fetch branches and set default
    useEffect(() => {
        const loadBranches = async () => {
            await fetchBranches();
            if (user?.branchId && /^[0-9a-fA-F]{24}$/.test(user.branchId)) {
                setSelectedBranchId(user.branchId);
            } else if (branches.length > 0) {
                setSelectedBranchId(branches[0]._id);
            }
        };
        loadBranches();
    }, [fetchBranches, user?.branchId, branches.length]);

    // Fetch taxes when branch changes
    useEffect(() => {
        if (selectedBranchId) {
            const loadTaxes = async () => {
                setLoading(true);
                await fetchTaxes(selectedBranchId);
                setLoading(false);
            };
            loadTaxes();
        }
    }, [selectedBranchId, fetchTaxes]);

    const handleToggleStatus = async (tax) => {
        try {
            const id = tax._id || tax.id;
            const result = await updateTax(id, { isActive: !tax.isActive });
            if (result) {
                await fetchTaxes(selectedBranchId);
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleDelete = async (tax) => {
        if (window.confirm(`Are you sure you want to delete "${tax.name}"? This action cannot be undone.`)) {
            try {
                await deleteTax(tax._id || tax.id);
                await fetchTaxes(selectedBranchId);
                if (editingTax?._id === tax._id) {
                    setIsDrawerOpen(false);
                    setEditingTax(null);
                }
            } catch (error) {
                console.error('Error deleting tax:', error);
            }
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
        try {
            if (editingTax) {
                const id = editingTax._id || editingTax.id;
                const result = await updateTax(id, data);
                if (result) {
                    setIsDrawerOpen(false);
                    setEditingTax(null);
                    await fetchTaxes(selectedBranchId);
                }
            } else {
                const result = await addTax({ ...data, branchId: data.branchId || selectedBranchId });
                if (result) {
                    setIsDrawerOpen(false);
                    setEditingTax(null);
                    await fetchTaxes(selectedBranchId);
                }
            }
        } catch (error) {
            console.error('Error saving tax:', error);
        }
    };

    const getApplicableLabel = (on) => {
        const labels = {
            fee: 'Fee',
            admission: 'Admission Fee',
            payroll: 'Payroll',
            expenses: 'Expenses'
        };
        return labels[on] || on;
    };

    // Filter taxes
    const filteredTaxes = taxes.filter(tax => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!tax.name.toLowerCase().includes(query) && 
                !tax.code.toLowerCase().includes(query) &&
                !(tax.description || '').toLowerCase().includes(query)) {
                return false;
            }
        }
        // Type filter
        if (filterType !== 'all' && tax.type !== filterType) {
            return false;
        }
        // Status filter
        if (filterStatus !== 'all') {
            if (filterStatus === 'active' && !tax.isActive) return false;
            if (filterStatus === 'inactive' && tax.isActive) return false;
        }
        // Applicable on filter
        if (filterApplicableOn !== 'all' && tax.applicableOn !== filterApplicableOn) {
            return false;
        }
        return true;
    });

    // Pagination
    const totalItems = filteredTaxes.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedTaxes = filteredTaxes.slice(startIndex, startIndex + pageSize);

    if (loading && taxes.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm font-medium">Loading tax configurations...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10 font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] tracking-tight">Tax Configuration</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Define and manage tax rules applicable to fees and charges</p>
                </div>
                <div className="flex items-center gap-3">
                    {branches.length > 0 && (
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <select
                                value={selectedBranchId}
                                onChange={(e) => setSelectedBranchId(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-md hover:shadow-lg active:scale-95"
                    >
                        <Plus size={18} /> Add Tax Rule
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1.5">Total Rules</div>
                    <div className="text-2xl font-bold text-gray-900">{taxes.length}</div>
                </div>
                <div className="bg-emerald-50/80 p-5 rounded-xl border border-emerald-100 shadow-sm">
                    <div className="text-xs text-emerald-600 uppercase font-bold tracking-wider mb-1.5">Active</div>
                    <div className="text-2xl font-bold text-emerald-700">{taxes.filter(t => t.isActive).length}</div>
                </div>
                <div className="bg-indigo-50/80 p-5 rounded-xl border border-indigo-100 shadow-sm">
                    <div className="text-xs text-indigo-600 uppercase font-bold tracking-wider mb-1.5">Percentage</div>
                    <div className="text-2xl font-bold text-indigo-700">{taxes.filter(t => t.type === 'percentage').length}</div>
                </div>
                <div className="bg-amber-50/80 p-5 rounded-xl border border-amber-100 shadow-sm">
                    <div className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1.5">Flat Rate</div>
                    <div className="text-2xl font-bold text-amber-700">{taxes.filter(t => t.type === 'flat').length}</div>
                </div>
            </div>

            {/* Example: Tax applied on sample amount */}
            {taxes.filter(t => t.isActive && t.applicableOn === 'fee').length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-indigo-50/80 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Example (fees applicable)</p>
                    <p className="text-sm text-gray-700">
                        On <span className="font-bold">₹10,000</span> base: {
                            taxes.filter(t => t.isActive && t.applicableOn === 'fee').map(t => {
                                const amt = t.type === 'percentage' ? Math.round(10000 * (t.rate || 0) / 100) : (t.rate || 0);
                                return `${t.name} (${t.type === 'percentage' ? t.rate + '%' : '₹' + t.rate}) = ₹${amt.toLocaleString()}`;
                            }).join(', ')
                        }
                        {' → '}
                        <span className="font-bold text-indigo-700">
                            Total tax ₹{taxes.filter(t => t.isActive && t.applicableOn === 'fee').reduce((s, t) => s + (t.type === 'percentage' ? Math.round(10000 * (t.rate || 0) / 100) : (t.rate || 0)), 0).toLocaleString()}
                            {' '}(Grand total ₹{(10000 + taxes.filter(t => t.isActive && t.applicableOn === 'fee').reduce((s, t) => s + (t.type === 'percentage' ? Math.round(10000 * (t.rate || 0) / 100) : (t.rate || 0)), 0)).toLocaleString()})
                        </span>
                    </p>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="percentage">Percentage</option>
                        <option value="flat">Flat Rate</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select
                        value={filterApplicableOn}
                        onChange={(e) => setFilterApplicableOn(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="all">All Applicable</option>
                        <option value="fee">Annual Fee</option>
                        <option value="admission">Admission Fee</option>
                        <option value="payroll">Payroll</option>
                        <option value="expenses">Expenses</option>
                    </select>
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Tax Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 min-h-[400px] flex flex-col">
                {paginatedTaxes.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <AlertCircle size={40} className="text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-semibold text-lg mb-1">
                            {taxes.length === 0 ? 'No tax rules found' : 'No taxes match your filters'}
                        </p>
                        <p className="text-sm text-gray-400 mb-4">
                            {taxes.length === 0 
                                ? 'Create your first tax rule to start calculating taxes on fees and charges'
                                : 'Try adjusting your search or filters'}
                        </p>
                        {taxes.length === 0 && (
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-md"
                            >
                                <Plus size={18} /> Create Tax Rule
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/80 border-b border-gray-100 sticky top-0">
                                <tr>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Tax Name</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Rate</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Applicable On</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedTaxes.map((tax) => (
                                    <tr key={tax._id || tax.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div>
                                                <p className="font-semibold text-gray-900">{tax.name}</p>
                                                {tax.description && (
                                                    <p className="text-xs text-gray-500 mt-1">{tax.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 font-mono">
                                                {tax.code}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                {tax.type === 'percentage' ? (
                                                    <>
                                                        <Percent size={16} className="text-indigo-600" />
                                                        <span className="font-bold text-gray-900">{tax.rate}%</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <DollarSign size={16} className="text-indigo-600" />
                                                        <span className="font-bold text-gray-900">₹{tax.rate}</span>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 capitalize">{tax.type}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700">
                                                {getApplicableLabel(tax.applicableOn)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(tax)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                                    tax.isActive
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                            >
                                                {tax.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-1.5 pr-2">
                                                <button
                                                    onClick={() => handleEdit(tax)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tax)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                    {/* Pagination */}
                    {totalItems > pageSize && (
                        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/30">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{startIndex + 1}</span>–<span className="font-semibold">{Math.min(startIndex + pageSize, totalItems)}</span> of <span className="font-semibold">{totalItems}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Previous"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Next"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </div>

            {/* Side Drawer for Add/Edit */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingTax ? 'Edit Tax Configuration' : 'Create New Tax Rule'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Define how taxes are calculated for institutional charges</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                    setEditingTax(null);
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <TaxForm
                                tax={editingTax}
                                onSave={handleSave}
                                onCancel={() => {
                                    setIsDrawerOpen(false);
                                    setEditingTax(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Taxes;
