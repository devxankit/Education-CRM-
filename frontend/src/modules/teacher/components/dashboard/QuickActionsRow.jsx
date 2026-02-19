import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckSquare, UploadCloud, FileBarChart, MessageCircle } from 'lucide-react';
import gsap from 'gsap';

const actions = [
    { label: 'Homework', icon: Plus, bg: 'bg-indigo-100', text: 'text-indigo-600', path: '/teacher/homework' },
    { label: 'Attendance', icon: CheckSquare, bg: 'bg-emerald-100', text: 'text-emerald-600', path: '/teacher/attendance' },
    { label: 'Resources', icon: UploadCloud, bg: 'bg-blue-100', text: 'text-blue-600', path: '/teacher/resources' },
    { label: 'Marks', icon: FileBarChart, bg: 'bg-purple-100', text: 'text-purple-600', path: '/teacher/exams' },
    { label: 'Support', icon: MessageCircle, bg: 'bg-orange-100', text: 'text-orange-600', path: '/teacher/support' },
];

const QuickActionsRow = () => {
    const rowRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!rowRef.current) return;
        const children = rowRef.current.children;
        gsap.fromTo(children,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
        );
        return () => {
            try { gsap.killTweensOf(children); } catch (_) { /* ignore */ }
        };
    }, []);

    return (
        <div className="mb-6 mt-2">
            {/* Horizontal Scroll Layout - Floating Icons */}
            <div ref={rowRef} className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide justify-between">
                {actions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className="flex flex-col items-center gap-2 min-w-[64px] flex-shrink-0 group"
                        >
                            <div className={`w-14 h-14 rounded-[20px] ${action.bg} ${action.text} flex items-center justify-center shadow-sm group-active:scale-95 transition-all duration-200`}>
                                <Icon size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-bold text-gray-600 tracking-tight">
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
