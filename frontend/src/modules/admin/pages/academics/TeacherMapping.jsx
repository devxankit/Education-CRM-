import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Save, HelpCircle, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import MappingTable from './components/mapping/MappingTable';
import AssignTeacherModal from './components/mapping/AssignTeacherModal';

const TeacherMapping = () => {
    const {
        classes, fetchClasses,
        sections, fetchSections,
        teachers, fetchTeachers,
        academicYears, fetchAcademicYears,
        teacherMappings, fetchTeacherMappings,
        assignTeacherMapping, removeTeacherMapping
    } = useAdminStore();

    const user = useAppStore(state => state.user);

    // Selections
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [selectedYearId, setSelectedYearId] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSubject, setActiveSubject] = useState(null);

    // Initial Fetch
    useEffect(() => {
        const branchId = user?.branchId || 'main';
        fetchClasses(branchId);
        fetchAcademicYears();
        fetchTeachers();
    }, [user, fetchClasses, fetchAcademicYears, fetchTeachers]);

    // Set Active Year initially
    useEffect(() => {
        if (academicYears.length > 0 && !selectedYearId) {
            const active = academicYears.find(y => y.status === 'active');
            if (active) setSelectedYearId(active._id);
            else setSelectedYearId(academicYears[0]._id);
        }
    }, [academicYears, selectedYearId]);

    // Fetch Sections when Class changes
    useEffect(() => {
        if (selectedClassId) {
            fetchSections(selectedClassId);
            setSelectedSectionId(''); // Reset section
        }
    }, [selectedClassId, fetchSections]);

    // Auto-select first section
    const currentSections = sections[selectedClassId] || [];
    useEffect(() => {
        if (currentSections.length > 0 && !selectedSectionId) {
            setSelectedSectionId(currentSections[0]._id);
        }
    }, [currentSections, selectedSectionId]);

    // Fetch Mappings when context changes
    const loadMappings = useCallback(() => {
        if (selectedYearId && selectedSectionId) {
            fetchTeacherMappings({
                academicYearId: selectedYearId,
                sectionId: selectedSectionId,
                classId: selectedClassId
            });
        }
    }, [selectedYearId, selectedSectionId, selectedClassId, fetchTeacherMappings]);

    useEffect(() => {
        loadMappings();
    }, [loadMappings]);

    // Handlers
    const handleAssignClick = (row) => {
        setActiveSubject(row);
        setIsModalOpen(true);
    };

    const handleAssignConfirm = async (teacher) => {
        if (!activeSubject || !selectedYearId || !selectedSectionId) return;

        const success = await assignTeacherMapping({
            academicYearId: selectedYearId,
            branchId: user?.branchId || 'main',
            classId: selectedClassId,
            sectionId: selectedSectionId,
            subjectId: activeSubject.subjectId,
            teacherId: teacher.id || teacher._id
        });

        if (success) {
            loadMappings();
            setIsModalOpen(false);
        }
    };

    const handleRemove = async (row) => {
        if (!row.teacherId) return;

        if (window.confirm(`Remove ${row.teacherName} from ${row.subjectName}?`)) {
            const success = await removeTeacherMapping({
                academicYearId: selectedYearId,
                sectionId: selectedSectionId,
                subjectId: row.subjectId
            });
            if (success) loadMappings();
        }
    };

    const activeYear = academicYears.find(y => y._id === selectedYearId);
    const selectedClass = classes.find(c => c._id === selectedClassId);

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
                    {/* Save Changes button not strictly needed as each assignment is saved individually in this implementation, 
                        but we can keep it for UX consistency or global validation if needed */}
                </div>
            </div>

            {/* Context Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Academic Year</label>
                    <select
                        value={selectedYearId} onChange={(e) => setSelectedYearId(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[150px] outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {academicYears.map(year => (
                            <option key={year._id} value={year._id}>{year.name} {year.status === 'active' ? '(Active)' : ''}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Class</label>
                    <select
                        value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[150px] outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">-- Select Class --</option>
                        {classes.map(cls => (
                            <option key={cls._id} value={cls._id}>{cls.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Section</label>
                    <select
                        value={selectedSectionId} onChange={(e) => setSelectedSectionId(e.target.value)}
                        disabled={!selectedClassId}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[100px] outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <option value="">-- Select Section --</option>
                        {currentSections.map(sec => (
                            <option key={sec._id} value={sec._id}>{sec.name}</option>
                        ))}
                    </select>
                </div>

                {activeYear && (
                    <div className="ml-auto flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                        <span className="font-bold text-blue-700">Year {activeYear.name}</span> ({activeYear.status === 'active' ? 'Active' : 'Closed'})
                    </div>
                )}

            </div>

            {/* Grid */}
            <div className="flex-1">
                {selectedSectionId ? (
                    <MappingTable
                        mappings={teacherMappings}
                        onAssignClick={handleAssignClick}
                        onRemove={handleRemove}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                        <AlertCircle className="text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500">Select a Class and Section to manage teacher allocations.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AssignTeacherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAssign={handleAssignConfirm}
                subjectName={activeSubject?.subjectName}
                teachersList={teachers}
                className={`${selectedClass?.name || ''} - ${currentSections.find(s => s._id === selectedSectionId)?.name || ''}`}
            />

        </div>
    );
};

export default TeacherMapping;
