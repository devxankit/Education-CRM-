import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-50 text-primary">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">{value}</p>
        </div>
    </div>
);

const ClassInfoCard = ({ info }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] mb-6 relative overflow-hidden"
        >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8"></div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 relative z-10 text-left">
                <InfoItem icon={GraduationCap} label="Class & Section" value={`${info.className} - ${info.section}`} />
                <InfoItem icon={Calendar} label="Academic Year" value={info.academicYear} />
                <InfoItem icon={BookOpen} label="Medium" value={info.medium} />
                {info.stream && <InfoItem icon={GraduationCap} label="Stream" value={info.stream} />}
            </div>
        </motion.div>
    );
};

export default ClassInfoCard;
