
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Info, Calendar, Book, Award, HeadphonesIcon, Download, ChevronDown, ChevronUp, AlertOctagon, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeeSummaryCard from '../components/fees/FeeSummaryCard';
import { useParentStore } from '../../../store/parentStore';

const ParentFeesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};
    const { childId, highlightPendingFee, tab: initialTab } = state;
    const pendingRef = useRef(null);

    const fees = useParentStore(state => state.fees);

    const [activeTab, setActiveTab] = useState(initialTab === 'history' ? 'Receipts' : 'Structure');
    const [expandedFeeId, setExpandedFeeId] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // 1. Entry Check & Scroll
    useEffect(() => {
        if (!childId) {
            console.warn("No childId provided, redirected in prod.");
        }

        if (highlightPendingFee && pendingRef.current) {
            setTimeout(() => {
                pendingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [childId, highlightPendingFee]);

    // Handlers
    const handleBack = () => navigate(-1);

    const toggleExpand = (id) => {
        setExpandedFeeId(expandedFeeId === id ? null : id);
    };

    const handleQuickAction = (path) => {
        navigate(path, { state: { childId, source: 'fees' } });
    };

    const handleSupportClick = () => {
        navigate('/parent/support', { state: { childId, issueType: 'fees' } });
    };

    const isOverdue = fees.summary.pending > 0;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Fees & Payments</h1>
                </div>
                <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors"
                >
                    <Info size={20} />
                </button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* 2. Summary Card */}
                <FeeSummaryCard summary={fees.summary} />

                {/* 6. Overdue Warning */}
                {isOverdue && (
                    <div ref={pendingRef} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertOctagon className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900">Payment Due</h3>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                You have pending dues of ₹{fees.summary.pending.toLocaleString()}. Please clear them by {fees.summary.nextDue} to avoid late charges.
                            </p>
                            <button
                                onClick={handleSupportClick}
                                className="mt-3 text-xs font-bold text-red-700 underline"
                            >
                                Contact Accounts Office
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {['Structure', 'Receipts'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 3. Fee Breakdown */}
                {activeTab === 'Structure' && (
                    <div className="space-y-3">
                        {fees.breakdown.map(fee => (
                            <div key={fee.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all">
                                <div
                                    onClick={() => toggleExpand(fee.id)}
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                >
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">{fee.head}</p>
                                        <h3 className="text-sm font-bold text-gray-900">₹{fee.total.toLocaleString()}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase mb-1 ${fee.status === 'Paid' ? 'bg-green-50 text-green-700' :
                                            fee.status === 'Overdue' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                                            }`}>
                                            {fee.status}
                                        </span>
                                        <div className="flex items-center gap-1 justify-end text-xs text-gray-500">
                                            {expandedFeeId === fee.id ? 'Hide' : 'Details'}
                                            {expandedFeeId === fee.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </div>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedFeeId === fee.id && (
                                        <motion.div
                                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                            className="bg-gray-50 border-t border-gray-100"
                                        >
                                            {fee.installments.map((inst, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-3 text-xs border-b last:border-0 border-gray-100">
                                                    <div>
                                                        <span className="font-bold text-gray-700 block">{inst.term}</span>
                                                        <span className="text-gray-500">Due: {inst.due}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-bold text-gray-900 block">₹{inst.amount.toLocaleString()}</span>
                                                        <span className={`font-semibold ${inst.status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                                                            {inst.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}

                {/* 5. Receipts */}
                {activeTab === 'Receipts' && (
                    <div className="space-y-3">
                        {fees.receipts.length > 0 ? (
                            fees.receipts.map(rec => (
                                <div key={rec.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">₹{rec.amount.toLocaleString()}</h4>
                                            <p className="text-[10px] text-gray-500">{rec.date} • {rec.mode}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-sm text-gray-500">No payment history available.</p>
                            </div>
                        )}
                    </div>
                )}


                {/* 7. Quick Actions */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Related Actions</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => handleQuickAction('/parent/attendance')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Calendar size={20} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-gray-600">Attendance</span>
                        </button>
                        <button onClick={() => handleQuickAction('/parent/results')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Award size={20} className="text-purple-500" />
                            <span className="text-[10px] font-bold text-gray-600">Results</span>
                        </button>
                        <button onClick={() => handleQuickAction('/parent/support')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <HeadphonesIcon size={20} className="text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-600">Support</span>
                        </button>
                    </div>
                </div>

            </main>

            {/* Info Modal */}
            <AnimatePresence>
                {isInfoModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsInfoModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Fee Policy</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                Fees must be paid by the 10th of every quarter. Late fees of ₹50 per day apply directly after the due date.
                            </p>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                                <h4 className="text-xs font-bold text-gray-700 mb-1">Payment Methods:</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li>• Bank Transfer (NEFT/IMPS)</li>
                                    <li>• Cheque in School Office</li>
                                    <li>• Cash Counter (9 AM - 1 PM)</li>
                                </ul>
                            </div>
                            <button onClick={() => setIsInfoModalOpen(false)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-sm">Got it</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ParentFeesPage;
