
import React from 'react';
import { User, Phone, Mail, MapPin, Edit } from 'lucide-react';

const ProfileHeader = ({ student }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-200 flex-shrink-0 overflow-hidden shadow-inner border border-gray-100">
                    <img
                        src={`https://ui-avatars.com/api/?name=${student.name}&background=6366f1&color=fff&size=128`}
                        alt={student.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Primary Info */}
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">{student.name}</h1>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-mono">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{student.admissionNo}</span>
                                <span>•</span>
                                <span>Class {student.class} - {student.section}</span>
                                <span>•</span>
                                <span>Roll No: {student.rollNo}</span>
                            </div>
                        </div>
                        <button className="hidden md:flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                            <Edit size={16} /> Edit Profile
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User size={16} className="text-gray-400" />
                            <span>{student.gender}, {student.age} Years</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={16} className="text-gray-400" />
                            <span>{student.parentMobile}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="truncate">{student.address}</span>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex gap-2 mt-4">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-200">Active Student</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">Bus Traveller</span>
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">Hosteler</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileHeader;
