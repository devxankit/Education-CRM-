import React, { useState } from 'react';
import { ClipboardList, Plus, Edit2, Trash2, Users, FileCheck, CheckCircle2 } from 'lucide-react';

// Sub Components
import CreateChecklistModal from './components/CreateChecklistModal';
import ChecklistBuilder from './components/ChecklistBuilder';

const Checklists = () => {

    // Mock Data
    const [checklists, setChecklists] = useState([
        {
            id: 1,
            title: 'Student Admission 2024-25',
            targetRole: 'student',
            description: 'Standard document verification for new enrollments.',
            isActive: true,
            items: [
                { id: 101, label: 'Upload Birth Certificate', type: 'document', required: true },
                { id: 102, label: 'Upload Aadhar Card', type: 'document', required: true },
                { id: 103, label: 'Fee Payment Receipt', type: 'checkbox', required: true }
            ]
        },
        {
            id: 2,
            title: 'Teacher Onboarding',
            targetRole: 'teacher',
            description: 'HR and compliance checks for new hires.',
            isActive: false,
            items: [
                { id: 201, label: 'Submit Resume', type: 'document', required: true },
                { id: 202, label: 'Sign NDA', type: 'date', required: true }
            ]
        }
    ]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingChecklist, setEditingChecklist] = useState(null); // The one open in Builder

    // Handlers
    const handleCreate = (newChecklist) => {
        setChecklists([newChecklist, ...checklists]);
        setIsCreateModalOpen(false);
        // Immediately open builder for the new one
        setEditingChecklist(newChecklist);
    };

    const handleUpdateChecklist = (updatedChecklist) => {
        setChecklists(checklists.map(c => c.id === updatedChecklist.id ? updatedChecklist : c));
        setEditingChecklist(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this checklist?")) {
            setChecklists(checklists.filter(c => c.id !== id));
        }
    };

    const toggleStatus = (id) => {
        setChecklists(checklists.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50 border-t border-gray-200 -mt-6 -mx-8 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Compliance Checklists</h1>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                            <FileCheck size={12} /> Standard Operating Procedures
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Define mandatory steps and documents for system processes.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-bold transition-transform active:scale-95"
                >
                    <Plus size={18} /> New Checklist
                </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                <div className="max-w-6xl mx-auto space-y-6 pb-10">

                    {checklists.length === 0 && (
                        <div className="text-center py-20 bg-white border border-gray-200 border-dashed rounded-xl">
                            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ClipboardList size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">No Checklists Found</h3>
                            <p className="text-gray-500 mt-2">Create your first compliance checklist to get started.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {checklists.map((checklist) => (
                            <div key={checklist.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">

                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${checklist.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {checklist.isActive ? 'Active' : 'Draft'}
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => setEditingChecklist(checklist)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(checklist.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={checklist.title}>{checklist.title}</h3>

                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium capitalize">
                                        <Users size={14} /> Target: {checklist.targetRole}
                                    </div>

                                    <p className="text-sm text-gray-500 mt-3 line-clamp-2 h-10">
                                        {checklist.description}
                                    </p>
                                </div>

                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
                                    <div className="font-semibold text-gray-700 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-indigo-500" />
                                        {checklist.items.length} Requirement(s)
                                    </div>
                                    <button
                                        onClick={() => toggleStatus(checklist.id)}
                                        className="text-indigo-600 hover:underline font-medium"
                                    >
                                        {checklist.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <CreateChecklistModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleCreate}
                />
            )}

            {/* Builder Modal */}
            {editingChecklist && (
                <ChecklistBuilder
                    checklist={editingChecklist}
                    onClose={() => setEditingChecklist(null)}
                    onSave={handleUpdateChecklist}
                />
            )}

        </div>
    );
};

export default Checklists;
