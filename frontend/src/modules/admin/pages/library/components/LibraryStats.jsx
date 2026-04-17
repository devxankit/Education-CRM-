import React from 'react';

const LibraryStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor || 'bg-indigo-50'}`}>
                        <stat.icon className={`w-6 h-6 ${stat.iconColor || 'text-indigo-600'}`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LibraryStats;
