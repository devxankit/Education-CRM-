import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Download, FileText, CheckSquare, User, Clock } from 'lucide-react';

const NoticeDetail = ({ notice, onClose, onAcknowledge }) => {
    if (!notice) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-bold text-gray-800">Notice Details</h2>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto custom-scrollbar">
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                            <User size={14} />
                            <span>Issued by: <span className="font-semibold text-gray-700">{notice.issuedBy}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                            <Calendar size={14} />
                            <span>{notice.date}</span>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{notice.title}</h1>

                    <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-line mb-8">
                        {notice.content}
                    </div>

                    {/* Attachments */}
                    {notice.attachments && notice.attachments.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Attachments</h4>
                            {notice.attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{file.name}</p>
                                            <p className="text-[10px] text-gray-400">{file.size}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Acknowledgement */}
                    {notice.requiresAcknowledgement && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex gap-2">
                                <CheckSquare size={18} className="text-yellow-700 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-800 font-medium leading-relaxed">
                                    This is an important circular. Please acknowledge that you have read and understood the instructions.
                                </p>
                            </div>
                            <button
                                onClick={() => onAcknowledge && onAcknowledge(notice.id)}
                                className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-700 active:scale-[0.98] text-white text-sm font-bold rounded-lg transition-all shadow-sm"
                            >
                                I Acknowledge
                            </button>
                        </div>
                    )}
                    {/* Action Button */}
                    {notice.actionLink && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    onClose();
                                    // Assuming parent or context provides navigation, but since this is a modal 
                                    // often used inside a page, we might need to pass navigate or use window.location
                                    // Using window.location for safety unless we import useNavigate
                                    window.location.href = notice.actionLink;
                                }}
                                className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                {notice.actionLabel || 'View Details'}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NoticeDetail;
