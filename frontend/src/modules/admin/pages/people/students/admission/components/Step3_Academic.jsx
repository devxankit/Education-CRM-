import React, { useEffect, useRef } from 'react';
import { GraduationCap, School, Calendar, MapPin, BookOpen } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';
import { useAppStore } from '../../../../../../../store';

const Step3_Academic = ({ data, onChange, branchId: propBranchId, academicYearId, onBranchChange, onAcademicYearChange }) => {
    const user = useAppStore(state => state.user);
    const branches = useAdminStore(state => state.branches);
    const academicYears = useAdminStore(state => state.academicYears) || [];
    const classes = useAdminStore(state => state.classes);
    const courses = useAdminStore(state => state.courses);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const fetchCourses = useAdminStore(state => state.fetchCourses);
    const sectionsObj = useAdminStore(state => state.sections);
    const fetchSections = useAdminStore(state => state.fetchSections);

    const selectedBranchId = propBranchId || data.branchId;
    const selectedClassId = data.classId;
    const currentSections = sectionsObj[selectedClassId] || [];

    const handleBranchChange = (newBranchId) => {
        onBranchChange?.(newBranchId);
        onChange({ ...data, branchId: newBranchId, classId: '', sectionId: '', courseId: '' });
    };

    const handleAcademicYearChange = (newAyId) => {
        onAcademicYearChange?.(newAyId);
        onChange({ ...data, classId: '', sectionId: '', courseId: '' });
    };

    useEffect(() => {
        if (selectedBranchId && academicYearId) {
            fetchClasses(selectedBranchId, false, academicYearId);
        }
    }, [selectedBranchId, academicYearId, fetchClasses]);

    useEffect(() => {
        if (selectedClassId && selectedClassId.length === 24) {
            fetchSections(selectedClassId);
        }
    }, [selectedClassId, fetchSections]);

    useEffect(() => {
        if (selectedBranchId && academicYearId) {
            fetchCourses(selectedBranchId, academicYearId);
        }
    }, [selectedBranchId, academicYearId, fetchCourses]);

    const prevBranchYear = useRef({ branchId: propBranchId, academicYearId });
    useEffect(() => {
        const changed = prevBranchYear.current.branchId !== propBranchId || prevBranchYear.current.academicYearId !== academicYearId;
        if (changed && (data.classId || data.sectionId || data.courseId)) {
            prevBranchYear.current = { branchId: propBranchId, academicYearId };
            onChange({ ...data, classId: '', sectionId: '', courseId: '' });
        } else if (changed) {
            prevBranchYear.current = { branchId: propBranchId, academicYearId };
        }
    }, [propBranchId, academicYearId, data, onChange]);

    const handleChange = (field, value) => {
        if (field === 'courseId') {
            // If course is selected, clear class and section
            onChange({ ...data, courseId: value, classId: '', sectionId: '' });
        } else {
            onChange({ ...data, [field]: value });
        }
    };

    const handleClassChange = (classId) => {
        // If class is selected, clear course
        onChange({ ...data, classId, sectionId: '', courseId: '' }); // Reset section and course when class changes
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header omitted for brevity in targetContent but I'll keep it in ReplacementContent */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <GraduationCap className="text-indigo-600" /> Academic Enrollment
                </h3>
                <p className="text-sm text-gray-500">Assign class, section, and record admission details.</p>
            </div>

            {/* Campus & Academic Year */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" /> Campus & Academic Year <span className="text-red-500">*</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Branch / Campus</label>
                        <select
                            value={selectedBranchId || ''}
                            onChange={(e) => handleBranchChange(e.target.value)}
                            disabled={user?.role === 'Staff' && user?.branchId && user?.branchId !== 'all'}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((b) => (
                                <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Academic Year</label>
                        <select
                            value={academicYearId || ''}
                            onChange={(e) => handleAcademicYearChange(e.target.value)}
                            disabled={!selectedBranchId}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">{selectedBranchId ? 'Select Academic Year' : 'Select Branch First'}</option>
                            {academicYears.map(ay => (
                                <option key={ay._id} value={ay._id}>{ay.name} {ay.status === 'active' ? '(Active)' : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Admission Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Number</label>
                    <input
                        type="text"
                        value={data.admissionNo || 'ADM-2026-XXXX'}
                        readOnly
                        className="w-full text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-3 py-2 outline-none font-mono cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Auto-generated by system sequence.</p>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        value={data.admissionDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleChange('admissionDate', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Class Assignment */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <School size={16} className="text-gray-400" /> Class Assignment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class <span className="text-red-500">*</span></label>
                        <select
                            value={data.classId || ''}
                            onChange={(e) => handleClassChange(e.target.value)}
                            disabled={!selectedBranchId || !academicYearId || !!data.courseId}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">{selectedBranchId && academicYearId ? (data.courseId ? 'Cannot select - Course selected' : 'Select Class') : 'Select Branch & Academic Year First'}</option>
                            {classes && classes.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section</label>
                        <select
                            value={data.sectionId || ''}
                            onChange={(e) => handleChange('sectionId', e.target.value)}
                            disabled={!data.classId || !!data.courseId}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">{data.classId ? (data.courseId ? 'Cannot select - Course selected' : 'Select Section') : 'Select Class First'}</option>
                            {currentSections.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <BookOpen size={12} /> Course / Program
                        </label>
                        <select
                            value={data.courseId || ''}
                            onChange={(e) => handleChange('courseId', e.target.value)}
                            disabled={!selectedBranchId || !academicYearId || !!data.classId}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">{selectedBranchId && academicYearId ? (data.classId ? 'Cannot select - Class selected' : 'Select Course (optional)') : 'Select Branch & Academic Year First'}</option>
                            {(courses || []).map(c => (
                                <option key={c._id} value={c._id}>{c.name} {c.code ? `(${c.code})` : ''}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1">Optional: For program/course-based enrollment. Cannot select if Class is selected.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Roll Number</label>
                        <input
                            type="text"
                            value={data.rollNo || ''}
                            onChange={(e) => handleChange('rollNo', e.target.value)}
                            placeholder="Auto or Manual"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Previous School */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" /> Previous History
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Previous School Name</label>
                        <input
                            type="text"
                            value={data.prevSchool || ''}
                            onChange={(e) => handleChange('prevSchool', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Class Passed</label>
                        <input
                            type="text"
                            value={data.lastClass || ''}
                            onChange={(e) => handleChange('lastClass', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Step3_Academic;
