
import React from 'react';
import { Scale, Lock } from 'lucide-react';

const LegalDetailsSection = ({ data, onChange, isLocked }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Scale size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Legal & Compliance</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Registration Number</label>
                    <input
                        type="text"
                        name="registrationNumber"
                        value={data.registrationNumber}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Affiliation Code</label>
                    <input
                        type="text"
                        name="affiliationCode"
                        value={data.affiliationCode}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        PAN Number
                        {data.panNumber && isLocked && <Lock size={12} className="text-gray-400" />}
                    </label>
                    <input
                        type="text"
                        name="panNumber"
                        value={data.panNumber}
                        onChange={onChange}
                        // PAN is permanently locked via isLocked if strictly followed, or strictly backend logic. 
                        // UI just respects the general lock for now.
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 uppercase font-mono"
                        placeholder="ABCDE1234F"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">GST Number (Optional)</label>
                    <input
                        type="text"
                        name="gstNumber"
                        value={data.gstNumber}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 uppercase font-mono"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Year of Establishment</label>
                    <input
                        type="number"
                        name="establishedYear"
                        value={data.establishedYear}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="YYYY"
                    />
                </div>
            </div>

            <div className="px-6 py-3 bg-blue-50/50 border-t border-blue-100 flex items-start gap-2">
                <InfoIcon className="text-blue-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-blue-700">These details will appear on official certificates, transfer certificates, and fee receipts.</p>
            </div>
        </div>
    );
};

// Helper for icon
const InfoIcon = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
);

export default LegalDetailsSection;
