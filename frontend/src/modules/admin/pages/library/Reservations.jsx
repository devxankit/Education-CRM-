import React, { useState, useEffect } from 'react';
import { Bookmark, Search, Clock, User, Book as BookIcon, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { format } from 'date-fns';

const LibraryReservations = () => {
    const { 
        reservations, fetchReservations, // Note: I need to add fetchReservations to store if missing
        branches, fetchBranches
    } = useAdminStore();

    const [branchId, setBranchId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branchId) {
            // fetchReservations({ branchId }); // Placeholder, check store
        }
    }, [branchId]);

    return (
        <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg ring-4 ring-amber-50">
                            <Bookmark size={24} />
                        </div>
                        Reservations
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Manage book holds for unavailable titles.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by book or member..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 transition-all outline-none text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select 
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 transition-all outline-none text-sm font-bold"
                    >
                        <option value="">Select Branch</option>
                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Reservations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Empty State for now until backend integration is verified */}
                <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-4">
                        <Clock size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Queue is Clear</h3>
                    <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium">There are currently no active book reservations in the system.</p>
                </div>
            </div>
        </div>
    );
};

export default LibraryReservations;
