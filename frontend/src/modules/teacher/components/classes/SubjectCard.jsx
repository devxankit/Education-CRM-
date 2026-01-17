import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Atom, BookOpen, FlaskConical, Globe, Music, Cpu } from 'lucide-react';

const iconMap = {
    'Calculator': Calculator,
    'Atom': Atom,
    'BookOpen': BookOpen,
    'FlaskConical': FlaskConical,
    'Globe': Globe,
    'Music': Music,
    'Cpu': Cpu,
    'default': BookOpen
};

const SubjectCard = ({ subject, onClick }) => {
    const Icon = iconMap[subject.icon] || iconMap['default'];

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${subject.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    {subject.status}
                </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">{subject.name}</h3>
            <p className="text-xs text-gray-400 font-medium mb-4">{subject.code} • {subject.year}</p>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">
                            {/* Avatar placeholder */}
                        </div>
                    ))}
                </div>
                <span className="text-xs text-gray-500 font-medium ml-1">
                    {subject.classCount} Classes Assigned
                </span>
            </div>
        </motion.div>
    );
};

export default SubjectCard;
