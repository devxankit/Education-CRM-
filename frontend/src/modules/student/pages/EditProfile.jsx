import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, Save, User, Calendar, Droplet, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStudentStore } from '../../../store/studentStore';
import { motion } from 'framer-motion';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const student = useStudentStore(state => state.profile);
    const fetchProfile = useStudentStore(state => state.fetchProfile);
    const updateProfile = useStudentStore(state => state.updateProfile);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        nationality: '',
        religion: '',
        category: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        photo: null // { base64, name }
    });

    useEffect(() => {
        if (!student) {
            fetchProfile();
        } else {
            setFormData({
                firstName: student.firstName || '',
                middleName: student.middleName || '',
                lastName: student.lastName || '',
                dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
                gender: student.gender || '',
                bloodGroup: student.bloodGroup || '',
                nationality: student.nationality || 'Indian',
                religion: student.religion || '',
                category: student.category || 'General',
                address: student.address || '',
                city: student.city || '',
                state: student.state || '',
                pincode: student.pincode || '',
                photo: null
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFormData(prev => ({
                    ...prev,
                    photo: {
                        base64: reader.result,
                        name: file.name
                    }
                }));
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await updateProfile(formData);
            if (success) {
                toast.success("Profile updated successfully");
                await fetchProfile();
                navigate('/student/profile');
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>

                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center gap-4 py-2">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full border-4 border-indigo-50 shadow-inner overflow-hidden bg-gray-100">
                                    {formData.photo?.base64 ? (
                                        <img src={formData.photo.base64} alt="Preview" className="w-full h-full object-cover" />
                                    ) : student?.documents?.photo?.url ? (
                                        <img src={student.documents.photo.url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <User size={60} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-1 right-1 p-3 bg-indigo-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors active:scale-95">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                                Tap to change <br /> Profile Photo
                            </p>
                        </div>

                        {/* Basic Info Section */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Basic Details</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">First Name</label>
                                    <input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        required
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Last Name</label>
                                    <input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        required
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Date of Birth</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Blood Group</label>
                                    <div className="relative">
                                        <select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                                        >
                                            <option value="">Select</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </select>
                                        <Droplet className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    </div>
                                </div>

                                <div className="space-y-1.5 opacity-60">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Email <span className="text-[8px] font-black">(Protected)</span></label>
                                    <input
                                        value={student?.parentEmail || ''}
                                        readOnly
                                        className="w-full px-4 py-3.5 bg-gray-100 border border-gray-100 rounded-2xl text-sm font-semibold cursor-not-allowed outline-none text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-5 bg-purple-500 rounded-full"></span>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Address Details</h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Residential Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="House No, Building, Area, Landmark..."
                                    rows="3"
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-gray-300"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Pincode</label>
                                    <input
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="XXXXXX"
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4.5 text-sm font-bold text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Updating Profile...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full py-4.5 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
};

export default EditProfilePage;
