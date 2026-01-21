
import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';

// Components
import RouteList from './components/routes-stops/RouteList';
import RouteForm from './components/routes-stops/RouteForm';

const TransportRoutes = () => {

    // Mock State
    const [routes, setRoutes] = useState([
        {
            id: 1,
            name: 'Route 1 - North Zone',
            code: 'RT-101',
            vehicleNo: 'BUS-101',
            driver: 'Ramesh Kumar',
            capacity: 40,
            studentsAssigned: 32,
            status: 'Active',
            stops: [
                { id: 101, name: 'Main Gate', pickupTime: '07:00', dropTime: '15:30', students: 10 },
                { id: 102, name: 'City Center', pickupTime: '07:20', dropTime: '15:10', students: 22 },
            ]
        },
        {
            id: 2,
            name: 'Route 2 - South Zone',
            code: 'RT-102',
            vehicleNo: 'BUS-105',
            driver: 'Suresh Singh',
            capacity: 30,
            studentsAssigned: 28,
            status: 'Active',
            stops: [
                { id: 201, name: 'Highway Plaza', pickupTime: '07:15', dropTime: '15:45', students: 15 },
                { id: 202, name: 'Green Park', pickupTime: '07:45', dropTime: '15:15', students: 13 },
            ]
        }
    ]);

    const [selectedRoute, setSelectedRoute] = useState(null); // For viewing
    const [isEditing, setIsEditing] = useState(false); // Mode: Edit/Create
    const [editData, setEditData] = useState(null); // Data for form

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
        setEditData(null); // New Item
        setIsEditing(true);
        setSelectedRoute(null);
    };

    const handleEdit = (route) => {
        setEditData(route);
        setIsEditing(true);
    };

    const handleSave = (formData) => {
        if (editData) {
            // Update
            setRoutes(prev => prev.map(r => r.id === editData.id ? { ...formData, id: r.id } : r)); // keep ID
        } else {
            // Create
            const newId = Date.now();
            setRoutes(prev => [...prev, { ...formData, id: newId, studentsAssigned: 0 }]);
        }
        setIsEditing(false);
        setEditData(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(null);
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
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Settings size={18} />
                    </button>
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
                    <RouteList
                        routes={routes}
                        activeRouteId={selectedRoute?.id || editData?.id}
                        onSelect={handleSelectRoute}
                        onEdit={handleEdit}
                    />
                </div>

                {/* Right Details/Form */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">

                    {isEditing ? (
                        <RouteForm
                            route={editData}
                            isNew={!editData}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    ) : selectedRoute ? (
                        // View Mode (Reuse form but maybe disabled or just show summary - Using Form in Read-only or just Form for simplicity for now, usually detail view is different but ERPs often use Form)
                        // For now, let's just use the Form component as a Detail Viewer by initiating edit immediately when clicking? 
                        // No, user requested "View/Edit". Let's show a "Select a route to edit" placeholder if not editing, or auto-select first one.
                        // Actually, let's just make "Select" trigger "Edit" mode for simplicity in this MVP iteration or show a read-only preview.
                        // Let's go with: Clicking list item -> Shows Read Only View (to be built? or reuse form disabled?)
                        // I'll reuse RouteForm but pass a 'readOnly' prop if I had one. 
                        // Instead, I'll allow clicking "Edit" icon on list to enter edit mode. 
                        // Clicking body just selects it.

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center h-full text-center">
                            <div className="p-4 rounded-full bg-indigo-50 text-indigo-200 mb-4">
                                <Settings size={48} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{selectedRoute.name}</h2>
                            <p className="text-gray-500 mb-6">Code: {selectedRoute.code} • Capacity: {selectedRoute.capacity}</p>

                            <button
                                onClick={() => handleEdit(selectedRoute)}
                                className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-bold transition-colors"
                            >
                                Configure Route & Stops
                            </button>
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
