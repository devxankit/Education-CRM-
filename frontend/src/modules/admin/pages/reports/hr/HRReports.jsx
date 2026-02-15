import React, { useState } from 'react';
import { Download, Share2, Printer, Info } from 'lucide-react';

// Components
import HRReportSidebar from './components/HRReportSidebar';
import ReportFilterPanel from './components/ReportFilterPanel';

// Sub Reports
import StaffAttendanceReports from './components/StaffAttendanceReports';
import LeaveReports from './components/LeaveReports';
import StaffStrengthReports from './components/StaffStrengthReports';
import ContractComplianceReports from './components/ContractComplianceReports';
import PayrollSummaryReports from './components/PayrollSummaryReports';
import JoinerExitReports from './components/JoinerExitReports';

const HRReports = () => {

    // State
    const [activeCategory, setActiveCategory] = useState('attendance');
    const [filters, setFilters] = useState({
        dateRange: 'this_month',
        branch: 'all',
        department: 'all',
        search: ''
    });

    // Audit Logging Simulation
    React.useEffect(() => {
        console.log(`[AUDIT] Action: VIEW_REPORT | Category: ${activeCategory} | Filters:`, filters, '| User: CurrentUser | Time:', new Date().toISOString());
    }, [activeCategory, filters]);

    // Content Map
    const renderContent = () => {
        switch (activeCategory) {
            case 'attendance': return <StaffAttendanceReports filters={filters} />;
            case 'leave': return <LeaveReports filters={filters} />;
            case 'strength': return <StaffStrengthReports filters={filters} />;
            case 'compliance': return <ContractComplianceReports filters={filters} />;
            case 'payroll': return <PayrollSummaryReports filters={filters} />;
            case 'turnover': return <JoinerExitReports filters={filters} />;
            default: return <StaffAttendanceReports filters={filters} />;
        }
    };

    const getTitle = () => {
        const titles = {
            attendance: 'Staff Attendance Analytics',
            leave: 'Leave & Absence Overview',
            strength: 'Workforce Distribution',
            compliance: 'Compliance & Contracts',
            payroll: 'Payroll Cost Analysis',
            turnover: 'Talent Acquisition & Exits'
        };
        return titles[activeCategory];
    };

    return (
        <div className="flex min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6">

            {/* Left Sidebar */}
            <HRReportSidebar
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
            />

            {/* Right Main Panel */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">{getTitle()}</h1>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            Human Resources Analytics • {filters.dateRange.replace('_', ' ')}
                            <Info size={14} className="text-gray-400" />
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Print Report">
                            <Printer size={18} />
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Share2 size={16} /> Share
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <ReportFilterPanel
                    filters={filters}
                    onChange={setFilters}
                />

                {/* Scrollable Report Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto pb-10">
                        {renderContent()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HRReports;
