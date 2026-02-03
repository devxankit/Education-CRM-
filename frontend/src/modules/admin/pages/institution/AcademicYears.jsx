
import React, { useState, useEffect } from 'react';
import { Plus, History } from 'lucide-react';
import AcademicYearTable from './components/academic-years/AcademicYearTable';
import CreateYearModal from './components/academic-years/CreateYearModal';
import ActivateYearModal from './components/academic-years/ActivateYearModal';
import CloseYearModal from './components/academic-years/CloseYearModal';
import { API_URL } from '../../../../app/api';

const AcademicYears = () => {
    // Role (Admin Context)
    const isSuperAdmin = true;

    // Data State
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Modal States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activationTarget, setActivationTarget] = useState(null);
    const [closureTarget, setClosureTarget] = useState(null);

    // Fetch academic years on component mount
    useEffect(() => {
        fetchAcademicYears();
    }, []);

    const fetchAcademicYears = async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/academic-year`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                // Transform backend data to match frontend expected format
                const transformedYears = data.data.map(year => ({
                    id: year._id,
                    _id: year._id,
                    name: year.name,
                    startDate: year.startDate?.split('T')[0] || year.startDate,
                    endDate: year.endDate?.split('T')[0] || year.endDate,
                    status: year.status,
                    createdOn: year.createdAt?.split('T')[0] || new Date(year.createdAt).toISOString().split('T')[0],
                    createdBy: 'System Admin' // Can be populated from backend if needed
                }));
                setYears(transformedYears);
            }
        } catch (error) {
            console.error('Error fetching academic years:', error);
            alert('Failed to load academic years');
        } finally {
            setFetching(false);
        }
    };

    // -- Handlers --

    const handleCreate = async (data) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/academic-year`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                alert('Academic Year created successfully');
                fetchAcademicYears();
                setIsCreateOpen(false);
            } else {
                alert(result.message || 'Failed to create academic year');
            }
        } catch (error) {
            console.error('Error creating academic year:', error);
            alert('An error occurred while creating academic year');
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (id, reason) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/academic-year/activate/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason })
            });

            const result = await response.json();
            if (result.success) {
                alert('Academic Year activated successfully');
                fetchAcademicYears();
                setActivationTarget(null);
            } else {
                alert(result.message || 'Failed to activate academic year');
            }
        } catch (error) {
            console.error('Error activating academic year:', error);
            alert('An error occurred while activating academic year');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async (id, reason) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/academic-year/close/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason })
            });

            const result = await response.json();
            if (result.success) {
                alert('Academic Year closed successfully');
                fetchAcademicYears();
                setClosureTarget(null);
            } else {
                alert(result.message || 'Failed to close academic year');
            }
        } catch (error) {
            console.error('Error closing academic year:', error);
            alert('An error occurred while closing academic year');
        } finally {
            setLoading(false);
        }
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
            {fetching ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <AcademicYearTable
                    years={years}
                    onActivate={(year) => setActivationTarget(year)}
                    onCloseYear={(year) => setClosureTarget(year)}
                    onView={handleViewDetails}
                    isSuperAdmin={isSuperAdmin}
                />
            )}

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
