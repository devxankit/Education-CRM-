import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Book, Users, Shield, HelpCircle, ChevronRight, LogOut } from 'lucide-react';

// Components
import ProfileSummaryCard from '../components/Profile/ProfileSummaryCard';
import InfoSectionCard from '../components/Profile/InfoSectionCard';
import DocumentsList from '../components/Profile/DocumentsList';
import EmptyState from '../components/Attendance/EmptyState'; // Reuse or create new

import { useStudentStore } from '../../../store/studentStore';

// Helper for Academic Card
const AcademicInfoCard = ({ data }) => {
    if (!data) return null;
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                Academic Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Institute</p>
                        <p className="text-sm font-semibold text-gray-800">{data.instituteName}</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg text-purple-600">
                        <Shield size={18} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-gray-100 rounded-xl">
                        <p className="text-[10px] text-gray-400 uppercase font-medium">Stream</p>
                        <p className="text-sm font-bold text-gray-800">{data.stream}</p>
                    </div>
                    <div className="p-3 border border-gray-100 rounded-xl">
                        <p className="text-[10px] text-gray-400 uppercase font-medium">Medium</p>
                        <p className="text-sm font-bold text-gray-800">{data.medium}</p>
                    </div>
                    <div className="p-3 border border-gray-100 rounded-xl">
                        <p className="text-[10px] text-gray-400 uppercase font-medium">Since</p>
                        <p className="text-sm font-bold text-gray-800">{data.admissionDate ? new Date(data.admissionDate).getFullYear() : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for Parent Card
const ParentInfoCard = ({ data }) => {
    if (!data || !data.name || data.name === 'N/A') return null;
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                Parent / Guardian
            </h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                        {data.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{data.name}</p>
                        <p className="text-xs text-gray-500">{data.relationship} • {data.contact}</p>
                    </div>
                </div>
                {data.linkedAccount && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs text-emerald-800 font-medium">
                        <Shield size={12} />
                        Parent Account Linked
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const student = useStudentStore(state => state.profile);
    const fetchProfile = useStudentStore(state => state.fetchProfile);
    const logout = useStudentStore(state => state.logout);
    const [loading, setLoading] = useState(!student);

    const handleLogout = () => {
        logout();
        navigate('/student/login');
    };

    // Initial Load & Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // ALWAYS fetch the full populated profile on mount
        setLoading(true);
        fetchProfile().finally(() => setLoading(false));

        return () => lenis.destroy();
    }, [fetchProfile]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-400 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!student) return <EmptyState />;

    // Use only real photo for avatar (not certificates saved under photo by mistake)
    const getProfileAvatar = () => {
        const photo = student.documents?.photo;
        if (!photo?.url) return "https://api.dicebear.com/7.x/avataaars/svg?seed=" + student.admissionNo;
        const n = (photo.name || '').toLowerCase();
        if (n.includes('certificate') || n.includes('aadhar') || n.includes('transfer') || n.includes('birth') || n.endsWith('.pdf')) return "https://api.dicebear.com/7.x/avataaars/svg?seed=" + student.admissionNo;
        return photo.url;
    };

    // Prepare data for sub-components
    const summaryData = {
        name: `${student.firstName} ${student.lastName}`,
        avatar: getProfileAvatar(),
        class: student.classId?.name || "N/A",
        section: student.sectionId?.name || "N/A",
        rollNumber: student.rollNo || "N/A",
        id: student.admissionNo,
        status: student.status === 'active' ? 'Active' : 'Inactive'
    };

    const personalData = {
        dob: student.dob,
        gender: student.gender,
        bloodGroup: student.bloodGroup,
        contact: student.parentId?.mobile || student.parentMobile || "N/A",
        email: student.parentEmail || "N/A",
        address: student.address ? `${student.address}, ${student.city}, ${student.state} - ${student.pincode}` : "N/A"
    };

    const academicData = {
        instituteName: student.branchId?.name || "My Institute",
        stream: student.classId?.level || "Standard",
        medium: student.branchId?.board || "English",
        admissionDate: student.admissionDate
    };

    const parentData = {
        name: student.parentId?.name || "N/A",
        relationship: student.parentId?.relationship || "Guardian",
        contact: student.parentId?.mobile || "N/A",
        linkedAccount: !!student.parentId
    };

    // Transform documents object to array for list component (exclude photo – it's for profile only)
    const docsArray = student.documents ? Object.keys(student.documents)
        .filter(key => key !== 'photo' && student.documents[key]?.url)
        .map(key => ({
            id: key,
            name: key === 'birthCert' ? 'Birth Certificate' :
                key === 'transferCert' ? 'Transfer Certificate' :
                    key === 'aadhar' ? 'Aadhar Card' :
                        key === 'prevMarksheet' ? 'Previous Marksheet' : 'Document',
            type: 'PDF/Image',
            size: student.documents[key]?.date || 'Uploaded',
            status: student.documents[key]?.status || 'Uploaded',
            url: student.documents[key]?.url
        })) : [];

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h1 className="text-lg font-bold text-gray-900">My Profile</h1>

                    <button
                        onClick={() => navigate('/student/settings')}
                        className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {/* 1. Summary */}
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <ProfileSummaryCard student={summaryData} />
                    </motion.div>

                    {/* 2. Personal Info */}
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <InfoSectionCard
                            title="Personal Information"
                            data={personalData}
                        />
                    </motion.div>

                    {/* 3. Academic Info */}
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <AcademicInfoCard data={academicData} />
                    </motion.div>

                    {/* 4. Documents */}
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <DocumentsList documents={docsArray} />
                    </motion.div>

                    {/* 5. Parent Info */}
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <ParentInfoCard data={parentData} />
                    </motion.div>


                    {/* 6. Help Action */}
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <button
                            onClick={() => navigate('/student/help')}
                            className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between group active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <HelpCircle size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900">Help & Support</p>
                                    <p className="text-xs text-gray-400">Raised tickets, FAQs & more</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                        </button>
                    </motion.div>

                    {/* 7. Logout Action */}
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm mb-8 flex items-center justify-between group active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                    <LogOut size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-rose-900">Logout</p>
                                    <p className="text-xs text-rose-500">Sign out from your account</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-rose-300 group-hover:text-rose-600 transition-colors" />
                        </button>
                    </motion.div>

                    {/* 8. Account Footer */}
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <div className="text-center text-[10px] text-gray-400 pb-10">
                            {student.lastLogin && (
                                <p>Last login: {new Date(student.lastLogin).toLocaleString()}</p>
                            )}
                            <p>Account Version v1.2.0 • {student.status === 'active' ? 'Secure' : 'Inactive'}</p>
                        </div>
                    </motion.div>

                </motion.div>
            </main>
        </div>
    );
};

export default ProfilePage;
