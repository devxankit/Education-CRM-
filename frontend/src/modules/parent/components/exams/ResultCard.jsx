
import React from 'react';
import { Award, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

const ResultCard = ({ exam, onClick, isHighlighted }) => {
    const isPassed = exam.status === 'Passed';

    return (
        <div
            onClick={onClick}
            className={`group bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${isHighlighted ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-100 hover:border-indigo-100'
                }`}
        >
            {isHighlighted && (
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            )}

            <div className="flex justify-between items-start mb-3 pl-2">
                <div>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded mb-1 uppercase tracking-wide">
                        {exam.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {exam.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">{exam.date}</p>
                </div>
                <div className={`p-2 rounded-full ${isPassed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {isPassed ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2 pl-2">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Overall</p>
                    <p className="text-xl font-extrabold text-indigo-900">{exam.overall}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Grade</p>
                    <p className={`text-xl font-extrabold ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>{exam.grade}</p>
                </div>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <ChevronRight className="text-indigo-300" />
            </div>
        </div>
    );
};

export default ResultCard;
