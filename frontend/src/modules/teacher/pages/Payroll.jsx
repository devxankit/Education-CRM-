import React, { useEffect, useState } from 'react';
import { Download, Calendar, FileText, CheckCircle, Loader2, Clock, XCircle, CreditCard } from 'lucide-react';
import { useTeacherStore } from '../../../store/teacherStore';

const TeacherPayroll = () => {
    const { user, payrollHistory, fetchPayrollHistory, isFetchingPayroll } = useTeacherStore();

    // Optional: Client-side filtering
    const [filterYear, setFilterYear] = useState('All');

    useEffect(() => {
        fetchPayrollHistory();
    }, [fetchPayrollHistory]);

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

    const generateInvoiceHTML = (payroll) => {
        const monthName = new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long' });
        const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
        const paymentDate = payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';
        const employeeName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Salary Payslip - ${employeeName}</title>
                <style>
                    @media print {
                        body { margin: 0; padding: 20px; }
                        .no-print { display: none; }
                    }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Arial', sans-serif; padding: 30px; background: #f5f5f5; }
                    .payslip-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .header { border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { color: #4f46e5; font-size: 28px; margin-bottom: 5px; }
                    .header p { color: #666; font-size: 14px; }
                    .company-info { text-align: right; margin-top: 10px; }
                    .company-info p { font-size: 12px; color: #666; }
                    .payslip-info { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
                    .info-section { flex: 1; }
                    .info-section h3 { color: #333; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .info-section p { font-size: 13px; color: #555; margin: 5px 0; }
                    .info-section strong { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    thead { background: #4f46e5; color: white; }
                    th { padding: 12px; text-align: left; font-weight: 600; font-size: 13px; }
                    th.text-right { text-align: right; }
                    tbody tr { border-bottom: 1px solid #e5e7eb; }
                    tbody tr:hover { background: #f9fafb; }
                    td { padding: 12px; font-size: 13px; color: #333; }
                    td.text-right { text-align: right; font-weight: 500; }
                    .earning { color: #059669; }
                    .deduction { color: #dc2626; }
                    .total-row { background: #f3f4f6; font-weight: bold; }
                    .net-salary-row { background: #e0e7ff; font-size: 16px; }
                    .net-salary-row td { font-size: 18px; color: #4f46e5; font-weight: bold; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
                    .footer p { font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="payslip-container">
                    <div class="header">
                        <h1>SALARY PAYSLIP</h1>
                        <p>For the month of ${monthName} ${payroll.year}</p>
                        <div class="company-info">
                            <p><strong>Generated On:</strong> ${currentDate}</p>
                        </div>
                    </div>

                    <div class="payslip-info">
                        <div class="info-section">
                            <h3>Employee Information</h3>
                            <p><strong>Name:</strong> ${employeeName}</p>
                            <p><strong>Employee ID:</strong> ${user?.employeeId || user?._id || 'N/A'}</p>
                            <p><strong>Designation:</strong> Teacher</p>
                        </div>
                        <div class="info-section">
                            <h3>Payment Details</h3>
                            <p><strong>Payment Date:</strong> ${paymentDate}</p>
                            <p><strong>Payment Method:</strong> ${payroll.paymentMethod ? payroll.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}</p>
                            ${payroll.transactionId ? `<p><strong>Transaction ID:</strong> ${payroll.transactionId}</p>` : ''}
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Earnings</th>
                                <th class="text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic Salary</td>
                                <td class="text-right">${payroll.basicSalary?.toLocaleString() || '0'}</td>
                            </tr>
                            ${payroll.components?.filter(c => c.type === 'earning').map(c => `
                                <tr>
                                    <td>${c.name}</td>
                                    <td class="text-right earning">+ ${c.amount?.toLocaleString() || '0'}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td><strong>Total Earnings</strong></td>
                                <td class="text-right earning"><strong>${payroll.totalEarnings?.toLocaleString() || '0'}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <table style="margin-top: 20px;">
                        <thead>
                            <tr>
                                <th>Deductions</th>
                                <th class="text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${payroll.components?.filter(c => c.type === 'deduction').length > 0 ? payroll.components.filter(c => c.type === 'deduction').map(c => `
                                <tr>
                                    <td>${c.name}</td>
                                    <td class="text-right deduction">- ${c.amount?.toLocaleString() || '0'}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="2" style="text-align: center; color: #999;">No deductions</td></tr>'}
                            ${payroll.lopAmount > 0 ? `
                                <tr>
                                    <td>Loss of Pay (LOP) - ${payroll.leaveDays} days</td>
                                    <td class="text-right deduction">- ${payroll.lopAmount?.toLocaleString() || '0'}</td>
                                </tr>
                            ` : ''}
                            <tr class="total-row">
                                <td><strong>Total Deductions</strong></td>
                                <td class="text-right deduction"><strong>${payroll.totalDeductions?.toLocaleString() || '0'}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <table style="margin-top: 20px;">
                        <tbody>
                            <tr class="net-salary-row">
                                <td><strong>NET SALARY (IN-HAND)</strong></td>
                                <td class="text-right"><strong>₹${payroll.netSalary?.toLocaleString() || '0'}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="footer">
                        <p>This is a computer-generated payslip and does not require a signature.</p>
                        <p style="margin-top: 10px;">For any queries, please contact the HR department.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    };

    const handleGenerateInvoice = (payroll) => {
        const invoiceWindow = window.open('', '_blank');
        const invoiceHTML = generateInvoiceHTML(payroll);
        invoiceWindow.document.write(invoiceHTML);
        invoiceWindow.document.close();
        // invoiceWindow.print(); // Optional: Auto print
    };

    // Filter logic
    const filteredPayrolls = filterYear === 'All'
        ? payrollHistory
        : payrollHistory.filter(p => p.year === parseInt(filterYear));

    // Get unique years for filter
    const uniqueYears = [...new Set(payrollHistory.map(p => p.year))].sort((a, b) => b - a);

    if (isFetchingPayroll && payrollHistory.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Payroll History</h1>
                        <p className="text-gray-500">Track all your earnings, deductions, and payslips</p>
                    </div>

                    {uniqueYears.length > 0 && (
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="All">All Years</option>
                            {uniqueYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    )}
                </div>

                {filteredPayrolls.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <FileText size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Payroll Records Found</h3>
                        <p className="text-gray-500">Your payroll history will appear here once processed.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredPayrolls.map((payroll) => {
                            const monthName = new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long' });

                            return (
                                <div
                                    key={payroll._id}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Card Header */}
                                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {monthName} {payroll.year}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                                                        {payroll.financialYear}
                                                    </span>
                                                    {getStatusBadge(payroll.status)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {(payroll.status === 'paid' || payroll.status === 'approved') && (
                                                <button
                                                    onClick={() => handleGenerateInvoice(payroll)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                >
                                                    <FileText size={16} />
                                                    View Payslip
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {/* Basic Salary */}
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Basic Salary</p>
                                                <p className="text-xl font-bold text-gray-900">₹{payroll.basicSalary?.toLocaleString()}</p>
                                            </div>

                                            {/* Total Earnings */}
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                                <p className="text-xs font-semibold text-green-600 uppercase mb-1">Total Earnings</p>
                                                <p className="text-xl font-bold text-green-700">₹{payroll.totalEarnings?.toLocaleString()}</p>
                                            </div>

                                            {/* Total Deductions */}
                                            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                                <p className="text-xs font-semibold text-red-600 uppercase mb-1">Total Deductions</p>
                                                <p className="text-xl font-bold text-red-700">₹{payroll.totalDeductions?.toLocaleString()}</p>
                                            </div>

                                            {/* Net Salary */}
                                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 ring-2 ring-indigo-100">
                                                <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">Net Salary</p>
                                                <p className="text-2xl font-bold text-indigo-700">₹{payroll.netSalary?.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Footer Details */}
                                        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                            {payroll.paymentDate && (
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-gray-400" />
                                                    <span>Paid on: <span className="font-semibold text-gray-900">{new Date(payroll.paymentDate).toLocaleDateString()}</span></span>
                                                </div>
                                            )}
                                            {payroll.paymentMethod && (
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={16} className="text-gray-400" />
                                                    <span>Via: <span className="font-semibold text-gray-900 uppercase">{payroll.paymentMethod.replace('_', ' ')}</span></span>
                                                </div>
                                            )}
                                            {payroll.transactionId && (
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-gray-400" />
                                                    <span>Txn ID: <span className="font-mono text-gray-900">{payroll.transactionId}</span></span>
                                                </div>
                                            )}
                                            {payroll.leaveDays > 0 && (
                                                <div className="flex items-center gap-2 text-amber-600">
                                                    <Calendar size={16} />
                                                    <span>LOP Deduction: {payroll.leaveDays} Days (₹{payroll.lopAmount?.toLocaleString()})</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherPayroll;
