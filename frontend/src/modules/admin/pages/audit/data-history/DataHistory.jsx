
import React, { useState, useEffect } from 'react';
import { Database, History, GitBranch, ArrowRight, Search, Filter, RotateCcw, Eye, Loader2 } from 'lucide-react';
import { API_URL } from '@/app/api';

const DataHistory = () => {
    const [changes, setChanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModule, setFilterModule] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/logs/data-change?page=1&limit=100`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) setChanges(data.data);
            } catch (e) { console.error('Failed to fetch data change logs', e); }
            finally { setLoading(false); }
        };
        fetchLogs();
    }, []);

    const stats = {
        totalChanges: changes.length,
        todayChanges: changes.filter(c => c.createdAt && new Date(c.createdAt).toDateString() === new Date().toDateString()).length,
        restorable: changes.filter(c => c.action === 'update').length,
    };

    const filteredChanges = changes.filter(change => {
        const entityName = (change.entityType || '').toLowerCase();
        const field = (change.changedFields?.join(' ') || change.description || '').toLowerCase();
        const user = (change.changedByEmail || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || entityName.includes(term) || field.includes(term) || user.includes(term);
        const matchesModule = filterModule === 'all' || (change.entityType || '').toLowerCase() === filterModule.toLowerCase();
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
        <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 relative">

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
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="FeeStructure">Fee</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>
                    </div>

                    {/* Changes List */}
                    <div className="flex-1 overflow-auto">
                        {loading ? (
                            <div className="px-6 py-12 text-center text-gray-500"><Loader2 className="animate-spin inline" size={24} /> Loading...</div>
                        ) : filteredChanges.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500">No data change logs found.</div>
                        ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredChanges.map((change) => {
                                const entityIdStr = change.entityId?.toString?.() ?? change.entityId;
                                const fieldStr = Array.isArray(change.changedFields) ? change.changedFields.join(', ') : (change.changedFields || '-');
                                const oldVal = change.oldValue != null ? (typeof change.oldValue === 'object' ? JSON.stringify(change.oldValue).slice(0, 80) : String(change.oldValue)) : '-';
                                const newVal = change.newValue != null ? (typeof change.newValue === 'object' ? JSON.stringify(change.newValue).slice(0, 80) : String(change.newValue)) : '-';
                                const timestamp = change.createdAt ? new Date(change.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' }) : '-';
                                return (
                                <div key={change._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getActionBadge(change.action)}`}>
                                                    {change.action}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {change.entityType}: {entityIdStr?.slice(-8)}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {entityIdStr}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                <span className="text-gray-500">Fields:</span>
                                                <span className="font-medium text-gray-700">{fieldStr}</span>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="px-2 py-1 bg-red-50 text-red-700 rounded line-through max-w-xs truncate">
                                                    {oldVal}
                                                </span>
                                                <ArrowRight size={14} className="text-gray-400 shrink-0" />
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded max-w-xs truncate">
                                                    {newVal}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                <span>By: {change.changedByEmail || '-'}</span>
                                                <span>•</span>
                                                <span>{timestamp}</span>
                                                <span>•</span>
                                                <span className="px-2 py-0.5 bg-gray-100 rounded">{change.entityType}</span>
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
                                );
                            })}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataHistory;
