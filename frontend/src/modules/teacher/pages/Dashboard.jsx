import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import gsap from 'gsap';

// Components
import TeacherHeader from '../components/common/TeacherHeader';
import AdminNoticeCard from '../components/dashboard/AdminNoticeCard';
import TodayClassesCard from '../components/dashboard/TodayClassesCard';
import PendingTasksCard from '../components/dashboard/PendingTasksCard';
import QuickActionsRow from '../components/dashboard/QuickActionsRow';
import PerformanceSnapshot from '../components/dashboard/PerformanceSnapshot';

// Data
import { teacherProfile, adminNotices, todayClasses, pendingActions, performanceStats } from '../data/dashboardData';

const TeacherDashboard = () => {
    const containerRef = useRef(null);

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

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-20">
            {/* 1. Header */}
            <TeacherHeader user={teacherProfile} />

            <main className="max-w-2xl mx-auto px-4 pt-4">

                {/* 2. Admin Notices (Swipeable) */}
                <AdminNoticeCard notices={adminNotices} />

                {/* 3. Pending Actions (Critical) */}
                <PendingTasksCard actions={pendingActions} />

                {/* 4. Today's Classes (Core) */}
                <TodayClassesCard classes={todayClasses} />

                {/* 5. Quick Actions (Thumb Zone) */}
                <QuickActionsRow />

                {/* 6. Performance Insights */}
                <PerformanceSnapshot stats={performanceStats} />

            </main>

            {/* 7. Navigation removed (handled by Layout) */}
        </div>
    );
};

export default TeacherDashboard;
