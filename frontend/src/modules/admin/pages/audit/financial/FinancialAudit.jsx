
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Calendar, Download, Filter, Search, Eye, Loader2 } from 'lucide-react';
import { API_URL } from '@/app/api';

const FinancialAudit = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/logs/financial?page=1&limit=100`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) setLogs(data.data);
            } catch (e) { console.error('Failed to fetch financial logs', e); }
            finally { setLoading(false); }
        };
        fetchLogs();
    }, []);

    const creditTypes = ['fee_payment', 'other_income'];
    const debitTypes = ['expense', 'salary_transfer', 'fee_refund', 'other_expense'];
    const stats = {
        totalCredits: logs.filter(l => creditTypes.includes(l.type)).reduce((sum, l) => sum + (l.amount || 0), 0),
        totalDebits: logs.filter(l => debitTypes.includes(l.type)).reduce((sum, l) => sum + (l.amount || 0), 0),
        pendingCount: 0,
        flaggedCount: 0,
    };

    const getStatusBadge = (status) => {
        const styles = {
            completed: 'bg-green-100 text-green-700',
            pending: 'bg-amber-100 text-amber-700',
            flagged: 'bg-red-100 text-red-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-600';
    };

    const getTypeBadge = (type) => {
        const styles = { credit: 'text-green-600', debit: 'text-red-600', adjustment: 'text-blue-600' };
        return styles[type] || 'text-gray-600';
    };

    const filteredLogs = logs.filter(log => {
        const desc = (log.description || '').toLowerCase();
        const matchesSearch = !searchTerm || desc.includes(searchTerm.toLowerCase()) || (log.type || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || log.type === filterType;
        return matchesSearch && matchesType;
    });

    const mapLog = (log) => ({
        id: log._id,
        timestamp: log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' }) : '-',
        reference: log.referenceId?.toString().slice(-8) || log.referenceType || '-',
        action: log.description || log.type || '-',
        user: '-',
        amount: log.amount ?? 0,
        type: creditTypes.includes(log.type) ? 'credit' : 'debit',
        module: log.referenceType || log.type || '-',
        status: 'completed'
    });
    const tableRows = filteredLogs.map(mapLog);

    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Financial Audit Trail</h1>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-600 border border-indigo-200 uppercase tracking-wider">
                            <DollarSign size={12} /> Finance
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Track all financial transactions, adjustments, and approvals.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="px-8 pt-6 pb-2 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">₹{stats.totalCredits.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total Credits</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-full">
                        <TrendingDown size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">₹{stats.totalDebits.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total Debits</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{stats.pendingCount}</div>
                        <div className="text-xs text-gray-500">Pending Approvals</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-full">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{stats.flaggedCount}</div>
                        <div className="text-xs text-gray-500">Flagged Entries</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden p-8 pt-4 flex flex-col">
                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">

                    {/* Filters */}
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50">
                        <div className="relative flex-1 max-w-md">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by action, reference, or user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                            >
                                <option value="all">All Types</option>
                                <option value="fee_payment">Fee Payment</option>
                                <option value="expense">Expense</option>
                                <option value="salary_transfer">Salary</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Timestamp</th>
                                    <th className="px-6 py-3 font-medium">Reference</th>
                                    <th className="px-6 py-3 font-medium">Action</th>
                                    <th className="px-6 py-3 font-medium">User</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Module</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500"><Loader2 className="animate-spin inline" size={24} /> Loading...</td></tr>
                                ) : tableRows.length === 0 ? (
                                    <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No financial logs found.</td></tr>
                                ) : (
                                tableRows.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                                            {log.timestamp}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                {log.reference}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {log.action}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {log.user}
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${getTypeBadge(log.type)}`}>
                                            {log.type === 'credit' ? '+' : log.type === 'debit' ? '-' : ''}
                                            ₹{(log.amount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                                                {log.module}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(log.status)}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialAudit;
