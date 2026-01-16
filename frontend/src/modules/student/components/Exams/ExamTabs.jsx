import React from 'react';
import { motion } from 'framer-motion';

const ExamTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="flex space-x-2 bg-gray-100/50 p-1.5 rounded-xl border border-gray-100 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all focus:outline-none"
                    style={{
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    {activeTab === tab && (
                        <motion.div
                            layoutId="activeTabExams"
                            className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200"
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                    )}
                    <span className={`relative z-10 ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                        {tab}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ExamTabs;
