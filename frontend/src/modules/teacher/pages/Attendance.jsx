import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Info, Calendar as CalendarIcon, Users } from 'lucide-react';
import gsap from 'gsap';
import { useTeacherStore } from '../../../store/teacherStore';

// Components
import ClassSubjectSelector from '../components/attendance/ClassSubjectSelector';
import AttendanceRow from '../components/attendance/AttendanceRow';
import AttendanceSummaryBar from '../components/attendance/AttendanceSummaryBar';

// Data
import { attendanceData } from '../data/attendanceData';

const AttendancePage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const todayClasses = useTeacherStore(state => state.todayClasses);
    const submitAttendanceAction = useTeacherStore(state => state.submitAttendance);

    const [selectedClass, setSelectedClass] = useState(null);
    const [attendanceState, setAttendanceState] = useState({});

    // Initialize State
    useEffect(() => {
        // Default to first class from today's timetable
        if (todayClasses.length > 0 && !selectedClass) {
            setSelectedClass(todayClasses[0]);
        }

        // Initialize attendance map from existing mock student list
        const initialMap = {};
        attendanceData.students.forEach(s => {
            initialMap[s.id] = 'Present';
        });
        setAttendanceState(initialMap);

    }, [todayClasses]);

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
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
            );
        }
    }, [selectedClass]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceState(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = () => {
        const confirm = window.confirm("Are you sure you want to submit attendance? This action will be logged.");
        if (confirm) {
            const record = {
                id: `ATT-${Date.now()}`,
                classId: selectedClass?.id,
                className: selectedClass?.classSection,
                subject: selectedClass?.subject,
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
                    classes={attendanceData.classes}
                    selectedClass={selectedClass}
                    onClassChange={setSelectedClass}
                />

                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                        <CalendarIcon size={14} className="text-gray-400" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded inline-block">
                        {attendanceData.students.length} Students
                    </span>
                </div>

                {/* 2. Attendance List */}
                <div ref={listRef} className="pb-4">
                    {attendanceData.students.map(student => (
                        <AttendanceRow
                            key={student.id}
                            student={student}
                            status={attendanceState[student.id]}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            </main>

            {/* 3. Bottom Action Bar */}
            <AttendanceSummaryBar stats={stats} onSubmit={handleSubmit} />
        </div>
    );
};

export default AttendancePage;
