
import React, { useState } from 'react';
import { X, User, Briefcase, Lock, FileText, Monitor, Activity, UserX } from 'lucide-react';
import EmployeeActivityTimeline from './EmployeeActivityTimeline';
import EmployeeFormWizard from './EmployeeFormWizard';

const EmployeeProfileDrawer = ({ isOpen, onClose, employee, isNew, onSave }) => {

    // Tabs: overview, employment, system, assets, activity
    const [activeTab, setActiveTab] = useState('overview');

    if (!isOpen) return null;

    // Mock Timeline Data
    const mockTimeline = [
        { date: '2024-03-01', action: 'Created', user: 'Admin', notes: 'Initial Onboarding' },
        { date: '2024-03-02', action: 'Role Assigned', user: 'Super Admin', notes: 'Given Teacher Access' }
    ];

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wide transition-colors flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 border-b-2
                 ${activeTab === id ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
        >
            <Icon size={14} /> {label}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            {/* Drawer */}
            <div className={`relative w-full ${isNew ? 'max-w-xl' : 'max-w-4xl'} bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out`}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {isNew ? 'Add New Employee' : employee?.name}
                        </h2>
                        {!isNew && <p className="text-xs text-gray-500 mt-1 font-mono">{employee?.code} • {employee?.designation}</p>}
                        {isNew && <p className="text-xs text-gray-500 mt-1">Register official staff record.</p>}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {isNew ? (
                    // New Mode: Wizard
                    <div className="flex-1 overflow-hidden">
                        <EmployeeFormWizard onSave={onSave} onCancel={onClose} />
                    </div>
                ) : (
                    // View Mode: Profile Tabs
                    <div className="flex flex-col h-full overflow-hidden">

                        {/* Tab Bar */}
                        <div className="flex bg-white border-b border-gray-200">
                            <TabButton id="overview" label="Overview" icon={User} />
                            <TabButton id="employment" label="Employment" icon={Briefcase} />
                            <TabButton id="system" label="System Access" icon={Lock} />
                            <TabButton id="assets" label="Assets" icon={Monitor} />
                            <TabButton id="activity" label="Activity" icon={Activity} />
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">

                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0"></div>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                                            <div>
                                                <label className="text-xs text-gray-400 font-bold uppercase block">Full Name</label>
                                                <p className="font-bold text-gray-800">{employee.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 font-bold uppercase block">Status</label>
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {employee.status}
                                                </span>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 font-bold uppercase block">Email</label>
                                                <p className="text-sm text-gray-700">{employee.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 font-bold uppercase block">Mobile</label>
                                                <p className="text-sm text-gray-700">9876543210</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Zone */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Lifecycle Actions</h4>
                                        <div className="flex gap-4">
                                            <button className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100">
                                                <UserX size={16} /> Initiate Exit Process
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'employment' && (
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block">Department</label>
                                            <p className="font-medium">{employee.department}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block">Designation</label>
                                            <p className="font-medium">{employee.designation}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block">Employee Type</label>
                                            <p className="font-medium">{employee.employeeType}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block">Date Adjusted</label>
                                            <p className="font-medium">{employee.dateOfJoining}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'system' && (
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-800">Login Account</h3>
                                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Active</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2"><strong className="text-gray-900">Username:</strong> emp.john.d</p>
                                    <p className="text-sm text-gray-600"><strong className="text-gray-900">Role:</strong> Teacher (Standard)</p>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                                        <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded font-bold text-gray-700">Audit Logs</button>
                                        <button className="text-xs bg-red-50 hover:bg-red-100 px-3 py-2 rounded font-bold text-red-600">Force Logout</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'assets' && (
                                <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-200 italic">
                                    No assets currently assigned.
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <EmployeeActivityTimeline history={mockTimeline} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default EmployeeProfileDrawer;
