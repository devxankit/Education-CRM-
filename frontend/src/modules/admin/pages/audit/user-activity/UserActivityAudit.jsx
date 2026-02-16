import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertOctagon, Loader2 } from 'lucide-react';
import { API_URL } from '@/app/api';
import AuditFilters from './components/AuditFilters';
import AuditLogTable from './components/AuditLogTable';

const mapActivityLog = (log) => ({
    id: log._id,
    timestamp: log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' }) : '-',
    user: log.userName || log.userEmail || 'Unknown',
    role: log.userModel || 'staff',
    actionType: log.action === 'login' ? 'login' : log.action?.includes('delete') ? 'delete' : log.action?.includes('update') || log.action?.includes('updated') ? 'update' : log.action?.includes('add') || log.action?.includes('record') ? 'create' : 'update',
    action: log.action?.replace(/_/g, ' ') || log.description || '-',
    module: log.entityType || 'General',
    ip: log.ipAddress || '-',
    status: 'success',
    details: log.description || log.metadata
});

const UserActivityAudit = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ action: '', startDate: '', endDate: '' });
    const [stats, setStats] = useState({ totalError: 0, totalActive: 0, securityAlerts: 0 });

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({ page, limit: 50, ...filters });
            const res = await fetch(`${API_URL}/logs/activity?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setLogs(data.data.map(mapActivityLog));
                setTotal(data.total ?? data.data.length);
                setStats({ totalActive: data.total ?? 0, totalError: 0, securityAlerts: 0 });
            }
        } catch (e) {
            console.error('Failed to fetch activity logs', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, [page, filters.action, filters.startDate, filters.endDate]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        if (key === 'search' && value) setFilters(prev => ({ ...prev, action: value }));
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">User Activity Logs</h1>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
                            <Activity size={12} /> Live Monitor
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Track user actions, login attempts, and data modifications across the system.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="px-8 pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                        <Activity size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{loading ? '...' : total}</div>
                        <div className="text-xs text-gray-500">Total Events</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-full">
                        <AlertOctagon size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalError}</div>
                        <div className="text-xs text-gray-500">Failed / Errors</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">100%</div>
                        <div className="text-xs text-gray-500">Uptime today</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden p-8 pt-4 flex flex-col">
                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <AuditFilters onFilterChange={handleFilterChange} />
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center gap-2 text-gray-500 py-12">
                            <Loader2 className="animate-spin" size={24} /> Loading activity logs...
                        </div>
                    ) : (
                        <AuditLogTable logs={logs} />
                    )}
                </div>
            </div>

        </div>
    );
};

export default UserActivityAudit;
