import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';
import ReportTable from '../../../../components/reports/ReportTable';

const LeaveReports = ({ filters }) => {

    const leaveTypeData = [
        { name: 'Casual Leave', value: 45 },
        { name: 'Sick Leave', value: 25 },
        { name: 'Earned Leave', value: 20 },
        { name: 'Unpaid', value: 10 },
    ];

    const monthlyTrend = [
        { name: 'Jan', approved: 12, rejected: 2 },
        { name: 'Feb', approved: 18, rejected: 1 },
        { name: 'Mar', approved: 15, rejected: 3 },
    ];

    const pendingRequests = [
        { name: 'Suresh Kumar', type: 'Sick Leave', dates: '24 Jan - 25 Jan', status: 'Pending' },
        { name: 'Meera Nair', type: 'Earned Leave', dates: '10 Feb - 15 Feb', status: 'Pending' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Leave Utilization</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">12%</p>
                    <span className="text-xs text-gray-400">of total allocated quotas</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Pending Approvals</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
                    <span className="text-xs text-orange-500">Needs Action</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Sick Leaves (YTD)</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">45 Days</p>
                    <span className="text-xs text-gray-400">Across all depts</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Leave Type Distribution</h4>
                    <ReportChart type="pie" data={leaveTypeData} dataKey="value" height={250} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Leave Trends (Q1)</h4>
                    <ReportChart type="bar" data={monthlyTrend} dataKey={['approved', 'rejected']} colors={['#6366f1', '#ef4444']} height={250} />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800">Recent Pending Claims</h4>
                </div>
                <ReportTable
                    columns={[
                        { header: 'Applicant', key: 'name', className: 'font-medium' },
                        { header: 'Type', key: 'type' },
                        { header: 'Duration', key: 'dates' },
                        { header: 'Status', key: 'status', render: () => <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs font-bold">Pending Approval</span> }
                    ]}
                    data={pendingRequests}
                />
            </div>
        </div>
    );
};

export default LeaveReports;
