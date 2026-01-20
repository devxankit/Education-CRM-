import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, IndianRupee, Save } from 'lucide-react';

const AddExpense = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Simplistic Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Supplies',
        vendor: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/staff/expenses');
        }, 1000);
    };

    return (
        <div className="max-w-xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center gap-3">
                <button onClick={() => navigate('/staff/expenses')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Record Expense</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">

                {/* 1. Basic Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Expense Title</label>
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
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category</label>
                            <select
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Supplies</option>
                                <option>Transport</option>
                                <option>Maintenance</option>
                                <option>Utility</option>
                                <option>Internet</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Vendor</label>
                            <select
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.vendor}
                                onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                            >
                                <option value="">Select Vendor</option>
                                <option value="V-001">City Fuels</option>
                                <option value="V-002">Jio Fiber</option>
                                <option value="V-003">Raj Stationery</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Amount & Payment */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Amount</label>
                            <div className="relative">
                                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    required
                                    type="number"
                                    className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date</label>
                            <input
                                required
                                type="date"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Payment Status</label>
                        <div className="flex gap-4">
                            {['Paid', 'Pending'].map(status => (
                                <label key={status} className={`flex-1 border rounded-lg p-3 flex items-center justify-center cursor-pointer transition-all ${formData.status === status ? (status === 'Paid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700') : 'bg-white border-gray-200 text-gray-500'}`}>
                                    <input type="radio" name="status" value={status} checked={formData.status === status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="hidden" />
                                    <span className="font-bold text-sm">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Attachments */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-dashed border-2 flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3 text-indigo-600">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm font-bold text-gray-700">Upload Invoice / Bill</p>
                    <p className="text-xs text-gray-400 mt-1">PDF or JPG up to 5MB</p>
                </div>

                {/* Submit */}
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 md:sticky md:bottom-0 md:rounded-xl z-20">
                    <button type="submit" disabled={isLoading} className="w-full px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                        {isLoading ? 'Saving...' : <><Save size={18} /> Save Expense Record</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddExpense;
