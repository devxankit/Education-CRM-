
import React from 'react';
import { Building2, Info } from 'lucide-react';

const IdentitySection = ({ data, onChange, isLocked, hasActiveSession }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-indigo-600" />
                    <h2 className="font-semibold text-gray-800">Basic Identity</h2>
                </div>
                {isLocked && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Read Only</span>}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Administrator Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="adminName"
                        value={data.adminName}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Full name of the institution head/admin"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Institution Legal Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="legalName"
                        value={data.legalName}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="As registered in legal documents"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Short Name (Display)</label>
                    <input
                        type="text"
                        name="shortName"
                        value={data.shortName}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Institution Type <span className="text-red-500">*</span>
                        {hasActiveSession && <Info size={14} className="text-amber-500 cursor-help" title="Cannot change once academic year is active" />}
                    </label>
                    <select
                        name="type"
                        value={data.type}
                        onChange={onChange}
                        disabled={isLocked || hasActiveSession}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 bg-white"
                    >
                        <option value="">Select Type</option>
                        <option value="school">School (K-12)</option>
                        <option value="college">College</option>
                        <option value="university">University</option>
                        <option value="coaching">Coaching Institute</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Affiliation Type</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {['CBSE', 'ICSE', 'State Board', 'UGC', 'AICTE'].map((board) => (
                            <label key={board} className={`
                                inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer border-gray-200 text-sm hover:bg-gray-50
                                ${data.affiliations?.includes(board) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'text-gray-600'}
                                ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}
                            `}>
                                <input
                                    type="checkbox"
                                    name="affiliations"
                                    value={board}
                                    checked={data.affiliations?.includes(board)}
                                    // Handle multi-select logic in parent or simple toggle
                                    onChange={onChange}
                                    disabled={isLocked}
                                    className="accent-indigo-600"
                                />
                                {board}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Medium of Instruction</label>
                    <select
                        name="medium"
                        value={data.medium}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 bg-white"
                    >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="regional">Regional</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default IdentitySection;
