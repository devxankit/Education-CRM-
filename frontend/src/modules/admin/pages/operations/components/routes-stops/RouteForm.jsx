
import React, { useState, useEffect } from 'react';
import { Save, Truck, User, X } from 'lucide-react';
import StopsManager from './StopsManager';
import { useAdminStore } from '../../../../../../store/adminStore';

const RouteForm = ({ route: initialRoute, isNew, branchId, academicYearId, onSave, onCancel }) => {

    const { transportVehicles, transportDrivers } = useAdminStore();

    const [formData, setFormData] = useState({
        name: '',
        code: `RT-${Math.floor(Math.random() * 1000)}`, // Mock auto-gen
        vehicleNo: '',
        driver: '',
        capacity: 40,
        status: 'Active',
        stops: []
    });

    useEffect(() => {
        if (initialRoute) {
            setFormData(initialRoute);
        }
    }, [initialRoute]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.name) return alert("Route Name is required");
        onSave(formData);
    };

    const filteredVehicles = transportVehicles.filter(v => {
        if (!branchId) return true;
        const matchesBranch = v.branchId === branchId;
        const matchesYear = !academicYearId || v.academicYearId === academicYearId;
        return matchesBranch && matchesYear;
    });

    const filteredDrivers = transportDrivers.filter(d => {
        if (!branchId) return true;
        const matchesBranch = d.branchId === branchId;
        const matchesYear = !academicYearId || d.academicYearId === academicYearId;
        return matchesBranch && matchesYear;
    });

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">

            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                    <button onClick={onCancel} className="bg-white border border-gray-200 p-1.5 rounded-lg text-gray-500 hover:text-gray-800 md:hidden">
                        <X size={16} />
                    </button>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        {isNew ? 'Create New Route' : `Editing ${formData.name}`}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
                    >
                        <Save size={14} /> Save Route
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Route Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g. North City Express"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Route Code (Auto)</label>
                        <input
                            type="text"
                            value={formData.code}
                            disabled
                            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-500 font-mono"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <Truck size={12} /> Assigned Vehicle
                        </label>
                        <select
                            value={formData.vehicleNo}
                            onChange={(e) => handleChange('vehicleNo', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                            <option value="">-- Select Vehicle --</option>
                            {filteredVehicles.map(v => (
                                <option
                                    key={v._id}
                                    value={v.registrationNo || v.code}
                                >
                                    {v.code} {v.registrationNo ? `- ${v.registrationNo}` : ''} {v.model ? `(${v.model})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <User size={12} /> Assigned Driver
                        </label>
                        <select
                            value={formData.driver}
                            onChange={(e) => handleChange('driver', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                            <option value="">-- Select Driver --</option>
                            {filteredDrivers.map(d => (
                                <option key={d._id} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Capacity</label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => handleChange('capacity', Number(e.target.value))}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                            <button
                                onClick={() => handleChange('status', 'Active')}
                                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${formData.status === 'Active' ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => handleChange('status', 'Inactive')}
                                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${formData.status === 'Inactive' ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Inactive
                            </button>
                        </div>
                    </div>

                </div>

                <hr className="border-gray-100" />

                {/* Stops Manager */}
                <div>
                    <StopsManager stops={formData.stops || []} onChange={(newStops) => handleChange('stops', newStops)} />
                </div>

            </div>
        </div>
    );
};

export default RouteForm;
