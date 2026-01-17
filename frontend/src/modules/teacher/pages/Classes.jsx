import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Info } from 'lucide-react';
import gsap from 'gsap';

// Components
import TeacherHeader from '../components/common/TeacherHeader';
import SubjectCard from '../components/classes/SubjectCard';
import SubjectAccordion from '../components/classes/SubjectAccordion';
import TeacherBottomNav from '../components/common/TeacherBottomNav';

// Data
import { teacherProfile } from '../data/dashboardData';
import { academicsData } from '../data/academicsData';

const ClassesPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [viewMode, setViewMode] = useState('list'); // 'grid' | 'list'

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

    // Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.subject-card', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-24">
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
                        <h1 className="text-lg font-bold text-gray-900">Classes & Subjects</h1>
                    </div>
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Info size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-6">

                {/* 1. Subjects Overview Grid */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Subjects</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {academicsData.subjects.map(subject => (
                            <div key={subject.id} className="subject-card">
                                <SubjectCard subject={subject} onClick={() => document.getElementById('class-management').scrollIntoView({ behavior: 'smooth' })} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Detailed Class List (Accordion) */}
                <div>
                    <h2 id="class-management" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Class Management</h2>
                    <div className="space-y-3">
                        {academicsData.subjects.map((subject, index) => (
                            <div key={subject.id} className="subject-card">
                                <SubjectAccordion subject={subject} defaultOpen={index === 0} />
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ClassesPage;
