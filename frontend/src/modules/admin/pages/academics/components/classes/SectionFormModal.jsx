
import React, { useState } from 'react';
import { X, Users, UserCheck } from 'lucide-react';

const SectionFormModal = ({ isOpen, onClose, onCreate }) => {

    // Mock Teachers
    const teachers = [
        { id: 1, name: 'Sarah Jen' },
        { id: 2, name: 'Vikram Singh' },
        { id: 3, name: 'Priya Sharma' }
    ];

    const [formData, setFormData] = useState({
        name: '',
        capacity: 40,
        teacherId: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const teacherName = teachers.find(t => t.id == formData.teacherId)?.name || '';
        onCreate({ ...formData, teacherName });
        onClose();
        setFormData({ name: '', capacity: 40, teacherId: '' });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Users size={20} /> Add Section
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                        <input
                            type="text" name="name" required
                            placeholder="e.g. A, B, Rose"
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                        <input
                            type="number" name="capacity" required min="1"
                            value={formData.capacity} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher (Optional)</label>
                        <div className="relative">
                            <select
                                name="teacherId"
                                value={formData.teacherId} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none bg-white appearance-none"
                            >
                                <option value="">-- Unassigned --</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            <UserCheck className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm">Save Section</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SectionFormModal;
