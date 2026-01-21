
import React, { useState } from 'react';
import { ThumbsUp, AlertTriangle } from 'lucide-react';

const ConsentRulesPanel = ({ isLocked }) => {

    const [rules, setRules] = useState({
        whatsappOptIn: true,
        allowUnsubscribe: true,
        parentConsent: false
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setRules(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <ThumbsUp className="text-teal-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Consent & Compliance</h3>
                    <p className="text-xs text-gray-500">Legal requirements for messaging.</p>
                </div>
            </div>

            <div className="p-6 space-y-4">

                {/* Rule 1 */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={rules.whatsappOptIn}
                            onChange={(e) => handleChange('whatsappOptIn', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Strict WhatsApp Opt-in</label>
                        <p className="text-xs text-gray-500 mt-1">
                            Only send WhatsApp messages to numbers that have explicitly opted-in via the portal.
                        </p>
                    </div>
                </div>

                {/* Rule 2 */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={rules.allowUnsubscribe}
                            onChange={(e) => handleChange('allowUnsubscribe', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Mandatory Unsubscribe Link</label>
                        <p className="text-xs text-gray-500 mt-1">
                            Append an opt-out link to all promotional emails/SMS automatically.
                        </p>
                    </div>
                </div>

                {/* Rule 3 */}
                <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={rules.parentConsent}
                            onChange={(e) => handleChange('parentConsent', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-red-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-red-900">Parental Content Consent</label>
                        <p className="text-xs text-red-700 mt-1">
                            Block sending photos/student achievements without signed media release form.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConsentRulesPanel;
