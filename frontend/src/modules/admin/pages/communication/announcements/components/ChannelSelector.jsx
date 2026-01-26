
import React, { useState } from 'react';
import { Mail, Bell, MessageSquare, AlertTriangle, Send } from 'lucide-react';

const ChannelSelector = ({ selectedChannels, onUpdate, isEmergency }) => {

    // For announcements, we might default to APP only unless critical
    const channels = [
        { id: 'APP', label: 'App Notification', icon: Bell, free: true },
        { id: 'EMAIL', label: 'Email', icon: Mail, free: true },
        { id: 'SMS', label: 'SMS', icon: MessageSquare, free: false }
    ];

    const toggleChannel = (id) => {
        if (selectedChannels.includes(id)) {
            if (selectedChannels.length === 1 && selectedChannels[0] === id) return;
            onUpdate(selectedChannels.filter(c => c !== id));
        } else {
            onUpdate([...selectedChannels, id]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {channels.map(chan => {
                    const Icon = chan.icon;
                    const isSelected = selectedChannels.includes(chan.id);
                    return (
                        <div
                            key={chan.id}
                            onClick={() => toggleChannel(chan.id)}
                            className={`
                                cursor-pointer flex-1 flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-center
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                                }
                            `}
                        >
                            <Icon size={18} className="mb-1.5" />
                            <div className="text-xs font-bold">{chan.label}</div>
                        </div>
                    );
                })}
            </div>

            {selectedChannels.includes('SMS') && (
                <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[10px] text-amber-800 flex gap-2">
                    <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                    SMS Credits will be deducted. Keep text under 160 characters.
                </div>
            )}
        </div>
    );
};

export default ChannelSelector;
