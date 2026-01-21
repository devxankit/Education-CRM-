
import React, { useState } from 'react';
import { Trash2, AlertCircle, Plus } from 'lucide-react';

const ExamTypesConfig = ({ isLocked }) => {

    // Mock Data
    const [examTypes, setExamTypes] = useState([
        { id: 1, name: 'Unit Test 1', weightage: 10, marks: 25, included: true },
        { id: 2, name: 'Mid Term Exam', weightage: 30, marks: 100, included: true },
        { id: 3, name: 'Unit Test 2', weightage: 10, marks: 25, included: true },
        { id: 4, name: 'Final Annual Exam', weightage: 50, marks: 100, included: true }
    ]);

    const handleChange = (id, field, value) => {
        if (isLocked) return;
        setExamTypes(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const totalWeight = examTypes.reduce((sum, item) => item.included ? sum + Number(item.weightage) : sum, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Evaluation Components</h3>
                    <p className="text-sm text-gray-500">Define the constituent exams for the academic year.</p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${totalWeight === 100 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    Total Weightage: {totalWeight}%
                    {totalWeight !== 100 && <span className="block text-[10px] font-normal">Must equal 100%</span>}
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-5 py-3 border-b">Exam Name</th>
                            <th className="px-5 py-3 border-b text-center w-32">Max Marks</th>
                            <th className="px-5 py-3 border-b text-center w-32">Weightage %</th>
                            <th className="px-5 py-3 border-b text-center w-32">Included?</th>
                            <th className="px-5 py-3 border-b w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {examTypes.map((exam) => (
                            <tr key={exam.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3">
                                    <input
                                        type="text"
                                        value={exam.name}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(exam.id, 'name', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                </td>
                                <td className="px-5 py-3">
                                    <input
                                        type="number"
                                        value={exam.marks}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(exam.id, 'marks', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                </td>
                                <td className="px-5 py-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={exam.weightage}
                                            disabled={isLocked || !exam.included}
                                            onChange={(e) => handleChange(exam.id, 'weightage', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100 disabled:text-gray-400 font-bold text-gray-700"
                                        />
                                        <span className="absolute right-2 top-1.5 text-xs text-gray-400">%</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={exam.included}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(exam.id, 'included', e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer disabled:cursor-not-allowed"
                                    />
                                </td>
                                <td className="px-5 py-3 text-right">
                                    {!isLocked && (
                                        <button className="text-gray-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isLocked && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                        <button className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:underline">
                            <Plus size={16} /> Add Examination Type
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-3 bg-blue-50 p-4 rounded-lg text-xs text-blue-800 border border-blue-100">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>Weightage defines how much the exam contributes to the Final GPA/Score. Set to 0% for practice exams.</p>
            </div>
        </div>
    );
};

export default ExamTypesConfig;
