import React from 'react';

const ReportTable = ({ columns, data, highlightRowCondition }) => {

    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center bg-gray-50 border border-gray-100 rounded-lg text-gray-500 text-sm">
                No matching records found for the selected filters.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 uppercase tracking-wider text-xs">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.map((row, rowIndex) => {
                        const isHighlighted = highlightRowCondition ? highlightRowCondition(row) : false;
                        return (
                            <tr
                                key={rowIndex}
                                className={`
                                    hover:bg-gray-50 transition-colors
                                    ${isHighlighted ? 'bg-red-50 hover:bg-red-100' : ''}
                                `}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={`px-4 py-3 text-gray-700 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ReportTable;
