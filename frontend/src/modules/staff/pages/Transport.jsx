import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { Bus, Users, AlertTriangle, MapPin, ChevronRight, User, RefreshCw } from 'lucide-react';
import { getTransportSummary } from '../services/transport.api';

const Transport = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const hasAccess = [STAFF_ROLES.TRANSPORT, STAFF_ROLES.ADMIN, STAFF_ROLES.FRONT_DESK, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.SUPPORT].includes(user?.role);

    useEffect(() => {
        if (!hasAccess) return;
        const load = async () => {
            setLoading(true);
            const data = await getTransportSummary();
            setSummary(data);
            setLoading(false);
        };
        load();
    }, [hasAccess]);

    if (!hasAccess) return <AccessDenied />;

    const s = summary || {};
    const activeRoutes = s.activeRoutes ?? '-';
    const totalBuses = s.totalBuses ?? s.totalRoutes ?? '-';
    const studentsAssigned = s.studentsAssigned ?? '-';
    const openIssues = s.openIssues ?? '-';

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            <div className="bg-white px-5 py-5 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Transport Operations</h1>
                <p className="text-xs text-gray-500">Fleet management & student logistics</p>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <DashboardCard
                        label="Active Routes"
                        value={loading ? '...' : String(activeRoutes)}
                        icon={MapPin}
                        color="indigo"
                        onClick={() => navigate('/staff/transport/routes')}
                    />
                    <DashboardCard
                        label="Total Buses"
                        value={loading ? '...' : String(totalBuses)}
                        icon={Bus}
                        color="blue"
                        onClick={() => navigate('/staff/transport/routes')}
                    />
                    <DashboardCard
                        label="Students Assigned"
                        value={loading ? '...' : String(studentsAssigned)}
                        icon={Users}
                        color="green"
                        onClick={() => navigate('/staff/transport/students')}
                    />
                    <DashboardCard
                        label="Open Issues"
                        value={loading ? '...' : String(openIssues)}
                        icon={AlertTriangle}
                        color="amber"
                        onClick={() => navigate('/staff/transport/issues')}
                    />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <ActionCard title="Manage Routes" desc="View routes & stops" icon={Bus} onClick={() => navigate('/staff/transport/routes')} />
                    <ActionCard title="Student List" desc="View transport students" icon={Users} onClick={() => navigate('/staff/transport/students')} />
                    <ActionCard title="Manage Drivers" desc="Staff & schedules" icon={User} onClick={() => navigate('/staff/employees')} />
                    <ActionCard title="Issue Log" desc="Report delays" icon={AlertTriangle} onClick={() => navigate('/staff/transport/issues')} />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-900">Live Alerts</h3>
                        {openIssues > 0 ? <span className="text-xs font-bold text-red-600 animate-pulse">● Live</span> : <span className="text-xs text-gray-500">No open issues</span>}
                    </div>
                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="p-4 flex items-center gap-2 text-gray-500">
                                <RefreshCw size={16} className="animate-spin" /> Loading…
                            </div>
                        ) : Number(openIssues) > 0 ? (
                            <AlertRow title={`${openIssues} transport-related ticket(s) open`} time="Check Issue Log" type="delay" />
                        ) : (
                            <div className="p-4 text-sm text-gray-500">No transport alerts at the moment.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ label, value, icon: Icon, color, onClick }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600'
    };
    return (
        <div onClick={onClick} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
                <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
        </div>
    );
};

const ActionCard = ({ title, desc, icon: Icon, onClick }) => (
    <div onClick={onClick} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Icon size={20} />
            </div>
            <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">{desc}</p>
        <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
            Go to {title} <ChevronRight size={14} />
        </div>
    </div>
);

const AlertRow = ({ title, time, type }) => (
    <div className="p-3 flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${type === 'breakdown' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{title}</p>
            <p className="text-[10px] text-gray-400">{time}</p>
        </div>
    </div>
);

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400"><Bus size={32} /></div>
        <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-500 mt-2">You do not have permission to access Transport Operations.</p>
    </div>
);

export default Transport;
