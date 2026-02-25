import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Plus, Search, Filter, Settings,
    MoreHorizontal, MapPin, Users, Bed, CheckCircle,
    XCircle, AlertTriangle, Edit, Trash2
} from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';
import { useAppStore } from '../../../../../store';

const HostelList = () => {
    const navigate = useNavigate();
    const { fetchHostels, hostels, fetchBranches, branches } = useAdminStore();
    const user = useAppStore(state => state.user);

    const [searchTerm, setSearchTerm] = useState('');
    // Default to "All Branches"
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initial fetch
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        const loadHostels = async () => {
            setLoading(true);
            await fetchHostels(selectedBranch);
            setLoading(false);
        };
        loadHostels();
    }, [selectedBranch, fetchHostels]);

    // Filtering logic
    const filteredHostels = hostels?.filter(hostel => {
        const matchesSearch =
            hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hostel.code.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    }) || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Hostel Management</h1>
                    <p className="text-sm text-gray-500">Manage residential blocks, room allocation, and warden assignments.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin/operations/hostel-config')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-bold flex items-center gap-2 transition-all shadow-sm"
                    >
                        <Settings size={18} />
                        <span className="hidden md:inline">Settings</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/operations/hostels/add')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold flex items-center gap-2 shadow-lg transition-all"
                    >
                        <Plus size={18} />
                        <span>Add New Hostel</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <Filter size={16} className="text-gray-500" />
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                        >
                            <option value="all">All Branches</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* List Grid */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredHostels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {filteredHostels.map((hostel) => (
                        <div key={hostel._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl ${hostel.type === 'Boys' ? 'bg-blue-50 text-blue-600' : hostel.type === 'Girls' ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'}`}>
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 line-clamp-1">{hostel.name}</h3>
                                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{hostel.code}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(hostel.status)}`}>
                                        {hostel.status}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><MapPin size={14} /> Branch</span>
                                        {/* Find branch name - assuming branchId is populated or we find it from store */}
                                        <span className="font-bold text-gray-700">
                                            {branches.find(b => b._id === (hostel.branchId?._id || hostel.branchId))?.name || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><Bed size={14} /> Capacity</span>
                                        <span className="font-bold text-gray-700">
                                            {/* Sum of buildings caps if we had it, or just placeholder/count */}
                                            {hostel.rooms?.reduce((acc, r) => acc + r.capacity, 0) || 'N/A'} Beds
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><Building2 size={14} /> Total Rooms</span>
                                        <span className="font-bold text-gray-700">{hostel.rooms?.length || 0} Rooms</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><Users size={14} /> Buildings</span>
                                        <span className="font-bold text-gray-700">{hostel.buildings?.length || 0} Blocks</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {/* Warden Avatars Mock */}
                                        {hostel.buildings?.slice(0, 3).map((b, i) => (
                                            <div key={i} title={b.wardenId?.firstName ? `${b.wardenId.firstName} ${b.wardenId.lastName}` : 'Unassigned'} className="h-8 w-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700 uppercase cursor-help">
                                                {b.wardenId?.firstName ? b.wardenId.firstName.charAt(0) : '?'}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/admin/operations/hostels/view/${hostel._id}`)}
                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                    >
                                        Manage <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 pb-20">
                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                        <Building2 size={32} />
                    </div>
                    <p className="font-bold text-gray-600">No Hostels Found</p>
                    <p className="text-sm mb-6">Get started by creating your first hostel block.</p>
                    <button
                        onClick={() => navigate('/admin/operations/hostels/add')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold"
                    >
                        Add Hostel
                    </button>
                </div>
            )}
        </div>
    );
};

export default HostelList;
