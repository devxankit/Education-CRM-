import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

const AcademicDefaultsForm = ({ values, onChange }) => {
    return (
        <div className="space-y-6">

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p>
                    <strong>Note:</strong> Changing the Academic Year or Structure may affect active gradebooks, attendance registers, and timetables. A full system re-calculation will occur upon saving.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-bold text-gray-800 mb-4">Current Academic Year</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                        value={values.academicYear}
                        onChange={(e) => onChange('academicYear', e.target.value)}
                    >
                        <option value="2024-2025">2024 - 2025 (Current)</option>
                        <option value="2025-2026">2025 - 2026 (Upcoming)</option>
                        <option value="2023-2024">2023 - 2024 (Past)</option>
                    </select>
                </div>

                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-bold text-gray-800 mb-4">Academic Structure</label>
                    <div className="flex gap-4">
                        <label className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition-all ${values.structure === 'Annual' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="structure"
                                value="Annual"
                                className="hidden"
                                checked={values.structure === 'Annual'}
                                onChange={() => onChange('structure', 'Annual')}
                            />
                            Annual (Term-wise)
                        </label>
                        <label className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition-all ${values.structure === 'Semester' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="structure"
                                value="Semester"
                                className="hidden"
                                checked={values.structure === 'Semester'}
                                onChange={() => onChange('structure', 'Semester')}
                            />
                            Semester System
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Start Month</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                        value={values.startMonth}
                        onChange={(e) => onChange('startMonth', e.target.value)}
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Active Term</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                        value={values.defaultTerm}
                        onChange={(e) => onChange('defaultTerm', e.target.value)}
                    >
                        <option value="Term 1">Term 1 (or Sem 1)</option>
                        <option value="Term 2">Term 2 (or Sem 2)</option>
                        <option value="Term 3">Term 3</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default AcademicDefaultsForm;
