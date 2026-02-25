import React, { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Banknote, FileText, ChevronRight, RefreshCw } from 'lucide-react';
import { getExpenses, getExpenseResources } from '../services/expenses.api';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Expenses = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoryId, setFilterCategoryId] = useState('');
    const [branchId, setBranchId] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const hasAccess = [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN, STAFF_ROLES.TRANSPORT].includes(user?.role);
    const canAdd = [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN].includes(user?.role);

    useEffect(() => {
        const loadResources = async () => {
            try {
                const data = await getExpenseResources();
                setResources(data || null);
                if (data?.defaultBranchId) setBranchId(data.defaultBranchId);
                else if (data?.branches?.[0]?._id) setBranchId(data.branches[0]._id);
            } catch (e) {
                console.error('Failed to fetch expense resources', e);
            }
        };
        loadResources();
    }, []);

    const fetchExpenseData = async () => {
        setLoading(true);
        try {
            const params = { month, year };
            if (branchId) params.branchId = branchId;
            if (filterCategoryId) params.categoryId = filterCategoryId;
            const data = await getExpenses(params);
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch expenses', err);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasAccess) return;
        fetchExpenseData();
    }, [month, year, branchId, filterCategoryId]);

    const categories = resources?.categories || [];
    const branches = resources?.branches || [];

    const filteredExpenses = expenses.filter(exp => {
        const title = (exp.title || '').toLowerCase();
        const vendor = (exp.vendorName || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return !term || title.includes(term) || vendor.includes(term);
    });

    const totalExpense = filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const pendingAmount = filteredExpenses.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0);

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400"><Banknote size={32} /></div>
                <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
                <p className="text-sm text-gray-500 mt-2">Only Accounts team can view expenses.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            <div className="bg-white px-5 pt-5 pb-3 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Expenses & Bills</h1>
                        <p className="text-xs text-gray-500">Track institutional spending</p>
                    </div>
                    {canAdd && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/staff/expenses/new')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <Plus size={16} /> Add Expense
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 items-center flex-wrap">
                    <div className="relative flex-1 md:max-w-xs min-w-[140px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <select
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none"
                    >
                        <option value="">All Branches</option>
                        {branches.map(b => (
                            <option key={b._id} value={b._id}>{b.name || b.code || b._id}</option>
                        ))}
                    </select>
                    <select
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none"
                    >
                        {MONTH_NAMES.slice(1).map((m, i) => (
                            <option key={m} value={i + 1}>{m}</option>
                        ))}
                    </select>
                    <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none"
                    >
                        {[year, year - 1, year - 2].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <select
                        value={filterCategoryId}
                        onChange={(e) => setFilterCategoryId(e.target.value)}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.name || c.code || c._id}</option>
                        ))}
                    </select>
                    <button onClick={fetchExpenseData} disabled={loading} className="p-2 rounded-lg hover:bg-gray-100">
                        <RefreshCw size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Banknote size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Summary — {MONTH_NAMES[month]} {year}</h2>
                                <p className="text-xs text-gray-500">From expenses list (branch & category filters applied)</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase">Total Spent</p>
                                <p className="text-lg font-bold text-gray-900">₹{totalExpense.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase">Pending Bills</p>
                                <p className="text-lg font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="hidden md:grid grid-cols-6 bg-gray-50 p-3 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                        <div className="col-span-2">Expense Details</div>
                        <div>Category</div>
                        <div>Vendor</div>
                        <div>Date</div>
                        <div className="text-right">Amount & Status</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">
                                <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                                <p className="text-sm">Loading expenses...</p>
                            </div>
                        ) : filteredExpenses.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">No expenses for {MONTH_NAMES[month]} {year}</div>
                        ) : (
                            filteredExpenses.map(exp => {
                                const dateStr = exp.expenseDate ? new Date(exp.expenseDate).toISOString().split('T')[0] : '-';
                                const cat = exp.categoryId?.name || exp.category || '-';
                                return (
                                    <div
                                        key={exp._id || exp.id}
                                        onClick={() => navigate(`/staff/expenses/${exp._id || exp.id}`)}
                                        className="p-4 md:p-3 md:grid md:grid-cols-6 md:items-center hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="md:col-span-2 flex items-center justify-between md:justify-start gap-3 mb-2 md:mb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{exp.title || 'Untitled'}</p>
                                                    <p className="text-xs text-gray-400 md:hidden">{dateStr} • {exp.vendorName || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="md:hidden text-right">
                                                <p className="text-sm font-bold text-gray-900">₹{(exp.amount || 0).toLocaleString()}</p>
                                                <span className={`text-[10px] font-bold ${exp.status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>{exp.status || 'Pending'}</span>
                                            </div>
                                        </div>
                                        <div className="hidden md:block text-sm text-gray-600">{cat}</div>
                                        <div className="hidden md:block text-sm text-gray-600">{exp.vendorName || '-'}</div>
                                        <div className="hidden md:block text-sm text-gray-600">{dateStr}</div>
                                        <div className="hidden md:flex md:items-center md:justify-end gap-2">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">₹{(exp.amount || 0).toLocaleString()}</p>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${exp.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                    {exp.status || 'Pending'}
                                                </span>
                                            </div>
                                            <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
