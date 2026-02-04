import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Info, Calendar as CalendarIcon, Users, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useTeacherStore } from '../../../store/teacherStore';

// Components
import ClassSubjectSelector from '../components/attendance/ClassSubjectSelector';
import AttendanceRow from '../components/attendance/AttendanceRow';
import AttendanceSummaryBar from '../components/attendance/AttendanceSummaryBar';

const AttendancePage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const listRef = useRef(null);

    // Store
    const assignedClasses = useTeacherStore(state => state.assignedClasses);
    const fetchAssignedClasses = useTeacherStore(state => state.fetchAssignedClasses);
    const students = useTeacherStore(state => state.classStudents);
    const fetchClassStudents = useTeacherStore(state => state.fetchClassStudents);
    const isFetchingClasses = useTeacherStore(state => state.isFetchingClasses);
    const isFetchingStudents = useTeacherStore(state => state.isFetchingStudents);
    const submitAttendanceAction = useTeacherStore(state => state.submitAttendance);

    const [selectedMapping, setSelectedMapping] = useState(null);
    const [attendanceState, setAttendanceState] = useState({});

    // Fetch Classes on Mount
    useEffect(() => {
        fetchAssignedClasses();
    }, [fetchAssignedClasses]);

    // Flatten mappings for the selector
    const flatMappings = assignedClasses.flatMap(sub =>
        sub.classes.map(cls => ({
            id: `${sub.subjectId}_${cls.classId}_${cls.sectionId}`,
            subjectId: sub.subjectId,
            subjectName: sub.subjectName,
            classId: cls.classId,
            sectionId: cls.sectionId,
            className: cls.fullClassName,
        }))
    );

    // Default to first mapping if none selected
    useEffect(() => {
        if (flatMappings.length > 0 && !selectedMapping) {
            setSelectedMapping(flatMappings[0]);
        }
    }, [flatMappings, selectedMapping]);

    // Fetch Students when mapping changes
    useEffect(() => {
        if (selectedMapping) {
            fetchClassStudents(selectedMapping.classId, selectedMapping.sectionId);
        }
    }, [selectedMapping, fetchClassStudents]);

    // Initialize/Update Attendance State when students change
    useEffect(() => {
        if (students.length > 0) {
            const initialMap = {};
            students.forEach(s => {
                initialMap[s._id] = 'Present';
            });
            setAttendanceState(initialMap);
        } else {
            setAttendanceState({});
        }
    }, [students]);

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // Stagger Animation
    useEffect(() => {
        if (listRef.current && students.length > 0) {
            gsap.fromTo(listRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
            );
        }
    }, [students]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceState(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = () => {
        if (Object.keys(attendanceState).length === 0) {
            alert("No students to mark attendance for.");
            return;
        }

        const confirm = window.confirm("Are you sure you want to submit attendance? This action will be logged.");
        if (confirm) {
            const record = {
                id: `ATT-${Date.now()}`,
                mappingId: selectedMapping?.id,
                classId: selectedMapping?.classId,
                sectionId: selectedMapping?.sectionId,
                subjectId: selectedMapping?.subjectId,
                className: selectedMapping?.className,
                subject: selectedMapping?.subjectName,
                date: new Date().toISOString(),
                attendance: attendanceState,
                stats
            };

            submitAttendanceAction(record);
            alert("Attendance Submitted Successfully!");
            navigate('/teacher/dashboard');
        }
    };

    // Calculate Stats
    const stats = Object.values(attendanceState).reduce((acc, status) => {
        if (status === 'Present') acc.present++;
        if (status === 'Absent') acc.absent++;
        if (status === 'Leave') acc.leave++;
        return acc;
    }, { present: 0, absent: 0, leave: 0 });

    const formattedClassesForSelector = flatMappings.map(m => ({
        id: m.id,
        name: m.className,
        subject: m.subjectName
    }));

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Attendance</h1>
                    </div>
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Info size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-6">
                {/* 1. Controls */}
                <ClassSubjectSelector
                    classes={formattedClassesForSelector}
                    selectedClass={selectedMapping ? { id: selectedMapping.id } : null}
                    onClassChange={(cls) => {
                        const mapping = flatMappings.find(m => m.id === cls.id);
                        setSelectedMapping(mapping);
                    }}
                />

                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                        <CalendarIcon size={14} className="text-gray-400" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded inline-block">
                        {isFetchingStudents ? '...' : students.length} Students
                    </span>
                </div>

                {/* 2. Attendance List */}
                <div ref={listRef} className="pb-4">
                    {isFetchingStudents ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                            <p className="text-sm text-gray-500 font-medium font-['Inter']">Loading student list...</p>
                        </div>
                    ) : students.length > 0 ? (
                        students.map(student => (
                            <AttendanceRow
                                key={student._id}
                                student={{
                                    id: student._id,
                                    name: `${student.firstName} ${student.lastName}`,
                                    roll: student.rollNo || 'N/A'
                                }}
                                status={attendanceState[student._id]}
                                onStatusChange={handleStatusChange}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <Users className="mx-auto text-gray-300 mb-3" size={32} />
                            <p className="text-sm text-gray-400 font-medium font-['Inter']">No students found for this class.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 3. Bottom Action Bar */}
            <AttendanceSummaryBar
                stats={stats}
                onSubmit={handleSubmit}
                disabled={isFetchingStudents || students.length === 0}
            />
        </div>
    );
};

export default AttendancePage;
