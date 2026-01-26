
import React from 'react';
import { Plus } from 'lucide-react';

const VariablePicker = ({ category, onSelectVariable }) => {

    // Mocks for variables based on category
    const getVariables = (cat) => {
        const common = [
            { id: 'student_name', label: 'Student Name' },
            { id: 'class_section', label: 'Class/Section' },
            { id: 'school_name', label: 'School Name' }
        ];

        const specific = {
            'FEES': [{ id: 'due_amount', label: 'Due Amount' }, { id: 'due_date', label: 'Due Date' }, { id: 'invoice_no', label: 'Invoice No' }],
            'ATTENDANCE': [{ id: 'absent_date', label: 'Absent Date' }, { id: 'attendance_percentage', label: 'Attendance %' }],
            'EXAMS': [{ id: 'exam_name', label: 'Exam Name' }, { id: 'result_link', label: 'Result Link' }],
            'DOCUMENTS': [{ id: 'doc_name', label: 'Document Name' }, { id: 'expiry_date', label: 'Expiry Date' }],
            'EMERGENCY': [{ id: 'emergency_reason', label: 'Reason' }, { id: 'action_required', label: 'Action Required' }]
        };

        return [...common, ...(specific[category] || [])];
    };

    const variables = getVariables(category);

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex justify-between items-center">
                Available Variables
                <span className="bg-gray-200 px-1 rounded text-gray-600">Click to add</span>
            </h4>
            <div className="flex flex-wrap gap-2">
                {variables.map(v => (
                    <button
                        key={v.id}
                        onClick={() => onSelectVariable(`{{${v.id}}}`)}
                        className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
                        title={`Insert {{${v.id}}}`}
                    >
                        <Plus size={10} />
                        {v.id}
                    </button>
                ))}
            </div>
            {variables.length === 0 && <span className="text-xs text-gray-400 italic">No variables available for this category.</span>}
        </div>
    );
};

export default VariablePicker;
