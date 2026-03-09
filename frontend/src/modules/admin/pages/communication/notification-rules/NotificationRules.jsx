
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, X, BellRing, Clock3 } from 'lucide-react';
import RuleTable from './components/RuleTable';
import RuleFormStepper from './components/RuleFormStepper';
import axios from 'axios';
import { API_URL } from '@/app/api';

const NotificationRules = () => {

    // UI State
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isStepperOpen, setIsStepperOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');
    const [editingRule, setEditingRule] = useState(null);
    const [viewingRule, setViewingRule] = useState(null);

    // Data State
    const [rules, setRules] = useState([]);

    useEffect(() => {
        fetchRules();
    }, [activeTab]);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (activeTab && activeTab !== 'ALL') params.append('status', activeTab);
            if (searchTerm.trim()) params.append('search', searchTerm.trim());

            const response = await axios.get(`${API_URL}/notification/rules?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setRules(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching notification rules:', error);
            setRules([]);
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleCreate = () => {
        setViewingRule(null);
        setEditingRule(null);
        setIsStepperOpen(true);
    };

    const handleSaveRule = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (editingRule?._id) {
                const response = await axios.put(`${API_URL}/notification/rules/${editingRule._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setRules(prev => prev.map(rule => rule._id === editingRule._id ? response.data.data : rule));
                }
            } else {
                const response = await axios.post(`${API_URL}/notification/rules`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setRules(prev => [response.data.data, ...prev]);
                }
            }
            setEditingRule(null);
            setIsStepperOpen(false);
        } catch (error) {
            console.error('Error saving notification rule:', error);
            alert(error.response?.data?.message || 'Failed to save notification rule');
        }
    };

    const handleAction = async (type, rule) => {
        const raw = rules.find(r => (r._id || r.id) === (rule._id || rule.id)) || null;

        if (type === 'VIEW') {
            setViewingRule(raw);
            return;
        }

        if (type === 'EDIT') {
            setViewingRule(null);
            setEditingRule(raw);
            setIsStepperOpen(true);
            return;
        }

        if (type === 'DELETE' && raw?._id) {
            if (!window.confirm(`Delete notification rule "${raw.name}"?`)) return;

            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`${API_URL}/notification/rules/${raw._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setRules(prev => prev.filter(r => r._id !== raw._id));
                    if (viewingRule?._id === raw._id) setViewingRule(null);
                    if (editingRule?._id === raw._id) {
                        setEditingRule(null);
                        setIsStepperOpen(false);
                    }
                }
            } catch (error) {
                console.error('Error deleting notification rule:', error);
                alert(error.response?.data?.message || 'Failed to delete notification rule');
            }
        }
    };

    const [sendForm, setSendForm] = useState({
        audienceType: 'student',
        title: '',
        message: '',
    });

    const filteredRules = rules.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || r.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const handleOpenSendModal = () => {
        setSendForm({
            audienceType: 'student',
            title: '',
            message: '',
        });
        setIsSendModalOpen(true);
    };

    const handleSendNotification = async () => {
        if (!sendForm.title.trim() || !sendForm.message.trim()) {
            alert('Title and message are required.');
            return;
        }
        try {
            await axios.post(
                `${API_URL}/notification/custom`,
                {
                    audienceType: sendForm.audienceType,
                    title: sendForm.title.trim(),
                    message: sendForm.message.trim(),
                }
            );
            alert('Notification sent successfully.');
            setIsSendModalOpen(false);
        } catch (error) {
            console.error('Error sending notification:', error);
            alert(error.response?.data?.message || 'Failed to send notification.');
        }
    };

    return (
        <div className="pb-20 relative min-h-screen bg-gray-50/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Notification Rules</h1>
                    <p className="text-gray-500 text-sm">Automate system communications and send targeted alerts.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleOpenSendModal}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 font-bold rounded-xl border border-indigo-200 hover:bg-indigo-50 shadow-sm transition-all"
                    >
                        <Plus size={18} />
                        Send Custom Notification
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        Create Automation Rule
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex p-1">
                    {['ALL', 'ACTIVE', 'DISABLED', 'DRAFT'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64 mr-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search rules..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading engine rules...</p>
                </div>
            ) : (
                <RuleTable
                    rules={filteredRules}
                    onAction={handleAction}
                />
            )}

            {/* Wizard */}
            {isStepperOpen && (
                <RuleFormStepper
                    onClose={() => {
                        setEditingRule(null);
                        setIsStepperOpen(false);
                    }}
                    onSave={handleSaveRule}
                    initialRule={editingRule}
                />
            )}

            {viewingRule && (
                <RuleViewModal
                    rule={viewingRule}
                    onClose={() => setViewingRule(null)}
                    onEdit={() => {
                        setViewingRule(null);
                        setEditingRule(viewingRule);
                        setIsStepperOpen(true);
                    }}
                    onDelete={() => handleAction('DELETE', viewingRule)}
                />
            )}

            {/* Send Custom Notification Modal */}
            {isSendModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Send Custom Notification</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Choose audience and compose a short message.</p>
                            </div>
                            <button
                                onClick={() => setIsSendModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-5 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Audience Type</label>
                                    <select
                                        value={sendForm.audienceType}
                                        onChange={(e) => setSendForm(prev => ({ ...prev, audienceType: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="student">Students</option>
                                        <option value="teacher" disabled>Teachers (coming soon)</option>
                                        <option value="staff" disabled>Staff (coming soon)</option>
                                        <option value="parent" disabled>Parents (coming soon)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                                <input
                                    type="text"
                                    maxLength={80}
                                    value={sendForm.title}
                                    onChange={(e) => setSendForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Short notification title"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    maxLength={240}
                                    value={sendForm.message}
                                    onChange={(e) => setSendForm(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    placeholder="Write a brief message to send to selected audience"
                                />
                            </div>
                        </div>
                        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsSendModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendNotification}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm"
                            >
                                Send Notification
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

const RuleViewModal = ({ rule, onClose, onEdit, onDelete }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest mb-3">
                        <BellRing size={12} />
                        Rule Preview
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{rule?.name || 'Notification Rule'}</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Module</p>
                        <p className="text-sm font-bold text-gray-900">{rule?.module || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Trigger</p>
                        <p className="text-sm font-bold text-gray-900">{rule?.trigger || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                        <p className="text-sm font-bold text-gray-900">{rule?.status || 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Clock3 size={12} />
                        Condition
                    </p>
                    <p className="text-sm font-bold text-gray-900">{rule?.condition || 'Instant'}</p>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Target Audience</p>
                    <div className="flex flex-wrap gap-2">
                        {(rule?.audience || []).length > 0 ? rule.audience.map((audience) => (
                            <span key={audience} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                                {audience}
                            </span>
                        )) : (
                            <span className="text-sm text-gray-500">No audience selected</span>
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Channels</p>
                    <div className="flex flex-wrap gap-2">
                        {(rule?.channels || []).length > 0 ? rule.channels.map((channel) => (
                            <span key={channel} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 uppercase">
                                {channel}
                            </span>
                        )) : (
                            <span className="text-sm text-gray-500">No channels configured</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={onEdit}
                        className="flex-1 py-3 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100"
                    >
                        Edit Rule
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="flex-1 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold hover:bg-red-100"
                    >
                        Delete Rule
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default NotificationRules;
