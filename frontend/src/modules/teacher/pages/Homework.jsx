import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Plus, Filter } from 'lucide-react';
import gsap from 'gsap';
import { AnimatePresence } from 'framer-motion';
import { useTeacherStore } from '../../../store/teacherStore';

// Components
import TeacherHeader from '../components/common/TeacherHeader';
import HomeworkTabs from '../components/homework/HomeworkTabs';
import HomeworkCard from '../components/homework/HomeworkCard';
import CreateHomeworkForm from '../components/homework/CreateHomeworkForm';

// Data
import { teacherProfile } from '../data/dashboardData';
import { homeworkData } from '../data/homeworkData';

const HomeworkPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const homeworkList = useTeacherStore(state => state.homeworkList);

    const [activeTab, setActiveTab] = useState('active');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filteredHomework, setFilteredHomework] = useState([]);

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
    useEffect(() => {
        const filtered = homeworkList.filter(hw => {
            if (activeTab === 'all') return true;
            if (activeTab === 'active') return hw.status === 'Active';
            if (activeTab === 'past') return hw.status === 'Closed';
            if (activeTab === 'draft') return hw.status === 'Draft';
            return true;
        });
        setFilteredHomework(filtered);
    }, [activeTab, homeworkList]);

    // Animation on Filter Change
    useEffect(() => {
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, [filteredHomework]);


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
                        <h1 className="text-lg font-bold text-gray-900">Homework</h1>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                {/* 1. Tabs */}
                <HomeworkTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* 2. Homework List */}
                <div ref={listRef} className="mt-2 min-h-[300px]">
                    {filteredHomework.length > 0 ? (
                        filteredHomework.map(hw => (
                            <HomeworkCard
                                key={hw.id}
                                homework={hw}
                                onClick={() => navigate(`/teacher/homework/${hw.id}`)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="bg-gray-100 p-4 rounded-full mb-3">
                                <Filter size={24} />
                            </div>
                            <p className="text-sm font-medium">No homework found in this section.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <CreateHomeworkForm
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        classes={homeworkData.classes}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomeworkPage;
