import React from 'react';
import ReportChart from '@/modules/admin/components/reports/ReportChart';

const formatAmount = (n) => {
    if (n == null || isNaN(n)) return '—';
    if (n >= 1e7) return `₹ ${(n / 1e7).toFixed(1)} Cr`;
    if (n >= 1e5) return `₹ ${(n / 1e5).toFixed(1)} L`;
    if (n >= 1e3) return `₹ ${(n / 1e3).toFixed(1)} K`;
    return `₹ ${Number(n).toFixed(0)}`;
};

const FeeCollectionReports = ({ filters, data, loading }) => {
    const monthlyTrend = data?.monthlyTrend || [];
    const modeDist = (data?.modeDist || []).map((m) => ({ name: m.name, value: m.value }));

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
                <span className="ml-3 text-gray-500">Loading collection report...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-xs font-medium text-emerald-800 uppercase">Total Collected (Period)</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">{formatAmount(data?.totalCollected)}</p>
                    <span className="text-xs text-emerald-700">This period</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Online %</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{modeDist.find((m) => m.name === 'Online')?.value ?? 0}%</p>
                    <span className="text-xs text-gray-400">Primary mode</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{data?.totalTransactions ?? '—'}</p>
                    <span className="text-xs text-gray-400">This period</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Collection Trend (Cash vs Online)</h4>
                    <ReportChart type="bar" data={monthlyTrend} dataKey={['online', 'cash']} colors={['#10b981', '#f59e0b']} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Payment Modes</h4>
                    <ReportChart type="pie" data={modeDist} dataKey="value" height={250} colors={['#3b82f6', '#f59e0b', '#6366f1', '#10b981']} />
                </div>
            </div>
        </div>
    );
};

export default FeeCollectionReports;
