
import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lenis from 'lenis';
import { ChevronLeft, Calendar, Users, Award, AlertCircle, CheckCircle, MoreVertical } from 'lucide-react';
import gsap from 'gsap';

// Data
import { examsData } from '../data/examsData';

const ExamDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const containerRef = useRef(null);
    const listRef = useRef(null);

    // Get exam details
    const exam = examsData.list.find(e => e.id === id);
    const students = examsData.students[id] || [];

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

    if (!exam) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Exam not found</h2>
                    <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-medium">Go Back</button>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-sm font-bold text-gray-900">{exam.title}</h1>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{exam.subject} • {exam.class}</p>
                        </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <MoreVertical size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                {/* Exam Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit mb-2">
                            <Users size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{exam.studentsCount}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Students</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-2">
                            <Award size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{exam.evaluatedCount}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Evaluated</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg w-fit mb-2">
                            <Calendar size={16} />
                        </div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Date</div>
                    </div>
                </div>

                {/* Student Marks List */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student Results</h2>
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {students.length} Records Found
                    </span>
                </div>

                <div ref={listRef} className="space-y-3">
                    {students.length > 0 ? (
                        students.map((student) => (
                            <div
                                key={student.id}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {student.roll}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{student.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">ID: {student.id}</span>
                                            {student.status === 'Evaluated' ? (
                                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                    <CheckCircle size={10} /> Evaluated
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                                    <AlertCircle size={10} /> Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">
                                        {student.marks !== null ? `${student.marks}/${exam.totalMarks}` : '--'}
                                    </div>
                                    <div className={`text-[10px] font-bold ${
                                        student.grade === 'A' ? 'text-emerald-600' :
                                        student.grade === 'B' ? 'text-blue-600' :
                                        student.grade === 'D' ? 'text-red-600' :
                                        'text-gray-400'
                                    }`}>
                                        Grade: {student.grade || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                            <div className="p-3 bg-gray-50 text-gray-400 rounded-full w-fit mx-auto mb-3">
                                <Users size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">No Student Data</h3>
                            <p className="text-xs text-gray-500">Evaluation hasn't started for this exam yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExamDetailPage;
