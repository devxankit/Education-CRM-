import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';
import ReportTable from '../../../../components/reports/ReportTable';

const JoinerExitReports = ({ filters }) => {

    const attritionData = [
        { name: 'Aug', joiners: 5, exits: 1 },
        { name: 'Sep', joiners: 2, exits: 2 },
        { name: 'Oct', joiners: 0, exits: 1 },
        { name: 'Nov', joiners: 4, exits: 0 },
        { name: 'Dec', joiners: 1, exits: 1 },
        { name: 'Jan', joiners: 3, exits: 0 },
    ];

    const recentJoiners = [
        { name: 'Pooja Hegde', role: 'Math Teacher', date: '12 Jan 2026', dept: 'Academic' },
        { name: 'Ravi Kumar', role: 'Security Guard', date: '05 Jan 2026', dept: 'Support' },
    ];

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">New Hires (YTD)</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Attrition Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">4.2%</p>
                    <span className="text-xs text-green-600">Within healthy range (&lt; 10%)</span>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase">Exit Formalities</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">0 Pending</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-bold text-gray-800 mb-4">Talent Flux (Joiners vs Exits)</h4>
                <ReportChart type="bar" data={attritionData} dataKey={['joiners', 'exits']} colors={['#10b981', '#ef4444']} height={300} />
            </div>

            {/* Recent Joiners Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800">New Joiners (This Month)</h4>
                </div>
                <ReportTable
                    columns={[
                        { header: 'Name', key: 'name', className: 'font-medium' },
                        { header: 'Role', key: 'role' },
                        { header: 'Department', key: 'dept' },
                        { header: 'Joining Date', key: 'date' },
                    ]}
                    data={recentJoiners}
                />
            </div>
        </div>
    );
};

export default JoinerExitReports;
