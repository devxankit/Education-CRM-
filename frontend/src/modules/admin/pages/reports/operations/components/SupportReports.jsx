import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';
import ReportTable from '../../../../components/reports/ReportTable';

const SupportReports = ({ filters }) => {

    const ticketStats = [
        { name: 'Open', value: 12 },
        { name: 'In Progress', value: 8 },
        { name: 'Resolved', value: 45 },
        { name: 'Closed', value: 120 },
    ];

    const slaTrend = [
        { name: 'Week 1', compliant: 90, breach: 10 },
        { name: 'Week 2', compliant: 85, breach: 15 },
        { name: 'Week 3', compliant: 92, breach: 8 },
        { name: 'Week 4', compliant: 95, breach: 5 },
    ];

    const breaches = [
        { ticket: '#TK-902', subject: 'Projector Not Working - Lab 2', created: '2 days ago', sla: '24 Hrs', dept: 'IT' },
        { ticket: '#TK-885', subject: 'Water Leakage - 2nd Floor', created: '4 days ago', sla: '48 Hrs', dept: 'Maintenance' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Avg Resolution Time</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">4.2 Hrs</p>
                    <span className="text-xs text-green-600">Within targets</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">SLA Breaches</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
                    <span className="text-xs text-red-500">Requires attention</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">CSAT Score</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">4.8 / 5</p>
                    <span className="text-xs text-gray-400">Based on 50 feedbacks</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Ticket Status Distribution</h4>
                    <ReportChart type="pie" data={ticketStats} dataKey="value" height={250} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">SLA Compliance Trend</h4>
                    <ReportChart type="bar" data={slaTrend} dataKey={['compliant', 'breach']} colors={['#22c55e', '#ef4444']} />
                </div>
            </div>

            {/* Breaches Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                    <h4 className="text-sm font-bold text-gray-800">Active SLA Breaches</h4>
                </div>
                <ReportTable
                    columns={[
                        { header: 'Ticket ID', key: 'ticket', className: 'font-mono text-xs' },
                        { header: 'Subject', key: 'subject', className: 'font-medium' },
                        { header: 'Department', key: 'dept' },
                        { header: 'Created', key: 'created' },
                        { header: 'SLA Target', key: 'sla', className: 'text-red-600 font-bold' },
                    ]}
                    data={breaches}
                />
            </div>
        </div>
    );
};

export default SupportReports;
