import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

const ReportFilters = ({ years, classes, onFilterApply }) => {
    const [selectedYear, setSelectedYear] = useState(years[0]);
    const [selectedClass, setSelectedClass] = useState(classes[0].id);

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                    <Filter size={14} />
                </div>
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Report Context</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-xl p-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-xl p-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default ReportFilters;
