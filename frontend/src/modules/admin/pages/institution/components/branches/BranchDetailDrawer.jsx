
import React, { useState, useEffect } from 'react';
import { X, Save, Power, AlertTriangle, ArrowRight } from 'lucide-react';
import BranchForm from './BranchForm';
import BranchStatusBadge from './BranchStatusBadge';

const BranchDetailDrawer = ({
    isOpen,
    onClose,
    branch,             // If null, it's "New Mode"
    onSave,
    onDeactivate,
    isSuperAdmin,
    loading
}) => {
    const [formData, setFormData] = useState({});

    // Reset form when branch changes
    useEffect(() => {
        if (branch) {
            setFormData({ ...branch });
        } else {
            // New Branch Defaults
            setFormData({
                name: '',
                code: '',
                type: 'school',
                establishedYear: new Date().getFullYear(),
                address: '',
                city: '',
                state: '',
                phone: '',
                email: '',
                allowAdmissions: true,
                allowFeeCollection: true,
                isActive: true
            });
        }
    }, [branch, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveClick = () => {
        onSave(formData);
    };

    const handleDeactivateClick = () => {
        const isActivating = !branch.isActive;
        if (isActivating) {
            onDeactivate(branch._id, 'Re-activation', true);
        } else {
            const reason = window.prompt("To Deactivate this branch, please type the reason for the Audit Log:");
            if (reason) {
                onDeactivate(branch._id, reason, false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Drawer Panel */}
            <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 font-['Poppins']">
                            {branch ? 'Configure Campus' : 'New Campus Setup'}
                        </h2>
                        {branch && <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-mono">{branch.code}</span>
                            <span>•</span>
                            <BranchStatusBadge isActive={branch.isActive} />
                        </div>}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Read Only Metrics (Only Existing Branch) */}
                {branch && (
                    <div className="grid grid-cols-4 border-b border-gray-100 bg-white">
                        <div className="p-4 border-r border-gray-50 text-center">
                            <h4 className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Students</h4>
                            <p className="text-xl font-bold text-gray-800">{branch.stats?.students || 0}</p>
                        </div>
                        <div className="p-4 border-r border-gray-50 text-center">
                            <h4 className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Staff</h4>
                            <p className="text-xl font-bold text-gray-800">{branch.stats?.staff || 0}</p>
                        </div>
                        <div className="p-4 border-r border-gray-50 text-center">
                            <h4 className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Revenue</h4>
                            <p className="text-xl font-bold text-gray-800">84%</p>
                        </div>
                        <div className="p-4 text-center">
                            <h4 className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Health</h4>
                            <p className="text-xl font-bold text-green-600">Good</p>
                        </div>
                    </div>
                )}

                {/* Content - Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    <BranchForm
                        formData={formData}
                        onChange={handleChange}
                        isEditing={!!branch}
                        isSuperAdmin={isSuperAdmin}
                    />
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div>
                        {branch && isSuperAdmin && (
                            <button
                                onClick={handleDeactivateClick}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <Power size={16} />
                                {branch.isActive ? 'Deactivate Campus' : 'Re-Activate Campus'}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 hidden sm:inline-block">Changes logged in Audit Trail</span>
                        <button
                            onClick={handleSaveClick}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm disabled:opacity-70"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save size={18} />
                                    Save Configuration
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchDetailDrawer;
