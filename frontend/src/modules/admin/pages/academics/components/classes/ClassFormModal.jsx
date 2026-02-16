import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';

const ClassFormModal = ({ isOpen, onClose, onCreate, defaultBranchId = '', defaultAcademicYearId = '', academicYears = [] }) => {
    const [formData, setFormData] = useState({
        branchId: '',
        academicYearId: '',
        name: '',
        level: 'primary',
        board: 'CBSE',
        capacity: 40
    });
    const branches = useAdminStore(state => state.branches);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);

    useEffect(() => {
        if (isOpen && branches.length === 0) fetchBranches();
    }, [isOpen, branches, fetchBranches]);

    useEffect(() => {
        if (isOpen) {
            const bid = defaultBranchId || branches[0]?._id || '';
            setFormData(prev => ({
                ...prev,
                branchId: bid,
                academicYearId: defaultAcademicYearId || ''
            }));
        }
    }, [isOpen, defaultBranchId, defaultAcademicYearId, branches]);

    // Fetch academic years when branch changes - only show years for selected branch
    useEffect(() => {
        if (isOpen && formData.branchId && formData.branchId.length === 24) {
            fetchAcademicYears(formData.branchId);
        }
    }, [isOpen, formData.branchId, fetchAcademicYears]);

    useEffect(() => {
        if (isOpen && formData.branchId && academicYears.length > 0 && !formData.academicYearId) {
            const active = academicYears.find(y => y.status === 'active') || academicYears[0];
            setFormData(prev => ({ ...prev, academicYearId: active?._id || '' }));
        }
    }, [isOpen, formData.branchId, academicYears]);

    const yearsToShow = formData.branchId ? academicYears : [];

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        const next = { ...formData, [name]: value };
        if (name === 'branchId') next.academicYearId = '';
        setFormData(next);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.academicYearId) {
            alert('Please select an Academic Year.');
            return;
        }
        if (!formData.branchId || formData.branchId === 'main') {
            alert('Please select a Branch.');
            return;
        }
        onCreate(formData);
        onClose();
        setFormData({ branchId: '', academicYearId: '', name: '', level: 'primary', board: 'CBSE', capacity: 40 });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <GraduationCap size={20} /> Add Class
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <MapPin size={14} className="inline mr-1 align-middle" /> Branch
                        </label>
                        <select
                            name="branchId" required
                            value={formData.branchId} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch._id || branch.id} value={branch._id || branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar size={14} className="inline mr-1 align-middle" /> Academic Year <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="academicYearId" required
                            value={formData.academicYearId} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            disabled={!formData.branchId}
                        >
                            <option value="">{formData.branchId ? 'Select Academic Year' : 'Select Branch first'}</option>
                            {yearsToShow.map(y => (
                                <option key={y._id} value={y._id}>{y.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-0.5">Academic years for selected branch only.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                        <input
                            type="text" name="name" required
                            placeholder="e.g. Class 10"
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Level</label>
                        <select
                            name="level" required
                            value={formData.level} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                        >
                            <option value="primary">Primary (1-5)</option>
                            <option value="secondary">Secondary (6-10)</option>
                            <option value="senior_secondary">Senior Secondary (11-12)</option>
                            <option value="ug">Undergraduate</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Board / Affiliation</label>
                        <select
                            name="board" required
                            value={formData.board} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                        >
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="STATE">State Board</option>
                            <option value="IB">IB</option>
                            <option value="IGCSE">IGCSE</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Capacity (Default for Sections)</label>
                        <input
                            type="number" name="capacity" required
                            min="1" max="500"
                            value={formData.capacity} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm">Create Class</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ClassFormModal;
