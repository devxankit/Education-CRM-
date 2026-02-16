import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Save, HelpCircle, AlertCircle, MapPin, GraduationCap, School } from 'lucide-react';
import { useAdminStore, selectAcademicYearsForSelect } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import MappingTable from './components/mapping/MappingTable';
import AssignTeacherModal from './components/mapping/AssignTeacherModal';

const TeacherMapping = () => {
    const academicYears = useAdminStore(selectAcademicYearsForSelect);
    const {
        classes, fetchClasses,
        courses, fetchCourses,
        sections, fetchSections,
        teachers, fetchTeachers,
        fetchAcademicYears,
        teacherMappings, fetchTeacherMappings,
        assignTeacherMapping, removeTeacherMapping,
        branches, fetchBranches
    } = useAdminStore();

    const user = useAppStore(state => state.user);

    // Selections
    const [mappingMode, setMappingMode] = useState('school'); // 'school' or 'college'
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [selectedYearId, setSelectedYearId] = useState('');
    const [selectedBranchId, setSelectedBranchId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSubject, setActiveSubject] = useState(null);

    // Initial Fetch
    useEffect(() => {
        fetchBranches();
        fetchTeachers();
    }, [fetchBranches, fetchTeachers]);

    // Set selected branch initially
    useEffect(() => {
        if (!selectedBranchId && branches.length > 0) {
            setSelectedBranchId(user?.branchId && user.branchId !== 'all' && user.branchId.length === 24 ? user.branchId : branches[0]._id);
        }
    }, [user?.branchId, branches]);

    // Fetch academic years when branch changes
    useEffect(() => {
        if (selectedBranchId && selectedBranchId.length === 24) {
            fetchAcademicYears(selectedBranchId);
        }
    }, [selectedBranchId, fetchAcademicYears]);

    // Reset year/class/course/section when branch changes
    useEffect(() => {
        setSelectedYearId('');
        setSelectedClassId('');
        setSelectedCourseId('');
        setSelectedSectionId('');
    }, [selectedBranchId]);

    // Set default active year when academic years load
    useEffect(() => {
        if (academicYears.length > 0 && selectedBranchId && !selectedYearId) {
            const active = academicYears.find(y => y.status === 'active');
            setSelectedYearId(active?._id || academicYears[0]._id);
        }
    }, [academicYears, selectedBranchId, selectedYearId]);

    // Fetch classes and courses when branch + academic year are selected
    useEffect(() => {
        if (selectedBranchId && selectedYearId && selectedYearId.length === 24) {
            fetchClasses(selectedBranchId, false, selectedYearId);
            fetchCourses(selectedBranchId, selectedYearId);
        }
    }, [selectedBranchId, selectedYearId, fetchClasses, fetchCourses]);

    // Fetch Sections when Class changes
    useEffect(() => {
        if (selectedClassId && mappingMode === 'school') {
            fetchSections(selectedClassId);
            setSelectedSectionId(''); // Reset section
        }
    }, [selectedClassId, mappingMode, fetchSections]);

    // Reset selections when mode changes
    useEffect(() => {
        if (mappingMode === 'school') {
            setSelectedCourseId('');
            setSelectedClassId('');
            setSelectedSectionId('');
        } else {
            setSelectedClassId('');
            setSelectedSectionId('');
        }
    }, [mappingMode]);

    // Auto-select first section (only for school mode)
    const currentSections = mappingMode === 'school' ? (sections[selectedClassId] || []) : [];
    useEffect(() => {
        if (mappingMode === 'school' && currentSections.length > 0 && !selectedSectionId) {
            setSelectedSectionId(currentSections[0]._id);
        }
    }, [currentSections, selectedSectionId, mappingMode]);

    // Fetch Mappings when context changes
    const loadMappings = useCallback(() => {
        if (selectedYearId) {
            // For school: require sectionId, for college: require courseId (no sectionId)
            if (mappingMode === 'school' && selectedSectionId) {
                fetchTeacherMappings({
                    academicYearId: selectedYearId,
                    sectionId: selectedSectionId,
                    classId: selectedClassId,
                    courseId: null
                });
            } else if (mappingMode === 'college' && selectedCourseId) {
                fetchTeacherMappings({
                    academicYearId: selectedYearId,
                    sectionId: null,
                    classId: null,
                    courseId: selectedCourseId
                });
            }
        }
    }, [selectedYearId, selectedSectionId, selectedClassId, selectedCourseId, mappingMode, fetchTeacherMappings]);

    useEffect(() => {
        loadMappings();
    }, [loadMappings]);

    // Handlers
    const handleAssignClick = (row) => {
        setActiveSubject(row);
        setIsModalOpen(true);
    };

    const handleAssignConfirm = async (teacher) => {
        if (!activeSubject || !selectedYearId) return;
        
        // For school: require sectionId, for college: require courseId
        if (mappingMode === 'school' && !selectedSectionId) return;
        if (mappingMode === 'college' && !selectedCourseId) return;

        const targetBranchId = user?.branchId?.length === 24 ? user.branchId : selectedBranchId;

        if (!targetBranchId) {
            alert("Error: No Branch found. Please create a branch first.");
            return;
        }

        const success = await assignTeacherMapping({
            academicYearId: selectedYearId,
            branchId: targetBranchId,
            classId: mappingMode === 'school' ? selectedClassId : null,
            courseId: mappingMode === 'college' ? selectedCourseId : null,
            sectionId: mappingMode === 'school' ? selectedSectionId : null,
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
                sectionId: mappingMode === 'school' ? selectedSectionId : null,
                courseId: mappingMode === 'college' ? selectedCourseId : null,
                subjectId: row.subjectId
            });
            if (success) loadMappings();
        }
    };

    const activeYear = academicYears.find(y => y._id === selectedYearId);
    const selectedClass = classes.find(c => c._id === selectedClassId);
    const selectedCourse = courses.find(c => c._id === selectedCourseId);

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Teacher Allocation</h1>
                    <p className="text-gray-500 text-sm">Map faculty to subjects for specific classes/sections or courses/programs.</p>
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
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                {/* Mode Toggle */}
                <div className="mb-4 flex items-center gap-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode:</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setMappingMode('school')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                mappingMode === 'school'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <School size={16} />
                            School (Class)
                        </button>
                        <button
                            type="button"
                            onClick={() => setMappingMode('college')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                mappingMode === 'college'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <GraduationCap size={16} />
                            College (Course)
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-end">
                    {/* Branch - First */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <MapPin size={12} />
                            Branch
                        </label>
                        <select
                            value={selectedBranchId || ''}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            disabled={user?.branchId && user.branchId !== 'all'}
                            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[150px] outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Academic Year - filtered by branch */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Academic Year</label>
                        <select
                            value={selectedYearId}
                            onChange={(e) => setSelectedYearId(e.target.value)}
                            disabled={!selectedBranchId}
                            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[150px] outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <option value="">{selectedBranchId ? 'Select Academic Year' : 'Select Branch first'}</option>
                            {academicYears.map(year => (
                                <option key={year._id} value={year._id}>{year.name} {year.status === 'active' ? '(Active)' : ''}</option>
                            ))}
                        </select>
                        {selectedBranchId && <p className="text-[10px] text-gray-400 mt-0.5">For selected branch</p>}
                    </div>

                    {/* School Mode: Class & Section */}
                    {mappingMode === 'school' && (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <School size={12} />
                                    Class
                                </label>
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    disabled={!selectedYearId}
                                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[150px] outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option value="">{selectedYearId ? '-- Select Class --' : 'Select Academic Year first'}</option>
                                    {classes.map(cls => (
                                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Section</label>
                                <select
                                    value={selectedSectionId}
                                    onChange={(e) => setSelectedSectionId(e.target.value)}
                                    disabled={!selectedClassId}
                                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[100px] outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option value="">{selectedClassId ? '-- Select Section --' : 'Select Class first'}</option>
                                    {currentSections.map(sec => (
                                        <option key={sec._id} value={sec._id}>{sec.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* College Mode: Course Selection */}
                    {mappingMode === 'college' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <GraduationCap size={12} />
                                Course/Program
                            </label>
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                disabled={!selectedYearId}
                                className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[200px] outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <option value="">{selectedYearId ? '-- Select Course --' : 'Select Academic Year first'}</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.name} ({course.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {activeYear && (
                        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                            <span className="font-bold text-blue-700">Year {activeYear.name}</span> ({activeYear.status === 'active' ? 'Active' : 'Closed'})
                        </div>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1">
                {(mappingMode === 'school' && selectedSectionId) || (mappingMode === 'college' && selectedCourseId) ? (
                    <MappingTable
                        mappings={teacherMappings}
                        onAssignClick={handleAssignClick}
                        onRemove={handleRemove}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                        <AlertCircle className="text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500">
                            {mappingMode === 'school' 
                                ? 'Select a Class and Section to manage teacher allocations.'
                                : 'Select a Course to manage teacher allocations.'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AssignTeacherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAssign={handleAssignConfirm}
                subjectName={activeSubject?.subjectName}
                subjectId={activeSubject?.subjectId}
                teachersList={teachers}
                className={mappingMode === 'school' 
                    ? `${selectedClass?.name || ''} - ${currentSections.find(s => s._id === selectedSectionId)?.name || ''}`
                    : `${selectedCourse?.name || ''}`
                }
            />

        </div>
    );
};

export default TeacherMapping;
