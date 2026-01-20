import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import {
    ArrowLeft, Calendar, FileText, CheckCircle, Clock,
    Banknote, Download, AlertTriangle, Printer, ChevronRight
} from 'lucide-react';

const MOCK_HISTORY = [
    { id: 'PAY-SEP', month: 'September 2024', gross: 45000, deductions: 2000, net: 43000, status: 'Paid', date: '2024-10-01' },
    { id: 'PAY-AUG', month: 'August 2024', gross: 45000, deductions: 2500, net: 42500, status: 'Paid', date: '2024-09-01' },
    { id: 'PAY-JUL', month: 'July 2024', gross: 45000, deductions: 2000, net: 43000, status: 'Paid', date: '2024-08-01' },
];

const PayrollDetail = () => {
    const { personId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    // Mock Data based on personId usually
    const employee = {
        name: 'Suresh Kumar',
        id: personId || 'TCH-001',
        role: 'Teacher',
        dept: 'Science',
        salaryStructure: {
            base: 30000,
            hra: 10000,
            allowance: 5000,
            pf: 1800,
            tds: 200
        }
    };

    const currentMonth = {
        name: 'October 2024',
        status: 'Pending'
    };

    const handleProcessPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setConfirmModal(false);
            // In real app, refresh data
            alert('Salary Processed Successfully!');
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center gap-4 shadow-sm">
                <button onClick={() => navigate('/staff/payroll')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{employee.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{employee.id}</span>
                        <span>•</span>
                        <span>{employee.role} ({employee.dept})</span>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* 1. Salary Structure Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Banknote size={16} className="text-indigo-600" /> Salary Structure
                        </h2>
                        {user?.role === STAFF_ROLES.ACCOUNTS && (
                            <button className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
                        )}
                    </div>
                    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StructureItem label="Base Pay" value={employee.salaryStructure.base} />
                        <StructureItem label="HRA" value={employee.salaryStructure.hra} />
                        <StructureItem label="Allowances" value={employee.salaryStructure.allowance} />
                        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                        <StructureItem label="Deductions (PF+TDS)" value={employee.salaryStructure.pf + employee.salaryStructure.tds} isNegative />
                    </div>
                    <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center">
                        <span className="text-sm font-bold text-indigo-900">Net Take Home</span>
                        <span className="text-lg font-bold text-indigo-700">₹{(employee.salaryStructure.base + employee.salaryStructure.hra + employee.salaryStructure.allowance - employee.salaryStructure.pf - employee.salaryStructure.tds).toLocaleString()}</span>
                    </div>
                </div>

                {/* 2. Process Current Month */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">Process Salary: {currentMonth.name}</h2>
                            <p className="text-xs text-gray-500 mt-1">Status: <span className="text-amber-600 font-bold">Unpaid</span></p>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-full text-amber-500">
                            <Clock size={20} />
                        </div>
                    </div>

                    {user?.role === STAFF_ROLES.ACCOUNTS && (
                        <div className="flex justify-end pt-2 border-t border-gray-50">
                            <button
                                onClick={() => setConfirmModal(true)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                Mark as Paid
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. Payment History */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <h2 className="text-sm font-bold text-gray-900">Payment History</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {MOCK_HISTORY.map(item => (
                            <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{item.month}</p>
                                    <p className="text-xs text-gray-500">Paid on: {item.date}</p>
                                </div>
                                <div className="flex items-center justify-between md:gap-8 flex-1 md:flex-none">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-800">₹{item.net.toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-400">Net Pay</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                                            {item.status}
                                        </span>
                                        <button
                                            onClick={() => navigate(`/staff/payroll/${personId}/slip`)}
                                            className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                        >
                                            <Download size={14} /> Slip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl animate-scale-up">
                        <div className="flex items-center gap-3 text-indigo-600 mb-4">
                            <AlertTriangle size={24} />
                            <h3 className="text-lg font-bold text-gray-900">Confirm Payment</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to mark <strong>{currentMonth.name}</strong> salary as PAID for <strong>{employee.name}</strong>?
                            <br /><br />
                            <span className="text-xs text-gray-400">This action will be logged and cannot be undone easily.</span>
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button
                                onClick={handleProcessPayment}
                                disabled={isProcessing}
                                className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2"
                            >
                                {isProcessing ? 'Processing...' : 'Confirm Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub Component
const StructureItem = ({ label, value, isNegative }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">{label}</label>
        <p className={`text-sm font-bold ${isNegative ? 'text-red-500' : 'text-gray-800'}`}>
            {isNegative ? '-' : ''}₹{value.toLocaleString()}
        </p>
    </div>
);

export default PayrollDetail;
