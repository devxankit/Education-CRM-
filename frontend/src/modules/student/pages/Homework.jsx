import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';

// Components
import PageHeader from '../components/Academics/PageHeader'; // Reusing header
import BottomNav from '../components/Dashboard/BottomNav';
import FilterTabs from '../components/Homework/FilterTabs';
import HomeworkCard from '../components/Homework/HomeworkCard';

// Data
import { homeworkList } from '../data/homeworkData';

const Homework = () => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [filteredList, setFilteredList] = useState([]);

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
        if (activeTab === 'All') {
            setFilteredList(homeworkList);
        } else {
            setFilteredList(homeworkList.filter(item => item.status === activeTab));
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            <PageHeader title="Homework" />

            <main className="px-4 pt-2 max-w-md mx-auto">

                {/* Filter Tabs */}
                <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* List */}
                <div className="space-y-1">
                    <AnimatePresence mode='wait'>
                        {filteredList.length > 0 ? (
                            filteredList.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <HomeworkCard item={item} onClick={(i) => console.log('Open', i)} />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <div className="bg-gray-100 p-4 rounded-full inline-block mb-3 text-gray-400">
                                    <Inbox size={32} />
                                </div>
                                <h3 className="text-gray-900 font-bold">No homework found</h3>
                                <p className="text-xs text-gray-500 mt-1">Great job! You are all caught up.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </main>

            <BottomNav />
        </div>
    );
};

export default Homework;
