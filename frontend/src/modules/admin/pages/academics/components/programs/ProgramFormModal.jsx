
import React, { useState } from 'react';
import { X, GraduationCap, AlertCircle } from 'lucide-react';

const ProgramFormModal = ({ isOpen, onClose, onCreate }) => {

    const [formData, setFormData] = useState({
        name: '',
        type: 'UG',
        duration: 3,
        totalSemesters: 6,
        creditSystem: true
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
        setFormData({ name: '', type: 'UG', duration: 3, totalSemesters: 6, creditSystem: true });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <GraduationCap size={20} /> Create Academic Program
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Program / Degree Name</label>
                        <input
                            type="text" name="name" required
                            placeholder="e.g. B.Tech Computer Science"
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
                            <select
                                name="type" required
                                value={formData.type} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            >
                                <option value="UG">Undergraduate (UG)</option>
                                <option value="PG">Postgraduate (PG)</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Certificate">Certificate</option>
                            </select>
                        </div>

                        {/* Dynamic Logic: Typically UG is 3/4 yrs, PG 2. But we leave flexible */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
                            <input
                                type="number" name="duration" required min="1" max="6"
                                value={formData.duration} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Semesters</label>
                            <input
                                type="number" name="totalSemesters" required min="1" max="12"
                                value={formData.totalSemesters} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                            />
                        </div>

                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox" name="creditSystem"
                                    checked={formData.creditSystem} onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">Enable Credit System Calculation</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-3 rounded text-xs text-amber-900 flex gap-2">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <p>Total Semesters defines the number of internal division tabs created automatically. You can configure each semester separately.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm">
                            Initialize Program
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProgramFormModal;
