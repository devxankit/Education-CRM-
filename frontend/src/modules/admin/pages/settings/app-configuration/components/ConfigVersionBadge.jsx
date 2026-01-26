import React from 'react';
import { ShieldCheck, GitCommit } from 'lucide-react';

const ConfigVersionBadge = ({ version, lastUpdated }) => {
    return (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                <GitCommit size={14} />
                <span>v{version}.0</span>
            </div>
            <div className="w-px h-3 bg-indigo-200"></div>
            <div className="text-[10px] text-indigo-600 font-medium whitespace-nowrap">
                Last updated: {lastUpdated}
            </div>
        </div>
    );
};

export default ConfigVersionBadge;
