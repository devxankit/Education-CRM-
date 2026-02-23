
import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Search, ChevronDown, X } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';

const Step2_ParentGuardian = ({ data, onChange }) => {
    const [mode, setMode] = useState(data.parentMode || 'link');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searching, setSearching] = useState(false);
    const dropdownRef = useRef(null);

    const parents = useAdminStore(state => state.parents);
    const fetchParents = useAdminStore(state => state.fetchParents);

    const selectedParent = parents.find(p => p._id === data.parentId) || (data.parentId && data.parentName ? { name: data.parentName, mobile: data.parentMobile, code: '' } : null);

    useEffect(() => {
        if (mode === 'link') {
            if (searchQuery.length >= 2) {
                setSearching(true);
                const timer = setTimeout(() => {
                    fetchParents(searchQuery);
                    setSearching(false);
                }, 400);
                return () => clearTimeout(timer);
            } else if (isDropdownOpen && searchQuery.length === 0) {
                fetchParents('');
            }
        }
    }, [searchQuery, mode, isDropdownOpen, fetchParents]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        setSearchQuery('');
        setIsDropdownOpen(false);
    };

    const handleClearParent = (e) => {
        e.stopPropagation();
        onChange({ ...data, parentId: '', parentName: '', parentMobile: '', parentEmail: '' });
        setSearchQuery('');
        setIsDropdownOpen(true);
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
             
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                {mode === 'link' ? (
                    <div className="space-y-4">
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Search Parent</label>
                            <div
                                className={`flex items-center gap-2 w-full pl-3 pr-2 py-2.5 border rounded-lg outline-none bg-white transition-all cursor-text min-h-[42px] ${
                                    isDropdownOpen ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onClick={() => setIsDropdownOpen(true)}
                            >
                                <Search className="text-gray-400 shrink-0" size={18} />
                                {selectedParent ? (
                                    <span className="flex-1 text-sm text-gray-800 truncate">
                                        {selectedParent.name}
                                        {selectedParent.mobile && <span className="text-gray-500"> • {selectedParent.mobile}</span>}
                                    </span>
                                ) : (
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        placeholder="Search by Mobile, Name, or Parent ID..."
                                        className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                                    />
                                )}
                                {selectedParent ? (
                                    <button
                                        type="button"
                                        onClick={handleClearParent}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                                        title="Clear"
                                    >
                                        <X size={16} />
                                    </button>
                                ) : (
                                    <ChevronDown className={`text-gray-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                                )}
                            </div>

                            {/* Dropdown with search results */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                                    {searching || (searchQuery.length < 2 && parents.length === 0) ? (
                                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                            {searching ? 'Searching...' : 'Type 2+ characters to search'}
                                        </div>
                                    ) : parents.length > 0 ? (
                                        parents.map((parent) => (
                                            <button
                                                key={parent._id}
                                                type="button"
                                                onClick={() => handleSelectParent(parent)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left ${
                                                    data.parentId === parent._id ? 'bg-indigo-50' : ''
                                                }`}
                                            >
                                                <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                                    {(parent.name || 'P').charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-gray-800 truncate">{parent.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{parent.code || ''} • {parent.mobile || 'N/A'}</p>
                                                </div>
                                                {data.parentId === parent._id && (
                                                    <span className="text-xs font-bold text-green-600 shrink-0">✓ Selected</span>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                            No parents found. Try a different search.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 italic">
                            Select a parent from the dropdown or type to search by name, mobile, or ID
                        </p>
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
