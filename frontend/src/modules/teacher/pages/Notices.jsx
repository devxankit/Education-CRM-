import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { ChevronLeft, Filter, AlertCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';

// Data
import { noticesData } from '../data/noticesData';

const NoticeCard = ({ notice, onClick }) => {
    const isUrgent = notice.priority === 'Urgent';

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl border mb-3 cursor-pointer transition-all hover:shadow-md active:scale-98 ${isUrgent ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {notice.priority}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">{new Date(notice.date).toLocaleDateString()}</span>
            </div>
            <h3 className={`text-sm font-bold mb-1 ${isUrgent ? 'text-red-900' : 'text-gray-900'}`}>{notice.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{notice.content}</p>
        </div>
    );
};

const NoticesPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.notice-card', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Admin Notices</h1>
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 pt-4">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Updates</h2>
                </div>

                <div className="space-y-1">
                    {noticesData.map((notice, index) => (
                        <div key={notice.id} className="notice-card">
                            <NoticeCard
                                notice={notice}
                                onClick={() => navigate(`/teacher/notices/${notice.id}`)}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default NoticesPage;
