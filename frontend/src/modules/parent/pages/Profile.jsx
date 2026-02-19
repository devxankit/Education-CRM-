
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, User, Phone, Mail, Edit2, Shield, Settings,
    LogOut, AlertCircle, CheckCircle, ChevronRight, Bell, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
import { useParentStore } from '../../../store/parentStore';

const ParentProfilePage = () => {
    const navigate = useNavigate();
    const user = useParentStore(state => state.user);
    const children = useParentStore(state => state.children);
    const logout = useParentStore(state => state.logout);
    const fetchProfile = useParentStore(state => state.fetchProfile);
    const updateProfile = useParentStore(state => state.updateProfile);
    const setSelectedChildId = useParentStore(state => state.setSelectedChild);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const [preferences, setPreferences] = useState({
        attendance: true,
        homework: true,
        results: true,
        fees: true
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        email: user?.email || '',
        mobile: user?.mobile || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    // Handlers
    const handleLogout = () => {
        logout();
        navigate('/parent/login');
    };

    const handleChildClick = (childId) => {
        setSelectedChildId(childId);
        navigate('/parent/dashboard');
    };

    const handlePreferenceToggle = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleEditOpen = () => {
        setEditForm({ email: user.email || '', mobile: user.mobile || '' });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const res = await updateProfile(editForm);
        setIsSaving(false);
        if (res.success) {
            setIsEditModalOpen(false);
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Profile</h1>
                </div>
                <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <LogOut size={20} />
                </button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* 1. Profile Summary Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full border border-green-100">
                            {user?.status || 'Active'}
                        </span>
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                            {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User size={32} className="text-indigo-600" />}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">{user?.name || 'Parent User'}</h2>
                        <p className="text-xs text-gray-400 font-mono tracking-wider">ID: {user?._id || user?.id || 'N/A'}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{user?.email || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{user?.mobile || 'N/A'}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleEditOpen}
                            className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            <Edit2 size={14} /> Update Contact Info
                        </button>
                    </div>
                </div>

                {/* 2. Linked Children */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Linked Students</h3>
                    <div className="space-y-3">
                        {children.map(child => (
                            <div
                                key={child.id}
                                onClick={() => handleChildClick(child.id)}
                                className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-indigo-100 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                                        {child.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{child.name}</h4>
                                        <p className="text-xs text-gray-500">Class {child.class} • Roll: {child.rollNo}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Notification Preferences */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-50 flex items-center gap-2">
                        <Bell size={18} className="text-indigo-600" />
                        <h3 className="text-sm font-bold text-gray-900">Alert Preferences</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {Object.entries(preferences).map(([key, value]) => (
                            <div key={key} className="p-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 capitalize">{key} Alerts</span>
                                <button
                                    onClick={() => handlePreferenceToggle(key)}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${value ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Support Actions */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Support & Privacy</h3>
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <button
                            onClick={() => navigate('/parent/support')}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <HelpCircle size={18} className="text-indigo-500" />
                                <span className="text-sm font-bold text-gray-700">Help & Support</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                        <button
                            onClick={() => navigate('/parent/settings')}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <Settings size={18} className="text-gray-500" />
                                <span className="text-sm font-bold text-gray-700">Account Settings</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Shield size={18} className="text-gray-500" />
                                <span className="text-sm font-bold text-gray-700">Privacy Policy</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                    </div>
                </div>

            </main>

            {/* Edit Contact Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Contact Info</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        readOnly
                                        className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed outline-none"
                                        title="Email cannot be changed"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={editForm.mobile}
                                        onChange={(e) => setEditForm(p => ({ ...p, mobile: e.target.value }))}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ParentProfilePage;
