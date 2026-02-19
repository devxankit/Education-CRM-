import React, { useRef } from 'react';
import { BadgeCheck, Building2, Calendar, Briefcase, Camera, Loader2 } from 'lucide-react';

const ProfileSummaryCard = ({ profile, onPhotoUpload, isUploading }) => {
    const fileInputRef = useRef(null);
    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Teacher';

    const handlePhotoClick = () => {
        if (onPhotoUpload && fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !onPhotoUpload) return;
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = () => {
            onPhotoUpload(reader.result);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <div className="h-24 bg-gradient-to-r from-indigo-600 to-indigo-800 relative"></div>

            <div className="px-5 pb-5">
                <div className="flex justify-between items-end -mt-10 mb-4">
                    <div className="relative">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={handlePhotoClick}
                            disabled={!onPhotoUpload || isUploading}
                            className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            ) : profile.photo ? (
                                <img src={profile.photo} alt={fullName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl">
                                    {fullName.charAt(0)}
                                </div>
                            )}
                        </button>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-5 h-5 rounded-full" title="Active"></div>
                        {onPhotoUpload && !isUploading && (
                            <div
                                className="absolute top-0 right-0 bg-indigo-600/90 border-2 border-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors"
                                title="Change photo"
                                onClick={handlePhotoClick}
                            >
                                <Camera size={10} className="text-white" />
                            </div>
                        )}
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100 mb-1">
                        {profile.role || 'Teacher'}
                    </span>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight flex items-center gap-1">
                        {fullName} <BadgeCheck size={18} className="text-blue-500" />
                    </h2>
                    <p className="text-sm font-medium text-gray-500">{profile.designation || 'Faculty Member'}</p>
                    <p className="text-xs text-gray-400 font-medium">ID: {profile.employeeId || 'N/A'}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                        <Building2 size={14} className="text-gray-400" />
                        <span>{profile.branchId?.name || 'Institution'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                        <Briefcase size={14} className="text-gray-400" />
                        <span>{profile.department || 'N/A'}</span>
                    </div>
                    {profile.joiningDate && (
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            <Calendar size={14} className="text-gray-400" />
                            <span>Joined: {new Date(profile.joiningDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSummaryCard;
