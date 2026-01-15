import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileText, Calendar, Info, Clock, CheckCircle2 } from 'lucide-react';

const NoticeCard = ({ notice, onClick }) => {
    const isImportant = notice.priority === 'Important';

    // Icon Logic
    let Icon = Info;
    let bgClass = 'bg-blue-50 text-blue-600';

    if (notice.type === 'Academic') { Icon = FileText; bgClass = 'bg-indigo-50 text-indigo-600'; }
    if (notice.type === 'Fee') { Icon = AlertTriangle; bgClass = 'bg-orange-50 text-orange-600'; }
    if (notice.priority === 'Important') { Icon = AlertTriangle; bgClass = 'bg-red-50 text-red-600'; }

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(notice)}
            className={`group relative bg-white p-4 rounded-xl border mb-3 cursor-pointer shadow-sm transition-all hover:shadow-md ${!notice.read ? 'border-l-4 border-l-primary border-y-gray-100 border-r-gray-100' : 'border-gray-100'
                }`}
        >
            <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className={`p-2.5 rounded-full shrink-0 ${bgClass}`}>
                    <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm font-bold truncate pr-2 ${!notice.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notice.title}
                        </h3>
                        {!notice.read && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>
                        )}
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {notice.content}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">
                            <Clock size={10} /> {notice.date}
                        </span>
                        {isImportant && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                Critical
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NoticeCard;
