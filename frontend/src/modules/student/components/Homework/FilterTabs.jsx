import React from 'react';
import { motion } from 'framer-motion';

const tabs = ['All', 'Pending', 'Submitted'];

const FilterTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 relative">
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 relative py-2 text-sm font-medium transition-colors z-10 ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                        {isActive && (
                            <motion.div
                                layoutId="activeHomeworkTab"
                                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                style={{ zIndex: -1 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default FilterTabs;
