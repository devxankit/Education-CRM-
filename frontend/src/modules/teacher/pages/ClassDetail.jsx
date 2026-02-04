import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lenis from 'lenis';
import { ChevronLeft, Users, BookOpen, Clock, MoreVertical, Search, Filter } from 'lucide-react';
import gsap from 'gsap';

// Data
import { academicsData } from '../data/academicsData';

import { useTeacherStore } from '../../../store/teacherStore';
import { Loader2 } from 'lucide-react';

const ClassDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Format: classId_sectionId
    const containerRef = useRef(null);
    const listRef = useRef(null);

    // Compound ID parsing
    const [classId, sectionId] = (id || '').split('_');

    // Store
    const assignedClasses = useTeacherStore(state => state.assignedClasses);
    const fetchAssignedClasses = useTeacherStore(state => state.fetchAssignedClasses);
    const students = useTeacherStore(state => state.classStudents);
    const fetchClassStudents = useTeacherStore(state => state.fetchClassStudents);
    const isFetching = useTeacherStore(state => state.isFetchingStudents);

    // Get class details from store
    const classInfo = assignedClasses
        .flatMap(s => s.classes)
        .find(c => c.classId === classId && c.sectionId === sectionId);

    // Fetch on mount
    useEffect(() => {
        if (assignedClasses.length === 0) {
            fetchAssignedClasses();
        }
        if (classId && sectionId) {
            fetchClassStudents(classId, sectionId);
        }
    }, [id, classId, sectionId, fetchAssignedClasses, fetchClassStudents, assignedClasses.length]);

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

    // Entrance Animation
    useEffect(() => {
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
            );
        }
    }, [id]);

    if (isFetching && students.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium tracking-wide">Loading class roster...</p>
            </div>
        );
    }

    if (!classInfo && !isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Class mapping not found</h2>
                    <p className="text-gray-500 mt-1">Please ensure you have permission for this class.</p>
                    <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all">Go Back</button>
                </div>
            </div>
        );
    }

    const displayClassName = classInfo?.fullClassName || "Class Details";

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
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">{displayClassName}</h1>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Academic Roster</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-indigo-100">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit mb-2">
                            <Users size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{classInfo?.studentCount || 0}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Students</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm transform hover:scale-[1.02] transition-all">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-2">
                            <Clock size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{classInfo?.schedule || 'Daily'}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Schedule</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-orange-100">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg w-fit mb-2">
                            <BookOpen size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">85%</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Avg. Perf.</div>
                    </div>
                </div>

                {/* Student List */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student Roster</h3>
                        <span className="text-[10px] font-bold text-indigo-600">{students.length} Students Total</span>
                    </div>

                    <div ref={listRef} className="space-y-3">
                        {isFetching && students.length === 0 ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 animate-pulse flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                                        <div className="space-y-2">
                                            <div className="w-32 h-3 bg-gray-100 rounded"></div>
                                            <div className="w-20 h-2 bg-gray-50 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-gray-50 rounded"></div>
                                </div>
                            ))
                        ) : students.map((student) => (
                            <div
                                key={student._id}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-all flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">
                                        {student.photo ? (
                                            <img src={student.photo} alt={`${student.firstName} ${student.lastName}`} className="w-full h-full object-cover" />
                                        ) : (
                                            student.firstName.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase">
                                            {student.firstName} {student.lastName}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Roll {student.rollNo || 'N/A'}</span>
                                            <span className="text-[10px] font-bold text-gray-400 bg-blue-50/50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                                                {student.gender}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!isFetching && students.length === 0 && (
                            <div className="bg-white py-12 rounded-2xl border border-dashed border-gray-200 text-center">
                                <Users className="mx-auto text-gray-300 mb-3" size={32} />
                                <p className="text-sm text-gray-400 font-medium">No student data available for this class.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClassDetailPage;