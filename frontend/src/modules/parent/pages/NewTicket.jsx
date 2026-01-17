
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Send, Paperclip, X } from 'lucide-react';

const NewTicketPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};

    // Auto-fill form based on source context
    const [formData, setFormData] = useState({
        category: state.issueType ? state.issueType.charAt(0).toUpperCase() + state.issueType.slice(1) : 'General',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = ['General', 'Attendance', 'Fees', 'Homework', 'Transport', 'Other'];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            navigate('/parent/support');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft size={22} className="text-gray-600" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">New Support Ticket</h1>
            </header>

            <main className="max-w-md mx-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    type="button"
                                    key={cat}
                                    onClick={() => setFormData(p => ({ ...p, category: cat }))}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${formData.category === cat
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Subject</label>
                        <input
                            required
                            type="text"
                            placeholder="Briefly describe the issue..."
                            value={formData.subject}
                            onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Message</label>
                        <textarea
                            required
                            rows={6}
                            placeholder="Explain the issue in detail..."
                            value={formData.message}
                            onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-not-allowed opacity-60">
                        <Paperclip size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium">Attach Image (Optional)</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Ticket</>}
                    </button>

                </form>
            </main>
        </div>
    );
};

export default NewTicketPage;
