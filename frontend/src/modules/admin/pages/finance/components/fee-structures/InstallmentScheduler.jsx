import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';

const InstallmentScheduler = ({ totalAmount, installments, onChange, readOnly }) => {
    // Derived
    const currentTotal = installments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const difference = totalAmount - currentTotal;
    const isBalanced = difference === 0;

    const handleCountChange = (count) => {
        if (count < 1 || !count) {
            onChange([]); // Clear installments if invalid selection
            return;
        }
        
        if (totalAmount <= 0) {
            const labels = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
            const newInstallments = Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                name: labels[i] ? `${labels[i]} Installment` : `Installment ${i + 1}`,
                dueDate: '',
                amount: 0
            }));
            onChange(newInstallments);
            return;
        }
        
        // Simple logic: split evenly
        const amountPerInst = Math.floor(totalAmount / count);
        const remainder = totalAmount % count;

        const labels = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
        const newInstallments = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            name: labels[i] ? `${labels[i]} Installment` : `Installment ${i + 1}`,
            dueDate: '',
            amount: i === 0 ? amountPerInst + remainder : amountPerInst // Add remainder to first
        }));

        onChange(newInstallments);
    };

    const handleInstallmentChange = (id, field, value) => {
        const newInst = installments.map(i => {
            const iId = i.id || i._id;
            return iId === id ? { ...i, [field]: value } : i;
        });
        onChange(newInst);
    };

    return (
        <div className="space-y-6">

            {/* Controls */}
            {!readOnly && (
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Split Strategy</label>
                        <select
                            onChange={(e) => handleCountChange(Number(e.target.value))}
                            className="bg-white border border-gray-200 rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={installments.length > 0 ? installments.length : ''}
                        >
                            <option value="">Select Strategy</option>
                            <option value="1">Full Payment (1)</option>
                            <option value="2">Semester-wise (2)</option>
                            <option value="4">Quarterly (4)</option>
                            <option value="10">Monthly (10)</option>
                        </select>
                    </div>
                    <div className="text-right px-4 py-2 rounded-lg bg-white border border-gray-200">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Balance</span>
                        <span className={`block font-bold text-base ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{difference.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {installments.length === 0 && !readOnly && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Please select a split strategy above to create installments</p>
                </div>
            )}

            {/* List */}
            <div className="space-y-3">
                {installments.map((inst, idx) => {
                    const instId = inst.id ?? inst._id ?? `inst-${idx}`;
                    const displayNum = idx + 1;
                    return (
                    <div key={instId} className="flex gap-4 items-center border border-gray-200 rounded-xl p-4 bg-white hover:border-indigo-200 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {displayNum}
                        </div>

                        <div className="flex-1 min-w-0">
                            <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Title</label>
                            <input
                                type="text"
                                value={inst.name ?? ''}
                                disabled={readOnly}
                                onChange={(e) => handleInstallmentChange(instId, 'name', e.target.value)}
                                placeholder={`Installment ${displayNum}`}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>

                        <div className="w-[150px] shrink-0">
                            <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Due Date</label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="date"
                                    value={inst.dueDate ? (typeof inst.dueDate === 'string' ? inst.dueDate.split('T')[0] : new Date(inst.dueDate).toISOString().split('T')[0]) : ''}
                                    disabled={readOnly}
                                    onChange={(e) => handleInstallmentChange(instId, 'dueDate', e.target.value)}
                                    className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="w-[110px] shrink-0">
                            <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Amount</label>
                            <input
                                type="number"
                                value={inst.amount ?? ''}
                                placeholder="0"
                                disabled={readOnly}
                                onChange={(e) => handleInstallmentChange(instId, 'amount', Number(e.target.value) || 0)}
                                min={0}
                                className={`w-full px-3 py-2 border rounded-lg text-sm font-mono text-right outline-none ${readOnly ? 'border-transparent bg-gray-50' : 'border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`}
                            />
                        </div>

                    </div>
                    );
                })}
            </div>

            {!isBalanced && !readOnly && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                    <AlertTriangle size={20} className="text-red-600 shrink-0" />
                    <div>
                        <p className="font-semibold text-red-800 text-sm">Amount Mismatch</p>
                        <p className="text-red-700 text-sm mt-0.5">The installments sum (₹{currentTotal.toLocaleString()}) does not match the total fee amount (₹{totalAmount.toLocaleString()}). Difference: ₹{Math.abs(difference).toLocaleString()}. Please adjust the amounts.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstallmentScheduler;
