import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';

const PerformanceOverview = ({ data }) => {
    const containerRef = useRef(null);
    const barsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Bars
            if (data?.trend?.length > 0) {
                gsap.fromTo(barsRef.current,
                    { height: '0%' },
                    {
                        height: (i) => `${data.trend[i]?.percentage || 0}%`,
                        duration: 1.5,
                        ease: 'power3.out',
                        stagger: 0.2
                    }
                );
            }

            // Animate Card Entry
            gsap.from(".perf-item", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);
        return () => {
            try { ctx.revert(); } catch (_) { /* ignore DOM errors on unmount */ }
        };
    }, [data]);

    // Calculate overall improvement
    const trend = data?.trend || [];
    const firstScore = trend[0]?.percentage || 0;
    const lastScore = trend[trend.length - 1]?.percentage || 0;
    const difference = lastScore - firstScore;
    const isImproved = difference >= 0;

    return (
        <div ref={containerRef} className="space-y-6 pb-20">
            {/* 1. Insight Card */}
            <div className="perf-item bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

                <div className="flex items-start justify-between relative z-10">
                    <div>
                        <h2 className="text-lg font-bold opacity-90">Performance Insight</h2>
                        <p className="text-indigo-100 text-sm mt-1 leading-relaxed max-w-[85%]">{data.insight}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        {isImproved ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                </div>

                <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-extrabold">{Math.abs(difference)}%</span>
                    <span className="text-sm font-medium opacity-80 mb-1.5 backdrop-blur-md bg-white/10 px-2 py-0.5 rounded">
                        {isImproved ? 'Improvement' : 'Decline'} since first exam
                    </span>
                </div>
            </div>

            {/* 2. Trend Chart (CSS Bar Chart) */}
            <div className="perf-item bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                    Exam Progression
                </h3>

                <div className="h-48 flex items-end justify-between px-2 gap-4">
                    {(data?.trend || []).length > 0 ? (data.trend.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full max-w-[40px] h-full bg-gray-50 rounded-t-lg overflow-hidden flex items-end">
                                {/* Bar */}
                                <div
                                    ref={el => barsRef.current[index] = el}
                                    className="w-full bg-blue-500 rounded-t-lg relative group-hover:bg-blue-600 transition-colors"
                                    style={{ height: '0%' }} // Initial for GSAP
                                >
                                    {/* Tooltip on Hover (Mobile friendly tap) */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        {item.percentage}%
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 font-medium mt-3 text-center">{item.exam}</span>
                        </div>
                    ))) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                            No trend data available
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Subject Averages */}
            <div className="perf-item bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                    Subject Average
                </h3>

                <div className="space-y-4">
                    {(data?.subjectAverage || []).length > 0 ? data.subjectAverage.map((sub, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm font-semibold text-gray-700">{sub.subject}</span>
                                <span className="text-xs font-bold text-gray-900">{sub.avg}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{ width: `${sub.avg}%` }}
                                ></div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-gray-400 text-sm italic py-2">
                            No subject averages available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerformanceOverview;
