
import React from 'react';
import { Users, UserPlus, UserCheck, AlertCircle } from 'lucide-react';

const StudentStatsCards = () => {

    const stats = [
        { title: 'Total Students', value: '2,845', change: '+12%', icon: Users, color: 'blue' },
        { title: 'New Admissions', value: '142', change: '+5%', icon: UserPlus, color: 'green' },
        { title: 'Active', value: '2,780', change: '98%', icon: UserCheck, color: 'indigo' },
        { title: 'Inactive / Leavers', value: '65', change: '-2%', icon: AlertCircle, color: 'red' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stat.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                            <Icon size={24} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StudentStatsCards;
