
import React from 'react';
import { Calendar, Trash2, Edit } from 'lucide-react';

const HolidayTable = ({ holidays, onEdit, onDeactivate, isSuperAdmin }) => {

    const formatDate = (d) => {
        if (!d) return '—';
        const x = new Date(d);
        return isNaN(x.getTime()) ? '—' : x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    const getDateDisplay = (h) => {
        const start = formatDate(h.startDate);
        if (h.isRange && h.endDate && String(h.startDate) !== String(h.endDate)) {
            const end = formatDate(h.endDate);
            return `${start} – ${end}`;
        }
        return start;
    };
    const sorted = [...holidays].sort((a, b) => new Date(a.startDate || a.date) - new Date(b.startDate || b.date));

    if (!holidays || holidays.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Calendar className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Holidays Configured</h3>
                <p className="text-gray-500 text-sm mt-1">Switch to List View to add bulk holidays or use the Calendar.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Date</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Holiday Name</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Type</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Applicable To</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {sorted.map((holiday) => (
                            <tr key={holiday._id || holiday.id} className={`hover:bg-gray-50 transition-colors ${holiday.status === 'inactive' ? 'opacity-50 bg-gray-50' : ''}`}>
                                <td className="px-6 py-4 font-mono text-gray-600">
                                    {getDateDisplay(holiday)}
                                </td>

                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {holiday.name}
                                    {holiday.status === 'inactive' && <span className="ml-2 text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">INACTIVE</span>}
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`
                                        uppercase text-[10px] font-bold px-2 py-1 rounded border
                                        ${holiday.type === 'academic' ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : holiday.type === 'exam' ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                : holiday.type === 'staff' ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'}
                                     `}>
                                        {holiday.type}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-xs text-gray-500">
                                    <div className="flex flex-wrap gap-1">
                                        {Array.isArray(holiday.applicableTo) && holiday.applicableTo.includes('students') && <span className="bg-gray-100 px-1.5 rounded">Students</span>}
                                        {Array.isArray(holiday.applicableTo) && holiday.applicableTo.includes('teachers') && <span className="bg-gray-100 px-1.5 rounded">Teachers</span>}
                                        {Array.isArray(holiday.applicableTo) && holiday.applicableTo.includes('staff') && <span className="bg-gray-100 px-1.5 rounded">Staff</span>}
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    {isSuperAdmin && holiday.status !== 'inactive' && (
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(holiday)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDeactivate(holiday)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Deactivate"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HolidayTable;
