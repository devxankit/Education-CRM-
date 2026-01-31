
import React, { useState, useEffect } from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { initialSections } from '../../data/academicData';

import ClassesTable from './components/classes/ClassesTable';
import SectionsTable from './components/classes/SectionsTable';
import ClassFormModal from './components/classes/ClassFormModal';
import SectionFormModal from './components/classes/SectionFormModal';

const ClassesSections = () => {
    const classes = useAdminStore(state => state.classes);
    const sections = useAdminStore(state => state.sections);
    const addClass = useAdminStore(state => state.addClass);
    const updateClass = useAdminStore(state => state.updateClass);
    const archiveClass = useAdminStore(state => state.deleteClass); // In store it's delete, but we use as archive logic
    const setSections = useAdminStore(state => state.setSections);
    const addSection = useAdminStore(state => state.addSection);

    // Initialize segments if empty
    useEffect(() => {
        if (Object.keys(sections).length === 0) {
            Object.entries(initialSections).forEach(([classId, data]) => {
                setSections(classId, data);
            });
        }
    }, []);

    // State
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);

    // Derived
    const selectedClass = classes.find(c => c.id == selectedClassId); // Use == for mixed type matching (string/number)
    const displayedSections = selectedClassId ? (sections[selectedClassId] || []) : [];

    // Handlers
    const handleAddClass = (data) => {
        addClass(data);
    };

    const handleAddSection = (data) => {
        if (!selectedClassId) return;
        addSection(selectedClassId, data);
    };

    const handleArchiveClass = (cls) => {
        if (window.confirm(`Archive ${cls.name}? It will be hidden from new admissions.`)) {
            updateClass(cls.id, { status: 'archived' });
        }
    };

    // Handler for editing a section
    const handleEditSection = (section) => {
        setEditingSection(section);
        setIsSectionModalOpen(true);
    };

    // Handler for deactivating a section
    const handleDeactivateSection = (section) => {
        if (window.confirm(`Deactivate Section '${section.name}'? Students will need to be reassigned.`)) {
            const updatedSections = (sections[selectedClassId] || []).map(sec =>
                sec.id === section.id ? { ...sec, status: 'inactive' } : sec
            );
            setSections(selectedClassId, updatedSections);
        }
    };

    // Handler for updating a section (from modal)
    const handleUpdateSection = (data) => {
        if (!selectedClassId || !editingSection) return;
        const updatedSections = (sections[selectedClassId] || []).map(sec =>
            sec.id === editingSection.id ? { ...sec, ...data } : sec
        );
        setSections(selectedClassId, updatedSections);
        setEditingSection(null);
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Classes & Sections</h1>
                    <p className="text-gray-500 text-sm">Define the academic hierarchy structure.</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <HelpCircle size={16} /> Help
                    </button>
                    {/* Only show Add Class, Sections added via right panel */}
                    <button
                        onClick={() => setIsClassModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> New Class
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">

                {/* Left Panel: Classes */}
                <div className="w-full lg:w-1/3 min-w-[300px]">
                    <ClassesTable
                        classes={classes}
                        selectedClassId={selectedClassId}
                        onSelect={(cls) => setSelectedClassId(cls.id)}
                        onArchive={handleArchiveClass}
                    />
                </div>

                {/* Right Panel: Sections */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    {/* Panel Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="font-bold text-gray-800">
                                {selectedClass ? `${selectedClass.name} Sections` : 'Section Details'}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {selectedClass ? 'Manage divisions and capacity.' : 'Select a class to view details.'}
                            </p>
                        </div>
                        {selectedClass && selectedClass.status !== 'archived' && (
                            <button
                                onClick={() => setIsSectionModalOpen(true)}
                                className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                            >
                                <Plus size={14} /> Add Section
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedClass ? (
                            <SectionsTable
                                className={selectedClass.name}
                                sections={displayedSections}
                                onAdd={() => setIsSectionModalOpen(true)}
                                onEdit={handleEditSection}
                                onDeactivate={handleDeactivateSection}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                Select a class from the left list.
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Modals */}
            <ClassFormModal
                isOpen={isClassModalOpen}
                onClose={() => setIsClassModalOpen(false)}
                onCreate={handleAddClass}
            />

            <SectionFormModal
                isOpen={isSectionModalOpen}
                onClose={() => {
                    setIsSectionModalOpen(false);
                    setEditingSection(null);
                }}
                onCreate={editingSection ? handleUpdateSection : handleAddSection}
                initialData={editingSection}
            />
        </div>
    );
};

export default ClassesSections;
