import React, { useMemo } from 'react';
import { Calendar, Clock, BookOpen, MapPin, ArrowLeft } from 'lucide-react';
import { format, isValid } from 'date-fns';

/**
 * ExamTimetable - Displays scheduled exams as cards
 * Flattens exam subjects into cards sorted by date and time
 */
const ExamTimetable = ({ exams, examName, onBack }) => {
    const timetableRows = useMemo(() => {
        const rows = [];
        (exams || []).forEach((exam) => {
            (exam.subjects || []).forEach((sub) => {
                const dateVal = sub.date || exam.startDate;
                const dateObj = dateVal ? (dateVal instanceof Date ? dateVal : new Date(dateVal)) : null;
                rows.push({
                    id: `${exam.id}_${sub.id || sub.name || Math.random()}`,
                    examName: exam.name,
                    examType: exam.examType || '',
                    subjectName: sub.name,
                    date: dateObj,
                    startTime: sub.startTime || '—',
                    endTime: sub.endTime || '—',
                    timeStr: [sub.startTime, sub.endTime].filter(Boolean).join(' – ') || '—',
                    room: sub.room || 'N/A',
                    maxMarks: sub.maxMarks,
                });
            });
        });
        rows.sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            const d = a.date.getTime() - b.date.getTime();
            if (d !== 0) return d;
            return (a.startTime || '').localeCompare(b.startTime || '');
        });
        return rows;
    }, [exams]);

    if (timetableRows.length === 0) return null;

    const uniqueExams = new Set(timetableRows.map((r) => r.examName)).size;
    const formatDate = (d) => {
        if (!d || !isValid(d)) return '—';
        return format(d, 'EEE, d MMM yyyy');
    };

    return (
        <div className="space-y-4">
            {onBack && (
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 mb-2"
                >
                    <ArrowLeft size={18} />
                    Back to exams
                </button>
            )}
            {examName && (
                <h3 className="text-base font-bold text-gray-900">{examName} – Timetable</h3>
            )}
            <p className="text-xs font-medium text-gray-500">
                {uniqueExams} exam{uniqueExams !== 1 ? 's' : ''} • {timetableRows.length} paper{timetableRows.length !== 1 ? 's' : ''} scheduled
            </p>
            <div className="space-y-3">
                {timetableRows.map((row) => (
                    <div
                        key={row.id}
                        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                                    <BookOpen size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{row.subjectName}</h3>
                                    <p className="text-xs text-gray-500">
                                        {row.examName}
                                        {row.examType && ` • ${row.examType}`}
                                        {row.maxMarks != null && ` • ${row.maxMarks}M`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={14} className="text-purple-500 shrink-0" />
                                <span>{formatDate(row.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock size={14} className="text-purple-500 shrink-0" />
                                <span>{row.timeStr}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={14} className="text-purple-500 shrink-0" />
                                <span>Room {row.room}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExamTimetable;
