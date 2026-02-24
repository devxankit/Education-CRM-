
import React, { useState, useEffect } from 'react';
import ReportTable from './components/ReportTable';
import { FileText } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import ReportChart from '@/modules/admin/components/reports/ReportChart';

const AcademicReports = () => {
    const { branches, fetchBranches, fetchAcademicReport } = useAdminStore();

    const [filters, setFilters] = useState({ academicYearId: '', classSection: 'ALL' });
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('');

    useEffect(() => { fetchBranches(); }, [fetchBranches]);
    useEffect(() => {
        if (branches.length && !selectedBranchId) setSelectedBranchId(branches[0]._id);
    }, [branches, selectedBranchId]);

    useEffect(() => {
        const load = async () => {
            if (!selectedBranchId) return;
            setLoading(true);
            try {
                const params = { report: 'attendance' };
                params.branchId = selectedBranchId;
                if (filters.academicYearId) params.academicYearId = filters.academicYearId;
                if (filters.classSection && filters.classSection !== 'ALL') params.classSection = filters.classSection;
                const data = await fetchAcademicReport(params);
                setReportData(data.reportData || []);
                setChartData(data.chartData || []);
                setPieData(data.pieData || []);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [filters, selectedBranchId, fetchAcademicReport]);

    // Helpers
    const getColumns = () => {
        return [
            { label: 'Class / Section', key: 'class', render: (r) => <span className="font-bold text-indigo-900">{r.class}</span> },
            { label: 'Avg Attendance', key: 'present', render: (r) => <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">{r.present}</span> },
            { label: 'Absent Rate', key: 'absent' },
            { label: 'Highlights', key: 'late', render: (r) => <span className="text-xs text-orange-600">{r.late}</span> }
        ];
    };

    const getReportTitle = () => {
        return 'Attendance Summary by Class / Section';
    };

    return (
        <div className="pb-20 min-h-screen bg-gray-50/50 relative">

                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
                            <FileText className="text-indigo-600" />
                            {getReportTitle()}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Quick academic summary by branch and academic year.
                        </p>
                    </div>
                </div>

                {/* Simple Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Branch</label>
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            {branches.map((b) => (
                                <option key={b._id} value={b._id}>{b.name || b.branchName || 'Branch'}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Class / Section</label>
                        <select
                            value={filters.classSection}
                            onChange={(e) => setFilters(prev => ({ ...prev, classSection: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="ALL">All</option>
                        </select>
                    </div>
                </div>

                {/* Simple Output: table only */}
                {loading ? (
                    <div className="bg-white rounded-xl border border-gray-200 h-72 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-400 text-sm">Generating report data...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <ReportTable
                            columns={getColumns()}
                            data={reportData}
                        />
                    </div>
                )}

        </div>
    );
};

export default AcademicReports;
