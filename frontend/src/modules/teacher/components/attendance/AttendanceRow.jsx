import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

const AttendanceRow = ({ student, status, onStatusChange, disabled }) => {
    const statusConfig = {
        'Present': { color: 'bg-green-100 text-green-700 border-green-200', icon: Check },
        'Absent': { color: 'bg-red-50 text-red-600 border-red-200', icon: X },
        'Leave': { color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
    };

    return (
        <div className="flex items-center justify-between gap-3 p-3 bg-white border border-gray-100 rounded-xl mb-2 hover:border-indigo-100 transition-all">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden" title={student.roll}>
                    {student.roll?.length <= 6 ? student.roll : (student.roll?.slice(-6) || '—')}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">{student.name}</h4>
                    <span className="text-[10px] font-medium text-gray-400">{student.admissionNo ? `Adm: ${student.admissionNo}` : (student.id ? `#${String(student.id).slice(-6)}` : '')}</span>
                </div>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200 shrink-0">
                {['Present', 'Absent', 'Leave'].map((s) => {
                    const isActive = status === s;
                    const config = statusConfig[s];
                    const Icon = config.icon;
                    return (
                        <motion.button
                            key={s}
                            type="button"
                            whileTap={disabled ? {} : { scale: 0.95 }}
                            onClick={() => !disabled && onStatusChange(student.id, s)}
                            className={`flex-1 min-w-[2rem] py-2 px-1.5 rounded-md transition-all flex items-center justify-center gap-0.5 ${isActive ? config.color + ' shadow-sm border border-transparent' : 'text-gray-400 hover:bg-gray-200/80 hover:text-gray-600'} ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                        >
                            <Icon size={14} strokeWidth={2.5} className="shrink-0" />
                            <span className="text-[10px] font-bold uppercase">{s.charAt(0)}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendanceRow;
