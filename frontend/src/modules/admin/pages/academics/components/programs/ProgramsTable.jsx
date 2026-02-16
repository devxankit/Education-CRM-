
import React from 'react';
import { BookOpen, GraduationCap, Archive, HelpCircle } from 'lucide-react';
import ProgramStatusBadge from './ProgramStatusBadge';

const ProgramsTable = ({ programs, selectedProgramId, onSelect, onEdit, onDeactivate }) => {

    if (!programs || programs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 h-full text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <GraduationCap className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Degree Programs</h3>
                <p className="text-gray-500 text-sm mt-1">Define your first academic course/degree.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Course Catalog</span>
                <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{programs.length} Total</span>
            </div>

            <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {programs.map((prog) => {
                            const id = prog._id || prog.id;
                            const isSelected = id === selectedProgramId;
                            return (
                                <tr
                                    key={id}
                                    onClick={() => onSelect(prog)}
                                    className={`
                                        cursor-pointer transition-colors group relative
                                        ${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'}
                                    `}
                                >
                                    {isSelected && <td className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></td>}

                                    <td className="px-4 py-4 pl-5">
                                        <div className="flex flex-col gap-1">
                                            <span className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                {prog.name}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">{prog.code}</span>
                                        </div>
                                    </td>

                                    <td className="px-2 py-4">
                                        <div className="flex flex-col gap-1 items-start text-xs">
                                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 uppercase font-bold text-[10px]">
                                                {prog.type}
                                            </span>
                                            <span className="text-gray-500">{prog.duration} Years • {prog.totalSemesters} Sems</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-right">
                                        {prog.status === 'archived' ? (
                                            <ProgramStatusBadge status={prog.status} />
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeactivate(prog); }}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                                title="Archive Program"
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

            {!selectedProgramId && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-1.5 justify-center">
                    <HelpCircle size={14} /> Click a program to configure structure
                </div>
            )}
        </div>
    );
};

export default ProgramsTable;
