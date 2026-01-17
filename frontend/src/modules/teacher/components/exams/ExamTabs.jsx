import React from 'react';
import { motion } from 'framer-motion';

const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'locked', label: 'Locked' }
];

const ExamTabs = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2 px-1">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`relative px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap z-10 ${isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeExamTab"
                                className="absolute inset-0 bg-gray-900 rounded-full -z-10 shadow-md"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default ExamTabs;
