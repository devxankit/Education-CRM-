import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';

const ExpenseReports = ({ filters }) => {

    const categoryData = [
        { name: 'Payroll', value: 4500000 },
        { name: 'Infrastructure', value: 1200000 },
        { name: 'Utilities', value: 800000 },
        { name: 'Events', value: 300000 },
        { name: 'Transport Fuel', value: 450000 },
    ];

    const monthlyBurn = [
        { name: 'Nov', expense: 65 },
        { name: 'Dec', expense: 72 }, // Annual function maybe
        { name: 'Jan', expense: 68 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Total Monthly Expense (Jan)</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">₹ 72.5 Lakhs</h2>
                </div>
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Largest Cost Center</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">Payroll (62%)</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Expense by Category</h4>
                    <ReportChart type="pie" data={categoryData} dataKey="value" height={300} colors={['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444']} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Monthly Burn Rate (Lakhs)</h4>
                    <ReportChart type="bar" data={monthlyBurn} dataKey="expense" colors={['#ec4899']} />
                </div>
            </div>
        </div>
    );
};

export default ExpenseReports;
