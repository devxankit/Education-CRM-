import React from 'react';
import { ChevronRight, Calendar, FileText } from 'lucide-react';
import { format, isValid } from 'date-fns';

const ExamListCards = ({ exams, onSelect }) => {
    if (!exams || exams.length === 0) return null;

    const formatDateRange = (start, end) => {
        const s = start ? new Date(start) : null;
        const e = end ? new Date(end) : null;
        if (!s || isNaN(s.getTime())) return '—';
        if (!e || isNaN(e.getTime())) return format(s, 'd MMM yyyy');
        return `${format(s, 'd MMM')} – ${format(e, 'd MMM yyyy')}`;
    };

    return (
        <div className="space-y-3">
            {exams.map((exam) => {
                const papersCount = (exam.subjects || []).length;
                return (
                    <button
                        key={exam.id}
                        onClick={() => onSelect(exam)}
                        className="w-full bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-purple-100 transition-all text-left flex items-center justify-between gap-4 active:scale-[0.99]"
                    >
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                                <FileText size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{exam.name}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {exam.examType && `${exam.examType} • `}
                                    {papersCount} paper{papersCount !== 1 ? 's' : ''}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                    <Calendar size={12} />
                                    {formatDateRange(exam.startDate, exam.endDate)}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 shrink-0" />
                    </button>
                );
            })}
        </div>
    );
};

export default ExamListCards;
