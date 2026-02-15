
import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, Unlock, AlertTriangle, Search, Filter, Eye, Ban, Loader2 } from 'lucide-react';
import { API_URL } from '@/app/api';

const SecurityAudit = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/logs/security?page=1&limit=100`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) setEvents(data.data);
            } catch (e) { console.error('Failed to fetch security logs', e); }
            finally { setLoading(false); }
        };
        fetchLogs();
    }, []);

    const stats = {
        critical: events.filter(e => !e.success).length,
        blocked: events.filter(e => e.action === 'account_locked').length,
        monitored: events.length,
    };

    const getSeverityBadge = (severity) => {
        const styles = {
            critical: 'bg-red-100 text-red-700 border-red-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            medium: 'bg-amber-100 text-amber-700 border-amber-200',
            low: 'bg-green-100 text-green-700 border-green-200',
        };
        return styles[severity] || 'bg-gray-100 text-gray-600';
    };

    const getStatusBadge = (status) => {
        const styles = {
            blocked: 'bg-red-50 text-red-600',
            investigating: 'bg-amber-50 text-amber-600',
            monitored: 'bg-blue-50 text-blue-600',
            reviewed: 'bg-green-50 text-green-600',
            completed: 'bg-gray-50 text-gray-600',
        };
        return styles[status] || 'bg-gray-50 text-gray-600';
    };

    const getEventTypeIcon = (type) => {
        const icons = {
            failed_login: Lock,
            permission_change: Shield,
            suspicious_activity: ShieldAlert,
            password_change: Unlock,
            session_hijack: AlertTriangle,
            access_denied: Ban,
        };
        return icons[type] || Shield;
    };

    const mapEvent = (e) => ({
        id: e._id,
        severity: e.success ? 'low' : 'critical',
        status: e.success ? 'reviewed' : 'investigating',
        details: e.message || e.action || '-',
        user: e.identifier || '-',
        ip: e.ipAddress || '-',
        location: '-',
        timestamp: e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' }) : '-',
        eventType: e.action || 'login_failed'
    });
    const filteredEvents = events
        .map(mapEvent)
        .filter(event => {
            const matchesSearch = !searchTerm || event.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (event.ip || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
            return matchesSearch && matchesSeverity;
        });

    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Security Audit</h1>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 uppercase tracking-wider">
                            <ShieldAlert size={12} /> Security
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor security events, login attempts, and access violations.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="px-8 pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-full">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.critical}</div>
                        <div className="text-xs text-gray-500">Critical Events</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                        <Ban size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.blocked}</div>
                        <div className="text-xs text-gray-500">Blocked Threats</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <Eye size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.monitored}</div>
                        <div className="text-xs text-gray-500">Under Monitoring</div>
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
                                placeholder="Search by user, IP, or details..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={filterSeverity}
                                onChange={(e) => setFilterSeverity(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                            >
                                <option value="all">All Severity</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="flex-1 overflow-auto">
                        {loading ? (
                            <div className="px-6 py-12 text-center text-gray-500"><Loader2 className="animate-spin inline" size={24} /> Loading...</div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500">No security logs found.</div>
                        ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredEvents.map((event) => {
                                const EventIcon = getEventTypeIcon(event.eventType);
                                return (
                                    <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${event.severity === 'critical' ? 'bg-red-100 text-red-600' :
                                                event.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                                                    event.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                <EventIcon size={20} />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getSeverityBadge(event.severity)}`}>
                                                        {event.severity}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusBadge(event.status)}`}>
                                                        {event.status}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {event.id}
                                                    </span>
                                                </div>

                                                <p className="text-sm font-medium text-gray-900 mb-2">
                                                    {event.details}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                                    <span>User: <strong>{event.user}</strong></span>
                                                    <span>•</span>
                                                    <span>IP: <code className="bg-gray-100 px-1 rounded">{event.ip}</code></span>
                                                    <span>•</span>
                                                    <span>Location: {event.location}</span>
                                                    <span>•</span>
                                                    <span>{event.timestamp}</span>
                                                </div>
                                            </div>

                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="View Details">
                                                <Eye size={16} />
                                            </button>
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

export default SecurityAudit;
