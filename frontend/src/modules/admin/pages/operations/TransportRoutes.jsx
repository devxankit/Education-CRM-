
import React, { useState, useEffect } from 'react';
import { Plus, Settings, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';

// Components
import RouteList from './components/routes-stops/RouteList';
import RouteForm from './components/routes-stops/RouteForm';

const TransportRoutes = () => {
    const {
        branches,
        fetchBranches,
        transportRoutes,
        fetchTransportRoutes,
        addTransportRoute,
        updateTransportRoute,
        deleteTransportRoute
    } = useAdminStore();

    // Global State
    const [branchId, setBranchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length > 0 && !branchId) {
            setBranchId(branches[0]._id);
        }
    }, [branches, branchId]);

    useEffect(() => {
        const loadRoutes = async () => {
            if (!branchId) return;
            setLoading(true);
            await fetchTransportRoutes(branchId);
            setLoading(false);
        };
        loadRoutes();
    }, [branchId, fetchTransportRoutes]);

    // Handlers
    const handleSelectRoute = (route) => {
        if (isEditing) {
            if (confirm("Discard unsaved changes?")) {
                setIsEditing(false);
                setSelectedRoute(route);
            }
        } else {
            setSelectedRoute(route);
        }
    };

    const handleCreateNew = () => {
        setEditData(null);
        setIsEditing(true);
        setSelectedRoute(null);
    };

    const handleEdit = (route) => {
        setEditData(route);
        setIsEditing(true);
    };

    const handleSave = async (formData) => {
        if (editData && editData._id) {
            // Update
            await updateTransportRoute(editData._id, formData);
        } else {
            // Create
            await addTransportRoute({ ...formData, branchId });
        }
        setIsEditing(false);
        setEditData(null);
        setSelectedRoute(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this route?")) {
            await deleteTransportRoute(id);
            if (selectedRoute?._id === id) setSelectedRoute(null);
        }
    };

    return (
        <div className="h-full flex flex-col pb-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Route Management</h1>
                    <p className="text-gray-500 text-sm">Configure transport corridors, stops, and vehicle assignments.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm shadow-sm">
                        <span className="text-gray-500">Branch:</span>
                        <select
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            className="font-bold text-gray-800 outline-none bg-transparent cursor-pointer"
                        >
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> Add Route
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">

                {/* Left Listing */}
                <div className={`col-span-12 md:col-span-4 lg:col-span-3 transition-all ${isEditing ? 'hidden md:block' : 'block'}`}>
                    {loading ? (
                        <div className="h-full flex items-center justify-center p-12 bg-white rounded-xl border border-gray-200">
                            <Loader2 className="animate-spin text-indigo-500" size={24} />
                        </div>
                    ) : (
                        <RouteList
                            routes={transportRoutes}
                            activeRouteId={selectedRoute?._id || editData?._id}
                            onSelect={handleSelectRoute}
                            onEdit={handleEdit}
                        />
                    )}
                </div>

                {/* Right Details/Form */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">

                    {isEditing ? (
                        <RouteForm
                            route={editData}
                            isNew={!editData}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onDelete={() => handleDelete(editData._id)}
                        />
                    ) : selectedRoute ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center h-full text-center">
                            <div className="p-4 rounded-full bg-indigo-50 text-indigo-200 mb-4">
                                <Settings size={48} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{selectedRoute.name}</h2>
                            <p className="text-gray-500 mb-6">Code: {selectedRoute.code} • Capacity: {selectedRoute.capacity}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(selectedRoute)}
                                    className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-bold transition-colors"
                                >
                                    Configure Route & Stops
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedRoute._id)}
                                    className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold transition-colors"
                                >
                                    Delete Route
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                            <p>Select a route from the list to view details.</p>
                            <p className="text-xs mt-2">or create a new one.</p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default TransportRoutes;
