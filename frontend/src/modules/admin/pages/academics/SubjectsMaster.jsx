
import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';

import SubjectsTable from './components/subjects/SubjectsTable';
import SubjectFormModal from './components/subjects/SubjectFormModal';

const SubjectsMaster = () => {

    // Mock Data
    const [subjects, setSubjects] = useState([
        { id: 1, name: 'Mathematics', code: 'SUB_MATH_001', type: 'theory', category: 'core', level: 'school', status: 'active' },
        { id: 2, name: 'Physics', code: 'SUB_PHY_001', type: 'theory_practical', category: 'core', level: 'school', status: 'active' },
        { id: 3, name: 'Computer Science', code: 'SUB_CS_001', type: 'theory_practical', category: 'elective', level: 'school', status: 'active' },
        { id: 4, name: 'Environmental Studies', code: 'SUB_EVS_001', type: 'theory', category: 'core', level: 'school', status: 'inactive' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [filterLevel, setFilterLevel] = useState('all');

    // Handlers
    const handleCreate = (data) => {
        if (editingSubject) {
            // Update
            setSubjects(prev => prev.map(s => s.id === editingSubject.id ? { ...s, ...data } : s));
        } else {
            // Create
            const newSubject = {
                id: Date.now(),
                ...data,
                // generate code if new
                code: `SUB_${data.name.substring(0, 3).toUpperCase()}_${Date.now().toString().slice(-3)}`,
                status: 'active'
            };
            setSubjects(prev => [newSubject, ...prev]);
        }
        setEditingSubject(null);
    };

    const handleEditClick = (sub) => {
        setEditingSubject(sub);
        setIsModalOpen(true);
    };

    const handleDeactivate = (sub) => {
        if (window.confirm(`Deactivate '${sub.name}'? It will disappear from future mapping choices.`)) {
            setSubjects(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'inactive' } : s));
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingSubject(null);
    };

    // Filter Logic
    const filteredSubjects = subjects.filter(sub => {
        if (filterLevel !== 'all' && sub.level !== filterLevel) return false;
        return true;
    });

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Subject Master</h1>
                    <p className="text-gray-500 text-sm">Define and manage the curriculum subjects repository.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200 gap-3">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="text-sm border-gray-300 rounded-md border p-1.5 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="all">All Levels</option>
                        <option value="school">School (K-12)</option>
                        <option value="ug">Undergraduate</option>
                        <option value="pg">Postgraduate</option>
                    </select>
                </div>

                <button
                    onClick={() => { setEditingSubject(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm ml-auto"
                >
                    <Plus size={18} /> Add New Subject
                </button>
            </div>

            {/* List */}
            <SubjectsTable
                subjects={filteredSubjects}
                onEdit={handleEditClick}
                onDeactivate={handleDeactivate}
            />

            {/* Modal */}
            <SubjectFormModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onCreate={handleCreate}
                initialData={editingSubject}
            />
        </div>
    );
};

export default SubjectsMaster;
