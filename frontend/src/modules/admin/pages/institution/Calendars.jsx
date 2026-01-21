
import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    List,
    Plus,
    Download,
    UploadCloud
} from 'lucide-react';

import CalendarGrid from './components/calendars/CalendarGrid';
import HolidayTable from './components/calendars/HolidayTable';
import HolidayTypeLegend from './components/calendars/HolidayTypeLegend';
import HolidayFormModal from './components/calendars/HolidayFormModal';

const Calendars = () => {
    // State
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);

    // Mock Role
    const isSuperAdmin = true;

    // Mock Data (Dates for current month context mostly)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    const [holidays, setHolidays] = useState([
        {
            id: 1,
            name: 'Republic Day',
            date: `${year}-01-26`,
            type: 'academic',
            status: 'active',
            applicableTo: ['students', 'teachers', 'staff']
        },
        {
            id: 2,
            name: 'Exam Preparation Leave',
            date: `${year}-${month}-15`,
            type: 'exam',
            status: 'active',
            applicableTo: ['students']
        },
        {
            id: 3,
            name: 'Holi Festival',
            date: `${year}-${month}-25`,
            type: 'academic',
            status: 'active',
            applicableTo: ['students', 'teachers', 'staff']
        },
        {
            id: 4,
            name: 'Staff Training Day',
            date: `${year}-${month}-10`,
            type: 'staff',
            status: 'active',
            applicableTo: ['students'] // Students have holiday, staff works (training)
            // Wait, if type is 'staff', usually implies Staff Holiday. 
            // Mock logic: Type helps color, ApplicableTo helps logic.
        }
    ]);

    // Handlers
    const handleSave = (holidayData) => {
        if (editingHoliday) {
            // Update
            setHolidays(prev => prev.map(h => h.id === holidayData.id ? { ...holidayData, id: h.id } : h));
        } else {
            // Create
            setHolidays(prev => [...prev, { ...holidayData, id: Date.now(), status: 'active' }]);
        }
        setEditingHoliday(null);
    };

    const handleEdit = (holiday) => {
        setEditingHoliday(holiday);
        setIsCreateOpen(true);
    };

    const handleDeactivate = (holiday) => {
        const confirm = window.confirm("Deactivate this holiday? It will be removed from attendance calculations.");
        if (confirm) {
            setHolidays(prev => prev.map(h => h.id === holiday.id ? { ...h, status: 'inactive' } : h));
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
            <div className="mb-6">
                <HolidayTypeLegend />
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {viewMode === 'grid' ? (
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
            />
        </div>
    );
};

export default Calendars;
