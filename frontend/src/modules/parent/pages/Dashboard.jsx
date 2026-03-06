import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '../../../store/parentStore';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ChildSelector from '../components/dashboard/ChildSelector';
import ChildOverviewCard from '../components/dashboard/ChildOverviewCard';
import AlertsSection from '../components/dashboard/AlertsSection';
import AcademicSnapshot from '../components/dashboard/AcademicSnapshot';
import FeesSnapshot from '../components/dashboard/FeesSnapshot';
import ParentBottomNav from '../components/common/ParentBottomNav';
import gsap from 'gsap';
import { Calendar, BookOpen, FileText, CreditCard, HeadphonesIcon } from 'lucide-react';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Store Selectors
    const user = useParentStore(state => state.user);
    const children = useParentStore(state => state.children);
    const selectedChildId = useParentStore(state => state.selectedChildId);
    const fetchDashboardData = useParentStore(state => state.fetchDashboardData);
    const upcomingHolidays = useParentStore(state => state.upcomingHolidays);
    const fetchUpcomingHolidays = useParentStore(state => state.fetchUpcomingHolidays);

    const [isLoading, setIsLoading] = useState(true);

    const formatHolidayDate = (holiday) => {
        const start = new Date(holiday.startDate);
        const end = new Date(holiday.endDate || holiday.startDate);
        if (holiday.isRange && !isNaN(end.getTime()) && start.toDateString() !== end.toDateString()) {
            return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
        }
        return start.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    const activeChild = children?.find(c => (c._id === selectedChildId || c.id === selectedChildId)) || children?.[0];

    // Navigation Handlers
    const handleNotificationClick = () => {
        navigate('/parent/notices', { state: { childId: selectedChildId, filter: 'unread' } });
    };

    const handleOverviewClick = () => {
        navigate('/parent/attendance', { state: { childId: selectedChildId, source: 'dashboard_overview' } });
    };

    const handleAlertClick = (alert) => {
        const state = { childId: selectedChildId };

        switch (alert.type) {
            case 'attendance':
                navigate('/parent/attendance', { state: { ...state, highlightLowAttendance: true } });
                break;
            case 'homework':
                navigate('/parent/homework', { state: { ...state, filter: 'pending' } });
                break;
            case 'fee':
                navigate('/parent/fees', { state: { ...state, highlightPendingFee: true } });
                break;
            case 'exam':
                navigate('/parent/exams', { state: { ...state, highlightLatestResult: true } });
                break;
            default:
                navigate('/parent/notices', { state: { ...state, highlightId: alert.id } });
        }
    };

    const handleAcademicClick = (type) => {
        const state = { childId: selectedChildId };
        if (type === 'attendance') navigate('/parent/attendance', { state });
        else if (type === 'homework') navigate('/parent/homework', { state });
        else if (type === 'result') navigate('/parent/exams', { state });
    };

    const handleFeesClick = (action) => {
        navigate('/parent/fees', {
            state: {
                childId: selectedChildId,
                tab: action === 'pay' ? 'payment' : 'history'
            }
        });
    };

    const handleQuickAction = (path) => {
        navigate(path, { state: { childId: selectedChildId } });
    };

    const handleChildSelect = (id) => {
        useParentStore.getState().setSelectedChild(id);
    };

    // UseEffect to fetch data
    useEffect(() => {
        const initDashboard = async () => {
            await fetchDashboardData();
            await fetchUpcomingHolidays();
            setIsLoading(false);
        };
        initDashboard();
    }, [fetchDashboardData, fetchUpcomingHolidays]);

    useEffect(() => {
        if (isLoading || !activeChild || !containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".dashboard-item",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }, containerRef);
        return () => {
            try { ctx.revert(); } catch (_) { /* ignore DOM errors on unmount */ }
        };
    }, [isLoading, activeChild]);

    if (isLoading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <span className="loading loading-spinner text-indigo-600"></span>
        </div>;
    }

    if (!user) return null;

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-28">
            <DashboardHeader
                parentName={user?.name || 'Parent'}
                onNotificationClick={handleNotificationClick}
            />

            {/* Child Selector */}
            {children?.length > 1 && (
                <div className="dashboard-item">
                    <ChildSelector
                        children={children}
                        selectedChildId={selectedChildId}
                        onSelect={handleChildSelect}
                    />
                </div>
            )}

            <main className="pt-4 max-w-md mx-auto">
                <div className="dashboard-item cursor-pointer active:scale-[0.98] transition-transform" onClick={handleOverviewClick}>
                    {activeChild && <ChildOverviewCard child={activeChild} />}
                </div>

                <div className="dashboard-item">
                    <AlertsSection
                        alerts={activeChild?.alerts || []}
                        onAlertClick={handleAlertClick}
                    />
                </div>

                <div className="dashboard-item">
                    <AcademicSnapshot
                        data={activeChild?.academics}
                        onItemClick={handleAcademicClick}
                    />
                </div>

                {/* Upcoming Holidays for Child */}
                {upcomingHolidays && (
                    <div className="dashboard-item px-4">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-indigo-500" />
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                        Upcoming Holidays
                                    </h3>
                                </div>
                                {upcomingHolidays.length > 0 && (
                                    <span className="text-[10px] text-gray-400 font-semibold">
                                        Next {upcomingHolidays.length} days
                                    </span>
                                )}
                            </div>
                            {upcomingHolidays.length > 0 ? (
                                <div className="space-y-2">
                                    {upcomingHolidays.map((h) => (
                                        <div key={h._id || h.id} className="flex items-center justify-between text-xs">
                                            <div>
                                                <p className="font-semibold text-gray-900">{h.name}</p>
                                                <p className="text-[11px] text-gray-500">
                                                    {formatHolidayDate(h)}
                                                </p>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                {h.type || 'Holiday'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[11px] text-gray-400">
                                    No upcoming holidays recorded yet.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="dashboard-item">
                    <FeesSnapshot
                        fees={activeChild?.fees}
                        onActionClick={handleFeesClick}
                    />
                </div>

                {/* Quick Actions Grid */}
                <div className="dashboard-item px-4 mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <QuickActionButton icon={Calendar} label="View Attendance" onClick={() => handleQuickAction('/parent/attendance')} color="text-emerald-600" bg="bg-emerald-50" />
                        <QuickActionButton icon={BookOpen} label="Homework" onClick={() => handleQuickAction('/parent/homework')} color="text-blue-600" bg="bg-blue-50" />
                        <QuickActionButton icon={FileText} label="Exam Results" onClick={() => handleQuickAction('/parent/exams')} color="text-purple-600" bg="bg-purple-50" />
                        <QuickActionButton icon={CreditCard} label="Fee Status" onClick={() => handleQuickAction('/parent/fees')} color="text-orange-600" bg="bg-orange-50" />
                        <QuickActionButton icon={HeadphonesIcon} label="Help & Support" onClick={() => handleQuickAction('/parent/support')} color="text-gray-600" bg="bg-gray-100" />
                    </div>
                </div>

            </main>

            <ParentBottomNav />
        </div>
    );
};

// Internal Helper Component for Quick Actions
const QuickActionButton = ({ icon: Icon, label, onClick, color, bg }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm active:scale-95 transition-all text-left group"
    >
        <div className={`p-2.5 rounded-lg ${bg} ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={20} />
        </div>
        <span className="text-sm font-bold text-gray-700">{label}</span>
    </button>
);

export default ParentDashboard;
