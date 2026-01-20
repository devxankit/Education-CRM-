import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { Search, Plus, Monitor, Truck, Box, Filter, AlertCircle, CheckCircle, Package } from 'lucide-react';

const MOCK_ASSETS = [
    { id: 'AST-001', name: 'School Bus 01', type: 'Vehicle', code: 'BUS-01', location: 'Parking A', condition: 'Good', status: 'Active' },
    { id: 'AST-002', name: 'Computer Lab PC-04', type: 'IT', code: 'IT-PC-04', location: 'Lab 1', condition: 'Needs Repair', status: 'Active' },
    { id: 'AST-003', name: 'Staff Room Sofa', type: 'Furniture', code: 'FUR-SF-02', location: 'Staff Room', condition: 'Good', status: 'Active' },
    { id: 'AST-004', name: 'Projector Hall A', type: 'Equipment', code: 'EQ-PR-01', location: 'Hall A', condition: 'Out of Service', status: 'Inactive' },
];

const Assets = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Access: Transport (Full), Admin (Full), Accounts (View)
    const canEdit = [STAFF_ROLES.TRANSPORT, STAFF_ROLES.ADMIN].includes(user?.role);
    const hasAccess = canEdit || user?.role === STAFF_ROLES.ACCOUNTS;

    if (!hasAccess) return <AccessDenied />;

    const filteredAssets = MOCK_ASSETS.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || a.type === filterType;
        return matchesSearch && matchesType;
    });

    const getConditionColor = (cond) => {
        switch (cond) {
            case 'Good': return 'text-green-600 bg-green-50 border-green-200';
            case 'Needs Repair': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Out of Service': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Fixed Assets</h1>
                        <p className="text-xs text-gray-500">Track institutional property</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/staff/inventory')}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors hidden md:flex items-center gap-2"
                        >
                            <Package size={16} /> Go to Inventory
                        </button>
                        {canEdit && (
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm">
                                <Plus size={16} /> Add Asset
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search asset name or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Types</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="IT">IT & Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Equipment">Equipment</option>
                    </select>
                </div>
            </div>

            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssets.map(asset => (
                    <div
                        key={asset.id}
                        onClick={() => navigate(`/staff/assets/${asset.id}`)}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    {asset.type === 'Vehicle' ? <Truck size={20} /> :
                                        asset.type === 'IT' ? <Monitor size={20} /> : <Box size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{asset.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono">{asset.code}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getConditionColor(asset.condition)}`}>
                                {asset.condition}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 mt-2">
                            <div>
                                <span className="block font-bold text-gray-400 uppercase text-[10px]">Location</span>
                                <span className="text-gray-900 font-medium">{asset.location}</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-gray-400 uppercase text-[10px]">Type</span>
                                <span className="text-gray-900 font-medium">{asset.type}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400"><AlertCircle size={32} /></div>
        <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-500 mt-2">You do not have permission to access Assets.</p>
    </div>
);

export default Assets;
