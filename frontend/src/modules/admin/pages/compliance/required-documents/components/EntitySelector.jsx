
import React from 'react';
import { Users, GraduationCap, Briefcase, UserCheck } from 'lucide-react';

const EntitySelector = ({ selectedEntity, selectedSubType, onEntityChange, onSubTypeChange }) => {

    const entities = [
        { id: 'student', label: 'Student', icon: GraduationCap, subTypes: ['School (K-12)', 'College (Higher Ed)'] },
        { id: 'employee', label: 'Employee', icon: Briefcase, subTypes: ['Teaching Staff', 'Non-Teaching', 'Contractual'] },
        { id: 'parent', label: 'Parent/Guardian', icon: Users, subTypes: ['Primary Guardian', 'Secondary Guardian'] }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Target Entity to Configure</h3>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Main Entity Types */}
                <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
                    {entities.map((entity) => {
                        const Icon = entity.icon;
                        const isSelected = selectedEntity === entity.id;

                        return (
                            <button
                                key={entity.id}
                                onClick={() => onEntityChange(entity.id)}
                                className={`
                                    flex items-center gap-3 px-5 py-3 rounded-lg border transition-all min-w-[160px]
                                    ${isSelected
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                    }
                                `}
                            >
                                <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <Icon size={20} />
                                </div>
                                <span className="font-medium">{entity.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-gray-200"></div>

                {/* Sub Types */}
                <div className="flex items-center gap-3 overflow-x-auto">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Applicable To:</span>
                    {entities.find(e => e.id === selectedEntity)?.subTypes.map((subType) => (
                        <button
                            key={subType}
                            onClick={() => onSubTypeChange(subType)}
                            className={`
                                px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap
                                ${selectedSubType === subType
                                    ? 'bg-slate-800 text-white border-slate-800'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {subType}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EntitySelector;
