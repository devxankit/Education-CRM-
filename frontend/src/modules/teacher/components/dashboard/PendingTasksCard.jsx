import React from 'react';
import { AlertTriangle, BookOpen, MessageSquare, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
    'attendance': ClipboardCheck,
    'homework': BookOpen,
    'query': MessageSquare,
    'default': AlertTriangle
};

const PendingTasksCard = ({ actions }) => {
    return (
        <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Actions Pending</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, idx) => {
                    const Icon = iconMap[action.type] || iconMap['default'];
                    return (
                        <motion.button
                            key={action.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-start gap-2 hover:shadow-md hover:border-gray-200 transition-all text-left active:scale-95"
                        >
                            <div className={`p-2 rounded-lg ${action.color} mb-1`}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-800 leading-tight mb-0.5">{action.title}</h4>
                                <p className="text-[10px] text-gray-500 font-medium">{action.count} Items pending</p>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 mt-1">Resolve Now →</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default PendingTasksCard;
