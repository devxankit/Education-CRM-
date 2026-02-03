
import React from 'react';
import { Search, Filter, Archive, ChevronRight, DollarSign } from 'lucide-react';
import FeeStructureStatusBadge from './FeeStructureStatusBadge';

const FeeStructureList = ({ structures, selectedId, onSelect, onFilterChange, academicYears = [], branches = [] }) => {

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-['Inter']">

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search fees..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                </div>

                {/* Filters Grid */}
                <div className="flex flex-col gap-2">
                    {branches.length > 0 && (
                        <select
                            onChange={(e) => onFilterChange('branchId', e.target.value)}
                            className="w-full text-[11px] font-bold border border-gray-200 rounded-lg p-2 bg-gray-50 text-gray-600 outline-none cursor-pointer focus:border-indigo-500 transition-colors uppercase tracking-wider"
                        >
                            <option value="">All Branches</option>
                            {branches.map(branch => (
                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                            ))}
                        </select>
                    )}

                    <div className="flex gap-2">
                        <select
                            onChange={(e) => onFilterChange('year', e.target.value)}
                            className="flex-1 text-[11px] font-bold border border-gray-200 rounded-lg p-2 bg-white text-gray-600 outline-none cursor-pointer focus:border-indigo-500 transition-colors uppercase tracking-wider"
                        >
                            <option value="">All Years</option>
                            {academicYears.map(year => (
                                <option key={year._id} value={year._id}>{year.name}</option>
                            ))}
                        </select>
                        <select
                            onChange={(e) => onFilterChange('status', e.target.value)}
                            className="flex-1 text-[11px] font-bold border border-gray-200 rounded-lg p-2 bg-white text-gray-600 outline-none cursor-pointer focus:border-indigo-500 transition-colors uppercase tracking-wider"
                        >
                            <option value="">Status</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {structures.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
                        No fee structures found.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {structures.map((item) => {
                            const id = item._id || item.id;
                            const isSelected = selectedId === id;
                            return (
                                <div
                                    key={id}
                                    onClick={() => onSelect(item)}
                                    className={`
                                        p-4 cursor-pointer hover:bg-gray-50 transition-colors group relative
                                        ${isSelected ? 'bg-indigo-50/60' : ''}
                                    `}
                                >
                                    {isSelected && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                                    )}

                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                            {item.name}
                                        </h4>
                                        <FeeStructureStatusBadge status={item.status} />
                                    </div>

                                    <div className="flex justify-between items-end text-xs text-gray-500">
                                        <div className="space-y-1">
                                            <p>{item.academicYearId?.name || 'N/A'} • {item.applicableClasses?.length || 0} Cls • {item.applicableCourses?.length || 0} Progs</p>
                                            <p className="flex items-center gap-1 font-mono text-gray-600">
                                                <DollarSign size={12} /> Total: ₹{(item.totalAmount || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className={`text-gray-300 ${isSelected ? 'text-indigo-400' : ''}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeStructureList;
