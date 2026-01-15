import React from 'react';
import { TrendingUp, Award } from 'lucide-react';

const PerformanceCard = ({ data }) => {
    if (!data) return null;

    return (
        <div className="px-4 pb-24 max-w-md mx-auto">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg"></div>

                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <TrendingUp size={16} />
                            <span className="text-xs font-medium tracking-wide text-white/80">WEEKLY PROGRESS</span>
                        </div>
                        <h3 className="text-lg font-bold">You're doing great! 🌟</h3>
                        <p className="text-xs text-white/80 mt-1 max-w-[90%] leading-relaxed">
                            {data.message}
                        </p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Award size={24} className="text-yellow-300" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceCard;
