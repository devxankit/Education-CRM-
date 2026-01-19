import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { Bus, Users, AlertTriangle, MapPin, Phone, Search, Plus, CheckCircle, Clock, XCircle, ChevronRight, Navigation, User } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_ROUTES = [
    { id: 'R01', name: 'Route 1 - North City', busNumber: 'BUS-101', capacity: 40, assigned: 38, driver: 'Ramesh Singh', phone: '9876543210', status: 'Active' },
    { id: 'R02', name: 'Route 2 - South City', busNumber: 'BUS-102', capacity: 40, assigned: 40, driver: 'Suresh Kumar', phone: '9876543211', status: 'Full' },
    { id: 'R03', name: 'Route 3 - East City', busNumber: 'BUS-103', capacity: 30, assigned: 25, driver: 'Mahesh Yadav', phone: '9876543212', status: 'Active' },
];

const MOCK_STUDENTS_TRANSPORT = [
    { id: 'ST01', name: 'Aarav Gupta', class: '10-A', address: 'Sec 15, North City', routeId: 'R01' },
    { id: 'ST02', name: 'Zara Khan', class: '8-B', address: 'Sec 45, South City', routeId: 'R02' },
    { id: 'ST03', name: 'Rohan Verma', class: '12-C', address: 'Civic Center', routeId: null }, // Unassigned
    { id: 'ST04', name: 'Priya Sharma', class: '9-A', address: 'Sec 18, North City', routeId: 'R01' },
];

const MOCK_ISSUES = [
    { id: 'ISS01', type: 'Delay', description: 'Heavy traffic at Crossing.', status: 'Open', time: '08:15 AM', bus: 'BUS-101' },
    { id: 'ISS02', type: 'Breakdown', description: 'Tyre puncture near School.', status: 'Resolved', time: 'Yesterday', bus: 'BUS-103' },
];

const Transport = () => {
    const { user } = useStaffAuth();
    const canManage = user?.role === STAFF_ROLES.TRANSPORT || user?.role === STAFF_ROLES.ADMIN;

    const [activeTab, setActiveTab] = useState('routes'); // routes | students | issues

    // Mobile-friendly Tab Navigation
    const tabs = [
        { id: 'routes', label: 'Routes', icon: Navigation },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'issues', label: 'Issues', icon: AlertTriangle },
    ];

    return (
        <div className="max-w-md mx-auto pb-24 md:pb-6 relative min-h-screen">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Transport</h1>
                    <p className="text-xs text-gray-500">Fleet & Routes</p>
                </div>
                {/* Stats for Transport Staff */}
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-indigo-100 flex items-center gap-1.5">
                    <Bus size={12} /> 12 Buses
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                            : 'bg-white text-gray-500 border border-gray-200'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="mt-2">
                {activeTab === 'routes' && <RouteList routes={MOCK_ROUTES} />}
                {activeTab === 'students' && <StudentAssignment students={MOCK_STUDENTS_TRANSPORT} routes={MOCK_ROUTES} canManage={canManage} />}
                {activeTab === 'issues' && <TransportIssues issues={MOCK_ISSUES} canManage={canManage} />}
            </div>

        </div>
    );
};

// --- SUB-COMPONENTS ---

const RouteList = ({ routes }) => {
    return (
        <div className="space-y-3">
            {routes.map(route => {
                const isFull = route.assigned >= route.capacity;
                const percent = (route.assigned / route.capacity) * 100;

                return (
                    <div key={route.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden active:scale-[0.99] transition-transform">

                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{route.name}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono font-medium">{route.busNumber}</span>
                                    <span className="flex items-center gap-1"><User size={12} /> {route.driver}</span>
                                </div>
                            </div>
                            <a href={`tel:${route.phone}`} className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors">
                                <Phone size={14} />
                            </a>
                        </div>

                        {/* Capacity Bar (Thin) */}
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
                            <span>Occupancy</span>
                            <span className={isFull ? 'text-orange-500' : 'text-emerald-600'}>
                                {route.assigned}/{route.capacity}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${isFull ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const StudentAssignment = ({ students, routes, canManage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null); // ID of student being edited

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Find student..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.map(student => {
                    const assignedRoute = routes.find(r => r.id === student.routeId);
                    const isEditing = editingId === student.id;

                    return (
                        <div key={student.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{student.name}</h4>
                                    <p className="text-[10px] text-gray-500 mt-0.5"><MapPin size={10} className="inline mr-0.5" /> {student.address}</p>
                                </div>
                                <div className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                    {student.class}
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                {isEditing ? (
                                    <div className="flex gap-2 w-full animate-in fade-in zoom-in duration-200">
                                        <select className="flex-1 text-xs border-gray-300 rounded-lg p-2 bg-gray-50 border outline-none focus:border-indigo-500 font-medium">
                                            <option value="">Select Route</option>
                                            {routes.map(r => (
                                                <option key={r.id} value={r.id} disabled={r.assigned >= r.capacity}>
                                                    {r.name} ({r.available === 0 ? 'Full' : `${r.capacity - r.assigned} left`})
                                                </option>
                                            ))}
                                        </select>
                                        <button onClick={() => setEditingId(null)} className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm">
                                            <CheckCircle size={16} />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg">
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        {assignedRoute ? (
                                            <div className="flex items-center gap-2 text-indigo-700">
                                                <Bus size={14} />
                                                <span className="text-xs font-bold">{assignedRoute.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-orange-600">
                                                <AlertTriangle size={14} />
                                                <span className="text-xs font-bold">Unassigned</span>
                                            </div>
                                        )}

                                        {canManage && (
                                            <button
                                                onClick={() => setEditingId(student.id)}
                                                className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors underline"
                                            >
                                                Change
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TransportIssues = ({ issues, canManage }) => {
    return (
        <div>
            {canManage && (
                <button className="w-full py-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm mb-4 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <AlertTriangle size={16} /> Report New Issue
                </button>
            )}

            <div className="space-y-3">
                {issues.map(issue => (
                    <div key={issue.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${issue.type === 'Breakdown' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                            <AlertTriangle size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <h4 className="font-bold text-gray-900 text-sm">{issue.type}</h4>
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${issue.status === 'Resolved' ? 'bg-gray-100 text-gray-500' : 'bg-red-500 text-white'}`}>
                                    {issue.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-2">{issue.description}</p>

                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                                <span className="flex items-center gap-1"><Bus size={10} /> {issue.bus}</span>
                                <span className="flex items-center gap-1"><Clock size={10} /> {issue.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Transport;