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
import { Calendar } from 'lucide-react';

const Dashboard = () => {
    const containerRef = useRef(null);
    const profile = useStudentStore(state => state.profile);
    const dashboardData = useStudentStore(state => state.dashboard);
    const upcomingHolidays = useStudentStore(state => state.upcomingHolidays);
    const fetchDashboardData = useStudentStore(state => state.fetchDashboardData);
    const fetchUpcomingHolidays = useStudentStore(state => state.fetchUpcomingHolidays);

    const [loading, setLoading] = useState(!dashboardData);

    const formatHolidayDate = (holiday) => {
        const start = new Date(holiday.startDate);
        const end = new Date(holiday.endDate || holiday.startDate);
        if (holiday.isRange && !isNaN(end.getTime()) && start.toDateString() !== end.toDateString()) {
            return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
        }
        return start.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    useEffect(() => {
        const init = async () => {
            await fetchDashboardData();
            await fetchUpcomingHolidays();
            setLoading(false);
        };
        init();
    }, [fetchDashboardData, fetchUpcomingHolidays]);

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

        return () => {
            try { ctx.revert(); } catch (_) { /* ignore DOM errors on unmount */ }
        };
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

                {/* Upcoming Holidays */}
                {upcomingHolidays && (
                    <div className="dashboard-item px-4">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-indigo-500" />
                                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                        Upcoming Holidays
                                    </h2>
                                </div>
                                {upcomingHolidays.length > 0 && (
                                    <span className="text-[10px] text-gray-400 font-semibold">
                                        Next {upcomingHolidays.length} days
                                    </span>
                                )}
                            </div>
                            {upcomingHolidays.length > 0 ? (
                                <div className="space-y-2">
                                    {upcomingHolidays.map((h) => (
                                        <div key={h._id || h.id} className="flex items-center justify-between text-xs">
                                            <div>
                                                <p className="font-semibold text-gray-900">{h.name}</p>
                                                <p className="text-[11px] text-gray-500">
                                                    {formatHolidayDate(h)}
                                                </p>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                {h.type || 'Holiday'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[11px] text-gray-400">
                                    No upcoming holidays recorded yet.
                                </p>
                            )}
                        </div>
                    </div>
                )}

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
