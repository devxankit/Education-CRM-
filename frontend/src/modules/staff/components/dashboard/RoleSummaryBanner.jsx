
import React from 'react';
import { Shield } from 'lucide-react';
import { ROLE_LABELS } from '../../config/roles';

const RoleSummaryBanner = ({ role, name, description }) => {
    return (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-4 md:p-6 text-white mb-4 md:mb-6 shadow-md border border-slate-700 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-200 border border-white/10">
                        {ROLE_LABELS[role] || role}
                    </span>
                </div>
                <h1 className="text-lg md:text-xl font-bold mb-1 text-white">Welcome, {name.split(' ')[0]}</h1>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl line-clamp-2">{description}</p>
            </div>
            {/* Abstract decorative element */}
            <div className="absolute right-0 top-0 h-full w-24 md:w-48 bg-white/5 -skew-x-12 transform translate-x-8 md:translate-x-16 pointer-events-none"></div>
        </div>
    );
};

export default RoleSummaryBanner;
