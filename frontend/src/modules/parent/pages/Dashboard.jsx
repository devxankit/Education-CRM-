
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PARENT_DATA } from '../data/mockData';
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

    // 1. Initialize State with Persistence
    const [selectedChildId, setSelectedChildId] = useState(() => {
        return localStorage.getItem('selectedChildId') || MOCK_PARENT_DATA.children[0]?.id;
    });
    const [isLoading, setIsLoading] = useState(true);

    const activeChild = MOCK_PARENT_DATA.children.find(c => c.id === selectedChildId) || MOCK_PARENT_DATA.children[0];

    // 2. Persist Selection
    const handleChildSelect = (id) => {
        setSelectedChildId(id);
        localStorage.setItem('selectedChildId', id);
    };

    // 3. Navigation Handlers
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
                navigate('/parent/exams', { state: { ...state, highlightLatestResult: true } }); // Mapped to exams route
                break;
            default:
                // Fallback for general alerts or notices
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
        // action: 'pay' | 'receipts'
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

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 800);
    }, [selectedChildId]);

    useEffect(() => {
        if (!isLoading) {
            gsap.fromTo(".dashboard-item",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [isLoading]);

    if (isLoading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <span className="loading loading-spinner text-indigo-600"></span>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-28">
            <DashboardHeader
                parentName={MOCK_PARENT_DATA.user.name}
                onNotificationClick={handleNotificationClick}
            />

            {/* Child Selector */}
            {MOCK_PARENT_DATA.children.length > 1 && (
                <div className="dashboard-item">
                    <ChildSelector
                        children={MOCK_PARENT_DATA.children}
                        selectedChildId={selectedChildId}
                        onSelect={handleChildSelect}
                    />
                </div>
            )}

            <main className="pt-4 max-w-md mx-auto">
                <div className="dashboard-item cursor-pointer active:scale-[0.98] transition-transform" onClick={handleOverviewClick}>
                    <ChildOverviewCard child={activeChild} />
                </div>

                <div className="dashboard-item">
                    <AlertsSection
                        alerts={activeChild.alerts}
                        onAlertClick={handleAlertClick}
                    />
                </div>

                <div className="dashboard-item">
                    <AcademicSnapshot
                        data={activeChild.academics}
                        onItemClick={handleAcademicClick}
                    />
                </div>

                <div className="dashboard-item">
                    <FeesSnapshot
                        fees={activeChild.fees}
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
                        <QuickActionButton icon={CreditCard} label="Pay Fees" onClick={() => handleQuickAction('/parent/fees')} color="text-orange-600" bg="bg-orange-50" />
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
