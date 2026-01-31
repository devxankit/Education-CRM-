import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Filter, Info } from 'lucide-react';
import gsap from 'gsap';
import { AnimatePresence } from 'framer-motion';
import { useTeacherStore } from '../../../store/teacherStore';

// Components
import ExamTabs from '../components/exams/ExamTabs';
import ExamCard from '../components/exams/ExamCard';
import MarksEntryTable from '../components/exams/MarksEntryTable';

// Data
import { examsData } from '../data/examsData';

const ExamsPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const marksRecords = useTeacherStore(state => state.marksRecords);
    const exams = useTeacherStore(state => state.exams);
    const examStudentsMap = useTeacherStore(state => state.examStudents);

    const [activeTab, setActiveTab] = useState('active');
    const [selectedExam, setSelectedExam] = useState(null);

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

    // Filter Logic
    const filteredExams = exams.map(exam => {
        const record = marksRecords.find(r => r.examId === exam.id);
        return record ? { ...exam, status: record.status } : exam;
    }).filter(exam => {
        if (activeTab === 'all') return true;
        return exam.status.toLowerCase() === activeTab;
    });

    // Animation on Filter Change
    useEffect(() => {
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    const handleEnterMarks = (exam) => {
        setSelectedExam(exam);
    };

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
                        <h1 className="text-lg font-bold text-gray-900">Exams & Marks</h1>
                    </div>
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Info size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                {/* 1. Tabs */}
                <ExamTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* 2. Exam List */}
                <div ref={listRef} className="mt-2 min-h-[300px]">
                    {filteredExams.length > 0 ? (
                        filteredExams.map(exam => (
                            <ExamCard
                                key={exam.id}
                                exam={exam}
                                onEnterMarks={handleEnterMarks}
                                onClick={() => navigate(`/teacher/exams/${exam.id}`)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="bg-gray-100 p-4 rounded-full mb-3">
                                <Filter size={24} />
                            </div>
                            <p className="text-sm font-medium">No exams found in this section.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Marks Modal */}
            <AnimatePresence>
                {selectedExam && (
                    <MarksEntryTable
                        isOpen={!!selectedExam}
                        onClose={() => setSelectedExam(null)}
                        exam={selectedExam}
                        students={examStudentsMap[selectedExam?.id] || []}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExamsPage;
