import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, UsersRound, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAdminStore } from '../../../store/adminStore';

// Components
import KpiCard from '../components/dashboard/KpiCard';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import RecentActivityLog from '../components/dashboard/RecentActivityLog';

const CHART_COLORS = ['#2563eb', '#0ea5e9', '#06b6d4', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
    const branches = useAdminStore(state => state.branches);
    const dashboardStats = useAdminStore(state => state.dashboardStats);
    const dashboardLoading = useAdminStore(state => state.dashboardLoading);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const fetchDashboardStats = useAdminStore(state => state.fetchDashboardStats);

    const [selectedBranchId, setSelectedBranchId] = useState('all');
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('all');

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    // When branch changes, reset academic year so dropdown shows years for the new branch
    useEffect(() => {
        setSelectedAcademicYearId('all');
    }, [selectedBranchId]);

    useEffect(() => {
        fetchDashboardStats(selectedBranchId, selectedAcademicYearId);
    }, [selectedBranchId, selectedAcademicYearId, fetchDashboardStats]);

    const data = dashboardStats;
    const totalStudents = data?.totalStudents ?? 0;
    const totalTeachers = data?.totalTeachers ?? 0;
    const totalStaff = data?.totalStaff ?? 0;
    const pendingApprovals = data?.pendingApprovals ?? 0;
    const academicYears = data?.academicYears ?? [];
    const chartData = data?.chartData ?? {};
    const studentsByClass = chartData.studentsByClass ?? [];
    const roleDistribution = chartData.roleDistribution ?? [];

    return (
        <div className="space-y-6 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Command Center</h1>
                    <p className="text-gray-500 text-sm">Real-time overview of institution performance and compliance.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        className="px-4 py-2 border border-blue-200 rounded-lg text-sm bg-white text-gray-700 outline-none focus:border-blue-500 font-medium shadow-sm"
                    >
                        <option value="all">All Branches</option>
                        {(branches || []).map((b) => (
                            <option key={b._id || b.id} value={b._id || b.id}>
                                {b.name || b.branchName || 'Branch'}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedAcademicYearId}
                        onChange={(e) => setSelectedAcademicYearId(e.target.value)}
                        className="px-4 py-2 border border-blue-200 rounded-lg text-sm bg-white text-gray-700 outline-none focus:border-blue-500 font-medium shadow-sm"
                    >
                        <option value="all">All Academic Years</option>
                        {academicYears.map((ay) => (
                            <option key={ay._id} value={ay._id}>
                                {ay.name} {ay.status === 'active' ? '(active)' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {dashboardLoading && !data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
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
                    value={totalStaff.toLocaleString()}
                    icon={Users}
                    color="bg-sky-500"
                    link="/admin/users/admins"
                />
                <KpiCard
                    label="Pending Approvals"
                    value={pendingApprovals.toLocaleString()}
                    icon={FileText}
                    color="bg-cyan-600"
                    link="/admin/people/students"
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

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Students by Class</h3>
                    {studentsByClass.length > 0 ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={studentsByClass} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Students" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm py-8 text-center">No class-wise data for selected filters.</p>
                    )}
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Role Distribution</h3>
                    {roleDistribution.some((d) => d.value > 0) ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roleDistribution}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {roleDistribution.map((_, i) => (
                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm py-8 text-center">No distribution data for selected filters.</p>
                    )}
                </div>
            </div>

            {/* ALERTS & ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <AlertsPanel alerts={data?.alerts ?? []} />
                </div>
                <div className="lg:col-span-2">
                    <RecentActivityLog recentActivity={data?.recentActivity ?? []} />
                </div>
            </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
