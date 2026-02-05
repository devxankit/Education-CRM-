import React, { useEffect, useState } from 'react';
import { GraduationCap, School, Calendar, MapPin } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';
import { useAppStore } from '../../../../../../../store';

const Step3_Academic = ({ data, onChange }) => {
    const user = useAppStore(state => state.user);
    const branches = useAdminStore(state => state.branches);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const classes = useAdminStore(state => state.classes);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const sectionsObj = useAdminStore(state => state.sections); // Indexed by classId
    const fetchSections = useAdminStore(state => state.fetchSections);

    const selectedBranchId = data.branchId;
    // Get current sections for selected class
    const selectedClassId = data.classId;
    const currentSections = sectionsObj[selectedClassId] || [];

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    // Handle initial branch assignment if not set
    useEffect(() => {
        if (!data.branchId && branches.length > 0) {
            // If staff has a specific branch, use it. Otherwise use first branch.
            const defaultBranch = (user?.role === 'Staff' && user?.branchId !== 'all')
                ? user.branchId
                : branches[0]._id;

            if (defaultBranch) {
                onChange({ ...data, branchId: defaultBranch });
            }
        }
    }, [branches, user, data.branchId, onChange]);

    useEffect(() => {
        if (selectedBranchId) {
            fetchClasses(selectedBranchId);
        }
    }, [selectedBranchId, fetchClasses]);

    useEffect(() => {
        if (selectedClassId && selectedClassId.length === 24) {
            fetchSections(selectedClassId);
        }
    }, [selectedClassId, fetchSections]);

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const handleBranchChange = (branchId) => {
        onChange({ ...data, branchId, classId: '', sectionId: '' });
    };

    const handleClassChange = (classId) => {
        onChange({ ...data, classId, sectionId: '' }); // Reset section when class changes
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header omitted for brevity in targetContent but I'll keep it in ReplacementContent */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <GraduationCap className="text-indigo-600" /> Academic Enrollment
                </h3>
                <p className="text-sm text-gray-500">Assign class, section, and record admission details.</p>
            </div>

            {/* Campus Selection */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" /> Campus / Branch Selection <span className="text-red-500">*</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Campus</label>
                        <select
                            value={data.branchId || ''}
                            onChange={(e) => handleBranchChange(e.target.value)}
                            disabled={user?.role === 'Staff' && user?.branchId !== 'all'}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Campus</option>
                            {branches.map((b, idx) => (
                                <option key={b._id} value={b._id}>
                                    {idx === 0 && user?.role === 'institute' && (user?.legalName || user?.shortName) ? `${user.legalName || user.shortName} - ` : ''}
                                    {b.name} ({b.code})
                                </option>
                            ))}
                        </select>
                        {user?.role === 'Staff' && user?.branchId !== 'all' && (
                            <p className="text-[10px] text-gray-400 mt-1">Your account is locked to your assigned campus.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Admission Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Number</label>
                    <input
                        type="text"
                        value={data.admissionNo || 'ADM-2026-XXXX'}
                        readOnly
                        className="w-full text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-3 py-2 outline-none font-mono cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Auto-generated by system sequence.</p>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        value={data.admissionDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleChange('admissionDate', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Class Assignment */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <School size={16} className="text-gray-400" /> Class Assignment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class <span className="text-red-500">*</span></label>
                        <select
                            value={data.classId || ''}
                            onChange={(e) => handleClassChange(e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Class</option>
                            {classes && classes.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section</label>
                        <select
                            value={data.sectionId || ''}
                            onChange={(e) => handleChange('sectionId', e.target.value)}
                            disabled={!data.classId}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">{data.classId ? 'Select Section' : 'Select Class First'}</option>
                            {currentSections.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Roll Number</label>
                        <input
                            type="text"
                            value={data.rollNo || ''}
                            onChange={(e) => handleChange('rollNo', e.target.value)}
                            placeholder="Auto or Manual"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Previous School */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" /> Previous History
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Previous School Name</label>
                        <input
                            type="text"
                            value={data.prevSchool || ''}
                            onChange={(e) => handleChange('prevSchool', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Class Passed</label>
                        <input
                            type="text"
                            value={data.lastClass || ''}
                            onChange={(e) => handleChange('lastClass', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Step3_Academic;
