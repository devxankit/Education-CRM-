
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Info, Calendar, PieChart, AlertTriangle, Book, Award, HeadphonesIcon, ChevronDown, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AttendanceOverview from '../components/attendance/AttendanceOverview';
import { useParentStore } from '../../../store/parentStore';

const ParentAttendancePage = () => {
    const navigate = useNavigate();
    const logout = useParentStore(state => state.logout);
    const location = useLocation();
    const state = location.state || {};
    const { childId, highlightLowAttendance } = state;
    const scrollRef = useRef(null);

    const attendance = useParentStore(state => state.attendance);

    const [selectedMonth, setSelectedMonth] = useState('Oct');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // 1. Entry Check & Scrolling
    useEffect(() => {
        if (!childId) {
            console.warn("No childId provided, redirected in prod.");
        }

        if (highlightLowAttendance && scrollRef.current) {
            setTimeout(() => {
                scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [childId, highlightLowAttendance]);

    // Handlers
    const handleBack = () => navigate(-1);

    const handleMonthSelect = (month) => setSelectedMonth(month);

    const handleQuickAction = (path) => {
        navigate(path, { state: { childId, source: 'attendance' } });
    };

    const handleLogout = () => {
        logout();
        navigate('/parent/login');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* 1. Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Attendance</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsInfoModalOpen(true)}
                        className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors"
                    >
                        <Info size={20} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* 2. Overview Card */}
                <AttendanceOverview data={attendance} />

                {/* 6. Low Attendance Warning */}
                {(attendance.overall < attendance.required || highlightLowAttendance) && (
                    <div ref={scrollRef} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Attention Needed</h3>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                Attendance is currently below 75%. Please ensure regular attendance to avoid academic penalties.
                            </p>
                            <button className="mt-3 text-xs font-bold text-amber-700 underline">
                                View Academic Policy
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. Monthly Breakdown */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Report</h2>
                        <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
                            {['Oct', 'Sep', 'Aug'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => handleMonthSelect(m)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedMonth === m ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {attendance.monthly.filter(m => m.month === selectedMonth).map((data, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{data.month} 2023</h3>
                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase mt-1 ${data.isLow ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {data.isLow ? 'Low Attendance' : 'Good'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-extrabold text-gray-900">{data.percentage}%</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                                        <span className="block text-xl font-bold text-green-700">{data.present}</span>
                                        <span className="text-[10px] uppercase font-bold text-green-600/70">Present</span>
                                    </div>
                                    <div className="flex-1 bg-red-50 rounded-lg p-2 text-center">
                                        <span className="block text-xl font-bold text-red-700">{data.absent}</span>
                                        <span className="text-[10px] uppercase font-bold text-red-600/70">Absent</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Day-wise View */}
                <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Recent History</h2>
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        {attendance.history.map((day, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${day.status === 'Present' ? 'bg-green-100 text-green-700' :
                                        day.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {day.date.split('-')[2]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{day.status}</p>
                                        <p className="text-xs text-gray-500">{day.type}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400">{day.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7. Quick Actions */}
                <div className="pt-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Related Actions</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => handleQuickAction('/parent/homework')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Book size={20} className="text-indigo-500" />
                            <span className="text-[10px] font-bold text-gray-600">Homework</span>
                        </button>
                        <button onClick={() => handleQuickAction('/parent/results')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Award size={20} className="text-purple-500" />
                            <span className="text-[10px] font-bold text-gray-600">Results</span>
                        </button>
                        <button onClick={() => handleQuickAction('/parent/support')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <HeadphonesIcon size={20} className="text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-600">Support</span>
                        </button>
                    </div>
                </div>

            </main>

            {/* Info Modal */}
            <AnimatePresence>
                {isInfoModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsInfoModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">About Attendance</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                Regular attendance is crucial for academic success. We recommend maintaining at least <strong>75% attendance</strong> to ensure your child doesn't miss out on important learning.
                            </p>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 p-2 rounded-lg"><CheckCircle size={14} /> 75% & above: Good Standing</li>
                                <li className="flex items-center gap-2 text-xs font-semibold text-orange-700 bg-orange-50 p-2 rounded-lg"><AlertTriangle size={14} /> 65% - 75%: Warning Zone</li>
                                <li className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 p-2 rounded-lg"><XCircle size={14} /> Below 65%: Critical Action</li>
                            </ul>
                            <button onClick={() => setIsInfoModalOpen(false)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-sm">Got it</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ParentAttendancePage;
