import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { getPayroll } from '../services/payroll.api';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const PayslipView = () => {
    const { rollId } = useParams();
    const navigate = useNavigate();
    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!rollId) return;
        getPayroll(rollId).then((data) => {
            setPayroll(data);
        }).finally(() => setLoading(false));
    }, [rollId]);

    const handlePrint = () => window.print();

    if (loading || !payroll) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">{loading ? 'Loading...' : 'Payslip not found'}</p>
            </div>
        );
    }

    const emp = payroll.employeeId;
    const empName = emp?.name || [emp?.firstName, emp?.lastName].filter(Boolean).join(' ') || 'Unknown';
    const monthLabel = `${MONTH_NAMES[payroll.month]} ${payroll.year}`;
    const earnings = (payroll.components || []).filter(c => c.type === 'earning');
    const deductions = (payroll.components || []).filter(c => c.type === 'deduction');
    const paymentDate = payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 md:static flex justify-between items-center print:hidden z-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-bold text-sm hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={18} /> Back
                </button>
                <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
                    <Printer size={16} /> Print
                </button>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 shadow-lg rounded-none md:rounded-xl print:shadow-none print:w-full">
                    <div className="text-center border-b-2 border-gray-100 pb-6 mb-6">
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wide">Institution Name</h1>
                        <p className="text-sm text-gray-500 mt-1">Payslip</p>
                        <h2 className="text-lg font-bold text-indigo-700 mt-4 underline decoration-2 decoration-indigo-200 underline-offset-4">PAYSLIP FOR {monthLabel.toUpperCase()}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Employee Name</p>
                            <p className="font-bold text-gray-900">{empName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Employee ID</p>
                            <p className="font-bold text-gray-900">{emp?.employeeId || payroll.employeeId?._id?.toString().slice(-6) || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Designation</p>
                            <p className="font-bold text-gray-900">{payroll.employeeType === 'teacher' ? 'Teacher' : 'Staff'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Bank Details</p>
                            <p className="font-medium text-gray-700">{payroll.bankAccountNumber ? `****${String(payroll.bankAccountNumber).slice(-4)}` : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Payment Date</p>
                            <p className="font-medium text-gray-700">{paymentDate}</p>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                        <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
                            <div className="p-3 border-r border-gray-200 text-center font-bold text-gray-600 text-sm uppercase">Earnings</div>
                            <div className="p-3 text-center font-bold text-gray-600 text-sm uppercase">Deductions</div>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                            <div className="border-r border-gray-200 p-4 space-y-3">
                                {earnings.length > 0 ? earnings.map((c, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="text-gray-600">{c.name}</span>
                                        <span className="font-bold text-gray-900">₹{(c.amount || 0).toLocaleString()}</span>
                                    </div>
                                )) : <p className="text-gray-400">—</p>}
                            </div>
                            <div className="p-4 space-y-3">
                                {deductions.length > 0 ? deductions.map((c, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="text-gray-600">{c.name}</span>
                                        <span className="font-bold text-gray-900">₹{(c.amount || 0).toLocaleString()}</span>
                                    </div>
                                )) : payroll.lopAmount > 0 ? (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">LOP ({payroll.leaveDays} days)</span>
                                        <span className="font-bold text-gray-900">₹{(payroll.lopAmount || 0).toLocaleString()}</span>
                                    </div>
                                ) : <p className="text-gray-400">—</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 bg-indigo-50 border-t border-gray-200">
                            <div className="p-3 border-r border-gray-200 flex justify-between font-bold text-indigo-900">
                                <span>Total Earnings</span>
                                <span>₹{(payroll.totalEarnings || 0).toLocaleString()}</span>
                            </div>
                            <div className="p-3 flex justify-between font-bold text-red-700">
                                <span>Total Deductions</span>
                                <span>₹{(payroll.totalDeductions || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-4 rounded-lg flex justify-between items-center mb-8 print:bg-gray-100 print:text-black print:border print:border-black">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 print:text-gray-600">Net Payable Amount</p>
                            <p className="text-2xl font-mono font-bold">₹{(payroll.netSalary || 0).toLocaleString()}.00</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 print:text-gray-600">Paid on</p>
                            <p className="font-bold">{paymentDate}</p>
                        </div>
                    </div>

                    <div className="text-center text-[10px] text-gray-400 mt-12 print:mt-20">
                        <p>This is a computer generated payslip and does not require a signature.</p>
                        <p className="mt-1 font-mono">Generated on: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayslipView;
