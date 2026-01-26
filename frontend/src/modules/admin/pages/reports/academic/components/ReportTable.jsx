
import React from 'react';
import { Download, Printer } from 'lucide-react';

const ReportTable = ({ columns, data }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">

            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <h4 className="font-bold text-gray-800">Detailed Data</h4>
                <div className="flex gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="Print for records"><Printer size={16} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Download CSV"><Download size={16} /></button>
                </div>
            </div>

            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400 italic">
                                    No records found for selected filters.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((col, cIdx) => (
                                        <td key={cIdx} className="px-6 py-3 text-sm text-gray-700">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-center text-gray-500">
                Showing {data.length} records • Confidential Report
            </div>
        </div>
    );
};

export default ReportTable;
