
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarGrid = ({ holidays, onDateClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helpers
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const getHolidaysForDay = (day) => {
        const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        cellDate.setHours(0, 0, 0, 0);
        return (holidays || []).filter(h => {
            if (!h.startDate) return false;
            const start = new Date(h.startDate);
            const end = h.endDate ? new Date(h.endDate) : start;
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return cellDate >= start && cellDate <= end && h.status !== 'inactive';
        });
    };

    const renderCells = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const rows = [];
        let cells = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border border-t-0 border-l-0 border-gray-100"></div>);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayHolidays = getHolidaysForDay(day);
            const firstHoliday = dayHolidays[0];
            const holidayColorClass = firstHoliday
                ? (firstHoliday.type === 'academic' ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : firstHoliday.type === 'exam' ? 'bg-purple-100 text-purple-700 border-purple-200'
                        : firstHoliday.type === 'staff' ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-amber-100 text-amber-700 border-amber-200')
                : '';

            cells.push(
                <div
                    key={day}
                    onClick={() => onDateClick(day, currentDate, firstHoliday || null)}
                    className={`h-24 border border-t-0 border-l-0 border-gray-100 p-2 relative hover:bg-gray-50 transition-colors cursor-pointer group ${isToday(day) ? 'bg-indigo-50/30' : 'bg-white'}`}
                >
                    <span className={`text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 group-hover:bg-gray-200'}`}>
                        {day}
                    </span>

                    {dayHolidays.length > 0 && (
                        <div className="mt-1.5 space-y-1 overflow-y-auto max-h-[60px]">
                            {dayHolidays.map((h) => {
                                const color = h.type === 'academic' ? 'bg-blue-100 text-blue-700 border-blue-200'
                                    : h.type === 'exam' ? 'bg-purple-100 text-purple-700 border-purple-200'
                                        : h.type === 'staff' ? 'bg-green-100 text-green-700 border-green-200'
                                            : 'bg-amber-100 text-amber-700 border-amber-200';
                                return (
                                    <div key={h._id || h.id || h.name} className={`p-1 rounded text-[10px] font-medium border truncate leading-tight ${color}`}>
                                        {h.name}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );

            // New Row every 7 days (or if cells filled 7)
            if (cells.length === 7) {
                rows.push(<div key={`row-${rows.length}`} className="grid grid-cols-7">{cells}</div>);
                cells = [];
            }
        }

        // Fill remaining slots
        if (cells.length > 0) {
            while (cells.length < 7) {
                cells.push(<div key={`empty-end-${cells.length}`} className="h-24 bg-gray-50/50 border border-t-0 border-l-0 border-gray-100"></div>);
            }
            rows.push(<div key={`row-last`} className="grid grid-cols-7">{cells}</div>);
        }

        return rows;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-4">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"><ChevronLeft size={20} /></button>
                    <h2 className="text-lg font-bold text-gray-800 font-mono flex items-center gap-2 w-48 justify-center">
                        <CalendarIcon size={18} className="text-indigo-600 -mt-0.5" />
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"><ChevronRight size={20} /></button>
                </div>
                <div>
                    {/* Can add jump to today or filters here */}
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center py-2">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            {/* Grid Body */}
            <div className="bg-gray-200 border-l border-t border-gray-200">
                {renderCells()}
            </div>
        </div>
    );
};

export default CalendarGrid;
