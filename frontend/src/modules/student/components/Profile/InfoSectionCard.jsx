import React, { useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Calendar, Droplet, User } from 'lucide-react';
import gsap from 'gsap';

const InfoRow = ({ icon: Icon, label, value, isAddress }) => (
    <div className={`flex items-start gap-4 py-3 border-b border-gray-50 last:border-0 ${isAddress ? 'flex-col sm:flex-row sm:items-start' : ''}`}>
        <div className="p-2 rounded-lg bg-gray-50 text-gray-400 mt-0.5">
            <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-800 break-words leading-relaxed">
                {value || <span className="text-gray-300 italic">Not available</span>}
            </p>
        </div>
    </div>
);

const InfoSectionCard = ({ title, data }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                {title}
            </h3>

            <div className="flex flex-col">
                <InfoRow icon={Calendar} label="Date of Birth" value={data.dob ? new Date(data.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
                <InfoRow icon={User} label="Gender" value={data.gender} />
                <InfoRow icon={Droplet} label="Blood Group" value={data.bloodGroup} />
                <InfoRow icon={Phone} label="Contact Number" value={data.contact} />
                <InfoRow icon={Mail} label="Email Address" value={data.email} />
                <InfoRow icon={MapPin} label="Permanent Address" value={data.address} isAddress />
            </div>

        </div>
    );
};

export default InfoSectionCard;
