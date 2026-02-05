
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, MessageSquare } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';

const NewTicket = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams();
    const isEditMode = !!ticketId;

    // Use separate selectors to prevent infinite loops
    const tickets = useStaffStore(state => state.tickets);
    const addTicket = useStaffStore(state => state.addTicket);
    const updateTicket = useStaffStore(state => state.updateTicket);

    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        priority: 'Medium',
        category: 'General',
        student: '',
        description: ''
    });

    // Fetch data for edit mode
    useEffect(() => {
        if (isEditMode) {
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
                setFormData({
                    title: ticket.title || '',
                    priority: ticket.priority || 'Medium',
                    category: ticket.category || 'General',
                    student: ticket.student || '',
                    description: ticket.description || ''
                });
            }
        }
    }, [isEditMode, ticketId, tickets]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if (isEditMode) {
                updateTicket(ticketId, formData);
            } else {
                addTicket(formData);
            }
            setLoading(false);
            alert(`Support Ticket ${isEditMode ? 'Updated' : 'Created'} Successfully!`);
            navigate('/staff/support');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto pb-20 md:pb-6 min-h-screen p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Ticket' : 'Raise New Ticket'}</h1>
                    <p className="text-xs text-gray-500">{isEditMode ? 'Update support request' : 'Submit a new support request'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Subject / Title</label>
                        <input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            type="text"
                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Fee Payment Issue"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Urgent</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option>General</option>
                                <option>Fees</option>
                                <option>Transport</option>
                                <option>Academics</option>
                                <option>IT Support</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Student Name / ID (If applicable)</label>
                        <input
                            name="student"
                            value={formData.student}
                            onChange={handleChange}
                            type="text"
                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Aarav Gupta (STU-101)"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Description</label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Describe the issue in detail..."
                        ></textarea>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:bg-gray-400"
                >
                    <Save size={20} /> {loading ? 'Processing...' : (isEditMode ? 'Update Ticket' : 'Raise Ticket')}
                </button>
            </form>
        </div>
    );
};

export default NewTicket;
