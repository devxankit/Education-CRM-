import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, FileText, Calendar, Filter, ArrowUpRight, ArrowDownRight, Book } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';

const LibraryReports = () => {
    const { branches, fetchBranches } = useAdminStore();
    const [branchId, setBranchId] = useState('');

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const reportCards = [
        { title: 'Circulation Report', desc: 'Books issued vs returned trend.', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Inventory Analysis', desc: 'Category-wise book distribution.', icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Fine Collection', desc: 'Monthly penalty revenue data.', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
        { title: 'Member Engagement', desc: 'Top readers and active members.', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' }
    ];

    return (
        <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg ring-4 ring-indigo-50">
                            <BarChart3 size={24} />
                        </div>
                        Library Intelligence
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Business analytics and operational reports.</p>
                </div>
                <div className="w-full md:w-64">
                    <select 
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 transition-all outline-none text-sm font-bold shadow-sm"
                    >
                        <option value="">All Branches</option>
                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Quick Stats Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <TrendingUp size={80} />
                    </div>
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Circulation</div>
                    <div className="text-3xl font-black text-gray-900">1,240</div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                        <ArrowUpRight size={14} /> +12% from last month
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Book size={80} />
                    </div>
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Most Borrowed Book</div>
                    <div className="text-xl font-black text-gray-900 uppercase">Java Fundamentals</div>
                    <div className="mt-2 text-xs font-bold text-indigo-500 uppercase tracking-tight">42 Issues this week</div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <ArrowDownRight size={80} />
                    </div>
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Fines Collected</div>
                    <div className="text-3xl font-black text-emerald-600 font-mono">₹14,250</div>
                    <div className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-tight">Across all branches</div>
                </div>
            </div>

            {/* Report Generator Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportCards.map((report, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-indigo-500 transition-all group cursor-pointer">
                        <div className="flex items-center gap-5">
                            <div className={`p-4 ${report.bg} ${report.color} rounded-2xl`}>
                                <report.icon size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{report.title}</h3>
                                <p className="text-gray-400 text-sm">{report.desc}</p>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Download size={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LibraryReports;
