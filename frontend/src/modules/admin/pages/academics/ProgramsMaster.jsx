import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import ProgramsTable from './components/programs/ProgramsTable';
import ProgramFormModal from './components/programs/ProgramFormModal';
import SemesterStructureEditor from './components/programs/SemesterStructureEditor';

const ProgramsMaster = () => {
    const { courses, fetchCourses, addCourse, deleteCourse, updateCourse } = useAdminStore();
    const user = useAppStore(state => state.user);
    const [loading, setLoading] = useState(true);

    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadCourses = async () => {
            if (user?.branchId) {
                setLoading(true);
                await fetchCourses(user.branchId || 'main');
                setLoading(false);
            }
        };
        loadCourses();
    }, [user, fetchCourses]);

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
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> New Program
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">

                {/* Left Panel: List */}
                <div className="w-full lg:w-1/3 min-w-[320px] flex flex-col gap-4 text-['Inter']">

                    {/* Toolbar */}
                    <div className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-1.5 w-full text-sm border-none outline-none focus:ring-0"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-gray-50 text-xs border border-gray-200 rounded px-2 outline-none cursor-pointer"
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
                <div className="flex-1 h-full">
                    {selectedProgram ? (
                        <SemesterStructureEditor program={selectedProgram} />
                    ) : (
                        <div className="h-full bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-['Inter']">
                            Select a program to configure its structure.
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
