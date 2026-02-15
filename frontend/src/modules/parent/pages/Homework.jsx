
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Info, Search, Filter, Calendar, Book, Award, HeadphonesIcon, AlertCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeworkCard from '../components/homework/HomeworkCard';
import { useParentStore } from '../../../store/parentStore';

const ParentHomeworkPage = () => {
    const navigate = useNavigate();
    const logout = useParentStore(state => state.logout);
    const location = useLocation();
    const state = location.state || {};
    const { childId, filter: initialFilter } = state;
    const homework = useParentStore(state => state.homework);
    const fetchHomework = useParentStore(state => state.fetchHomework);
    const isLoading = useParentStore(state => state.isLoading);
    const selectedChildIdStore = useParentStore(state => state.selectedChildId);

    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // 1. Entry Check & Filter Init
    useEffect(() => {
        const idToUse = childId || selectedChildIdStore;
        if (idToUse) {
            fetchHomework(idToUse);
        }

        if (initialFilter) {
            const map = { 'pending': 'Pending', 'completed': 'Submitted', 'late': 'Late' };
            if (map[initialFilter]) setActiveTab(map[initialFilter]);
        }
    }, [childId, selectedChildIdStore, initialFilter, fetchHomework]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Fetching homework assignments...</p>
                </div>
            </div>
        );
    }

    // Handlers
    const handleBack = () => navigate(-1);

    const handleLogout = () => {
        logout();
        navigate('/parent/login');
    };

    // 2. Tab filtering logic
    const filteredHomework = homework.filter(hw => {
        const matchesTab = activeTab === 'All' || hw.status === activeTab;
        const matchesSearch = hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hw.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const pendingCount = homework.filter(h => h.status === 'Pending' || h.status === 'Late').length;

    // 3. Navigation to Details
    const handleHomeworkClick = (id) => {
        navigate(`/parent/homework/${id}`, { state: { childId, source: 'homework_list' } });
    };

    const handleQuickAction = (path) => {
        navigate(path, { state: { childId, source: 'homework' } });
    };

    const handleSupportClick = () => {
        navigate('/parent/support', { state: { childId, issueType: 'homework' } });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Homework</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsInfoModalOpen(true)}
                        className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors"
                    >
                        <Info size={20} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* 6. Warning Banner */}
                {pendingCount > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900">Incomplete Tasks</h3>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {pendingCount} assignments are pending or late. Please ensure timely completion.
                            </p>
                        </div>
                        <button
                            onClick={handleSupportClick}
                            className="text-xs font-bold text-amber-700 bg-white border border-amber-200 px-3 py-1.5 rounded-lg whitespace-nowrap"
                        >
                            Help
                        </button>
                    </div>
                )}

                {/* Sub-Header & Search */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {/* 2. Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {['All', 'Pending', 'Submitted', 'Late'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[30%] py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 3. Homework List */}
                <div className="space-y-3">
                    {filteredHomework.length > 0 ? (
                        filteredHomework.map(hw => (
                            <HomeworkCard
                                key={hw.id}
                                homework={hw}
                                onClick={() => handleHomeworkClick(hw.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Book size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">No Homework Found</h3>
                            <p className="text-xs text-gray-500 mt-1">Try changing the filter or search term.</p>
                        </div>
                    )}
                </div>

                {/* 7. Quick Actions */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Related Actions</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => handleQuickAction('/parent/attendance')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Calendar size={20} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-gray-600">Attendance</span>
                        </button>
                        <button onClick={() => handleQuickAction('/parent/exams')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Award size={20} className="text-purple-500" />
                            <span className="text-[10px] font-bold text-gray-600">Results</span>
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
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Homework Status</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                Monitor your child's daily assignments here.
                            </p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                    <span className="text-xs font-semibold text-gray-700">Pending: Assigned but not submitted.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs font-semibold text-gray-700">Submitted: Completed by student.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    <span className="text-xs font-semibold text-gray-700">Late: Missed due date.</span>
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

export default ParentHomeworkPage;
