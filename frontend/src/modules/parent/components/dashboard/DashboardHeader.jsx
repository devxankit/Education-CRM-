
import React from 'react';
import { Bell } from 'lucide-react';

const DashboardHeader = ({ parentName, onNotificationClick }) => {
    return (
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Parent Portal</h1>
                <p className="text-xs font-semibold text-gray-500">Hello, {parentName}</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onNotificationClick}
                    className="relative p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                    RV
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
