
import React, { useState, useEffect } from 'react';
import ReportSidebar from './components/ReportSidebar';
import ReportFilterPanel from './components/ReportFilterPanel';
import ReportTable from './components/ReportTable';
import { FileText } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import ReportChart from '@/modules/admin/components/reports/ReportChart';

const AcademicReports = () => {
    const { branches, fetchBranches, fetchAcademicReport } = useAdminStore();

    const [activeCategory, setActiveCategory] = useState('ATTENDANCE');
    const [activeReport, setActiveReport] = useState('att_summary');
    const [filters, setFilters] = useState({ academicYear: '2025-2026', classSection: 'ALL' });
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
        const report = activeCategory === 'ATTENDANCE' ? 'attendance' : activeCategory === 'EXAMS' ? 'exams' : 'attendance';
        const load = async () => {
            setLoading(true);
            try {
                const params = { report };
                if (selectedBranchId) params.branchId = selectedBranchId;
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
    }, [activeCategory, activeReport, filters, selectedBranchId, fetchAcademicReport]);

    // Helpers
    const getColumns = () => {
        if (activeCategory === 'ATTENDANCE') {
            return [
                { label: 'Class / Section', key: 'class', render: (r) => <span className="font-bold text-indigo-900">{r.class}</span> },
                { label: 'Avg Attendance', key: 'present', render: (r) => <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">{r.present}</span> },
                { label: 'Absent Rate', key: 'absent' },
                { label: 'Highlights', key: 'late', render: (r) => <span className="text-xs text-orange-600">{r.late}</span> }
            ];
        }
        if (activeCategory === 'EXAMS') {
            return [
                { label: 'Subject', key: 'subject', render: (r) => <span className="font-bold">{r.subject}</span> },
                { label: 'Avg Score', key: 'avg' },
                { label: 'Highest', key: 'highest', render: (r) => <span className="text-indigo-600 font-bold">{r.highest}</span> },
                { label: 'Fail Count', key: 'fail', render: (r) => r.fail > 0 ? <span className="text-red-500 font-bold bg-red-50 px-2 rounded">{r.fail}</span> : <span className="text-gray-400">-</span> }
            ];
        }
        return [];
    };

    const getReportTitle = () => {
        const titles = {
            'att_summary': 'Overall Attendance Summary',
            'att_class': 'Class-wise Attendance Detail',
            'att_chronic': 'Chronic Absentee List',
            'exam_summary': 'Examination Result Summary',
            'exam_subject': 'Subject-wise Performance',
            'exam_toppers': 'Toppers & Merit List',
            'perf_trends': 'Academic Trend Analysis',
            'work_load': 'Teacher Workload Distribution'
        };
        return titles[activeReport] || 'Academic Report';
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 pb-20 min-h-screen bg-gray-50/50 relative">

            {/* Left Sidebar */}
            <ReportSidebar
                activeCategory={activeCategory}
                activeReport={activeReport}
                onSelect={(cat, rep) => {
                    setActiveCategory(cat);
                    setActiveReport(rep);
                }}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">

                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
                            <FileText className="text-indigo-600" />
                            {getReportTitle()}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Analytics dashboard for <span className="font-mono bg-gray-100 px-1 rounded text-gray-700">AY {filters.academicYear}</span>
                            {branches.length > 1 && (
                                <>
                                    {' • '}
                                    <select
                                        value={selectedBranchId}
                                        onChange={(e) => setSelectedBranchId(e.target.value)}
                                        className="text-gray-700 font-medium bg-transparent border-0 cursor-pointer"
                                    >
                                        {branches.map((b) => (
                                            <option key={b._id} value={b._id}>{b.name || b.branchName || 'Branch'}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <ReportFilterPanel
                    type={activeCategory}
                    filters={filters}
                    onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
                />

                {/* Report Output */}
                {loading ? (
                    <div className="bg-white rounded-xl border border-gray-200 h-96 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-400 text-sm">Generating report data...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-gray-700 mb-4">{activeCategory === 'ATTENDANCE' ? 'Section Comparison' : 'Subject Average Scores'}</h4>
                                <ReportChart
                                    type="bar"
                                    data={chartData}
                                    dataKey={activeCategory === 'ATTENDANCE' ? ['present', 'absent'] : 'avg'}
                                    categoryKey="name"
                                    colors={['#6366f1', '#f59e0b']}
                                />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-gray-700 mb-4">{activeCategory === 'ATTENDANCE' ? 'Overall Distribution' : 'Pass / Fail Ratio'}</h4>
                                <ReportChart
                                    type="pie"
                                    data={pieData}
                                    dataKey="value"
                                    categoryKey="name"
                                />
                            </div>
                        </div>

                        {/* Table Area */}
                        <div className="min-h-[300px]">
                            <ReportTable
                                columns={getColumns()}
                                data={reportData}
                            />
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
};

export default AcademicReports;
