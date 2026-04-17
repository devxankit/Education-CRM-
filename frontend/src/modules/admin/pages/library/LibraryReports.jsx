import React from 'react';
import { BarChartHorizontal, TrendingUp, PieChart, Download } from 'lucide-react';
import LibraryStats from './components/LibraryStats';
import { libraryStats } from '../../data/libraryData';

const LibraryReports = () => {
    const stats = [
        { label: 'Circulation Rate', value: '78%', icon: TrendingUp, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { label: 'Active Members', value: libraryStats.totalMembers, icon: BarChartHorizontal, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'Lost/Damaged', value: '4', icon: PieChart, bgColor: 'bg-red-50', iconColor: 'text-red-600' },
        { label: 'Avg Loan Time', value: '11 Days', icon: BarChartHorizontal, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' }
    ];

    const reports = [
        { title: 'Monthly Circulation Report', description: 'Summary of books issued and returned in the last 30 days.', type: 'PDF/Excel' },
        { title: 'Overdue Summary', description: 'Detailed list of members with overdue books and pending fines.', type: 'Excel' },
        { title: 'New Acquisitions', description: 'List of books added to the inventory this academic quarter.', type: 'PDF' },
        { title: 'Category Distribution', description: 'Analysis of book count and usage across different categories.', type: 'CSV' }
    ];

    return (
        <div className="flex flex-col pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Library Reports</h1>
                    <p className="text-gray-500 text-sm">Comprehensive analytics on book distribution and stock.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm font-medium transition-all">
                    <Download size={18} /> Export Dashboard
                </button>
            </div>

            <LibraryStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-600" /> Shelf Occupancy
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Fiction', val: 85, color: 'bg-blue-500' },
                            { label: 'Technology', val: 42, color: 'bg-indigo-500' },
                            { label: 'Self-Help', val: 76, color: 'bg-purple-500' },
                            { label: 'Reference', val: 92, color: 'bg-teal-500' }
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{item.label}</span>
                                    <span className="font-semibold text-gray-900">{item.val}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Downloads</h3>
                    <div className="space-y-3">
                        {reports.map((report, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-gray-50 rounded-lg hover:bg-gray-50 transition-colors group">
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-900">{report.title}</h4>
                                    <p className="text-xs text-gray-500">{report.description}</p>
                                </div>
                                <button className="p-2 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryReports;
