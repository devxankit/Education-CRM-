
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import TemplateTable from './components/TemplateTable';
import TemplateEditorDrawer from './components/TemplateEditorDrawer';

const MessageTemplates = () => {

    // UI State
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [activeTab, setActiveTab] = useState('ALL');

    // Data State (Mock)
    const [templates, setTemplates] = useState([]);

    // Mock Load
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTemplates([
                {
                    id: 1,
                    name: 'Fee Reminder (Initial)',
                    code: 'FEE-REM-001',
                    channel: 'SMS',
                    category: 'FEES',
                    usageType: 'AUTOMATED',
                    version: '1.0',
                    status: 'ACTIVE',
                    content: 'Dear Customer, Fee of Rs. {{due_amount}} is pending for {{student_name}}. Please pay by {{due_date}}. - Sunshine School'
                },
                {
                    id: 2,
                    name: 'Exam Result Announcement',
                    code: 'EXAM-RES-002',
                    channel: 'EMAIL',
                    category: 'EXAMS',
                    usageType: 'MANUAL',
                    version: '2.1',
                    status: 'DRAFT',
                    subject: 'Results Published for {{exam_name}}',
                    content: '<p>Dear Parent,</p><p>The results for <b>{{exam_name}}</b> have been published.</p><p>Please login to the portal to view the report card.</p>'
                },
                {
                    id: 3,
                    name: 'Daily Attendance Alert',
                    code: 'ATT-ABSENT-001',
                    channel: 'APP',
                    category: 'ATTENDANCE',
                    usageType: 'AUTOMATED',
                    version: '1.0',
                    status: 'LOCKED',
                    subject: 'Absent Alert: {{student_name}}',
                    content: 'Your ward {{student_name}} was marked absent today ({{absent_date}}). Please contact class teacher if this is an error.'
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Handlers
    const handleCreate = () => {
        setSelectedTemplate(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (tpl) => {
        setSelectedTemplate(tpl);
        setIsEditorOpen(true);
    };

    const handleSave = (formData) => {
        if (selectedTemplate) {
            // Update
            setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? {
                ...t,
                ...formData,
                version: (parseFloat(t.version) + 0.1).toFixed(1) // version bump
            } : t));
        } else {
            // Create
            const newTpl = {
                ...formData,
                id: Date.now(),
                code: `TPL-${Date.now().toString().substr(-6)}`,
                version: '1.0'
            };
            setTemplates(prev => [newTpl, ...prev]);
        }
        setIsEditorOpen(false);
    };

    const handleAction = (type, tpl) => {
        if (type === 'EDIT') handleEdit(tpl);
        if (type === 'ACTIVATE') {
            if (window.confirm('Activate this template? It will be available for use.')) {
                setTemplates(prev => prev.map(t => t.id === tpl.id ? { ...t, status: 'ACTIVE' } : t));
            }
        }
        if (type === 'ARCHIVE') {
            if (window.confirm('Archive this template?')) {
                setTemplates(prev => prev.map(t => t.id === tpl.id ? { ...t, status: 'ARCHIVED' } : t));
            }
        }
    };

    const filteredList = templates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || t.status === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="pb-20 relative min-h-screen bg-gray-50/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Message Templates</h1>
                    <p className="text-gray-500 text-sm">Design official communication templates for Emails, SMS, and App Notifications.</p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Create Template
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex p-1">
                    {['ALL', 'ACTIVE', 'DRAFT', 'LOCKED', 'ARCHIVED'].map(tab => (
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
                        placeholder="Search templates..."
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
                    <p className="text-gray-500">Loading templates...</p>
                </div>
            ) : (
                <TemplateTable
                    templates={filteredList}
                    onAction={handleAction}
                />
            )}

            {/* Editor Drawer */}
            <TemplateEditorDrawer
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                template={selectedTemplate}
                onSave={handleSave}
            />

        </div>
    );
};

export default MessageTemplates;
