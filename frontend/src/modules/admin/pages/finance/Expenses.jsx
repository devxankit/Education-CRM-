import React, { useState, useEffect } from 'react';
import { Search, Banknote, FileText, RefreshCw, CheckCircle } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Expenses = () => {
    const {
        branches,
        fetchBranches,
        expenseCategories,
        fetchExpenseCategories,
        fetchExpenses,
        updateExpense,
    } = useAdminStore();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [branchId, setBranchId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [approvingId, setApprovingId] = useState(null);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branchId && /^[0-9a-fA-F]{24}$/.test(branchId)) {
            fetchExpenseCategories(branchId);
        }
    }, [branchId, fetchExpenseCategories]);

    const loadExpenses = async () => {
        setLoading(true);
        try {
            const params = { month, year };
            if (branchId && /^[0-9a-fA-F]{24}$/.test(branchId)) params.branchId = branchId;
            if (categoryId && /^[0-9a-fA-F]{24}$/.test(categoryId)) params.categoryId = categoryId;
            if (statusFilter) params.status = statusFilter;
            const data = await fetchExpenses(params);
            setExpenses(Array.isArray(data) ? data : []);
        } catch (e) {
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, [month, year, branchId, categoryId, statusFilter]);

    const filteredExpenses = expenses.filter((exp) => {
        const title = (exp.title || '').toLowerCase();
        const vendor = (exp.vendorName || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return !term || title.includes(term) || vendor.includes(term);
    });

    const totalExpense = filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const pendingAmount = filteredExpenses
        .filter((e) => e.status === 'Pending')
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const handleApprove = async (exp) => {
        const id = exp._id || exp.id;
        if (!id) return;
        setApprovingId(id);
        try {
            await updateExpense(id, { status: 'Paid' });
            setExpenses((prev) =>
                prev.map((e) => ((e._id || e.id) === id ? { ...e, status: 'Paid' } : e))
            );
        } finally {
            setApprovingId(null);
        }
    };

    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col font-['Inter']">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] tracking-tight">
                        Expenses
                    </h1>
                    <p className="text-gray-500 text-sm">
                        View and approve expenses submitted by staff. Same list as staff view.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Banknote size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Summary — {MONTH_NAMES[month]} {year}
                            </h2>
                            <p className="text-xs text-gray-500">
                                Branch & category filters applied
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase">Total Spent</p>
                            <p className="text-lg font-bold text-gray-900">
                                ₹{totalExpense.toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase">Pending</p>
                            <p className="text-lg font-bold text-red-600">
                                ₹{pendingAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 items-center flex-wrap mb-4">
                <div className="relative flex-1 md:max-w-xs min-w-[140px]">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Search by title or vendor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg"
                >
                    <option value="">All Branches</option>
                    {branches.map((b) => (
                        <option key={b._id} value={b._id}>
                            {b.name || b.code || b._id}
                        </option>
                    ))}
                </select>
                <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg"
                >
                    {MONTH_NAMES.slice(1).map((m, i) => (
                        <option key={m} value={i + 1}>
                            {m}
                        </option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg"
                >
                    {[year, year - 1, year - 2].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg"
                >
                    <option value="">All Categories</option>
                    {expenseCategories.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name || c.code || c._id}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg"
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                </select>
                <button
                    onClick={loadExpenses}
                    disabled={loading}
                    className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200"
                >
                    <RefreshCw size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
                <div className="hidden md:grid grid-cols-7 bg-gray-50 p-3 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                    <div className="col-span-1">Branch</div>
                    <div className="col-span-2">Expense Details</div>
                    <div>Category</div>
                    <div>Vendor</div>
                    <div>Date</div>
                    <div className="text-right col-span-2">Amount, Status & Action</div>
                </div>
                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">
                            <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                            <p className="text-sm">Loading expenses...</p>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            No expenses for {MONTH_NAMES[month]} {year}
                        </div>
                    ) : (
                        filteredExpenses.map((exp) => {
                            const dateStr = exp.expenseDate
                                ? new Date(exp.expenseDate).toISOString().split('T')[0]
                                : '-';
                            const cat = exp.categoryId?.name || exp.category || '-';
                            const branchName = exp.branchId?.name || exp.branchId?.code || '-';
                            const isPending = exp.status === 'Pending';
                            const id = exp._id || exp.id;
                            const isApproving = approvingId === id;

                            return (
                                <div
                                    key={id}
                                    className="p-4 md:p-3 md:grid md:grid-cols-7 md:items-center hover:bg-gray-50 transition-colors"
                                >
                                    <div className="md:col-span-1 text-sm text-gray-600 mb-2 md:mb-0">
                                        {branchName}
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-3 mb-2 md:mb-0">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {exp.title || 'Untitled'}
                                            </p>
                                            <p className="text-xs text-gray-400 md:hidden">
                                                {dateStr} • {exp.vendorName || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-sm text-gray-600">{cat}</div>
                                    <div className="hidden md:block text-sm text-gray-600">
                                        {exp.vendorName || '-'}
                                    </div>
                                    <div className="hidden md:block text-sm text-gray-600">
                                        {dateStr}
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-2 md:col-span-2">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                ₹{(exp.amount || 0).toLocaleString()}
                                            </p>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                    exp.status === 'Paid'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}
                                            >
                                                {exp.status || 'Pending'}
                                            </span>
                                        </div>
                                        {isPending && (
                                            <button
                                                onClick={() => handleApprove(exp)}
                                                disabled={isApproving}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 disabled:opacity-50"
                                            >
                                                <CheckCircle size={14} />
                                                {isApproving ? '...' : 'Approve'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
