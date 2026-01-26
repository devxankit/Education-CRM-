import React from 'react';
import {
    Users,
    CalendarClock,
    Briefcase,
    FileCheck,
    IndianRupee,
    UserPlus,
    ChevronRight
} from 'lucide-react';

const categories = [
    { id: 'attendance', label: 'Staff Attendance', icon: CalendarClock, desc: 'Daily logs, trends & absenteeism' },
    { id: 'leave', label: 'Leave & Absence', icon: Briefcase, desc: 'Balance, utilization & types' },
    { id: 'strength', label: 'Strength & Distribution', icon: Users, desc: 'Headcount, gender & ratios' },
    { id: 'compliance', label: 'Contract & Compliance', icon: FileCheck, desc: 'Expiries, probation & docs' },
    { id: 'payroll', label: 'Payroll & Cost', icon: IndianRupee, desc: 'Cost summary & trends' },
    { id: 'turnover', label: 'Joiners & Exits', icon: UserPlus, desc: 'Hiring, attrition & turnover' }
];

const HRReportSidebar = ({ activeCategory, onSelect }) => {
    return (
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-full min-h-[500px]">
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Report Categories</h3>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const Icon = cat.icon;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            className={`
                                w-full flex items-start text-left gap-3 px-3 py-3 rounded-lg transition-colors group
                                ${isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            <Icon
                                size={18}
                                className={`mt-0.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium block">{cat.label}</span>
                                <span className={`text-xs block mt-0.5 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`}>
                                    {cat.desc}
                                </span>
                            </div>
                            {isActive && <ChevronRight size={16} className="text-indigo-400 mt-1" />}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                    Confidential & Read-Only Access
                </div>
            </div>
        </div>
    );
};

export default HRReportSidebar;
