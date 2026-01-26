import React, { useState } from 'react';
import { Download, Share2, Printer, Info } from 'lucide-react';

// Components
import OperationsReportSidebar from './components/OperationsReportSidebar';
import ReportFilterPanel from './components/ReportFilterPanel';

// Sub Reports
import TransportReports from './components/TransportReports';
import HostelReports from './components/HostelReports';
import AssetReports from './components/AssetReports';
import ComplianceReports from './components/ComplianceReports';
import SupportReports from './components/SupportReports';

const OperationsReports = () => {

    // State
    const [activeCategory, setActiveCategory] = useState('transport');
    const [filters, setFilters] = useState({
        dateRange: 'this_month',
        route: 'all',
        hostel: 'all',
        category: 'all',
        search: ''
    });

    // Content Map
    const renderContent = () => {
        switch (activeCategory) {
            case 'transport': return <TransportReports filters={filters} />;
            case 'hostel': return <HostelReports filters={filters} />;
            case 'assets': return <AssetReports filters={filters} />;
            case 'compliance': return <ComplianceReports filters={filters} />;
            case 'support': return <SupportReports filters={filters} />;
            default: return <TransportReports filters={filters} />;
        }
    };

    const getTitle = () => {
        const titles = {
            transport: 'Transport Fleet Analytics',
            hostel: 'Hostel & Housing Occupancy',
            assets: 'Asset & Inventory Valuation',
            compliance: 'Operational Compliance Audit',
            support: 'Helpdesk SLA Performance'
        };
        return titles[activeCategory];
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50 border-t border-gray-200 -mt-6 -mx-8">

            {/* Sidebar */}
            <OperationsReportSidebar
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
            />

            {/* Main Panel */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">{getTitle()}</h1>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            Operations Intelligence • {filters.dateRange.replace('_', ' ')}
                            <Info size={14} className="text-gray-400" />
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Print Dashboard">
                            <Printer size={18} />
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                            <Download size={16} /> Export Operations Report
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <ReportFilterPanel
                    filters={filters}
                    onChange={setFilters}
                    category={activeCategory}
                />

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto pb-10">
                        {renderContent()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OperationsReports;
