import React, { useEffect, useState } from 'react';
import { User, Save, Loader2, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';

const DriverCreate = () => {
    const {
        branches,
        fetchBranches,
        academicYears,
        fetchAcademicYears,
        transportDrivers,
        addTransportDriver,
        updateTransportDriver,
        deleteTransportDriver,
        addToast
    } = useAdminStore();

    const [branchId, setBranchId] = useState('');
    const [academicYearId, setAcademicYearId] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        licenseNo: '',
        remarks: ''
    });
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length > 0 && !branchId) {
            setBranchId(branches[0]._id);
        }
    }, [branches, branchId]);

    useEffect(() => {
        if (branchId) {
            fetchAcademicYears(branchId);
        }
    }, [branchId, fetchAcademicYears]);

    useEffect(() => {
        if (academicYears.length > 0 && !academicYearId) {
            const active = academicYears.find(ay => ay.status === 'active') || academicYears[0];
            if (active) setAcademicYearId(active._id);
        }
    }, [academicYears, academicYearId]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!branchId) {
            addToast('Please select a branch.', 'error');
            return;
        }
        if (!academicYearId) {
            addToast('Please select an academic year.', 'error');
            return;
        }
        if (!formData.name.trim()) {
            addToast('Driver name is required.', 'error');
            return;
        }
        if (!formData.mobile.trim()) {
            addToast('Mobile number is required.', 'error');
            return;
        }

        setSaving(true);

        const payload = {
            branchId,
            academicYearId,
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            licenseNo: formData.licenseNo.trim(),
            remarks: formData.remarks.trim()
        };

        if (editingId) {
            updateTransportDriver(editingId, payload);
            addToast('Driver updated locally. (Backend wiring pending)', 'success');
        } else {
            addTransportDriver(payload);
            addToast('Driver added locally. (Backend wiring pending)', 'success');
        }

        setSaving(false);
        setFormData({
            name: '',
            mobile: '',
            licenseNo: '',
            remarks: ''
        });
        setEditingId(null);
        setShowModal(false);
    };

    const handleEditDriver = (driver) => {
        setEditingId(driver.id);
        setBranchId(driver.branchId);
        setAcademicYearId(driver.academicYearId || '');
        setFormData({
            name: driver.name || '',
            mobile: driver.mobile || '',
            licenseNo: driver.licenseNo || '',
            remarks: driver.remarks || ''
        });
        setShowModal(true);
    };

    const handleDeleteDriver = (driver) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            deleteTransportDriver(driver.id);
            addToast('Driver deleted locally. (Backend wiring pending)', 'success');
        }
    };

    return (
        <div className="h-full flex flex-col pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <User size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Drivers</h1>
                        <p className="text-gray-500 text-sm">
                            Manage your transport drivers. Use the Create Driver button to add a new driver.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm shadow-sm">
                        <span className="text-gray-500">Branch:</span>
                        <select
                            value={branchId}
                            onChange={(e) => {
                                setBranchId(e.target.value);
                                setAcademicYearId('');
                            }}
                            className="font-bold text-gray-800 outline-none bg-transparent cursor-pointer"
                        >
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-emerald-700"
                    >
                        <Plus size={16} /> Create Driver
                    </button>
                </div>
            </div>

            {/* Driver List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-3">Existing Drivers (local)</h2>
                {transportDrivers.filter(d => !branchId || d.branchId === branchId).length === 0 ? (
                    <div className="text-xs text-gray-400 py-6 text-center">
                        No drivers added yet for this branch. Click <strong>Create Driver</strong> to add one.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 uppercase">
                                    <th className="px-3 py-2 text-left">Name</th>
                                    <th className="px-3 py-2 text-left">Mobile</th>
                                    <th className="px-3 py-2 text-left">License No.</th>
                                    <th className="px-3 py-2 text-left">Academic Year</th>
                                    <th className="px-3 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transportDrivers
                                    .filter(d => !branchId || d.branchId === branchId)
                                    .map(d => (
                                        <tr key={d.id}>
                                            <td className="px-3 py-2 text-gray-800">{d.name}</td>
                                            <td className="px-3 py-2 text-gray-600">{d.mobile}</td>
                                            <td className="px-3 py-2 text-gray-600">{d.licenseNo || '—'}</td>
                                            <td className="px-3 py-2 text-gray-600">
                                                {academicYears.find(ay => ay._id === d.academicYearId)?.name || '—'}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditDriver(d)}
                                                    className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-300 mr-1"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteDriver(d)}
                                                    className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for Create Driver */}
            {showModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <User size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Create Driver</h3>
                                    <p className="text-[11px] text-gray-500">
                                        Fill basic details and link to branch + academic year.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        Branch <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={branchId}
                                        onChange={(e) => {
                                            setBranchId(e.target.value);
                                            setAcademicYearId('');
                                        }}
                                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                    >
                                        {branches.map(b => (
                                            <option key={b._id} value={b._id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        Academic Year <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={academicYearId}
                                        onChange={(e) => setAcademicYearId(e.target.value)}
                                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select Academic Year</option>
                                        {academicYears.map(ay => (
                                            <option key={ay._id} value={ay._id}>{ay.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        Driver Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="e.g. Ramesh Kumar"
                                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={(e) => handleChange('mobile', e.target.value)}
                                        placeholder="e.g. +91-98765 43210"
                                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        License Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.licenseNo}
                                        onChange={(e) => handleChange('licenseNo', e.target.value)}
                                        placeholder="e.g. MP09-2028-XXXX"
                                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        Remarks / Notes
                                    </label>
                                    <textarea
                                        value={formData.remarks}
                                        onChange={(e) => handleChange('remarks', e.target.value)}
                                        rows={2}
                                        placeholder="Any important notes about this driver (e.g. Night shift only, 5+ years experience, etc.)"
                                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? 'Saving...' : 'Save Driver'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverCreate;

