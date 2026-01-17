import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Info, Download } from 'lucide-react';
import gsap from 'gsap';

// Components
import ReportFilters from '../components/reports/ReportFilters';
import MetricsCards from '../components/reports/MetricsCards';
import StudentRiskList from '../components/reports/StudentRiskList';

// Data
import { reportsData } from '../data/reportsData';

const ReportsPage = () => {
    const navigate = useNavigate();
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

    // Entrance Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.report-section', {
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
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-28">
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
                        <h1 className="text-lg font-bold text-gray-900">Reports & Analytics</h1>
                    </div>
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Info size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                <div className="report-section">
                    <ReportFilters
                        years={reportsData.filters.academicYears}
                        classes={reportsData.filters.classes}
                        onFilterApply={() => { }}
                    />
                </div>

                <div className="report-section">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Performance Overview</h2>
                    </div>
                    <MetricsCards metrics={reportsData.metrics} />
                </div>

                <div className="report-section">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col items-center justify-center min-h-[160px]">
                        <p className="text-xs text-gray-400 font-medium mb-2">Weekly Attendance Trend</p>
                        <div className="flex items-end gap-3 h-20 w-full px-4 justify-between">
                            {reportsData.analytics.attendanceTrend.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                    <div
                                        style={{ height: `${d.value}%` }}
                                        className="w-full bg-emerald-100 rounded-t-lg relative group-hover:bg-emerald-200 transition-colors"
                                    ></div>
                                    <span className="text-[9px] font-bold text-gray-400">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="report-section">
                    <StudentRiskList students={reportsData.atRiskStudents} />
                </div>

                <div className="report-section">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white rounded-2xl py-3.5 text-sm font-bold shadow-lg shadow-gray-200">
                        <Download size={18} /> Export Class Report (PDF)
                    </button>
                </div>

            </main>
        </div>
    );
};

export default ReportsPage;
