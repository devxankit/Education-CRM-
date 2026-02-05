
import React from 'react';
import { PieChart, Book, Award } from 'lucide-react';

const AcademicSnapshot = ({ data, onItemClick }) => {
    return (
        <div className="px-4 mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Academic Snapshot</h3>
            <div className="grid grid-cols-3 gap-3">
                {/* Attendance */}
                <div
                    onClick={() => onItemClick('attendance')}
                    className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-100 active:scale-95 transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 mb-2 flex items-center justify-center">
                        <PieChart size={16} />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900">{data?.attendance ?? 0}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Attendance</span>
                </div>

                {/* Homework */}
                <div
                    onClick={() => onItemClick('homework')}
                    className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-100 active:scale-95 transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 mb-2 flex items-center justify-center">
                        < Book size={16} />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900">{data?.homeworkPending > 0 ? `${data.homeworkPending}` : '0'}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Pending HW</span>
                </div>

                {/* Result */}
                <div
                    onClick={() => onItemClick('result')}
                    className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-100 active:scale-95 transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 mb-2 flex items-center justify-center">
                        <Award size={16} />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900">{data?.lastResult?.marks || 'N/A'}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{data?.lastResult?.subject || 'Results'}</span>
                </div>
            </div>
        </div>
    );
};

export default AcademicSnapshot;
