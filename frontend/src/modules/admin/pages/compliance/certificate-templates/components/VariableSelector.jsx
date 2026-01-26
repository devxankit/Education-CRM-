
import React from 'react';
import { Plus } from 'lucide-react';

const VariableSelector = ({ entityType, onSelectVariable }) => {

    const variables = {
        STUDENT: [
            { label: 'Student Name', value: '{{student_name}}' },
            { label: 'Admission No', value: '{{admission_no}}' },
            { label: 'Class/Grade', value: '{{class}}' },
            { label: 'Section', value: '{{section}}' },
            { label: 'Roll Number', value: '{{roll_no}}' },
            { label: 'Date of Birth', value: '{{dob}}' },
            { label: 'Father Name', value: '{{father_name}}' },
            { label: 'Academic Year', value: '{{academic_year}}' },
            { label: 'School Name', value: '{{school_name}}' },
            { label: 'Issue Date', value: '{{issue_date}}' }
        ],
        EMPLOYEE: [
            { label: 'Employee Name', value: '{{employee_name}}' },
            { label: 'Employee ID', value: '{{employee_id}}' },
            { label: 'Designation', value: '{{designation}}' },
            { label: 'Department', value: '{{department}}' },
            { label: 'Joining Date', value: '{{joining_date}}' },
            { label: 'School Name', value: '{{school_name}}' },
            { label: 'Issue Date', value: '{{issue_date}}' }
        ]
    };

    const currentVars = variables[entityType] || variables.STUDENT;

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center justify-between">
                Dynamic Variables
                <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">Click to Insert</span>
            </h4>

            <div className="flex flex-wrap gap-2">
                {currentVars.map((v) => (
                    <button
                        key={v.value}
                        onClick={() => onSelectVariable(v.value)}
                        className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                        title={`Insert ${v.label}`}
                    >
                        <Plus size={10} className="text-gray-400 group-hover:text-indigo-500" />
                        <span className="font-mono">{v.value}</span>
                    </button>
                ))}
            </div>

            <p className="text-[10px] text-gray-400 mt-2 italic">
                * Variables will be replaced with actual data during generation.
            </p>
        </div>
    );
};

export default VariableSelector;
