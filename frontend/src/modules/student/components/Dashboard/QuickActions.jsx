import React from 'react';
import { FileText, Award, CalendarCheck, CreditCard, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
    { icon: FileText, label: 'Homework', path: '/student/homework', color: 'text-blue-600 bg-blue-50' },
    { icon: Award, label: 'Exams', path: '/student/exams', color: 'text-purple-600 bg-purple-50' },
    { icon: CalendarCheck, label: 'Attendance', path: '/student/attendance', color: 'text-emerald-600 bg-emerald-50' },
    { icon: CreditCard, label: 'Fees', path: '/student/fees', color: 'text-orange-600 bg-orange-50' },
    { icon: FolderOpen, label: 'Material', path: '/student/materials', color: 'text-pink-600 bg-pink-50' },
];

const QuickActions = () => {
    return (
        <div className="py-2">
            <div className="flex justify-between px-6 max-w-md mx-auto">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <Link key={index} to={action.path} className="flex flex-col items-center gap-2 group">
                            <div className={`p-3.5 rounded-full shadow-sm transition-transform active:scale-95 duration-200 ${action.color}`}>
                                <Icon size={22} className="stroke-[2px]" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-600 group-hover:text-primary transition-colors">
                                {action.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;
