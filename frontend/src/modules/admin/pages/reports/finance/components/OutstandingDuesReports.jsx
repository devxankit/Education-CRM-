import React from 'react';
import ReportTable from '../../../../components/reports/ReportTable';
import { AlertTriangle, Phone } from 'lucide-react';

const OutstandingDuesReports = ({ filters }) => {

    // Mock Data
    const defaulters = [
        { id: 101, name: 'Aarav Patel', class: 'Class 10-A', dueAmount: 25000, months: 2, parent: 'Rajesh Patel', phone: '9876543210' },
        { id: 102, name: 'Siya Verma', class: 'Class 8-B', dueAmount: 12000, months: 1, parent: 'Amit Verma', phone: '9988776655' },
        { id: 103, name: 'Rohan Gupta', class: 'Class 12-Sci', dueAmount: 45000, months: 3, parent: 'Sunil Gupta', phone: '9123456780' },
    ];

    return (
        <div className="space-y-6">
            {/* Summary Banner */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-red-900">₹ 8,45,000</h2>
                        <p className="text-sm text-red-700">Total Outstanding Fees (Overdue &gt; 30 Days)</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                    Send Bulk Reminders
                </button>
            </div>

            {/* Defaulter List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-800">Defaulter List (High Priority)</h4>
                    <span className="text-xs text-gray-400">Showing top 50 pending</span>
                </div>
                <ReportTable
                    columns={[
                        { header: 'Student Name', key: 'name', className: 'font-medium' },
                        { header: 'Class', key: 'class' },
                        { header: 'Due Amount', key: 'dueAmount', align: 'right', render: (row) => <span className="font-bold text-red-600">₹ {row.dueAmount.toLocaleString()}</span> },
                        { header: 'Overdue By', key: 'months', align: 'right', render: (row) => `${row.months} Month(s)` },
                        {
                            header: 'Parent Contact', key: 'parent', render: (row) => (
                                <div className="flex items-center gap-2">
                                    <span>{row.parent}</span>
                                    <a href={`tel:${row.phone}`} className="p-1 bg-gray-100 rounded hover:bg-indigo-50 hover:text-indigo-600 text-gray-500">
                                        <Phone size={12} />
                                    </a>
                                </div>
                            )
                        }
                    ]}
                    data={defaulters}
                    highlightRowCondition={(row) => row.months >= 3}
                />
            </div>
        </div>
    );
};

export default OutstandingDuesReports;
