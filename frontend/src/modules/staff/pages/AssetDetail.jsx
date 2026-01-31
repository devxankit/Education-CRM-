import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { ArrowLeft, Wrench, Clock, Plus, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

// --- MOCK DATA (Multiple assets for filtering by ID) ---
const MOCK_ASSETS_DATA = [
    {
        id: 'AST-001',
        name: 'School Bus 01',
        type: 'Vehicle',
        code: 'BUS-01',
        location: 'Parking A',
        assignedTo: 'Driver Ramesh',
        purchaseDate: '2020-05-15',
        cost: 2500000,
        condition: 'Good',
        status: 'Active',
        logs: [
            { id: 1, date: '2024-09-01', issue: 'Regular Service', cost: 15000, status: 'Resolved' },
            { id: 2, date: '2024-05-10', issue: 'Tyre Replacement', cost: 45000, status: 'Resolved' },
        ]
    },
    {
        id: 'AST-002',
        name: 'School Bus 02',
        type: 'Vehicle',
        code: 'BUS-02',
        location: 'Parking A',
        assignedTo: 'Driver Sunil',
        purchaseDate: '2021-03-20',
        cost: 2800000,
        condition: 'Good',
        status: 'Active',
        logs: [
            { id: 1, date: '2024-08-15', issue: 'Oil Change', cost: 8000, status: 'Resolved' },
        ]
    },
    {
        id: 'AST-003',
        name: 'Projector - Room 101',
        type: 'Electronics',
        code: 'PROJ-101',
        location: 'Room 101',
        assignedTo: 'IT Department',
        purchaseDate: '2022-01-10',
        cost: 75000,
        condition: 'Fair',
        status: 'Under Maintenance',
        logs: [
            { id: 1, date: '2024-10-01', issue: 'Bulb Replacement', cost: 5000, status: 'Pending' },
        ]
    }
];

const AssetDetail = () => {
    const { assetId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();

    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const canEdit = [STAFF_ROLES.TRANSPORT, STAFF_ROLES.ADMIN].includes(user?.role);

    // Fetch asset data based on ID from URL
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API call - In real app, replace with actual API fetch
        setTimeout(() => {
            const foundAsset = MOCK_ASSETS_DATA.find(a => a.id === assetId);
            if (foundAsset) {
                setAsset(foundAsset);
            } else {
                setError('Asset not found');
            }
            setLoading(false);
        }, 300);
    }, [assetId]);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading asset details...</p>
            </div>
        );
    }

    // Error state
    if (error || !asset) {
        return (
            <div className="max-w-4xl mx-auto p-10 text-center">
                <p className="text-red-600 font-bold">{error || 'Asset not found'}</p>
                <button
                    onClick={() => navigate('/staff/assets')}
                    className="mt-4 text-indigo-600 hover:underline"
                >
                    ← Back to Assets
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => navigate('/staff/assets')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900">{asset.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{asset.code}</span>
                        <span>•</span>
                        <span>{asset.type}</span>
                    </div>
                </div>
                {canEdit && (
                    <button className="text-indigo-600 font-bold text-xs bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                        Edit
                    </button>
                )}
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* 1. Overview Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Assigned To</p>
                        <p className="font-bold text-gray-900">{asset.assignedTo || 'Unassigned'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Status</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${asset.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {asset.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Purchase Date</p>
                        <p className="font-bold text-gray-900">{asset.purchaseDate}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Cost</p>
                        <p className="font-bold text-gray-900">₹{asset.cost.toLocaleString()}</p>
                    </div>
                </div>

                {/* 2. Maintenance Log */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Wrench size={16} className="text-gray-500" /> Maintenance History
                        </h3>
                        {canEdit && (
                            <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline">
                                <Plus size={14} /> Add Log
                            </button>
                        )}
                    </div>
                    <div className="divide-y divide-gray-100">
                        {asset.logs.length > 0 ? (
                            asset.logs.map(log => (
                                <div key={log.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 text-gray-400">
                                            <CheckCircle size={16} className="text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{log.issue}</p>
                                            <p className="text-xs text-gray-500">{log.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">₹{log.cost.toLocaleString()}</p>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">{log.status}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">No maintenance records found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetail;
