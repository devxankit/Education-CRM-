
import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';

const FeeSummaryCard = ({ summary }) => {
    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-lg shadow-gray-200">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wide opacity-60">Total Outstanding</span>
                    <h2 className="text-3xl font-extrabold mt-1">₹{summary.pending.toLocaleString()}</h2>
                </div>
                <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                    <Wallet size={24} className="text-white" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                    <span className="block text-[10px] font-bold uppercase opacity-60">Total Fee</span>
                    <span className="text-lg font-bold">₹{summary.total.toLocaleString()}</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase opacity-60">Amount Paid</span>
                    <span className="text-lg font-bold text-emerald-400">₹{summary.paid.toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs opacity-70">Next Due Date:</span>
                <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded">{summary.nextDue}</span>
            </div>
        </div>
    );
};

export default FeeSummaryCard;
