
import React, { useState, useEffect } from 'react';
import { X, CalendarPlus, Check, Info } from 'lucide-react';

const HolidayFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const defaultForm = {
        name: '',
        type: 'academic',
        startDate: '',
        endDate: '',
        isRange: false,
        applicableTo: ['students', 'teachers', 'staff'], // Default to all
        branchId: 'all'
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                isRange: initialData.startDate !== initialData.endDate,
                startDate: initialData.date || initialData.startDate // Handle legacy or unified
            });
        } else {
            setFormData(defaultForm);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleApplicableChange = (role) => {
        setFormData(prev => {
            const current = prev.applicableTo;
            const newRoles = current.includes(role)
                ? current.filter(r => r !== role)
                : [...current, role];
            return { ...prev, applicableTo: newRoles };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            // Normalize dates
            endDate: formData.isRange ? formData.endDate : formData.startDate,
            date: formData.startDate // Flat date for grid
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <CalendarPlus size={20} /> {initialData ? 'Edit Holiday' : 'Add Holiday'}
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Name & Type */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Independence Day"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            >
                                <option value="academic">Academic (All Closed)</option>
                                <option value="exam">Exam Prep (No Classes)</option>
                                <option value="staff">Staff Only (No Students)</option>
                                <option value="restricted">Restricted / Optional</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Logic */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-semibold text-gray-700">Date Setup</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-gray-500">Range?</span>
                                <input
                                    type="checkbox"
                                    name="isRange"
                                    checked={formData.isRange}
                                    onChange={handleChange}
                                    className="accent-indigo-600"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    required
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                />
                            </div>
                            {formData.isRange && (
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        required
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Applicability */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Impact On Attendance</label>
                        <div className="flex gap-4">
                            {['students', 'teachers', 'staff'].map(role => (
                                <label key={role} className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 px-3 py-2 rounded-lg hover:border-indigo-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.applicableTo.includes(role)}
                                        onChange={() => handleApplicableChange(role)}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="capitalize text-sm text-gray-700">{role}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex items-start gap-2 mt-2 text-xs text-gray-400">
                            <Info size={14} className="shrink-0 mt-0.5" />
                            Unchecked groups will be marked as "Working Day" in payroll/attendance.
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm"
                        >
                            Save Holiday
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default HolidayFormModal;
