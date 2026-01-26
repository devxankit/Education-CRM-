
import React, { useState } from 'react';
import { Target, CheckSquare, Search } from 'lucide-react';

const AudienceSelector = ({ selectedAudiences, onUpdate }) => {

    // Mocks
    const audienceTypes = [
        { id: 'STUDENT', label: 'Students', count: 1240 },
        { id: 'PARENT', label: 'Parents', count: 1150 },
        { id: 'TEACHER', label: 'Teachers', count: 85 },
        { id: 'STAFF', label: 'Staff', count: 42 }
    ];

    const filters = {
        Classes: ['Class 10', 'Class 11', 'Class 12'],
        Sections: ['A', 'B', 'C'],
        Departments: ['Science', 'Commerce', 'Arts']
    };

    const toggleAudience = (id) => {
        if (selectedAudiences.includes(id)) {
            onUpdate(selectedAudiences.filter(a => a !== id));
        } else {
            onUpdate([...selectedAudiences, id]);
        }
    };

    return (
        <div className="space-y-6">

            {/* Main Entity Toggle */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {audienceTypes.map(aud => {
                    const isSelected = selectedAudiences.includes(aud.id);
                    return (
                        <div
                            key={aud.id}
                            onClick={() => toggleAudience(aud.id)}
                            className={`
                                cursor-pointer p-4 rounded-xl border-2 transition-all text-center
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }
                            `}
                        >
                            <div className="font-bold mb-1">{aud.label}</div>
                            <div className="text-xs opacity-80">{aud.count} Users</div>
                            {isSelected && <div className="mt-2 mx-auto w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
                        </div>
                    );
                })}
            </div>

            {/* Advance Filters (Conditional) */}
            {selectedAudiences.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                        <Target size={16} /> Narrow Audience Scope (Optional)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(selectedAudiences.includes('STUDENT') || selectedAudiences.includes('PARENT')) && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Class</label>
                                    <select className="w-full bg-white border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="ALL">All Classes</option>
                                        {filters.Classes.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Section</label>
                                    <select className="w-full bg-white border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="ALL">All Sections</option>
                                        {filters.Sections.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        {(selectedAudiences.includes('TEACHER') || selectedAudiences.includes('STAFF')) && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
                                <select className="w-full bg-white border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="ALL">All Departments</option>
                                    {filters.Departments.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                        <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                            ~ 245 Recipients Estimated
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudienceSelector;
