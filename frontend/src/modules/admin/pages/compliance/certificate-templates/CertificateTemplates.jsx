import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import TemplateTable from './components/TemplateTable';
import TemplateEditorDrawer from './components/TemplateEditorDrawer';

const CertificateTemplates = () => {
    const {
        branches,
        fetchBranches,
        fetchCertificateTemplates,
        createCertificateTemplate,
        updateCertificateTemplate,
        updateCertificateTemplateStatus,
    } = useAdminStore();

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length && !selectedBranchId) setSelectedBranchId(branches[0]._id);
    }, [branches, selectedBranchId]);

    useEffect(() => {
        if (!selectedBranchId) return;
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchCertificateTemplates(selectedBranchId);
                setTemplates(
                    (Array.isArray(data) ? data : []).map((t) => ({
                        ...t,
                        id: t._id,
                        updatedAt: t.updatedAt ? (typeof t.updatedAt === 'string' ? t.updatedAt : new Date(t.updatedAt).toLocaleDateString()) : '—',
                    }))
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedBranchId, fetchCertificateTemplates]);

    const handleCreate = () => {
        setSelectedTemplate(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setIsEditorOpen(true);
    };

    const handleSaveTemplate = async (formData) => {
        const branchId = selectedBranchId;
        if (!branchId) return;
        setLoading(true);
        try {
            const payload = {
                branchId,
                name: formData.name,
                type: formData.type || 'STUDENT',
                category: formData.category || 'GENERAL',
                purpose: formData.purpose || '',
                content: formData.content || '',
                header: formData.header !== false,
                footer: formData.footer !== false,
                orientation: formData.orientation || 'PORTRAIT',
            };
            if (selectedTemplate && (selectedTemplate._id || selectedTemplate.id)) {
                await updateCertificateTemplate(selectedTemplate._id || selectedTemplate.id, payload);
            } else {
                await createCertificateTemplate(payload);
            }
            const data = await fetchCertificateTemplates(selectedBranchId);
            setTemplates(
                (Array.isArray(data) ? data : []).map((t) => ({
                    ...t,
                    id: t._id,
                    updatedAt: t.updatedAt ? (typeof t.updatedAt === 'string' ? t.updatedAt : new Date(t.updatedAt).toLocaleDateString()) : '—',
                }))
            );
            setIsEditorOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateCertificateTemplateStatus(id, newStatus);
            const data = await fetchCertificateTemplates(selectedBranchId);
            setTemplates(
                (Array.isArray(data) ? data : []).map((t) => ({
                    ...t,
                    id: t._id,
                    updatedAt: t.updatedAt ? (typeof t.updatedAt === 'string' ? t.updatedAt : new Date(t.updatedAt).toLocaleDateString()) : '—',
                }))
            );
        } catch (_) {}
    };

    const filteredTemplates = templates.filter(
        (t) =>
            (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pb-20 relative min-h-screen bg-gray-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Certificate Templates</h1>
                    <p className="text-gray-500 text-sm">Design and manage official document templates for students and employees.</p>
                </div>
                <div className="flex items-center gap-3">
                    {branches.length > 1 && (
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                            {branches.map((b) => (
                                <option key={b._id} value={b._id}>{b.name || b.branchName || b._id}</option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        Create New Template
                    </button>
                </div>
            </div>

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

            {loading && !templates.length ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading templates...</p>
                </div>
            ) : (
                <TemplateTable
                    templates={filteredTemplates}
                    onEdit={handleEdit}
                    onStatusChange={handleStatusChange}
                    onCreateNew={handleCreate}
                />
            )}

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
