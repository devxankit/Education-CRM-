
import React from 'react';
import { Shield, Ban } from 'lucide-react';

const ConflictRules = ({ ruleData, onChange, isLocked }) => {

    // Toggle Helper
    const Toggle = ({ name, checked, onChange, label, description }) => (
        <div className="flex items-start justify-between py-3">
            <div>
                <h4 className="text-sm font-semibold text-gray-800">{label}</h4>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => onChange(name, e.target.checked)}
                    disabled={isLocked}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 disabled:opacity-60"></div>
            </label>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Shield size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Conflict Prevention Policies</h2>
            </div>

            <div className="p-6 divide-y divide-gray-100">
                <Toggle
                    name="preventTeacherOverlap"
                    checked={ruleData.preventTeacherOverlap}
                    onChange={onChange}
                    label="Strict Teacher Overlap Check"
                    description="Prevents assigning a teacher to multiple classes at the same time."
                />
                <Toggle
                    name="preventRoomOverlap"
                    checked={ruleData.preventRoomOverlap}
                    onChange={onChange}
                    label="Strict Classroom Conflict Check"
                    description="Ensures two classes are not scheduled in the same room simultaneously."
                />
                <Toggle
                    name="preventStudentOverlap"
                    checked={ruleData.preventStudentOverlap}
                    onChange={onChange}
                    label="Elective/Subject Overlap Check"
                    description="Checks if student has opted for conflicting elective subjects."
                />
                <Toggle
                    name="allowExamOverride"
                    checked={ruleData.allowExamOverride}
                    onChange={onChange}
                    label="Allow Exam Day Override"
                    description="If enabled, Exam schedule can overwrite regular timetable slots."
                />
            </div>
        </div>
    );
};

export default ConflictRules;
