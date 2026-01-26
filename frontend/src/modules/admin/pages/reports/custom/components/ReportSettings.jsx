import React from 'react';
import { FileText, Globe, Lock, Shield } from 'lucide-react';

const ReportSettings = ({ settings, onUpdate }) => {

    const handleChange = (key, value) => {
        onUpdate({ ...settings, [key]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Final Settings</h3>
                <p className="text-sm text-gray-500">Name your report and configure access permissions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Meta Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                placeholder="e.g., Q1 Fee Defaulters List"
                                value={settings.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 min-h-[100px]"
                            placeholder="Briefly describe what this report shows..."
                            value={settings.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>
                </div>

                {/* Visibility */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Access Control</h4>

                    <div className="space-y-3">
                        <label className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${settings.visibility === 'private' ? 'bg-white border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-100'}`}>
                            <div className={`mt-0.5 ${settings.visibility === 'private' ? 'text-indigo-600' : 'text-gray-400'}`}>
                                <Lock size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="private"
                                        checked={settings.visibility === 'private'}
                                        onChange={(e) => handleChange('visibility', e.target.value)}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-medium text-gray-900">Private Only</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 pl-6">Only visible to you (Author) and Super Admins.</p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${settings.visibility === 'role' ? 'bg-white border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-100'}`}>
                            <div className={`mt-0.5 ${settings.visibility === 'role' ? 'text-indigo-600' : 'text-gray-400'}`}>
                                <Shield size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="role"
                                        checked={settings.visibility === 'role'}
                                        onChange={(e) => handleChange('visibility', e.target.value)}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-medium text-gray-900">Share with Roles</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 pl-6">Assigned roles (e.g., HR Manager) can view this report.</p>
                            </div>
                        </label>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded text-indigo-600" checked disabled />
                            <span className="text-sm text-gray-600">Enforce Field-Level Security</span>
                        </label>
                        <p className="text-[10px] text-gray-400 pl-6 mt-0.5">Sensitive fields will be masked for unauthorized viewers automatically.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportSettings;
