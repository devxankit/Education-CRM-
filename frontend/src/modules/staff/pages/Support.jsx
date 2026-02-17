import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { Search, Filter, Plus, Clock, CheckCircle, AlertCircle, ChevronRight, User, MessageSquare } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';

const Support = () => {
    const navigate = useNavigate();
    const tickets = useStaffStore(state => state.tickets);
    const fetchTickets = useStaffStore(state => state.fetchTickets);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // Access: Support (Full), Admin (Full), Others (View/Create Own)
    // For now, let's assume all staff can access the dashboard to see tickets relevant to them or generally.

    const filteredTickets = tickets.filter(ticket => {
        const topic = ticket.topic || '';
        const id = ticket.id || ticket._id || '';
        const studentName = ticket.studentId ? `${ticket.studentId.firstName} ${ticket.studentId.lastName}`.toLowerCase() : '';

        const matchesSearch = topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studentName.includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-50 text-red-700 border-red-200';
            case 'In-Progress': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Closed': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Urgent': return <AlertCircle size={14} className="text-red-600 font-bold" />;
            case 'High': return <AlertCircle size={14} className="text-red-500" />;
            case 'Normal': return <Clock size={14} className="text-amber-500" />;
            case 'Low': return <CheckCircle size={14} className="text-blue-500" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Helpdesk & Support</h1>
                        <p className="text-xs text-gray-500">Manage inquiries and issues</p>
                    </div>
                    <button
                        onClick={() => navigate('/staff/support/new')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus size={16} /> New Ticket
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search subject or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In-Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Ticket Detail</th>
                                <th className="px-6 py-4">Raised By</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.id} onClick={() => navigate(`/staff/support/${ticket.id}`)} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <MessageSquare size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{ticket.topic}</p>
                                                <p className="text-[10px] text-gray-500 font-mono">{(ticket.id || ticket._id || '').toString().slice(-8)} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${ticket.raisedByType === 'Parent' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                    {(ticket.raisedBy?.firstName || ticket.raisedBy?.name || 'U').charAt(0)}
                                                </div>
                                                <span className="text-sm text-gray-900 font-bold">
                                                    {ticket._ticketType === 'teacher' ? (ticket.raisedBy?.firstName ? `${ticket.raisedBy.firstName} ${ticket.raisedBy.lastName || ''}` : 'Teacher') : (ticket.raisedBy ? (ticket.raisedBy.firstName ? `${ticket.raisedBy.firstName} ${ticket.raisedBy.lastName || ''}` : ticket.raisedBy.name) : (ticket.studentId ? `${ticket.studentId.firstName} ${ticket.studentId.lastName}` : 'N/A'))}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${ticket._ticketType === 'teacher' ? 'bg-purple-100 text-purple-700' : (ticket.raisedByType === 'Parent' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700')}`}>
                                                    {ticket._ticketType === 'teacher' ? 'Teacher' : (ticket.raisedByType || 'Student')}
                                                </span>
                                                {ticket.raisedByType === 'Parent' && ticket.studentId && (
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        for {ticket.studentId.firstName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                                            {getPriorityIcon(ticket.priority)} {ticket.priority}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ChevronRight size={16} className="text-gray-400 ml-auto group-hover:text-indigo-600" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {filteredTickets.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => navigate(`/staff/support/${ticket.id}`)}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 border border-gray-100 px-1.5 rounded bg-gray-50">
                                        {ticket.priority}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>

                            <h3 className="text-sm font-bold text-gray-900 mb-1">{ticket.topic}</h3>
                            <p className="text-xs text-gray-500 mb-2">
                                By: {ticket._ticketType === 'teacher' ? (ticket.raisedBy?.firstName ? `${ticket.raisedBy.firstName} ${ticket.raisedBy.lastName || ''}` : 'Teacher') : (ticket.studentId ? `${ticket.studentId.firstName} ${ticket.studentId.lastName}` : 'N/A')}
                            </p>

                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono border-t border-gray-50 pt-2">
                                <MessageSquare size={12} /> {ticket.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Support;
