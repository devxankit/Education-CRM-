
import React, { useState } from 'react';
import { Users, Info } from 'lucide-react';

const SeatCapacityPanel = ({ isLocked }) => {

    const [rules, setRules] = useState({
        strictCapacity: true,
        waitlistEnabled: true,
        autoPromoteWaitlist: false
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setRules(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Users className="text-purple-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Seat Capacity & Waitlist</h3>
                    <p className="text-xs text-gray-500">Manage intake limits and overflow logic.</p>
                </div>
            </div>

            <div className="p-6 space-y-4">

                {/* Rule 1 */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={rules.strictCapacity}
                            onChange={(e) => handleChange('strictCapacity', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Enforce Strict Capacity Limits</label>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Automatically disable "Confirm Admission" button when section capacity is reached.
                        </p>
                    </div>
                </div>

                {/* Rule 2 */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={rules.waitlistEnabled}
                            onChange={(e) => handleChange('waitlistEnabled', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Enable Waiting List</label>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Allow applications to be marked as "Waitlisted" after capacity is full.
                        </p>
                    </div>
                </div>

                {/* Rule 3 */}
                <div className={`flex items-start gap-3 transition-opacity ${rules.waitlistEnabled ? '' : 'opacity-40 pointer-events-none'}`}>
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={rules.autoPromoteWaitlist}
                            onChange={(e) => handleChange('autoPromoteWaitlist', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Auto-Promote from Waitlist</label>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            If a confirmed seat is cancelled, automatically notify the top waitlisted candidate.
                        </p>
                    </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg flex gap-2 text-xs text-purple-700 border border-purple-100 mt-2">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    <p>Total Seat Count is derived from the sum of capacities of all active Sections defined in Academic Management.</p>
                </div>

            </div>
        </div>
    );
};

export default SeatCapacityPanel;
