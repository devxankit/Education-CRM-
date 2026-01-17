
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User } from 'lucide-react';

const ChildSelector = ({ children, selectedChildId, onSelect }) => {
    // Basic dropdown or horizontal list logic. For < 3 children, horizontal toggle is better.
    // For simplicity and mobile-first, let's use a horizontal scroll lists.

    return (
        <div className="px-4 py-4 bg-white">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Children</h2>
            <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {children.map(child => {
                    const isSelected = selectedChildId === child.id;
                    return (
                        <button
                            key={child.id}
                            onClick={() => onSelect(child.id)}
                            className={`flex items-center gap-3 p-2 pr-4 rounded-xl border transition-all flex-shrink-0 ${isSelected
                                ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-100'
                                : 'bg-white border-gray-100 grayscale opacity-70'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-white bg-indigo-200' : 'border-gray-50 bg-gray-100'}`}>
                                <User size={20} className={isSelected ? 'text-indigo-700' : 'text-gray-400'} />
                            </div>
                            <div className="text-left">
                                <h3 className={`text-sm font-bold ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {child.name}
                                </h3>
                                <p className="text-[10px] font-medium text-gray-500">
                                    Class {child.class}-{child.section}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ChildSelector;
