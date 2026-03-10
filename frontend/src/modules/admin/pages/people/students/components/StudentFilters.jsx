
import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

const StudentFilters = ({
    searchTerm,
    onSearchChange,
    selectedClass,
    onClassChange,
    classOptions = [],
    selectedSection,
    onSectionChange,
    sectionOptions = [],
    selectedStatus,
    onStatusChange,
    statusOptions = [],
    onResetFilters,
    onExport
}) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by Name, Admission No, or Roll No..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">

                <select
                    value={selectedClass}
                    onChange={(e) => onClassChange(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-indigo-500"
                >
                    <option value="">Class (All)</option>
                    {classOptions.map((className) => (
                        <option key={className} value={className}>{className}</option>
                    ))}
                </select>

                <select
                    value={selectedSection}
                    onChange={(e) => onSectionChange(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-indigo-500"
                >
                    <option value="">Section (All)</option>
                    {sectionOptions.map((sectionName) => (
                        <option key={sectionName} value={sectionName}>{sectionName}</option>
                    ))}
                </select>

                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-indigo-500"
                >
                    <option value="">Status (All)</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <button
                    type="button"
                    title="Clear filters"
                    onClick={onResetFilters}
                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                >
                    <Filter size={18} />
                </button>

                <button
                    type="button"
                    title="Export filtered students"
                    onClick={onExport}
                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                >
                    <Download size={18} />
                </button>

            </div>

        </div>
    );
};

export default StudentFilters;
