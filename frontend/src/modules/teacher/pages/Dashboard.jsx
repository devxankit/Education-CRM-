import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Loader2 } from 'lucide-react';
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

    // Store
    const profile = useTeacherStore(state => state.profile);
    const dashboardData = useTeacherStore(state => state.dashboardData);
    const fetchDashboard = useTeacherStore(state => state.fetchDashboard);
    const fetchProfile = useTeacherStore(state => state.fetchProfile);
    const isFetchingDashboard = useTeacherStore(state => state.isFetchingDashboard);

    // Fetch dashboard data on mount
    useEffect(() => {
        fetchProfile();
        fetchDashboard();
    }, [fetchProfile, fetchDashboard]);

    // Dynamic Pending Actions
    const pendingActions = [
        {
            id: "ACT-1",
            title: "Total Classes",
            count: dashboardData?.summary?.totalClasses || 0,
            type: "classes",
            color: "text-orange-600 bg-orange-50"
        },
        {
            id: "ACT-2",
            title: "Total Homeworks",
            count: dashboardData?.summary?.totalHomeworks || 0,
            type: "homework",
            color: "text-purple-600 bg-purple-50"
        },
        {
            id: "ACT-3",
            title: "Total Students",
            count: dashboardData?.summary?.totalStudents || 0,
            type: "students",
            color: "text-blue-600 bg-blue-50"
        }
    ];

    // Format notices for AdminNoticeCard
    const formattedNotices = (dashboardData?.recentNotices || []).map(notice => ({
        id: notice._id,
        title: notice.title,
        priority: notice.priority || 'normal',
        date: new Date(notice.publishDate || notice.createdAt).toLocaleDateString()
    }));

    // Format today's classes from real timetable data
    const todayClasses = dashboardData?.todayClasses || [];

    const performanceStats = {
        attendanceCompletion: 85,
        homeworkReviewed: dashboardData?.summary?.totalHomeworks || 0,
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

    if (isFetchingDashboard && !dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-20">
            {/* 1. Header */}
            <TeacherHeader user={profile} />

            <main className="max-w-2xl mx-auto px-4 pt-4">

                {/* 2. Admin Notices (Swipeable) */}
                <AdminNoticeCard notices={formattedNotices} />

                {/* 3. Summary Stats (Dynamic from API) */}
                <PendingTasksCard actions={pendingActions} />

                {/* 4. Today's Classes/Subjects (Core) */}
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
