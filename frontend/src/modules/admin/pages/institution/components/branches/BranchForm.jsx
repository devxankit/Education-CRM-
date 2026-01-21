
import React from 'react';
import { Info, MapPin, Settings2, ShieldAlert } from 'lucide-react';

const BranchForm = ({ formData, onChange, isEditing, isSuperAdmin }) => {

    // Helper for Section Header
    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Icon size={16} className="text-gray-500" />
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h4>
        </div>
    );

    return (
        <div className="space-y-8">

            {/* SECTION 1: IDENTITY */}
            <div>
                <SectionHeader icon={Settings2} title="Branch Identity" />
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Internal Code</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={onChange}
                            disabled={isEditing} // Immutable if editing
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                            placeholder="e.g. BR-PUNE-01"
                        />
                        {isEditing && <p className="text-[10px] text-gray-400 mt-1">Branch Code acts as a primary key and cannot be changed.</p>}
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Campus Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            disabled={!isSuperAdmin && isEditing} // Only Super Admin edits identity
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Main Campus - North Wing"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={onChange}
                                disabled={!isSuperAdmin}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 outline-none"
                            >
                                <option value="school">School</option>
                                <option value="college">College</option>
                                <option value="training_center">Training Center</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Est. Year</label>
                            <input
                                type="number"
                                name="establishedYear"
                                value={formData.establishedYear}
                                onChange={onChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: CONTACT */}
            <div>
                <SectionHeader icon={MapPin} title="Location & Contact" />
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={onChange}
                            rows="2"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={onChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={onChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={onChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: RULES - Only Super Admin */}
            {isSuperAdmin && (
                <div>
                    <SectionHeader icon={ShieldAlert} title="Operational Rules" />
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-sm font-semibold text-orange-900">Allow Admissions</h5>
                                <p className="text-xs text-orange-700">If disabled, front-desk cannot enroll new students here.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="allowAdmissions"
                                    checked={formData.allowAdmissions}
                                    onChange={onChange}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-sm font-semibold text-orange-900">Allow Fee Collection</h5>
                                <p className="text-xs text-orange-700">Freeze accounts module for this branch.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="allowFeeCollection"
                                    checked={formData.allowFeeCollection}
                                    onChange={onChange}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchForm;
