
import React, { useState } from 'react';
import { UserPlus, Search, Link } from 'lucide-react';

const Step2_ParentGuardian = ({ data, onChange }) => {

    // data.parentMode: 'link' | 'create'
    const [mode, setMode] = useState(data.parentMode || 'link');
    const [searchQuery, setSearchQuery] = useState('');

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value, parentMode: mode });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <UserPlus className="text-indigo-600" /> Parent / Guardian Details
                </h3>
                <p className="text-sm text-gray-500">Link an existing guardian or create a new student-guardian relationship.</p>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
                <button
                    onClick={() => { setMode('link'); handleChange('parentMode', 'link'); }}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${mode === 'link' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Link Existing Parent
                </button>
                <button
                    onClick={() => { setMode('create'); handleChange('parentMode', 'create'); }}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${mode === 'create' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Create New Parent
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                {mode === 'link' ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Search Parent</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by Mobile, Name, or Parent ID..."
                                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30"
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 italic">
                                Try searching for "Smith" or "98765..."
                            </p>
                        </div>

                        {/* Mock Result */}
                        {searchQuery.length > 2 && (
                            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between group" onClick={() => handleChange('parentId', 'PRT-1001')}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">RS</div>
                                    <div>
                                        <p className="font-bold text-gray-800">Robert Smith</p>
                                        <p className="text-xs text-gray-500">PRT-1001 • 9876543210</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold ${data.parentId === 'PRT-1001' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {data.parentId === 'PRT-1001' ? 'Selected' : 'Select'}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Guardian Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={data.parentName || ''}
                                onChange={(e) => handleChange('parentName', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                value={data.parentMobile || ''}
                                onChange={(e) => handleChange('parentMobile', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                            <input
                                type="email"
                                value={data.parentEmail || ''}
                                onChange={(e) => handleChange('parentEmail', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Relationship to Student <span className="text-red-500">*</span></label>
                    <select
                        value={data.relation || 'Father'}
                        onChange={(e) => handleChange('relation', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default Step2_ParentGuardian;
