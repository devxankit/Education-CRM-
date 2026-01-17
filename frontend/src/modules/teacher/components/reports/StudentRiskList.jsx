import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const StudentRiskList = ({ students }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">At-Risk Students</h3>
                <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded-full">{students.length} Critical</span>
            </div>

            <div className="space-y-3">
                {students.map((student) => (
                    <div key={student.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">{student.name}</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {student.riskFactors.map((factor, idx) => (
                                    <span key={idx} className="text-[10px] font-medium text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                                        {factor}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-indigo-600 p-1">
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                ))}

                {students.length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-400 font-medium">
                        No at-risk students identified. Good job!
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRiskList;
