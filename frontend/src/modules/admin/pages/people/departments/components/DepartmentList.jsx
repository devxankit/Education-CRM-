
import React, { useState, useMemo } from 'react';
import { Building2, Users, ChevronRight, Briefcase, ChevronLeft, ChevronRight as ChevronRightIcon, Plus } from 'lucide-react';
import DepartmentStatusBadge from './DepartmentStatusBadge';

const DepartmentList = ({ departments, selectedId, onSelect, onAdd }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.max(1, Math.ceil(departments.length / itemsPerPage));

    const paginatedDepartments = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return departments.slice(start, start + itemsPerPage);
    }, [departments, currentPage, itemsPerPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [departments.length]);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <h3 className="font-bold text-gray-800">Departments</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-full">{departments.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                {paginatedDepartments.map((dept) => (
                    <div
                        key={dept._id}
                        onClick={() => onSelect(dept)}
                        className={`
                            border rounded-lg p-3 cursor-pointer transition-all relative group
                            ${selectedId === dept._id
                                ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                                : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className={`font-bold text-sm ${selectedId === dept._id ? 'text-indigo-900' : 'text-gray-800'}`}>
                                    {dept.name}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1 rounded flex items-center gap-1 w-fit mt-1">
                                    <Building2 size={10} /> {dept.code} • {dept.type}
                                </span>
                            </div>
                            <DepartmentStatusBadge status={dept.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className="flex items-center gap-1.5">
                                <Users size={12} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-700">{dept.employeeCount ?? 0}</span>
                                <span className="text-[10px] text-gray-400">employees</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Briefcase size={12} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-700">{dept.designationsCount ?? (dept.designations?.length ?? 0)}</span>
                                <span className="text-[10px] text-gray-400">roles</span>
                            </div>
                        </div>

                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 ${selectedId === dept._id ? 'text-indigo-400' : 'opacity-0 group-hover:opacity-100'}`}>
                            <ChevronRight size={20} />
                        </div>

                    </div>
                ))}

                {departments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="p-4 rounded-xl bg-gray-50 mb-3">
                            <Building2 size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium mb-1">No departments yet</p>
                        <p className="text-gray-400 text-xs">Use the button below to add one</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    >
                        <ChevronRightIcon size={18} />
                    </button>
                </div>
            )}

            <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
                <button
                    onClick={onAdd}
                    className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={18} /> Add Department
                </button>
            </div>
        </div>
    );
};

export default DepartmentList;
