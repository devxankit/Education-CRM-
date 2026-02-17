import React, { useState, useEffect } from 'react';
import { MapPin, GraduationCap, Users, Loader2, UserCheck, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useAdminStore, selectAcademicYearsForSelect } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

const ClassTeacherAssignment = () => {
    const academicYears = useAdminStore(selectAcademicYearsForSelect);
    const {
        branches,
        teachers,
        fetchBranches,
        fetchTeachers,
        fetchAcademicYears,
        fetchSectionsForClassTeacher,
        updateSection,
        updateCourse,
    } = useAdminStore();
    const user = useAppStore(state => state.user);

    const [viewMode, setViewMode] = useState('classes'); // 'classes' | 'course'
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [selectedYearId, setSelectedYearId] = useState('');
    const [sectionsData, setSectionsData] = useState({ classes: [], sections: [], courses: [] });
    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursePage, setCoursePage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        setCurrentPage(1);
        setCoursePage(1);
    }, [selectedBranchId, selectedYearId]);

    useEffect(() => {
        fetchBranches();
        fetchTeachers();
    }, [fetchBranches, fetchTeachers]);

    useEffect(() => {
        if (!selectedBranchId && branches.length > 0) {
            setSelectedBranchId(
                user?.branchId && user.branchId !== 'all' && user.branchId.length === 24
                    ? user.branchId
                    : branches[0]._id
            );
        }
    }, [branches, user?.branchId, selectedBranchId]);

    useEffect(() => {
        if (selectedBranchId && selectedBranchId.length === 24) {
            fetchAcademicYears(selectedBranchId);
            setSelectedYearId('');
        }
    }, [selectedBranchId, fetchAcademicYears]);

    useEffect(() => {
        if (academicYears.length > 0 && selectedBranchId && !selectedYearId) {
            const active = academicYears.find((y) => y.status === 'active');
            setSelectedYearId(active?._id || academicYears[0]._id);
        }
    }, [academicYears, selectedBranchId, selectedYearId]);

    useEffect(() => {
        const load = async () => {
            if (!selectedBranchId || !selectedYearId || selectedYearId.length !== 24) {
                setSectionsData({ classes: [], sections: [], courses: [] });
                return;
            }
            setLoading(true);
            try {
                const data = await fetchSectionsForClassTeacher(selectedBranchId, selectedYearId);
                setSectionsData(data || { classes: [], sections: [], courses: [] });
            } catch (err) {
                setSectionsData({ classes: [], sections: [], courses: [] });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedBranchId, selectedYearId, fetchSectionsForClassTeacher]);

    const getTeacherName = (teacher) => {
        if (!teacher) return null;
        if (typeof teacher === 'string') return teacher;
        return [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || teacher.employeeId || '—';
    };

    const handleTeacherChange = async (section, teacherId) => {
        const sectionId = section._id;
        const classId = section.classId?._id || section.classId;
        if (!classId) return;
        setSavingId(sectionId);
        try {
            const updated = await updateSection(sectionId, classId, { teacherId: teacherId || null });
            setSectionsData((prev) => ({
                ...prev,
                sections: prev.sections.map((s) =>
                    s._id === sectionId ? { ...s, teacherId: updated?.teacherId || (teacherId ? teachers.find((t) => t._id === teacherId) : null) } : s
                ),
            }));
        } catch (err) {
            // Toast handled by store
        } finally {
            setSavingId(null);
        }
    };

    const handleCourseTeacherChange = async (course, teacherId) => {
        const courseId = course._id;
        setSavingId(`course-${courseId}`);
        try {
            const updated = await updateCourse(courseId, { teacherId: teacherId || null });
            setSectionsData((prev) => ({
                ...prev,
                courses: prev.courses?.map((c) =>
                    c._id === courseId ? { ...c, teacherId: updated?.teacherId || (teacherId ? teachers.find((t) => t._id === teacherId) : null) } : c
                ) || [],
            }));
        } catch (err) {
            // Toast handled by store
        } finally {
            setSavingId(null);
        }
    };

    const { sections, courses } = sectionsData;
    const activeYear = academicYears.find((y) => y._id === selectedYearId);
    const totalPages = Math.ceil((sections?.length || 0) / rowsPerPage) || 1;
    const paginatedSections = sections?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) || [];
    const courseTotalPages = Math.ceil((courses?.length || 0) / rowsPerPage) || 1;
    const paginatedCourses = courses?.slice((coursePage - 1) * rowsPerPage, coursePage * rowsPerPage) || [];

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
                        <UserCheck className="text-indigo-600" /> Class Teacher Assignment
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Assign class teacher (in-charge) for sections and course in-charge for programs/courses.
                    </p>
                </div>
            </div>

            {/* View Toggle: Classes / Course */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setViewMode('classes')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                        viewMode === 'classes'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <Users size={18} /> Classes
                </button>
                <button
                    onClick={() => setViewMode('course')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                        viewMode === 'course'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <BookOpen size={18} /> Course
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-wrap gap-6 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            <MapPin size={12} className="inline mr-1" /> Branch
                        </label>
                        <select
                            value={selectedBranchId || ''}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            disabled={user?.branchId && user.branchId !== 'all'}
                            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[180px] outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.name} ({b.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            <GraduationCap size={12} className="inline mr-1" /> Academic Year
                        </label>
                        <select
                            value={selectedYearId}
                            onChange={(e) => setSelectedYearId(e.target.value)}
                            disabled={!selectedBranchId}
                            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm min-w-[180px] outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                        >
                            <option value="">{selectedBranchId ? 'Select Academic Year' : 'Select Branch first'}</option>
                            {academicYears.map((year) => (
                                <option key={year._id} value={year._id}>
                                    {year.name} {year.status === 'active' ? '(Active)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    {activeYear && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                            <GraduationCap size={16} className="text-indigo-600" />
                            <span className="font-bold text-indigo-700">{activeYear.name}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-[420px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="animate-spin text-indigo-500 mb-3" size={40} />
                        <p className="text-gray-500 text-sm">Loading sections...</p>
                    </div>
                ) : (sections?.length === 0 && courses?.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <UserCheck className="text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500">
                            {selectedBranchId && selectedYearId
                                ? 'No classes/sections or courses found. Add classes, sections, or programs first.'
                                : 'Select Branch and Academic Year to view assignments.'}
                        </p>
                    </div>
                ) : (
                    <>
                    {/* Class Sections Table - visible when Classes button selected */}
                    {viewMode === 'classes' && sections?.length > 0 && (
                    <div className="border-b border-gray-200">
                        <h3 className="px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50 flex items-center gap-2">
                            <Users size={16} /> Class Sections
                        </h3>
                        <div className="flex-1 min-h-[200px] overflow-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase">Class</th>
                                    <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase">Section</th>
                                    <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase">
                                        <Users size={14} className="inline mr-1" /> Students
                                    </th>
                                    <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase">Class Teacher (In-charge)</th>
                                    <th className="w-24 px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedSections.map((section) => {
                                    const classObj = section.classId;
                                    const className = classObj?.name || '—';
                                    const currentTeacherId = section.teacherId?._id || section.teacherId;
                                    const isSaving = savingId === section._id;
                                    return (
                                        <tr key={section._id} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{className}</td>
                                            <td className="px-4 py-3 text-gray-700">{section.name}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {section.studentCount ?? 0} / {section.capacity ?? 40}
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={currentTeacherId || ''}
                                                    onChange={(e) => handleTeacherChange(section, e.target.value || null)}
                                                    disabled={isSaving}
                                                    className="w-full max-w-[220px] px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                                                >
                                                    <option value="">— No class teacher —</option>
                                                    {teachers.map((t) => (
                                                            <option key={t._id} value={t._id}>
                                                                {t.name || getTeacherName(t)} {t.employeeId ? `(${t.employeeId})` : ''}
                                                            </option>
                                                        ))}
                                                    {teachers.length === 0 && (
                                                        <option value="" disabled>
                                                            No teachers available
                                                        </option>
                                                    )}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                {isSaving && (
                                                    <Loader2 size={16} className="animate-spin text-indigo-500 inline" />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        </div>
                        {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <span className="text-xs text-gray-500">
                            Showing {sections.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, sections.length)} of {sections.length} • {rowsPerPage} per page
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                    </div>
                    )}

                    {/* Courses / Programs Table - visible when Course button selected */}
                    {viewMode === 'classes' && !sections?.length && (
                        <div className="px-4 py-12 text-center text-gray-500 text-sm">
                            <Users className="mx-auto mb-2 text-gray-300" size={36} />
                            <p>No class sections found. Add classes and sections from <strong>Academic Management → Classes</strong>.</p>
                        </div>
                    )}
                    {viewMode === 'course' && (
                    <div className="border-t-0 border-gray-200">
                        <h3 className="px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50 flex items-center gap-2">
                            <BookOpen size={16} /> Courses / Programs — Course In-charge
                        </h3>
                        {!courses?.length ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                <BookOpen className="mx-auto mb-2 text-gray-300" size={32} />
                                <p>No courses or programs found. Add programs from <strong>Academic Management → Programs / Courses</strong> to assign course in-charge.</p>
                            </div>
                        ) : (
                        <>
                        <div className="min-h-[180px] overflow-auto">
                        <table className="w-full text-sm min-w-[500px]">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase">Course</th>
                                    <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase">Code</th>
                                    <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase">Course In-charge</th>
                                    <th className="w-24 px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedCourses.map((course) => {
                                    const currentTeacherId = course.teacherId?._id || course.teacherId;
                                    const isSaving = savingId === `course-${course._id}`;
                                    return (
                                        <tr key={course._id} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{course.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{course.code}</td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={currentTeacherId || ''}
                                                    onChange={(e) => handleCourseTeacherChange(course, e.target.value || null)}
                                                    disabled={!!isSaving}
                                                    className="w-full max-w-[220px] px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                                                >
                                                    <option value="">— No in-charge —</option>
                                                    {teachers.map((t) => (
                                                        <option key={t._id} value={t._id}>
                                                            {t.name || getTeacherName(t)} {t.employeeId ? `(${t.employeeId})` : ''}
                                                        </option>
                                                    ))}
                                                    {teachers.length === 0 && (
                                                        <option value="" disabled>No teachers available</option>
                                                    )}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                {isSaving && (
                                                    <Loader2 size={16} className="animate-spin text-indigo-500 inline" />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        </div>
                        {courses.length > rowsPerPage && (
                        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
                            <span className="text-xs text-gray-500">
                                Showing {(coursePage - 1) * rowsPerPage + 1}–{Math.min(coursePage * rowsPerPage, courses.length)} of {courses.length}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCoursePage((p) => Math.max(1, p - 1))}
                                    disabled={coursePage <= 1}
                                    className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-xs font-medium">Page {coursePage} of {courseTotalPages}</span>
                                <button
                                    onClick={() => setCoursePage((p) => Math.min(courseTotalPages, p + 1))}
                                    disabled={coursePage >= courseTotalPages}
                                    className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                        )}
                        </>
                        )}
                    </div>
                    )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClassTeacherAssignment;
