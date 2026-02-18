import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { LogOut, HelpCircle, ShieldCheck, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useTeacherStore } from '../../../store/teacherStore';

// Components
import ProfileSummaryCard from '../components/profile/ProfileSummaryCard';
import AssignedSubjectsCard from '../components/profile/AssignedSubjectsCard';
import SettingsCard from '../components/profile/SettingsCard';

const ProfilePage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const profile = useTeacherStore(state => state.profile);
    const fetchProfile = useTeacherStore(state => state.fetchProfile);
    const assignedClasses = useTeacherStore(state => state.assignedClasses);
    const fetchAssignedClasses = useTeacherStore(state => state.fetchAssignedClasses);
    const logout = useTeacherStore(state => state.logout);
    const uploadProfilePhoto = useTeacherStore(state => state.uploadProfilePhoto);
    const isFetchingProfile = useTeacherStore(state => state.isFetchingProfile);
    const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);

    const handlePhotoUpload = async (base64) => {
        setIsUploadingPhoto(true);
        const result = await uploadProfilePhoto(base64);
        setIsUploadingPhoto(false);
        if (result?.success) {
            // Profile updated in store; optional: show toast
        } else if (result?.message) {
            alert(result.message);
        }
    };

    // Fetch Initial Data
    useEffect(() => {
        fetchProfile();
        fetchAssignedClasses();
    }, [fetchProfile, fetchAssignedClasses]);

    // Format dates safely
    const formatSecurityDate = (dateString) => {
        if (!dateString) return "Not available";
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const securityInfo = {
        lastLogin: formatSecurityDate(profile?.lastLogin),
        passwordLastChanged: profile?.passwordChangedAt
            ? new Date(profile.passwordChangedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : "Never",
        twoFactorEnabled: profile?.twoFactorEnabled || false
    };

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // Entrance Animation
    useEffect(() => {
        if (!profile) return;
        const ctx = gsap.context(() => {
            gsap.from('.profile-section', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, [profile]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout();
            navigate('/teacher/login');
        }
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }


    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">My Profile</h1>
                    </div>
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <ShieldCheck size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 pt-4">

                <div className="profile-section">
                    <ProfileSummaryCard
                        profile={profile}
                        onPhotoUpload={handlePhotoUpload}
                        isUploading={isUploadingPhoto}
                    />
                </div>

                <div className="profile-section">
                    <AssignedSubjectsCard
                        subjects={assignedClasses}
                        year={assignedClasses[0]?.academicYear || "2024-25"}
                    />
                </div>

                <div className="profile-section">
                    <SettingsCard preferences={profile?.preferences || {}} />
                </div>

                <div className="profile-section">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Login Security</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <span className="text-xs text-gray-500 font-medium">Last Login</span>
                                <span className="text-xs font-bold text-gray-900">{securityInfo.lastLogin}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <span className="text-xs text-gray-500 font-medium">Password Changed</span>
                                <span className="text-xs font-bold text-gray-900">{securityInfo.passwordLastChanged}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-xs text-gray-500 font-medium">2FA Status</span>
                                <span className={`text-xs font-bold ${securityInfo.twoFactorEnabled ? 'text-emerald-600' : 'text-orange-600'}`}>
                                    {securityInfo.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-section space-y-3">
                    <button
                        onClick={() => navigate('/teacher/help')}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-left hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <HelpCircle size={18} />
                            </div>
                            <span className="text-sm font-bold text-gray-900">Help & Support</span>
                        </div>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>

                    <p className="text-center text-[10px] text-gray-400 font-medium pt-4">
                        Version 1.2.0 • Build 2024
                    </p>
                </div>

            </main>
        </div>
    );
};

export default ProfilePage;
