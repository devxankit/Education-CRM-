import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lenis from 'lenis';
import { ChevronLeft, Users, BookOpen, Clock, Info } from 'lucide-react';
import gsap from 'gsap';
import { useTeacherStore } from '../../../store/teacherStore';
import { Loader2 } from 'lucide-react';

const ClassDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Format: classId_sectionId OR mappingId_day_startTime
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const [showRestrictionMessage, setShowRestrictionMessage] = useState(false);

    // Store
    const assignedClasses = useTeacherStore(state => state.assignedClasses);
    const fetchAssignedClasses = useTeacherStore(state => state.fetchAssignedClasses);
    const students = useTeacherStore(state => state.classStudents);
    const fetchClassStudents = useTeacherStore(state => state.fetchClassStudents);
    const isFetching = useTeacherStore(state => state.isFetchingStudents);

    // Parse ID - could be classId_sectionId or mappingId_day_startTime
    // Try to extract classId and sectionId from the URL or from assignedClasses
    let classId, sectionId;
    
    // First, try to find in assignedClasses by matching the ID
    const classInfo = assignedClasses
        .flatMap(s => s.classes)
        .find(c => {
            // Check if id matches classId_sectionId format
            const expectedId = `${c.classId}_${c.sectionId}`;
            if (id === expectedId) {
                classId = c.classId;
                sectionId = c.sectionId;
                return true;
            }
            return false;
        });
    
    // If not found, try parsing as classId_sectionId
    if (!classInfo && id) {
        const parts = id.split('_');
        if (parts.length >= 2) {
            // Check if first two parts look like ObjectIds (24 hex chars)
            const potentialClassId = parts[0];
            const potentialSectionId = parts[1];
            if (potentialClassId.length === 24 && potentialSectionId.length === 24) {
                classId = potentialClassId;
                sectionId = potentialSectionId;
            }
        }
    }

    // Is this teacher Class Teacher for this section? (only they can view student details)
    const isClassTeacherForThisSection = classId && sectionId && assignedClasses.some(
        s => (s.subjectName === 'Class Teacher' || s.subjectId == null) &&
            s.classes?.some(c => c.classId === classId && c.sectionId === sectionId)
    );

    // Fetch on mount
    useEffect(() => {
        if (assignedClasses.length === 0) {
            fetchAssignedClasses();
        }
        if (classId && sectionId && classId.length === 24 && sectionId.length === 24) {
            // Validate that both are valid ObjectIds before making API call
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

    // Entrance Animation (with cleanup)
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(el.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
            );
        }, el);
        return () => { try { ctx.revert(); } catch (_) { /* ignore */ } };
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
                                onClick={() => {
                                    if (isClassTeacherForThisSection) {
                                        navigate(`/teacher/classes/${id}/student/${student._id}`);
                                    } else {
                                        setShowRestrictionMessage(true);
                                    }
                                }}
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

            {/* Info message when Subject Teacher clicks student - no navigation */}
            {showRestrictionMessage && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                            <Info className="text-amber-600" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Access Restricted</h3>
                        <p className="text-sm text-gray-600 mb-5">Only Class Teacher can view student details for this class.</p>
                        <button
                            onClick={() => setShowRestrictionMessage(false)}
                            className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDetailPage;