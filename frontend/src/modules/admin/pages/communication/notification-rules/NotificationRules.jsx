
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
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

    // Data State (Mock)
    const [rules, setRules] = useState([]);

    // Mock Load
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRules([
                {
                    id: 1,
                    name: 'Auto Fee Reminder (7 Days)',
                    module: 'FEES',
                    trigger: 'Fee Overdue',
                    condition: 'Overdue > 7 Days',
                    audience: ['PARENTS'],
                    channels: ['SMS', 'EMAIL'],
                    status: 'ACTIVE'
                },
                {
                    id: 2,
                    name: 'Absent Alert - Immediate',
                    module: 'ATTENDANCE',
                    trigger: 'Student Marked Absent',
                    condition: 'Daily Run @ 11:00 AM',
                    audience: ['PARENTS'],
                    channels: ['APP'],
                    status: 'ACTIVE'
                },
                {
                    id: 3,
                    name: 'Exam Result Notification',
                    module: 'EXAMS',
                    trigger: 'Result Published',
                    condition: 'Instant',
                    audience: ['STUDENTS', 'PARENTS'],
                    channels: ['APP', 'EMAIL'],
                    status: 'DISABLED'
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Handlers
    const handleCreate = () => {
        setIsStepperOpen(true);
    };

    const handleSaveRule = (formData) => {
        const newRule = {
            id: Date.now(),
            ...formData,
            condition: formData.conditionVal ? `Wait ${formData.conditionVal} Days` : 'Instant'
        };
        setRules(prev => [newRule, ...prev]);
        setIsStepperOpen(false);
    };

    const handleAction = (type, rule) => {
        if (type === 'EDIT') {
            alert(`Edit rule logic for: ${rule.name}`); // Placeholder
        }
        if (type === 'ACTIVATE') {
            if (window.confirm('Activate this automation rule?')) {
                setRules(prev => prev.map(r => r.id === rule.id ? { ...r, status: 'ACTIVE' } : r));
            }
        }
        if (type === 'DISABLE') {
            if (window.confirm('Disable this active rule? Triggers will stop firing.')) {
                setRules(prev => prev.map(r => r.id === rule.id ? { ...r, status: 'DISABLED' } : r));
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
                    onClose={() => setIsStepperOpen(false)}
                    onSave={handleSaveRule}
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

export default NotificationRules;
