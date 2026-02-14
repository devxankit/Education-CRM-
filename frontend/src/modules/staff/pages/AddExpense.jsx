import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, RefreshCw, FileText, X, Upload, ShieldCheck } from 'lucide-react';
import { getExpenseResources, createExpense, uploadInvoice } from '../services/expenses.api';

const AddExpense = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [resources, setResources] = useState(null);
    const [loadingRes, setLoadingRes] = useState(true);

    const [formData, setFormData] = useState({
        branchId: '',
        categoryId: '',
        title: '',
        vendorName: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        approvalRequired: true,
        invoiceUrl: ''
    });
    const [uploadingInvoice, setUploadingInvoice] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoadingRes(true);
            const res = await getExpenseResources();
            setResources(res);
            if (res?.defaultBranchId) {
                setFormData(prev => ({ ...prev, branchId: res.defaultBranchId }));
            } else if (res?.branches?.[0]?._id) {
                setFormData(prev => ({ ...prev, branchId: res.branches[0]._id }));
            }
            setLoadingRes(false);
        };
        load();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Please enter title and valid amount');
            return;
        }
        if (!formData.branchId) {
            alert('Please select a branch');
            return;
        }
        setIsLoading(true);
        try {
            const res = await createExpense({
                branchId: formData.branchId,
                categoryId: formData.categoryId || undefined,
                title: formData.title,
                vendorName: formData.vendorName || undefined,
                amount: parseFloat(formData.amount),
                expenseDate: formData.expenseDate,
                status: formData.status,
                approvalRequired: formData.approvalRequired,
                invoiceUrl: formData.invoiceUrl || undefined
            });
            if (res?.success) {
                navigate('/staff/expenses');
            } else {
                alert(res?.message || 'Failed to save expense');
            }
        } catch (err) {
            alert(err?.message || 'Failed to save expense');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvoiceUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid file: JPG, PNG, WebP or PDF (max 5MB)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be under 5MB');
            return;
        }
        setUploadingInvoice(true);
        try {
            const url = await uploadInvoice(file);
            setFormData(prev => ({ ...prev, invoiceUrl: url }));
        } catch (err) {
            alert(err?.message || 'Failed to upload invoice');
        } finally {
            setUploadingInvoice(false);
            e.target.value = '';
        }
    };

    const removeInvoice = () => setFormData(prev => ({ ...prev, invoiceUrl: '' }));

    if (loadingRes) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw size={32} className="animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center gap-3">
                <button onClick={() => navigate('/staff/expenses')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Record Expense</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 pb-44 md:pb-8 space-y-5">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Expense Title *</label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder="e.g. Office Paper Supply"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Branch *</label>
                            <select
                                required
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.branchId}
                                onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                            >
                                <option value="">Select Branch</option>
                                {(resources?.branches || []).map(b => (
                                    <option key={b._id} value={b._id}>{b.name || b.code}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category</label>
                            <select
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {(resources?.categories || []).map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Vendor Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder="e.g. Raj Stationery"
                            value={formData.vendorName}
                            onChange={e => setFormData({ ...formData, vendorName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Amount *</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date *</label>
                            <input
                                required
                                type="date"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.expenseDate}
                                onChange={e => setFormData({ ...formData, expenseDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
                        <div className="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm font-bold">
                            Pending — Admin will approve & mark Paid
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex gap-3">
                        <div className="shrink-0 mt-0.5">
                            <input
                                type="checkbox"
                                id="approvalReq"
                                checked={formData.approvalRequired}
                                onChange={e => setFormData({ ...formData, approvalRequired: e.target.checked })}
                                className="w-4 h-4 text-indigo-600 rounded border-blue-200 focus:ring-indigo-500 cursor-pointer"
                            />
                        </div>
                        <label htmlFor="approvalReq" className="cursor-pointer select-none">
                            <span className="block text-sm font-bold text-blue-900 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-blue-500" /> Require Manager Approval
                            </span>
                            <p className="text-xs text-blue-600/80 mt-0.5">
                                Expense will need sign-off by Finance Head before marking as paid.
                            </p>
                        </label>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Upload Invoice / Receipt</label>
                    <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px] transition-all ${
                        uploadingInvoice ? 'border-indigo-300 bg-indigo-50' : formData.invoiceUrl ? 'border-green-200 bg-green-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                    }`}>
                        {formData.invoiceUrl ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-2 rounded-full bg-green-100">
                                    <FileText size={28} className="text-green-600" />
                                </div>
                                <span className="text-sm font-bold text-green-700">Invoice uploaded</span>
                                <a href={formData.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline truncate max-w-full">View file</a>
                                <button type="button" onClick={removeInvoice} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold">
                                    <X size={14} /> Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <label className="cursor-pointer flex flex-col items-center gap-2">
                                    <div className={`p-2 rounded-full ${uploadingInvoice ? 'bg-indigo-100 animate-pulse' : 'bg-gray-100'}`}>
                                        <Upload size={24} className="text-gray-500" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-600">{uploadingInvoice ? 'Uploading...' : 'Tap to upload invoice'}</span>
                                    <span className="text-xs text-gray-400">JPG, PNG, WebP or PDF (max 5MB)</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,application/pdf"
                                        className="hidden"
                                        onChange={handleInvoiceUpload}
                                        disabled={uploadingInvoice}
                                    />
                                </label>
                            </>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-20 left-0 right-0 bg-white p-4 border-t border-gray-200 md:sticky md:bottom-0 md:rounded-xl z-30 shadow-lg md:z-10">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-8 py-3.5 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? 'Creating...' : <><Plus size={20} /> Create Expense</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddExpense;
