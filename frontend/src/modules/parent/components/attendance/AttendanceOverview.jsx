
import React from 'react';
import { PieChart } from 'lucide-react';

const AttendanceOverview = ({ data }) => {
    const isLow = data.overall < data.required;

    return (
        <div className={`p-5 rounded-2xl text-white shadow-lg ${isLow ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-200' : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200'}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wide opacity-80">Overall Attendance</span>
                    <h2 className="text-4xl font-extrabold mt-1">{data.overall}%</h2>
                </div>
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <PieChart size={24} className="text-white" />
                </div>
            </div>

            <div className="h-1.5 w-full bg-black/20 rounded-full mt-4 mb-4 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${data.overall}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                    <span className="block text-lg font-bold">{data.presentDays}</span>
                    <span className="text-[10px] uppercase font-bold opacity-70">Days Present</span>
                </div>
                <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                    <span className="block text-lg font-bold">{data.totalDays}</span>
                    <span className="text-[10px] uppercase font-bold opacity-70">Working Days</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceOverview;
