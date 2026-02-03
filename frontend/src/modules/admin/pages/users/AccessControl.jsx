
import React, { useState, useEffect, useCallback } from 'react';
import { Smartphone, Globe, Clock, AlertTriangle, Save } from 'lucide-react';
import { API_URL } from '../../../../app/api';

const AccessControl = () => {
    // Data States
    const [policies, setPolicies] = useState({
        force2FA: false,
        sessionTimeout: 30,
        maxLoginAttempts: 3,
        ipWhitelistEnabled: false,
        passwordExpiryDays: 90
    });
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);

    // -- API Calls --

    const fetchPolicies = useCallback(async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/access-control`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success && data.data) {
                setPolicies(data.data);
            }
        } catch (error) {
            console.error('Error fetching policies:', error);
            alert('Failed to load security policies');
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/access-control`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(policies)
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
                <p className="text-gray-500 text-sm">Configure global login security and session constraints.</p>
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
                                <p className="text-xs text-gray-500">Require OTP for all Staff logins.</p>
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

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Rotation (Days)</label>
                                <input
                                    type="number"
                                    value={policies.passwordExpiryDays}
                                    onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value))}
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
                                <p className="text-xs text-gray-500">Only allow login from recognized office IPs.</p>
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

                        <div className="pt-4 border-t border-gray-50">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" /> Inactive Session Timeout (Minutes)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range" min="5" max="120" step="5"
                                    value={policies.sessionTimeout}
                                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                                    className="w-full accent-indigo-600 cursor-pointer"
                                />
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded w-16 text-center">{policies.sessionTimeout}m</span>
                            </div>
                        </div>
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

