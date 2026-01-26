
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import TemplateTable from './components/TemplateTable';
import TemplateEditorDrawer from './components/TemplateEditorDrawer';

const CertificateTemplates = () => {

    // UI State
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Data State (Mock)
    const [templates, setTemplates] = useState([]);

    // Mock Load
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTemplates([
                {
                    id: 1,
                    name: 'Student Bonafide Certificate',
                    code: 'DOC-BONAFIDE-01',
                    type: 'STUDENT',
                    category: 'GENERAL',
                    version: '1.2',
                    status: 'ACTIVE',
                    updatedAt: '2 days ago',
                    updatedBy: 'Admin',
                    purpose: 'Bonafide Certificate',
                    content: 'This is to certify that <b>{{student_name}}</b> (Adm No: <b>{{admission_no}}</b>) is a bonafide student of this institution, studying in Class <b>{{class}}</b> Division <b>{{section}}</b> for the academic year <b>{{academic_year}}</b>.<br/><br/>He/She bears a good moral character.'
                },
                {
                    id: 2,
                    name: 'Employee Experience Letter',
                    code: 'HR-EXP-001',
                    type: 'EMPLOYEE',
                    category: 'HR',
                    version: '1.0',
                    status: 'DRAFT',
                    updatedAt: '1 week ago',
                    updatedBy: 'HR Manager',
                    purpose: 'Experience Certificate',
                    content: 'To Whom It May Concern,<br/><br/>This is to certify that <b>{{employee_name}}</b> was employed with us as <b>{{designation}}</b> in the <b>{{department}}</b> department from <b>{{joining_date}}</b> to <b>{{issue_date}}</b>.<br/><br/>During their tenure, we found them to be sincere and hardworking.'
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

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setIsEditorOpen(true);
    };

    const handleSaveTemplate = (formData) => {
        if (selectedTemplate) {
            // Update
            setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? {
                ...t,
                ...formData,
                version: (parseFloat(t.version) + 0.1).toFixed(1), // Auto version bump
                updatedAt: 'Just now'
            } : t));
        } else {
            // Create
            const newTemplate = {
                ...formData,
                id: Date.now(),
                code: `DOC-${Date.now().toString().substr(-6)}`,
                version: '1.0',
                status: 'DRAFT',
                updatedAt: 'Just now',
                updatedBy: 'You'
            };
            setTemplates(prev => [newTemplate, ...prev]);
        }
        setIsEditorOpen(false);
    };

    const handleStatusChange = (id, newStatus) => {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pb-20 relative min-h-screen bg-gray-50/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Certificate Templates</h1>
                    <p className="text-gray-500 text-sm">Design and manage official document templates for students and employees.</p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Create New Template
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search templates by name or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>All Types</option>
                        <option>Student</option>
                        <option>Employee</option>
                    </select>
                    <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Draft</option>
                        <option>Archived</option>
                    </select>
                </div>

            </div>

            {/* Table Content */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading templates...</p>
                </div>
            ) : (
                <TemplateTable
                    templates={filteredTemplates}
                    onEdit={handleEdit}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* Editor Drawer */}
            <TemplateEditorDrawer
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                template={selectedTemplate}
                onSave={handleSaveTemplate}
            />

        </div>
    );
};

export default CertificateTemplates;
