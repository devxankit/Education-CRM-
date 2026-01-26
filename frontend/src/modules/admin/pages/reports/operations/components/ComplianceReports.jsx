import React from 'react';
import ReportTable from '../../../../components/reports/ReportTable';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const ComplianceReports = ({ filters }) => {

    const gaps = [
        { id: '1', entity: 'Bus No. KA-01-1234', type: 'Vehicle', doc: 'Insurance Policy', status: 'Expired', days: 5 },
        { id: '2', entity: 'Ramesh (Driver)', type: 'Staff', doc: 'Eye Test Certificate', status: 'Missing', days: '-' },
        { id: '3', entity: 'Chem Lab 1', type: 'Facility', doc: 'Fire Safety Audit', status: 'Due Soon', days: 12 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="text-red-600 mt-1" size={20} />
                    <div>
                        <p className="font-bold text-red-900">Compliance Breaches</p>
                        <p className="text-sm text-red-700 mt-1">2 Expired Documents requiring immediate action.</p>
                    </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-1" size={20} />
                    <div>
                        <p className="font-bold text-green-900">Audit Readiness</p>
                        <p className="text-sm text-green-700 mt-1">94% of mandatory records are verified.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-800">Operational Compliance Gaps</h4>
                </div>
                <ReportTable
                    columns={[
                        { header: 'Entity Name', key: 'entity', className: 'font-medium' },
                        { header: 'Type', key: 'type' },
                        { header: 'Document', key: 'doc' },
                        {
                            header: 'Status',
                            key: 'status',
                            render: (row) => (
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.status === 'Expired' ? 'bg-red-100 text-red-700' :
                                        row.status === 'Missing' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {row.status}
                                </span>
                            )
                        },
                        { header: 'Days Overdue', key: 'days', align: 'right' }
                    ]}
                    data={gaps}
                />
            </div>
        </div>
    );
};

export default ComplianceReports;
