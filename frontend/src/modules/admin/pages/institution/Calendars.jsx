
import React, { useState, useEffect, useCallback } from 'react';
import {
    Calendar as CalendarIcon,
    List,
    Plus,
    Download,
    UploadCloud,
    Loader2
} from 'lucide-react';

import CalendarGrid from './components/calendars/CalendarGrid';
import HolidayTable from './components/calendars/HolidayTable';
import HolidayTypeLegend from './components/calendars/HolidayTypeLegend';
import HolidayFormModal from './components/calendars/HolidayFormModal';
import { API_URL } from '@/app/api';

const Calendars = () => {
    // State
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [branches, setBranches] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('all');

    // Mock Role
    const isSuperAdmin = true;

    // Data State
    const [holidays, setHolidays] = useState([]);

    const fetchBranches = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/branch`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setBranches(data.data);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    }, []);

    const fetchHolidays = useCallback(async (branchId = 'all') => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const url = branchId === 'all' 
                ? `${API_URL}/holiday` 
                : `${API_URL}/holiday?branchId=${branchId}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setHolidays(data.data);
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        fetchHolidays(selectedBranchId);
    }, [selectedBranchId, fetchHolidays]);

    // Handlers
    const handleSave = async (holidayData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const method = holidayData._id ? 'PUT' : 'POST';
            const url = holidayData._id 
                ? `${API_URL}/holiday/${holidayData._id}` 
                : `${API_URL}/holiday`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(holidayData)
            });

            const data = await response.json();
            if (data.success) {
                alert(holidayData._id ? 'Holiday Updated Successfully' : 'Holiday Created Successfully');
                fetchHolidays();
                setIsCreateOpen(false);
                setEditingHoliday(null);
            } else {
                alert(data.message || 'Failed to save holiday');
            }
        } catch (error) {
            console.error('Error saving holiday:', error);
            alert('An error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (holiday) => {
        setEditingHoliday(holiday);
        setIsCreateOpen(true);
    };

    const handleDeactivate = async (holiday) => {
        const confirm = window.confirm("Are you sure you want to delete this holiday?");
        if (!confirm) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/holiday/${holiday._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                alert('Holiday Deleted Successfully');
                fetchHolidays();
            } else {
                alert(data.message || 'Failed to delete holiday');
            }
        } catch (error) {
            console.error('Error deleting holiday:', error);
            alert('An error occurred while deleting');
        } finally {
            setLoading(false);
        }
    };

    const handleDateClick = (day, dateObj, holiday) => {
        if (holiday) {
            handleEdit(holiday); // Open edit if clicked existing
        } else {
            // Open Create with pre-filled date
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            setEditingHoliday(null);
            // We need a way to pass initial date to modal, actually simplistic modal handles this internally via form state reset
            // Refactor: Pass initialData as partial
            setEditingHoliday({ startDate: dateStr, endDate: dateStr, name: '', type: 'academic', applicableTo: ['students', 'teachers', 'staff'], isRange: false });
            setIsCreateOpen(true);
        }
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Academic Calendar</h1>
                    <p className="text-gray-500 text-sm">Manage holidays, non-working days, and exam blocks.</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Calendar View"
                        >
                            <CalendarIcon size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <UploadCloud size={16} /> Bulk Upload
                    </button>

                    {isSuperAdmin && (
                        <button
                            onClick={() => { setEditingHoliday(null); setIsCreateOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                        >
                            <Plus size={18} /> Add Holiday
                        </button>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <HolidayTypeLegend />
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter by Branch:</span>
                    <select
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none min-w-[180px]"
                    >
                        <option value="all">All Branches</option>
                        {branches.map(branch => (
                            <option key={branch._id} value={branch._id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {fetching ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                        <p className="text-gray-500 font-medium italic">Loading calendar data...</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <CalendarGrid
                        holidays={holidays}
                        onDateClick={handleDateClick}
                    />
                ) : (
                    <HolidayTable
                        holidays={holidays}
                        onEdit={handleEdit}
                        onDeactivate={handleDeactivate}
                        isSuperAdmin={isSuperAdmin}
                    />
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs text-center text-gray-400">
                Changes to calendar automatically update pending attendance registers.
            </div>

            {/* Modal */}
            <HolidayFormModal
                isOpen={isCreateOpen}
                onClose={() => { setIsCreateOpen(false); setEditingHoliday(null); }}
                onSave={handleSave}
                initialData={editingHoliday}
                loading={loading}
                branches={branches}
            />
        </div>
    );
};

export default Calendars;
