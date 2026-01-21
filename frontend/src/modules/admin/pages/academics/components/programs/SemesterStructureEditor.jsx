
import React, { useState } from 'react';
import { Layers, Calendar, Award, Book } from 'lucide-react';

const SemesterStructureEditor = ({ program }) => {

    // Derived state for tabs based on totalSemesters
    const semesterCount = program.totalSemesters || 1;
    const [activeSem, setActiveSem] = useState(1);

    return (
        <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Layers size={18} className="text-indigo-600" />
                    {program.name} <span className="text-gray-400 font-normal">| Structure</span>
                </h2>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {program.duration} Years</span>
                    <span className="flex items-center gap-1"><Layers size={12} /> {program.totalSemesters} Semesters</span>
                    {program.creditSystem && <span className="flex items-center gap-1"><Award size={12} /> Credit System</span>}
                </div>
            </div>

            {/* Semester Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                {Array.from({ length: semesterCount }, (_, i) => i + 1).map((sem) => (
                    <button
                        key={sem}
                        onClick={() => setActiveSem(sem)}
                        className={`
                            px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2
                            ${activeSem === sem
                                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }
                        `}
                    >
                        Semester {sem}
                    </button>
                ))}
            </div>

            {/* Active Semester Config */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Semester {activeSem} Configuration</h3>
                    <p className="text-sm text-gray-500">Define rules and academic load for this term.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Term Duration (Months)</label>
                            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue={6} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Subjects Allowed</label>
                            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue={8} />
                        </div>

                        {program.creditSystem && (
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <label className="block text-xs font-bold text-indigo-800 uppercase mb-2 flex items-center gap-1">
                                    <Award size={12} /> Credit Requirements
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] text-indigo-600 mb-1">Min Credits</label>
                                        <input type="number" className="w-full px-2 py-1 border border-indigo-200 rounded text-sm bg-white" defaultValue={18} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-indigo-600 mb-1">Max Credits</label>
                                        <input type="number" className="w-full px-2 py-1 border border-indigo-200 rounded text-sm bg-white" defaultValue={24} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[200px] flex flex-col justify-center items-center text-center">
                        <Book className="text-gray-300 mb-2" size={32} />
                        <h4 className="text-sm font-semibold text-gray-600">Subject Mapping</h4>
                        <p className="text-xs text-gray-400 max-w-[200px] my-2">
                            To assign specific subjects to this semester, use the <strong>Subject Master</strong> or <strong>Curriculum Planner</strong> tool.
                        </p>
                        <button className="text-xs text-indigo-600 font-medium hover:underline">View Mapped Subjects</button>
                    </div>

                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Reset</button>
                <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700">Save Configuration</button>
            </div>

        </div>
    );
};

export default SemesterStructureEditor;
