import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Bus, Navigation, Trash2, Edit2, UserPlus } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';

// Mock Data
const MOCK_ROUTE_DETAIL = {
    id: 'RT-001',
    name: 'Route 1: City Center',
    bus: 'DL-1PC-4502',
    driver: 'Ramesh Singh',
    helper: 'Lalu Prasad',
    phone: '9876543210',
    capacity: 50,
    status: 'Active',
    stops: [
        { id: 1, name: 'Main Gate', time: '07:00 AM' },
        { id: 2, name: 'Sector 15 Market', time: '07:15 AM' },
        { id: 3, name: 'City Center Metro', time: '07:30 AM' },
        { id: 4, name: 'Golf Course Road', time: '07:45 AM' },
    ],
    students: [
        { id: 'S001', name: 'Aarav Patel', class: '10-A', stop: 'Sector 15 Market', parent: 'Rajesh Patel' },
        { id: 'S002', name: 'Zara Khan', class: '8-B', stop: 'City Center Metro', parent: 'Imran Khan' },
        { id: 'S003', name: 'Ishaan Gupta', class: '5-C', stop: 'Golf Course Road', parent: 'Priya Gupta' },
        // ... more
    ]
};

const RouteDetail = () => {
    const { routeId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [activeTab, setActiveTab] = useState('Stops'); // Stops | Students

    const route = MOCK_ROUTE_DETAIL; // In real app, fetch based on routeId

    // Permissions
    const canEdit = [STAFF_ROLES.TRANSPORT, STAFF_ROLES.ADMIN].includes(user?.role);

    return (
        <div className="max-w-4xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-indigo-600 text-white pt-6 pb-12 px-5 relative">
                <button onClick={() => navigate('/staff/transport/routes')} className="absolute top-6 left-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <div className="mt-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{route.name}</h1>
                            <div className="flex items-center gap-2 mt-1 opacity-90 text-sm">
                                <Bus size={14} /> <span>{route.bus}</span>
                                <span>•</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">{route.status}</span>
                            </div>
                        </div>
                        {canEdit && (
                            <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white">
                                <Edit2 size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Container - Overlaps Header */}
            <div className="px-4 -mt-8 relative z-10 space-y-4">

                {/* Driver Info Card */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Driver</p>
                            <p className="text-sm font-bold text-gray-900">{route.driver}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase">Helper</p>
                        <p className="text-sm font-bold text-gray-900">{route.helper}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-2">
                    {['Stops', 'Students'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 shadow-sm min-h-[300px]">

                    {/* View: Stops */}
                    {activeTab === 'Stops' && (
                        <div className="p-4 relative">
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-indigo-100"></div>
                            <div className="space-y-6 relative">
                                {route.stops.map((stop, idx) => (
                                    <div key={stop.id} className="flex items-start gap-4">
                                        <div className="w-5 h-5 rounded-full bg-indigo-600 border-4 border-white shadow-sm flex-shrink-0 z-10 flex items-center justify-center"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{stop.name}</p>
                                            <p className="text-xs text-indigo-600 font-medium">{stop.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View: Students */}
                    {activeTab === 'Students' && (
                        <div>
                            <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">{route.students.length} Assigned</span>
                                {canEdit && (
                                    <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded">
                                        <UserPlus size={14} /> Add Student
                                    </button>
                                )}
                            </div>
                            <div className="divide-y divide-gray-100">
                                {route.students.map(student => (
                                    <div key={student.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{student.name} <span className="text-gray-400 font-medium text-xs">({student.class})</span></p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <MapPin size={10} className="text-indigo-400" />
                                                {student.stop}
                                            </div>
                                        </div>
                                        {canEdit && (
                                            <button className="text-gray-400 hover:text-red-600 p-2">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RouteDetail;
