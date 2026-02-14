import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ExternalLink, RefreshCw } from 'lucide-react';
import { getExpense } from '../services/expenses.api';

const ExpenseInvoiceView = () => {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const [expense, setExpense] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!expenseId) return;
            setLoading(true);
            try {
                const data = await getExpense(expenseId);
                setExpense(data);
            } catch (err) {
                setExpense(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [expenseId]);

    const invoiceUrl = expense?.invoiceUrl;
    const title = expense?.title || 'Invoice';
    const isImage = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(invoiceUrl || '');

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
                <RefreshCw size={40} className="animate-spin text-white mb-4" />
                <p className="text-white/80">Loading invoice...</p>
            </div>
        );
    }

    if (!invoiceUrl) {
        return (
            <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6">
                <p className="text-white/90 text-center mb-6">No invoice available for this expense</p>
                <button
                    onClick={() => navigate(`/staff/expenses/${expenseId}`)}
                    className="px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-colors"
                >
                    Back to Expense
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10 shrink-0">
                <div className="text-white min-w-0 flex-1">
                    <h3 className="font-bold text-sm truncate">{title} - Invoice</h3>
                    <p className="text-[10px] text-gray-400">Fullscreen view</p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-indigo-400 hover:text-indigo-300 font-bold text-xs flex items-center gap-1"
                    >
                        <ExternalLink size={18} /> Open in new tab
                    </a>
                    <button
                        onClick={() => navigate(`/staff/expenses/${expenseId}`)}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={22} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 min-h-0 bg-gray-900">
                {isImage ? (
                    <img
                        src={invoiceUrl}
                        alt="Invoice"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        style={{ maxHeight: 'calc(100vh - 80px)' }}
                    />
                ) : (
                    <iframe
                        src={invoiceUrl}
                        title="Invoice"
                        className="w-full max-w-4xl h-full min-h-[80vh] bg-white rounded-lg shadow-2xl"
                    />
                )}
            </div>
        </div>
    );
};

export default ExpenseInvoiceView;
