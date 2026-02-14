
import React, { useState, useMemo } from 'react';
import { User, Edit2, Trash2, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

const DesignationList = ({ designations, onEdit, onDelete, onAdd, showAddButton = true }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.max(1, Math.ceil(designations.length / itemsPerPage));

    const paginatedDesignations = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return designations.slice(start, start + itemsPerPage);
    }, [designations, currentPage, itemsPerPage]);

    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    }, [designations.length, totalPages, currentPage]);

    return (
        <div className="space-y-2">
            {paginatedDesignations.map((des, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index;
                return (
                    <div
                        key={actualIndex}
                        className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-indigo-100 hover:shadow transition-all group flex flex-wrap sm:flex-nowrap items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                                <User size={18} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-gray-800 truncate">{des.name}</h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">{des.code}</span>
                                    <span className="text-[10px] text-indigo-600 font-bold">Lvl {des.level}</span>
                                    {des.reportsTo && (
                                        <span className="text-[10px] text-gray-400 truncate">→ {des.reportsTo}</span>
                                    )}
                                    <span className={`text-[10px] font-bold ${des.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {des.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => onEdit(des, actualIndex)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(actualIndex)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                );
            })}

            {designations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/80">
                    <div className="p-4 rounded-xl bg-indigo-50/50 mb-3">
                        <Briefcase size={32} className="text-indigo-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">No designations yet</p>
                    <p className="text-xs text-gray-500 mb-5 max-w-[200px] text-center">Add roles like Lecturer, HOD, Accountant, etc.</p>
                    {showAddButton && onAdd && (
                        <button
                            onClick={onAdd}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                        >
                            <span>+</span> Add Designation
                        </button>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-1 mt-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DesignationList;
