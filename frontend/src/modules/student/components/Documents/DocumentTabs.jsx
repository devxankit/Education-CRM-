import React from 'react';
import { motion } from 'framer-motion';

const DocumentTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="flex space-x-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm mb-6 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none whitespace-nowrap min-w-[80px]"
                    style={{
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    {activeTab === tab && (
                        <motion.div
                            layoutId="activeTabDocs"
                            className="absolute inset-0 bg-gray-900 rounded-lg shadow-sm"
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                    )}
                    <span className={`relative z-10 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                        {tab}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default DocumentTabs;
