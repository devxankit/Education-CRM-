
import React, { useState } from 'react';
import { CalendarRange, Lock, Unlock, AlertTriangle } from 'lucide-react';

const AdmissionWindowPanel = ({ isLocked }) => {

    const [rules, setRules] = useState({
        isOpen: true,
        startDate: '2025-03-01',
        endDate: '2025-06-30',
        allowLate: false,
        lateFeeApplicable: false
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setRules(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CalendarRange className="text-indigo-600" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Admission Window & Timeline</h3>
                        <p className="text-xs text-gray-500">Define when the admission portal accepts new applications.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${rules.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {rules.isOpen ? 'Admissions Open' : 'Closed'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={rules.isOpen}
                            disabled={isLocked}
                            onChange={(e) => handleChange('isOpen', e.target.checked)}
                        />
                        <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-green-600`}></div>
                    </label>
                </div>
            </div>

            <div className={`p-6 ${!rules.isOpen ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Window Period</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={rules.startDate}
                                disabled={isLocked}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500"
                            />
                            <span className="text-gray-400 text-xs">to</span>
                            <input
                                type="date"
                                value={rules.endDate}
                                disabled={isLocked}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-end">
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-start gap-3">
                            <div className="mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={rules.allowLate}
                                    onChange={(e) => handleChange('allowLate', e.target.checked)}
                                    disabled={isLocked}
                                    className="w-4 h-4 text-orange-600 rounded cursor-pointer disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-orange-900">Allow Late Admissions</label>
                                <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                                    If enabled, forms can be submitted after End Date but will be marked as "Late Application".
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdmissionWindowPanel;
