import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle } from 'lucide-react';

// Components
import FeeSummaryCard from '../components/Fees/FeeSummaryCard';
import PaymentActionCard from '../components/Fees/PaymentActionCard';
import { FeeBreakdownList, PaymentHistory } from '../components/Fees/FeeLists';
import InfoTooltip from '../components/Attendance/InfoTooltip';

// Data
import { feesData } from '../data/feesData';

const FeesPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Initial Load & Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Simulate Fetch
        setTimeout(() => {
            setData(feesData);
            setLoading(false);
        }, 800);

        return () => lenis.destroy();
    }, []);

    const handlePaymentSuccess = (amount) => {
        setShowSuccessModal(true);
        // In real app, re-fetch data here
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h1 className="text-lg font-bold text-gray-900">Fees & Payments</h1>

                    <InfoTooltip
                        content={
                            <div className="space-y-2">
                                <p className="font-bold border-b border-gray-100 pb-1">Fee Policy</p>
                                <p>1. Late fee of ₹50/day applicable after due date.</p>
                                <p>2. Online payments reflect instantly.</p>
                                <p>3. Keep receipts for future reference.</p>
                            </div>
                        }
                    >
                        <button className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                            <Info size={20} />
                        </button>
                    </InfoTooltip>
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-6 pb-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-sm text-gray-500 font-medium">Loading Financials...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ staggerChildren: 0.1 }}
                    >
                        <FeeSummaryCard summary={data.summary} />

                        {data.summary.pendingAmount > 0 && (
                            <PaymentActionCard
                                pendingAmount={data.summary.pendingAmount}
                                config={data.paymentAction}
                                onPay={handlePaymentSuccess}
                            />
                        )}

                        <FeeBreakdownList breakdown={data.breakdown} />

                        <PaymentHistory history={data.history} />
                    </motion.div>
                )}
            </main>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowSuccessModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                            <p className="text-gray-500 mb-6">Your transaction has been processed. The receipt has been sent to your email.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Done
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeesPage;
