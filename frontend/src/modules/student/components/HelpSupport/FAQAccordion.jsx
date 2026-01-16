import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const FAQAccordion = ({ data }) => {
    const [openIndex, setOpenIndex] = useState(null);

    /* Flattening FAQ structure for simple list view if needed, or grouped. Grouped used here. */

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Frequently Asked Questions</h3>
                <Search size={16} className="text-gray-400" />
            </div>

            <div className="divide-y divide-gray-50">
                {data.map((section, catIdx) => (
                    <div key={catIdx}>
                        {/* Category Header */}
                        <div className="bg-gray-50/50 px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {section.category}
                        </div>

                        {section.questions.map((item, qIdx) => {
                            const index = `${catIdx}-${qIdx}`;
                            const isOpen = openIndex === index;

                            return (
                                <div key={index} className="bg-white">
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 focus:outline-none"
                                    >
                                        <span className={`text-xs font-semibold ${isOpen ? 'text-indigo-600' : 'text-gray-700'}`}>
                                            {item.q}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-4 pb-4 pt-0 text-xs text-gray-500 leading-relaxed">
                                                    {item.a}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQAccordion;
