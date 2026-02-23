
import React, { useState, useEffect, useCallback } from 'react';
import { Smartphone, Globe, AlertTriangle, Save, Plus, Trash2, MapPin, Filter } from 'lucide-react';
import { API_URL } from '@/app/api';

const AccessControl = () => {
    // Data States
    const [policies, setPolicies] = useState({
        force2FA: false,
        sessionTimeout: 30,
        maxLoginAttempts: 3,
        lockoutMinutes: 15,
        ipWhitelistEnabled: false,
        ipWhitelist: [],
        passwordExpiryDays: 90
    });
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('all');

    // -- API Calls --

    const fetchBranches = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/branch?activeOnly=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setBranches(data.data || []);
        } catch (e) {
            console.error('Error fetching branches:', e);
        }
    }, []);

    const fetchPolicies = useCallback(async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const url = selectedBranchId && selectedBranchId !== 'all'
                ? `${API_URL}/access-control?branchId=${selectedBranchId}`
                : `${API_URL}/access-control`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success && data.data) {
                const d = data.data;
                setPolicies({
                    force2FA: d.force2FA ?? false,
                    sessionTimeout: d.sessionTimeout ?? 30,
                    maxLoginAttempts: d.maxLoginAttempts ?? 3,
                    lockoutMinutes: d.lockoutMinutes ?? 15,
                    ipWhitelistEnabled: d.ipWhitelistEnabled ?? false,
                    ipWhitelist: Array.isArray(d.ipWhitelist) ? d.ipWhitelist : [],
                    passwordExpiryDays: d.passwordExpiryDays ?? 90
                });
            }
        } catch (error) {
            console.error('Error fetching policies:', error);
            alert('Failed to load security policies');
        } finally {
            setFetching(false);
        }
    }, [selectedBranchId]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const toSave = {
                ...policies,
                branchId: selectedBranchId && selectedBranchId !== 'all' ? selectedBranchId : 'all',
                ipWhitelist: (policies.ipWhitelist || []).filter(ip => String(ip).trim())
            };
            const response = await fetch(`${API_URL}/access-control`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(toSave)
            });

            const result = await response.json();
            if (result.success) {
                alert('Security policies updated successfully');
            } else {
                alert(result.message || 'Failed to update policies');
            }
        } catch (error) {
            console.error('Error saving policies:', error);
            alert('An error occurred while saving policies');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setPolicies(prev => ({ ...prev, [key]: value }));
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading Security Policies...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Access Control Policies</h1>
                <p className="text-gray-500 text-sm">Configure login security and session constraints per branch.</p>
                <div className="flex items-center gap-2 mt-4">
                    <Filter size={16} className="text-gray-400" />
                    <MapPin size={16} className="text-indigo-500" />
                    <select
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
                    >
                        <option value="all">All Branches (Default)</option>
                        {branches.map(b => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-6">

                {/* 2FA & Auth */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-indigo-50/50 flex items-center gap-2">
                        <Smartphone size={18} className="text-indigo-600" />
                        <h2 className="font-semibold text-gray-800">Authentication & 2FA</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">Enforce Multi-Factor Authentication</h4>
                                <p className="text-xs text-gray-500">OTP will be sent to staff email at login when enabled.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={policies.force2FA}
                                    onChange={(e) => handleChange('force2FA', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Failed Attempts</label>
                                <select
                                    value={policies.maxLoginAttempts}
                                    onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="3">3 Attempts (Strict)</option>
                                    <option value="5">5 Attempts (Standard)</option>
                                    <option value="10">10 Attempts (Loose)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lockout Duration (Minutes)</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="120"
                                    value={policies.lockoutMinutes ?? 15}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        handleChange('lockoutMinutes', isNaN(v) || v < 5 ? 15 : Math.min(120, v));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                    placeholder="15"
                                />
                                <p className="text-xs text-gray-500 mt-0.5">Block after max failed attempts</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Rotation (Days)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={policies.passwordExpiryDays}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        handleChange('passwordExpiryDays', isNaN(v) || v < 1 ? 90 : v);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session & Network */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-indigo-50/50 flex items-center gap-2">
                        <Globe size={18} className="text-indigo-600" />
                        <h2 className="font-semibold text-gray-800">Session & Network</h2>
                    </div>
                    <div className="p-6 space-y-4">

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">IP Whitelisting</h4>
                                <p className="text-xs text-gray-500">Only allow Staff login from recognized office IPs.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={policies.ipWhitelistEnabled}
                                    onChange={(e) => handleChange('ipWhitelistEnabled', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {policies.ipWhitelistEnabled && (
                            <div className="pt-4 border-t border-gray-50">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Allowed IPs</label>
                                <div className="space-y-2">
                                    {(Array.isArray(policies.ipWhitelist) ? policies.ipWhitelist : []).map((ip, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={ip}
                                                onChange={(e) => {
                                                    const list = [...(policies.ipWhitelist || [])];
                                                    list[idx] = e.target.value;
                                                    handleChange('ipWhitelist', list);
                                                }}
                                                placeholder="IPv4 Address"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const list = [...(policies.ipWhitelist || [])];
                                                    list.splice(idx, 1);
                                                    handleChange('ipWhitelist', list);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleChange('ipWhitelist', [...(policies.ipWhitelist || []), ''])}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <Plus size={16} /> Add IP
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm text-amber-800">
                    <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                    <p>Changes to Security Policies will affect user processing immediately. Active sessions might be challenged for re-authentication.</p>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm font-medium disabled:opacity-50"
                    >
                        {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={18} />}
                        {loading ? 'Updating...' : 'Update Policies'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AccessControl;

