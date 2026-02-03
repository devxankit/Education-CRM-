
import React, { useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';

const InstallmentRulesPanel = ({ isLocked, data = {}, onChange }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <CreditCard className="text-indigo-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Payment & Installment Logic</h3>
                    <p className="text-xs text-gray-500">Define how the system accepts payments from students.</p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Rule 1: Partial Payments */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={data.allowPartial || false}
                            onChange={(e) => handleChange('allowPartial', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Allow Partial Payments</label>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            If enabled, students can pay any amount (e.g., ₹500 of a ₹2000 installment).
                            If disabled, they must pay the exact installment amount.
                        </p>
                    </div>
                </div>

                {/* Rule 2: Out of Order */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={data.allowOutOfOrder || false}
                            onChange={(e) => handleChange('allowOutOfOrder', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Allow Out-of-Order Payments</label>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Allow paying Installment 3 before Installment 2. Recommended to keep disabled.
                        </p>
                    </div>
                </div>

                {/* Rule 3: Strict Due Date Blocking */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={data.strictDueDate || false}
                            onChange={(e) => handleChange('strictDueDate', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Strict Due Date Enforcement</label>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Portal will not accept payments for expired installments unless Late Fee is calculated.
                        </p>
                    </div>
                </div>

                {/* Rule 4: Critical Action Blocking */}
                <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="mt-1">
                        <input
                            type="checkbox"
                            checked={data.blockResultsOnDue || false}
                            onChange={(e) => handleChange('blockResultsOnDue', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-red-600 rounded cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-red-900">Block Results / Admit Card on Dues</label>
                        <p className="text-xs text-red-700 mt-1 leading-relaxed">
                            Automatically hide exam results if pending dues &gt; ₹0.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InstallmentRulesPanel;
