import React, { useState, useEffect } from 'react';
import { getStaffReports } from '../services/dashboard.api';
import { BarChart2, RefreshCw } from 'lucide-react';

const formatAmount = (n) => {
    if (!n && n !== 0) return '-';
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
    return `₹${Number(n).toLocaleString()}`;
};

const formatDate = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Reports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('This Month');

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const data = await getStaffReports(dateRange);
                setReports(data);
            } catch (e) {
                console.error('Error fetching reports:', e);
                setReports(null);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [dateRange]);

    const reportRows = [];

    // Finance data
    if (reports?.finance) {
        reportRows.push(
            { category: 'Finance', metric: 'Total Income', value: formatAmount(reports.finance.totalIncome) },
            { category: 'Finance', metric: 'Total Expense', value: formatAmount(reports.finance.totalExpense) },
            { category: 'Finance', metric: 'Net Surplus', value: formatAmount(reports.finance.netSurplus) },
            { category: 'Finance', metric: 'Pending Fees', value: formatAmount(reports.finance.pendingFees) }
        );
    }

    // Academic data
    if (reports?.academic) {
        reportRows.push(
            { category: 'Academic', metric: 'Total Students', value: reports.academic.totalStudents || '-' },
            { category: 'Academic', metric: 'New Admissions', value: reports.academic.newAdmissions || '-' }
        );
    }

    // Operations data
    if (reports?.operations) {
        reportRows.push(
            { category: 'Operations', metric: 'Active Routes', value: `${reports.operations.activeBuses || 0}/${reports.operations.totalBuses || 0}` }
        );
    }

    // Support data
    if (reports?.support) {
        reportRows.push(
            { category: 'Support', metric: 'Open Tickets', value: reports.support.openTickets || '-' },
            { category: 'Support', metric: 'Closed Today', value: reports.support.closedToday || '-' },
            { category: 'Support', metric: 'SLA Breached', value: reports.support.slaBreached || '-' }
        );
    }

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
                        <p className="text-xs text-gray-500">System performance summary</p>
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
            </div>

            {/* Simple Table */}
            <div className="p-4 md:p-6">
                {loading ? (
                    <div className="bg-white rounded-xl border border-gray-200 h-72 flex flex-col items-center justify-center">
                        <RefreshCw size={32} className="animate-spin text-indigo-500 mb-4" />
                        <p className="text-gray-400 text-sm">Loading reports...</p>
                    </div>
                ) : reportRows.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 h-72 flex flex-col items-center justify-center text-gray-400 text-sm">
                        <BarChart2 size={48} className="mb-4 opacity-20" />
                        <p>No report data available for selected period.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Metric</th>
                                    <th className="px-4 py-3 text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reportRows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-700 font-medium">{row.category}</td>
                                        <td className="px-4 py-3 text-gray-700">{row.metric}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
