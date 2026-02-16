import React, { useState, useEffect, useMemo } from 'react';
import { Plus, HelpCircle, MapPin, Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAdminStore, selectAcademicYearsForSelect } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import ClassesTable from './components/classes/ClassesTable';
import ClassFormModal from './components/classes/ClassFormModal';

const Classes = () => {
    const classes = useAdminStore(state => state.classes);
    const branches = useAdminStore(state => state.branches);
    const academicYears = useAdminStore(selectAcademicYearsForSelect);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);
    const addClass = useAdminStore(state => state.addClass);
    const updateClass = useAdminStore(state => state.updateClass);
    const user = useAppStore(state => state.user);

    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState('main');
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const totalPages = Math.ceil((classes?.length || 0) / pageSize) || 1;
    const paginatedClasses = useMemo(() => {
        const list = classes || [];
        const start = (currentPage - 1) * pageSize;
        return list.slice(start, start + pageSize);
    }, [classes, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
        setSelectedAcademicYearId('');
    }, [selectedBranchId]);
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        const branchId = selectedBranchId === 'main' ? null : selectedBranchId;
        fetchAcademicYears(branchId);
    }, [selectedBranchId, fetchAcademicYears]);

    useEffect(() => {
        if (user?.branchId && user.branchId !== 'all' && user.branchId.length === 24) {
            setSelectedBranchId(user.branchId);
        }
    }, [user?.branchId]);

    useEffect(() => {
        if (academicYears.length > 0 && !selectedAcademicYearId) {
            const active = academicYears.find(y => y.status === 'active') || academicYears[0];
            setSelectedAcademicYearId(active?._id || '');
        }
    }, [academicYears, selectedAcademicYearId]);

    useEffect(() => {
        const branchId = selectedBranchId || 'main';
        fetchClasses(branchId, true, selectedAcademicYearId || undefined);
    }, [selectedBranchId, selectedAcademicYearId, fetchClasses]);

    // Handlers
    const handleAddClass = async (data) => {
        await addClass(data);
        fetchClasses(selectedBranchId || 'main', true, selectedAcademicYearId || undefined);
    };

    const handleArchiveClass = (cls) => {
        if (window.confirm(`Archive ${cls.name}? It will be hidden from new admissions.`)) {
            updateClass(cls._id, { status: 'archived' });
        }
    };

    const handleUnarchiveClass = (cls) => {
        if (window.confirm(`Unarchive ${cls.name}? It will be available for new admissions.`)) {
            updateClass(cls._id, { status: 'active' });
        }
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Academic Classes</h1>
                    <p className="text-gray-500 text-sm">Manage your institution's grade levels and classes.</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <MapPin size={16} className="text-indigo-500" />
                            <select
                                value={selectedBranchId || 'main'}
                                onChange={(e) => setSelectedBranchId(e.target.value)}
                                disabled={user?.branchId && user.branchId !== 'all'}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500 min-w-[160px]"
                            >
                                <option value="main">All Branches</option>
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-500" />
                            <select
                                value={selectedAcademicYearId || ''}
                                onChange={(e) => setSelectedAcademicYearId(e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]"
                            >
                                <option value="">All Years</option>
                                {academicYears.map(y => (
                                    <option key={y._id} value={y._id}>{y.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
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
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="bg-white rounded-t-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
                    <ClassesTable
                        classes={paginatedClasses}
                        onArchive={handleArchiveClass}
                        onUnarchive={handleUnarchiveClass}
                        onSelect={() => {}}
                        hideFooter={true}
                    />
                </div>
                {classes && classes.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 border-t-0 rounded-b-xl shadow-sm text-sm">
                        <span className="text-gray-600">
                            Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, classes.length)} of {classes.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-xs">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <ClassFormModal
                isOpen={isClassModalOpen}
                onClose={() => setIsClassModalOpen(false)}
                onCreate={handleAddClass}
                defaultBranchId={selectedBranchId === 'main' ? (branches[0]?._id || '') : selectedBranchId}
                defaultAcademicYearId={selectedAcademicYearId}
                academicYears={academicYears}
            />
        </div>
    );
};

export default Classes;
