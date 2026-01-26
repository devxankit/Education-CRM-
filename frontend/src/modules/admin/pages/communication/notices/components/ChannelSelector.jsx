
import React, { useState } from 'react';
import { Mail, Bell, MessageSquare, AlertTriangle, Send } from 'lucide-react';

const ChannelSelector = ({ selectedChannels, onUpdate, priority }) => {

    const channels = [
        { id: 'APP', label: 'In-App Notification', icon: Bell, free: true },
        { id: 'EMAIL', label: 'Email Broadcast', icon: Mail, free: true },
        { id: 'SMS', label: 'SMS Alert', icon: MessageSquare, free: false }
    ];

    const toggleChannel = (id) => {
        if (selectedChannels.includes(id)) {
            // Cannot remove APP if it's the only one
            if (selectedChannels.length === 1 && selectedChannels[0] === id) return;
            onUpdate(selectedChannels.filter(c => c !== id));
        } else {
            onUpdate([...selectedChannels, id]);
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex flex-col gap-3">
                {channels.map(chan => {
                    const Icon = chan.icon;
                    const isSelected = selectedChannels.includes(chan.id);

                    return (
                        <div
                            key={chan.id}
                            onClick={() => toggleChannel(chan.id)}
                            className={`
                                cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{chan.label}</div>
                                    <div className="text-xs text-gray-500">
                                        {chan.id === 'APP' ? 'Delivered to mobile app & web dashboard' :
                                            chan.id === 'EMAIL' ? 'Sent to registered email addresses' :
                                                'Instant delivery to registered mobile number'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {!chan.free && (
                                    <div className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded">
                                        COSTS CREDIT
                                    </div>
                                )}
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'}`}>
                                    {isSelected && <Send size={12} />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Warning for SMS */}
            {selectedChannels.includes('SMS') && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm text-amber-800 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                    <div>
                        <span className="font-bold block">SMS Credits will be deducted</span>
                        <p className="text-xs opacity-90 mt-1">Please ensure content is concise (under 160 chars) to avoid double credit usage. 245 recipients selected = ~245 credits estimated.</p>
                    </div>
                </div>
            )}

            {/* Priority Note */}
            {priority === 'URGENT' && !selectedChannels.includes('SMS') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
                    <Bell className="shrink-0 mt-0.5" size={18} />
                    <div>
                        <span className="font-bold block">Recommendation</span>
                        <p className="text-xs opacity-90 mt-1">For 'Urgent' notices, we recommend enabling SMS to ensure immediate reach ability.</p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChannelSelector;
