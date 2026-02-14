import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { ArrowLeft, FileText, Banknote, Calendar, Tag, Store, RefreshCw, ExternalLink } from 'lucide-react';
import { getExpense } from '../services/expenses.api';

const ExpenseDetail = () => {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [expense, setExpense] = useState(null);
    const [loading, setLoading] = useState(true);

    const hasAccess = [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN, STAFF_ROLES.TRANSPORT].includes(user?.role);

    const fetchData = async () => {
        if (!expenseId) return;
        setLoading(true);
        try {
            const data = await getExpense(expenseId);
            setExpense(data);
        } catch (err) {
            console.error('Failed to fetch expense', err);
            setExpense(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [expenseId]);

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400"><Banknote size={32} /></div>
                <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
                <p className="text-sm text-gray-500 mt-2">Only Accounts team can view expense details.</p>
            </div>
        );
    }

    if (loading && !expense) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <RefreshCw size={32} className="animate-spin text-indigo-500 mb-4" />
                <p className="text-gray-500">Loading expense...</p>
            </div>
        );
    }

    if (!expense) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">Expense not found</p>
                <button onClick={() => navigate('/staff/expenses')} className="mt-4 text-indigo-600 font-bold">← Back to Expenses</button>
            </div>
        );
    }

    const dateStr = expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
    const category = expense.categoryId?.name || expense.category || '-';
    const branch = expense.branchId?.name || '-';
    const isPaid = expense.status === 'Paid';

    return (
        <div className="max-w-2xl mx-auto pb-24 md:pb-10 min-h-screen bg-gray-50">
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center gap-4 shadow-sm">
                <button onClick={() => navigate('/staff/expenses')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{expense.title || 'Untitled Expense'}</h1>
                    <p className="text-sm text-gray-500">{dateStr}</p>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                <Banknote size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">₹{(expense.amount || 0).toLocaleString()}</p>
                                <span className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-lg ${
                                    isPaid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                    {expense.status || 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-4">
                        <DetailRow icon={FileText} label="Title" value={expense.title || '-'} />
                        <DetailRow icon={Tag} label="Category" value={category} />
                        <DetailRow icon={Store} label="Vendor" value={expense.vendorName || '-'} />
                        <DetailRow icon={Calendar} label="Date" value={dateStr} />
                        <DetailRow icon={Banknote} label="Branch" value={branch} />
                        {expense.paymentMethod && <DetailRow icon={Banknote} label="Payment Method" value={expense.paymentMethod} />}
                        {expense.transactionId && <DetailRow icon={FileText} label="Transaction ID" value={expense.transactionId} />}
                        {expense.remarks && <DetailRow icon={FileText} label="Remarks" value={expense.remarks} />}
                    </div>
                </div>

                {expense.invoiceUrl && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                            <FileText size={16} /> Invoice / Receipt
                        </h3>
                        <a
                            href={expense.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors border border-indigo-200"
                        >
                            <ExternalLink size={18} /> View Invoice (Open in new tab)
                        </a>
                        <button
                            onClick={() => navigate(`/staff/expenses/${expenseId}/invoice`)}
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 mt-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                            <FileText size={18} /> Fullscreen Invoice View
                        </button>
                    </div>
                )}

                {!expense.invoiceUrl && (
                    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-5 text-center">
                        <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No invoice uploaded for this expense</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <Icon size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
        </div>
    </div>
);

export default ExpenseDetail;
