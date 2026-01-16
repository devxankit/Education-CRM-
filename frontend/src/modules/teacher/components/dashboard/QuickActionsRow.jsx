import React, { useRef, useEffect } from 'react';
import { Plus, CheckSquare, UploadCloud, Edit3, MessageCircle } from 'lucide-react';
import gsap from 'gsap';

const actions = [
    { label: 'Create Homework', icon: Plus, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Mark Attendance', icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Upload Materials', icon: UploadCloud, color: 'bg-blue-50 text-blue-600' },
    { label: 'Enter Marks', icon: Edit3, color: 'bg-purple-50 text-purple-600' },
    { label: 'Student Queries', icon: MessageCircle, color: 'bg-orange-50 text-orange-600' },
];

const QuickActionsRow = () => {
    const rowRef = useRef(null);

    useEffect(() => {
        if (rowRef.current) {
            gsap.from(rowRef.current.children, {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.7)',
                delay: 0.4
            });
        }
    }, []);

    return (
        <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Quick Actions</h3>
            <div ref={rowRef} className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
                {actions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={idx}
                            className="flex flex-col items-center gap-2 group min-w-[80px]"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-transparent group-hover:border-gray-200 group-hover:shadow-md transition-all active:scale-90 ${action.color}`}>
                                <Icon size={24} strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 text-center leading-tight group-hover:text-gray-900">
                                {action.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActionsRow;
