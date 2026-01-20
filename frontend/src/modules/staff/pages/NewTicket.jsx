import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MessageSquare } from 'lucide-react';

const NewTicket = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        subject: '',
        entityType: 'Student',
        entityId: '',
        priority: 'Low',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/staff/support');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => navigate('/staff/support')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Create New Ticket</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subject</label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder="e.g. Bus Route Issue due to Construction"
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Related To</label>
                            <select
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.entityType}
                                onChange={e => setFormData({ ...formData, entityType: e.target.value })}
                            >
                                <option>Student</option>
                                <option>Teacher</option>
                                <option>Employee</option>
                                <option>General</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">ID / Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                placeholder="e.g. 10-A Aarav"
                                value={formData.entityId}
                                onChange={e => setFormData({ ...formData, entityId: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Priority</label>
                        <div className="flex gap-2">
                            {['Low', 'Medium', 'High'].map(p => (
                                <button
                                    type="button"
                                    key={p}
                                    onClick={() => setFormData({ ...formData, priority: p })}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.priority === p
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Message / Description</label>
                        <textarea
                            required
                            rows={5}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"
                            placeholder="Describe the issue in detail..."
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 md:sticky md:bottom-0 md:rounded-xl z-20">
                    <button type="submit" disabled={isLoading} className="w-full px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                        {isLoading ? 'Creating...' : <><MessageSquare size={18} /> Create Ticket</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewTicket;
