
import React from 'react';
import { Search, Filter, Archive, ChevronRight, DollarSign } from 'lucide-react';
import FeeStructureStatusBadge from './FeeStructureStatusBadge';

const FeeStructureList = ({ structures, selectedId, onSelect, onFilterChange }) => {

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search fees..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        onChange={(e) => onFilterChange('year', e.target.value)}
                        className="flex-1 text-xs border border-gray-300 rounded-lg p-2 bg-white outline-none"
                    >
                        <option value="">All Years</option>
                        <option value="2025-26">2025-26</option>
                        <option value="2024-25">2024-25</option>
                    </select>
                    <select
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="flex-1 text-xs border border-gray-300 rounded-lg p-2 bg-white outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
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
                        {structures.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onSelect(item)}
                                className={`
                                    p-4 cursor-pointer hover:bg-gray-50 transition-colors group relative
                                    ${selectedId === item.id ? 'bg-indigo-50/60' : ''}
                                `}
                            >
                                {selectedId === item.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                                )}

                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-semibold text-sm ${selectedId === item.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                                        {item.name}
                                    </h4>
                                    <FeeStructureStatusBadge status={item.status} />
                                </div>

                                <div className="flex justify-between items-end text-xs text-gray-500">
                                    <div className="space-y-1">
                                        <p>{item.academicYear} • {item.classOrProgram}</p>
                                        <p className="flex items-center gap-1 font-mono text-gray-600">
                                            <DollarSign size={12} /> Total: ${item.totalAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <ChevronRight size={16} className={`text-gray-300 ${selectedId === item.id ? 'text-indigo-400' : ''}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeStructureList;
