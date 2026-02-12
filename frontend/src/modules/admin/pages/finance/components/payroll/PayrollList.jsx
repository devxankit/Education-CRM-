import React from 'react';
import { Edit, DollarSign, Calendar, User, FileText, CheckCircle, Clock, XCircle, Check, Download, Eye, Building2, CreditCard } from 'lucide-react';

const PayrollList = ({ payrolls, employeeType, onEdit, onMarkAsPaid, onGenerateInvoice, onView, month, year }) => {
    const getStatusBadge = (status) => {
        const badges = {
            draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: FileText, label: 'Draft' },
            approved: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle, label: 'Approved' },
            paid: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Paid' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Cancelled' }
        };
        const badge = badges[status] || badges.draft;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                <Icon size={12} />
                {badge.label}
            </span>
        );
    };

    if (payrolls.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-semibold text-lg mb-1">No payroll entries found</p>
                <p className="text-sm text-gray-400">Create a new payroll entry to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">
                            Payroll for {month} {year} - {employeeType === 'teacher' ? 'Teachers' : 'Staff'}
                        </h3>
                        <span className="text-sm text-gray-500 font-medium">{payrolls.length} {payrolls.length === 1 ? 'entry' : 'entries'}</span>
                    </div>
                </div>
            </div>

            {payrolls.map((payroll) => {
                const employee = payroll.employeeId;
                const employeeName = employeeType === 'teacher' 
                    ? `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim() || employee?.name || 'N/A'
                    : employee?.name || 'N/A';
                const employeeId = employee?.employeeId || employee?._id || 'N/A';

                return (
                    <div
                        key={payroll._id || payroll.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                                        <User size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-gray-900 text-xl">{employeeName}</h4>
                                            {getStatusBadge(payroll.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Building2 size={14} />
                                                ID: {employeeId}
                                            </span>
                                            {employee?.department && (
                                                <span className="text-gray-500">• {employee.department}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onView && onView(payroll)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    
                                    {payroll.status === 'draft' && (
                                        <button
                                            onClick={() => onEdit(payroll)}
                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                            title="Edit Payroll"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    )}

                                    {payroll.status !== 'paid' && payroll.status !== 'cancelled' && (
                                        <button
                                            onClick={() => onMarkAsPaid && onMarkAsPaid(payroll)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                                            title="Mark as Paid"
                                        >
                                            <Check size={16} />
                                            Mark Paid
                                        </button>
                                    )}

                                    {(payroll.status === 'approved' || payroll.status === 'paid') && (
                                        <button
                                            onClick={() => onGenerateInvoice && onGenerateInvoice(payroll)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                                            title="Download Payslip"
                                        >
                                            <Download size={16} />
                                            Payslip
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Salary Details Section */}
                        <div className="px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                {/* Basic Salary */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Basic Salary</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">₹{payroll.basicSalary?.toLocaleString() || '0'}</p>
                                </div>

                                {/* Earnings */}
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Total Earnings</span>
                                        <DollarSign size={14} className="text-green-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">₹{payroll.totalEarnings?.toLocaleString() || '0'}</p>
                                </div>

                                {/* Deductions */}
                                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Total Deductions</span>
                                        <DollarSign size={14} className="text-red-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-red-700">₹{payroll.totalDeductions?.toLocaleString() || '0'}</p>
                                </div>

                                {/* Net Salary */}
                                <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Net Salary</span>
                                        <DollarSign size={16} className="text-indigo-600" />
                                    </div>
                                    <p className="text-3xl font-bold text-indigo-900">₹{payroll.netSalary?.toLocaleString() || '0'}</p>
                                </div>
                            </div>

                            {/* Additional Details */}
                            {(payroll.leaveDays > 0 || payroll.paymentDate || payroll.paymentMethod) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        {payroll.leaveDays > 0 && (
                                            <div className="flex items-center gap-2 text-amber-700">
                                                <Calendar size={16} className="text-amber-600" />
                                                <span className="font-medium">LOP:</span>
                                                <span>{payroll.leaveDays} days (₹{payroll.lopAmount?.toLocaleString() || '0'})</span>
                                            </div>
                                        )}
                                        {payroll.paymentDate && (
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Calendar size={16} className="text-gray-500" />
                                                <span className="font-medium">Paid:</span>
                                                <span>{new Date(payroll.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                        {payroll.paymentMethod && (
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <CreditCard size={16} className="text-gray-500" />
                                                <span className="font-medium">Method:</span>
                                                <span className="uppercase">{payroll.paymentMethod.replace('_', ' ')}</span>
                                            </div>
                                        )}
                                        {payroll.transactionId && (
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <span className="font-medium">Txn ID:</span>
                                                <span className="font-mono text-xs">{payroll.transactionId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PayrollList;
