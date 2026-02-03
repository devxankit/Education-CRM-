
import React from 'react';
import { Lock, Unlock, Save, ShieldAlert, Loader2 } from 'lucide-react';

const RuleLockBanner = ({ isLocked, onToggleLock, onSave, hasActiveSession, loading }) => {
    return (
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-sm mb-6 -mx-6 md:-mx-8 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Timetable Construction Rules</h1>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    {hasActiveSession && (
                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            <ShieldAlert size={12} /> Active Session Running
                        </span>
                    )}
                    <span>Version 1.0</span>
                    <span>•</span>
                    <span>Last Updated: 2 days ago</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleLock}
                    disabled={loading}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border
                        ${isLocked
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : (isLocked ? <Unlock size={16} /> : <Lock size={16} />)}
                    {isLocked ? 'Unlock Rules' : 'Lock Rules'}
                </button>

                <button
                    onClick={onSave}
                    disabled={isLocked || loading}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default RuleLockBanner;
