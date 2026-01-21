
import React, { useState } from 'react';

const PromotionRulesConfig = ({ isLocked }) => {

    const [rules, setRules] = useState({
        minAttendance: 75,
        failSubjectLimit: 2, // Max failures allowed before detention
        graceMarksLimit: 10,
        allowConditionPromotion: true
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setRules(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Promotion & Detention Criteria</h3>
                <p className="text-sm text-gray-500">Rules deciding student eligibility for the next academic level.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Core Requirements</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Minimum Attendance Required (%)</label>
                            <input
                                type="number" value={rules.minAttendance} min="0" max="100"
                                disabled={isLocked}
                                onChange={(e) => handleChange('minAttendance', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Max Failed Subjects (for Compartment)</label>
                            <select
                                value={rules.failSubjectLimit}
                                disabled={isLocked}
                                onChange={(e) => handleChange('failSubjectLimit', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            >
                                <option value="1">1 Subject</option>
                                <option value="2">2 Subjects</option>
                                <option value="3">3 Subjects (Strict)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Grace & Exceptions</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Max Grace Marks (Total Cap)</label>
                            <input
                                type="number" value={rules.graceMarksLimit}
                                disabled={isLocked}
                                onChange={(e) => handleChange('graceMarksLimit', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Maximum extra marks a moderator can award to pass a student.</p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox" id="condProm"
                                checked={rules.allowConditionPromotion}
                                disabled={isLocked}
                                onChange={(e) => handleChange('allowConditionPromotion', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded"
                            />
                            <label htmlFor="condProm" className="text-sm text-gray-700 cursor-pointer">Allow Conditional Promotion (with Warning)</label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PromotionRulesConfig;
