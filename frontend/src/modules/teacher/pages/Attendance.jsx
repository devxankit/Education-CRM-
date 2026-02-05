import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Info, Calendar as CalendarIcon, Users, Loader2, Lock, Clock } from 'lucide-react';
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
    const fetchProfile = useTeacherStore(state => state.fetchProfile); // Get fetchProfile from store
    const profile = useTeacherStore(state => state.profile); // Get profile from store

    const [selectedMapping, setSelectedMapping] = useState(null);
    const [attendanceState, setAttendanceState] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const fetchAttendanceByDate = useTeacherStore(state => state.fetchAttendanceByDate);
    const isFetchingAttendance = useTeacherStore(state => state.isFetchingAttendance);

    // Fetch Initial Data on Mount
    useEffect(() => {
        fetchProfile();
        fetchAssignedClasses();
    }, [fetchProfile, fetchAssignedClasses]); // Add fetchProfile and fetchAssignedClasses to dependencies for completeness, though Zustand functions are stable

    // Flatten mappings for the selector
    const flatMappings = React.useMemo(() => assignedClasses.flatMap(sub =>
        sub.classes.map(cls => ({
            id: `${sub.subjectId}_${cls.classId}_${cls.sectionId}`,
            subjectId: sub.subjectId,
            subjectName: sub.subjectName,
            classId: cls.classId,
            sectionId: cls.sectionId,
            className: cls.fullClassName,
        }))
    ), [assignedClasses]);

    // Default to first mapping if none selected
    useEffect(() => {
        if (flatMappings.length > 0 && !selectedMapping) {
            setSelectedMapping(flatMappings[0]);
        }
    }, [flatMappings, selectedMapping]);

    // Load Attendance Data (Existing or New)
    useEffect(() => {
        const loadAttendance = async () => {
            if (!selectedMapping) return;

            // 1. Fetch Students
            await fetchClassStudents(selectedMapping.classId, selectedMapping.sectionId);

            // 2. Try to fetch existing attendance for this date
            const existing = await fetchAttendanceByDate({
                classId: selectedMapping.classId,
                sectionId: selectedMapping.sectionId,
                subjectId: selectedMapping.subjectId,
                date: selectedDate
            });

            if (existing && existing.attendanceData) {
                const map = {};
                existing.attendanceData.forEach(entry => {
                    const studentId = entry.studentId._id || entry.studentId;
                    map[studentId] = entry.status;
                });
                setAttendanceState(map);
            } else {
                // Initialize new attendance (default Present)
                // Use a functional update to ensure we use the latest students from the store
            }
        };

        loadAttendance();
    }, [selectedMapping, selectedDate, fetchClassStudents, fetchAttendanceByDate]);

    // Separate effect to initialize default state when students change and NO existing record was found
    useEffect(() => {
        // If we have students but no attendance state (or empty state), initialize it
        // ONLY initialize with defaults if it's TODAY. For past dates, empty means no record.
        if (isToday(selectedDate) && students.length > 0 && Object.keys(attendanceState).length === 0) {
            const initialMap = {};
            students.forEach(s => {
                initialMap[s._id] = 'Present';
            });
            setAttendanceState(initialMap);
        }
    }, [students, attendanceState, selectedDate]);

    // Reset attendance state when mapping or date changes to force re-initialization
    useEffect(() => {
        setAttendanceState({});
    }, [selectedMapping, selectedDate]);


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

    const isSubmitting = useTeacherStore(state => state.isSubmittingAttendance);

    const handleStatusChange = (studentId, status) => {
        // Check if editing is allowed
        if (!isToday(selectedDate)) return;

        setAttendanceState(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const isToday = (dateStr) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    const handleSubmit = async () => {
        if (!isToday(selectedDate)) {
            alert("Attendance can only be marked or updated for today.");
            return;
        }

        if (Object.keys(attendanceState).length === 0) {
            alert("No students to mark attendance for.");
            return;
        }

        const confirm = window.confirm("Are you sure you want to submit attendance? This action will be logged.");
        if (confirm) {
            const attendanceData = Object.entries(attendanceState).map(([studentId, status]) => ({
                studentId,
                status,
                remarks: ""
            }));

            const payload = {
                classId: selectedMapping?.classId,
                sectionId: selectedMapping?.sectionId,
                subjectId: selectedMapping?.subjectId,
                date: selectedDate,
                attendanceData,
                academicYearId: profile?.currentAcademicYear || profile?.academicYearId || "65af736f987654edcba98765", // Fallback or from profile
                branchId: profile?.branchId?._id || profile?.branchId || "65af736f987654edcba12345"
            };

            const success = await submitAttendanceAction(payload);
            if (success) {
                alert("Attendance Submitted Successfully!");
                navigate('/teacher/dashboard');
            } else {
                alert("Failed to submit attendance. Please try again.");
            }
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

    const isLocked = !isToday(selectedDate);

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
                    {isLocked && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                            <Lock size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Locked</span>
                        </div>
                    )}
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
                    <div className="relative group">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer">
                            <CalendarIcon size={14} className="text-gray-400" />
                            <input
                                type="date"
                                value={selectedDate}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent outline-none cursor-pointer"
                            />
                        </div>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded inline-block">
                        {(isFetchingStudents || isFetchingAttendance) ? '...' : students.length} Students
                    </span>
                </div>

                {isLocked && (
                    <div className="mb-4 bg-amber-50 border border-amber-100 p-3 rounded-2xl flex items-start gap-3">
                        <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                            <Info size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-800">Past Record View</p>
                            <p className="text-[10px] text-amber-600 font-medium">You are viewing attendance for a past date. Changes are disabled.</p>
                        </div>
                    </div>
                )}

                {/* 2. Attendance List */}
                <div ref={listRef} className="pb-4">
                    {(isFetchingStudents || isFetchingAttendance) ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                            <p className="text-sm text-gray-500 font-medium font-['Inter']">Synchronizing data...</p>
                        </div>
                    ) : (isLocked ? (Object.keys(attendanceState).length > 0 ? students : []) : students).length > 0 ? (
                        (isLocked ? (Object.keys(attendanceState).length > 0 ? students : []) : students).map(student => (
                            <AttendanceRow
                                key={student._id}
                                student={{
                                    id: student._id,
                                    name: `${student.firstName} ${student.lastName}`,
                                    roll: student.rollNo || 'N/A'
                                }}
                                status={attendanceState[student._id]}
                                onStatusChange={handleStatusChange}
                                disabled={isLocked}
                            />
                        ))
                    ) : isLocked ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <Clock className="mx-auto text-gray-300 mb-3" size={32} />
                            <p className="text-sm text-gray-400 font-medium font-['Inter']">No attendance record found for this date.</p>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <Users className="mx-auto text-gray-300 mb-3" size={32} />
                            <p className="text-sm text-gray-400 font-medium font-['Inter']">No students found for this class.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 3. Bottom Action Bar */}
            {!isLocked && (
                <AttendanceSummaryBar
                    stats={stats}
                    onSubmit={handleSubmit}
                    disabled={isFetchingStudents || students.length === 0 || isSubmitting}
                />
            )}
        </div>
    );
};

export default AttendancePage;
