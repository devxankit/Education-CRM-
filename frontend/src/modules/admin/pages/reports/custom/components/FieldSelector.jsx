import React, { useMemo } from 'react';
import { CheckSquare, Lock } from 'lucide-react';

// MOCK SCHEMAS
const SCHEMAS = {
    students: [
        {
            id: 'personal', label: 'Personal Info', fields: [
                { id: 'name', label: 'Student Name', type: 'text', mandatory: true },
                { id: 'dob', label: 'Date of Birth', type: 'date' },
                { id: 'gender', label: 'Gender', type: 'select' },
                { id: 'blood_group', label: 'Blood Group', type: 'text' }
            ]
        },
        {
            id: 'academic', label: 'Academic Info', fields: [
                { id: 'class', label: 'Class', type: 'text', mandatory: true },
                { id: 'section', label: 'Section', type: 'text' },
                { id: 'roll_no', label: 'Roll No', type: 'number' },
                { id: 'admission_no', label: 'Admission No', type: 'text', unique: true }
            ]
        },
        {
            id: 'contact', label: 'Contact Details', fields: [
                { id: 'parent_name', label: 'Parent Name', type: 'text' },
                { id: 'phone', label: 'Phone Number', type: 'phone', sensitive: true },
                { id: 'email', label: 'Email Address', type: 'email', sensitive: true },
                { id: 'address', label: 'Home Address', type: 'text', sensitive: true }
            ]
        }
    ],
    fees: [
        {
            id: 'txn', label: 'Transaction', fields: [
                { id: 'txn_id', label: 'Transaction ID', type: 'text', mandatory: true },
                { id: 'date', label: 'Payment Date', type: 'date', mandatory: true },
                { id: 'amount', label: 'Amount', type: 'currency', mandatory: true },
                { id: 'mode', label: 'Payment Mode', type: 'select' }
            ]
        },
        {
            id: 'details', label: 'Fee Details', fields: [
                { id: 'student_name', label: 'Student', type: 'text' },
                { id: 'fee_head', label: 'Fee Category', type: 'text' },
                { id: 'status', label: 'Status', type: 'status' }
            ]
        }
    ],
    // Default fallback
    default: [
        {
            id: 'general', label: 'General Fields', fields: [
                { id: 'id', label: 'ID', type: 'text' },
                { id: 'name', label: 'Name', type: 'text' },
                { id: 'date', label: 'Date', type: 'date' },
                { id: 'status', label: 'Status', type: 'text' }
            ]
        }
    ]
};

const FieldSelector = ({ source, selectedFields, onToggle }) => {

    const schema = SCHEMAS[source] || SCHEMAS.default;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Select Data Fields</h3>
                <p className="text-sm text-gray-500">Choose the columns you want to include in your report. Sensitive fields are marked with a lock icon and may be masked in the output.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schema.map((group) => (
                    <div key={group.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{group.label}</h4>
                        </div>
                        <div className="p-2">
                            {group.fields.map((field) => {
                                const isChecked = selectedFields.includes(field.id);
                                return (
                                    <label
                                        key={field.id}
                                        className={`
                                            flex items-center justify-between p-2 rounded cursor-pointer transition-colors
                                            ${isChecked ? 'bg-indigo-50' : 'hover:bg-gray-50'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-4 h-4 rounded border flex items-center justify-center transition-colors
                                                ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}
                                            `}>
                                                {isChecked && <CheckSquare size={12} className="text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isChecked}
                                                onChange={() => onToggle(field.id)}
                                                disabled={field.mandatory} // Mandatory fields might be locked to checked
                                            />
                                            <span className={`text-sm ${isChecked ? 'text-indigo-900 font-medium' : 'text-gray-600'}`}>
                                                {field.label} {field.mandatory && <span className="text-red-500">*</span>}
                                            </span>
                                        </div>
                                        {field.sensitive && <Lock size={12} className="text-amber-500" title="Sensitive Data" />}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded border border-blue-100 flex items-center gap-2">
                <Lock size={14} />
                <span><strong>Note:</strong> Some fields are restricted based on your role privileges. Field masking rules will apply to the final export.</span>
            </div>
        </div>
    );
};

export default FieldSelector;
