import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Building2, Calendar, Mail, Phone, Briefcase } from 'lucide-react';

const ProfileSummaryCard = ({ profile }) => {
    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Teacher';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <div className="h-24 bg-gradient-to-r from-indigo-600 to-indigo-800 relative"></div>

            <div className="px-5 pb-5">
                <div className="flex justify-between items-end -mt-10 mb-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
                            {profile.photo ? (
                                <img src={profile.photo} alt={fullName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl">
                                    {fullName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-5 h-5 rounded-full" title="Active"></div>
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
