import React from 'react';

const SimpleFinanceTable = ({ data, loading }) => {
    if (loading) {
        return null;
    }

    const rows = data?.reportData || data?.rows || [];

    if (!rows.length) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 h-72 flex flex-col items-center justify-center text-gray-400 text-sm">
                No finance data available for selected filters.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-left">Type</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.map((r, idx) => (
                        <tr key={idx}>
                            <td className="px-4 py-2 text-gray-700">{r.date || '-'}</td>
                            <td className="px-4 py-2 text-gray-700">{r.label || r.description || '-'}</td>
                            <td className="px-4 py-2 text-right font-semibold text-gray-900">
                                {typeof r.amount === 'number' ? r.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : r.amount || '-'}
                            </td>
                            <td className="px-4 py-2 text-gray-500 capitalize">{r.type || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SimpleFinanceTable;

