
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import SubjectsTable from './components/subjects/SubjectsTable';
import SubjectFormModal from './components/subjects/SubjectFormModal';

const SubjectsMaster = () => {
    const subjects = useAdminStore(state => state.subjects);
    const classes = useAdminStore(state => state.classes);
    const fetchSubjects = useAdminStore(state => state.fetchSubjects);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const addSubject = useAdminStore(state => state.addSubject);
    const updateSubject = useAdminStore(state => state.updateSubject);
    const user = useAppStore(state => state.user);

    useEffect(() => {
        const branchId = user?.branchId || 'main';
        fetchSubjects(branchId);
        fetchClasses(branchId);
    }, [user, fetchSubjects, fetchClasses]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterClass, setFilterClass] = useState('all');

    // Classes for Filter from store
    const availableClasses = classes.map(c => c.name);

    // Handlers
    const handleCreate = (data) => {
        if (editingSubject) {
            updateSubject(editingSubject._id, data);
        } else {
            addSubject({
                ...data,
                branchId: user?.branchId || 'main'
            });
        }
        setEditingSubject(null);
    };

    const handleEditClick = (sub) => {
        setEditingSubject(sub);
        setIsModalOpen(true);
    };

    const handleDeactivate = (sub) => {
        if (window.confirm(`Deactivate '${sub.name}'? It will disappear from future mapping choices.`)) {
            updateSubject(sub._id, { status: 'inactive' });
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingSubject(null);
    };

    // Filter Logic
    const filteredSubjects = subjects.filter(sub => {
        if (filterLevel !== 'all' && sub.level !== filterLevel) return false;
        if (filterClass !== 'all' && (!sub.assignedClasses || !sub.assignedClasses.includes(filterClass))) return false;
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

                    {/* Level Filter */}
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

                    {/* Class Filter */}
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="text-sm border-gray-300 rounded-md border p-1.5 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="all">All Classes</option>
                        {availableClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
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
                classes={classes}
            />
        </div>
    );
};

export default SubjectsMaster;
