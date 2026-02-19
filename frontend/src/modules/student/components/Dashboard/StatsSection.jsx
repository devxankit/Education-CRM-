import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp, CalendarCheck, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, subtext, icon: Icon, colorClass, link }) => {
    const displayValue = value !== undefined && value !== null && value !== '' ? String(value) : null;
    return (
        <Link to={link || '#'} className="block h-full">
            <motion.div
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.97 }}
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between"
            >
                <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded-xl ${colorClass.bg} ${colorClass.text}`}>
                        <Icon size={18} />
                    </div>
                    {displayValue != null && <span className="text-xl font-bold text-gray-800">{displayValue}</span>}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
                    {subtext != null && subtext !== '' && <p className="text-[10px] text-gray-400 font-medium mt-1">{subtext}</p>}
                </div>
            </motion.div>
        </Link>
    );
};

const AttendanceCard = ({ data }) => {
    const percentage = data?.percentage != null ? data.percentage : null;
    const status = (data?.status != null && data.status !== '') ? data.status : 'Track';
    return (
        <Link to="/student/attendance" className="block h-full">
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
                <div className="flex justify-between items-center z-10 relative">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600">Attendance</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{percentage != null ? `${percentage}%` : '—'}</p>
                        <p className="text-[10px] font-medium inline-block px-1.5 py-0.5 rounded mt-1 bg-gray-100 text-gray-600">
                            {status}
                        </p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-[6px] border-indigo-50 border-t-primary border-r-primary rotate-45"></div>
                </div>
            </div>
        </Link>
    );
};

const StatsSection = ({ stats }) => {
    return (
        <div className="px-4 pb-4 max-w-md mx-auto grid grid-cols-2 gap-3">
            {/* Homework Card */}
            <StatsCard
                title="Homework"
                value={stats?.homework?.pending != null ? stats.homework.pending : null}
                subtext={stats?.homework?.nextDue ?? undefined}
                icon={Clock}
                colorClass={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                link={stats?.homework?.link || '/student/homework'}
            />

            {/* Attendance Card - Custom Layout */}
            <AttendanceCard data={stats?.attendance} />

            {/* Exams Card */}
            <StatsCard
                title="Next Exam"
                value={stats?.exams?.daysLeft != null ? `${stats.exams.daysLeft}d` : null}
                subtext={stats?.exams?.nextExam ?? undefined}
                icon={TrendingUp}
                colorClass={{ bg: 'bg-purple-50', text: 'text-purple-600' }}
                link={stats?.exams?.link || '/student/exams'}
            />

            {/* My Notes */}
            <StatsCard
                title="My Notes"
                value={stats?.myNotes?.count != null ? stats.myNotes.count : null}
                subtext="Personal notes"
                icon={FileText}
                colorClass={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
                link={stats?.myNotes?.link || '/student/notes'}
            />
        </div>
    );
};

export default StatsSection;
