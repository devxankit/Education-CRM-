
import React, { useState } from 'react';
import { X, UserCheck, Search } from 'lucide-react';

const AssignTeacherModal = ({ isOpen, onClose, onAssign, subjectName, subjectId, className, teachersList = [] }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);

    if (!isOpen) return null;

    // Filter teachers who have this subject in their eligibleSubjects
    const eligibleTeachers = teachersList.filter(teacher => {
        // If teacher has eligibleSubjects array, check if current subject is in it
        if (teacher.eligibleSubjects && Array.isArray(teacher.eligibleSubjects)) {
            return teacher.eligibleSubjects.some(subject =>
                (subject._id || subject) === subjectId
            );
        }
        // If no eligibleSubjects defined, show all teachers (backward compatibility)
        return true;
    });

    // Then apply name search filter
    const filteredTeachers = eligibleTeachers.filter(t =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssign = () => {
        if (!selectedTeacherId) return;
        const teacher = teachersList.find(t => (t._id || t.id) === selectedTeacherId);
        onAssign(teacher);
        onClose();
        setSelectedTeacherId(null);
        setSearchTerm('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">

                <div className="bg-indigo-600 px-6 py-4 text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <UserCheck size={20} /> Assign Faculty
                    </h3>
                    <p className="text-indigo-100 text-xs mt-1">
                        Mapping for <strong>{subjectName}</strong> in <strong>{className}</strong>
                    </p>
                    <button onClick={onClose} className="absolute top-4 right-4 hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search faculty by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                    {filteredTeachers.map(teacher => {
                        const id = teacher._id || teacher.id;
                        return (
                            <div
                                key={id}
                                onClick={() => setSelectedTeacherId(id)}
                                className={`
                                    flex items-center justify-between p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors
                                    ${selectedTeacherId === id ? 'bg-indigo-50' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedTeacherId === id ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {teacher.name?.charAt(0) || 'T'}
                                    </div>
                                    <div>
                                        <h4 className={`font-medium text-sm ${selectedTeacherId === id ? 'text-indigo-900' : 'text-gray-900'}`}>{teacher.name || 'Unknown Teacher'}</h4>
                                        <p className="text-xs text-gray-500">{teacher.department || teacher.designation || 'Faculty'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded bg-gray-100 font-mono ${teacher.load > 20 ? 'text-red-600 bg-red-50' : 'text-gray-600'}`}>
                                        {teacher.load || 0} hrs/wk
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {filteredTeachers.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No teachers found matching "{searchTerm}"
                        </div>
                    )}
                </div>

                <div className="p-4 flex justify-end gap-3 border-t border-gray-100 bg-white">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button
                        disabled={!selectedTeacherId}
                        onClick={handleAssign}
                        className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Assignment
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AssignTeacherModal;
