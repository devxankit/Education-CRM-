import React, { useState } from 'react';
import { CreditCard, ArrowRight, Lock } from 'lucide-react';

const PaymentActionCard = ({ pendingAmount, config, onPay }) => {
    const [amount, setAmount] = useState(pendingAmount);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = () => {
        setIsProcessing(true);
        // Simulate payment process
        setTimeout(() => {
            setIsProcessing(false);
            onPay && onPay(amount);
        }, 1500);
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-lg shadow-indigo-100/20 mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" />
                Quick Payment
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Payment Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => config.canPayPartial ? setAmount(Number(e.target.value)) : null}
                            disabled={!config.canPayPartial}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-bold rounded-xl py-3 pl-8 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    {config.canPayPartial && (
                        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                            Min amount: ₹{config.minPayableAmount.toLocaleString('en-IN')}
                        </p>
                    )}
                </div>

                <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            Pay Securely <Lock size={16} />
                        </>
                    )}
                </button>

                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                    <Lock size={10} /> 128-bit Encrypted Transaction
                </p>
            </div>
        </div>
    );
};

export default PaymentActionCard;
