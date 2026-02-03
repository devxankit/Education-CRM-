
import React, { useState } from 'react';
import { Filter, Save, HelpCircle } from 'lucide-react';

import MappingTable from './components/mapping/MappingTable';
import AssignTeacherModal from './components/mapping/AssignTeacherModal';

const TeacherMapping = () => {

    // Mock Selections
    const [selectedLevel, setSelectedLevel] = useState('Secondary');
    const [selectedClassId, setSelectedClassId] = useState('10');
    const [selectedSectionId, setSelectedSectionId] = useState('A');

    // Mock Data for View
    const [mappings, setMappings] = useState([
        { subjectId: 1, subjectName: 'Mathematics', subjectCode: 'SUB_MATH_001', type: 'theory', teacherId: 1, teacherName: 'Sarah Jen' },
        { subjectId: 2, subjectName: 'Physics', subjectCode: 'SUB_PHY_001', type: 'theory_practical', teacherId: 2, teacherName: 'Vikram Singh' },
        { subjectId: 3, subjectName: 'English Literature', subjectCode: 'SUB_ENG_001', type: 'theory', teacherId: null, teacherName: null },
        { subjectId: 4, subjectName: 'Computer Science', subjectCode: 'SUB_CS_001', type: 'practical', teacherId: null, teacherName: null },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSubject, setActiveSubject] = useState(null);

    // Handlers
    const handleAssignClick = (row) => {
        setActiveSubject(row);
        setIsModalOpen(true);
    };

    const handleAssignConfirm = (teacher) => {
        if (!activeSubject) return;

        setMappings(prev => prev.map(m =>
            m.subjectId === activeSubject.subjectId
                ? { ...m, teacherId: teacher.id, teacherName: teacher.name }
                : m
        ));
    };

    const handleRemove = (row) => {
        if (window.confirm(`Remove ${row.teacherName} from ${row.subjectName}?`)) {
            setMappings(prev => prev.map(m =>
                m.subjectId === row.subjectId
                    ? { ...m, teacherId: null, teacherName: null }
                    : m
            ));
        }
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Teacher Allocation</h1>
                    <p className="text-gray-500 text-sm">Map faculty to subjects for specific classes/sections.</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <HelpCircle size={16} /> Help
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Context Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Academic Level</label>
                    <select
                        value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[150px] outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="Primary">Primary</option>
                        <option value="Secondary">Secondary</option>
                        <option value="Senior Secondary">Senior Secondary</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Class</label>
                    <select
                        value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[120px] outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Section</label>
                    <select
                        value={selectedSectionId} onChange={(e) => setSelectedSectionId(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[100px] outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                    </select>
                </div>

                <div className="ml-auto flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-700">Year 2025-26</span> (Active)
                </div>

            </div>

            {/* Grid */}
            <div className="flex-1">
                <MappingTable
                    mappings={mappings}
                    onAssignClick={handleAssignClick}
                    onRemove={handleRemove}
                />
            </div>

            {/* Modal */}
            <AssignTeacherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAssign={handleAssignConfirm}
                subjectName={activeSubject?.subjectName}
                className={`Class ${selectedClassId} - ${selectedSectionId}`}
            />

        </div>
    );
};

export default TeacherMapping;
