
import React from 'react';
import { MoreVertical, Eye, Box, Monitor, Wrench } from 'lucide-react';
import AssetStatusBadge from './AssetStatusBadge';

const AssetsTable = ({ assets, onView }) => {

    const getTypeIcon = (category) => {
        if (category?.toLowerCase().includes('it')) return <Monitor size={14} />;
        if (category?.toLowerCase().includes('furn')) return <Box size={14} />;
        return <Wrench size={14} />;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Asset Name / Tag</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Serial No.</th>
                            <th className="px-6 py-4 font-semibold">Location / User</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-center">Value</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {assets.map((asset) => (
                            <tr key={asset.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 bg-gray-100 border border-gray-200`}>
                                            {getTypeIcon(asset.category)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{asset.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{asset.code}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                                    {asset.category}
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                                    {asset.serialNumber || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-800 text-xs font-medium block">{asset.location}</span>
                                    {asset.assignedTo && <span className="text-[10px] text-gray-400">Assigned: {asset.assignedTo}</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <AssetStatusBadge status={asset.status} />
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-gray-600 text-xs">
                                    ${asset.value}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onView(asset)}
                                        className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {assets.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-sm">
                    No assets found matching filters.
                </div>
            )}
        </div>
    );
};

export default AssetsTable;
