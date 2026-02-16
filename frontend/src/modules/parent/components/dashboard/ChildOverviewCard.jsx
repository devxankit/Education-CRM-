
import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const ChildOverviewCard = ({ child }) => {
    // Determine status color/icon
    const isGood = child?.status === 'On Track';
    const isWarn = child?.status === 'Attention Needed';

    return (
        <div className="px-4 mb-2">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block px-2 py-1 rounded-lg bg-white/20 text-xs font-bold backdrop-blur-sm mb-2 text-indigo-50">
                            Current Status
                        </span>
                        <h2 className="text-2xl font-bold">{child?.status || 'Loading...'}</h2>
                    </div>
                    <div className={`p-2 rounded-full ${isGood ? 'bg-green-400/20' : isWarn ? 'bg-yellow-400/20' : 'bg-red-400/20'}`}>
                        {isGood ? <CheckCircle size={24} className="text-green-300" /> : <AlertCircle size={24} className="text-yellow-300" />}
                    </div>
                </div>

                <p className="text-sm text-indigo-100 font-medium leading-relaxed opacity-90">
                    {isGood
                        ? `${child?.name || 'Student'} is performing well. Keep it up!`
                        : `${child?.name || 'Student'} needs your attention in specific areas.`}
                </p>
            </div>
        </div>
    );
};

export default ChildOverviewCard;
