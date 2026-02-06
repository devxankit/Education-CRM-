import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { getDashboardStats } from '../services/dashboard.api';

import {
    Users, FileText, ClipboardList, Wallet, Ticket, Bus,
    AlertCircle, CheckCircle, Clock, Plus, Upload, Filter,
    Download, Search, Shield, ChevronRight, Info, AlertTriangle,
    Briefcase, UserPlus, User, Bell, Sparkles, TrendingUp,
    Calendar, ArrowRight
} from 'lucide-react';
import { ROLE_DASHBOARD_MAP } from '../config/roleDashboardMap';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getDashboardStats();
                if (data) setStats(data);
            } catch (error) {
                toast.error("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchStats();
    }, [user]);

    if (!user || !user.roleId) return null;

    // Support both direct role string and populated role object
    const currentRole = user.role || user.roleId?.code;
    const config = ROLE_DASHBOARD_MAP[currentRole];

    const handleNavigation = (path, stateData = {}) => {
        navigate(path, { state: { source: 'dashboard', ...stateData } });
    };

    // --- PREMIUM WIDGET RENDERER ---
    const renderPrimaryWidgets = () => {
        if (!config?.primaryWidgets || config.primaryWidgets.length === 0) return null;

        const getWidgetProps = (key) => {
            const count = stats?.[key] || 0;
            switch (key) {
                case 'TotalAdmissions': return { title: 'Total Students', count, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', path: '/staff/students' };
                case 'PendingAdmissions': return { title: 'Pending Approval', count, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', path: '/staff/students' };
                case 'TodayAdmissions': return { title: 'New Today', count, icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', path: '/staff/students' };
                case 'PendingDocuments': return { title: 'Docs Pending', count, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50/50', border: 'border-orange-100', path: '/staff/documents' };
                case 'VisitorRequests': return { title: 'Active Inquiries', count, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', path: '/staff/students' };
                case 'PendingFees': return { title: 'Unpaid Fees', count, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100', path: '/staff/fees' };
                case 'TodayCollections': return { title: 'Fees Collected', count, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', path: '/staff/fees' };
                case 'ActiveRoutes': return { title: 'Active Routes', count, icon: Bus, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', path: '/staff/transport' };
                case 'OpenTickets': return { title: 'Support Tickets', count, icon: Ticket, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100', path: '/staff/support' };
                case 'MyClasses': return { title: 'My Classes', count, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', path: '/staff/teachers' };
                case 'TodayAttendance': return { title: 'Attendance', count, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', path: '/staff/students' };
                default: return { title: key.replace(/([A-Z])/g, ' $1').trim(), count, icon: Info, color: 'text-gray-600', bg: 'bg-gray-50/50', border: 'border-gray-100', path: '/staff/dashboard' };
            }
        };

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {config.primaryWidgets.map(key => {
                    const props = getWidgetProps(key);
                    const Icon = props.icon;
                    return (
                        <div
                            key={key}
                            onClick={() => handleNavigation(props.path)}
                            className={`group relative overflow-hidden ${props.bg} ${props.border} border rounded-3xl p-5 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer active:scale-[0.98] blur-backdrop`}
                        >
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl bg-white shadow-sm ${props.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="text-right">
                                    <span className={`text-2xl font-black ${props.color} tracking-tight`}>{props.count}</span>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mt-1">{props.title}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                                <span>View Details</span>
                                <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // --- PREMIUM QUICK ACTIONS ---
    const renderQuickActions = () => {
        if (!config?.quickActions || config.quickActions.length === 0) return null;

        const ACTIONS = {
            'AddNewInquiry': { label: 'New Inquiry', icon: UserPlus, color: 'bg-indigo-600', path: '/staff/students/new' },
            'UploadDocuments': { label: 'Upload Files', icon: Upload, color: 'bg-orange-600', path: '/staff/documents' },
            'ViewPendingAdmissions': { label: 'Admissions', icon: Users, color: 'bg-blue-600', path: '/staff/students' },
            'ViewFeeLedger': { label: 'Fee Ledger', icon: Search, color: 'bg-emerald-600', path: '/staff/fees' },
            'ProcessPayroll': { label: 'Payroll', icon: Wallet, color: 'bg-violet-600', path: '/staff/payroll' },
            'AddStudent': { label: 'New Student', icon: Plus, color: 'bg-indigo-600', path: '/staff/students/new' },
            'MarkAttendance': { label: 'Attendance', icon: CheckCircle, color: 'bg-emerald-600', path: '/staff/students' },
            'ViewOpenTickets': { label: 'Support Inbox', icon: Bell, color: 'bg-rose-600', path: '/staff/support' },
        };

        return (
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-500" />
                        Quick Actions
                    </h3>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {config.quickActions.slice(0, 10).map(actionKey => {
                        const action = ACTIONS[actionKey] || { label: actionKey, icon: Info, color: 'bg-gray-600', path: '/staff/dashboard' };
                        const Icon = action.icon;
                        return (
                            <button
                                key={actionKey}
                                onClick={() => handleNavigation(action.path)}
                                className="group flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 ${action.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={22} />
                                </div>
                                <span className="text-[11px] font-bold text-gray-700 text-center leading-tight group-hover:text-indigo-600 transition-colors">
                                    {action.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-10">
                <div className="animate-pulse space-y-8">
                    <div className="h-32 bg-gray-100 rounded-3xl w-full"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="h-32 bg-gray-100 rounded-3xl"></div>
                        <div className="h-32 bg-gray-100 rounded-3xl"></div>
                        <div className="h-32 bg-gray-100 rounded-3xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 min-h-screen bg-gray-50/50">
            {/* High-End Greeting Banner */}
            <div className="relative overflow-hidden bg-white mt-6 mb-8 rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="relative z-10 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest mb-4">
                        <TrendingUp size={12} />
                        Welcome Back
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
                        Hi, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-500 font-medium max-w-sm">
                        {config?.bannerText || "Manage your school operations with ease."}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Calendar size={14} className="text-indigo-500" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Shield size={14} className="text-emerald-500" />
                            {user.roleId?.name || "Staff Member"}
                        </div>
                    </div>
                </div>

                <div className="relative shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-indigo-600 p-1.5 shadow-2xl rotate-3">
                        <div className="w-full h-full rounded-[1.7rem] bg-white overflow-hidden flex items-center justify-center">
                            {user.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-black text-indigo-600">{user.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-500" />
                    Key Performance
                </h3>
            </div>
            {renderPrimaryWidgets()}

            {/* Quick Actions */}
            {renderQuickActions()}

            {/* Bottom Row - System Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Bell size={16} className="text-rose-500" />
                            System Alerts
                        </h3>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">Today</span>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300">
                            <div className="flex gap-3">
                                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Weekly Backup Pending</p>
                                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">The system will perform a partial backup on Sunday at midnight. Support will be offline for 30 mins.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300">
                            <div className="flex gap-3">
                                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Profile Updates Success</p>
                                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Staff profile pictures and custom banners are now live. Personalize your workspace in the profile section!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] shadow-xl shadow-indigo-200 text-white relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <Sparkles className="mb-4 text-amber-300 group-hover:scale-125 transition-transform" size={28} />
                            <h2 className="text-2xl font-black leading-tight mb-2">Grow your <br /> Institution</h2>
                            <p className="text-indigo-100 text-xs font-medium">Use advanced analytics of the ERP to track student performance and fee growth.</p>
                        </div>
                        <button className="mt-8 bg-white/20 backdrop-blur-md text-white py-3 px-6 rounded-2xl text-xs font-black w-fit hover:bg-white hover:text-indigo-600 transition-all active:scale-95">
                            Open Analytics
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 ml-12 mb-12 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;

