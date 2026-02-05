import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Info, Download, ArrowLeft, Users, BookOpen, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { useTeacherStore } from '../../../store/teacherStore';
import { motion } from 'framer-motion';

const ReportsPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { fetchAnalytics, analyticsData, isFetchingAnalytics } = useTeacherStore();

    // Fetch analytics on mount
    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

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

    // Entrance Animation
    useEffect(() => {
        if (!isFetchingAnalytics && analyticsData) {
            const ctx = gsap.context(() => {
                gsap.from('.report-section', {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [isFetchingAnalytics, analyticsData]);

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
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Reports & Analytics</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-6">
                {isFetchingAnalytics ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium">Synthesizing Reports...</p>
                    </div>
                ) : analyticsData ? (
                    <div className="space-y-6">
                        {/* 1. Key Metrics */}
                        <div className="report-section grid grid-cols-2 gap-4">
                            <MetricCard
                                label="Avg Attendance"
                                value={`${analyticsData.attendanceTrend?.[analyticsData.attendanceTrend.length - 1]?.avgAttendance || 0}%`}
                                trend="+2.4%"
                                icon={<Users size={20} />}
                                color="bg-blue-600"
                            />
                            <MetricCard
                                label="Homework Feed"
                                value={`${analyticsData.homeworkStats?.total || 0}`}
                                trend="Total"
                                icon={<BookOpen size={20} />}
                                color="bg-emerald-600"
                            />
                        </div>

                        {/* 2. Attendance Trend Chart */}
                        <div className="report-section bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900">Attendance Trend</h3>
                                <div className="flex gap-2">
                                    <TrendingUp size={16} className="text-green-500" />
                                    <span className="text-[10px] font-bold text-green-500 uppercase">Last 7 Records</span>
                                </div>
                            </div>
                            <div className="h-40 flex items-end justify-between gap-2 px-2">
                                {analyticsData.attendanceTrend?.map((day, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div
                                            className="w-full bg-indigo-50 group-hover:bg-indigo-600 transition-all relative rounded-xl"
                                            style={{ height: `${day.avgAttendance}%` }}
                                        >
                                            <div className="absolute top-0 inset-x-0 h-1 bg-white/20"></div>
                                        </div>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{day.date.split('-').slice(1).join('/')}</span>
                                    </div>
                                ))}
                                {(!analyticsData.attendanceTrend || analyticsData.attendanceTrend.length === 0) && (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 italic">
                                        No historical records found
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Performance Summary */}
                        <div className="report-section bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-600" />
                                Exam Performance
                            </h3>
                            <div className="space-y-6">
                                {analyticsData.examPerformance?.length > 0 ? analyticsData.examPerformance.map((exam, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-[11px] font-bold mb-2">
                                            <span className="text-gray-900 uppercase tracking-wider">{exam.examName}</span>
                                            <span className="text-indigo-600 p-1 bg-indigo-50 rounded-lg">{exam.avgPercentage}% AVG</span>
                                        </div>
                                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${exam.avgPercentage}%` }}
                                                className="h-full bg-indigo-600 rounded-full shadow-inner"
                                            />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center py-6">
                                        <Calendar size={32} className="text-gray-200 mb-2" />
                                        <p className="text-xs text-gray-400 font-medium italic">No recent exam data tracked.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Homework Statistics */}
                        <div className="report-section bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-5">Recent Submissions</h3>
                            <div className="space-y-3">
                                {analyticsData.homeworkStats?.recent?.length > 0 ? analyticsData.homeworkStats.recent.map((hw, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                                <AlertCircle size={20} className="text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 line-clamp-1">{hw.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Target: Class {hw.classId?.name || 'Assigned'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-indigo-600">{hw.submissionCount}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase">Submits</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-center text-gray-400">No active homework assignments.</p>
                                )}
                            </div>
                        </div>

                        <div className="report-section pt-4">
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white rounded-[1.5rem] py-4 text-sm font-bold shadow-2xl shadow-gray-200 active:scale-95 transition-all">
                                <Download size={20} /> Export Integrated Insight (PDF)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-400 font-medium italic">
                        Failed to load analytics. Please try again later.
                    </div>
                )}
            </main>
        </div>
    );
};

const MetricCard = ({ label, value, trend, icon, color }) => (
    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className={`w-10 h-10 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-gray-900">{value}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                    {trend}
                </span>
            </div>
        </div>
    </div>
);

export default ReportsPage;
