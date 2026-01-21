
import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';

import ProgramsTable from './components/programs/ProgramsTable';
import ProgramFormModal from './components/programs/ProgramFormModal';
import SemesterStructureEditor from './components/programs/SemesterStructureEditor';

const ProgramsMaster = () => {

    // Mock Data
    const [programs, setPrograms] = useState([
        { id: 1, name: 'B.Sc Computer Science', code: 'BSC_CS', type: 'UG', duration: 3, totalSemesters: 6, creditSystem: true, status: 'active' },
        { id: 2, name: 'B.A. English Literature', code: 'BA_ENG', type: 'UG', duration: 3, totalSemesters: 6, creditSystem: false, status: 'active' },
        { id: 3, name: 'M.Sc Physics', code: 'MSC_PHY', type: 'PG', duration: 2, totalSemesters: 4, creditSystem: true, status: 'active' }
    ]);

    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('all');

    // Derived
    const selectedProgram = programs.find(p => p.id === selectedProgramId);

    // Handlers
    const handleCreate = (data) => {
        const newProgram = {
            id: Date.now(),
            ...data,
            code: data.name.split(' ').map(w => w[0]).join('').toUpperCase() + '_' + Date.now().toString().slice(-4),
            status: 'active'
        };
        setPrograms(prev => [newProgram, ...prev]);
        setSelectedProgramId(newProgram.id); // Auto-select new
    };

    const handleDeactivate = (prog) => {
        if (window.confirm(`Archive '${prog.name}'?`)) {
            setPrograms(prev => prev.map(p => p.id === prog.id ? { ...p, status: 'archived' } : p));
        }
    };

    // Filters
    const filteredPrograms = programs.filter(p => {
        if (filterType !== 'all' && p.type !== filterType) return false;
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
                <div className="w-full lg:w-1/3 min-w-[320px] flex flex-col gap-4">

                    {/* Toolbar */}
                    <div className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-3 py-1.5 w-full text-sm border-none outline-none focus:ring-0"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-gray-50 text-xs border border-gray-200 rounded px-2 outline-none"
                        >
                            <option value="all">All Types</option>
                            <option value="UG">UG</option>
                            <option value="PG">PG</option>
                        </select>
                    </div>

                    <ProgramsTable
                        programs={filteredPrograms}
                        selectedProgramId={selectedProgramId}
                        onSelect={(p) => setSelectedProgramId(p.id)}
                        onDeactivate={handleDeactivate}
                    />
                </div>

                {/* Right Panel: Detail Editor */}
                <div className="flex-1">
                    {selectedProgram ? (
                        <SemesterStructureEditor program={selectedProgram} />
                    ) : (
                        <div className="h-full bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
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
