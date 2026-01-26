
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import RuleTable from './components/RuleTable';
import RuleFormStepper from './components/RuleFormStepper';

const NotificationRules = () => {

    // UI State
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isStepperOpen, setIsStepperOpen] = useState(false);
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

    const filteredRules = rules.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || r.status === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="pb-20 relative min-h-screen bg-gray-50/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Notification Rules</h1>
                    <p className="text-gray-500 text-sm">Automate system communications based on triggers and conditions.</p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Create Automation Rule
                </button>
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

        </div>
    );
};

export default NotificationRules;
