
import React from 'react';
import { Truck, Users, MapPin, ChevronRight, Edit2 } from 'lucide-react';
import CapacityIndicator from './CapacityIndicator';

const RouteList = ({ routes, activeRouteId, onSelect, onEdit }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">Transport Routes</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">{routes.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {routes.map((route) => (
                    <div
                        key={route.id}
                        onClick={() => onSelect(route)}
                        className={`
                            border rounded-lg p-3 cursor-pointer transition-all relative group
                            ${activeRouteId === route.id
                                ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                                : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className={`font-bold text-sm ${activeRouteId === route.id ? 'text-indigo-900' : 'text-gray-800'}`}>
                                    {route.name}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1 rounded flex items-center gap-1 w-fit mt-1">
                                    <Truck size={10} /> {route.code} • {route.vehicleNo || 'No Vehicle'}
                                </span>
                            </div>
                            {route.status === 'Active' ? (
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            ) : (
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1">
                                    <MapPin size={10} /> Stops
                                </span>
                                <span className="text-xs font-bold text-gray-700">{route.stops?.length || 0}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1">
                                    <Users size={10} /> Students
                                </span>
                                <span className="text-xs font-bold text-gray-700">{route.studentsAssigned}</span>
                            </div>
                        </div>

                        <CapacityIndicator
                            total={route.capacity}
                            used={route.studentsAssigned}
                            label="Bus Capacity"
                        />

                        {/* Edit Action - Only appears on hover or active */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(route); }}
                            className={`
                                absolute top-2 right-2 p-1.5 rounded-md hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all
                                ${activeRouteId === route.id ? 'text-indigo-400' : 'text-transparent group-hover:text-gray-400'}
                            `}
                        >
                            <Edit2 size={14} />
                        </button>

                    </div>
                ))}

                {routes.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        No routes found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteList;
