import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import gsap from 'gsap';

// Components
import Header from '../components/Dashboard/Header';
import AlertSection from '../components/Dashboard/AlertSection';
import QuickActions from '../components/Dashboard/QuickActions';
import TodayClasses from '../components/Dashboard/TodayClasses';
import StatsSection from '../components/Dashboard/StatsSection';
import PerformanceCard from '../components/Dashboard/PerformanceCard';

// Data Service
import { useStudentStore } from '../../../store/studentStore';

const Dashboard = () => {
    const containerRef = useRef(null);
    const profile = useStudentStore(state => state.profile);
    const dashboardData = useStudentStore(state => state.dashboard);
    const fetchDashboardData = useStudentStore(state => state.fetchDashboardData);

    const [loading, setLoading] = useState(!dashboardData);

    useEffect(() => {
        fetchDashboardData().finally(() => setLoading(false));
    }, [fetchDashboardData]);

    // Initialize Smooth Scroll (Lenis)
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

        return () => {
            lenis.destroy();
        };
    }, []);

    // GSAP Entrance Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.dashboard-item', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    if (loading || !dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24" ref={containerRef}>
            {/* Header - Sticky */}
            <Header user={profile || dashboardData.studentProfile} />

            <main className="space-y-1">

                {/* Alerts Section (Swipeable) */}
                <div className="dashboard-item">
                    <AlertSection alerts={dashboardData.alerts} />
                </div>

                {/* Quick Actions Row */}
                <div className="dashboard-item">
                    <QuickActions />
                </div>

                {/* Today's Timeline */}
                <div className="dashboard-item">
                    <TodayClasses classes={dashboardData.todayClasses} />
                </div>

                {/* Stats Grid */}
                <div className="dashboard-item">
                    <StatsSection stats={dashboardData.stats} />
                </div>

                {/* Performance / Motivation */}
                <div className="dashboard-item">
                    <PerformanceCard data={dashboardData.performance} />
                </div>

            </main>

            {/* Fixed Bottom Navigation removed as it is in Layout */}
        </div>
    );
};

export default Dashboard;
