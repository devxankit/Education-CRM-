
import React, { useState, useEffect } from 'react';
import { X, GraduationCap, AlertCircle, MapPin, Calendar } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';

const ProgramFormModal = ({ isOpen, onClose, onCreate, academicYears = [] }) => {
    const [formData, setFormData] = useState({
        branchId: '',
        academicYearId: '',
        name: '',
        type: 'UG',
        duration: 3,
        totalSemesters: 6,
        creditSystem: true
    });
    const branches = useAdminStore(state => state.branches);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);

    useEffect(() => {
        if (isOpen && branches.length === 0) fetchBranches();
    }, [isOpen, branches.length, fetchBranches]);

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                branchId: branches[0]?._id || '',
                academicYearId: ''
            }));
        }
    }, [isOpen, branches]);

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
        const { name, value, type, checked } = e.target;
        const next = { ...formData, [name]: type === 'checkbox' ? checked : value };
        if (name === 'branchId') next.academicYearId = '';
        setFormData(next);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.branchId || formData.branchId === 'main') {
            alert('Please select a Branch.');
            return;
        }
        onCreate(formData);
        onClose();
        setFormData({ branchId: '', academicYearId: '', name: '', type: 'UG', duration: 3, totalSemesters: 6, creditSystem: true });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="shrink-0 bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <GraduationCap size={20} /> Create Academic Program
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <MapPin size={14} className="inline mr-1 align-middle" /> Branch
                        </label>
                        <select
                            name="branchId"
                            required
                            value={formData.branchId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar size={14} className="inline mr-1 align-middle" /> Academic Year
                        </label>
                        <select
                            name="academicYearId"
                            value={formData.academicYearId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            disabled={!formData.branchId}
                        >
                            <option value="">{formData.branchId ? 'Select Academic Year (optional)' : 'Select Branch first'}</option>
                            {yearsToShow.map(y => (
                                <option key={y._id} value={y._id}>{y.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-0.5">Academic years for selected branch only.</p>
                    </div>

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
                </div>

                    <div className="shrink-0 pt-4 pb-6 px-6 flex justify-end gap-3 border-t border-gray-100 bg-white">
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
