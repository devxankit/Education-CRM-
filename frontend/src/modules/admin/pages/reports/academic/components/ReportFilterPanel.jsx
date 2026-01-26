
import React from 'react';
import {
    Users,
    Calendar,
    Filter,
    Download
} from 'lucide-react';

const ReportFilterPanel = ({ type, filters, onFilterChange }) => {

    // Common Filters
    const renderCommonFilters = () => (
        <>
            <div className="w-full md:w-auto">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Academic Year</label>
                <select
                    className="w-full md:w-40 bg-white border border-gray-300 text-sm rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.academicYear || ''}
                    onChange={(e) => onFilterChange('academicYear', e.target.value)}
                >
                    <option>2025-2026</option>
                    <option>2024-2025</option>
                </select>
            </div>

            <div className="w-full md:w-auto">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class & Section</label>
                <select
                    className="w-full md:w-48 bg-white border border-gray-300 text-sm rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.classSection || ''}
                    onChange={(e) => onFilterChange('classSection', e.target.value)}
                >
                    <option value="ALL">All Classes</option>
                    <option>Class 10 - A</option>
                    <option>Class 10 - B</option>
                </select>
            </div>
        </>
    );

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col md:flex-row gap-4 items-end">

                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2 md:mb-0 md:mr-4 shrink-0">
                    <Filter size={18} /> Filters:
                </div>

                {/* Dynamic Filters based on Report Type */}
                {renderCommonFilters()}

                {type.includes('EXAM') && (
                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Exam Term</label>
                        <select
                            className="w-full md:w-40 bg-white border border-gray-300 text-sm rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.exam || ''}
                            onChange={(e) => onFilterChange('exam', e.target.value)}
                        >
                            <option value="ALL">All Exams</option>
                            <option>Mid Term</option>
                            <option>Finals</option>
                        </select>
                    </div>
                )}

                {type.includes('ATTENDANCE') && (
                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                        <select
                            className="w-full md:w-40 bg-white border border-gray-300 text-sm rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.duration || ''}
                            onChange={(e) => onFilterChange('duration', e.target.value)}
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                )}

                <div className="flex-1"></div>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    <Download size={16} /> Export
                </button>

            </div>
        </div>
    );
};

export default ReportFilterPanel;
