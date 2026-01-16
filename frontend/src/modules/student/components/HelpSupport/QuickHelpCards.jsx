import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { CalendarX, FileWarning, CreditCard, UserCog, HelpCircle } from 'lucide-react';

const quickOptions = [
    { icon: CalendarX, label: "Attendance Issue", category: "Attendance Issue", color: "text-orange-600 bg-orange-50" },
    { icon: FileWarning, label: "Homework Issue", category: "Homework Submission Issue", color: "text-purple-600 bg-purple-50" },
    { icon: CreditCard, label: "Payment Issue", category: "Fees / Payment Issue", color: "text-emerald-600 bg-emerald-50" },
    { icon: UserCog, label: "Profile Update", category: "Profile Correction", color: "text-blue-600 bg-blue-50" },
];

const QuickHelpCards = ({ onSelectCategory }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, []);

    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">Common Issues</h3>
            <div ref={containerRef} className="grid grid-cols-2 gap-3">
                {quickOptions.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelectCategory(opt.category)}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:border-indigo-100 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <div className={`p-2.5 rounded-full ${opt.color}`}>
                            <opt.icon size={20} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickHelpCards;
