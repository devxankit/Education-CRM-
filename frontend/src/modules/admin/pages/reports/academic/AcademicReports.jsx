
import React, { useState, useEffect } from 'react';
import ReportSidebar from './components/ReportSidebar';
import ReportFilterPanel from './components/ReportFilterPanel';
import ReportChart from './components/ReportChart';
import ReportTable from './components/ReportTable';
import { FileText } from 'lucide-react';

const AcademicReports = () => {

    // UI State
    const [activeCategory, setActiveCategory] = useState('ATTENDANCE');
    const [activeReport, setActiveReport] = useState('att_summary');
    const [filters, setFilters] = useState({ academicYear: '2025-2026', classSection: 'ALL' });
    const [loading, setLoading] = useState(false);

    // Mock Data State
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        setLoading(true);
        // Simulate API Fetch
        setTimeout(() => {
            // Mocking different data based on active report
            if (activeCategory === 'ATTENDANCE') {
                setReportData([
                    { class: 'Class 10-A', present: '92%', absent: '8%', late: '5 students' },
                    { class: 'Class 10-B', present: '88%', absent: '12%', late: '2 students' },
                    { class: 'Class 11-A', present: '95%', absent: '5%', late: '0 students' },
                    { class: 'Class 12-A', present: '85%', absent: '15%', late: '8 students' }
                ]);
            } else if (activeCategory === 'EXAMS') {
                setReportData([
                    { subject: 'Mathematics', avg: '78%', highest: '99%', fail: '2' },
                    { subject: 'Physics', avg: '65%', highest: '94%', fail: '5' },
                    { subject: 'English', avg: '82%', highest: '96%', fail: '0' },
                    { subject: 'Computer Sci', avg: '88%', highest: '100%', fail: '1' }
                ]);
            } else {
                setReportData([]);
            }
            setLoading(false);
        }, 600);
    }, [activeReport, filters]);

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
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
                        <FileText className="text-indigo-600" />
                        {getReportTitle()}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Analytics dashboard generated for <span className="font-mono bg-gray-100 px-1 rounded text-gray-700">AY {filters.academicYear}</span>
                    </p>
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
                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ReportChart
                                type="BAR"
                                title={activeCategory === 'ATTENDANCE' ? "Section Comparison" : "Subject Average Scores"}
                            />
                            <ReportChart
                                type="PIE"
                                title={activeCategory === 'ATTENDANCE' ? "Overall Distribution" : "Pass / Fail Ratio"}
                            />
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
