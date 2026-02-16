
import React, { useEffect } from 'react';
import { GraduationCap, Archive, ArchiveRestore, HelpCircle, Building2 } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';
import AcademicLevelBadge from './AcademicLevelBadge';

const ClassesTable = ({ classes, selectedClassId, onSelect, onEdit, onArchive, onUnarchive, hideFooter = false }) => {
    const branches = useAdminStore((state) => state.branches);
    const fetchBranches = useAdminStore((state) => state.fetchBranches);

    useEffect(() => {
        if (branches.length === 0) fetchBranches();
    }, [branches.length, fetchBranches]);

    const getBranchName = (branchId) => {
        if (!branchId || branchId === 'main') return 'Main Branch';
        const b = branches.find((br) => (br._id || br.id) === branchId);
        return b?.name || branchId;
    };

    const getBoardLabel = (board) => {
        const map = { CBSE: 'CBSE', ICSE: 'ICSE', STATE: 'State Board', IB: 'IB', IGCSE: 'IGCSE' };
        return map[board] || board;
    };

    if (!classes || classes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 h-full text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <GraduationCap className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Classes Defined</h3>
                <p className="text-gray-500 text-sm mt-1">Start by adding your first academic class.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Class Hierarchy</span>
                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium">{classes.length} Total</span>
            </div>

            <div className="overflow-auto flex-1 min-h-0">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Class Name</th>
                            <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Branch</th>
                            <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Academic Level</th>
                            <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Board</th>
                            <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Capacity</th>
                            <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {classes.map((cls) => {
                            const isSelected = (cls._id || cls.id) === selectedClassId;
                            return (
                                <tr
                                    key={cls._id || cls.id}
                                    onClick={() => onSelect && onSelect(cls)}
                                    className={`
                                        transition-colors group
                                        ${onSelect ? 'cursor-pointer' : ''}
                                        ${cls.status === 'archived' ? 'bg-gray-50/70 opacity-90' : ''}
                                        ${isSelected ? 'bg-indigo-50' : cls.status !== 'archived' ? 'hover:bg-gray-50' : 'hover:bg-gray-100'}
                                    `}
                                >
                                    <td className="px-4 py-4">
                                        <span className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                            {cls.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                                            <Building2 size={14} className="text-gray-400" />
                                            {getBranchName(cls.branchId)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <AcademicLevelBadge level={cls.level} />
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-xs text-gray-600">{getBoardLabel(cls.board)}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                                            {cls.capacity ?? 40}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        {cls.status === 'archived' ? (
                                            onUnarchive ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUnarchive(cls);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Unarchive Class"
                                                >
                                                    <ArchiveRestore size={14} /> Unarchive
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    <Archive size={12} /> Archived
                                                </span>
                                            )
                                        ) : onArchive ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onArchive(cls);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Archive Class"
                                            >
                                                <Archive size={16} />
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {!hideFooter && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 flex items-center justify-center gap-1 shrink-0">
                    <HelpCircle size={12} /> Select a class to view sections
                </div>
            )}
        </div>
    );
};

export default ClassesTable;
