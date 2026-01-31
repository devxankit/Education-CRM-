
import React, { useState } from 'react';
import { Database, History, GitBranch, ArrowRight, Search, Filter, RotateCcw, Eye } from 'lucide-react';
import { dataChanges } from '../../../data/auditData';

const DataHistory = () => {

    // Mock Data
    const [changes, setChanges] = useState(dataChanges);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterModule, setFilterModule] = useState('all');

    const stats = {
        totalChanges: changes.length,
        todayChanges: changes.length,
        restorable: changes.filter(c => c.action === 'update').length,
    };

    const filteredChanges = changes.filter(change => {
        const matchesSearch = change.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            change.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
            change.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = filterModule === 'all' || change.module.toLowerCase() === filterModule.toLowerCase();
        return matchesSearch && matchesModule;
    });

    const getActionBadge = (action) => {
        const styles = {
            update: 'bg-blue-100 text-blue-700',
            delete: 'bg-red-100 text-red-700',
            create: 'bg-green-100 text-green-700',
        };
        return styles[action] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50 border-t border-gray-200 -mt-6 -mx-8 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Data Change History</h1>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-600 border border-purple-200 uppercase tracking-wider">
                            <Database size={12} /> Audit Trail
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Track all data modifications across the system with rollback capabilities.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="px-8 pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                        <History size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalChanges}</div>
                        <div className="text-xs text-gray-500">Total Changes</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <GitBranch size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.todayChanges}</div>
                        <div className="text-xs text-gray-500">Changes Today</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                        <RotateCcw size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.restorable}</div>
                        <div className="text-xs text-gray-500">Restorable</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden p-8 pt-4 flex flex-col">
                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">

                    {/* Filters */}
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50">
                        <div className="relative flex-1 max-w-md">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by entity, field, or user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={filterModule}
                                onChange={(e) => setFilterModule(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                            >
                                <option value="all">All Modules</option>
                                <option value="students">Students</option>
                                <option value="employees">Employees</option>
                                <option value="finance">Finance</option>
                                <option value="academics">Academics</option>
                            </select>
                        </div>
                    </div>

                    {/* Changes List */}
                    <div className="flex-1 overflow-auto">
                        <div className="divide-y divide-gray-100">
                            {filteredChanges.map((change) => (
                                <div key={change.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getActionBadge(change.action)}`}>
                                                    {change.action}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {change.entity}: {change.entityName}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {change.entityId}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                <span className="text-gray-500">Field:</span>
                                                <span className="font-medium text-gray-700">{change.field}</span>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="px-2 py-1 bg-red-50 text-red-700 rounded line-through">
                                                    {change.oldValue}
                                                </span>
                                                <ArrowRight size={14} className="text-gray-400" />
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                                                    {change.newValue}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                <span>By: {change.user}</span>
                                                <span>•</span>
                                                <span>{change.timestamp}</span>
                                                <span>•</span>
                                                <span className="px-2 py-0.5 bg-gray-100 rounded">{change.module}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            {change.action === 'update' && (
                                                <button className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Restore Previous Value">
                                                    <RotateCcw size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataHistory;
