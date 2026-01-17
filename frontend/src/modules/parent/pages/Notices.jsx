
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Info, Calendar, Filter, Bell, HeadphonesIcon, Home, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NoticeCard from '../components/notices/NoticeCard';

// MOCK DATA
const MOCK_NOTICES = [
    {
        id: 1,
        title: 'Annual Sports Day 2023',
        category: 'Event',
        date: '2023-10-18',
        isNew: true,
        isImportant: true,
        requiresAck: false,
        isRead: false
    },
    {
        id: 2,
        title: 'Revised Fee Structure',
        category: 'Fee',
        date: '2023-10-15',
        isNew: false,
        isImportant: true,
        requiresAck: true,
        isRead: false
    },
    {
        id: 3,
        title: 'Winter Uniform Mandatory',
        category: 'General',
        date: '2023-10-10',
        isNew: false,
        isImportant: false,
        requiresAck: false,
        isRead: true
    },
    {
        id: 4,
        title: 'Parent-Teacher Meeting',
        category: 'Academic',
        date: '2023-10-05',
        isNew: false,
        isImportant: true,
        requiresAck: true,
        isRead: true
    }
];

const ParentNoticesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};
    const { childId, highlightImportant } = state;
    const importantRef = useRef(null);

    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // 1. Entry Check & Scroll
    useEffect(() => {
        if (!childId) {
            console.warn("No childId provided, redirecting in prod.");
            // navigate('/parent/dashboard');
        }

        if (highlightImportant && importantRef.current) {
            setTimeout(() => {
                importantRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [childId, highlightImportant, navigate]);

    // Handlers
    const handleBack = () => navigate(-1);

    // 2. Filter Logic
    const filteredNotices = MOCK_NOTICES.filter(notice => {
        const matchesTab =
            activeTab === 'All' ? true :
                activeTab === 'Important' ? notice.isImportant :
                    activeTab === 'Unread' ? !notice.isRead :
                        activeTab === 'Requires Action' ? notice.requiresAck : true;

        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    // 3. Navigation to Details
    const handleNoticeClick = (id) => {
        navigate(`/parent/notices/${id}`, { state: { childId, source: 'notices_list' } });
    };

    const handleQuickAction = (path) => {
        navigate(path, { state: { childId, source: 'notices' } });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Notice Board</h1>
                </div>
                <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors"
                >
                    <Info size={20} />
                </button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-5">

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {['All', 'Important', 'Unread', 'Requires Action'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[30%] py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Notices List */}
                <div className="space-y-3">
                    {filteredNotices.length > 0 ? (
                        filteredNotices.map(notice => (
                            <div key={notice.id} ref={notice.isImportant ? importantRef : null}>
                                <NoticeCard
                                    notice={notice}
                                    onClick={() => handleNoticeClick(notice.id)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bell size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">No Notices Found</h3>
                            <p className="text-xs text-gray-500 mt-1">Try changing the filter or search term.</p>
                        </div>
                    )}
                </div>

                {/* 6. Quick Actions */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Related Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleQuickAction('/parent/dashboard')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Home size={20} className="text-indigo-500" />
                            <span className="text-[10px] font-bold text-gray-600">Home</span>
                        </button>
                        <button onClick={() => handleQuickAction('/parent/support')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <HeadphonesIcon size={20} className="text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-600">Support</span>
                        </button>
                    </div>
                </div>

            </main>

            {/* Info Modal */}
            <AnimatePresence>
                {isInfoModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsInfoModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Notice Guidelines</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                Please check notices regularly. Some notices marked "Requires Action" need your explicit acknowledgment.
                            </p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <span className="text-xs font-semibold text-gray-700">Important: High priority updates.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center bg-blue-50 text-blue-600 text-[10px] font-bold">ACK</span>
                                    <span className="text-xs font-semibold text-gray-700">Acknowledgement Required.</span>
                                </li>
                            </ul>
                            <button onClick={() => setIsInfoModalOpen(false)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-sm">Got it</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ParentNoticesPage;
