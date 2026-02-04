
import React, { useState } from 'react';
import { MessageCircle, Mail, Smartphone, Bell, HelpCircle } from 'lucide-react';

const SupportChannelPanel = ({ isLocked, channels = [], onChange }) => {

    const iconMap = {
        in_app: HelpCircle,
        email: Mail,
        whatsapp: MessageCircle,
        mobile: Smartphone,
        sms: Bell
    };

    const toggleChannel = (id) => {
        if (isLocked) return;
        onChange(channels.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    };

    const toggleAck = (id) => {
        if (isLocked) return;
        onChange(channels.map(c => c.id === id ? { ...c, autoAck: !c.autoAck } : c));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <HelpCircle className="text-blue-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Support Channels</h3>
                    <p className="text-xs text-gray-500">Enable intake gateways via app/email.</p>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {channels.map((channel) => {
                    const Icon = iconMap[channel.id] || HelpCircle;
                    return (
                        <div key={channel.id} className={`border rounded-lg p-3 transition-all ${channel.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-75'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${channel.enabled ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">{channel.name}</span>
                                        <span className="text-[10px] text-gray-500">
                                            {channel.enabled ? 'Listening for new tickets' : 'Channel Disabled'}
                                        </span>
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
                                    <div className={`w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-blue-600`}></div>
                                </label>
                            </div>

                            {/* Auto Ack Setting */}
                            {channel.enabled && (
                                <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-gray-400">Auto-Acknowledge Reply</span>
                                    <input
                                        type="checkbox"
                                        checked={channel.autoAck}
                                        onChange={() => toggleAck(channel.id)}
                                        disabled={isLocked}
                                        className="w-3.5 h-3.5 text-blue-600 rounded cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SupportChannelPanel;
