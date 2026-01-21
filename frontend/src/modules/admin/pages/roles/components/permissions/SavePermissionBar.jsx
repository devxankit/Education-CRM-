
import React from 'react';
import { Save, RotateCcw, ShieldCheck } from 'lucide-react';

const SavePermissionBar = ({ onSave, onReset, hasChanges, loading }) => {
    return (
        <div className={`
            sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-xl z-40 transform transition-transform duration-300
            ${hasChanges ? 'translate-y-0' : 'translate-y-full opacity-0 pointer-events-none'}
        `}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Unsaved permission changes detected
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw size={16} /> Reset
                    </button>

                    <button
                        onClick={onSave}
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors disabled:opacity-70"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <ShieldCheck size={18} /> Publish New Policy
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SavePermissionBar;
