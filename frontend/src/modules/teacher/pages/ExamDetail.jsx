
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lenis from 'lenis';
import { ChevronLeft, Calendar, Users, Award, Lock, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { AnimatePresence } from 'framer-motion';
import { useTeacherStore } from '../../../store/teacherStore';
import ExamCard from '../components/exams/ExamCard';
import MarksEntryTable from '../components/exams/MarksEntryTable';

const ExamDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const fetchExamById = useTeacherStore(state => state.fetchExamById);
    const currentExam = useTeacherStore(state => state.currentExam);
    const isFetchingExam = useTeacherStore(state => state.isFetchingExam);
    const [fetchError, setFetchError] = useState(null); // { forbidden, notFound, message }

    useEffect(() => {
        if (!id) return;
        setFetchError(null);
        const load = async () => {
            const result = await fetchExamById(id);
            if (!result.success) {
                setFetchError({
                    forbidden: result.forbidden,
                    notFound: result.notFound,
                    message: result.message
                });
            }
        };
        load();
    }, [id, fetchExamById]);

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
        if (listRef.current && currentExam?.subjects?.length > 0) {
            const ctx = gsap.context(() => {
                gsap.fromTo(listRef.current.children,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
                );
            });
            return () => {
                try { ctx.revert(); } catch (_) {}
            };
        }
    }, [currentExam?.subjects?.length]);

    const handleEnterMarks = (subject) => {
        setSelectedSubject(subject);
    };

    const handleBack = () => {
        navigate('/teacher/exams', { replace: true });
    };

    // Loading
    if (isFetchingExam) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center text-gray-500">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium">Loading exam...</p>
                </div>
            </div>
        );
    }

    // Access denied - teacher not assigned to any subject
    if (fetchError?.forbidden) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
                <div className="text-center max-w-sm">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-full w-fit mx-auto mb-4">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        You are not assigned to any subject in this exam. Only assigned teachers can view and enter marks.
                    </p>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    // Exam not found
    if (fetchError?.notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Exam not found</h2>
                    <button
                        onClick={handleBack}
                        className="mt-4 px-4 py-2 text-indigo-600 font-medium hover:underline"
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    // Generic error or no exam data
    if (!currentExam) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
                <div className="text-center max-w-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Unable to load exam</h2>
                    <p className="text-sm text-gray-600 mb-4">{fetchError?.message || 'Please try again.'}</p>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    const exam = currentExam;

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">{exam.examName}</h1>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                {exam.examType || 'Exam'} • {exam.classes?.map(c => c.name).join(', ') || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                {/* Exam Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit mb-2">
                            <Users size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{exam.subjects?.length || 0}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Your Subjects</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-2">
                            <Award size={16} />
                        </div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">
                            {new Date(exam.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Start</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg w-fit mb-2">
                            <Calendar size={16} />
                        </div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">
                            {new Date(exam.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">End</div>
                    </div>
                </div>

                {/* Your Assigned Subjects */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Subjects</h2>
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {exam.subjects?.length || 0} assigned
                    </span>
                </div>

                <div ref={listRef} className="space-y-4">
                    {exam.subjects?.length > 0 ? (
                        exam.subjects.map(subject => (
                            <ExamCard
                                key={subject.subjectId}
                                exam={exam}
                                subject={subject}
                                onEnterMarks={() => handleEnterMarks(subject)}
                                onClick={() => handleEnterMarks(subject)}
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                            <div className="p-3 bg-gray-50 text-gray-400 rounded-full w-fit mx-auto mb-3">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">No Assigned Subjects</h3>
                            <p className="text-xs text-gray-500">You are not assigned to any subject in this exam.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Marks Entry Modal */}
            <AnimatePresence>
                {selectedSubject && (
                    <MarksEntryTable
                        isOpen={!!selectedSubject}
                        onClose={() => setSelectedSubject(null)}
                        exam={exam}
                        subject={selectedSubject}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExamDetailPage;
