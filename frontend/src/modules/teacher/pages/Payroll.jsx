import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, CheckCircle, Loader2, XCircle, Clock, CreditCard, Banknote } from 'lucide-react';
import { useTeacherStore } from '../../../store/teacherStore';

const MONTHS = [
    { value: 0, label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

const TeacherPayroll = () => {
    const navigate = useNavigate();
    const { user, payrollHistory, fetchPayrollHistory, isFetchingPayroll } = useTeacherStore();

    const [filterYear, setFilterYear] = useState('all');
    const [filterMonth, setFilterMonth] = useState(0);

    useEffect(() => {
        fetchPayrollHistory();
    }, [fetchPayrollHistory]);

    const history = payrollHistory || [];

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
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
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
                    @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
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
                        <div class="company-info"><p><strong>Generated On:</strong> ${currentDate}</p></div>
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
                        <thead><tr><th>Earnings</th><th class="text-right">Amount (₹)</th></tr></thead>
                        <tbody>
                            <tr><td>Basic Salary</td><td class="text-right">${payroll.basicSalary?.toLocaleString() || '0'}</td></tr>
                            ${(payroll.components || []).filter(c => c.type === 'earning').map(c => `<tr><td>${c.name}</td><td class="text-right earning">+ ${c.amount?.toLocaleString() || '0'}</td></tr>`).join('')}
                            <tr class="total-row"><td><strong>Total Earnings</strong></td><td class="text-right earning"><strong>${payroll.totalEarnings?.toLocaleString() || '0'}</strong></td></tr>
                        </tbody>
                    </table>
                    <table style="margin-top: 20px;">
                        <thead><tr><th>Deductions</th><th class="text-right">Amount (₹)</th></tr></thead>
                        <tbody>
                            ${(payroll.components || []).filter(c => c.type === 'deduction').length > 0 ? (payroll.components || []).filter(c => c.type === 'deduction').map(c => `<tr><td>${c.name}</td><td class="text-right deduction">- ${c.amount?.toLocaleString() || '0'}</td></tr>`).join('') : '<tr><td colspan="2" style="text-align: center; color: #999;">No deductions</td></tr>'}
                            ${payroll.lopAmount > 0 ? `<tr><td>Loss of Pay (LOP) - ${payroll.leaveDays} days</td><td class="text-right deduction">- ${payroll.lopAmount?.toLocaleString() || '0'}</td></tr>` : ''}
                            <tr class="total-row"><td><strong>Total Deductions</strong></td><td class="text-right deduction"><strong>${payroll.totalDeductions?.toLocaleString() || '0'}</strong></td></tr>
                        </tbody>
                    </table>
                    <table style="margin-top: 20px;">
                        <tbody>
                            <tr class="net-salary-row"><td><strong>NET SALARY (IN-HAND)</strong></td><td class="text-right"><strong>₹${payroll.netSalary?.toLocaleString() || '0'}</strong></td></tr>
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

    const handleViewPayslip = (payroll) => {
        const w = window.open('', '_blank');
        w.document.write(generateInvoiceHTML(payroll));
        w.document.close();
    };

    // Filter by year + month
    const filteredPayrolls = history.filter(p => {
        if (filterYear !== 'all' && p.year !== parseInt(filterYear)) return false;
        if (filterMonth > 0 && p.month !== filterMonth) return false;
        return true;
    });

    const uniqueYears = [...new Set(history.map(p => p.year))].sort((a, b) => b - a);
    const yearOptions = uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear(), new Date().getFullYear() - 1];

    const selectedMonthName = filterMonth > 0 ? MONTHS.find(m => m.value === filterMonth)?.label : null;
    const selectedYear = filterYear !== 'all' ? filterYear : null;

    if (isFetchingPayroll && history.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading payroll...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Payroll</h1>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Salary & Payslips</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4 pb-6">
                {/* Year & Month Filter */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">View Salary By</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Year</label>
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            >
                                <option value="all">All Years</option>
                                {yearOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Month</label>
                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            >
                                {MONTHS.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {(filterYear !== 'all' || filterMonth > 0) && (
                        <button
                            onClick={() => { setFilterYear('all'); setFilterMonth(0); }}
                            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Content */}
                {filteredPayrolls.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Banknote className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">No Salary Record</h3>
                        <p className="text-sm text-gray-500">
                            {selectedMonthName && selectedYear
                                ? `No payroll found for ${selectedMonthName} ${selectedYear}.`
                                : 'Your salary records will appear here once processed.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPayrolls.map((payroll) => {
                            const monthName = new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long' });
                            return (
                                <div
                                    key={payroll._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                                >
                                    <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                                <Calendar className="text-indigo-600" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900">{monthName} {payroll.year}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {payroll.financialYear && (
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                                            FY {payroll.financialYear}
                                                        </span>
                                                    )}
                                                    {getStatusBadge(payroll.status)}
                                                </div>
                                            </div>
                                        </div>
                                        {(payroll.status === 'paid' || payroll.status === 'approved') && (
                                            <button
                                                onClick={() => handleViewPayslip(payroll)}
                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                                            >
                                                <FileText size={14} />
                                                Payslip
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Basic</p>
                                                <p className="text-lg font-bold text-gray-900">₹{(payroll.basicSalary || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                                                <p className="text-[10px] font-bold text-green-600 uppercase mb-0.5">Earnings</p>
                                                <p className="text-lg font-bold text-green-700">₹{(payroll.totalEarnings || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                                                <p className="text-[10px] font-bold text-red-600 uppercase mb-0.5">Deductions</p>
                                                <p className="text-lg font-bold text-red-700">₹{(payroll.totalDeductions || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-indigo-50 border-2 border-indigo-200">
                                                <p className="text-[10px] font-bold text-indigo-600 uppercase mb-0.5">Net Salary</p>
                                                <p className="text-xl font-bold text-indigo-700">₹{(payroll.netSalary || 0).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                                            {payroll.paymentDate && (
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={12} /> Paid: {new Date(payroll.paymentDate).toLocaleDateString('en-IN')}
                                                </span>
                                            )}
                                            {payroll.paymentMethod && (
                                                <span className="flex items-center gap-1.5">
                                                    <CreditCard size={12} /> {payroll.paymentMethod.replace('_', ' ').toUpperCase()}
                                                </span>
                                            )}
                                            {payroll.leaveDays > 0 && (
                                                <span className="text-amber-600 font-medium">
                                                    LOP: {payroll.leaveDays} days (−₹{(payroll.lopAmount || 0).toLocaleString()})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TeacherPayroll;
