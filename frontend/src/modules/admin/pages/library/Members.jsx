import React from 'react';
import { Users, UserPlus, Mail, Calendar } from 'lucide-react';
import LibraryStats from './components/LibraryStats';
import { mockMembers, libraryStats } from '../../data/libraryData';

const LibraryMembers = () => {
    const stats = [
        { label: 'Total Members', value: libraryStats.totalMembers, icon: Users, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
        { label: 'Student Members', value: '720', icon: Users, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'Staff Members', value: '130', icon: Users, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
        { label: 'New This Month', value: '25', icon: UserPlus, bgColor: 'bg-green-50', iconColor: 'text-green-600' }
    ];

    return (
        <div className="flex flex-col pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Library Members</h1>
                    <p className="text-gray-500 text-sm">Manage students and staff registered for library services.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium transition-all">
                    <UserPlus size={18} /> Register Member
                </button>
            </div>

            <LibraryStats stats={stats} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Member Registry</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Member Name</th>
                                <th className="px-6 py-4 font-semibold">Member ID</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Joined Date</th>
                                <th className="px-6 py-4 font-semibold text-center">Active Loans</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{member.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{member.memberId}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${member.role === 'Teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm flex items-center gap-2">
                                        <Mail size={14} /> {member.email}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {member.joined}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`font-semibold ${member.activeLoans > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            {member.activeLoans}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-indigo-600 transition-colors">View Card</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LibraryMembers;
