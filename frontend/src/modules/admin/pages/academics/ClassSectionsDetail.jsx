import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import SectionsTable from './components/classes/SectionsTable';
import SectionFormModal from './components/classes/SectionFormModal';

const ClassSectionsDetail = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const classes = useAdminStore(state => state.classes);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const sections = useAdminStore(state => state.sections);
    const fetchSections = useAdminStore(state => state.fetchSections);
    const addSection = useAdminStore(state => state.addSection);
    const updateSection = useAdminStore(state => state.updateSection);
    const user = useAppStore(state => state.user);

    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);

    useEffect(() => {
        if (user?.branchId) fetchClasses(user.branchId);
        else fetchClasses('main');
    }, [user, fetchClasses]);

    useEffect(() => {
        if (classId) fetchSections(classId, true); // includeInactive for management view
    }, [classId, fetchSections]);

    const selectedClass = classes.find(c => (c._id || c.id) === classId);
    const displayedSections = classId ? (sections[classId] || []) : [];

    const handleEditSection = (section) => {
        setEditingSection(section);
        setIsSectionModalOpen(true);
    };

    const handleDeactivateSection = (section) => {
        if (window.confirm(`Deactivate Section '${section.name}'? It will be hidden from dropdowns.`)) {
            updateSection(section._id, classId, { status: 'inactive' });
        }
    };

    const handleReactivateSection = (section) => {
        updateSection(section._id, classId, { status: 'active' });
    };

    const handleAddOrUpdate = (clsId, data) => {
        if (editingSection) {
            updateSection(editingSection._id, classId, data);
            setEditingSection(null);
        } else {
            addSection(clsId || classId, data);
        }
    };

    if (!classId) {
        navigate('/admin/academics/sections');
        return null;
    }

    if (classes.length > 0 && !selectedClass) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8">
                <p className="text-gray-500">Class not found.</p>
                <button
                    onClick={() => navigate('/admin/academics/sections')}
                    className="mt-4 text-indigo-600 hover:underline"
                >
                    ← Back to Classes
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/academics/sections')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        title="Back to Classes"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                            {selectedClass?.name || 'Class'} — Sections
                        </h1>
                        <p className="text-gray-500 text-sm">Manage sections and divisions for this class.</p>
                    </div>
                </div>
                <button
                    onClick={() => { setEditingSection(null); setIsSectionModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm"
                >
                    <Plus size={18} /> Add Section
                </button>
            </div>

            {/* Sections Table */}
            <div className="flex-1 min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
                    <SectionsTable
                        className={selectedClass?.name || ''}
                        sections={displayedSections}
                        onAdd={() => setIsSectionModalOpen(true)}
                        onEdit={handleEditSection}
                        onDeactivate={handleDeactivateSection}
                        onReactivate={handleReactivateSection}
                    />
                </div>
            </div>

            <SectionFormModal
                isOpen={isSectionModalOpen}
                onClose={() => { setIsSectionModalOpen(false); setEditingSection(null); }}
                onCreate={handleAddOrUpdate}
                initialData={editingSection}
                classes={classes}
                initialClassId={classId}
            />
        </div>
    );
};

export default ClassSectionsDetail;
