import React from 'react';
import { BookmarkCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import LibraryStats from './components/LibraryStats';
import { mockReservations, libraryStats } from '../../data/libraryData';

const BookReservations = () => {
    const stats = [
        { label: 'Total Reservations', value: libraryStats.reservations, icon: BookmarkCheck, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
        { label: 'Pending', value: '14', icon: Clock, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
        { label: 'Available', value: '8', icon: CheckCircle2, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { label: 'Cancelled', value: '2', icon: XCircle, bgColor: 'bg-red-50', iconColor: 'text-red-600' }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Book Reservations</h1>
                    <p className="text-gray-500 text-sm">View and manage book reservation requests from members.</p>
                </div>
            </div>

            <LibraryStats stats={stats} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Pending & Active Reservations</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Book Title</th>
                                <th className="px-6 py-4 font-semibold">Member Name</th>
                                <th className="px-6 py-4 font-semibold">Request Date</th>
                                <th className="px-6 py-4 font-semibold">Expiry Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockReservations.map((res) => (
                                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{res.bookTitle}</td>
                                    <td className="px-6 py-4 text-gray-600">{res.memberName}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{res.reservationDate}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{res.expiryDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {res.status === 'Available' && (
                                                <button className="text-green-600 hover:text-green-700 text-sm font-medium">Issue Now</button>
                                            )}
                                            <button className="text-gray-400 hover:text-red-600 text-sm font-medium transition-colors">Cancel</button>
                                        </div>
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

export default BookReservations;
