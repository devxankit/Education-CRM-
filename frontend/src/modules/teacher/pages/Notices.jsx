import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { ChevronLeft, Loader2, FileText } from 'lucide-react';
import gsap from 'gsap';
import { useTeacherStore } from '../../../store/teacherStore';

const NoticeCard = ({ notice, onClick }) => {
    const isUrgent = notice.priority === 'Urgent' || notice.priority === 'High';

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl border mb-3 cursor-pointer transition-all hover:shadow-md active:scale-98 ${isUrgent ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {notice.priority || 'Normal'}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}
                </span>
            </div>
            <h3 className={`text-sm font-bold mb-1 ${isUrgent ? 'text-red-900' : 'text-gray-900'}`}>{notice.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{notice.content}</p>
        </div>
    );
};

const NoticesPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Store
    const dashboardData = useTeacherStore(state => state.dashboardData);
    const fetchDashboard = useTeacherStore(state => state.fetchDashboard);
    const isFetchingDashboard = useTeacherStore(state => state.isFetchingDashboard);

    // Fetch dashboard data if not available
    useEffect(() => {
        if (!dashboardData) {
            fetchDashboard();
        }
    }, [dashboardData, fetchDashboard]);

    const notices = dashboardData?.recentNotices || [];

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
        if (notices.length > 0) {
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
            return () => {
                try { ctx.revert(); } catch (_) { /* ignore DOM errors on unmount */ }
            };
        }
    }, [notices]);

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

                {isFetchingDashboard && notices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                        <p className="text-sm text-gray-500">Loading notices...</p>
                    </div>
                ) : notices.length > 0 ? (
                    <div className="space-y-1">
                        {notices.map((notice) => (
                            <div key={notice._id} className="notice-card">
                                <NoticeCard
                                    notice={notice}
                                    onClick={() => navigate(`/teacher/notices/${notice._id}`)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <FileText className="mx-auto text-gray-300 mb-3" size={40} />
                        <p className="text-sm text-gray-400 font-medium">No notices available</p>
                        <p className="text-xs text-gray-300 mt-1">Check back later for updates</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NoticesPage;
