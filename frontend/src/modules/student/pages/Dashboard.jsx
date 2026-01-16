import React, { useEffect, useRef } from 'react';
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

// Data
import { studentProfile, alerts, todayClasses, stats, performance } from '../data/dashboardData';

const Dashboard = () => {
    const containerRef = useRef(null);

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

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24" ref={containerRef}>
            {/* Header - Sticky */}
            <Header user={studentProfile} />

            <main className="space-y-1">

                {/* Alerts Section (Swipeable) */}
                <div className="dashboard-item">
                    <AlertSection alerts={alerts} />
                </div>

                {/* Quick Actions Row */}
                <div className="dashboard-item">
                    <QuickActions />
                </div>

                {/* Today's Timeline */}
                <div className="dashboard-item">
                    <TodayClasses classes={todayClasses} />
                </div>

                {/* Stats Grid */}
                <div className="dashboard-item">
                    <StatsSection stats={stats} />
                </div>

                {/* Performance / Motivation */}
                <div className="dashboard-item">
                    <PerformanceCard data={performance} />
                </div>

            </main>

            {/* Fixed Bottom Navigation removed as it is in Layout */}
        </div>
    );
};

export default Dashboard;
