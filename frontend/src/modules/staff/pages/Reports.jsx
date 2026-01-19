
import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { BarChart, FileText, Calendar, Download, Filter, ChevronDown } from 'lucide-react';

const ReportTypes = {
    STUDENT_COUNT: 'Student Count',
    FEE_STATUS: 'Fee Status',
    DOC_COMPLETION: 'Document Completion',
    TRANSPORT_UTIL: 'Transport Utilization',
    TICKET_RESOLUTION: 'Ticket Resolution'
};

const MOCK_DATA = {
    [ReportTypes.STUDENT_COUNT]: [
        { id: 1, class: '10-A', male: 20, female: 15, total: 35 },
        { id: 2, class: '10-B', male: 18, female: 18, total: 36 },
        { id: 3, class: '12-C', male: 22, female: 10, total: 32 },
    ],
    [ReportTypes.FEE_STATUS]: [
        { id: 1, class: '10-A', paid: 15, partial: 10, due: 10, collection: '₹4,50,000' },
        { id: 2, class: '10-B', paid: 20, partial: 5, due: 11, collection: '₹5,20,000' },
    ],
    // ...other mock data patterns
};

const Reports = () => {
    const { user } = useStaffAuth();
    const isAccounts = user?.role === STAFF_ROLES.ACCOUNTS;

    const [activeReport, setActiveReport] = useState(ReportTypes.STUDENT_COUNT);
    const [dateRange, setDateRange] = useState('This Month');

    const availableReports = Object.values(ReportTypes).filter(type => {
        if (type === ReportTypes.FEE_STATUS && !isAccounts) return false;
        return true;
    });

    const currentData = MOCK_DATA[activeReport] || MOCK_DATA[ReportTypes.STUDENT_COUNT]; // Fallback mock

    return (
        <div className="max-w-7xl mx-auto pb-20 md:pb-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Operational Reports</h1>
                    <p className="text-sm text-gray-500">View summaries and export data</p>
                </div>
                {isAccounts && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">
                        <Download size={18} /> Export CSV
                    </button>
                )}
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Report Type</label>
                    <div className="relative">
                        <select
                            value={activeReport}
                            onChange={(e) => setActiveReport(e.target.value)}
                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {availableReports.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>

                <div className="w-full md:w-64">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Time Period</label>
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Last Quarter</option>
                        </select>
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <ReportTable type={activeReport} data={currentData} />
        </div>
    );
};

// --- SUB-COMPONENT ---

const ReportTable = ({ type, data }) => {
    // Dynamic Column Headers based on report type
    const getHeaders = () => {
        switch (type) {
            case ReportTypes.STUDENT_COUNT: return ['Class', 'Male', 'Female', 'Total'];
            case ReportTypes.FEE_STATUS: return ['Class', 'Paid', 'Partial', 'Due', 'Total Collection'];
            default: return ['Class', 'Metric A', 'Metric B', 'Total'];
        }
    };

    const headers = getHeaders();
    const keys = Object.keys(data[0] || {}).filter(k => k !== 'id');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <FileText size={18} className="text-gray-400" />
                    {type}
                </h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{data.length} Records</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i} className="px-6 py-3 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                {keys.map((key, i) => (
                                    <td key={i} className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {row[key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="p-10 text-center text-gray-400">
                    No data available for this period.
                </div>
            )}
        </div>
    );
};

export default Reports;