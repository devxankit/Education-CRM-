import React from 'react';
import SubjectAttendanceRow from './SubjectAttendanceRow';

const SubjectAttendanceList = ({ subjects }) => {
    // Sort: Lowest attendance first (High Risk first)
    // Create a copy to avoid mutating props directly if they are frozen
    const sortedSubjects = [...subjects].sort((a, b) => a.percentage - b.percentage);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Subject Breakdown</h3>
                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    {subjects.length} Subjects
                </span>
            </div>

            <div>
                {sortedSubjects.map((subject, index) => (
                    <SubjectAttendanceRow
                        key={subject.id}
                        subject={subject}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubjectAttendanceList;
