
import React, { useState } from 'react';
import { X, Users, UserCheck } from 'lucide-react';

const SectionFormModal = ({ isOpen, onClose, onCreate, classes = [], initialClassId = '', initialData = null }) => {

    const [formData, setFormData] = useState({
        classId: initialClassId,
        name: ''
    });

    // Update form when modal opens or initialData changes
    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    classId: initialClassId || initialData.classId || '',
                    name: initialData.name || ''
                });
            } else {
                setFormData({
                    classId: initialClassId || (classes[0]?.id || ''),
                    name: ''
                });
            }
        }
    }, [isOpen, initialClassId, classes, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData.classId, { ...formData });
        onClose();
        setFormData({ classId: initialClassId, name: '' });
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                        <select
                            name="classId" required
                            value={formData.classId} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                        >
                            <option value="" disabled>-- Select Class --</option>
                            {classes.map(cls => (
                                <option key={cls._id || cls.id} value={cls._id || cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                        <input
                            type="text" name="name" required
                            placeholder="e.g. A, B, Rose"
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
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
