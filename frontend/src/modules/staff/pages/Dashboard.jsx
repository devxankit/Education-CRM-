
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
    Users, FileText, ClipboardList, Wallet, Ticket, Bus,
    AlertCircle, CheckCircle, Clock, Plus, Upload, Filter,
    Download, Search, Shield, ChevronRight, Info, AlertTriangle, Briefcase
} from 'lucide-react';
import { STAFF_ROLES } from '../config/roles';
import { ROLE_DASHBOARD_MAP } from '../config/roleDashboardMap';
import RoleSummaryBanner from '../components/dashboard/RoleSummaryBanner';
import WidgetCard from '../components/dashboard/WidgetCard';

// Mock Data for demonstration
const MOCK_STAFF_USERS = {
    [STAFF_ROLES.FRONT_DESK]: { staffId: 'FD-01', name: 'Sarah Jenkins', role: STAFF_ROLES.FRONT_DESK },
    [STAFF_ROLES.ACCOUNTS]: { staffId: 'ACC-01', name: 'Rajesh Kumar', role: STAFF_ROLES.ACCOUNTS },
    [STAFF_ROLES.TRANSPORT]: { staffId: 'TR-01', name: 'Mike Otieno', role: STAFF_ROLES.TRANSPORT },
    [STAFF_ROLES.DATA_ENTRY]: { staffId: 'DE-01', name: 'Anita Desai', role: STAFF_ROLES.DATA_ENTRY },
    [STAFF_ROLES.SUPPORT]: { staffId: 'SUP-01', name: 'John Doe', role: STAFF_ROLES.SUPPORT },
};

const StaffDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // In a real app, this comes from useAuth hook
    // Priority: 1. State from login, 2. Local fallback, 3. Default
    const initialRole = location.state?.role || STAFF_ROLES.FRONT_DESK;
    const [currentRole, setCurrentRole] = useState(initialRole);

    const staff = MOCK_STAFF_USERS[currentRole] || MOCK_STAFF_USERS[STAFF_ROLES.FRONT_DESK];
    const config = ROLE_DASHBOARD_MAP[staff.role];

    // --- NAVIGATION HANDLER (Predictable ERP Flow) ---
    const handleNavigation = (path, stateData = {}) => {
        // PERMISSION CHECK (Implicit):
        // If the widget/button is rendered via config, permission is assumed.
        // We add specific state for filters.
        console.log(`Navigating to: ${path}`, stateData);
        navigate(path, { state: { source: 'dashboard', ...stateData } });
    };

    // --- RENDER HELPERS: Widget Factories ---

    const renderPrimaryWidgets = () => {
        if (!config?.primaryWidgets || config.primaryWidgets.length === 0) {
            return (
                <div className="p-8 text-center bg-white border border-dashed border-gray-300 rounded-xl mb-8">
                    <p className="text-gray-500 font-medium">No details available for this role.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-6 md:mb-8">

                {/* --- FRONT DESK WIDGETS --- */}
                {config.primaryWidgets.includes('TodayAdmissions') && (
                    <WidgetCard
                        title="Today Admissions"
                        count={5}
                        subtitle="3 Completed • 2 Pending"
                        icon={Users}
                        colorClass="bg-purple-100 text-purple-600"
                        onClick={() => handleNavigation('/staff/students', { filter: 'newAdmissions' })}
                    />
                )}
                {config.primaryWidgets.includes('PendingDocuments') && (
                    <WidgetCard
                        title="Pending Documents"
                        count={12}
                        subtitle="Impacts 8 Students"
                        icon={FileText}
                        colorClass="bg-orange-100 text-orange-600"
                        onClick={() => handleNavigation('/staff/documents', { filter: 'pendingDocuments' })}
                    />
                )}
                {config.primaryWidgets.includes('VisitorRequests') && (
                    <WidgetCard
                        title="New Inquiries"
                        count={8}
                        subtitle="4 Online • 4 Walk-in"
                        icon={ClipboardList}
                        colorClass="bg-blue-100 text-blue-600"
                        onClick={() => handleNavigation('/staff/students', { filter: 'inquiries' })}
                    />
                )}

                {/* --- ACCOUNTS WIDGETS --- */}
                {config.primaryWidgets.includes('PendingFees') && (
                    <WidgetCard
                        title="Pending Fees"
                        count={145}
                        subtitle="Total Outstanding: ₹12.5L"
                        icon={AlertCircle}
                        colorClass="bg-red-50 text-red-600"
                        onClick={() => handleNavigation('/staff/fees', { filter: 'pending' })}
                    />
                )}
                {config.primaryWidgets.includes('OverdueFees') && (
                    <WidgetCard
                        title="Overdue Accounts"
                        count={28}
                        subtitle="Critical Follow-up"
                        icon={Clock}
                        colorClass="bg-rose-100 text-rose-600"
                        onClick={() => handleNavigation('/staff/fees', { filter: 'overdue' })}
                    />
                )}
                {config.primaryWidgets.includes('TodayCollections') && (
                    <WidgetCard
                        title="Today Collected"
                        count="₹ 45k"
                        subtitle="12 Receipts"
                        icon={Wallet}
                        colorClass="bg-emerald-100 text-emerald-600"
                        onClick={() => handleNavigation('/staff/reports', { filter: 'today', type: 'fees' })}
                    />
                )}

                {/* --- TRANSPORT WIDGETS --- */}
                {config.primaryWidgets.includes('ActiveRoutes') && (
                    <WidgetCard
                        title="Active Routes"
                        count={14}
                        subtitle="All buses operational"
                        icon={Bus}
                        colorClass="bg-indigo-100 text-indigo-600"
                        onClick={() => handleNavigation('/staff/transport', { tab: 'routes' })}
                    />
                )}
                {config.primaryWidgets.includes('BusAllocationIssues') && (
                    <WidgetCard
                        title="Allocation Issues"
                        count={3}
                        subtitle="Capacity Warnings"
                        icon={AlertTriangle}
                        colorClass="bg-amber-100 text-amber-600"
                        onClick={() => handleNavigation('/staff/transport', { tab: 'students', filter: 'capacityWarning' })}
                    />
                )}
                {config.primaryWidgets.includes('DriverStatus') && (
                    <WidgetCard
                        title="Driver Status"
                        count="12/14"
                        subtitle="2 On Leave"
                        icon={Users}
                        colorClass="bg-slate-100 text-slate-600"
                        onClick={() => handleNavigation('/staff/transport', { tab: 'routes' })}
                    />
                )}

                {/* --- DATA ENTRY WIDGETS --- */}
                {config.primaryWidgets.includes('PendingDataUpdates') && (
                    <WidgetCard
                        title="Incomplete Records"
                        count={42}
                        subtitle="Missing info"
                        icon={Briefcase}
                        colorClass="bg-pink-100 text-pink-600"
                        onClick={() => handleNavigation('/staff/students', { filter: 'incompleteProfile' })}
                    />
                )}
                {config.primaryWidgets.includes('VerificationTasks') && (
                    <WidgetCard
                        title="Pending Verification"
                        count={15}
                        subtitle="Docs awaiting review"
                        icon={Shield}
                        colorClass="bg-teal-100 text-teal-600"
                        onClick={() => handleNavigation('/staff/documents', { filter: 'verificationPending' })}
                    />
                )}
                {config.primaryWidgets.includes('ClassSectionUpdates') && (
                    <WidgetCard
                        title="Class Updates"
                        count={5}
                        subtitle="Unmapped students"
                        icon={Users}
                        colorClass="bg-cyan-100 text-cyan-600"
                        onClick={() => handleNavigation('/staff/students', { filter: 'unmapped' })}
                    />
                )}

                {/* --- SUPPORT WIDGETS --- */}
                {config.primaryWidgets.includes('OpenTickets') && (
                    <WidgetCard
                        title="Open Tickets"
                        count={9}
                        subtitle="4 High Priority"
                        icon={Ticket}
                        colorClass="bg-indigo-100 text-indigo-600"
                        onClick={() => handleNavigation('/staff/support', { filter: 'open' })}
                    />
                )}
                {config.primaryWidgets.includes('SlaBreachAlerts') && (
                    <WidgetCard
                        title="SLA Risk"
                        count={2}
                        subtitle="Breach in < 2hrs"
                        icon={Clock}
                        colorClass="bg-red-100 text-red-600"
                        onClick={() => handleNavigation('/staff/support', { filter: 'slaRisk' })}
                    />
                )}
                {config.primaryWidgets.includes('HighPriorityTickets') && (
                    <WidgetCard
                        title="High Priority"
                        count={3}
                        subtitle="Immediate action"
                        icon={AlertCircle}
                        colorClass="bg-rose-100 text-rose-600"
                        onClick={() => handleNavigation('/staff/support', { filter: 'highPriority' })}
                    />
                )}
            </div>
        );
    };

    const renderQuickActions = () => {
        if (!config?.quickActions || config.quickActions.length === 0) return null;

        // Action Configuration Map
        const ACTIONS = {
            // FRONT DESK
            'AddNewInquiry': {
                label: 'New Inquiry', icon: Plus, secondary: false,
                action: () => handleNavigation('/staff/students/new')
            },
            'UploadDocuments': {
                label: 'Upload Docs', icon: Upload, secondary: true,
                action: () => handleNavigation('/staff/documents', { mode: 'upload' })
            },
            'ViewPendingAdmissions': {
                label: 'Admissions', icon: Users, secondary: true,
                action: () => handleNavigation('/staff/students', { filter: 'pending_admission' })
            },

            // ACCOUNTS
            'ViewFeeLedger': {
                label: 'Fee Ledger', icon: Search, secondary: false,
                action: () => handleNavigation('/staff/fees')
            },
            'DownloadFeeReport': {
                label: 'Fee Report', icon: Download, secondary: true,
                action: () => handleNavigation('/staff/reports', { type: 'fees' })
            },
            'ViewReceipts': {
                label: 'View Receipts', icon: FileText, secondary: true,
                action: () => handleNavigation('/staff/fees', { tab: 'receipts' })
            },

            // TRANSPORT
            'AssignStudentRoute': {
                label: 'Assign Route', icon: Bus, secondary: false,
                action: () => handleNavigation('/staff/transport', { tab: 'students' })
            },
            'ViewRouteDetails': {
                label: 'View Routes', icon: Search, secondary: true,
                action: () => handleNavigation('/staff/transport', { tab: 'routes' })
            },
            'ReportTransportIssue': {
                label: 'Report Issue', icon: AlertTriangle, secondary: true,
                action: () => handleNavigation('/staff/support', { type: 'transport', mode: 'new' })
            },

            // DATA ENTRY
            'EditStudentRecords': {
                label: 'Edit Student', icon: Search, secondary: false,
                action: () => handleNavigation('/staff/students')
            },
            'VerifyDocuments': {
                label: 'Verify Docs', icon: Shield, secondary: false,
                action: () => handleNavigation('/staff/documents', { filter: 'verificationPending' })
            },
            'UpdateClassInfo': {
                label: 'Class Info', icon: Users, secondary: true,
                action: () => handleNavigation('/staff/students', { mode: 'class_update' })
            },

            // SUPPORT
            'ViewOpenTickets': {
                label: 'View Tickets', icon: Ticket, secondary: false,
                action: () => handleNavigation('/staff/support', { filter: 'open' })
            },
            'RespondToTicket': {
                label: 'Respond', icon: Info, secondary: true,
                action: () => handleNavigation('/staff/support')
            },
            'CloseTicket': {
                label: 'Close Ticket', icon: CheckCircle, secondary: true,
                action: () => handleNavigation('/staff/support')
            },
        };

        return (
            <div className="mb-6 md:mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {config.quickActions.map(actionKey => {
                        const actionConfig = ACTIONS[actionKey];
                        if (!actionConfig) return null;
                        const ActionIcon = actionConfig.icon;

                        return (
                            <button
                                key={actionKey}
                                onClick={actionConfig.action}
                                className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border transition-all text-left active:scale-95 ${actionConfig.secondary
                                    ? 'bg-white border-gray-200 hover:border-indigo-300 text-gray-700'
                                    : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100 text-indigo-700'
                                    }`}
                            >
                                <div className={`p-1.5 md:p-2 rounded-lg shrink-0 ${actionConfig.secondary ? 'bg-gray-100 text-gray-500' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                    <ActionIcon size={16} className="md:w-[18px] md:h-[18px]" />
                                </div>
                                <span className="text-xs md:text-sm font-bold line-clamp-1">{actionConfig.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (!config) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Dev Helper: Role Switcher (Hidden in prod) */}
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs flex gap-2 items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
                <span className="font-bold text-yellow-800 uppercase shrink-0">Dev Only: Switch Role</span>
                {Object.values(STAFF_ROLES).filter(r => r !== 'ADMIN').map(role => (
                    <button
                        key={role}
                        onClick={() => setCurrentRole(role)}
                        className={`px-2 py-1 rounded border shrink-0 ${currentRole === role ? 'bg-yellow-200 border-yellow-400 font-bold' : 'bg-white border-gray-200'}`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            <RoleSummaryBanner
                role={staff.role}
                name={staff.name}
                description={config.bannerText}
            />

            {renderPrimaryWidgets()}

            {renderQuickActions()}

            {/* Secondary Widgets / Alerts usually go here */}
            {config.secondaryWidgets && config.secondaryWidgets.length > 0 && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Operational Updates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                            <Info className="text-slate-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-sm font-bold text-slate-800">Admin Notice</p>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    System maintenance scheduled for Saturday 10 PM. Please complete all pending uploads before then.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;