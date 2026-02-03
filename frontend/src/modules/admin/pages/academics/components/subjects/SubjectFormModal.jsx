
import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';

const SubjectFormModal = ({ isOpen, onClose, onCreate, initialData, classes = [] }) => {

    const [formData, setFormData] = useState({
        name: '',
        code: '', // auto-generated if empty
        type: 'theory',
        level: 'school',
        classIds: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                classIds: initialData.classIds ? (initialData.classIds.map(c => c._id || c)) : []
            });
        } else {
            setFormData({
                name: '',
                code: '',
                type: 'theory',
                level: 'school',
                classIds: []
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
    };

    const isEdit = !!initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <BookOpen size={20} /> {isEdit ? 'Edit Subject' : 'New Subject Definition'}
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                            <input
                                type="text" name="name" required
                                placeholder="e.g. Mathematics, Physics Lab"
                                value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        {/* Code is Immutable if Edit */}
                        {isEdit && (
                            <div className="col-span-2 bg-gray-50 p-3 rounded border border-gray-200 flex items-center gap-3">
                                <div className="text-xs text-gray-500 font-mono">CODE: <span className="text-gray-900 font-bold">{formData.code}</span></div>
                                <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded border border-amber-200">Immutable</span>
                            </div>
                        )}

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type" required
                                value={formData.type} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            >
                                <option value="theory">Theory Only</option>
                                <option value="practical">Practical Only</option>
                                <option value="theory_practical">Theory + Practical</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Level</label>
                            <select
                                name="level" required
                                value={formData.level} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            >
                                <option value="school">School (K-12)</option>
                                <option value="ug">Undergraduate</option>
                                <option value="pg">Postgraduate</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Classes</label>
                            <div className="border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-2 bg-gray-50/30">
                                {classes.map(cls => (
                                    <label key={cls._id || cls.id} className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.classIds.includes(cls._id || cls.id)}
                                            onChange={(e) => {
                                                const id = cls._id || cls.id;
                                                const currentIds = [...formData.classIds];
                                                if (e.target.checked) {
                                                    setFormData({ ...formData, classIds: [...currentIds, id] });
                                                } else {
                                                    setFormData({ ...formData, classIds: currentIds.filter(i => i !== id) });
                                                }
                                            }}
                                            className="rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        {cls.name}
                                    </label>
                                ))}
                                {classes.length === 0 && <span className="text-gray-400 italic col-span-2">No classes available.</span>}
                            </div>
                        </div>
                    </div>

                    {isEdit && (
                        <div className="flex gap-2 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                            <AlertCircle size={16} className="shrink-0" />
                            <p>Updates to Subject Name will reflect across all historic records. Ensure consistency.</p>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm">
                            {isEdit ? 'Update Subject' : 'Create Subject'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SubjectFormModal;
