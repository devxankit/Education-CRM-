import React from 'react';
import { Gavel, Wallet, CreditCard, AlertTriangle } from 'lucide-react';
import LibraryStats from './components/LibraryStats';
import { mockFines } from '../../data/libraryData';

const LibraryFines = () => {
    const stats = [
        { label: 'Total Fines Logged', value: '₹1,250', icon: Gavel, bgColor: 'bg-red-50', iconColor: 'text-red-600' },
        { label: 'Collected', value: '₹840', icon: Wallet, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { label: 'Pending Payment', value: '₹410', icon: AlertTriangle, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
        { label: 'Active Disputes', value: '3', icon: CreditCard, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' }
    ];

    return (
        <div className="flex flex-col pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Fine & Penalties</h1>
                    <p className="text-gray-500 text-sm">Configure and track overdue fines and library rule penalties.</p>
                </div>
            </div>

            <LibraryStats stats={stats} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Fine Records</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Member Name</th>
                                <th className="px-6 py-4 font-semibold">Book Title</th>
                                <th className="px-6 py-4 font-semibold">Reason</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockFines.map((fine) => (
                                <tr key={fine.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{fine.memberName}</td>
                                    <td className="px-6 py-4 text-gray-600">{fine.bookTitle}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{fine.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900">₹{fine.amount.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{fine.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${fine.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {fine.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className={`font-medium text-sm ${fine.status === 'Paid' ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-900'}`}>
                                            Collect
                                        </button>
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

export default LibraryFines;
