
import React, { useState } from 'react';
import { MessageSquare, Mail, Smartphone, Bell, Clock } from 'lucide-react';

const ChannelConfigPanel = ({ isLocked }) => {

    // Mock Channels
    const [channels, setChannels] = useState([
        { id: 'sms', name: 'SMS', icon: Smartphone, enabled: true, limit: 1000, start: '08:00', end: '20:00', provider: 'Twilio' },
        { id: 'email', name: 'Email', icon: Mail, enabled: true, limit: 5000, start: '00:00', end: '23:59', provider: 'AWS SES' },
        { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, enabled: false, limit: 500, start: '09:00', end: '18:00', provider: 'Interakt' },
        { id: 'push', name: 'In-App Push', icon: Bell, enabled: true, limit: 10000, start: '06:00', end: '22:00', provider: 'Firebase' },
    ]);

    const handleChange = (id, field, value) => {
        if (isLocked) return;
        setChannels(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const toggleChannel = (id) => {
        if (isLocked) return;
        setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <MessageSquare className="text-blue-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Communication Channels</h3>
                    <p className="text-xs text-gray-500">Enable gateways & set operational windows.</p>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {channels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                        <div key={channel.id} className={`border rounded-lg p-4 transition-all ${channel.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-75'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${channel.enabled ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{channel.name}</h4>
                                        <p className="text-[10px] text-gray-500">Gateway: {channel.provider}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={channel.enabled}
                                        disabled={isLocked}
                                        onChange={() => toggleChannel(channel.id)}
                                    />
                                    <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-blue-600`}></div>
                                </label>
                            </div>

                            {/* Settings - Only visible if enabled */}
                            {channel.enabled && (
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Daily Limit</label>
                                        <input
                                            type="number"
                                            value={channel.limit}
                                            disabled={isLocked}
                                            onChange={(e) => handleChange(channel.id, 'limit', e.target.value)}
                                            className="w-full text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1.5 rounded border border-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
                                            <Clock size={10} /> Time Window
                                        </label>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="time"
                                                value={channel.start}
                                                disabled={isLocked}
                                                onChange={(e) => handleChange(channel.id, 'start', e.target.value)}
                                                className="w-full text-xs text-gray-700 bg-gray-50 px-1 py-1.5 rounded border border-gray-200"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="time"
                                                value={channel.end}
                                                disabled={isLocked}
                                                onChange={(e) => handleChange(channel.id, 'end', e.target.value)}
                                                className="w-full text-xs text-gray-700 bg-gray-50 px-1 py-1.5 rounded border border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChannelConfigPanel;
