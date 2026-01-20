import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Banknote, Briefcase, Filter, ArrowUpRight, ArrowDownRight, FileText, ChevronRight } from 'lucide-react';

// --- MOCK EXPENSES ---
const MOCK_EXPENSES = [
    { id: 'EXP-001', title: 'Monthly Generator Fuel', category: 'Transport', vendor: 'City Fuels', amount: 12500, status: 'Paid', date: '2024-10-01' },
    { id: 'EXP-002', title: 'Campus Wi-Fi Bill', category: 'Internet', vendor: 'Jio Fiber', amount: 4500, status: 'Pending', date: '2024-10-05' },
    { id: 'EXP-003', title: 'Stationery Purchase', category: 'Supplies', vendor: 'Raj Stationery', amount: 3200, status: 'Paid', date: '2024-10-02' },
    { id: 'EXP-004', title: 'Bus Maintenance', category: 'Transport', vendor: 'AutoFix Garage', amount: 8500, status: 'Pending', date: '2024-10-06' },
];

const Expenses = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    // Access Check: Accounts & Admin (Full) | Transport (View)
    const hasAccess = [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN, STAFF_ROLES.TRANSPORT].includes(user?.role);
    const canAdd = [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN].includes(user?.role);

    if (!hasAccess) {
        return <AccessDenied />;
    }

    const filteredExpenses = MOCK_EXPENSES.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = filterCategory === 'All' || exp.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    const totalExpense = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = filteredExpenses.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 pt-5 pb-3 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Expenses & Bills</h1>
                        <p className="text-xs text-gray-500">Track institutional spending</p>
                    </div>
                    {canAdd && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/staff/vendors')}
                                className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                            >
                                Manage Vendors
                            </button>
                            <button
                                onClick={() => navigate('/staff/expenses/new')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <Plus size={16} /> Add Expense
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1 md:max-w-xs">
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
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="All">All Categories</option>
                        <option value="Transport">Transport</option>
                        <option value="Internet">Internet</option>
                        <option value="Supplies">Supplies</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* Budget Dashboard */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Banknote size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Monthly Budget Usage</h2>
                                <p className="text-xs text-gray-500">October 2024 • Cap: ₹5,00,000</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase">Spent</p>
                                <p className="text-lg font-bold text-gray-900">₹{totalExpense.toLocaleString()}</p>
                            </div>
                            <div className="hidden md:block w-px bg-gray-200"></div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase">Remaining</p>
                                <p className="text-lg font-bold text-green-600">₹{(500000 - totalExpense).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-indigo-600">
                                    {((totalExpense / 500000) * 100).toFixed(1)}% Used
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-50">
                            <div
                                style={{ width: `${(totalExpense / 500000) * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Utilities</p>
                            <p className="text-sm font-bold text-gray-800">12% <span className="text-gray-400 font-normal">of budget</span></p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Transport</p>
                            <p className="text-sm font-bold text-gray-800">45% <span className="text-gray-400 font-normal">of budget</span></p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Supplies</p>
                            <p className="text-sm font-bold text-gray-800">8% <span className="text-gray-400 font-normal">of budget</span></p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                            <p className="text-xs text-red-500 mb-1">Pending Bills</p>
                            <p className="text-sm font-bold text-red-700">₹{pendingAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="hidden md:grid grid-cols-6 bg-gray-50 p-3 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                        <div className="col-span-2">Expense Details</div>
                        <div>Category</div>
                        <div>Vendor</div>
                        <div>Date</div>
                        <div className="text-right">Amount & Status</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {filteredExpenses.map(exp => (
                            <div key={exp.id} className="p-4 md:p-3 md:grid md:grid-cols-6 md:items-center hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => { }}>
                                {/* Mobile View: Card Style */}
                                <div className="md:col-span-2 flex items-center justify-between md:justify-start gap-3 mb-2 md:mb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{exp.title}</p>
                                            <p className="text-xs text-gray-400 md:hidden">{exp.date} • {exp.vendor}</p>
                                        </div>
                                    </div>
                                    <div className="md:hidden text-right">
                                        <p className="text-sm font-bold text-gray-900">₹{exp.amount.toLocaleString()}</p>
                                        <span className={`text-[10px] font-bold ${exp.status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>{exp.status}</span>
                                    </div>
                                </div>

                                {/* Desktop Cols */}
                                <div className="hidden md:block text-sm text-gray-600 font-medium">{exp.category}</div>
                                <div className="hidden md:block text-sm text-gray-600 font-medium">{exp.vendor}</div>
                                <div className="hidden md:block text-sm text-gray-600 font-medium">{exp.date}</div>
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-bold text-gray-900">₹{exp.amount.toLocaleString()}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${exp.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        {exp.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400"><Banknote size={32} /></div>
        <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-500 mt-2">Only Accounts team can view expenses.</p>
    </div>
);

export default Expenses;
