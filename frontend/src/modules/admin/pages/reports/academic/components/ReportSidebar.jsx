
import React from 'react';
import {
    PieChart,
    BarChart,
    LineChart,
    Users,
    GraduationCap,
    TrendingUp,
    Briefcase
} from 'lucide-react';

const ReportSidebar = ({ activeCategory, activeReport, onSelect }) => {

    const menu = [
        {
            id: 'ATTENDANCE',
            label: 'Attendance Reports',
            icon: Users,
            items: [
                { id: 'att_summary', label: 'Overall Summary' },
                { id: 'att_class', label: 'Class-wise Report' },
                { id: 'att_chronic', label: 'Chronic Absenteeism' }
            ]
        },
        {
            id: 'EXAMS',
            label: 'Examination Reports',
            icon: GraduationCap,
            items: [
                { id: 'exam_summary', label: 'Result Summary' },
                { id: 'exam_subject', label: 'Subject Performance' },
                { id: 'exam_toppers', label: 'Rank List' }
            ]
        },
        {
            id: 'PERFORMANCE',
            label: 'Performance Analysis',
            icon: TrendingUp,
            items: [
                { id: 'perf_trends', label: 'Trend Analysis' },
                { id: 'perf_teacher', label: 'Teacher Impact' }
            ]
        },
        {
            id: 'WORKLOAD',
            label: 'Teacher Workload',
            icon: Briefcase,
            items: [
                { id: 'work_load', label: 'Load Summary' }
            ]
        }
    ];

    return (
        <div className="w-full md:w-64 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-fit shrink-0">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">Report Categories</h3>
            </div>
            <div className="p-2 space-y-1">
                {menu.map(cat => (
                    <div key={cat.id} className="mb-2">
                        <div className={`
                            px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wide flex items-center gap-2 mb-1
                            ${activeCategory === cat.id ? 'text-indigo-600' : 'text-gray-500'}
                         `}>
                            <cat.icon size={14} /> {cat.label}
                        </div>
                        <div className="space-y-0.5 ml-2 border-l-2 border-gray-100 pl-2">
                            {cat.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => onSelect(cat.id, item.id)}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-md text-sm transition-all
                                        ${activeReport === item.id
                                            ? 'bg-indigo-50 text-indigo-700 font-bold border-l-2 border-indigo-500 rounded-l-none'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportSidebar;
