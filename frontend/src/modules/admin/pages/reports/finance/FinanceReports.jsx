import React, { useState } from 'react';
import { Download, Share2, Printer, Info } from 'lucide-react';

// Shared Components
import ReportFilterPanel from '../hr/components/ReportFilterPanel';

// Local Components
import FinanceReportSidebar from './components/FinanceReportSidebar';
import FeeCollectionReports from './components/FeeCollectionReports';
import OutstandingDuesReports from './components/OutstandingDuesReports';
import ExpenseReports from './components/ExpenseReports';
import DiscountReports from './components/DiscountReports';
import DailyCollectionReport from './components/DailyCollectionReport';

const FinanceReports = () => {

    // State
    const [activeCategory, setActiveCategory] = useState('collection');
    const [filters, setFilters] = useState({
        dateRange: 'this_month',
        branch: 'all',
        department: 'all',
        search: ''
    });

    // Content Map
    const renderContent = () => {
        switch (activeCategory) {
            case 'collection': return <FeeCollectionReports filters={filters} />;
            case 'dues': return <OutstandingDuesReports filters={filters} />;
            case 'expenses': return <ExpenseReports filters={filters} />;
            case 'discounts': return <DiscountReports filters={filters} />;
            case 'dcr': return <DailyCollectionReport filters={filters} />;
            default: return <FeeCollectionReports filters={filters} />;
        }
    };

    const getTitle = () => {
        const titles = {
            collection: 'Fee Collection Analytics',
            dues: 'Outstanding Dues & Defaulters',
            expenses: 'Operational Expense Analysis',
            discounts: 'Scholarship & Concessions',
            dcr: 'Daily Collection Registry (DCR)'
        };
        return titles[activeCategory];
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50 border-t border-gray-200 -mt-6 -mx-8">

            {/* Sidebar */}
            <FinanceReportSidebar
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
                            Financial Intelligence • {filters.dateRange.replace('_', ' ')}
                            <Info size={14} className="text-gray-400" />
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Print Statement">
                            <Printer size={18} />
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                            <Download size={16} /> Export Financials
                        </button>
                    </div>
                </div>

                {/* Filters - Reusing HR Filter Panel for consistency */}
                <ReportFilterPanel
                    filters={filters}
                    onChange={setFilters}
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

export default FinanceReports;
