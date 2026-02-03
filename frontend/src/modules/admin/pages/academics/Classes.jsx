import React, { useState, useEffect } from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import ClassesTable from './components/classes/ClassesTable';
import ClassFormModal from './components/classes/ClassFormModal';

const Classes = () => {
    const classes = useAdminStore(state => state.classes);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const addClass = useAdminStore(state => state.addClass);
    const updateClass = useAdminStore(state => state.updateClass);
    const user = useAppStore(state => state.user);

    // State
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);

    useEffect(() => {
        if (user?.branchId) {
            fetchClasses(user.branchId);
        } else {
            // Fallback for testing if branchId is not in user object
            fetchClasses('main');
        }
    }, [user, fetchClasses]);

    // Handlers
    const handleAddClass = (data) => {
        addClass(data);
    };

    const handleArchiveClass = (cls) => {
        if (window.confirm(`Archive ${cls.name}? It will be hidden from new admissions.`)) {
            updateClass(cls._id, { status: 'archived' });
        }
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Academic Classes</h1>
                    <p className="text-gray-500 text-sm">Manage your institution's grade levels and classes.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <HelpCircle size={16} /> Help
                    </button>
                    <button
                        onClick={() => setIsClassModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> New Class
                    </button>
                </div>
            </div>

            {/* Content - Full Width Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
                <ClassesTable
                    classes={classes}
                    onArchive={handleArchiveClass}
                    onSelect={() => { }} // No-op for selection on this page
                    hideFooter={true}
                />
            </div>

            {/* Modal */}
            <ClassFormModal
                isOpen={isClassModalOpen}
                onClose={() => setIsClassModalOpen(false)}
                onCreate={handleAddClass}
            />
        </div>
    );
};

export default Classes;
