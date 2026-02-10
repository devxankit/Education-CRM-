import React from 'react';
import { Trash2, AlertCircle, Plus } from 'lucide-react';
import { useExamPolicyStore } from '../../../../../../store/examPolicyStore';

const ExamTypesConfig = ({ isLocked }) => {
    const { policy, savePolicy } = useExamPolicyStore();
    const examTypes = policy?.examTypes || [];

    const handleChange = (index, field, value) => {
        if (isLocked) return;
        const updatedExamTypes = [...examTypes];
        updatedExamTypes[index] = { ...updatedExamTypes[index], [field]: value };
        useExamPolicyStore.setState({
            policy: { ...policy, examTypes: updatedExamTypes }
        });
    };

    const handleAdd = () => {
        if (isLocked) return;
        const newType = {
            name: '',
            weightage: 0,
            maxMarks: 100,
            isIncluded: true
        };
        useExamPolicyStore.setState({
            policy: { ...policy, examTypes: [...examTypes, newType] }
        });
    };

    const handleRemove = (index) => {
        if (isLocked) return;
        const updatedExamTypes = examTypes.filter((_, i) => i !== index);
        useExamPolicyStore.setState({
            policy: { ...policy, examTypes: updatedExamTypes }
        });
    };

    const totalWeight = examTypes.reduce((sum, item) => item.isIncluded ? sum + Number(item.weightage) : sum, 0);

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
                        {examTypes.map((exam, index) => (
                            <tr key={exam._id || index} className="hover:bg-gray-50">
                                <td className="px-5 py-3">
                                    <input
                                        type="text"
                                        value={exam.name}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        placeholder="Enter exam name (e.g. Unit Test 1)"
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                </td>
                                <td className="px-5 py-3">
                                    <input
                                        type="number"
                                        value={exam.maxMarks}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(index, 'maxMarks', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                </td>
                                <td className="px-5 py-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={exam.weightage}
                                            disabled={isLocked || !exam.isIncluded}
                                            onChange={(e) => handleChange(index, 'weightage', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100 disabled:text-gray-400 font-bold text-gray-700"
                                        />
                                        <span className="absolute right-2 top-1.5 text-xs text-gray-400">%</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={exam.isIncluded}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(index, 'isIncluded', e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer disabled:cursor-not-allowed"
                                    />
                                </td>
                                <td className="px-5 py-3 text-right">
                                    {!isLocked && (
                                        <button
                                            onClick={() => handleRemove(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
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
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:underline"
                        >
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
