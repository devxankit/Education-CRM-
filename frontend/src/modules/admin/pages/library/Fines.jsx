import React, { useState, useEffect } from 'react';
import { IndianRupee, Search, Filter, Calendar, User, Book as BookIcon, CheckCircle, Clock, AlertTriangle, CreditCard, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { API_URL } from '@/app/api';

const LibraryFines = () => {
    const { 
        libraryFines, fetchLibraryFines,
        branches, fetchBranches
    } = useAdminStore();

    const [branchId, setBranchId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branchId) {
            fetchLibraryFines({ branchId });
        }
    }, [branchId, fetchLibraryFines]);

    const handleCollectFine = async (fineId) => {
        if (!window.confirm("Mark this fine as paid?")) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/library/fines/collect`, {
                fineId,
                transactionId: `LIB-${Date.now()}`
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Fine collected successfully");
                fetchLibraryFines({ branchId });
            }
        } catch (error) {
            toast.error("Failed to collect fine");
        }
    };

    const filteredFines = libraryFines.filter(fine => {
        const memberName = fine.memberId?.memberType === 'student' 
            ? `${fine.memberId?.studentId?.firstName} ${fine.memberId?.studentId?.lastName}` 
            : `${fine.memberId?.teacherId?.firstName} ${fine.memberId?.teacherId?.lastName}`;
        return memberName.toLowerCase().includes(searchTerm.toLowerCase()) || fine.memberId?.libraryCardNo.includes(searchTerm);
    });

    const totalUnpaid = filteredFines.filter(f => f.status === 'unpaid').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <div className="p-2 bg-rose-600 text-white rounded-xl shadow-lg ring-4 ring-rose-50">
                            <IndianRupee size={24} />
                        </div>
                        Fines & Penalties
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Track overdue fees and penalty payments.</p>
                </div>
                <div className="flex items-center gap-4 bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Total Outstanding</div>
                        <div className="text-2xl font-black text-rose-600">₹{totalUnpaid}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by member name or card no..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-rose-500 transition-all outline-none text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select 
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-rose-500 transition-all outline-none text-sm font-bold"
                    >
                        <option value="">Select Branch</option>
                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Fines Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Member details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Late Return Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredFines.length > 0 ? (
                                filteredFines.map((fine) => {
                                    const memberName = fine.memberId?.memberType === 'student' 
                                        ? `${fine.memberId?.studentId?.firstName} ${fine.memberId?.studentId?.lastName}` 
                                        : `${fine.memberId?.teacherId?.firstName} ${fine.memberId?.teacherId?.lastName}`;
                                    
                                    return (
                                        <tr key={fine._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400">
                                                        {memberName ? memberName[0] : '?'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-gray-900 uppercase">{memberName}</div>
                                                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">#{fine.memberId?.libraryCardNo}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="text-[11px] font-black text-gray-600 flex items-center gap-1.5 uppercase">
                                                        <BookIcon size={12} className="text-indigo-400" /> Book ID: {fine.issueId?.bookId?.title || 'N/A'}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase">
                                                        <Calendar size={12} /> Due: {fine.issueId?.dueDate ? format(new Date(fine.issueId.dueDate), 'dd MMM yyyy') : 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="text-lg font-black text-gray-900">₹{fine.amount}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">System Generated</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                    fine.status === 'paid' 
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                        : 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse'
                                                }`}>
                                                    {fine.status === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                    {fine.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {fine.status === 'unpaid' ? (
                                                    <button 
                                                        onClick={() => handleCollectFine(fine._id)}
                                                        className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
                                                    >
                                                        Collect Fine
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2 text-emerald-600 font-bold text-[10px] uppercase">
                                                        <CreditCard size={14} /> Paid
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No penalty records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LibraryFines;
