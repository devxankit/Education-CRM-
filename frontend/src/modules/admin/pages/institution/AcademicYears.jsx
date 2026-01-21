
import React, { useState } from 'react';
import { Plus, History } from 'lucide-react';
import AcademicYearTable from './components/academic-years/AcademicYearTable';
import CreateYearModal from './components/academic-years/CreateYearModal';
import ActivateYearModal from './components/academic-years/ActivateYearModal';
import CloseYearModal from './components/academic-years/CloseYearModal';

const AcademicYears = () => {
    // Mock Role
    const isSuperAdmin = true;

    // Mock Data
    const [years, setYears] = useState([
        {
            id: 1,
            name: '2024-2025',
            startDate: '2024-04-01',
            endDate: '2025-03-31',
            status: 'active',
            createdOn: '2024-01-15',
            createdBy: 'System Admin'
        },
        {
            id: 2,
            name: '2025-2026',
            startDate: '2025-04-01',
            endDate: '2026-03-31',
            status: 'upcoming',
            createdOn: '2024-12-01',
            createdBy: 'Super Admin'
        },
        {
            id: 3,
            name: '2023-2024',
            startDate: '2023-04-01',
            endDate: '2024-03-31',
            status: 'closed',
            createdOn: '2023-01-10',
            createdBy: 'System Admin'
        }
    ]);

    // Modal States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activationTarget, setActivationTarget] = useState(null);
    const [closureTarget, setClosureTarget] = useState(null);

    // -- Handlers --

    const handleCreate = (data) => {
        const newYear = {
            id: Date.now(),
            ...data,
            status: 'upcoming',
            createdOn: new Date().toISOString().split('T')[0],
            createdBy: 'Super Admin'
        };
        setYears(prev => [...prev, newYear]);
        setIsCreateOpen(false);
        // Toast Success here
        console.log("Created Year:", newYear);
    };

    const handleActivate = (id, reason) => {
        console.log(`Activating Year ${id}. Reason: ${reason}`);

        setYears(prev => prev.map(y => {
            // Target becomes active
            if (y.id === id) return { ...y, status: 'active' };
            // Previous active becomes closed
            if (y.status === 'active') return { ...y, status: 'closed' };

            return y;
        }));

        setActivationTarget(null);
        // Toast Success here
    };

    const handleClose = (id, reason) => {
        console.log(`Closing Year ${id}. Reason: ${reason}`);

        setYears(prev => prev.map(y => {
            if (y.id === id) return { ...y, status: 'closed' };
            return y;
        }));

        setClosureTarget(null);
        // Toast Success here
    };

    const handleViewDetails = (year) => {
        alert(`View Details for ${year.name} (Metrics & Reports)`);
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Academic Years</h1>
                    <p className="text-gray-500 text-sm">Control active sessions, historical archives, and system time.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <History size={16} />
                        View Logs
                    </button>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm opacity-100" // Opacity managed by logic
                        >
                            <Plus size={18} />
                            New Session
                        </button>
                    )}
                </div>
            </div>

            {/* Main Table */}
            <AcademicYearTable
                years={years}
                onActivate={(year) => setActivationTarget(year)}
                onCloseYear={(year) => setClosureTarget(year)}
                onView={handleViewDetails}
                isSuperAdmin={isSuperAdmin}
            />

            {/* Count Footer */}
            <div className="mt-4 text-xs text-center text-gray-400">
                System enforces Single Active Year policy.
            </div>

            {/* Modals */}
            <CreateYearModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreate}
            />

            <ActivateYearModal
                isOpen={!!activationTarget}
                onClose={() => setActivationTarget(null)}
                year={activationTarget}
                onConfirm={handleActivate}
            />

            <CloseYearModal
                isOpen={!!closureTarget}
                onClose={() => setClosureTarget(null)}
                year={closureTarget}
                onConfirm={handleClose}
            />
        </div>
    );
};

export default AcademicYears;
