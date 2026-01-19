
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext'; // STRICT AUTH

import {
    Users, FileText, ClipboardList, Wallet, Ticket, Bus,
    AlertCircle, CheckCircle, Clock, Plus, Upload, Filter,
    Download, Search, Shield, ChevronRight, Info, AlertTriangle, Briefcase
} from 'lucide-react';
import { STAFF_ROLES } from '../config/roles';
import { ROLE_DASHBOARD_MAP } from '../config/roleDashboardMap';
import RoleSummaryBanner from '../components/dashboard/RoleSummaryBanner';
import WidgetCard from '../components/dashboard/WidgetCard';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const { user } = useStaffAuth(); // STRICT: Role comes ONLY from auth context

    if (!user || !user.role) return null;

    const currentRole = user.role;
    const config = ROLE_DASHBOARD_MAP[currentRole];

    const handleNavigation = (path, stateData = {}) => {
        navigate(path, { state: { source: 'dashboard', ...stateData } });
    };

    // --- COMPACT WIDGET RENDERER ---
    const renderPrimaryWidgets = () => {
        if (!config?.primaryWidgets || config.primaryWidgets.length === 0) return null;

        // Factory to generate widget props based on key
        const getWidgetProps = (key) => {
            // ... (Keep existing mapping logic, but verified for brevity) ...
            switch (key) {
                case 'TodayAdmissions': return { title: 'Admissions', count: 5, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' };
                case 'PendingDocuments': return { title: 'Pending Docs', count: 12, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' };
                case 'VisitorRequests': return { title: 'Inquiries', count: 8, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' };
                case 'PendingFees': return { title: 'Fee Pending', count: 145, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' };
                case 'OverdueFees': return { title: 'Overdue', count: 28, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' };
                case 'TodayCollections': return { title: 'Collected', count: '₹45k', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' };
                case 'ActiveRoutes': return { title: 'Routes', count: 14, icon: Bus, color: 'text-indigo-600', bg: 'bg-indigo-50' };
                case 'BusAllocationIssues': return { title: 'Issues', count: 3, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' };
                case 'DriverStatus': return { title: 'Drivers', count: '12/14', icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' };
                case 'PendingDataUpdates': return { title: 'Data Missing', count: 42, icon: Briefcase, color: 'text-pink-600', bg: 'bg-pink-50' };
                case 'VerificationTasks': return { title: 'Verify', count: 15, icon: Shield, color: 'text-teal-600', bg: 'bg-teal-50' };
                case 'ClassSectionUpdates': return { title: 'Unmapped', count: 5, icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50' };
                case 'OpenTickets': return { title: 'Tickets', count: 9, icon: Ticket, color: 'text-indigo-600', bg: 'bg-indigo-50' };
                case 'SlaBreachAlerts': return { title: 'SLA Risk', count: 2, icon: Clock, color: 'text-red-600', bg: 'bg-red-50' };
                case 'HighPriorityTickets': return { title: 'High Prio', count: 3, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' };
                default: return null;
            }
        };

        return (
            <div className="grid grid-cols-3 gap-2 mb-6">
                {config.primaryWidgets.map(key => {
                    const props = getWidgetProps(key);
                    if (!props) return null;
                    const Icon = props.icon;
                    return (
                        <div key={key} onClick={() => handleNavigation('/staff/tasks')} className={`${props.bg} rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm active:scale-95 transition-transform`}>
                            <Icon size={20} className={`mb-1.5 ${props.color}`} />
                            <span className={`text-xl font-bold ${props.color} leading-none mb-1`}>{props.count}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase leading-none">{props.title}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // --- COMPACT QUICK ACTIONS ---
    const renderQuickActions = () => {
        if (!config?.quickActions || config.quickActions.length === 0) return null;

        const ACTIONS = {
            // ... Same Mapping but optimized keys ...
            'AddNewInquiry': { label: 'New Inquiry', icon: Plus },
            'UploadDocuments': { label: 'Upload', icon: Upload },
            'ViewPendingAdmissions': { label: 'Admissions', icon: Users },
            'ViewFeeLedger': { label: 'Ledger', icon: Search },
            'DownloadFeeReport': { label: 'Report', icon: Download },
            'ViewReceipts': { label: 'Receipts', icon: FileText },
            'AssignStudentRoute': { label: 'Assign Bus', icon: Bus },
            'ViewRouteDetails': { label: 'Routes', icon: Search },
            'ReportTransportIssue': { label: 'Report Issue', icon: AlertTriangle },
            'EditStudentRecords': { label: 'Edit Student', icon: Search },
            'VerifyDocuments': { label: 'Verify', icon: Shield },
            'UpdateClassInfo': { label: 'Classes', icon: Users },
            'ViewOpenTickets': { label: 'Inbox', icon: Ticket },
            'RespondToTicket': { label: 'Reply', icon: Info },
            'CloseTicket': { label: 'Close', icon: CheckCircle },
        };

        return (
            <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-3">
                    {config.quickActions.map(actionKey => {
                        const action = ACTIONS[actionKey];
                        if (!action) return null;
                        const Icon = action.icon;
                        return (
                            <button key={actionKey} onClick={() => handleNavigation(action.path)} className="flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center text-gray-600 group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors">
                                    <Icon size={20} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-500 text-center leading-tight">{action.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (!config) return <div className="p-10 text-center text-gray-400 text-sm">Loading...</div>;

    return (
        <div className="max-w-md mx-auto pb-24 md:pb-6 min-h-screen">
            {/* Header / Banner */}
            <div className="bg-white p-5 rounded-b-3xl shadow-sm border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-none">Hi, {user.name.split(' ')[0]}</h1>
                        <p className="text-xs text-indigo-600 font-bold mt-1 uppercase tracking-wide">{user.role.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            <div className="px-4">
                {renderPrimaryWidgets()}
                {renderQuickActions()}

                {/* Updates */}
                <div className="mt-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Updates</h3>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3 items-start">
                        <Info className="text-indigo-500 shrink-0" size={18} />
                        <div>
                            <p className="text-xs font-bold text-gray-800">System Maintenance</p>
                            <p className="text-[10px] text-gray-500 leading-relaxed mt-1">Scheduled for Sat 10 PM. Please complete uploads.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;