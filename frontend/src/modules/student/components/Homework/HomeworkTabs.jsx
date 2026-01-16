import React from 'react';
import { motion } from 'framer-motion';

const HomeworkTabs = ({ tabs, activeTab, setActiveTab, counts }) => {
    return (
        <div className="flex space-x-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm mb-6 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
                const count = counts ? counts[tab.toLowerCase()] : 0;
                return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all focus:outline-none whitespace-nowrap flex-1`}
                        style={{
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTabHomework"
                                className="absolute inset-0 bg-gray-900 rounded-lg shadow-sm"
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                        )}
                        <span className={`relative z-10 transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                            {tab}
                        </span>

                        {(tab === 'Pending' || tab === 'Overdue') && count > 0 && (
                            <span className={`relative z-10 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] rounded-full border border-white/20 
                                ${activeTab === tab
                                    ? 'bg-white text-gray-900'
                                    : tab === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default HomeworkTabs;
