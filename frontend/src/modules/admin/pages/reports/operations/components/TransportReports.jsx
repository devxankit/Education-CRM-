import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';
import ReportTable from '../../../../components/reports/ReportTable';
import { Bus, MapPin, Users } from 'lucide-react';

const TransportReports = ({ filters }) => {

    // Mock Data
    const routeUtilization = [
        { name: 'R1 (North)', capacity: 50, utilized: 45 },
        { name: 'R2 (South)', capacity: 50, utilized: 48 },
        { name: 'R3 (East)', capacity: 40, utilized: 30 },
        { name: 'R4 (West)', capacity: 40, utilized: 38 },
        { name: 'R5 (Central)', capacity: 60, utilized: 55 },
    ];

    const fleetStatus = [
        { name: 'On Route', value: 12 },
        { name: 'Maintenance', value: 2 },
        { name: 'Idle', value: 1 },
    ];

    const routeTable = [
        { id: 'R1', name: 'Route 1 (North)', driver: 'Rajesh Kumar', bus: 'BUS-01', status: 'Running', occupancy: '90%' },
        { id: 'R2', name: 'Route 2 (South)', driver: 'Suresh Singh', bus: 'BUS-02', status: 'Running', occupancy: '96%' },
        { id: 'R3', name: 'Route 3 (East)', driver: 'Amit Verma', bus: 'BUS-03', status: 'Delayed', occupancy: '75%' },
    ];

    return (
        <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded text-orange-600">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-orange-800 uppercase">Fleet Occupancy</p>
                        <p className="text-2xl font-bold text-orange-900 mt-1">88%</p>
                        <span className="text-xs text-orange-700">High Utilization</span>
                    </div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded text-gray-600">
                        <Bus size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Total Buses</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
                        <span className="text-xs text-green-600">12 Active, 3 Reserve</span>
                    </div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded text-gray-600">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Route Efficiency</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
                        <span className="text-xs text-red-500">2 Routes Delayed</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Seat Utilization vs Capacity</h4>
                    <ReportChart type="bar" data={routeUtilization} dataKey={['capacity', 'utilized']} colors={['#e5e7eb', '#f97316']} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Fleet Status Breakdown</h4>
                    <ReportChart type="pie" data={fleetStatus} dataKey="value" height={250} colors={['#22c55e', '#ef4444', '#94a3b8']} />
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800">Live Route Status</h4>
                </div>
                <ReportTable
                    columns={[
                        { header: 'Route ID', key: 'id', className: 'font-mono text-xs' },
                        { header: 'Route Name', key: 'name', className: 'font-medium' },
                        { header: 'Driver', key: 'driver' },
                        { header: 'Bus No.', key: 'bus' },
                        { header: 'Occupancy', key: 'occupancy', align: 'right' },
                        {
                            header: 'Status',
                            key: 'status',
                            render: (row) => (
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {row.status}
                                </span>
                            )
                        }
                    ]}
                    data={routeTable}
                />
            </div>
        </div>
    );
};

export default TransportReports;
