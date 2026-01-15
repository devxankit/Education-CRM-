import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp, CalendarCheck, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, subtext, icon: Icon, colorClass, link }) => (
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
                {value && <span className="text-xl font-bold text-gray-800">{value}</span>}
            </div>
            <div>
                <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
                {subtext && <p className="text-[10px] text-gray-400 font-medium mt-1">{subtext}</p>}
            </div>
        </motion.div>
    </Link>
);

const AttendanceCard = ({ data }) => (
    <Link to="/student/attendance" className="block h-full">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
            <div className="flex justify-between items-center z-10 relative">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600">Attendance</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{data?.percentage}%</p>
                    <p className={`text-[10px] font-medium inline-block px-1.5 py-0.5 rounded mt-1 bg-gray-100 text-gray-600`}>
                        {data?.status || 'Track'}
                    </p>
                </div>
                <div className="w-16 h-16 rounded-full border-[6px] border-indigo-50 border-t-primary border-r-primary rotate-45"></div>
            </div>
        </div>
    </Link>
);

const StatsSection = ({ stats }) => {
    return (
        <div className="px-4 pb-4 max-w-md mx-auto grid grid-cols-2 gap-3">
            {/* Homework Card */}
            <StatsCard
                title="Homework"
                value={stats?.homework?.pending}
                subtext={stats?.homework?.nextDue}
                icon={Clock}
                colorClass={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                link={stats?.homework?.link}
            />

            {/* Attendance Card - Custom Layout */}
            <AttendanceCard data={stats?.attendance} />

            {/* Exams Card */}
            <StatsCard
                title="Next Exam"
                value={`${stats?.exams?.daysLeft}d`}
                subtext={stats?.exams?.nextExam}
                icon={TrendingUp}
                colorClass={{ bg: 'bg-purple-50', text: 'text-purple-600' }}
                link={stats?.exams?.link}
            />

            {/* Materials */}
            <StatsCard
                title="New Notes"
                value={stats?.materials?.newCount}
                subtext="Added this week"
                icon={BookOpen}
                colorClass={{ bg: 'bg-pink-50', text: 'text-pink-600' }}
                link={stats?.materials?.link}
            />
        </div>
    );
};

export default StatsSection;
