import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { Info, Building2 } from 'lucide-react';

// Components
import FeeSummaryCard from '../components/Fees/FeeSummaryCard';
import { FeeBreakdownList, PaymentHistory } from '../components/Fees/FeeLists';
import InfoTooltip from '../components/Attendance/InfoTooltip';

// Data Service
import { useStudentStore } from '../../../store/studentStore';

const FeesPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const fees = useStudentStore(state => state.fees);
    const fetchFees = useStudentStore(state => state.fetchFees);
    const [loading, setLoading] = useState(!fees);

    // Initial Load
    useEffect(() => {
        fetchFees().finally(() => setLoading(false));
    }, [fetchFees]);

    // Format Data – map backend structure to UI format
    // Backend returns: { summary: { totalFee, totalPaid, balance }, payments: [...], structure: { components, totalAmount } }
    const formattedData = fees ? (() => {
        // Handle case where API returns payments array directly
        const isPaymentsArray = Array.isArray(fees);
        const summary = isPaymentsArray ? {} : (fees.summary ?? {});
        const payments = isPaymentsArray ? fees : (fees.payments ?? []);
        const structure = isPaymentsArray ? null : (fees.structure ?? {});

        const totalPaid = summary.totalPaid ?? payments.reduce((s, p) => s + (p.amountPaid ?? 0), 0);
        const totalFee = summary.totalFee ?? structure?.totalAmount ?? 0;
        const balance = summary.balance ?? (totalFee - totalPaid);
        const totalAmount = totalFee || structure?.totalAmount || 1;
        const components = structure?.components ?? [];
        const paidRatio = totalAmount > 0 ? totalPaid / totalAmount : 0;

        const breakdown = components.length > 0
            ? components.map((p, i) => ({
                id: p._id || i,
                type: p.name,
                amount: p.amount ?? 0,
                paid: Math.round((p.amount ?? 0) * paidRatio),
                pending: Math.round((p.amount ?? 0) * (1 - paidRatio))
            }))
            : totalAmount > 0 ? [{ id: 0, type: 'Total Fee', amount: totalAmount, paid: totalPaid, pending: balance }] : [];

        const history = payments.map(h => ({
            id: h._id,
            date: h.paymentDate ? new Date(h.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
            amount: h.amountPaid ?? 0,
            mode: h.paymentMethod ?? 'N/A',
            transactionId: h.receiptNo || h.transactionId || h._id?.toString().slice(-8),
            status: h.status
        }));

        return {
            summary: {
                totalAmount,
                paidAmount: totalPaid,
                pendingAmount: balance,
                nextDueDate: structure.installments?.[0]?.dueDate,
                dueDate: "Next Month 5th",
                status: balance > 0 ? "Pending" : "Cleared"
            },
            breakdown,
            history,
        };
    })() : null;

    // Smooth Scroll
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

        return () => lenis.destroy();
    }, []);

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

                    <h1 className="text-lg font-bold text-gray-900">Fees</h1>

                    <InfoTooltip
                        content={
                            <div className="space-y-2">
                                <p className="font-bold border-b border-gray-100 pb-1">Fee (Offline)</p>
                                <p>1. Fee is view-only here. Payment is accepted offline only.</p>
                                <p>2. Pay at the school office / accounts desk and collect the receipt.</p>
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

            <main className="max-w-lg mx-auto px-4 pt-6 pb-24">
                {loading || !formattedData ? (
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
                        <FeeSummaryCard summary={formattedData.summary} />

                        {formattedData.summary.pendingAmount > 0 && (
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6 flex items-start gap-4">
                                <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                                    <Building2 size={22} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-amber-900 mb-1">Pay Offline</h3>
                                    <p className="text-sm text-amber-800 leading-relaxed">
                                        Pending amount: <span className="font-bold">₹{Number(formattedData.summary.pendingAmount).toLocaleString('en-IN')}</span>. Please pay at the school office or accounts desk. Collect and keep your receipt.
                                    </p>
                                </div>
                            </div>
                        )}

                        <FeeBreakdownList breakdown={formattedData.breakdown} />

                        <PaymentHistory history={formattedData.history} />
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default FeesPage;
