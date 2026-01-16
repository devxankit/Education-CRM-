import React, { useRef, useEffect } from 'react';
import { IndianRupee, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import gsap from 'gsap';

const FeeSummaryCard = ({ summary }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 20, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
        );
    }, []);

    const isOverdue = summary.status === 'Overdue';
    const isPaid = summary.status === 'Paid';

    return (
        <div ref={cardRef} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-6">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Outstanding</p>
                        <div className="flex items-start gap-1">
                            <IndianRupee size={24} className="mt-1.5 opacity-80" />
                            <span className="text-4xl font-bold tracking-tight">{summary.pendingAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5
                        ${isPaid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            isOverdue ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                'bg-orange-500/10 border-orange-500/20 text-orange-300'}`}>
                        {isPaid ? <CheckCircle size={12} /> : isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />}
                        {summary.status}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                        <span>Paid: ₹{summary.paidAmount.toLocaleString('en-IN')}</span>
                        <span>Total: ₹{summary.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isPaid ? 'bg-emerald-500' : 'bg-orange-500'}`}
                            style={{ width: `${(summary.paidAmount / summary.totalAmount) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {!isPaid && (
                    <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                        <Clock size={16} className={isOverdue ? 'text-red-400' : 'text-orange-300'} />
                        <span className={isOverdue ? 'text-red-300' : ''}>
                            {isOverdue ? 'Overdue since ' : 'Next Due: '}
                            <span className="font-bold text-white">
                                {new Date(summary.nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeSummaryCard;
