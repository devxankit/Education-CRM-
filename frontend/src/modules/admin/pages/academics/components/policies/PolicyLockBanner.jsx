
import React from 'react';
import { Lock, Unlock, AlertTriangle } from 'lucide-react';

const PolicyLockBanner = ({ isLocked, onLock, onUnlock }) => {

    if (!isLocked) {
        return (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle size={20} className="animate-pulse" />
                    <span className="font-semibold text-sm">Policy is in Draft / Open Mode</span>
                    <span className="hidden md:inline text-xs text-amber-600 ml-2">Changes apply immediately to creating exams.</span>
                </div>
                <button
                    onClick={onLock}
                    className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold uppercase rounded hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Lock size={14} /> Lock & Publish
                </button>
            </div>
        );
    }

    return (
        <div className="bg-indigo-900 border-b border-indigo-700 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-md">
            <div className="flex items-center gap-3 text-white">
                <div className="p-1 bg-white/20 rounded">
                    <Lock size={18} />
                </div>
                <div>
                    <span className="font-bold text-sm block">Policy is Locked</span>
                    <span className="text-[10px] text-indigo-300">Version 1.0 • No changes allowed without unlocking.</span>
                </div>
            </div>
            <button
                onClick={onUnlock}
                className="flex items-center gap-2 px-4 py-1.5 bg-white/10 text-indigo-100 border border-white/20 text-xs font-bold uppercase rounded hover:bg-white/20 transition-colors"
            >
                <Unlock size={14} /> Request Unlock
            </button>
        </div>
    );
};

export default PolicyLockBanner;
