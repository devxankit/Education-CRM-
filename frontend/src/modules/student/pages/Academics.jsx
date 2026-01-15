import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import PageHeader from '../components/Academics/PageHeader';
import ClassInfoCard from '../components/Academics/ClassInfoCard';
import TimetableSection from '../components/Academics/TimetableSection';
import SubjectsGrid from '../components/Academics/SubjectsGrid';
import BottomNav from '../components/Dashboard/BottomNav'; // Reused

// Mock Data
import { classInfo, subjects, timetable } from '../data/academicsData';

const Academics = () => {
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
