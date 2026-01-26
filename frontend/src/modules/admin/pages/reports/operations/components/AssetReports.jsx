import React from 'react';
import ReportChart from '../../../../components/reports/ReportChart';
import ReportTable from '../../../../components/reports/ReportTable';

const AssetReports = ({ filters }) => {

    const assetValue = [
        { name: 'IT Hardware', value: 45 },
        { name: 'Furniture', value: 25 },
        { name: 'Lab Equip', value: 20 },
        { name: 'Vehicles', value: 10 },
    ];

    const stockLevels = [
        { item: 'Projectors', stock: 12, min: 5, status: 'Healthy' },
        { item: 'Office Chairs', stock: 45, min: 50, status: 'Low' },
        { item: 'A4 Paper (Reams)', stock: 100, min: 20, status: 'Healthy' },
        { item: 'Marker Pens (Box)', stock: 2, min: 10, status: 'Critical' },
    ];

    return (
        <div className="space-y-6">
            {/* Valuation Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-sm">
                <p className="text-blue-100 font-medium text-sm">Total Asset Valuation (Est.)</p>
                <h2 className="text-3xl font-bold mt-1">₹ 2.4 Cr</h2>
                <div className="mt-4 flex gap-6 text-sm">
                    <div>
                        <span className="block opacity-70 text-xs">Assigned</span>
                        <span className="font-bold">1,240 Units</span>
                    </div>
                    <div>
                        <span className="block opacity-70 text-xs">In Stock</span>
                        <span className="font-bold">340 Units</span>
                    </div>
                    <div>
                        <span className="block opacity-70 text-xs">Repair</span>
                        <span className="font-bold">12 Units</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Asset Value Distribution</h4>
                    <ReportChart type="pie" data={assetValue} dataKey="value" height={250} colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']} />
                </div>

                <div className="bg-white border text-sm border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between">
                        <h4 className="font-bold text-gray-800">Inventory Alerts</h4>
                        <span className="text-xs text-red-500 font-bold">2 Critical Low</span>
                    </div>
                    <ReportTable
                        columns={[
                            { header: 'Item Name', key: 'item', className: 'font-medium' },
                            { header: 'Current Stock', key: 'stock' },
                            { header: 'Min Reqd', key: 'min', className: 'text-gray-400' },
                            {
                                header: 'Status',
                                key: 'status',
                                render: (row) => (
                                    <span className={`text-xs font-bold ${row.status === 'Critical' ? 'text-red-600' :
                                            row.status === 'Low' ? 'text-orange-500' : 'text-green-600'
                                        }`}>
                                        {row.status}
                                    </span>
                                )
                            }
                        ]}
                        data={stockLevels}
                    />
                </div>
            </div>
        </div>
    );
};

export default AssetReports;
