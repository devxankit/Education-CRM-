import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertOctagon } from 'lucide-react';

// Sub Components
import AuditFilters from './components/AuditFilters';
import AuditLogTable from './components/AuditLogTable';

const UserActivityAudit = () => {

    // Mock Data
    const initialLogs = [
        { id: 'LOG-1001', timestamp: '2025-01-26 21:45:10', user: 'Admin User', role: 'admin', actionType: 'update', action: 'Modified System Settings', module: 'Settings', ip: '192.168.1.5', status: 'success', details: { section: 'Backup', changes: { frequency: 'daily' } } },
        { id: 'LOG-1002', timestamp: '2025-01-26 21:30:05', user: 'Principal Skinner', role: 'staff', actionType: 'login', action: 'User Login', module: 'Auth', ip: '10.0.0.42', status: 'success', userAgent: 'Chrome 120 / Windows' },
        { id: 'LOG-1003', timestamp: '2025-01-26 21:15:22', user: 'John Doe', role: 'student', actionType: 'security', action: 'Failed Login Attempt', module: 'Auth', ip: '203.110.4.1', status: 'failure', details: { reason: 'Invalid Password', attempts: 3 } },
        { id: 'LOG-1004', timestamp: '2025-01-26 20:55:00', user: 'System Bot', role: 'system', actionType: 'create', action: 'Generated Monthly Report', module: 'Reports', ip: 'localhost', status: 'success' },
        { id: 'LOG-1005', timestamp: '2025-01-26 20:40:15', user: 'HR Manager', role: 'staff', actionType: 'update', action: 'Updated Employee Salary', module: 'Payroll', ip: '192.168.1.8', status: 'success' },
        { id: 'LOG-1006', timestamp: '2025-01-26 19:20:30', user: 'Admin User', role: 'admin', actionType: 'delete', action: 'Deleted Student Record', module: 'Students', ip: '192.168.1.5', status: 'success', details: { studentId: 'ST-2024-005', reason: 'Duplicate Entry' } },
        { id: 'LOG-1007', timestamp: '2025-01-26 19:10:00', user: 'Unknown', role: 'guest', actionType: 'security', action: 'Suspicious API Call', module: 'API Gateway', ip: '45.2.1.99', status: 'failure', details: { endpoint: '/api/v1/admin/users', error: '403 Forbidden' } },
    ];

    const [logs, setLogs] = useState(initialLogs);
    const [stats, setStats] = useState({ totalError: 2, totalActive: 15, securityAlerts: 1 });

    // Mock filtering logic
    const handleFilterChange = (key, value) => {
        if (value === 'all' || value === '') {
            setLogs(initialLogs);
        } else if (key === 'search') {
            const term = value.toLowerCase();
            setLogs(initialLogs.filter(l => l.user.toLowerCase().includes(term) || l.action.toLowerCase().includes(term)));
        } else if (key === 'type') {
            setLogs(initialLogs.filter(l => l.actionType === value));
        } else if (key === 'role') {
            setLogs(initialLogs.filter(l => l.role === value));
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50 border-t border-gray-200 -mt-6 -mx-8 relative">

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
                        <div className="text-2xl font-bold text-gray-900">1,240</div>
                        <div className="text-xs text-gray-500">Events Today</div>
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
                    <AuditLogTable logs={logs} />
                </div>
            </div>

        </div>
    );
};

export default UserActivityAudit;
