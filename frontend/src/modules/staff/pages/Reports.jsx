import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { getStaffReports } from '../services/dashboard.api';
import {
    BarChart2, TrendingUp, TrendingDown, Calendar, Download,
    PieChart, Users, FileText, ArrowRight, DollarSign,
    AlertCircle, CheckCircle, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';

const formatAmount = (n) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
    return `₹${(n || 0).toLocaleString()}`;
};

const formatDate = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    const today = new Date();
    if (dt.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dt.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const Reports = () => {
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    // Role Logic
    const canViewFinance = [STAFF_ROLES.ADMIN, STAFF_ROLES.ACCOUNTS].includes(user?.role);
    const canViewAcademic = [STAFF_ROLES.ADMIN, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.PRINCIPAL].includes(user?.role);
    const canViewOperations = [STAFF_ROLES.ADMIN, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.TRANSPORT].includes(user?.role);
    const canViewSupport = [STAFF_ROLES.ADMIN, STAFF_ROLES.SUPPORT].includes(user?.role);

    // Determine initial active tab based on permission
    const getInitialTab = () => {
        if (canViewFinance) return 'Finance';
        if (canViewAcademic) return 'Academic';
        if (canViewOperations) return 'Operations';
        if (canViewSupport) return 'Support';
        return null; // No access
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());
    const [dateRange, setDateRange] = useState('This Month');

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const data = await getStaffReports(dateRange);
                setReports(data);
            } catch (e) {
                setReports(null);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [dateRange]);

    // If no access to any tab, show Restricted Access
    if (!activeTab) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-gray-50">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                    <BarChart2 size={32} className="text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Restricted Access</h2>
                <p className="text-sm text-gray-500 mt-2">You do not have permission to view system reports.</p>
            </div>
        );
    }

    const availableTabs = [
        { id: 'Finance', label: 'Finance', show: canViewFinance },
        { id: 'Academic', label: 'Academic', show: canViewAcademic },
        { id: 'Operations', label: 'Operations', show: canViewOperations },
        { id: 'Support', label: 'Support', show: canViewSupport },
    ].filter(t => t.show);

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 pt-5 pb-3 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Analytics & Reports</h1>
                        <p className="text-xs text-gray-500">System-wide performance insights</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-gray-100 border-none text-sm font-bold text-gray-600 rounded-lg px-3 py-2 outline-none cursor-pointer"
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Quarter</option>
                            <option>This Year</option>
                        </select>
                        <button
                            onClick={async () => {
                                setLoading(true);
                                const data = await getStaffReports(dateRange);
                                setReports(data);
                                setLoading(false);
                            }}
                            disabled={loading}
                            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition-colors disabled:opacity-60"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-100 overflow-x-auto no-scrollbar">
                    {availableTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-gray-400 border-transparent hover:text-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {activeTab === 'Finance' && (
                    <div className="space-y-6 animate-fade-in">
                        {loading ? (
                            <div className="flex justify-center py-12"><RefreshCw size={32} className="animate-spin text-indigo-500" /></div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                    <StatCard label="Total Income" value={formatAmount(reports?.finance?.totalIncome)} icon={TrendingUp} color="green" />
                                    <StatCard label="Total Expense" value={formatAmount(reports?.finance?.totalExpense)} icon={TrendingDown} color="red" />
                                    <StatCard label="Net Surplus" value={formatAmount(reports?.finance?.netSurplus)} icon={BarChart2} color="indigo" />
                                    <StatCard label="Pending Fees" value={formatAmount(reports?.finance?.pendingFees)} icon={AlertCircle} color="amber" />
                                </div>

                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">Expense Breakdown</h3>
                                    <div className="space-y-4">
                                        {(reports?.finance?.expenseBreakdown || []).length > 0 ? (
                                            (reports.finance.expenseBreakdown || []).slice(0, 6).map((item, i) => (
                                                <ProgressBar
                                                    key={i}
                                                    label={item.label}
                                                    value={item.value}
                                                    color={['bg-blue-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-amber-500', 'bg-gray-400'][i % 6]}
                                                    amount={formatAmount(item.total)}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">No expense data for this period</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase">Recent Transactions</h3>
                                        <button onClick={() => navigate('/staff/fees')} className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {(reports?.finance?.recentTransactions || []).length > 0 ? (
                                            reports.finance.recentTransactions.map((t, i) => (
                                                <TransactionRow
                                                    key={i}
                                                    to={t.to}
                                                    cat={t.cat}
                                                    date={formatDate(t.date)}
                                                    amount={t.type === 'credit' ? `+ ${formatAmount(t.amount)}` : `- ${formatAmount(t.amount)}`}
                                                    type={t.type}
                                                />
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-gray-500 text-sm">No transactions in this period</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'Academic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        {loading ? (
                            <div className="col-span-2 flex justify-center py-12"><RefreshCw size={32} className="animate-spin text-indigo-500" /></div>
                        ) : (
                            <>
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users size={18} /> Total Students
                                    </h3>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl font-bold text-gray-900">{reports?.academic?.totalStudents ?? '-'}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Enrolled students in institute</p>
                                </div>

                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText size={18} /> New Admissions
                                    </h3>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl font-bold text-gray-900">{reports?.academic?.newAdmissions ?? '-'}</span>
                                        <span className="text-sm text-indigo-600 font-bold mb-1">In period</span>
                                    </div>
                                    <p className="text-xs text-gray-500">New enrollments in selected period</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'Operations' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        {loading ? (
                            <div className="flex justify-center py-12"><RefreshCw size={32} className="animate-spin text-indigo-500" /></div>
                        ) : (
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 mb-4">Transport Fleet</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Active Routes</span>
                                        <span className="font-bold text-gray-900">{reports?.operations?.activeBuses ?? 0}/{reports?.operations?.totalBuses ?? 0}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'Support' && (
                    <div className="space-y-6 animate-fade-in">
                        {loading ? (
                            <div className="flex justify-center py-12"><RefreshCw size={32} className="animate-spin text-indigo-500" /></div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                    <StatCard label="Open Tickets" value={String(reports?.support?.openTickets ?? '-')} icon={AlertCircle} color="red" />
                                    <StatCard label="Closed Today" value={String(reports?.support?.closedToday ?? '-')} icon={CheckCircle} color="green" />
                                    <StatCard label="SLA Breached" value={String(reports?.support?.slaBreached ?? '-')} icon={AlertTriangle} color="amber" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-900 mb-4">Ticket Categories</h3>
                                        <div className="space-y-4">
                                            {(reports?.support?.ticketCategories || []).length > 0 ? (
                                                (reports.support.ticketCategories || []).slice(0, 5).map((item, i) => (
                                                    <ProgressBar
                                                        key={i}
                                                        label={item.label || 'Other'}
                                                        value={item.value}
                                                        color={['bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-indigo-500', 'bg-gray-400'][i % 5]}
                                                        amount={`${item.value}%`}
                                                    />
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">No ticket data</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-900 mb-4">Support Overview</h3>
                                        <div className="flex items-center justify-center py-6">
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-indigo-600">{reports?.support?.openTickets ?? 0}</p>
                                                <p className="text-xs text-gray-500 mt-1">Tickets currently open</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SUB COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colors = {
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        amber: 'bg-amber-50 text-amber-600'
    };
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-2 rounded-lg ${colors[color]}`}>
                <Icon size={18} />
            </div>
        </div>
    );
};

const ProgressBar = ({ label, value, color, amount }) => (
    <div>
        <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
            <span>{label}</span>
            <span>{amount}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const TransactionRow = ({ to, cat, date, amount, type }) => (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <DollarSign size={14} />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-900">{to}</p>
                <p className="text-[10px] text-gray-400">{cat} • {date}</p>
            </div>
        </div>
        <span className={`text-sm font-bold ${type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>{amount}</span>
    </div>
);

export default Reports;
