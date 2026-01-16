import React, { useRef, useEffect } from 'react';
import { AlertCircle, Calendar, Info } from 'lucide-react';
import gsap from 'gsap';

const AdminNoticeCard = ({ notices }) => {
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [notices]);

    return (
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Admin Notices</h3>
            <div ref={listRef} className="flex gap-4 min-w-max px-1">
                {notices.map((notice) => (
                    <div
                        key={notice.id}
                        className={`w-72 p-4 rounded-xl border ${notice.priorityColor} bg-white shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-shadow`}
                    >
                        {/* Decorative Icon BG */}
                        <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                            {notice.type === 'Urgent' ? <AlertCircle size={80} /> : <Info size={80} />}
                        </div>

                        <div className="flex items-start justify-between relative z-10">
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/60 border border-black/5`}>
                                {notice.type}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                                <Calendar size={10} /> {new Date(notice.date).toLocaleDateString()}
                            </span>
                        </div>

                        <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1 relative z-10 mt-1">
                            {notice.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed relative z-10">
                            {notice.message}
                        </p>

                        <button className="text-[10px] font-bold text-gray-900 mt-2 self-start border-b border-gray-300 hover:border-gray-900 transition-colors">
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminNoticeCard;
