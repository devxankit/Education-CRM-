
import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';

const PAYMENT_METHODS = ['Cash', 'Cheque', 'Bank Transfer', 'Online', 'Other'];

const Step5_AdmissionFee = ({ data, onChange, academicYearId }) => {
    const feeStructures = useAdminStore(state => state.feeStructures);
    const fetchFeeStructures = useAdminStore(state => state.fetchFeeStructures);

    const [localFee, setLocalFee] = useState(data.admissionFee || {
        collectNow: false,
        feeStructureId: '',
        amount: '',
        paymentMethod: 'Cash',
        transactionId: '',
        remarks: ''
    });

    useEffect(() => {
        if (data.branchId && academicYearId) {
            fetchFeeStructures(data.branchId, academicYearId);
        }
    }, [data.branchId, academicYearId, fetchFeeStructures]);

    const applicableStructures = feeStructures.filter(fs => {
        if (!fs.applicableClasses?.length) return true;
        if (!data.classId) return true;
        const classIds = fs.applicableClasses.map(c => c._id || c);
        return classIds.includes(data.classId);
    });

    const selectedStructure = applicableStructures.find(f => f._id === localFee.feeStructureId);
    const suggestedAmount = selectedStructure?.installments?.[0]?.amount ?? selectedStructure?.totalAmount ?? '';

    const handleChange = (field, value) => {
        const updated = { ...localFee, [field]: value };
        if (field === 'feeStructureId') {
            const fs = applicableStructures.find(f => f._id === value);
            const amt = fs?.installments?.[0]?.amount ?? fs?.totalAmount ?? '';
            updated.amount = amt;
        }
        setLocalFee(updated);
        onChange({ ...data, admissionFee: updated });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <CreditCard className="text-indigo-600" /> Admission Fee
                </h3>
                <p className="text-sm text-gray-500">Optional: Collect admission / first installment fee during enrollment.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localFee.collectNow || false}
                        onChange={(e) => handleChange('collectNow', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="font-bold text-gray-800">Collect admission fee now</span>
                </label>
            </div>

            {localFee.collectNow && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fee Structure <span className="text-red-500">*</span></label>
                        <select
                            value={localFee.feeStructureId || ''}
                            onChange={(e) => handleChange('feeStructureId', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select fee structure</option>
                            {applicableStructures.map(fs => (
                                <option key={fs._id} value={fs._id}>
                                    {fs.name} – ₹{fs.totalAmount?.toLocaleString('en-IN')}
                                </option>
                            ))}
                            {applicableStructures.length === 0 && (
                                <option value="" disabled>No fee structure for this branch/year</option>
                            )}
                        </select>
                        {applicableStructures.length === 0 && data.branchId && (
                            <p className="text-xs text-amber-600 mt-1">Add a fee structure under Finance → Fee Structures for this branch and academic year.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                min="1"
                                value={localFee.amount || ''}
                                onChange={(e) => handleChange('amount', e.target.value)}
                                placeholder={suggestedAmount ? `Suggested: ${suggestedAmount}` : 'Enter amount'}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Method</label>
                            <select
                                value={localFee.paymentMethod || 'Cash'}
                                onChange={(e) => handleChange('paymentMethod', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {PAYMENT_METHODS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transaction / Reference ID</label>
                        <input
                            type="text"
                            value={localFee.transactionId || ''}
                            onChange={(e) => handleChange('transactionId', e.target.value)}
                            placeholder="Optional"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Remarks</label>
                        <input
                            type="text"
                            value={localFee.remarks || ''}
                            onChange={(e) => handleChange('remarks', e.target.value)}
                            placeholder="e.g. First installment"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step5_AdmissionFee;
