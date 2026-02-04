
import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, BookOpen, Shield, BarChart2, Activity, Edit2 } from 'lucide-react';

// Sub-components
import QualificationPanel from './QualificationPanel';
import SubjectEligibilityPanel from './SubjectEligibilityPanel';
import AcademicRolesPanel from './AcademicRolesPanel';

const TeacherProfileDrawer = ({ isOpen, onClose, teacher, onEdit }) => {

    const [activeTab, setActiveTab] = useState('overview');

    // Real Data State (initialized from props)
    const [qualifications, setQualifications] = useState({
        highest: '',
        specialization: '',
        university: '',
        experience: 0
    });

    const [eligibility, setEligibility] = useState([]);
    const [academicRoles, setAcademicRoles] = useState([]);

    // Sync state with teacher prop when it changes
    useEffect(() => {
        if (teacher) {
            setQualifications({
                highest: teacher.highestQualification || '',
                specialization: teacher.specialization || '',
                university: teacher.university || '',
                experience: teacher.experience || 0
            });
            setEligibility(teacher.eligibleSubjects || []);
            setAcademicRoles(teacher.academicRoles || []);
            setActiveTab('overview'); // Reset tab on teacher change
        }
    }, [teacher]);

    if (!isOpen || !teacher) return null;

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wide transition-colors flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 border-b-2
                 ${activeTab === id ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
        >
            <Icon size={14} /> <span className="hidden md:inline">{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            {/* Drawer */}
            <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {teacher.name}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{teacher.code} • {teacher.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit && onEdit(teacher)}
                            className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors"
                            title="Edit Teacher"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="flex bg-white border-b border-gray-200">
                    <TabButton id="overview" label="Overview" icon={User} />
                    <TabButton id="qualifications" label="Qualifications" icon={GraduationCap} />
                    <TabButton id="eligibility" label="Eligibility" icon={BookOpen} />
                    <TabButton id="roles" label="Roles" icon={Shield} />
                    <TabButton id="load" label="Load" icon={BarChart2} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">

                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info Card */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-2 md:col-span-2">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                                        {teacher.name.charAt(0)}
                                    </div>
                                    <div className="grid grid-cols-2 w-full gap-y-4">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block">Employee ID</label>
                                            <p className="font-bold text-gray-800">{teacher.code}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block">Department</label>
                                            <p className="font-bold text-gray-800">{teacher.department}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block">Designation</label>
                                            <p className="font-bold text-gray-800">{teacher.designation}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block">Teaching Status</label>
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{teacher.teachingStatus}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Level */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Academic Level</h4>
                                <div className="text-3xl font-bold text-gray-800">{teacher.academicLevel}</div>
                                <p className="text-xs text-gray-500 mt-1">Primary Teaching Segment</p>
                            </div>

                            {/* Load Summary */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Current Load</h4>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-3xl font-bold text-indigo-600">24</div>
                                        <p className="text-xs text-gray-500 mt-1">Weekly Hours</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-orange-500">80% Utilization</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'qualifications' && (
                        <QualificationPanel
                            qualifications={qualifications}
                            onChange={setQualifications}
                        />
                    )}

                    {activeTab === 'eligibility' && (
                        <SubjectEligibilityPanel
                            teacher={teacher}
                        />
                    )}

                    {activeTab === 'roles' && (
                        <AcademicRolesPanel roles={academicRoles} />
                    )}

                    {activeTab === 'load' && (
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
                            <BarChart2 className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-gray-800">Teaching Load Analytics</h3>
                            <p className="text-sm text-gray-500 mb-6">Detailed timetable mapping and utilization reports.</p>
                            <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold">
                                View Timetable
                            </button>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default TeacherProfileDrawer;
