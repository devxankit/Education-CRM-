
import React from 'react';
import { User, Phone, Mail, MapPin, Edit } from 'lucide-react';

const ProfileHeader = ({ student, onEdit }) => {
    // Robust name handling
    const fullName = student.name || `${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.trim() || 'No Name';

    // Calculate age from dob
    const dobDate = student.dob ? new Date(student.dob) : null;
    const age = dobDate && !isNaN(dobDate.getTime()) ? new Date().getFullYear() - dobDate.getFullYear() : 'N/A';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-200 flex-shrink-0 overflow-hidden shadow-inner border border-gray-100">
                    <img
                        src={student.documents?.photo?.url || `https://ui-avatars.com/api/?name=${fullName}&background=6366f1&color=fff&size=128`}
                        alt={fullName}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Primary Info */}
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] tracking-tight">{fullName}</h1>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-mono">
                                <span className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700 font-bold border border-indigo-100">{student.admissionNo || 'NO-ADM-ID'}</span>
                                <span>•</span>
                                <span>{student.classId?.name || student.class || 'No Class'} - {student.sectionId?.name || student.section || 'No Section'}</span>
                                <span>•</span>
                                <span>Roll No: {student.rollNo || 'N/A'}</span>
                            </div>
                        </div>
                        <button
                            onClick={onEdit}
                            className="hidden md:flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-transparent hover:border-indigo-100"
                        >
                            <Edit size={16} /> Edit Profile
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User size={16} className="text-gray-400" />
                            <span>{student.gender || 'N/A'}, {age} Years</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={16} className="text-gray-400" />
                            <span>{student.parentId?.mobile || student.parentMobile || student.contact || 'No Contact'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                            <Mail size={16} className="text-gray-400" />
                            <span className="truncate">{student.parentId?.email || student.parentEmail || student.email || 'No Email Address'}</span>
                        </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2 text-gray-600 text-sm">
                        <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{student.address || 'Address not provided'}{student.city ? `, ${student.city}` : ''}{student.pincode ? ` - ${student.pincode}` : ''}</span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${student.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                            {student.status || 'ACTIVE'} STUDENT
                        </span>
                        {student.transportRequired && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-blue-200">Bus Traveller</span>}
                        {student.hostelRequired && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-orange-200">Hosteler</span>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileHeader;
