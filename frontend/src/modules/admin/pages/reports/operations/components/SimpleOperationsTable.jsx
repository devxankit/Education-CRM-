import React from 'react';

const mockRows = [
    { area: 'Transport Routes', metric: 'Active Routes', value: 12 },
    { area: 'Transport Routes', metric: 'Buses In Use', value: 8 },
    { area: 'Hostel', metric: 'Beds Occupied', value: 180 },
    { area: 'Hostel', metric: 'Beds Available', value: 40 },
    { area: 'Support', metric: 'Open Tickets', value: 5 }
];

const SimpleOperationsTable = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <th className="px-4 py-2 text-left">Area</th>
                        <th className="px-4 py-2 text-left">Metric</th>
                        <th className="px-4 py-2 text-right">Value</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {mockRows.map((r, idx) => (
                        <tr key={idx}>
                            <td className="px-4 py-2 text-gray-700">{r.area}</td>
                            <td className="px-4 py-2 text-gray-700">{r.metric}</td>
                            <td className="px-4 py-2 text-right font-semibold text-gray-900">{r.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SimpleOperationsTable;

