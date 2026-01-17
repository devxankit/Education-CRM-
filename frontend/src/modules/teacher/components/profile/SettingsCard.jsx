import React, { useState } from 'react';
import { Bell, Lock, Smartphone, Moon, Globe, ChevronRight } from 'lucide-react';

const ToggleRow = ({ icon: Icon, label, description, checked, onChange, color = 'indigo' }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 mt-0.5`}>
                <Icon size={16} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-900">{label}</h4>
                {description && <p className="text-[10px] text-gray-400 font-medium leading-tight">{description}</p>}
            </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
    </div>
);

const SettingsCard = ({ preferences }) => {
    // Local state for UI toggling
    const [prefs, setPrefs] = useState(preferences);

    const handleToggle = (key, subKey = null) => {
        // Logic to update state (mock)
        console.log(`Toggled ${key}`);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Preferences & Security</h3>

            <div>
                <ToggleRow
                    icon={Bell}
                    label="Push Notifications"
                    description="Receive alerts for class & exams"
                    checked={true}
                    onChange={() => handleToggle('notifications')}
                />
                <ToggleRow
                    icon={Lock}
                    label="Two-Factor Auth"
                    description="Extra security for account"
                    checked={true}
                    onChange={() => handleToggle('2fa')}
                    color="emerald"
                />
                <ToggleRow
                    icon={Moon}
                    label="Dark Mode"
                    description="Easier on eyes"
                    checked={false}
                    onChange={() => handleToggle('theme')}
                    color="gray"
                />
            </div>
        </div>
    );
};

export default SettingsCard;
