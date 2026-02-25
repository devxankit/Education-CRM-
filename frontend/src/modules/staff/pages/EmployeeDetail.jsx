import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import {
    ArrowLeft, User, Phone, MapPin, Briefcase, Bus,
    Shield, Calendar, Truck
} from 'lucide-react';
import { fetchDriverDetails } from '../services/transport.api';

const EmployeeDetail = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();

    const [driver, setDriver] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentRole = user?.role || STAFF_ROLES.FRONT_DESK;

    // Fetch driver + routes based on ID from URL
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            const data = await fetchDriverDetails(employeeId);
            if (data?.driver) {
                setDriver(data.driver);
                setRoutes(data.routes || []);
            } else {
                setError('Driver not found');
            }
            setLoading(false);
        };
        load();
    }, [employeeId]);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading employee details...</p>
            </div>
        );
    }

    // Error state
    if (error || !driver) {
        return (
            <div className="max-w-5xl mx-auto p-10 text-center">
                <p className="text-red-600 font-bold">{error || 'Driver not found'}</p>
                <button
                    onClick={() => navigate('/staff/employees')}
                    className="mt-4 text-indigo-600 hover:underline"
                >
                    ← Back to Employees
                </button>
            </div>
        );
    }

    const InfoField = ({ label, value, icon: Icon }) => (
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                {Icon && <Icon size={10} />} {label}
            </label>
            <p className="text-sm font-bold text-gray-800 break-words">{value || '-'}</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20 flex items-center gap-4 shadow-sm">
                <button onClick={() => navigate('/staff/employees')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{driver.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{(driver._id || '').toString().slice(-6).toUpperCase()}</span>
                        <span>•</span>
                        <span className="text-green-600 font-bold">Active</span>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* 1. Driver Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Driver Name" value={driver.name} icon={User} />
                    <InfoField label="Mobile Number" value={driver.mobile} icon={Phone} />
                    <InfoField label="Branch" value={driver.branchId?.name} icon={MapPin} />
                    <InfoField label="Academic Year" value={driver.academicYearId?.name} icon={Calendar} />
                    <InfoField label="License Number" value={driver.licenseNo} icon={Shield} />
                    <InfoField label="Remarks / Notes" value={driver.remarks} icon={Briefcase} />
                </div>

                {/* 2. Assigned Routes & Stops */}
                <div className="mt-6">
                    <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Truck size={16} className="text-indigo-500" />
                        Assigned Routes & Stops
                    </h2>

                    {routes.length === 0 ? (
                        <p className="text-xs text-gray-500 bg-white border border-dashed border-gray-200 rounded-lg p-4">
                            This driver is not assigned to any transport route yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {routes.map((route) => (
                                <div key={route._id || route.code} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                <Bus size={14} className="text-indigo-500" />
                                                {route.name || route.code}
                                            </p>
                                            <p className="text-[11px] text-gray-500">
                                                Vehicle: <span className="font-mono font-semibold">{route.vehicleNo || 'Not set'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">Route Stops</p>
                                        {Array.isArray(route.stops) && route.stops.length > 0 ? (
                                            <ul className="space-y-1 text-xs text-gray-700">
                                                {route.stops.map((stop, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                        <span className="font-semibold">{stop.name}</span>
                                                        <span className="text-[10px] text-gray-500">
                                                            {stop.pickupTime ? `Pickup: ${stop.pickupTime}` : ''}
                                                            {stop.dropTime ? `  •  Drop: ${stop.dropTime}` : ''}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-[11px] text-gray-400">No stops defined for this route.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default EmployeeDetail;
