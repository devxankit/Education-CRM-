import React from 'react';
import { BookOpen, UserCheck, Calendar, AlertCircle } from 'lucide-react';
import LibraryStats from './components/LibraryStats';
import { mockIssuance, libraryStats } from '../../data/libraryData';

const BookIssuance = () => {
    const stats = [
        { label: 'Active Loans', value: libraryStats.activeLoans, icon: BookOpen, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'Returned Today', value: '18', icon: UserCheck, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { label: 'Overdue Books', value: libraryStats.overdueBooks, icon: AlertCircle, bgColor: 'bg-red-50', iconColor: 'text-red-600' },
        { label: 'Due Today', value: '12', icon: Calendar, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Issued': return 'bg-blue-100 text-blue-700';
            case 'Returned': return 'bg-green-100 text-green-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Book Issuance</h1>
                    <p className="text-gray-500 text-sm">Track book lending, returns, and overdue status.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium transition-all">
                    <BookOpen size={18} /> Issue New Book
                </button>
            </div>

            <LibraryStats stats={stats} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-all font-medium">All</button>
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-all font-medium text-blue-600">Issued</button>
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-all font-medium text-red-600">Overdue</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Book Title</th>
                                <th className="px-6 py-4 font-semibold">Member Name</th>
                                <th className="px-6 py-4 font-semibold">Member ID</th>
                                <th className="px-6 py-4 font-semibold">Issue Date</th>
                                <th className="px-6 py-4 font-semibold">Due Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockIssuance.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{record.bookTitle}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{record.memberName}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{record.memberId}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{record.issueDate}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm font-medium">{record.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-600 hover:text-indigo-600 font-medium text-sm">Return</button>
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

export default BookIssuance;
