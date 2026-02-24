
import React, { useState } from 'react';
import { Target } from 'lucide-react';

const AudienceSelector = ({ selectedAudiences, onUpdate }) => {

    // Mocks - Same data structure as Notices but isolated component
    const audienceTypes = [
        { id: 'STUDENT', label: 'Students', count: 1240 },
        { id: 'PARENT', label: 'Parents', count: 1150 },
        { id: 'TEACHER', label: 'Teachers', count: 85 },
        { id: 'STAFF', label: 'Staff', count: 42 }
    ];

    const filters = {
        Classes: ['Class 10', 'Class 11', 'Class 12'],
        Sections: ['A', 'B', 'C'],
        Departments: ['Science', 'Commerce', 'Arts']
    };

    const toggleAudience = (id) => {
        if (selectedAudiences.includes(id)) {
            onUpdate(selectedAudiences.filter(a => a !== id));
        } else {
            onUpdate([...selectedAudiences, id]);
        }
    };

    return (
        <div className="space-y-4">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {audienceTypes.map(aud => {
                    const isSelected = selectedAudiences.includes(aud.id);
                    return (
                        <div
                            key={aud.id}
                            onClick={() => toggleAudience(aud.id)}
                            className={`
                                cursor-pointer p-3 rounded-lg border transition-all text-center
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }
                            `}
                        >
                            <div className="font-bold text-sm mb-0.5">{aud.label}</div>
                            <div className="text-[10px] opacity-80">{aud.count} Users</div>
                        </div>
                    );
                })}
            </div>

            {/* Refine Audience box intentionally removed as per requirements */}
        </div>
    );
};

export default AudienceSelector;
