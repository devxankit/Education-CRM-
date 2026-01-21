
import React from 'react';
import { BookOpen, GraduationCap, Archive, HelpCircle } from 'lucide-react';
import AcademicLevelBadge from './AcademicLevelBadge';

const ClassesTable = ({ classes, selectedClassId, onSelect, onEdit, onArchive }) => {

    if (!classes || classes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 h-full text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <GraduationCap className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Classes Define</h3>
                <p className="text-gray-500 text-sm mt-1">Start by adding your first academic class.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Class Hierarchy</span>
                <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{classes.length} Total</span>
            </div>

            <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {classes.map((cls) => {
                            const isSelected = cls.id === selectedClassId;
                            return (
                                <tr
                                    key={cls.id}
                                    onClick={() => onSelect(cls)}
                                    className={`
                                        cursor-pointer transition-colors group relative
                                        ${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'}
                                    `}
                                >
                                    {isSelected && <td className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></td>}

                                    <td className="px-4 py-4 pl-5">
                                        <div className="flex flex-col gap-1">
                                            <span className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                {cls.name}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">{cls.code}</span>
                                        </div>
                                    </td>

                                    <td className="px-2 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <AcademicLevelBadge level={cls.level} />
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <BookOpen size={10} /> {cls.board}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-right">
                                        {cls.status === 'archived' ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                <Archive size={10} /> Archived
                                            </span>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onArchive(cls); }}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                                title="Archive Class"
                                            >
                                                <Archive size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 flex items-center gap-1 justify-center">
                <HelpCircle size={12} /> Select a class to view sections
            </div>
        </div>
    );
};

export default ClassesTable;
