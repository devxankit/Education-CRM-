
import React from 'react';
import { Download } from 'lucide-react';

const FeesSnapshot = ({ fees, onActionClick }) => {
    const isPending = fees.pending > 0;

    return (
        <div className="px-4 mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Fees Overview</h3>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Outstanding</p>
                        <h2 className="text-2xl font-extrabold text-gray-900">₹{fees.pending.toLocaleString()}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Due Date</p>
                        <p className="text-sm font-bold text-red-500">{fees.dueDate || 'No Dues'}</p>
                    </div>
                </div>

                {isPending ? (
                    <button
                        onClick={() => onActionClick('pay')}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 active:scale-95 transition-transform"
                    >
                        Pay Fees Now
                    </button>
                ) : (
                    <button
                        onClick={() => onActionClick('receipts')}
                        className="w-full py-3 bg-green-50 text-green-700 border border-green-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <Download size={16} /> View Receipts
                    </button>
                )}
            </div>
        </div>
    );
};

export default FeesSnapshot;
