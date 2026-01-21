
import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';

// Components
import InstallmentRulesPanel from './components/fee-policies/InstallmentRulesPanel';
import LateFeeRulesPanel from './components/fee-policies/LateFeeRulesPanel';
import DiscountRulesPanel from './components/fee-policies/DiscountRulesPanel';
import RefundRulesPanel from './components/fee-policies/RefundRulesPanel';

const FeePolicies = () => {

    // Global State
    const [isLocked, setIsLocked] = useState(false);
    const [academicYear, setAcademicYear] = useState('2025-26');

    const handleLock = () => {
        if (window.confirm("Lock Fee Policies for the year? This action requires Admin privileges to undo.")) {
            setIsLocked(true);
        }
    };

    const handleUnlock = () => {
        const reason = prompt("Enter Audit Reason for Unlocking Policies:");
        if (reason) setIsLocked(false);
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Fee Policies & Rules</h1>
                    <p className="text-gray-500 text-sm">Configure financial behavior for payments, fines, and concessions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Academic Year:</span>
                        <select
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            className="font-bold text-gray-800 outline-none bg-transparent"
                        >
                            <option>2025-26</option>
                            <option>2024-25</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {/* Content Rules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">

                {/* 1. Installments */}
                <InstallmentRulesPanel isLocked={isLocked} />

                {/* 2. Refund Rules */}
                <RefundRulesPanel isLocked={isLocked} />

                {/* 3. Late Fees (Full Width) */}
                <div className="lg:col-span-2">
                    <LateFeeRulesPanel isLocked={isLocked} />
                </div>

                {/* 4. Discounts (Full Width) */}
                <div className="lg:col-span-2">
                    <DiscountRulesPanel isLocked={isLocked} />
                </div>

            </div>

            {/* Footer Actions */}
            {!isLocked && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertTriangle size={16} />
                        <span>Unsaved changes in draft.</span>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium">
                        <Save size={18} /> Save Policy Draft
                    </button>
                </div>
            )}

        </div>
    );
};

export default FeePolicies;
