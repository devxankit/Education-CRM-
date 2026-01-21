
import React, { useState } from 'react';
import { Plus, Download, Filter, Search } from 'lucide-react';

// Components
import AssetsTable from './components/assets-master/AssetsTable';
import AssetDetailDrawer from './components/assets-master/AssetDetailDrawer';

const AssetsMaster = () => {

    // Mock Data
    const [assets, setAssets] = useState([
        { id: 1, name: 'Dell Latitude 3420', code: 'AST-1001', category: 'IT Assets', serialNumber: 'DL-882923', status: 'Available', location: 'Storage A', value: 850, model: 'Latitude 3420', purchaseDate: '2023-01-15' },
        { id: 2, name: 'Projector Epson', code: 'AST-2042', category: 'IT Assets', serialNumber: 'EP-112233', status: 'Under Maintenance', location: 'Classroom 5B', value: 450, model: 'E-500', purchaseDate: '2022-05-10' },
        { id: 3, name: 'Office Chair', code: 'AST-3001', category: 'Furniture', serialNumber: '', status: 'Assigned', location: 'Admin Block', assignedTo: 'John Smith', value: 120, model: 'Ergo-X', purchaseDate: '2023-11-20' },
        { id: 4, name: 'MacBook Pro 14', code: 'AST-1005', category: 'IT Assets', serialNumber: 'C02-XYZ', status: 'Assigned', location: 'Staff Room', assignedTo: 'Sarah Connor', value: 2100, model: 'M2 Pro', purchaseDate: '2024-02-01' },
    ]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Handlers
    const handleAdd = () => {
        setEditingAsset(null); // New
        setIsDrawerOpen(true);
    };

    const handleView = (asset) => {
        setEditingAsset(asset);
        setIsDrawerOpen(true);
    };

    const handleSave = (assetData) => {
        if (editingAsset) {
            // Update
            setAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...assetData, id: a.id } : a));
        } else {
            // Create
            const newId = Date.now();
            setAssets(prev => [...prev, { ...assetData, id: newId }]);
        }
        setIsDrawerOpen(false);
    };

    // Filter Logic
    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Assets Master</h1>
                    <p className="text-gray-500 text-sm">Central registry for tracking physical assets and their lifecycle.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Download size={18} />
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> New Asset
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Assets</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{assets.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Assigned</p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-1">{assets.filter(a => a.status === 'Assigned').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Available</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">{assets.filter(a => a.status === 'Available').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Maintenance</p>
                    <h3 className="text-2xl font-bold text-orange-600 mt-1">{assets.filter(a => a.status === 'Under Maintenance').length}</h3>
                </div>
            </div>

            {/* Table */}
            <AssetsTable
                assets={filteredAssets}
                onView={handleView}
            />

            {/* Detail Drawer */}
            <AssetDetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                asset={editingAsset}
                isNew={!editingAsset}
                onSave={handleSave}
            />

        </div>
    );
};

export default AssetsMaster;
