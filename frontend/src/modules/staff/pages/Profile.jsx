import React, { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Camera, CheckCircle, Clock, Lock, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStaffProfile, changePassword, updateStaffProfile } from '../services/staff.api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useStaffAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Change Password State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    // Image Upload State
    const [uploadingType, setUploadingType] = useState(null); // 'profile' or 'banner'

    const fetchProfileData = async () => {
        const data = await getStaffProfile();
        if (data) {
            setProfile(data);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchProfileData();
            setLoading(false);
        };
        init();
    }, []);

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            return toast.error("Please upload an image file");
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            return toast.error("Image size should be less than 2MB");
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64 = reader.result;
            setUploadingType(type);
            const loadingToast = toast.loading(`Uploading ${type}...`);

            try {
                const res = await updateStaffProfile({
                    [type === 'profile' ? 'profilePic' : 'bannerPic']: base64
                });

                if (res.success) {
                    toast.success(`${type === 'profile' ? 'Profile picture' : 'Banner'} updated!`, { id: loadingToast });
                    await fetchProfileData();
                } else {
                    toast.error(res.message || "Upload failed", { id: loadingToast });
                }
            } catch (err) {
                toast.error("Network error during upload", { id: loadingToast });
            } finally {
                setUploadingType(null);
            }
        };
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (passwords.newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters");
        }

        setIsUpdating(true);
        const loadingToast = toast.loading("Updating your security credentials...");

        try {
            const res = await changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (res.success) {
                toast.success("Password changed successfully!", { id: loadingToast });
                setShowPasswordModal(false);
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(res.message || "Failed to change password", { id: loadingToast });
            }
        } catch (err) {
            toast.error("Network error. Please check your connection.", { id: loadingToast });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500 font-medium">Fetching details...</p>
            </div>
        );
    }

    if (!profile) return (
        <div className="max-w-2xl mx-auto p-10 text-center text-red-500 font-bold">
            Failed to load profile data.
        </div>
    );

    // Filter accessible modules
    const accessibleModules = profile.roleId?.permissions
        ? Object.entries(profile.roleId.permissions)
            .filter(([_, val]) => val.accessible)
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
        : [];

    return (
        <div className="max-w-3xl mx-auto md:pb-6 pb-24 min-h-screen bg-gray-50">
            {/* Header / Cover */}
            <div className="relative h-40 group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                    style={{
                        backgroundImage: profile.bannerPic ? `url(${profile.bannerPic})` : 'linear-gradient(to right, #4f46e5, #7c3aed)',
                    }}
                >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all"></div>
                </div>

                {/* Banner Upload Button */}
                <label className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white cursor-pointer hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 border border-white/30">
                    <Camera size={18} />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
                </label>

                <div className="absolute -bottom-12 left-6">
                    <div className="relative group/avatar">
                        <div className="w-28 h-28 rounded-3xl bg-white p-1.5 shadow-2xl relative overflow-hidden">
                            <div className="w-full h-full rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden">
                                {profile.profilePic ? (
                                    <img src={profile.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-indigo-600 text-4xl font-black">{profile.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>

                            {/* Avatar Upload Overlay */}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-all">
                                <Camera size={24} />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} />
                            </label>
                        </div>
                        {uploadingType && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-14 px-6 pb-6 bg-white border-b border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">{profile.name}</h1>
                        <p className="text-sm text-indigo-600 font-bold">Role: {profile.roleId?.name} </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Shield size={12} /> Account: <span className="capitalize text-green-600 font-bold">{profile.status}</span>
                        </p>
                    </div>

                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* ID & System Info */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm group">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Briefcase size={14} /> Employment & System Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        <ProfileField label="Branch" value={profile.branchId?.name || 'All Branches'} />
                        <ProfileField label="Joining Date" value={new Date(profile.createdAt).toLocaleString()} />
                        <ProfileField label="Last Profile Update" value={new Date(profile.updatedAt).toLocaleString()} />
                        <ProfileField label="Last Login Attempt" value={profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Never'} />
                    </div>
                </div>

                {/* Account Security Section */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Lock size={14} /> Security & Privacy
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                                <Lock size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900">Account Password</p>
                                <p className="text-[10px] text-gray-400 font-bold">Update your login security</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="text-xs font-black text-indigo-600 bg-white border border-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-50 shadow-sm"
                        >
                            Change
                        </button>
                    </div>
                </div>

                {/* Institute Info */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MapPin size={14} /> My Institution
                    </h3>
                    <div className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Mail size={16} className="text-indigo-500" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Office Email</p>
                                    <p className="text-sm font-bold text-gray-900">{profile.instituteId?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Phone size={16} className="text-indigo-500" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Office Phone</p>
                                    <p className="text-sm font-bold text-gray-900">{profile.instituteId?.phone}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <MapPin size={16} className="text-indigo-500 mt-1" />
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Registered Address</p>
                                <p className="text-sm font-bold text-gray-900">{profile.instituteId?.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User size={14} /> Personal Contact
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <Mail size={18} className="text-indigo-600" />
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase">Login Email</p>
                            <p className="text-sm font-black text-indigo-900">{profile.email}</p>
                        </div>
                    </div>
                </div>

                {/* Access & Permissions */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                            <Shield size={14} /> My Module Permissions
                        </h3>
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                            Level: {profile.roleId?.name}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {accessibleModules.length > 0 ? accessibleModules.map(mod => (
                            <span key={mod} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                <CheckCircle size={10} /> {mod}
                            </span>
                        )) : (
                            <p className="text-xs text-gray-400">No specific module access granted.</p>
                        )}
                    </div>
                </div>

                {/* Stats / Timing */}
                <div className="grid grid-cols-2 gap-3 mb-10">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-center">
                        <Clock size={16} className="mx-auto mb-1 text-gray-400" />
                        <p className="text-[10px] font-black text-gray-400 uppercase">System Status</p>
                        <p className="text-xs font-bold text-green-600 uppercase">{profile.status}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-center">
                        <CheckCircle size={16} className="mx-auto mb-1 text-gray-400" />
                        <p className="text-[10px] font-black text-gray-400 uppercase">Verified User</p>
                        <p className="text-xs font-bold text-blue-600 uppercase">Yes</p>
                    </div>
                </div>

            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-indigo-600 p-6 flex justify-between items-center">
                            <h3 className="text-white font-black text-lg">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-indigo-200 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Repeat new password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                            >
                                {isUpdating ? 'Updating Securely...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfileField = ({ label, value, mono = false }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{label}</p>
        <p className={`text-sm font-bold text-gray-900 ${mono ? 'font-mono text-xs break-all bg-gray-50 p-1 rounded border border-gray-100' : ''}`}>
            {value || 'N/A'}
        </p>
    </div>
);

export default Profile;
