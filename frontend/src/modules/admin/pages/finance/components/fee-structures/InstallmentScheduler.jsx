
import React, { useState, useEffect } from 'react';
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
            // If no total amount, create empty installments
            const newInstallments = Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                name: '',
                dueDate: '',
                amount: 0
            }));
            onChange(newInstallments);
            return;
        }
        
        // Simple logic: split evenly
        const amountPerInst = Math.floor(totalAmount / count);
        const remainder = totalAmount % count;

        const newInstallments = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            name: '', // Empty name - user will fill it
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
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Split Strategy</label>
                        <select
                            onChange={(e) => handleCountChange(Number(e.target.value))}
                            className="bg-white border border-gray-300 rounded text-sm px-3 py-1.5 outline-none"
                            value={installments.length > 0 ? installments.length : ''}
                        >
                            <option value="">Select Strategy</option>
                            <option value="1">Full Payment (1)</option>
                            <option value="2">Semester-wise (2)</option>
                            <option value="4">Quarterly (4)</option>
                            <option value="10">Monthly (10)</option>
                        </select>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-gray-500">Unallocated Amount</span>
                        <span className={`block font-bold text-sm ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
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
                    const instId = inst.id || inst._id || idx + 1;
                    return (
                    <div key={instId} className="flex gap-4 items-center border border-gray-200 rounded-lg p-3 hover:bg-gray-50/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {instId}
                        </div>

                        <div className="flex-1">
                            <label className="block text-[10px] text-gray-400 mb-0.5">Title</label>
                            <input
                                type="text"
                                value={inst.name || ''}
                                disabled={readOnly}
                                onChange={(e) => handleInstallmentChange(instId, 'name', e.target.value)}
                                className="w-full bg-transparent border-b border-gray-300 text-sm focus:border-indigo-500 outline-none pb-0.5"
                            />
                        </div>

                        <div className="w-[140px]">
                            <label className="block text-[10px] text-gray-400 mb-0.5">Due Date</label>
                            <div className="relative">
                                <Calendar size={12} className="absolute left-0 top-1 text-gray-400" />
                                <input
                                    type="date"
                                    value={inst.dueDate ? (typeof inst.dueDate === 'string' ? inst.dueDate.split('T')[0] : new Date(inst.dueDate).toISOString().split('T')[0]) : ''}
                                    disabled={readOnly}
                                    onChange={(e) => handleInstallmentChange(instId, 'dueDate', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 text-sm pl-4 focus:border-indigo-500 outline-none pb-0.5"
                                />
                            </div>
                        </div>

                        <div className="w-[100px]">
                            <label className="block text-[10px] text-gray-400 mb-0.5">Amount</label>
                            <input
                                type="number"
                                value={inst.amount || ''}
                                placeholder="0"
                                disabled={readOnly}
                                onChange={(e) => handleInstallmentChange(instId, 'amount', Number(e.target.value) || 0)}
                                className={`w-full bg-transparent border-b text-sm font-mono text-right outline-none pb-0.5 ${readOnly ? 'border-transparent' : 'border-gray-300 focus:border-indigo-500'}`}
                            />
                        </div>

                    </div>
                    );
                })}
            </div>

            {!isBalanced && !readOnly && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded border border-red-100">
                    <AlertTriangle size={14} />
                    <span>The installments do not sum up to the total fee amount ({totalAmount}). Please adjust.</span>
                </div>
            )}
        </div>
    );
};

export default InstallmentScheduler;
