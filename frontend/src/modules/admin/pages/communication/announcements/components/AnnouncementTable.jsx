
import React from 'react';
import { Megaphone, Users, Clock, Edit, Eye, Archive, BarChart2 } from 'lucide-react';

const AnnouncementTable = ({ announcements, onAction }) => {

    const getStatusColor = (s) => {
        switch (s) {
            case 'PUBLISHED': return 'bg-green-100 text-green-700';
            case 'SCHEDULED': return 'bg-purple-100 text-purple-700';
            case 'DRAFT': return 'bg-gray-100 text-gray-700';
            case 'ARCHIVED': return 'bg-gray-50 text-gray-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getCategoryBadge = (c) => {
        // General, Event, Academic Info, Sports / Activity, Administrative, Emergency
        switch (c) {
            case 'EMERGENCY': return 'bg-red-50 text-red-600 border-red-100';
            case 'EVENT': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'SPORTS': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Announcement Details</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Target Audience</th>
                        <th className="px-6 py-4">Channels</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {announcements.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                <Megaphone size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No announcements found. Broadcast your first message.</p>
                            </td>
                        </tr>
                    ) : (
                        announcements.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">

                                {/* 1. Details */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-pink-50 text-pink-600 rounded-lg shrink-0 mt-1">
                                            <Megaphone size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span className="font-mono">{item.id}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {item.publishDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* 2. Category */}
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadge(item.category)}`}>
                                        {item.category}
                                    </span>
                                </td>

                                {/* 3. Audience */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm text-gray-700">
                                        <Users size={16} className="text-gray-400" />
                                        <span>{item.audienceSummary}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 pl-5">
                                        {item.recipientCount} Recipients
                                    </div>
                                </td>

                                {/* 4. Channels */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-1.5">
                                        {item.channels.map(ch => (
                                            <span key={ch} className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-medium text-gray-600 uppercase">
                                                {ch}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                {/* 5. Status */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>

                                {/* 6. Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onAction('VIEW', item)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        {item.status === 'DRAFT' && (
                                            <button
                                                onClick={() => onAction('EDIT', item)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Announcement"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}
                                        {item.status !== 'DRAFT' && (
                                            <button
                                                onClick={() => onAction('STATS', item)}
                                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="View Delivery Stats"
                                            >
                                                <BarChart2 size={18} />
                                            </button>
                                        )}
                                        {item.status === 'PUBLISHED' && (
                                            <button
                                                onClick={() => onAction('ARCHIVE', item)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Archive"
                                            >
                                                <Archive size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>

                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AnnouncementTable;
