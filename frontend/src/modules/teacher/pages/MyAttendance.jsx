import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle, XCircle, Clock, AlertCircle, Info, Loader2 } from 'lucide-react';
import { useTeacherStore } from '../../../store/teacherStore';
import { motion } from 'framer-motion';

const MONTHS = [
    { value: 0, label: 'All Months' },
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

const MyAttendance = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [filterAcademicYearId, setFilterAcademicYearId] = useState('all');
    const [filterMonth, setFilterMonth] = useState(0);

    const myAttendance = useTeacherStore(state => state.myAttendance);
    const fetchMyAttendance = useTeacherStore(state => state.fetchMyAttendance);
    const isFetching = useTeacherStore(state => state.isFetchingMyAttendance);
    const branchAcademicYears = useTeacherStore(state => state.branchAcademicYears);
    const fetchBranchAcademicYears = useTeacherStore(state => state.fetchBranchAcademicYears);

    const history = myAttendance || [];

    useEffect(() => {
        fetchBranchAcademicYears();
    }, [fetchBranchAcademicYears]);

    useEffect(() => {
        const ay = branchAcademicYears.find(a => a._id === filterAcademicYearId);
        if (filterMonth > 0 && ay?.startDate && ay?.endDate) {
            const startD = new Date(ay.startDate);
            const endD = new Date(ay.endDate);
            const y = filterMonth >= 4 ? startD.getFullYear() : endD.getFullYear();
            const start = new Date(y, filterMonth - 1, 1);
            const end = new Date(y, filterMonth, 0);
            const startDate = start.toISOString().split('T')[0];
            const endDate = end.toISOString().split('T')[0];
            fetchMyAttendance({ startDate, endDate });
        } else if (ay?.startDate && ay?.endDate) {
            const startDate = new Date(ay.startDate).toISOString().split('T')[0];
            const endDate = new Date(ay.endDate).toISOString().split('T')[0];
            fetchMyAttendance({ startDate, endDate });
        } else {
            fetchMyAttendance();
        }
    }, [fetchMyAttendance, filterAcademicYearId, filterMonth, branchAcademicYears]);

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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Present': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Absent': return 'bg-red-50 text-red-600 border-red-100';
            case 'Late': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Half-Day': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Leave': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'Present': return <CheckCircle size={14} />;
            case 'Absent': return <XCircle size={14} />;
            case 'Late': return <Clock size={14} />;
            case 'Half-Day': return <AlertCircle size={14} />;
            case 'Leave': return <Info size={14} />;
            default: return <CheckCircle size={14} />;
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center gap-3 max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-black text-gray-900 tracking-tight">My Attendance</h1>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-6">
                {/* Academic Year & Month Filter (branch-wise) */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">View by Academic Year & Month</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Academic Year</label>
                            <select
                                value={filterAcademicYearId}
                                onChange={(e) => setFilterAcademicYearId(e.target.value)}
                                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            >
                                <option value="all">All</option>
                                {branchAcademicYears.map(ay => (
                                    <option key={ay._id} value={ay._id}>{ay.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Month</label>
                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            >
                                {MONTHS.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                {!isFetching && history.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Present</p>
                            <p className="text-xl font-black text-emerald-600">{history.filter(a => a.status === 'Present').length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Absent</p>
                            <p className="text-xl font-black text-red-600">{history.filter(a => a.status === 'Absent').length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Late/Other</p>
                            <p className="text-xl font-black text-amber-600">{history.filter(a => !['Present', 'Absent'].includes(a.status)).length}</p>
                        </div>
                    </div>
                )}

                {/* Records List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Recent Records</h3>

                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                            <p className="text-sm text-gray-500 font-medium">Fetching records...</p>
                        </div>
                    ) : history.length > 0 ? (
                        history.map((record, idx) => (
                            <motion.div
                                key={record._id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                        <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
                                            {new Date(record.date).toLocaleString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-base font-black text-gray-800 leading-none">
                                            {new Date(record.date).getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-800 tracking-tight">
                                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <CalendarIcon size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                Marked by {record.markedBy?.name || 'Admin'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getStatusStyle(record.status)}`}>
                                    <StatusIcon status={record.status} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">{record.status}</span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CalendarIcon className="text-gray-300" size={32} />
                            </div>
                            <p className="text-sm text-gray-400 font-bold">No attendance records found yet</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium">Your attendance marked by staff will appear here</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm">
                        <Info size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-1">Attendance Policy</h4>
                        <p className="text-[10px] text-indigo-700/80 font-bold leading-relaxed">
                            Your daily attendance is marked by the Front Desk/Admin. For any discrepancies, please contact the HR department or raise a support ticket.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyAttendance;
