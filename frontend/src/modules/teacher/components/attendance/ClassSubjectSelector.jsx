import React from 'react';
import { ChevronDown } from 'lucide-react';

const ClassSubjectSelector = ({ classes, selectedClass, onClassChange }) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select Class & Subject</label>
            <div className="relative">
                <select
                    value={selectedClass?.id || ''}
                    onChange={(e) => {
                        const cls = classes.find(c => c.id === e.target.value);
                        onClassChange(cls);
                    }}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow cursor-pointer"
                >
                    <option value="" disabled>Choose assigned class...</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name} • {cls.subject}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
    );
};

export default ClassSubjectSelector;
