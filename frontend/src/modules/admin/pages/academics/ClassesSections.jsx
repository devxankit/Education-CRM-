
import React, { useState } from 'react';
import { Plus, HelpCircle } from 'lucide-react';

import ClassesTable from './components/classes/ClassesTable';
import SectionsTable from './components/classes/SectionsTable';
import ClassFormModal from './components/classes/ClassFormModal';
import SectionFormModal from './components/classes/SectionFormModal';

const ClassesSections = () => {

    // Mock Data
    const [classes, setClasses] = useState([
        { id: 1, name: 'Class 1', code: 'CLS_001', level: 'primary', board: 'CBSE', status: 'active' },
        { id: 2, name: 'Class 10', code: 'CLS_010', level: 'secondary', board: 'CBSE', status: 'active' },
        { id: 3, name: 'Class 12 (Sci)', code: 'CLS_012_SCI', level: 'senior_secondary', board: 'CBSE', status: 'active' }
    ]);

    const [sections, setSections] = useState({
        1: [
            { id: 101, name: 'A', capacity: 40, teacherName: 'Sarah Jen', status: 'active' },
            { id: 102, name: 'B', capacity: 40, teacherName: '', status: 'active' }
        ],
        2: [
            { id: 201, name: 'Rose', capacity: 35, teacherName: 'Vikram Singh', status: 'active' }
        ],
        3: []
    });

    // State
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

    // Derived
    const selectedClass = classes.find(c => c.id === selectedClassId);
    const displayedSections = selectedClassId ? (sections[selectedClassId] || []) : [];

    // Handlers
    const handleAddClass = (data) => {
        const newClass = {
            id: Date.now(),
            ...data,
            code: `CLS_${data.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}_${Date.now().toString().slice(-4)}`,
            status: 'active'
        };
        setClasses(prev => [...prev, newClass]);
        setSections(prev => ({ ...prev, [newClass.id]: [] }));
    };

    const handleAddSection = (data) => {
        if (!selectedClassId) return;
        const newSection = {
            id: Date.now(),
            ...data,
            status: 'active'
        };
        setSections(prev => ({
            ...prev,
            [selectedClassId]: [...(prev[selectedClassId] || []), newSection]
        }));
    };

    const handleArchiveClass = (cls) => {
        if (window.confirm(`Archive ${cls.name}? It will be hidden from new admissions.`)) {
            setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, status: 'archived' } : c));
        }
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
                                onEdit={() => { }}
                                onDeactivate={() => { }}
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
                onClose={() => setIsSectionModalOpen(false)}
                onCreate={handleAddSection}
            />
        </div>
    );
};

export default ClassesSections;
