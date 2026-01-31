
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, User, Download, FileText, Share2, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_NOTICE_DETAILS } from '../data/mockData';

const NoticeDetailPage = () => {
    const { noticeId } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [isAcknowledging, setIsAcknowledging] = useState(false);
    const [showAckModal, setShowAckModal] = useState(false);

    useEffect(() => {
        const data = MOCK_NOTICE_DETAILS[noticeId] || MOCK_NOTICE_DETAILS[1];
        setNotice(data);
        // Simulate "Mark as Read" logic here
    }, [noticeId]);

    const handleAcknowledge = () => {
        setIsAcknowledging(true);
        setTimeout(() => {
            setNotice(prev => ({
                ...prev,
                ackStatus: new Date().toLocaleDateString()
            }));
            setIsAcknowledging(false);
            setShowAckModal(false);
        }, 1500);
    };

    if (!notice) return <div className="p-10 text-center"><span className="loading loading-spinner text-indigo-600"></span></div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft size={22} className="text-gray-600" />
                </button>
                <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-bold uppercase text-gray-500 tracking-wide">{notice.category}</span>
                    <h1 className="text-sm font-bold text-gray-900 truncate">{notice.title}</h1>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-5">

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{notice.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <User size={14} />
                        <span>{notice.issuedBy}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                    {notice.content}
                </div>

                {/* Attachments */}
                {notice.attachments && notice.attachments.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Attachments</h3>
                        {notice.attachments.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{file.name}</p>
                                        <p className="text-[10px] text-gray-500">{file.size}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-indigo-600">
                                    <Download size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Acknowledgment Section */}
                {notice.requiresAck && (
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        {notice.ackStatus ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                <div className="p-1 bg-green-200 rounded-full text-green-700">
                                    <CheckSquare size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-800">Acknowledged</p>
                                    <p className="text-[10px] font-medium text-green-600">On {notice.ackStatus}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                                <p className="text-xs font-medium text-blue-900 mb-3">
                                    This notice requires your formal acknowledgment that you have read and understood the contents.
                                </p>
                                <button
                                    onClick={() => setShowAckModal(true)}
                                    className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Acknowledge Notice
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </main>

            {/* Acknowledgment Confirm Modal */}
            <AnimatePresence>
                {showAckModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAckModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Action</h3>
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                By acknowledging, you confirm that you have read and understood this notice. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowAckModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm">Cancel</button>
                                <button
                                    onClick={handleAcknowledge}
                                    disabled={isAcknowledging}
                                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm flex justify-center items-center gap-2"
                                >
                                    {isAcknowledging ? 'Saving...' : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default NoticeDetailPage;
