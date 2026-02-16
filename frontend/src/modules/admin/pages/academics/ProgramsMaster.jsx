import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Loader2, MapPin, Layers } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import ProgramsTable from './components/programs/ProgramsTable';
import ProgramFormModal from './components/programs/ProgramFormModal';
import SemesterStructureEditor from './components/programs/SemesterStructureEditor';

const ProgramsMaster = () => {
    const { courses, fetchCourses, addCourse, deleteCourse, updateCourse, branches, fetchBranches } = useAdminStore();
    const user = useAppStore(state => state.user);
    const [loading, setLoading] = useState(true);
    const [selectedBranchId, setSelectedBranchId] = useState('main');

    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch branches first
    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    // Set selected branch for staff locked to one branch
    useEffect(() => {
        if (user?.branchId && user.branchId !== 'all' && user.branchId.length === 24) {
            setSelectedBranchId(user.branchId);
        }
    }, [user?.branchId]);

    // Fetch courses when branch is selected
    useEffect(() => {
        const loadCourses = async () => {
            const branchId = (selectedBranchId && selectedBranchId !== 'main') ? selectedBranchId : null;
            if (branchId) {
                setLoading(true);
                try {
                    await fetchCourses(branchId);
                } catch (error) {
                    console.error('Error loading courses:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadCourses();
    }, [selectedBranchId, user?.branchId, fetchCourses]);

    // Derived
    const selectedProgram = courses.find(p => (p._id || p.id) === selectedProgramId);

    // Handlers
    const handleCreate = async (data) => {
        try {
            const result = await addCourse({
                ...data,
                branchId: user?.branchId || 'main'
            });
            if (result) {
                setSelectedProgramId(result._id || result.id);
            }
        } catch (error) {
            console.error("Failed to create course", error);
        }
    };

    const handleDeactivate = async (prog) => {
        if (window.confirm(`Archive '${prog.name}'?`)) {
            try {
                // The backend uses 'archived' status in the model
                await updateCourse(prog._id || prog.id, { status: 'archived' });
            } catch (error) {
                console.error("Failed to archive course", error);
            }
        }
    };

    // Filters
    const filteredPrograms = courses.filter(p => {
        if (filterType !== 'all' && p.type !== filterType) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.code.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Programs & Courses</h1>
                    <p className="text-gray-500 text-sm">Design the academic structure for degrees and certificates.</p>
                    <div className="flex items-center gap-2 mt-3">
                        <Filter size={16} className="text-gray-400" />
                        <MapPin size={16} className="text-indigo-500" />
                        <select
                            value={selectedBranchId || 'main'}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            disabled={user?.branchId && user.branchId !== 'all'}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
                        >
                            <option value="main">All Branches</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                >
                    <Plus size={18} /> New Program
                </button>
            </div>

            {/* Split View */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[480px] min-w-0 overflow-hidden">

                {/* Left Panel: List */}
                <div className="w-full lg:w-1/3 lg:min-w-[300px] lg:max-w-[400px] flex flex-col gap-4 shrink-0">

                    {/* Toolbar */}
                    <div className="flex gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-full text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-gray-50/50"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 min-w-[100px]"
                        >
                            <option value="all">All Types</option>
                            <option value="UG">UG</option>
                            <option value="PG">PG</option>
                            <option value="Diploma">Diploma</option>
                        </select>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 h-full text-center">
                                <Loader2 className="animate-spin text-indigo-500 mb-2" size={24} />
                                <span className="text-sm text-gray-400">Loading courses...</span>
                            </div>
                        ) : (
                            <ProgramsTable
                                programs={filteredPrograms}
                                selectedProgramId={selectedProgramId}
                                onSelect={(p) => setSelectedProgramId(p._id || p.id)}
                                onDeactivate={handleDeactivate}
                            />
                        )}
                    </div>
                </div>

                {/* Right Panel: Detail Editor */}
                <div className="flex-1 min-w-0 h-full flex flex-col">
                    {selectedProgram ? (
                        <SemesterStructureEditor program={selectedProgram} />
                    ) : (
                        <div className="h-full min-h-[320px] bg-gray-50/80 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500 p-8">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Layers className="text-gray-400" size={28} />
                            </div>
                            <p className="font-medium text-gray-600">No program selected</p>
                            <p className="text-sm mt-1">Select a program from the list to configure its structure</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Modal */}
            <ProgramFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />

        </div>
    );
};

export default ProgramsMaster;
