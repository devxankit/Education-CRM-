
import React, { useState } from 'react';

const GradingSystemConfig = ({ isLocked }) => {

    const [grades, setGrades] = useState([
        { label: 'A+', min: 90, max: 100, points: 10 },
        { label: 'A', min: 80, max: 89, points: 9 },
        { label: 'B+', min: 70, max: 79, points: 8 },
        { label: 'B', min: 60, max: 69, points: 7 },
        { label: 'C', min: 50, max: 59, points: 6 },
        { label: 'D', min: 40, max: 49, points: 5 },
        { label: 'F', min: 0, max: 39, points: 0 },
    ]);

    const handleGradeChange = (index, field, value) => {
        if (isLocked) return;
        const newGrades = [...grades];
        newGrades[index][field] = value;
        setGrades(newGrades);
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
                        {grades.map((g, i) => (
                            <div key={i} className="flex overflow-hidden rounded-md h-8 text-xs font-semibold">
                                <div className="w-16 bg-white border border-gray-300 flex items-center justify-center text-gray-800">
                                    {g.label}
                                </div>
                                <div className="flex-1 bg-white border-y border-r border-gray-300 flex items-center px-4 justify-between text-gray-600">
                                    <span>{g.min}% - {g.max}%</span>
                                    <span className="text-gray-400 font-mono">{g.points} pts</span>
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
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {grades.map((g, i) => (
                                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="px-4 py-2 font-bold text-indigo-700">{g.label}</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number" value={g.min}
                                            disabled={isLocked}
                                            onChange={(e) => handleGradeChange(i, 'min', e.target.value)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-xs"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number" value={g.max}
                                            disabled={isLocked}
                                            onChange={(e) => handleGradeChange(i, 'max', e.target.value)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-xs"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number" value={g.points}
                                            disabled={isLocked}
                                            onChange={(e) => handleGradeChange(i, 'points', e.target.value)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-xs bg-gray-50"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default GradingSystemConfig;
