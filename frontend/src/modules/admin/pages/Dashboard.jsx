
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, UsersRound, Calendar, FileText } from 'lucide-react';
import { useAdminStore } from '../../../store/adminStore';

// Components
import KpiCard from '../components/dashboard/KpiCard';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import PendingActionsTable from '../components/dashboard/PendingActionsTable';
import SystemHealthPanel from '../components/dashboard/SystemHealthPanel';
import RecentActivityLog from '../components/dashboard/RecentActivityLog';

const Dashboard = () => {
    const students = useAdminStore(state => state.students);
    const teachers = useAdminStore(state => state.teachers);
    const employees = useAdminStore(state => state.employees);

    // Derived counts
    const totalStudents = students.length || 1245; // Fallback to mock if empty for now
    const totalTeachers = teachers.length;
    const totalEmployees = employees.length;

    return (
        <div className="space-y-6 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Command Center</h1>
                    <p className="text-gray-500 text-sm">Real-time overview of institution performance and compliance.</p>
                </div>

                {/* Branch Selector Mock */}
                <div className="flex items-center gap-3">
                    <select className="px-4 py-2 border border-blue-200 rounded-lg text-sm bg-white text-gray-700 outline-none focus:border-blue-500 font-medium shadow-sm">
                        <option>All Branches</option>
                        <option>Main Campus</option>
                        <option>North Wing</option>
                    </select>
                    <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                        Top KPI: Academic Year 2025-26 (Active)
                    </div>
                </div>
            </div>

            {/* SECTION 1: KEY METRICS - Blue/Cool Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    label="Total Students"
                    value={totalStudents.toLocaleString()}
                    icon={GraduationCap}
                    color="bg-blue-600"
                    link="/admin/people/students"
                />
                <KpiCard
                    label="Total Teachers"
                    value={totalTeachers.toLocaleString()}
                    icon={UsersRound}
                    color="bg-blue-500"
                    link="/admin/people/teachers"
                />
                <KpiCard
                    label="Support Staff"
                    value={totalEmployees.toLocaleString()}
                    icon={Users}
                    color="bg-sky-500"
                    link="/admin/people/employees"
                />
                <KpiCard
                    label="Pending Approvals"
                    value="12"
                    icon={FileText}
                    color="bg-cyan-600"
                    link="/admin/compliance/checklists"
                />
            </div>

            {/* SECTION 1.5: ACADEMIC STRUCTURE SHORTCUTS */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="text-blue-600" size={20} /> Academic Structure & Setup
                    </h3>
                    <span className="text-xs text-gray-400">Quick Access</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/admin/academics/classes" className="group p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors">
                        <div className="text-blue-700 font-bold text-lg">Classes</div>
                        <div className="text-xs text-blue-500 group-hover:text-blue-700 mt-1 flex items-center gap-1">
                            Manage Class Master <div className="text-[10px] w-4 h-4 rounded bg-blue-200 flex items-center justify-center">→</div>
                        </div>
                    </Link>
                    <Link to="/admin/academics/sections" className="group p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                        <div className="text-gray-700 font-bold text-lg">Sections</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-700 mt-1 flex items-center gap-1">
                            Manage Divisions <div className="text-[10px] w-4 h-4 rounded bg-gray-200 flex items-center justify-center">→</div>
                        </div>
                    </Link>
                    <Link to="/admin/institution/academic-years" className="group p-4 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-100 transition-colors">
                        <div className="text-sky-700 font-bold text-lg">Years</div>
                        <div className="text-xs text-sky-500 group-hover:text-sky-700 mt-1 flex items-center gap-1">
                            Academic Calendars <div className="text-[10px] w-4 h-4 rounded bg-sky-200 flex items-center justify-center">→</div>
                        </div>
                    </Link>
                    <Link to="/admin/roles" className="group p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
                        <div className="text-slate-700 font-bold text-lg">Roles</div>
                        <div className="text-xs text-slate-500 group-hover:text-slate-700 mt-1 flex items-center gap-1">
                            Staff Permissions <div className="text-[10px] w-4 h-4 rounded bg-slate-200 flex items-center justify-center">→</div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* SECTION 2 & 3: ALERTS & PENDING ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto items-stretch">
                {/* Critical Alerts - 1/3 width */}
                <div className="lg:col-span-1">
                    <AlertsPanel />
                </div>

                {/* Pending Actions - 2/3 width */}
                <div className="lg:col-span-2">
                    <PendingActionsTable />
                </div>
            </div>

            {/* SECTION 4 & 5: SYSTEM HEALTH & ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Health - 2/3 width */}
                <div className="lg:col-span-2">
                    <SystemHealthPanel />
                </div>

                {/* Recent Activity - 1/3 width */}
                <div className="lg:col-span-1">
                    <RecentActivityLog />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
