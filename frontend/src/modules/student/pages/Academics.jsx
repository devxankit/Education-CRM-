import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import PageHeader from '../components/Academics/PageHeader';
import ClassInfoCard from '../components/Academics/ClassInfoCard';
import TimetableSection from '../components/Academics/TimetableSection';
import SubjectsGrid from '../components/Academics/SubjectsGrid';
import BottomNav from '../components/Dashboard/BottomNav'; // Reused

// Mock Data
import { classInfo, subjects, timetable } from '../data/academicsData';

const Academics = () => {
    const navigate = useNavigate();
    const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'short' })); // Default to today

    // Fallback if today is Sunday -> Mon
    useEffect(() => {
        if (activeDay === 'Sun') setActiveDay('Mon');
    }, [activeDay]);

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            <PageHeader title="Academics" />

            <main className="px-4 pt-4 max-w-md mx-auto">
                {/* Class Info */}
                <ClassInfoCard info={classInfo} />

                {/* Contextual Attendance Link */}
                <div className="mb-6 flex justify-end">
                    <button onClick={() => navigate('/student/attendance')} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primaryDark transition-colors">
                        View Attendance Stats
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>

                {/* Timetable */}
                <TimetableSection
                    timetable={timetable}
                    activeDay={activeDay}
                    setActiveDay={setActiveDay}
                />

                {/* Subjects */}
                <SubjectsGrid subjects={subjects} />
            </main>

            {/* Navigation */}
            <BottomNav />
        </div>
    );
};

export default Academics;
