
import React, { useEffect, useState, useMemo } from 'react';
import { CreditCard, Percent } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';

const PAYMENT_METHODS = ['Cash', 'Cheque', 'Bank Transfer', 'Online', 'Other'];

const Step5_AdmissionFee = ({ data, onChange, academicYearId, branchId: propBranchId }) => {
    const feeStructures = useAdminStore(state => state.feeStructures);
    const taxes = useAdminStore(state => state.taxes);
    const fetchFeeStructures = useAdminStore(state => state.fetchFeeStructures);
    const fetchTaxes = useAdminStore(state => state.fetchTaxes);

    const [localFee, setLocalFee] = useState(data.admissionFee || {
        collectNow: false,
        feeStructureId: '',
        amount: '',
        paymentMethod: 'Cash',
        transactionId: '',
        remarks: ''
    });

    useEffect(() => {
        if ((data.branchId || propBranchId) && academicYearId) {
            fetchFeeStructures(data.branchId || propBranchId, academicYearId);
        }
    }, [data.branchId, propBranchId, academicYearId, fetchFeeStructures]);

    const effectiveBranchId = propBranchId || data.branchId || data.branch;
    useEffect(() => {
        if (effectiveBranchId) fetchTaxes(effectiveBranchId);
    }, [effectiveBranchId, fetchTaxes]);

    // Tax applicable on fee/admission - active only
    const applicableTaxes = useMemo(() => {
        return (taxes || []).filter(t => t.isActive !== false && ['fee', 'admission'].includes(t.applicableOn));
    }, [taxes]);

    const baseAmount = Number(localFee.amount) || 0;
    const taxCalc = useMemo(() => {
        if (baseAmount <= 0) return { taxAmount: 0, details: [], totalPercent: 0, totalFlat: 0 };
        let totalPercent = 0, totalFlat = 0;
        const details = [];
        applicableTaxes.forEach(t => {
            if (t.type === 'percentage') {
                const amt = (baseAmount * (Number(t.rate) || 0)) / 100;
                totalPercent += amt;
                details.push({ name: t.name, code: t.code, rate: t.rate, type: 'percentage', amount: amt });
            } else {
                totalFlat += Number(t.rate) || 0;
                details.push({ name: t.name, code: t.code, rate: t.rate, type: 'flat', amount: Number(t.rate) || 0 });
            }
        });
        return { taxAmount: totalPercent + totalFlat, details, totalPercent, totalFlat };
    }, [baseAmount, applicableTaxes]);

    const totalWithTax = baseAmount + taxCalc.taxAmount;

    const applicableStructures = feeStructures.filter(fs => {
        if (!fs.applicableClasses?.length) return true;
        if (!data.classId) return true;
        const classIds = fs.applicableClasses.map(c => c._id || c);
        return classIds.includes(data.classId);
    });

    const selectedStructure = applicableStructures.find(f => f._id === localFee.feeStructureId);
    const suggestedAmount = selectedStructure?.installments?.[0]?.amount ?? selectedStructure?.totalAmount ?? '';

    const computeTaxForAmount = (base) => {
        let taxAmt = 0;
        applicableTaxes.forEach(t => {
            if (t.type === 'percentage') taxAmt += (base * (Number(t.rate) || 0)) / 100;
            else taxAmt += Number(t.rate) || 0;
        });
        return Math.round(taxAmt * 100) / 100;
    };

    const handleChange = (field, value) => {
        const updated = { ...localFee, [field]: value };
        if (field === 'feeStructureId') {
            const fs = applicableStructures.find(f => f._id === value);
            const amt = fs?.installments?.[0]?.amount ?? fs?.totalAmount ?? '';
            updated.amount = amt;
        }
        const base = Number(updated.amount) || 0;
        updated.taxAmount = computeTaxForAmount(base);
        updated.totalWithTax = base + updated.taxAmount;
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
                        {applicableStructures.length === 0 && effectiveBranchId && (
                            <p className="text-xs text-amber-600 mt-1">Add a fee structure under Finance → Fee Structures for this branch and academic year.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Base Amount (₹) <span className="text-red-500">*</span></label>
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

                    {/* Tax calculation - from Finance → Tax & Deductions */}
                    {applicableTaxes.length > 0 && baseAmount > 0 && (
                        <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2 flex items-center gap-2">
                                <Percent size={14} /> Tax (from Finance → Tax & Deductions)
                            </h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-gray-700">
                                    <span>Base amount</span>
                                    <span>₹{baseAmount.toLocaleString('en-IN')}</span>
                                </div>
                                {taxCalc.details.map((d, i) => (
                                    <div key={i} className="flex justify-between text-gray-600">
                                        <span>{d.name} {d.type === 'percentage' ? `(${d.rate}%)` : `(flat)`}</span>
                                        <span>+ ₹{d.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold text-indigo-800 pt-2 border-t border-indigo-200">
                                    <span>Total payable (incl. tax)</span>
                                    <span>₹{totalWithTax.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    )}

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
