import React from 'react';
import { Filter, Calendar, Search } from 'lucide-react';

const ReportFilterPanel = ({ filters, onChange }) => {

    // Generic handlers
    const handleChange = (key, value) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">

            {/* Left: Common Filters */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">

                {/* Date Range - Simplified Mock */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <Calendar size={12} /> Date Range
                    </label>
                    <select
                        className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 text-gray-700"
                        value={filters.dateRange || 'this_month'}
                        onChange={(e) => handleChange('dateRange', e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="this_week">This Week</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="this_quarter">This Quarter</option>
                        <option value="this_year">This Year</option>
                    </select>
                </div>

                {/* Branch */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Branch</label>
                    <select
                        className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 text-gray-700 min-w-[140px]"
                        value={filters.branch || 'all'}
                        onChange={(e) => handleChange('branch', e.target.value)}
                    >
                        <option value="all">All Branches</option>
                        <option value="main">Main Campus</option>
                        <option value="north">North Wing</option>
                    </select>
                </div>

                {/* Department */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Department</label>
                    <select
                        className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 text-gray-700 min-w-[140px]"
                        value={filters.department || 'all'}
                        onChange={(e) => handleChange('department', e.target.value)}
                    >
                        <option value="all">All Departments</option>
                        <option value="academic">Academic</option>
                        <option value="admin">Administration</option>
                        <option value="support">Support Staff</option>
                    </select>
                </div>

            </div>

            {/* Right: Search / Actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search specific staff..."
                        className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                        value={filters.search || ''}
                        onChange={(e) => handleChange('search', e.target.value)}
                    />
                </div>
                <button className="p-2 border border-gray-300 rounded bg-white text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors" title="More Filters">
                    <Filter size={18} />
                </button>
            </div>

        </div>
    );
};

export default ReportFilterPanel;
