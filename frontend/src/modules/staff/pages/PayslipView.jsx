import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Share2 } from 'lucide-react';

const PayslipView = () => {
    const { personId } = useParams();
    const navigate = useNavigate();

    // Mock Data for Payslip
    const payslip = {
        month: 'September 2024',
        name: 'Suresh Kumar',
        id: personId || 'TCH-001',
        designation: 'Senior Teacher',
        department: 'Science',
        doj: '15-Jun-2019',
        bank: 'HDFC Bank (XXXX-1234)',
        earnings: [
            { label: 'Basic Salary', amount: 30000 },
            { label: 'HRA', amount: 10000 },
            { label: 'Special Allowance', amount: 5000 },
        ],
        deductions: [
            { label: 'Provident Fund', amount: 1800 },
            { label: 'Tax (TDS)', amount: 200 },
        ],
        netPay: 43000
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Action Bar (No Print) */}
            <div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 md:static flex justify-between items-center print:hidden z-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-bold text-sm hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
                        <Printer size={16} /> Print
                    </button>
                </div>
            </div>

            {/* Payslip Paper */}
            <div className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 shadow-lg rounded-none md:rounded-xl print:shadow-none print:w-full">

                    {/* Header */}
                    <div className="text-center border-b-2 border-gray-100 pb-6 mb-6">
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wide">Institution Name</h1>
                        <p className="text-sm text-gray-500 mt-1">123, Education City, Knowledge Park, New Delhi - 110001</p>
                        <h2 className="text-lg font-bold text-indigo-700 mt-4 underline decoration-2 decoration-indigo-200 underline-offset-4">PAYSLIP FOR {payslip.month.toUpperCase()}</h2>
                    </div>

                    {/* Employee Info */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Employee Name</p>
                            <p className="font-bold text-gray-900">{payslip.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Employee ID</p>
                            <p className="font-bold text-gray-900">{payslip.id}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Designation</p>
                            <p className="font-bold text-gray-900">{payslip.designation}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Department</p>
                            <p className="font-bold text-gray-900">{payslip.department}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Bank Details</p>
                            <p className="font-medium text-gray-700">{payslip.bank}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Date of Joining</p>
                            <p className="font-medium text-gray-700">{payslip.doj}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                        <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
                            <div className="p-3 border-r border-gray-200 text-center font-bold text-gray-600 text-sm uppercase">Earnings</div>
                            <div className="p-3 text-center font-bold text-gray-600 text-sm uppercase">Deductions</div>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                            {/* Earnings Column */}
                            <div className="border-r border-gray-200 p-4 space-y-3">
                                {payslip.earnings.map((item, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="text-gray-600">{item.label}</span>
                                        <span className="font-bold text-gray-900">₹{item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Deductions Column */}
                            <div className="p-4 space-y-3">
                                {payslip.deductions.map((item, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="text-gray-600">{item.label}</span>
                                        <span className="font-bold text-gray-900">₹{item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 bg-indigo-50 border-t border-gray-200">
                            <div className="p-3 border-r border-gray-200 flex justify-between font-bold text-indigo-900">
                                <span>Total Earnings</span>
                                <span>₹{payslip.earnings.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                            </div>
                            <div className="p-3 flex justify-between font-bold text-red-700">
                                <span>Total Deductions</span>
                                <span>₹{payslip.deductions.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Net Pay Box */}
                    <div className="bg-gray-900 text-white p-4 rounded-lg flex justify-between items-center mb-8 print:bg-gray-100 print:text-black print:border print:border-black">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 print:text-gray-600">Net Payable Amount</p>
                            <p className="text-2xl font-mono font-bold">₹{payslip.netPay.toLocaleString()}.00</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 print:text-gray-600">Paid on</p>
                            <p className="font-bold">01 Oct 2024</p>
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
