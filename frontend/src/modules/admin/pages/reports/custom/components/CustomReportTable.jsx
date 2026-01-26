import React from 'react';
import ReportTable from '../../../../components/reports/ReportTable';
import ReportStatusBadge from './ReportStatusBadge';
import { Eye, Edit2, Files, Trash2, MoreHorizontal } from 'lucide-react';

const CustomReportTable = ({ reports, onView, onEdit, onDelete }) => {

    const columns = [
        {
            header: 'Report Name',
            key: 'name',
            className: 'font-medium text-gray-900',
            render: (row) => (
                <div>
                    <span className="block">{row.name}</span>
                    <span className="text-xs text-gray-400">{row.description}</span>
                </div>
            )
        },
        {
            header: 'Data Source',
            key: 'source',
            render: (row) => <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 border border-gray-200">{row.source}</span>
        },
        {
            header: 'Created By',
            key: 'author',
            className: 'text-gray-600'
        },
        {
            header: 'Visibility',
            key: 'visibility',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    {row.visibility === 'private' ? 'Private' : 'Shared'}
                </div>
            )
        },
        {
            header: 'Status',
            key: 'status',
            render: (row) => <ReportStatusBadge status={row.status} />
        },
        {
            header: 'Last Modified',
            key: 'updatedAt',
            className: 'text-gray-500 text-xs'
        },
        {
            header: '',
            key: 'actions',
            align: 'right',
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onView(row)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="View Report"
                    >
                        <Eye size={16} />
                    </button>
                    {row.status === 'Draft' && (
                        <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Edit Draft"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(row.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Archive"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <ReportTable
                columns={columns}
                data={reports}
            />
        </div>
    );
};

export default CustomReportTable;
