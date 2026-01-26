import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';

const StaffStrengthReports = ({ filters }) => {

    const deptDistribution = [
        { name: 'Teaching', count: 45 },
        { name: 'Admin', count: 12 },
        { name: 'Support', count: 20 },
        { name: 'Transport', count: 15 },
        { name: 'Labs', count: 5 },
    ];

    const genderData = [
        { name: 'Female', value: 65 },
        { name: 'Male', value: 35 },
    ];

    return (
        <div className="space-y-6">
            {/* Big KPI */}
            <div className="bg-indigo-600 rounded-xl p-6 text-white flex justify-between items-center shadow-sm">
                <div>
                    <p className="text-indigo-100 font-medium">Total Active Workforce</p>
                    <h2 className="text-4xl font-bold mt-1">97</h2>
                </div>
                <div className="text-right">
                    <p className="text-indigo-100 text-sm">Teacher-Student Ratio</p>
                    <p className="text-2xl font-bold">1 : 28</p>
                    <p className="text-xs text-indigo-200 mt-1">Target: 1 : 25</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Department-wise Strength</h4>
                    <ReportChart type="bar" data={deptDistribution} dataKey="count" colors={['#818cf8']} />
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Gender Diversity</h4>
                    <ReportChart type="pie" data={genderData} dataKey="value" height={250} colors={['#ec4899', '#3b82f6']} />
                </div>
            </div>
        </div>
    );
};

export default StaffStrengthReports;
