import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import SimpleFinanceTable from './components/SimpleFinanceTable';

const FinanceReports = () => {
    const { fetchFinanceReport } = useAdminStore();
    const [filters, setFilters] = useState({
        dateRange: 'this_month',
        branch: 'all',
        department: 'all',
        search: ''
    });
    const [reportData, setReportData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchFinanceReport({
                    branchId: filters.branch,
                    dateRange: filters.dateRange,
                    report: 'collection'
                });
                setReportData(data || {});
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [filters.branch, filters.dateRange, fetchFinanceReport]);

    const getTitle = () => 'Fee Collection Summary';

    return (
        <div className="min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">{getTitle()}</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        Financial Intelligence • {filters.dateRange.replace('_', ' ')}
                        <Info size={14} className="text-gray-400" />
                    </p>
                </div>
            </div>

            {/* Simple Filters + Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto pb-10">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4 flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Branch</label>
                            <select
                                value={filters.branch}
                                onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="all">All</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Date Range</label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="this_month">This Month</option>
                                <option value="last_month">Last Month</option>
                            </select>
                        </div>
                    </div>

                    <SimpleFinanceTable data={reportData} loading={loading} />
                </div>
            </div>

        </div>
    );
};

export default FinanceReports;
