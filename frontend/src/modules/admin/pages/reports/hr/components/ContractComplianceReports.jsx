import React from 'react';
import ReportTable from '../../../../components/reports/ReportTable';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ContractComplianceReports = ({ filters }) => {

    // Mock Data
    const expiries = [
        { name: 'Amit Verma', role: 'Lab Assistant', expiry: '15 Feb 2026', daysLeft: 20, type: 'Contract' },
        { name: 'Sarah Wilson', role: 'Guest Teacher', expiry: '28 Feb 2026', daysLeft: 33, type: 'Probation' },
    ];

    const missingDocs = [
        { name: 'New Driver 1', role: 'Driver', missing: ['Police Verification', 'License Copy'], severity: 'Critical' },
        { name: 'Priya S', role: 'Trainee', missing: ['Previous Relieving Letter'], severity: 'Medium' },
    ];

    return (
        <div className="space-y-6">

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
                    <AlertTriangle className="text-red-500 mt-1" size={20} />
                    <div>
                        <p className="font-bold text-red-900">Compliance Risk</p>
                        <p className="text-sm text-red-700 mt-1">4 Staff members with missing critical documents.</p>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100 flex items-start gap-3">
                    <Clock className="text-yellow-600 mt-1" size={20} />
                    <div>
                        <p className="font-bold text-yellow-900">Expiring Soon</p>
                        <p className="text-sm text-yellow-700 mt-1">2 Contracts expiring within 30 days.</p>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-100 flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-1" size={20} />
                    <div>
                        <p className="font-bold text-green-900">Background Checks</p>
                        <p className="text-sm text-green-700 mt-1">98% Verified.</p>
                    </div>
                </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Expiries */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h4 className="font-bold text-gray-800 text-sm">Contract Expiries (Next 60 Days)</h4>
                    </div>
                    <ReportTable
                        columns={[
                            { header: 'Name', key: 'name', className: 'font-medium' },
                            { header: 'Role', key: 'role' },
                            { header: 'Expires On', key: 'expiry' },
                            { header: 'Type', key: 'type' }
                        ]}
                        data={expiries}
                    />
                </div>

                {/* Missing Docs */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h4 className="font-bold text-gray-800 text-sm">Document Compliance Gaps</h4>
                    </div>
                    <ReportTable
                        columns={[
                            { header: 'Staff', key: 'name', className: 'font-medium' },
                            { header: 'Missing Documents', key: 'missing', render: (row) => row.missing.join(', ') },
                            {
                                header: 'Severity',
                                key: 'severity',
                                render: (row) => (
                                    <span className={`text-xs font-bold ${row.severity === 'Critical' ? 'text-red-600' : 'text-orange-500'}`}>
                                        {row.severity}
                                    </span>
                                )
                            }
                        ]}
                        data={missingDocs}
                    />
                </div>

            </div>

        </div>
    );
};

export default ContractComplianceReports;
