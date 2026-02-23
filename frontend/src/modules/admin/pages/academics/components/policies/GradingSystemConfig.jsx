import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useExamPolicyStore } from '../../../../../../store/examPolicyStore';

const GradingSystemConfig = ({ isLocked }) => {
    const { policy } = useExamPolicyStore();
    const gradingScale = policy?.gradingScale || [];

    const handleGradeChange = (index, field, value) => {
        if (isLocked) return;
        const newScale = [...gradingScale];
        const row = { ...newScale[index] };
        if (field === 'label') {
            row[field] = String(value).toUpperCase();
        } else {
            row[field] = (field === 'minPercentage' || field === 'maxPercentage' || field === 'gradePoints') ? (Number(value) || 0) : value;
        }
        newScale[index] = row;
        useExamPolicyStore.setState({
            policy: { ...policy, gradingScale: newScale }
        });
    };

    const handleAddGrade = () => {
        if (isLocked) return;
        const newGrade = { label: '', minPercentage: '', maxPercentage: '', gradePoints: '' };
        useExamPolicyStore.setState({
            policy: { ...policy, gradingScale: [...gradingScale, newGrade] }
        });
    };

    const handleRemoveGrade = (index) => {
        if (isLocked) return;
        const newScale = gradingScale.filter((_, i) => i !== index);
        useExamPolicyStore.setState({
            policy: { ...policy, gradingScale: newScale }
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Grading Scale</h3>
                <p className="text-sm text-gray-500">Map percentage ranges to Letter Grades and GPA Points.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Visualizer */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase">Scale Preview</h4>
                    <div className="space-y-2">
                        {gradingScale.map((g, i) => (
                            <div key={i} className="flex overflow-hidden rounded-md h-8 text-xs font-semibold">
                                <div className="w-16 bg-white border border-gray-300 flex items-center justify-center text-gray-800">
                                    {g.label || '---'}
                                </div>
                                <div className="flex-1 bg-white border-y border-r border-gray-300 flex items-center px-4 justify-between text-gray-600">
                                    <span>{(g.minPercentage === '' ? 0 : g.minPercentage)}% - {(g.maxPercentage === '' ? 0 : g.maxPercentage)}%</span>
                                    <span className="text-gray-400 font-mono">{(g.gradePoints === '' ? 0 : g.gradePoints)} pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div>
                    <table className="w-full text-left border-collapse border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-2 border-b">Grade</th>
                                <th className="px-4 py-2 border-b">Min %</th>
                                <th className="px-4 py-2 border-b">Max %</th>
                                <th className="px-4 py-2 border-b">Points</th>
                                <th className="px-4 py-2 border-b w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {gradingScale.map((g, i) => (
                                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="text" value={g.label}
                                            disabled={isLocked}
                                            placeholder="A+"
                                            onChange={(e) => handleGradeChange(i, 'label', e.target.value)}
                                            className="w-12 px-1 py-1 border border-gray-300 rounded text-center text-xs font-bold text-indigo-700 uppercase disabled:bg-transparent disabled:border-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number" value={g.minPercentage ?? ''}
                                            disabled={isLocked}
                                            onChange={(e) => handleGradeChange(i, 'minPercentage', e.target.value)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-xs disabled:bg-transparent disabled:border-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number" value={g.maxPercentage ?? ''}
                                            disabled={isLocked}
                                            onChange={(e) => handleGradeChange(i, 'maxPercentage', e.target.value)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-xs disabled:bg-transparent disabled:border-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number" value={g.gradePoints ?? ''}
                                            disabled={isLocked}
                                            onChange={(e) => handleGradeChange(i, 'gradePoints', e.target.value)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-xs bg-gray-50 disabled:bg-transparent disabled:border-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {!isLocked && (
                                            <button
                                                onClick={() => handleRemoveGrade(i)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isLocked && (
                        <button
                            onClick={handleAddGrade}
                            className="mt-4 flex items-center gap-2 text-indigo-600 text-xs font-bold hover:underline"
                        >
                            <Plus size={14} /> Add New Grade
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default GradingSystemConfig;
