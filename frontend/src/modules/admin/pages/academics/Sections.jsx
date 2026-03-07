import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import ClassesTable from './components/classes/ClassesTable';
import ClassFormModal from './components/classes/ClassFormModal';

const Sections = () => {
    const classes = useAdminStore(state => state.classes);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const updateClass = useAdminStore(state => state.updateClass);
    const deleteClass = useAdminStore(state => state.deleteClass);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const branches = useAdminStore(state => state.branches);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);
    const academicYears = useAdminStore(state => state.academicYearsForSelect || []);
    const user = useAppStore(state => state.user);
    const navigate = useNavigate();
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    const activeClasses = (classes || []).filter(c => (c.status || 'active') === 'active');

    useEffect(() => {
        if (user?.branchId) {
            fetchClasses(user.branchId);
        } else {
            fetchClasses('main');
        }
    }, [user, fetchClasses]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        const branchId = editingClass?.branchId?._id || editingClass?.branchId || user?.branchId;
        if (branchId && branchId !== 'all' && branchId !== 'main') {
            fetchAcademicYears(branchId);
        }
    }, [editingClass, user?.branchId, fetchAcademicYears]);

    const handleClassClick = (cls) => {
        const id = cls._id || cls.id;
        if (id) navigate(`/admin/academics/sections/${id}`);
    };

    const handleArchiveClass = (cls) => {
        if (window.confirm(`Deactivate ${cls.name}? It will be hidden from dropdowns.`)) {
            updateClass(cls._id || cls.id, { status: 'archived' });
        }
    };

    const handleEditClass = (cls) => {
        setEditingClass(cls);
        setIsClassModalOpen(true);
    };

    const handleUpdateClass = async (id, data) => {
        await updateClass(id, data);
        setEditingClass(null);
        setIsClassModalOpen(false);
        if (user?.branchId) {
            fetchClasses(user.branchId);
        } else {
            fetchClasses('main');
        }
    };

    const handleDeleteClass = async (cls) => {
        const confirmed = window.confirm(`Delete ${cls.name}? This action cannot be undone.`);
        if (!confirmed) return;

        const success = await deleteClass(cls._id || cls.id);
        if (success) {
            if (editingClass && (editingClass._id || editingClass.id) === (cls._id || cls.id)) {
                setEditingClass(null);
                setIsClassModalOpen(false);
            }
            if (user?.branchId) {
                fetchClasses(user.branchId);
            } else {
                fetchClasses('main');
            }
        }
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Class Sections</h1>
                    <p className="text-gray-500 text-sm">Select a class to manage its sections and divisions.</p>
                </div>

                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium w-fit">
                    <HelpCircle size={16} /> Help
                </button>
            </div>

            {/* Classes List */}
            <div className="flex-1 min-h-0">
                <ClassesTable
                    classes={activeClasses}
                    selectedClassId={null}
                    onSelect={handleClassClick}
                    onEdit={handleEditClass}
                    onDelete={handleDeleteClass}
                    onArchive={handleArchiveClass}
                    hideFooter={false}
                />
            </div>

            <ClassFormModal
                isOpen={isClassModalOpen}
                onClose={() => {
                    setIsClassModalOpen(false);
                    setEditingClass(null);
                }}
                onCreate={async () => {}}
                onUpdate={handleUpdateClass}
                initialData={editingClass}
                defaultBranchId={editingClass?.branchId?._id || editingClass?.branchId || user?.branchId || branches[0]?._id || ''}
                defaultAcademicYearId={editingClass?.academicYearId?._id || editingClass?.academicYearId || ''}
                academicYears={academicYears}
            />
        </div>
    );
};

export default Sections;
