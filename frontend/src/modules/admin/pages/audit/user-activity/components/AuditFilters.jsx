import React from 'react';
import { Filter, Calendar, Search, Download } from 'lucide-react';

const AuditFilters = ({ onFilterChange }) => {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Search by User, IP, or Event ID..."
                    onChange={(e) => onFilterChange('search', e.target.value)}
                />
            </div>

            {/* Filter Group */}
            <div className="flex gap-3 w-full md:w-auto">

                <div className="relative">
                    <select
                        className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                        onChange={(e) => onFilterChange('type', e.target.value)}
                    >
                        <option value="all">All Events</option>
                        <option value="login">Login / Auth</option>
                        <option value="create">Data Creation</option>
                        <option value="update">Updates / Edits</option>
                        <option value="delete">Deletions</option>
                        <option value="security">Security Alerts</option>
                    </select>
                    <Filter size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                        onChange={(e) => onFilterChange('role', e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="staff">Staff / Teachers</option>
                        <option value="system">System (Automated)</option>
                    </select>
                    <Filter size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>

                <button
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-300"
                    title="Export Logs"
                >
                    <Download size={18} />
                </button>
            </div>

        </div>
    );
};

export default AuditFilters;
