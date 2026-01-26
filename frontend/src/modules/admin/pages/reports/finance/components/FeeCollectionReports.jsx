import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';

const FeeCollectionReports = ({ filters }) => {

    // Mock Data
    const monthlyTrend = [
        { name: 'Week 1', cash: 45000, online: 120000 },
        { name: 'Week 2', cash: 32000, online: 98000 },
        { name: 'Week 3', cash: 55000, online: 145000 },
        { name: 'Week 4', cash: 28000, online: 88000 },
    ];

    const modeDist = [
        { name: 'UPI / Online', value: 65 },
        { name: 'Cash', value: 20 },
        { name: 'Cheque', value: 10 },
        { name: 'Bank Transfer', value: 5 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-xs font-medium text-emerald-800 uppercase">Total Collected (Month)</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">₹ 14.5 L</p>
                    <span className="text-xs text-emerald-700">92% of target</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Online Payments</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">65%</p>
                    <span className="text-xs text-gray-400">Primary mode</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">452</p>
                    <span className="text-xs text-gray-400">This month</span>
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
