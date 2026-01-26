import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';

const PayrollSummaryReports = ({ filters }) => {

    // MOCK DATA - PII MASKED
    const costTrend = [
        { name: 'Aug', cost: 420 },
        { name: 'Sep', cost: 425 },
        { name: 'Oct', cost: 422 },
        { name: 'Nov', cost: 430 }, // Diwali Bonuses etc
        { name: 'Dec', cost: 428 },
        { name: 'Jan', cost: 428 },
    ];

    const deptSplit = [
        { name: 'Academic', value: 65 },
        { name: 'Admin', value: 20 },
        { name: 'Operations', value: 15 },
    ];

    return (
        <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
                <strong>Confidential Financial Data:</strong> View access is restricted. Individual salary components are masked in this view.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Total Monthly Payroll (Est.)</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">₹ 42.8 Lakhs</h2>
                    <p className="text-xs text-gray-400 mt-1">Includes allowances & benefits</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Avg. Cost Per Head</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">₹ 44.1k</h2>
                    <p className="text-xs text-gray-400 mt-1">Monthly Cost to Company</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Payroll Cost Trend (Lakhs)</h4>
                    <ReportChart type="line" data={costTrend} dataKey="cost" colors={['#10b981']} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Cost Distribution by Function</h4>
                    <ReportChart type="pie" data={deptSplit} dataKey="value" height={250} colors={['#6366f1', '#a855f7', '#fb923c']} />
                </div>
            </div>

        </div>
    );
};

export default PayrollSummaryReports;
