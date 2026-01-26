import React from 'react';

const WorkflowConfigPanel = ({ values, onChange }) => {
    return (
        <div className="space-y-6">

            {/* Attendance Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Attendance Mode</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                        value={values.attendanceMode}
                        onChange={(e) => onChange('attendanceMode', e.target.value)}
                    >
                        <option value="daily">Daily (Once per day)</option>
                        <option value="subject_wise">Subject-wise (Per period)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Determines how teachers mark attendance.</p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Attendance Record Locking</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                        value={values.attendanceLocking}
                        onChange={(e) => onChange('attendanceLocking', e.target.value)}
                    >
                        <option value="same_day">Lock Immediately (Same Day)</option>
                        <option value="end_of_day">Lock at Midnight</option>
                        <option value="flexible">Flexible (Teachers can edit past 7 days)</option>
                    </select>
                </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Exam Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Evaluation Mode</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                        value={values.evaluationMode}
                        onChange={(e) => onChange('evaluationMode', e.target.value)}
                    >
                        <option value="marks">Marks Only (e.g. 85/100)</option>
                        <option value="grades">Grades Only (A, B, C)</option>
                        <option value="mixed">Mixed (Marks converts to Grade)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Result Publishing Workflow</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="resultPublishing"
                                value="manual"
                                checked={values.resultPublishing === 'manual'}
                                onChange={() => onChange('resultPublishing', 'manual')}
                                className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Manual (Admin publishes explicitly)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="resultPublishing"
                                value="auto"
                                checked={values.resultPublishing === 'auto'}
                                onChange={() => onChange('resultPublishing', 'auto')}
                                className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Auto (Immediate after approval)</span>
                        </label>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default WorkflowConfigPanel;
