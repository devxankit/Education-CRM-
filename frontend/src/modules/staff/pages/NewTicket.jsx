
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, MessageSquare } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';

const NewTicket = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams();
    const isEditMode = !!ticketId;

    const tickets = useStaffStore(state => state.tickets);
    const students = useStaffStore(state => state.students);
    const fetchStudents = useStaffStore(state => state.fetchStudents);
    const addTicketAction = useStaffStore(state => state.addTicketAction);
    const updateTicketAction = useStaffStore(state => state.updateTicketAction);

    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        topic: '',
        priority: 'Normal',
        category: 'General',
        studentId: '',
        details: ''
    });

    useEffect(() => {
        if (students.length === 0) fetchStudents();
    }, [fetchStudents, students.length]);

    // Fetch data for edit mode
    useEffect(() => {
        if (isEditMode) {
            const ticket = tickets.find(t => t.id === ticketId || t._id === ticketId);
            if (ticket) {
                setFormData({
                    topic: ticket.topic || '',
                    priority: ticket.priority || 'Normal',
                    category: ticket.category || 'General',
                    studentId: ticket.studentId?._id || ticket.studentId || '',
                    details: ticket.details || ''
                });
            }
        }
    }, [isEditMode, ticketId, tickets]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.studentId) {
            alert("Please select a student");
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                await updateTicketAction(ticketId, formData);
            } else {
                await addTicketAction(formData);
            }
            alert(`Support Ticket ${isEditMode ? 'Updated' : 'Created'} Successfully!`);
            navigate('/staff/support');
        } catch (err) {
            alert("Operation failed: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
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
                        <label className="text-xs font-medium text-gray-500">Subject / Topic</label>
                        <input
                            required
                            name="topic"
                            value={formData.topic}
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
                                <option value="Low">Low</option>
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
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
                                <option value="General">General</option>
                                <option value="Academic">Academic</option>
                                <option value="Fee Related">Fee Related</option>
                                <option value="Homework">Homework</option>
                                <option value="Correction">Correction</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Select Student</label>
                        <select
                            required
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                            <option value="">-- Choose Student --</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.firstName} {s.lastName} ({s.admissionNo})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Detailed Description</label>
                        <textarea
                            required
                            name="details"
                            value={formData.details}
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
