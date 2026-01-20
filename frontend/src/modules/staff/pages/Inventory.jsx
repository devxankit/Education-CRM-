import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { Search, Plus, ArrowLeft, Package, AlertCircle } from 'lucide-react';

const MOCK_INVENTORY = [
    { id: 'INV-001', name: 'Whiteboard Marker (Pack)', category: 'Stationery', qty: 45, reorder: 10, status: 'Available' },
    { id: 'INV-002', name: 'A4 Paper Reams', category: 'Stationery', qty: 5, reorder: 20, status: 'Low Stock' },
    { id: 'INV-003', name: 'HCL Acid (500ml)', category: 'Science Lab', qty: 2, reorder: 5, status: 'Low Stock' },
    { id: 'INV-004', name: 'Football (Training)', category: 'Sports', qty: 12, reorder: 10, status: 'Available' },
];

const Inventory = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCat, setFilterCat] = useState('All');

    // Access: Transport/Admin/Accounts (View)
    const canEdit = [STAFF_ROLES.TRANSPORT, STAFF_ROLES.ADMIN].includes(user?.role); // Simplified: Using Transport/Admin as "Operations"

    // Note: In real setup, maybe 'Store Manager' role exists. For now, defaulting to Transport/Admin as operations lead.

    const filteredItems = MOCK_INVENTORY.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = filterCat === 'All' || i.category === filterCat;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/staff/assets')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Inventory Store</h1>
                            <p className="text-xs text-gray-500">Consumables & Supplies</p>
                        </div>
                    </div>
                    {canEdit && (
                        <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-indigo-700 shadow-sm">
                            <Plus size={16} /> Add Item
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search item..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <select
                        value={filterCat}
                        onChange={(e) => setFilterCat(e.target.value)}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Science Lab">Science Lab</option>
                        <option value="Sports">Sports</option>
                    </select>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-4">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer active:scale-95">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.qty <= item.reorder ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                <Package size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                                <p className="text-xs text-gray-500">{item.category}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                                {item.qty <= item.reorder && <AlertCircle size={14} className="text-red-500" />}
                                <span className={`text-lg font-bold ${item.qty <= item.reorder ? 'text-red-600' : 'text-gray-900'}`}>{item.qty}</span>
                            </div>
                            <p className="text-[10px] text-gray-400">Available Units</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inventory;
