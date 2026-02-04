import React from 'react';
import { BookOpen, Users } from 'lucide-react';

const AssignedSubjectsCard = ({ subjects = [], year }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Scope ({year})</h3>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded inline-block">ReadOnly</span>
            </div>

            <div className="space-y-3">
                {subjects.length > 0 ? (
                    subjects.map((sub, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={14} className="text-indigo-600" />
                                <span className="text-sm font-bold text-gray-900">{sub.subjectName}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sub.classes.map((cls, idx) => (
                                    <span key={idx} className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-white border border-gray-200 rounded text-gray-600">
                                        <Users size={10} /> {cls.fullClassName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400">No subjects assigned yet.</p>
                    </div>
                )}
            </div>

            <p className="text-[10px] text-gray-400 mt-3 italic text-center">
                * To change subjects or classes, please contact the administrator.
            </p>
        </div>
    );
};

export default AssignedSubjectsCard;
