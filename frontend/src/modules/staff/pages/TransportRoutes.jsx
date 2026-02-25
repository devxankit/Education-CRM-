import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, MapPin, RefreshCw } from 'lucide-react';
import { fetchRoutes } from '../services/transport.api';

const TransportRoutes = () => {
    const navigate = useNavigate();
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchRoutes();
            setRoutes(Array.isArray(data) ? data : []);
            setLoading(false);
        };
        load();
    }, []);

    const filteredRoutes = routes.filter(
        (r) =>
            (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.vehicleNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-50 text-green-700 border-green-200';
            case 'Full': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Inactive': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    const routeId = (r) => r._id || r.id;
    const assigned = (r) => Number(r.studentsAssigned) || 0;
    const capacity = (r) => Number(r.capacity) || 0;
    const isFull = (r) => capacity(r) > 0 && assigned(r) >= capacity(r);
    const statusDisplay = (r) => (r.status === 'Active' && isFull(r) ? 'Full' : r.status || 'Active');

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/staff/transport')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Bus Routes</h1>
                        <p className="text-xs text-gray-500">Manage fleet and assignments</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search route name or bus number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <RefreshCw size={28} className="animate-spin text-indigo-500" />
                    </div>
                ) : filteredRoutes.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 text-sm">No routes found.</div>
                ) : (
                    filteredRoutes.map((route) => {
                        const cap = capacity(route);
                        const ass = assigned(route);
                        const pct = cap > 0 ? Math.min(100, (ass / cap) * 100) : 0;
                        return (
                            <div
                                key={routeId(route)}
                                onClick={() => navigate(`/staff/transport/routes/${routeId(route)}`)}
                                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{route.name || route.code || 'Unnamed'}</h3>
                                            <p className="text-xs text-gray-500">{route.vehicleNo || route.code || '-'}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(statusDisplay(route))}`}>
                                        {statusDisplay(route)}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Users size={14} className="text-gray-400" />
                                        <span className="font-bold">Driver:</span> {route.driver || '—'}
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                            <span>Capacity</span>
                                            <span>{ass}/{cap || '—'}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${isFull(route) ? 'bg-amber-500' : 'bg-green-500'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TransportRoutes;
