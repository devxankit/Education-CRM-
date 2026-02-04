
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Link } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';

const Step2_ParentGuardian = ({ data, onChange }) => {
    // data.parentMode: 'link' | 'create'
    const [mode, setMode] = useState(data.parentMode || 'link');
    const [searchQuery, setSearchQuery] = useState('');
    const parents = useAdminStore(state => state.parents);
    const fetchParents = useAdminStore(state => state.fetchParents);

    useEffect(() => {
        if (mode === 'link' && searchQuery.length >= 3) {
            const timer = setTimeout(() => {
                fetchParents(searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, mode, fetchParents]);

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value, parentMode: mode });
    };

    const handleSelectParent = (parent) => {
        onChange({
            ...data,
            parentId: parent._id,
            parentName: parent.name,
            parentMobile: parent.mobile,
            parentEmail: parent.email
        });
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

                        {/* Result List */}
                        {searchQuery.length >= 3 && parents.map((parent) => (
                            <div
                                key={parent._id}
                                className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between group ${data.parentId === parent._id ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200'}`}
                                onClick={() => handleSelectParent(parent)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                                        {parent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{parent.name}</p>
                                        <p className="text-xs text-gray-500">{parent.code} • {parent.mobile}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold ${data.parentId === parent._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {data.parentId === parent._id ? 'Selected' : 'Select'}
                                </div>
                            </div>
                        ))}

                        {searchQuery.length >= 3 && parents.length === 0 && (
                            <div className="text-center py-6 text-gray-500 text-sm">
                                No parents found with this query. Try a different name or mobile.
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
