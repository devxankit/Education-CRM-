import React from 'react';
import ReportTable from '../../../../components/reports/ReportTable';

const DiscountReports = ({ filters }) => {

    const concessions = [
        { id: 1, type: 'Merit Scholarship', count: 45, value: 450000 },
        { id: 2, type: 'Sibling Discount', count: 120, value: 1200000 },
        { id: 3, type: 'Staff Ward', count: 15, value: 300000 },
        { id: 4, type: 'EWS Quota', count: 25, value: 0 }, // Fully subz
    ];

    return (
        <div className="space-y-6">
            <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                <h3 className="text-purple-900 font-bold">Total Revenue Impact</h3>
                <p className="text-purple-700 text-sm mt-1">₹ 19.5 Lakhs waived in Academic Year 2025-26 under various scholarship programs.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800">Concession Category Breakdown</h4>
                </div>
                <ReportTable
                    columns={[
                        { header: 'Concession Type', key: 'type', className: 'font-medium' },
                        { header: 'Beneficiaries', key: 'count', align: 'right' },
                        { header: 'Total Waived Amount', key: 'value', align: 'right', render: (row) => `₹ ${row.value.toLocaleString()}` },
                    ]}
                    data={concessions}
                />
            </div>
        </div>
    );
};

export default DiscountReports;
