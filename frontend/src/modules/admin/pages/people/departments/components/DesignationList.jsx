
import React, { useState, useMemo } from 'react';
import { User, Shield, AlertTriangle, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const DesignationList = ({ designations, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const totalPages = Math.ceil(designations.length / itemsPerPage);

    const paginatedDesignations = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return designations.slice(start, start + itemsPerPage);
    }, [designations, currentPage, itemsPerPage]);

    // Reset page if designations change
    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [designations.length, totalPages, currentPage]);

    return (
        <div className="space-y-3">
            {paginatedDesignations.map((des, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index;
                return (
                    <div key={actualIndex} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:border-gray-200 hover:shadow-md transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                                <User size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">{des.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-500 font-mono bg-gray-50 px-1 rounded">{des.code}</span>
                                    <span className="text-[10px] text-blue-600 font-bold">Level {des.level}</span>
                                    {des.reportsTo && (
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            → Reports to {des.reportsTo}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <span className="block text-xs font-bold text-gray-700">{des.employeeCount || 0} Staff</span>
                                <span className={`text-[10px] uppercase font-bold ${des.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`}>{des.status}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onEdit(des, actualIndex)}
                                    className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                                    title="Edit Designation"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(actualIndex)}
                                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Designation"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {designations.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                    No designations defined for this department yet.
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
