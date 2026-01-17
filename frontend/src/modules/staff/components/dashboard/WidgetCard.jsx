
import React from 'react';
import { ChevronRight } from 'lucide-react';

const WidgetCard = ({ title, count, subtitle, icon: Icon, colorClass, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group h-auto md:h-full flex flex-col justify-between"
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${colorClass || 'bg-gray-100 text-gray-600'}`}>
                    {Icon && <Icon size={18} className="md:w-5 md:h-5" strokeWidth={2} />}
                </div>
                {count > 0 && (
                    <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
            </div>

            <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {count}
                </h3>
                <p className="text-xs md:text-sm font-semibold text-gray-700 mt-0.5 line-clamp-1">{title}</p>
                {subtitle && (
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1 flex items-center gap-1 line-clamp-1">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default WidgetCard;
