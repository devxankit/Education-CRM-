import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import {
    ArrowLeft, FileText, CheckCircle, Clock,
    Banknote, Download, AlertTriangle, RefreshCw
} from 'lucide-react';
import { getPayroll, getPayrolls, updatePayroll } from '../services/payroll.api';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const PayrollDetail = () => {
    const { rollId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [payroll, setPayroll] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    const fetchData = async () => {
        if (!rollId) return;
        setLoading(true);
        try {
            const data = await getPayroll(rollId);
            setPayroll(data);
            if (data?.employeeId) {
                const empId = data.employeeId._id || data.employeeId;
                const hist = await getPayrolls({ employeeId: empId });
                const sorted = (hist || [])
                    .filter(p => (p._id || p.id) !== rollId)
                    .sort((a, b) => {
                        const da = new Date(a.year, a.month - 1);
                        const db = new Date(b.year, b.month - 1);
                        return db - da;
                    })
                    .slice(0, 12);
                setHistory(sorted);
            } else {
                setHistory([]);
            }
        } catch (err) {
            console.error('Failed to fetch payroll detail', err);
            setPayroll(null);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [rollId]);

    const handleMarkPaid = async () => {
        setIsProcessing(true);
        try {
            const res = await updatePayroll(rollId, {
                status: 'paid',
                paymentDate: new Date().toISOString(),
                paymentMethod: 'bank_transfer'
            });
            if (res.success) {
                setConfirmModal(false);
                fetchData();
            } else {
                alert(res.message || 'Failed to update');
            }
        } catch (err) {
            alert(err?.message || 'Failed to update payroll');
        } finally {
            setIsProcessing(false);
        }
    };

    const employee = payroll?.employeeId;
    const empName = employee?.name || [employee?.firstName, employee?.lastName].filter(Boolean).join(' ') || 'Unknown';
    const empRole = payroll?.employeeType === 'teacher' ? 'Teacher' : 'Staff';
    const earnings = (payroll?.components || []).filter(c => c.type === 'earning');
    const deductions = (payroll?.components || []).filter(c => c.type === 'deduction');

    if (loading && !payroll) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <RefreshCw size={32} className="animate-spin text-indigo-500 mb-4" />
                <p className="text-gray-500">Loading payroll...</p>
            </div>
        );
    }

    if (!payroll) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">Payroll not found</p>
                <button onClick={() => navigate('/staff/payroll')} className="mt-4 text-indigo-600 font-bold">← Back to Payroll</button>
            </div>
        );
    }

    const currentMonthName = `${MONTH_NAMES[payroll.month]} ${payroll.year}`;
    const isPaid = payroll.status === 'paid';

    return (
        <div className="max-w-5xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center gap-4 shadow-sm">
                <button onClick={() => navigate('/staff/payroll')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{empName}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{employee?.employeeId || payroll.employeeId?._id?.toString().slice(-6) || 'N/A'}</span>
                        <span>•</span>
                        <span>{empRole} • {currentMonthName}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* Salary Structure Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Banknote size={16} className="text-indigo-600" /> Salary Structure
                        </h2>
                    </div>
                    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {earnings.map((c, i) => (
                            <StructureItem key={i} label={c.name} value={c.amount} />
                        ))}
                        {deductions.map((c, i) => (
                            <StructureItem key={`d-${i}`} label={c.name} value={c.amount} isNegative />
                        ))}
                    </div>
                    <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center">
                        <span className="text-sm font-bold text-indigo-900">Net Take Home</span>
                        <span className="text-lg font-bold text-indigo-700">₹{(payroll.netSalary || 0).toLocaleString()}</span>
                    </div>
                </div>

                {/* Current Month Status */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">Salary: {currentMonthName}</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Status: <span className={isPaid ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>
                                    {isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                            </p>
                        </div>
                        <div className={`p-2 rounded-full ${isPaid ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                            {isPaid ? <CheckCircle size={20} /> : <Clock size={20} />}
                        </div>
                    </div>

                    {user?.role === STAFF_ROLES.ACCOUNTS && !isPaid && (
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

                {/* Payment History */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <h2 className="text-sm font-bold text-gray-900">Payment History</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {history.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">No prior payroll records</div>
                        ) : (
                            history.map(item => (
                                <div key={item._id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{MONTH_NAMES[item.month]} {item.year}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.paymentDate ? `Paid: ${new Date(item.paymentDate).toLocaleDateString()}` : '—'}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between md:gap-8 flex-1 md:flex-none">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-800">₹{(item.netSalary || 0).toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-400">Net Pay</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                item.status === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {item.status === 'paid' ? 'Paid' : item.status || 'Pending'}
                                            </span>
                                            <button
                                                onClick={() => navigate(`/staff/payroll/${item._id}/slip`)}
                                                className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                            >
                                                <Download size={14} /> Slip
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {confirmModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl animate-scale-up">
                        <div className="flex items-center gap-3 text-indigo-600 mb-4">
                            <AlertTriangle size={24} />
                            <h3 className="text-lg font-bold text-gray-900">Confirm Payment</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Mark <strong>{currentMonthName}</strong> salary as PAID for <strong>{empName}</strong>?
                            <br /><br />
                            <span className="text-xs text-gray-400">Amount: ₹{(payroll.netSalary || 0).toLocaleString()}</span>
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button
                                onClick={handleMarkPaid}
                                disabled={isProcessing}
                                className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2"
                            >
                                {isProcessing ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StructureItem = ({ label, value, isNegative }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">{label}</label>
        <p className={`text-sm font-bold ${isNegative ? 'text-red-500' : 'text-gray-800'}`}>
            {isNegative ? '-' : ''}₹{(value || 0).toLocaleString()}
        </p>
    </div>
);

export default PayrollDetail;
