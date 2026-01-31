import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { useTeacherStore } from '../../../store/teacherStore';

// Components
import TeacherHeader from '../components/common/TeacherHeader';
import AdminNoticeCard from '../components/dashboard/AdminNoticeCard';
import TodayClassesCard from '../components/dashboard/TodayClassesCard';
import PendingTasksCard from '../components/dashboard/PendingTasksCard';
import QuickActionsRow from '../components/dashboard/QuickActionsRow';
import PerformanceSnapshot from '../components/dashboard/PerformanceSnapshot';

const TeacherDashboard = () => {
    const containerRef = useRef(null);
    const profile = useTeacherStore(state => state.profile);
    const notices = useTeacherStore(state => state.notices);
    const todayClasses = useTeacherStore(state => state.todayClasses);
    const homeworkList = useTeacherStore(state => state.homeworkList);
    const queries = useTeacherStore(state => state.queries);

    // Dynamic Pending Actions
    const pendingActions = [
        {
            id: "ACT-1",
            title: "Attendance Pending",
            count: todayClasses.filter(c => c.status === 'Pending').length,
            type: "attendance",
            color: "text-orange-600 bg-orange-50"
        },
        {
            id: "ACT-2",
            title: "Homework Reviews",
            count: homeworkList.filter(h => h.status === 'Pending').length || 15,
            type: "homework",
            color: "text-purple-600 bg-purple-50"
        },
        {
            id: "ACT-3",
            title: "Queries Unanswered",
            count: queries.filter(q => q.status === 'Open').length,
            type: "query",
            color: "text-blue-600 bg-blue-50"
        }
    ];

    const performanceStats = {
        attendanceCompletion: Math.round((todayClasses.filter(c => c.status === 'Marked').length / todayClasses.length) * 100) || 85,
        homeworkReviewed: 60,
        engagementScore: 4.2
    };

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
            <TeacherHeader user={profile} />

            <main className="max-w-2xl mx-auto px-4 pt-4">

                {/* 2. Admin Notices (Swipeable) */}
                <AdminNoticeCard notices={notices} />

                {/* 3. Pending Actions (Critical) */}
                <PendingTasksCard actions={pendingActions} />

                {/* 4. Today's Classes (Core) */}
                <TodayClassesCard classes={todayClasses} />

                {/* 5. Quick Actions (Thumb Zone) */}
                <QuickActionsRow />

                {/* 6. Performance Insights */}
                <PerformanceSnapshot stats={performanceStats} />

            </main>
        </div>
    );
};

export default TeacherDashboard;
