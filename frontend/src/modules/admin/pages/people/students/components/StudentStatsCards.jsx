
import React from 'react';
import { Users, UserPlus, UserCheck, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';

const StudentStatsCards = () => {
    const students = useAdminStore(state => state.students);

    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const inactiveStudents = students.filter(s => s.status === 'Inactive' || s.status === 'Leaver').length;
    // Assuming new admissions are students added in last 30 days or just a placeholder for now
    const newAdmissions = students.filter(s => {
        const createdAt = s.createdAt ? new Date(s.createdAt) : new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt > thirtyDaysAgo;
    }).length;

    const stats = [
        { title: 'Total Students', value: totalStudents.toLocaleString(), change: 'Total', icon: Users, color: 'blue' },
        { title: 'New Admissions', value: newAdmissions.toLocaleString(), change: 'Last 30d', icon: UserPlus, color: 'green' },
        { title: 'Active', value: activeStudents.toLocaleString(), change: `${totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}%`, icon: UserCheck, color: 'indigo' },
        { title: 'Inactive / Leavers', value: inactiveStudents.toLocaleString(), change: 'Total', icon: AlertCircle, color: 'red' }
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
