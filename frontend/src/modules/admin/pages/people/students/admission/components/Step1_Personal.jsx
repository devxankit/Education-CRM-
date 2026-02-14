
import React from 'react';
import { User, Calendar, MapPin, Flag } from 'lucide-react';

const Step1_Personal = ({ data, onChange }) => {

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <User className="text-indigo-600" /> Student Personal Details
                </h3>
                <p className="text-sm text-gray-500">Basic identification and demographic information.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Name */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={data.firstName || ''}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Rahul"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Middle Name</label>
                    <input
                        type="text"
                        value={data.middleName || ''}
                        onChange={(e) => handleChange('middleName', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder=""
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={data.lastName || ''}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Sharma"
                    />
                </div>

                {/* Demographics */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date of Birth <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        value={data.dob || ''}
                        onChange={(e) => handleChange('dob', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                    <div className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700">
                        {data.dob
                            ? (() => {
                                const dob = new Date(data.dob);
                                const today = new Date();
                                let age = today.getFullYear() - dob.getFullYear();
                                const m = today.getMonth() - dob.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                                return `${age} ${age === 1 ? 'year' : 'years'}`;
                            })()
                            : '—'}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender <span className="text-red-500">*</span></label>
                    <select
                        value={data.gender || ''}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Blood Group</label>
                    <select
                        value={data.bloodGroup || ''}
                        onChange={(e) => handleChange('bloodGroup', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>

                {/* Identity */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nationality</label>
                    <input
                        type="text"
                        value={data.nationality || 'Indian'}
                        onChange={(e) => handleChange('nationality', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Religion</label>
                    <select
                        value={data.religion || ''}
                        onChange={(e) => handleChange('religion', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Christian">Christian</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Jain">Jain</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                    <select
                        value={data.category || 'General'}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parent Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        value={data.parentEmail || ''}
                        onChange={(e) => handleChange('parentEmail', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="parent@example.com"
                        required
                    />
                </div>
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" /> Address Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Residential Address</label>
                        <textarea
                            value={data.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            rows="2"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="#123, Street Name, City"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City / District</label>
                        <input
                            type="text"
                            value={data.city || ''}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pincode</label>
                        <input
                            type="text"
                            value={data.pincode || ''}
                            onChange={(e) => handleChange('pincode', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Step1_Personal;
