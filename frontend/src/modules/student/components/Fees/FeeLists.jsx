import React, { useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, File, Download } from 'lucide-react';
import gsap from 'gsap';

export const FeeBreakdownList = ({ breakdown }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Fee Structure</h3>
            <div className="space-y-3">
                {breakdown.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">{item.type}</span>
                            <span className="text-xs text-gray-400">Total: ₹{item.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-right">
                            {item.pending > 0 ? (
                                <>
                                    <p className="text-sm font-bold text-red-600">₹{item.pending.toLocaleString('en-IN')}</p>
                                    <p className="text-[10px] text-red-400 font-medium">Pending</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-bold text-emerald-600">₹{item.paid.toLocaleString('en-IN')}</p>
                                    <p className="text-[10px] text-emerald-400 font-medium">Paid</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <button className="text-xs font-semibold text-indigo-600 flex items-center justify-center gap-1 mx-auto hover:text-indigo-800">
                    Download Fee Structure <Download size={12} />
                </button>
            </div>
        </div>
    );
};

export const PaymentHistory = ({ history }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment History</h3>

            {history.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4">No transactions yet.</p>
            ) : (
                <div className="relative border-l-2 border-gray-100 ml-2 space-y-6">
                    {history.map((txn, index) => (
                        <div key={txn.id} className="relative pl-6">
                            {/* Dot */}
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-indigo-200"></div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">₹{txn.amount.toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-gray-500 font-medium">{txn.date} • {txn.mode}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">ID: {txn.transactionId}</p>
                                </div>
                                <button className="p-2 bg-gray-50 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
