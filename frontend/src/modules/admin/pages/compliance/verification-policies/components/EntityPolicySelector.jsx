
import React from 'react';
import { Users, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';

const EntityPolicySelector = ({ selectedEntity, onEntityChange }) => {

    // Mapping Icons
    const icons = {
        student: GraduationCap,
        employee: Briefcase,
        parent: Users
    };

    const entities = [
        { id: 'student', label: 'Students' },
        { id: 'employee', label: 'Employees' },
        { id: 'parent', label: 'Parents' }
    ];

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-2 text-gray-500">
                <span className="text-sm font-semibold uppercase tracking-wide">Context:</span>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg">
                {entities.map(ent => {
                    const Icon = icons[ent.id];
                    const isActive = selectedEntity === ent.id;
                    return (
                        <button
                            key={ent.id}
                            onClick={() => onEntityChange(ent.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-700'
                                }
                            `}
                        >
                            <Icon size={16} />
                            {ent.label}
                        </button>
                    );
                })}
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                <span>Filter: All Active Policies</span>
                <ChevronRight size={14} />
            </div>

        </div>
    );
};

export default EntityPolicySelector;
