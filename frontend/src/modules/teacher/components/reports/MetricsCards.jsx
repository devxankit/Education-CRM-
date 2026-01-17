import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={14} className="text-emerald-500" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-gray-400" />;
};

const MetricCard = ({ title, value, unit, trend, insight, icon: Icon, color }) => {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
        >
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600`}>
                    <Icon size={18} />
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                    <TrendIcon trend={trend} />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {value}<span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>
            </h3>
            <p className="text-xs text-gray-500 font-medium mb-2">{title}</p>

            <div className="pt-2 border-t border-gray-50">
                <p className="text-[10px] font-medium text-gray-400">{insight}</p>
            </div>
        </motion.div>
    );
};

const MetricsCards = ({ metrics }) => {
    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            <MetricCard
                title="Avg Attendance"
                value={metrics.attendance.value}
                unit="%"
                trend={metrics.attendance.trend}
                insight={metrics.attendance.insight}
                icon={Users}
                color="emerald"
            />
            <MetricCard
                title="Homework Done"
                value={metrics.homework.value}
                unit="%"
                trend={metrics.homework.trend}
                insight={metrics.homework.insight}
                icon={BookOpen}
                color="blue"
            />
            <MetricCard
                title="Exam Avg"
                value={metrics.exams.value}
                unit="%"
                trend={metrics.exams.trend}
                insight={metrics.exams.insight}
                icon={GraduationCap}
                color="purple"
            />
            <MetricCard
                title="At Risk"
                value={metrics.atRisk.value}
                unit=""
                trend={metrics.atRisk.trend}
                insight={metrics.atRisk.insight}
                icon={AlertTriangle}
                color="orange"
            />
        </div>
    );
};

export default MetricsCards;
