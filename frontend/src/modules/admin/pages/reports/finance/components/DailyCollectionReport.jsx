import React from 'react';
import ReportTable from '../../../../components/reports/ReportTable';
import { Download } from 'lucide-react';

const DailyCollectionReport = ({ filters }) => {

    // Configurable DCR format
    const transactions = [
        { id: 'TXN-001', time: '09:15 AM', student: 'Rohan (10-A)', type: 'Tuition Fee (Q1)', mode: 'Cash', amount: 15000, cashier: 'Admin' },
        { id: 'TXN-002', time: '10:30 AM', student: 'Priya (8-B)', type: 'Transport Fee', mode: 'UPI', amount: 4500, cashier: 'Self' },
        { id: 'TXN-003', time: '11:45 AM', student: 'Amit (5-C)', type: 'Annual Charges', mode: 'Cheque', amount: 25000, cashier: 'Admin' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <div>
                    <h3 className="text-gray-900 font-bold">Daily Collection Report (DCR)</h3>
                    <p className="text-gray-500 text-xs">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                    <Download size={16} /> Download Excel
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <ReportTable
                    columns={[
                        { header: 'Time', key: 'time', className: 'text-gray-500 text-xs' },
                        { header: 'Txn ID', key: 'id', className: 'font-mono text-xs' },
                        { header: 'Student', key: 'student', className: 'font-medium' },
                        { header: 'Fee Head', key: 'type' },
                        { header: 'Mode', key: 'mode', render: (row) => <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{row.mode}</span> },
                        { header: 'Amount', key: 'amount', align: 'right', render: (row) => <span className="font-bold">₹ {row.amount.toLocaleString()}</span> },
                        { header: 'By', key: 'cashier', className: 'text-xs text-gray-500' }
                    ]}
                    data={transactions}
                />
                <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Total Collection</p>
                        <p className="text-xl font-bold text-gray-900">₹ 44,500</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyCollectionReport;
