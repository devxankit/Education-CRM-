import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, CheckCircle, Clock, MoreVertical, Lock, User } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';

const MOCK_CONVERSATION = [
    { id: 1, sender: 'Parent (Rajesh Patel)', type: 'customer', message: 'Hi, I paid the fees via online portal but it is still showing pending.', time: '10:00 AM' },
    { id: 2, sender: 'System', type: 'system', message: 'Ticket Created. ID: TKT-1001', time: '10:00 AM' },
    { id: 3, sender: 'Staff (You)', type: 'staff', message: 'Hello Mr. Patel, let me check the transaction records with the accounts team.', time: '10:15 AM' },
];

const TicketDetail = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [messages, setMessages] = useState(MOCK_CONVERSATION);
    const [newMessage, setNewMessage] = useState('');
    const [status, setStatus] = useState('Open');
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [resolutionNote, setResolutionNote] = useState('');

    const [isInternal, setIsInternal] = useState(false);
    const [assignedDept, setAssignedDept] = useState('Support');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: messages.length + 1,
            sender: `Staff (${user?.name || 'You'})`,
            type: isInternal ? 'internal' : 'staff',
            message: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, msg]);
        setNewMessage('');
    };

    const confirmResolve = () => {
        if (!resolutionNote.trim()) return;
        setStatus('Closed');
        const msg = {
            id: messages.length + 1,
            sender: 'System',
            type: 'system',
            message: `Ticket closed. Resolution: ${resolutionNote}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, msg]);
        setShowResolveModal(false);
    };

    const handleDeptChange = (newDept) => {
        setAssignedDept(newDept);
        const msg = {
            id: messages.length + 1,
            sender: 'System',
            type: 'system',
            message: `Ticket escalated/assigned to ${newDept} department.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, msg]);
    };

    return (
        <div className="max-w-3xl mx-auto md:pb-6 min-h-screen bg-gray-50 flex flex-col relative">
            {/* Header */}
            <div className="bg-white px-5 py-3 border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/staff/support')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900 line-clamp-1">Fee Payment Issue</h1>
                        <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5 flex-wrap">
                            {ticketId} •
                            <span className={`px-1.5 rounded text-[10px] font-bold ${status === 'Open' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{status}</span>
                            <span className="bg-amber-50 text-amber-700 px-1.5 rounded text-[10px] font-bold border border-amber-100 flex items-center gap-1">
                                <Clock size={10} /> High Priority
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {status !== 'Closed' && (
                        <>
                            <div className="hidden md:flex items-center gap-2">
                                <select
                                    className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500"
                                    value={assignedDept}
                                    onChange={(e) => handleDeptChange(e.target.value)}
                                >
                                    <option value="Support">Assigned: Support</option>
                                    <option value="Accounts">Assign: Accounts</option>
                                    <option value="Transport">Assign: Transport</option>
                                    <option value="Data Entry">Assign: Data Entry</option>
                                </select>
                                <button onClick={() => setShowResolveModal(true)} className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 border border-green-100">
                                    Resolve
                                </button>
                            </div>
                        </>
                    )}
                    <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Sticky Context Bar (Entity Links) */}
            <div className="bg-indigo-50 px-5 py-2.5 border-b border-indigo-100 sticky top-[53px] z-20 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-4 min-w-max">
                    <div className="flex items-center gap-2 text-xs text-indigo-800 shrink-0">
                        <User size={14} />
                        <span className="font-bold">Aarav Patel</span>
                        <span className="opacity-70">(Student)</span>
                    </div>

                    <div className="h-4 w-px bg-indigo-200"></div>

                    <div className="flex gap-2">
                        <button onClick={() => navigate('/staff/students/STU-2024-001')} className="px-2 py-1 bg-white hover:bg-indigo-600 hover:text-white rounded border border-indigo-100 text-[10px] font-bold text-indigo-600 transition-colors">
                            Profile
                        </button>
                        <button onClick={() => navigate('/staff/fees')} className="px-2 py-1 bg-white hover:bg-indigo-600 hover:text-white rounded border border-indigo-100 text-[10px] font-bold text-indigo-600 transition-colors">
                            Fees
                        </button>
                        <button onClick={() => navigate('/staff/transport')} className="px-2 py-1 bg-white hover:bg-indigo-600 hover:text-white rounded border border-indigo-100 text-[10px] font-bold text-indigo-600 transition-colors">
                            Transport
                        </button>
                        <button onClick={() => navigate('/staff/documents')} className="px-2 py-1 bg-white hover:bg-indigo-600 hover:text-white rounded border border-indigo-100 text-[10px] font-bold text-indigo-600 transition-colors">
                            Docs
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.type === 'staff' || msg.type === 'internal' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'system' ? (
                            <div className="w-full flex justify-center my-2">
                                <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-4 py-1.5 rounded-full font-bold max-w-[80%] text-center italic">{msg.message}</span>
                            </div>
                        ) : (
                            <div className={`max-w-[85%] ${msg.type === 'staff' || msg.type === 'internal' ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm relative ${msg.type === 'internal'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200 rounded-tr-none'
                                    : msg.type === 'staff'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.type === 'internal' && (
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 mb-1 uppercase tracking-wider">
                                            <Lock size={10} /> Internal Note
                                        </div>
                                    )}
                                    {msg.message}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time} • {msg.sender}</span>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 md:static md:rounded-b-xl z-20">
                {/* Internal / Public Toggle */}
                {status !== 'Closed' && (
                    <div className="flex gap-4 mb-2 px-1">
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-gray-600 hover:text-indigo-600">
                            <input
                                type="radio"
                                name="msgType"
                                checked={!isInternal}
                                onChange={() => setIsInternal(false)}
                                className="accent-indigo-600"
                            />
                            Public Reply
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-amber-600 hover:text-amber-700">
                            <input
                                type="radio"
                                name="msgType"
                                checked={isInternal}
                                onChange={() => setIsInternal(true)}
                                className="accent-amber-600"
                            />
                            Internal Note (Staff Only)
                        </label>
                    </div>
                )}

                {status === 'Closed' ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        <Lock size={16} />
                        <span className="text-sm font-bold">This ticket is closed.</span>
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="flex gap-2 items-end max-w-3xl mx-auto">
                        <button type="button" className="p-3 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            rows={1}
                            placeholder={isInternal ? "Add an internal note..." : "Type your reply..."}
                            className={`flex-1 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 resize-none max-h-32 transition-colors ${isInternal ? 'bg-amber-50 focus:ring-amber-500 placeholder-amber-400' : 'bg-gray-100 focus:ring-indigo-500'
                                }`}
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className={`p-3 text-white rounded-full disabled:opacity-50 disabled:scale-95 transition-all shadow-md ${isInternal ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {isInternal ? <Lock size={20} /> : <Send size={20} />}
                        </button>
                    </form>
                )}
            </div>

            {/* Resolve Modal */}
            {showResolveModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Close Ticket</h3>
                            <p className="text-xs text-gray-500 mb-4">Please provide a mandatory resolution note before closing this ticket.</p>

                            <textarea
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                placeholder="Write resolution details..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none h-24 resize-none"
                            ></textarea>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex gap-3">
                            <button onClick={() => setShowResolveModal(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={confirmResolve}
                                disabled={!resolutionNote.trim()}
                                className="flex-1 px-4 py-2.5 text-sm font-bold bg-green-600 text-white rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 disabled:opacity-50 transition-all"
                            >
                                Confirm Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetail;
