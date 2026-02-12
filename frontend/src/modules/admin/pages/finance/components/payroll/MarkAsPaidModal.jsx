import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const MarkAsPaidModal = ({ isOpen, onClose, payroll, employeeType, onConfirm }) => {
    const [saving, setSaving] = useState(false);

    if (!isOpen || !payroll) return null;

    const employee = payroll.employeeId;
    const employeeName = employeeType === 'teacher' 
        ? `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim() || employee?.name || 'N/A'
        : employee?.name || 'N/A';

    const handleConfirm = async () => {
        setSaving(true);
        try {
            await onConfirm({
                status: 'paid',
                paymentDate: new Date().toISOString().split('T')[0],
                paymentMethod: 'bank_transfer'
            });
            onClose();
        } catch (error) {
            console.error('Error marking as paid:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border-t-4 border-green-500">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-green-50">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">Mark as Paid</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-green-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Employee Info */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                        <p className="text-sm text-gray-600 mb-1">Employee</p>
                        <p className="font-semibold text-gray-900 text-lg">{employeeName}</p>
                        <p className="text-sm text-gray-700 mt-2">
                            Net Salary: <span className="font-bold text-green-600">₹{payroll.netSalary?.toLocaleString() || '0'}</span>
                        </p>
                    </div>

                    {/* Confirmation Message */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                            <div>
                                <p className="text-sm font-medium text-amber-900 mb-1">
                                    Are you sure you want to mark this payroll as Paid?
                                </p>
                                <p className="text-xs text-amber-700">
                                    This action will update the payroll status to "Paid" with today's date.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={16} />
                                    Confirm
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkAsPaidModal;
