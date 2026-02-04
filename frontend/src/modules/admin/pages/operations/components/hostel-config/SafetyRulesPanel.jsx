
import React, { useState } from 'react';
import { ShieldAlert, FileText, UserCheck } from 'lucide-react';

const SafetyRulesPanel = ({ isLocked, data = {}, onChange }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <ShieldAlert className="text-red-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Safety & Compliance</h3>
                    <p className="text-xs text-gray-500">Mandatory prerequisites for allocation.</p>
                </div>
            </div>

            <div className="p-6 space-y-4">

                {/* Rule 1 */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={data.mandatoryGuardian || false}
                            onChange={(e) => handleChange('mandatoryGuardian', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-red-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Local Guardian Details Mandatory</label>
                        <p className="text-xs text-gray-500 mt-1">
                            Block allocation if a local guardian contact is not attached to the student profile.
                        </p>
                    </div>
                </div>

                {/* Rule 2 */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={data.medicalInfo || false}
                            onChange={(e) => handleChange('medicalInfo', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-red-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Medical Record Required</label>
                        <p className="text-xs text-gray-500 mt-1">
                            Ensure blood group and allergy information is recorded before check-in.
                        </p>
                    </div>
                </div>

                {/* Rule 3 */}
                <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={data.wardenAssignment || false}
                            onChange={(e) => handleChange('wardenAssignment', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-red-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-red-900">Warden Approval Loop</label>
                        <p className="text-xs text-red-700 mt-1">
                            Allocation requires digital approval from the assigned Block Warden.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SafetyRulesPanel;
