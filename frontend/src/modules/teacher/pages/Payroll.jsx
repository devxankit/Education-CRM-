import React, { useState, useEffect } from 'react';
import { Download, Receipt, Calendar, DollarSign, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { API_URL } from '@/app/api';
import { useTeacherStore } from '../../../store/teacherStore';

const TeacherPayroll = () => {
    const { user } = useTeacherStore();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        fetchPayrolls();
    }, [selectedYear, selectedMonth, user]);

    const fetchPayrolls = async () => {
        if (!user?._id) return;
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${API_URL}/payroll?employeeType=teacher&employeeId=${user._id}&year=${selectedYear}&month=${selectedMonth}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            const data = await response.json();
            if (data.success) {
                setPayrolls(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching payrolls:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateInvoiceHTML = (payroll) => {
        const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });
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
                        <p>For the month of ${monthName} ${selectedYear}</p>
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
        invoiceWindow.print();
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">My Payroll</h1>
                <p className="text-gray-500">View your salary details and download payslips</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                <div className="flex gap-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Payroll List */}
            {payrolls.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
                    <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No payroll records found</p>
                    <p className="text-sm text-gray-400 mt-1">Payroll for selected month/year is not available</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {payrolls.map((payroll) => {
                        const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });
                        return (
                            <div key={payroll._id || payroll.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            Salary for {monthName} {selectedYear}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {payroll.status === 'paid' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <CheckCircle size={12} />
                                                    Paid
                                                </span>
                                            )}
                                            {payroll.status === 'approved' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    <CheckCircle size={12} />
                                                    Approved
                                                </span>
                                            )}
                                            {payroll.status === 'draft' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    <FileText size={12} />
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {(payroll.status === 'paid' || payroll.status === 'approved') && (
                                            <button
                                                onClick={() => handleGenerateInvoice(payroll)}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                            >
                                                <Receipt size={16} />
                                                Generate Invoice
                                            </button>
                                        )}
                                        {payroll.status === 'paid' && (
                                            <button
                                                onClick={() => handleGenerateInvoice(payroll)}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                            >
                                                <Download size={16} />
                                                Download Payslip
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="text-xs text-gray-500 uppercase font-semibold block mb-1">Basic Salary</span>
                                        <p className="font-bold text-gray-900 text-lg">₹{payroll.basicSalary?.toLocaleString() || '0'}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <span className="text-xs text-green-600 uppercase font-semibold block mb-1">Earnings</span>
                                        <p className="font-bold text-green-700 text-lg">₹{payroll.totalEarnings?.toLocaleString() || '0'}</p>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg">
                                        <span className="text-xs text-red-600 uppercase font-semibold block mb-1">Deductions</span>
                                        <p className="font-bold text-red-700 text-lg">₹{payroll.totalDeductions?.toLocaleString() || '0'}</p>
                                    </div>
                                    <div className="bg-indigo-50 p-3 rounded-lg border-2 border-indigo-300">
                                        <span className="text-xs text-indigo-600 uppercase font-semibold block mb-1">Net Salary</span>
                                        <p className="font-bold text-indigo-900 text-xl">₹{payroll.netSalary?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>

                                {payroll.paymentDate && (
                                    <div className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
                                        <p><strong>Payment Date:</strong> {new Date(payroll.paymentDate).toLocaleDateString()}</p>
                                        {payroll.paymentMethod && (
                                            <p><strong>Payment Method:</strong> {payroll.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TeacherPayroll;
