import React, { useState, useEffect } from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { initialSections } from '../../data/academicData';

import ClassesTable from './components/classes/ClassesTable';
import SectionsTable from './components/classes/SectionsTable';
import SectionFormModal from './components/classes/SectionFormModal';

const Sections = () => {
    const classes = useAdminStore(state => state.classes);
    const sections = useAdminStore(state => state.sections);
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
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);

    // Derived
    const selectedClass = classes.find(c => c.id == selectedClassId);
    const displayedSections = selectedClassId ? (sections[selectedClassId] || []) : [];

    // Handlers
    const handleAddSection = (classId, data) => {
        addSection(classId, data);
    };

    const handleEditSection = (section) => {
        setEditingSection(section);
        setIsSectionModalOpen(true);
    };

    const handleDeactivateSection = (section) => {
        if (window.confirm(`Deactivate Section '${section.name}'? Students will need to be reassigned.`)) {
            const updatedSections = (sections[selectedClassId] || []).map(sec =>
                sec.id === section.id ? { ...sec, status: 'inactive' } : sec
            );
            setSections(selectedClassId, updatedSections);
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Class Sections</h1>
                    <p className="text-gray-500 text-sm">Manage sections and divisions for each academic class.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <HelpCircle size={16} /> Help
                    </button>
                    <button
                        onClick={() => setIsSectionModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> New Section
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">

                {/* Left Panel: Class Selector */}
                <div className="w-full lg:w-1/3 min-w-[300px]">
                    <ClassesTable
                        classes={classes}
                        selectedClassId={selectedClassId}
                        onSelect={(cls) => setSelectedClassId(cls.id)}
                        onArchive={() => {}} // Archive disabled in sections view
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
                                {selectedClass ? 'Manage divisions and capacity.' : 'Select a class to view sections.'}
                            </p>
                        </div>
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
            <SectionFormModal
                isOpen={isSectionModalOpen}
                onClose={() => {
                    setIsSectionModalOpen(false);
                    setEditingSection(null);
                }}
                onCreate={editingSection ? handleUpdateSection : handleAddSection}
                initialData={editingSection}
                classes={classes}
                initialClassId={selectedClassId}
            />
        </div>
    );
};

export default Sections;
