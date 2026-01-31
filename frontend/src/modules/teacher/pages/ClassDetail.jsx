import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lenis from 'lenis';
import { ChevronLeft, Users, BookOpen, Clock, MoreVertical, Search, Filter } from 'lucide-react';
import gsap from 'gsap';

// Data
import { academicsData } from '../data/academicsData';

const ClassDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const containerRef = useRef(null);
    const listRef = useRef(null);

    // Get class details
    const classInfo = academicsData.subjects
        .flatMap(s => s.classes)
        .find(c => c.id === id);

    const students = academicsData.students[id] || [];

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
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
            );
        }
    }, [id]);

    if (!classInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Class not found</h2>
                    <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-medium">Go Back</button>
                </div>
            </div>
        );
    }

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
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">Class {classInfo.name}</h1>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{classInfo.subject || 'Academic Details'}</p>
                        </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <MoreVertical size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit mb-2">
                            <Users size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{classInfo.students}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Students</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-2">
                            <Clock size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{classInfo.sessions}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Sessions/Wk</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg w-fit mb-2">
                            <BookOpen size={16} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">85%</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Avg. Perf.</div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                        />
                    </div>
                    <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-colors shadow-sm">
                        <Filter size={18} />
                    </button>
                </div>

                {/* Student List */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student Roster</h3>
                        <span className="text-[10px] font-bold text-indigo-600">{students.length} Students Total</span>
                    </div>

                    <div ref={listRef} className="space-y-3">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-all flex items-center justify-between group cursor-pointer"
                                onClick={() => alert(`Student: ${student.name}\nPerformance: ${student.performance}\nAttendance: ${student.attendance}%`)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{student.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Roll {student.roll}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                student.performance === 'Excellent' ? 'bg-emerald-50 text-emerald-600' :
                                                student.performance === 'Good' ? 'bg-blue-50 text-blue-600' :
                                                'bg-orange-50 text-orange-600'
                                            }`}>
                                                {student.performance}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">{student.attendance}%</div>
                                    <div className="text-[10px] text-gray-400 font-medium">Attendance</div>
                                </div>
                            </div>
                        ))}

                        {students.length === 0 && (
                            <div className="bg-white py-12 rounded-2xl border border-dashed border-gray-200 text-center">
                                <Users className="mx-auto text-gray-300 mb-3" size={32} />
                                <p className="text-sm text-gray-400 font-medium">No student data available for this class.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClassDetailPage;