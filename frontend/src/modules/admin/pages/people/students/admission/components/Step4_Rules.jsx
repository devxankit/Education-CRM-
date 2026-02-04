
import React, { useEffect } from 'react';
import { Bus, Bed, FileText } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';

const Step4_Rules = ({ data, onChange }) => {
    const transportRoutes = useAdminStore(state => state.transportRoutes);
    const fetchTransportRoutes = useAdminStore(state => state.fetchTransportRoutes);

    useEffect(() => {
        fetchTransportRoutes('main');
    }, [fetchTransportRoutes]);

    const selectedRoute = transportRoutes.find(r => r._id === data.routeId);
    const stops = selectedRoute ? selectedRoute.stops : [];

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const handleRouteChange = (routeId) => {
        onChange({ ...data, routeId: routeId, stopId: '' });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Bus className="text-indigo-600" /> Logistics & Facilities
                </h3>
                <p className="text-sm text-gray-500">Configure transport pick-up and hostel accommodation.</p>
            </div>

            {/* Transport Card */}
            <div className={`p-6 rounded-xl border transition-all ${data.transportRequired ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${data.transportRequired ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                            <Bus size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">School Transport</h4>
                            <p className="text-xs text-gray-500">Bus service for daily commute.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={data.transportRequired || false}
                            onChange={(e) => handleChange('transportRequired', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                {data.transportRequired && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Route</label>
                            <select
                                value={data.routeId || ''}
                                onChange={(e) => handleRouteChange(e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                                <option value="">Select Route</option>
                                {transportRoutes.map(r => (
                                    <option key={r._id} value={r._id}>{r.name} ({r.code})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pick-up Stop</label>
                            <select
                                value={data.stopId || ''}
                                onChange={(e) => handleChange('stopId', e.target.value)}
                                disabled={!data.routeId}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                            >
                                <option value="">{data.routeId ? 'Select Stop' : 'Select Route First'}</option>
                                {stops.map(s => (
                                    <option key={s._id} value={s._id}>{s.name} ({s.pickupTime})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Hostel Card */}
            <div className={`p-6 rounded-xl border transition-all ${data.hostelRequired ? 'bg-white border-orange-200 shadow-sm ring-1 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${data.hostelRequired ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}>
                            <Bed size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Hostel Accommodation</h4>
                            <p className="text-xs text-gray-500">Boarding facility for students.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={data.hostelRequired || false}
                            onChange={(e) => handleChange('hostelRequired', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>

                {data.hostelRequired && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bed Type</label>
                            <select
                                value={data.bedType || ''}
                                onChange={(e) => handleChange('bedType', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                            >
                                <option value="">Select Bed</option>
                                <option value="Single">Single Bed</option>
                                <option value="Bunk">Bunk Bed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room Preference</label>
                            <select
                                value={data.roomType || ''}
                                onChange={(e) => handleChange('roomType', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                            >
                                <option value="">Select Room</option>
                                <option value="AC">AC Room</option>
                                <option value="Non-AC">Non-AC Room</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Document Checklist Preview */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                <FileText className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Document Requirements</h4>
                    <p className="text-xs text-blue-700 mt-1">Based on Class 5 selection, the following will be required in next step: Birth Certificate, Transfer Certificate, 3 Photos.</p>
                </div>
            </div>

        </div>
    );
};

export default Step4_Rules;
