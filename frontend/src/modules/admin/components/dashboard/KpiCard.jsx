
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const KpiCard = ({ label, value, icon: Icon, link, color = 'bg-blue-500' }) => {
    return (
        <Link
            to={link}
            className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2 font-mono tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
                    {/* The icon color should match the bg but darker. 
                        Simplified utility: we assume 'color' is like 'bg-blue-500'. 
                        We can use specific classes or passed className.
                        I'll use a standardized look: Indigo icon on Indigo bg. 
                    */}
                    <Icon size={24} className="text-indigo-600" />
                </div>
            </div>

            <div className="mt-4 flex items-center text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                View Details <ArrowUpRight size={14} className="ml-1" />
            </div>
        </Link>
    );
};

export default KpiCard;
