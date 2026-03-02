
import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Layout, Type, Edit3, CheckCircle } from 'lucide-react';
import VariableSelector from './VariableSelector';
import TemplatePreview from './TemplatePreview';
import { API_URL } from '@/app/api';

const TemplateEditorDrawer = ({ isOpen, onClose, template, onSave }) => {

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'STUDENT',
        category: 'ACADEMIC',
        purpose: 'Bonafide Certificate',
        content: '',
        header: true,
        footer: true,
        orientation: 'PORTRAIT'
    });

    const [viewMode, setViewMode] = useState('EDIT'); // EDIT, PREVIEW
    const [instituteProfile, setInstituteProfile] = useState(null);

    // Load template data on open
    useEffect(() => {
        if (template) {
            setFormData({
                ...template,
                content: template.content || 'This is to certify that <b>{{student_name}}</b>, son/daughter of <b>{{father_name}}</b>, is a bonafide student of this institution studying in Class <b>{{class}}</b> Division <b>{{section}}</b> for the academic year <b>{{academic_year}}</b>.<br/><br/>His/Her date of birth as per our records is <b>{{dob}}</b>.<br/><br/>He/She bears a good moral character.'
            });
        } else {
            setFormData({
                name: '',
                type: 'STUDENT',
                category: 'ACADEMIC',
                purpose: 'Bonafide Certificate',
                content: 'This is to certify that <b>{{student_name}}</b>, son/daughter of <b>{{father_name}}</b>, is a bonafide student of this institution studying in Class <b>{{class}}</b> Division <b>{{section}}</b> for the academic year <b>{{academic_year}}</b>.<br/><br/>His/Her date of birth as per our records is <b>{{dob}}</b>.<br/><br/>He/She bears a good moral character.',
                header: true,
                footer: true,
                orientation: 'PORTRAIT'
            });
        }
    }, [template]);

    // Fetch institute profile for header (name, address, logo) in preview
    useEffect(() => {
        const fetchInstitute = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch(`${API_URL}/institute/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data?.success) {
                    setInstituteProfile(data.data);
                }
            } catch (e) {
                console.error('Failed to load institute profile for certificate preview', e);
            }
        };
        if (isOpen) {
            fetchInstitute();
        }
    }, [isOpen]);

    // Handlers
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleInsertVariable = (variable) => {
        // Simple append for now (In real rich text editor, insert at cursor)
        setFormData(prev => ({ ...prev, content: prev.content + ' ' + variable }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 w-full max-w-6xl bg-white shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-right duration-300">

                {/* Left Panel: Configuration (Scrollable) - Width 40% */}
                <div className="w-full md:w-2/5 flex flex-col h-full border-r border-gray-200 bg-gray-50/50">

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Edit3 size={18} className="text-indigo-600" />
                            {template?.id ? 'Edit Template' : 'New Template'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content Form */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Section 1: Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                <Layout size={14} /> Template Metadata
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                                    placeholder="e.g. Student Bonafide Certificate"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="EMPLOYEE">Employee</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="ACADEMIC">Academic</option>
                                        <option value="HR">HR / Payroll</option>
                                        <option value="FINANCE">Finance</option>
                                        <option value="GENERAL">General</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title (Purpose)</label>
                                <input
                                    type="text"
                                    value={formData.purpose}
                                    onChange={(e) => handleChange('purpose', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                                    placeholder="Title appearing on certificate"
                                />
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Section 2: Editor */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                <Type size={14} /> Certificate Body
                            </h3>

                            {/* Variable Selector */}
                            <VariableSelector
                                entityType={formData.type}
                                onSelectVariable={handleInsertVariable}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content Editor</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    rows={10}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 font-mono text-sm leading-relaxed"
                                    placeholder="Type certificate content here..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Supports basic HTML tags: &lt;b&gt;, &lt;br/&gt;, &lt;u&gt;</p>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center shrink-0">
                        <div className="text-xs text-gray-500">
                            {formData.orientation} • A4 PAGE
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2"
                            >
                                <Save size={16} /> Save Template
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Panel: Live Preview - Width 60% */}
                <div className="hidden md:flex flex-col w-3/5 bg-gray-100 border-l border-gray-200 h-full relative">

                    {/* Preview Toolbar */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                            <Eye size={12} /> Live Preview Mode
                        </span>
                    </div>

                    {/* Preview Component */}
                    <TemplatePreview
                        template={formData}
                        institute={instituteProfile}
                    />

                </div>

            </div>
        </div>
    );
};

export default TemplateEditorDrawer;
