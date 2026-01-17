import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

const AttendanceRow = ({ student, status, onStatusChange }) => {
    const statusConfig = {
        'Present': { color: 'bg-green-100 text-green-700 border-green-200', icon: Check },
        'Absent': { color: 'bg-red-50 text-red-600 border-red-200', icon: X },
        'Leave': { color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
    };

    return (
        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl mb-2 hover:border-gray-200 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center text-gray-500">
                    {student.roll}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{student.name}</h4>
                    <span className="text-[10px] font-medium text-gray-400">ID: {student.id}</span>
                </div>
            </div>

            <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                {['Present', 'Absent', 'Leave'].map((s) => {
                    const isActive = status === s;
                    const config = statusConfig[s];

                    return (
                        <motion.button
                            key={s}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onStatusChange(student.id, s)}
                            className={`p-1.5 rounded-md transition-all relative ${isActive ? config.color + ' shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {/* <config.icon size={16} strokeWidth={2.5} /> */}
                            <span className={`text-[10px] font-bold px-1 ${isActive ? '' : 'hidden'}`}>{s.charAt(0)}</span>
                            <span className={`${isActive ? 'hidden' : 'block px-1 font-medium text-[10px]'}`}>{s.charAt(0)}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendanceRow;
