import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/app/api';
import { Plus, Pencil, Trash2, HelpCircle, ChevronDown } from 'lucide-react';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ question: '', answer: '', category: 'General', order: 0 });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const token = localStorage.getItem('token');

    const fetchFAQs = async () => {
        try {
            const res = await axios.get(`${API_URL}/faq`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setFaqs(res.data.data || []);
        } catch (err) {
            console.error('FAQ fetch error:', err);
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (editingId) {
                await axios.put(`${API_URL}/faq/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/faq`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setFormData({ question: '', answer: '', category: 'General', order: 0 });
            setEditingId(null);
            setShowForm(false);
            fetchFAQs();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save FAQ');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (faq) => {
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category || 'General',
            order: faq.order ?? 0
        });
        setEditingId(faq._id);
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setSubmitLoading(true);
        try {
            await axios.delete(`${API_URL}/faq/${deleteConfirm}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeleteConfirm(null);
            fetchFAQs();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete FAQ');
        } finally {
            setSubmitLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ question: '', answer: '', category: 'General', order: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    const grouped = faqs.reduce((acc, f) => {
        const cat = f.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(f);
        return acc;
    }, {});

    const categories = [...new Set(faqs.map(f => f.category || 'General'))].sort();

    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 relative">
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">FAQ Management</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        Add & manage FAQs visible in Teacher, Student & Parent portals
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md text-sm font-medium"
                >
                    <Plus size={18} /> Add FAQ
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="mt-4 text-sm text-gray-500 font-medium">Loading FAQs...</p>
                    </div>
                ) : showForm ? (
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <HelpCircle size={20} /> {editingId ? 'Edit FAQ' : 'Add New FAQ'}
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                            <input
                                type="text"
                                value={formData.question}
                                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. How to reset password?"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                            <textarea
                                value={formData.answer}
                                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                placeholder="Detailed answer..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. General, Fees, Attendance"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order (lower = first)</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData(prev => ({ ...prev, order: +e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                min="0"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-60"
                            >
                                {submitLoading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
                            </button>
                            <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : faqs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No FAQs yet</p>
                        <p className="text-sm text-gray-400 mt-1">Add FAQs to show in Teacher, Student & Parent help pages</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                        >
                            Add First FAQ
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-4xl">
                        {Object.entries(grouped).map(([cat, items]) => (
                            <div key={cat} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <ChevronDown size={14} /> {cat}
                                </div>
                                <ul className="divide-y divide-gray-100">
                                    {items.map(faq => (
                                        <li key={faq._id} className="flex items-start justify-between gap-4 p-4 hover:bg-gray-50/50">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900">{faq.question}</p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleEdit(faq)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(faq._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
                        <p className="text-gray-800 font-medium">Delete this FAQ?</p>
                        <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleDelete}
                                disabled={submitLoading}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-60"
                            >
                                {submitLoading ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQ;
