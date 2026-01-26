import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';
import ReportTable from '../../../../components/reports/ReportTable';
import { Download } from 'lucide-react';

const StaffAttendanceReports = ({ filters }) => {

    // Mock Data
    const trendData = [
        { name: 'Week 1', present: 95, absent: 5 },
        { name: 'Week 2', present: 92, absent: 8 },
        { name: 'Week 3', present: 96, absent: 4 },
        { name: 'Week 4', present: 88, absent: 12 },
    ];

    const deptAttendance = [
        { name: 'Academic', value: 94 },
        { name: 'Admin', value: 98 },
        { name: 'Support', value: 85 },
        { name: 'Transport', value: 91 },
    ];

    const chronicAbsentees = [
        { id: 1, name: 'Rahul Sharma', dept: 'Support', absentDays: 5, risk: 'High' },
        { id: 2, name: 'Anita Desai', dept: 'Academic', absentDays: 3, risk: 'Medium' },
        { id: 3, name: 'Vikram Singh', dept: 'Transport', absentDays: 3, risk: 'Medium' },
    ];

    const columns = [
        { header: 'Staff Name', key: 'name', className: 'font-medium' },
        { header: 'Department', key: 'dept' },
        { header: 'Days Absent (This Month)', key: 'absentDays', align: 'right' },
        {
            header: 'Risk Level',
            key: 'risk',
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {row.risk}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Avg. Attendance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">92.4%</p>
                    <span className="text-xs text-green-600">↑ 1.2% vs last month</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Late Arrivals</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">14</p>
                    <span className="text-xs text-red-500">Avg delay: 12 mins</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Unplanned Leaves</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
                    <span className="text-xs text-gray-400">Total days lost</span>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Monthly Attendance Trend</h4>
                    <ReportChart type="area" data={trendData} dataKey="present" colors={['#10b981']} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Department Performance</h4>
                    <ReportChart type="bar" data={deptAttendance} dataKey="value" colors={['#6366f1']} />
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-800">Chronic Absenteeism Watchlist</h4>
                    <button className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
                <ReportTable
                    columns={columns}
                    data={chronicAbsentees}
                />
            </div>
        </div>
    );
};

export default StaffAttendanceReports;
