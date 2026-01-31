import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Bell, ChevronRight, Clock, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';

const Notices = () => {
    const navigate = useNavigate();
    const notices = useStaffStore(state => state.notices);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');

    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || notice.category === filterCategory;
        const matchesPriority = filterPriority === 'All' || notice.priority === filterPriority;
        return matchesSearch && matchesCategory && matchesPriority;
    });

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-50 text-red-600 border-red-200';
            case 'Important': return 'bg-amber-50 text-amber-600 border-amber-200';
            default: return 'bg-blue-50 text-blue-600 border-blue-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Official Notices</h1>
                        <p className="text-xs text-gray-500">Circulars & Announcements</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Priorities</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Important">Important</option>
                        <option value="Normal">Normal</option>
                    </select>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {filteredNotices.map(notice => (
                    <div
                        key={notice.id}
                        onClick={() => navigate(`/staff/notices/${notice.id}`)}
                        className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group ${notice.status === 'Pending' ? 'border-l-4 border-l-indigo-500' : 'border-gray-200'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${getPriorityStyle(notice.priority)}`}>
                                    {notice.priority === 'Urgent' && <AlertTriangle size={10} />}
                                    {notice.priority}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                    {notice.category}
                                </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{notice.date}</span>
                        </div>

                        <h3 className={`text-sm ${notice.status === 'Pending' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'} mb-2 group-hover:text-indigo-600 transition-colors`}>
                            {notice.title}
                        </h3>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                            <span className="text-[10px] text-gray-400 font-mono">{notice.id}</span>
                            {notice.status === 'Read' ? (
                                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                    <CheckCircle size={10} /> Acknowledged
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                                    <Clock size={10} /> Action Required
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {filteredNotices.length === 0 && (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                            <Bell size={24} />
                        </div>
                        <h3 className="text-gray-900 font-bold text-sm">No Notices Found</h3>
                        <p className="text-gray-500 text-xs">You are all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notices;
