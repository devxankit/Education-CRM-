import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';
import ReportTable from '../../../../components/reports/ReportTable';

const HostelReports = ({ filters }) => {

    // Mock Data
    const occupancyData = [
        { name: 'Boys Hostel A', occupied: 120, vacant: 30 },
        { name: 'Girls Hostel B', occupied: 140, vacant: 10 },
        { name: 'Staff Quarters', occupied: 45, vacant: 5 },
    ];

    const roomTypeData = [
        { name: 'Single AC', value: 20 },
        { name: 'Double Non-AC', value: 150 },
        { name: 'Triple Non-AC', value: 80 },
    ];

    const alerts = [
        { block: 'Boys Hostel A', room: '101', issue: 'Maintenance Reqd (Fan)', priority: 'High' },
        { block: 'Girls Hostel B', room: '204', issue: 'Cleaning Missed', priority: 'Medium' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Total Occupancy</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">87%</p>
                    <span className="text-xs text-gray-400">305 / 350 Beds</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Mess Subscription</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">100%</p>
                    <span className="text-xs text-green-600">All boarders subscribed</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Occupancy Ratio by Block</h4>
                    <ReportChart type="bar" data={occupancyData} dataKey={['occupied', 'vacant']} colors={['#8b5cf6', '#e5e7eb']} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Room Type Distribution</h4>
                    <ReportChart type="pie" data={roomTypeData} dataKey="value" height={250} colors={['#ec4899', '#3b82f6', '#f97316']} />
                </div>
            </div>

            {/* Alerts Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800">Operational Alerts</h4>
                </div>
                <ReportTable
                    columns={[
                        { header: 'Block', key: 'block' },
                        { header: 'Room No', key: 'room' },
                        { header: 'Issue Reported', key: 'issue' },
                        {
                            header: 'Priority',
                            key: 'priority',
                            render: (row) => (
                                <span className={`text-xs font-bold ${row.priority === 'High' ? 'text-red-600' : 'text-orange-500'}`}>
                                    {row.priority}
                                </span>
                            )
                        }
                    ]}
                    data={alerts}
                />
            </div>
        </div>
    );
};

export default HostelReports;
