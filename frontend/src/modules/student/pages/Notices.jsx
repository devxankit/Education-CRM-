import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { BellOff } from 'lucide-react';
import gsap from 'gsap';

// Components
import PageHeader from '../components/Academics/PageHeader';
import BottomNav from '../components/Dashboard/BottomNav';
import NoticeFilterTabs from '../components/Notices/NoticeFilterTabs';
import NoticeCard from '../components/Notices/NoticeCard';
import NoticeDetail from '../components/Notices/NoticeDetail';

// Data
import { notices } from '../data/noticesData';

const Notices = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [filteredNotices, setFilteredNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const listRef = useRef(null);

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // Filter Logic
    useEffect(() => {
        let filtered = notices;
        if (activeTab !== 'All') {
            filtered = notices.filter(n =>
                activeTab === 'Important' ? n.priority === 'Important' : n.type === activeTab
            );
        }
        setFilteredNotices(filtered);

        // Stagger animation on filter change
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, clearProps: 'all' }
            );
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            <PageHeader title="Notices" />

            <main className="px-4 pt-2 max-w-md mx-auto">
                <NoticeFilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div ref={listRef} className="pb-10">
                    {filteredNotices.length > 0 ? (
                        filteredNotices.map((notice) => (
                            <NoticeCard
                                key={notice.id}
                                notice={notice}
                                onClick={setSelectedNotice}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                            <BellOff size={40} className="text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-600">No notices found</p>
                            <p className="text-xs text-gray-500">Check back later for updates</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Detail View */}
            <AnimatePresence>
                {selectedNotice && (
                    <NoticeDetail
                        notice={selectedNotice}
                        onClose={() => setSelectedNotice(null)}
                    />
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
};

export default Notices;
